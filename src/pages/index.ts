import type { ContentPage } from "../content/types.js";
import { CONTENT_PAGE_LIST as GENERATED } from "../generated-content.js";

/** Every editorial page, compiled from the content tree by `content:prepare`. */
export const CONTENT_PAGE_LIST: readonly ContentPage[] = GENERATED;

/** Newest first; posts published on the same day are ordered by path so the index is stable. */
export const BLOG_POSTS: readonly ContentPage[] = CONTENT_PAGE_LIST.filter(
  (page) => page.kind === "article",
).sort(
  (a, b) =>
    (b.published ?? "").localeCompare(a.published ?? "") ||
    a.path.localeCompare(b.path),
);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "2026-09-13" → "September 13, 2026". */
export function longDate(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return `${MONTHS[(month ?? 1) - 1]} ${day}, ${year}`;
}

/** The /blog index, generated from the post modules so it cannot go stale. */
export function blogIndexMarkdown(posts: readonly ContentPage[]): string {
  return [
    "# From the build",
    "",
    "Notes on hosting for vibe-coded apps: deploying with coding agents, what a credit buys, and priced comparisons with the subscriptions they replace.",
    ...posts.flatMap((post) => [
      "",
      `## [${post.markdown.split("\n")[0]?.replace(/^# /u, "") ?? post.title}](${post.path})`,
      "",
      `${longDate(post.published ?? post.modified)} · ${post.description}`,
    ]),
    "",
    "[Read the docs](https://docs.ohmyho.st/) · [Home](/)",
  ].join("\n");
}

export const CONTENT_PAGES: Record<string, string> = Object.fromEntries([
  ...CONTENT_PAGE_LIST.map((page) => [page.path, page.markdown]),
  ["/blog", blogIndexMarkdown(BLOG_POSTS)],
]);
