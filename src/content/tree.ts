import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import type { ContentPage, PageKind } from "./types.js";
import { schemaDate } from "../site-identity.js";

const PAGE_KINDS = new Set<PageKind>([
  "page",
  "article",
  "howto",
  "about",
  "collection",
]);
const PAGE_STATUS = new Set(["published", "draft"]);

/** One page as it is written in the content tree, before its tokens are resolved. */
export interface ContentSource
  extends Omit<ContentPage, "ogImage" | "ogImageAlt"> {
  readonly status: "published" | "draft";
  readonly social?: {
    readonly image?: string | null;
    readonly alt?: string | null;
  };
}

/** Every page folder under `content/`, as its URL. The folder path is the URL. */
export function pageFolders(
  base: string,
): Array<{ url: string; directory: string }> {
  const found: Array<{ url: string; directory: string }> = [];
  const walk = (directory: string, url: string): void => {
    for (const entry of readdirSync(directory).sort()) {
      if (entry === "data") continue;
      const next = join(directory, entry);
      if (!statSync(next).isDirectory()) continue;
      const nextUrl = `${url}/${entry}`;
      if (readdirSync(next).includes("page.json"))
        found.push({ url: nextUrl, directory: next });
      walk(next, nextUrl);
    }
  };
  walk(base, "");
  return found;
}

/** Reads and checks one `page.json`; an article must name its author and publication date. */
export function readPage(directory: string, url: string): ContentSource {
  const meta = JSON.parse(
    readFileSync(join(directory, "page.json"), "utf8"),
  ) as Record<string, unknown>;
  const fail = (reason: string): never => {
    throw new Error(`content${url}/page.json: ${reason}`);
  };
  for (const field of ["title", "description", "kind", "status", "modified"])
    if (typeof meta[field] !== "string") fail(`${field} is required`);
  const kind = meta["kind"] as PageKind;
  const title = meta["title"] as string;
  const description = meta["description"] as string;
  if (!PAGE_KINDS.has(kind))
    fail(`kind must be one of ${[...PAGE_KINDS].join(", ")}`);
  if (!PAGE_STATUS.has(meta["status"] as string))
    fail("status must be published or draft");
  if (title.length > 60)
    fail(`title is ${title.length} characters, at most 60`);
  if (description.length < 120 || description.length > 160)
    fail(`description is ${description.length} characters, needs 120 to 160`);
  if (kind === "article" && (!meta["author"] || !meta["published"]))
    fail("an article needs author and published");
  if (kind !== "article" && (meta["author"] || meta["published"]))
    fail("author and published belong to articles only");
  schemaDate(meta["modified"] as string);
  if (kind === "article") schemaDate(meta["published"] as string);
  return {
    path: url,
    title,
    description,
    kind,
    status: meta["status"] as "published" | "draft",
    modified: meta["modified"] as string,
    ...(meta["crumb"] ? { crumb: meta["crumb"] as string } : {}),
    ...(meta["parent"] ? { parent: meta["parent"] as string } : {}),
    ...(meta["author"] ? { author: meta["author"] as string } : {}),
    ...(meta["published"] ? { published: meta["published"] as string } : {}),
    ...(meta["social"]
      ? { social: meta["social"] as ContentSource["social"] }
      : {}),
    markdown: readFileSync(join(directory, "content.md"), "utf8").trim(),
  };
}

/** Replaces every `{{ … }}` token with the value the site computes for it. */
export function resolveTokens(
  markdown: string,
  path: string,
  render: (
    kind: string,
    args: string[],
    options: Record<string, string>,
  ) => string,
): string {
  return markdown.replaceAll(
    /\{\{\s*(.+?)\s*\}\}/gsu,
    (whole, body: string) => {
      const [kind, ...rest] = body.split(/\s+/u);
      const options: Record<string, string> = {};
      const args = rest.filter((part) => {
        const option = part.match(/^([a-z]+)=(.+)$/u);
        if (!option?.[1] || !option[2]) return true;
        options[option[1]] = option[2];
        return false;
      });
      try {
        return render(kind ?? "", args, options);
      } catch (error) {
        throw new Error(
          `content${path}: ${whole} — ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    },
  );
}
