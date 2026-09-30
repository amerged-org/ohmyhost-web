import { marked } from "marked";

import { SITE_ORIGIN } from "../site-identity.js";
import type { ContentSource } from "./tree.js";

export interface BrokenContentLink {
  readonly source: string;
  readonly href: string;
  readonly target: string;
  readonly reason: "missing" | "draft";
}

export interface ContentLinkReport {
  readonly brokenLinks: readonly BrokenContentLink[];
  readonly incoming: ReadonlyMap<string, readonly string[]>;
  readonly unlinkedArticles: readonly string[];
}

/** Render before reading anchors: Markdown examples in code are not links. */
function bodyLinks(markdown: string): Map<string, boolean> {
  const body = marked
    .parse(markdown, { async: false })
    .replaceAll(/<!--[\s\S]*?-->/gu, "")
    .replaceAll(
      /<(pre|code|script|style|nav|footer|template)\b[^>]*>[\s\S]*?<\/\1\s*>/giu,
      "",
    );
  const links = new Map<string, boolean>();
  for (const [, attributes = "", label = ""] of body.matchAll(
    /<a\b([^>]*)>([\s\S]*?)<\/a\s*>/giu,
  )) {
    const hasText = Boolean(
      label
        .replaceAll(/<svg\b[^>]*>[\s\S]*?<\/svg\s*>/giu, "")
        .replaceAll(/<[^>]*>/gu, "")
        .trim(),
    );
    const href = attributes.match(
      /(?:^|\s)href\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/iu,
    );
    if (!href) continue;
    const destination = decodeAttribute(href[1] ?? href[2] ?? href[3] ?? "");
    // Validate every anchor, but only text links provide an editorial reading path.
    // A repeated image link must not hide a text link to the same destination.
    links.set(destination, hasText || links.get(destination) === true);
  }
  return links;
}

function decodeAttribute(value: string): string {
  return value.replaceAll(
    /&(?:amp|quot|apos|#\d+|#x[\da-f]+);/giu,
    (entity) => {
      if (entity.toLowerCase() === "&amp;") return "&";
      if (entity.toLowerCase() === "&quot;") return '"';
      if (entity.toLowerCase() === "&apos;") return "'";
      const numeric = entity.slice(2, -1);
      const point = numeric.toLowerCase().startsWith("x")
        ? Number.parseInt(numeric.slice(1), 16)
        : Number.parseInt(numeric, 10);
      return point > 0 && point <= 0x10ffff
        ? String.fromCodePoint(point)
        : "\uFFFD";
    },
  );
}

function internalTarget(href: string, source: string): string | null {
  if (!href.trim()) return null;
  try {
    const url = new URL(href, `${SITE_ORIGIN}${source}`);
    if (url.origin !== SITE_ORIGIN) return null;
    return url.pathname.replace(/\/$/u, "") || "/";
  } catch {
    return null;
  }
}

/** Audit authored bodies only; generated indexes, breadcrumbs and the site frame never count. */
export function auditContentLinks(
  pages: readonly ContentSource[],
  isAdditionalTarget: (path: string) => boolean = () => false,
): ContentLinkReport {
  const authored = new Map(pages.map((page) => [page.path, page]));
  const incoming = new Map<string, string[]>();
  for (const page of pages)
    if (page.status === "published" && page.kind === "article")
      incoming.set(page.path, []);

  const brokenLinks: BrokenContentLink[] = [];
  for (const source of pages) {
    if (source.status !== "published") continue;
    for (const [href, hasText] of bodyLinks(source.markdown)) {
      const target = internalTarget(href, source.path);
      if (target === null) continue;
      // Markdown mirrors are valid destinations, but incoming article coverage requires HTML.
      const page =
        authored.get(target) ??
        (target.endsWith(".md")
          ? authored.get(target.slice(0, -3))
          : undefined);
      if (page?.status === "draft" || (!page && !isAdditionalTarget(target))) {
        brokenLinks.push({
          source: source.path,
          href,
          target,
          reason: page?.status === "draft" ? "draft" : "missing",
        });
        continue;
      }
      const sources = incoming.get(target);
      if (
        hasText &&
        sources &&
        source.path !== target &&
        source.path !== "/blog" &&
        !sources.includes(source.path)
      )
        sources.push(source.path);
    }
  }
  return {
    brokenLinks,
    incoming,
    unlinkedArticles: [...incoming]
      .filter(([, sources]) => sources.length === 0)
      .map(([path]) => path),
  };
}
