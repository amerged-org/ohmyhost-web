import type { ContentPage } from "../content/types.js";
import { page as about } from "./about.js";
import { page as blogFiveSideProjectsPriced } from "./blog-five-side-projects-priced.js";
import { page as blogHostALovableApp } from "./blog-host-a-lovable-app.js";
import { page as blogIntroducingOhmyhoSt } from "./blog-introducing-ohmyho-st.js";
import { page as blogRailwayRenderFly2026 } from "./blog-railway-render-fly-2026.js";
import { page as blogSixThingsThatBreak } from "./blog-six-things-that-break.js";
import { page as blogSupabaseVsVercel } from "./blog-supabase-vs-vercel.js";
import { page as forClaudeCode } from "./for-claude-code.js";
import { page as forCodex } from "./for-codex.js";
import { page as forCursor } from "./for-cursor.js";
import { page as fromBolt } from "./from-bolt.js";
import { page as fromLovable } from "./from-lovable.js";
import { page as openSource } from "./open-source.js";
import { page as philosophy } from "./philosophy.js";
import { page as pricingBreakdown } from "./pricing-breakdown.js";
import { page as vsRailway } from "./vs-railway.js";
import { page as vsResend } from "./vs-resend.js";
import { page as vsSupabase } from "./vs-supabase.js";
import { page as vsVercel } from "./vs-vercel.js";

/** Every editorial page module, registered explicitly: a Worker cannot glob its sources. */
export const CONTENT_PAGE_LIST: readonly ContentPage[] = [
  about,
  blogFiveSideProjectsPriced,
  blogHostALovableApp,
  blogIntroducingOhmyhoSt,
  blogRailwayRenderFly2026,
  blogSixThingsThatBreak,
  blogSupabaseVsVercel,
  forClaudeCode,
  forCodex,
  forCursor,
  fromBolt,
  fromLovable,
  openSource,
  philosophy,
  pricingBreakdown,
  vsRailway,
  vsResend,
  vsSupabase,
  vsVercel,
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
