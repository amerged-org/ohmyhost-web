import type { ContentPage } from "../content/types.js";
import { page as introducingOhmyhoSt } from "./blog-introducing-ohmyho-st.js";
import { page as openSource } from "./open-source.js";
import { page as philosophy } from "./philosophy.js";

/** Every editorial page module, registered explicitly: a Worker cannot glob its sources. */
export const CONTENT_PAGE_LIST: readonly ContentPage[] = [
  philosophy,
  openSource,
  introducingOhmyhoSt,
];

export const BLOG_POSTS: readonly ContentPage[] = CONTENT_PAGE_LIST.filter(
  (page) => page.kind === "article",
).sort((a, b) => (b.published ?? "").localeCompare(a.published ?? ""));

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
  const [year, month, day] = iso.split("-").map(Number);
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
