import type { PageKind } from "./content/types.js";
import { BLOG_POSTS, CONTENT_PAGE_LIST } from "./pages/index.js";

/** Head metadata and schema kind for one route; one entry per HTML page the site serves. */
export interface PageMeta {
  /** Full `<title>` text, 40–60 characters. */
  readonly title: string;
  /** The only `<meta name="description">`, 120–160 characters. */
  readonly description: string;
  readonly kind: PageKind;
  /** ISO date: sitemap lastmod and dateModified. */
  readonly modified: string;
  /** ISO date; articles only. */
  readonly published?: string;
  /** Breadcrumb parent; must be a PAGE_META key. */
  readonly parent?: string;
  /** Absolute path of a 1200×630 PNG; the site image when absent. */
  readonly ogImage?: string;
  readonly ogImageAlt?: string;
  readonly socialTitle?: string;
  readonly socialDescription?: string;
  /** Short breadcrumb label. */
  readonly crumb?: string;
}

export { SITE_ORIGIN } from "./site-identity.js";
/** Last change of the static home and brand pages. */
export const SITE_MODIFIED = "2026-09-21";
export const FOUNDER = {
  name: "Sebastian Mertens",
  path: "/about",
  image: "/brand/assets/founder.png",
} as const;

const LEGAL_MODIFIED = "2026-09-19";

const STATIC_PAGES: Record<string, PageMeta> = {
  "/terms": {
    title: "Terms of Service and Master Services Agreement — ohmyho.st",
    description:
      "The terms under which Amerged B.V. provides ohmyho.st hosting, Postgres, domains and mail, including credits, acceptable use, liability and termination.",
    kind: "page",
    modified: LEGAL_MODIFIED,
    crumb: "Terms",
  },
  "/pricing": {
    title: "Pricing: one balance for your projects, from $10 — ohmyho.st",
    description:
      "Free starts with 200 credits a month; Paid starts at $10 for 1,000 monthly credits. Every project shares one organization balance with no per-project base fee.",
    kind: "page",
    modified: "2026-09-20",
    crumb: "Pricing",
  },
  "/status": {
    title: "ohmyho.st service status: hosting, Postgres, mail, MCP",
    description:
      "How to check whether ohmyho.st hosting, Postgres, transactional mail and the MCP server are operating, and where your agent reads a project's live state.",
    kind: "page",
    modified: "2026-09-20",
    crumb: "Status",
  },
  "/changelog": {
    title: "ohmyho.st changelog: what shipped and when",
    description:
      "Release notes for ohmyho.st: client releases, hosting runtime changes, new MCP tools and Skills, pricing updates and the dates they went live.",
    kind: "page",
    modified: "2026-09-20",
    crumb: "Changelog",
  },
  "/from/replit": {
    title: "Move your Replit app to ohmyho.st hosting",
    description:
      "Moving from Replit? Push the source to GitHub; your agent inventories the app, provisions Postgres, sets secrets and promotes to Prod once Dev is verified.",
    kind: "howto",
    modified: "2026-09-20",
    crumb: "From Replit",
  },
  "/from/vercel-supabase": {
    title: "Move from Vercel and Supabase to one balance — ohmyho.st",
    description:
      "Two bills become one: keep Supabase as an external database or import a dump, move environment secrets and callback URLs, deploy with your agent and verify.",
    kind: "howto",
    modified: "2026-09-20",
    crumb: "From Vercel and Supabase",
  },
  "/privacy": {
    title: "Privacy policy: how ohmyho.st handles your data",
    description:
      "How Amerged B.V. processes personal data for ohmyho.st: accounts, projects, logs, mail, US or EU project placement, international transfers and your rights.",
    kind: "page",
    modified: LEGAL_MODIFIED,
    crumb: "Privacy",
  },
  "/cookies": {
    title: "Cookie policy: the cookies ohmyho.st sets and why",
    description:
      "Which cookies ohmyho.st uses, what each one stores, how long it lasts, which ones need consent and how you withdraw that consent later.",
    kind: "page",
    modified: LEGAL_MODIFIED,
    crumb: "Cookies",
  },
  "/dpa": {
    title: "Data processing agreement for ohmyho.st customers",
    description:
      "The data processing agreement between Amerged B.V. and ohmyho.st customers: roles, instructions, sub-processors, security measures, transfers and audit rights.",
    kind: "page",
    modified: LEGAL_MODIFIED,
    crumb: "DPA",
  },
  "/dpa/toms": {
    title: "Technical and organisational measures — ohmyho.st DPA",
    description:
      "The technical and organisational measures Amerged B.V. applies to ohmyho.st: access control, encryption, per-project isolation, logging and incident handling.",
    kind: "page",
    modified: LEGAL_MODIFIED,
    parent: "/dpa",
    crumb: "TOMs",
  },
  "/dpa/subprocessors": {
    title: "Sub-processors ohmyho.st uses to run your projects",
    description:
      "The providers ohmyho.st relies on to host, store and send on your behalf, with the role each one plays, where it processes data and how changes are announced.",
    kind: "page",
    modified: LEGAL_MODIFIED,
    parent: "/dpa",
    crumb: "Sub-processors",
  },
  "/dpa/transfers": {
    title: "International data transfers — ohmyho.st DPA annex",
    description:
      "How ohmyho.st handles transfers of personal data outside the EEA: adequacy decisions, Standard Contractual Clauses and the safeguards each provider relies on.",
    kind: "page",
    modified: LEGAL_MODIFIED,
    parent: "/dpa",
    crumb: "Transfers",
  },
  "/contact": {
    title: "Contact ohmyho.st: questions, privacy, billing",
    description:
      "Use the contact form for questions about ohmyho.st, privacy requests, billing and the data processing agreement. Amerged B.V., Venray, Netherlands.",
    kind: "page",
    modified: LEGAL_MODIFIED,
    crumb: "Contact",
  },
  "/login": {
    title: "Log in to ohmyho.st with your agent's sign-in link",
    description:
      "Sign in to ohmyho.st through the link and confirmation code your agent returns, or open the login page directly to reach your workspace, projects and tokens.",
    kind: "page",
    modified: "2026-09-20",
    crumb: "Log in",
  },
  "/blog": {
    title: "From the build — the ohmyho.st blog on hosting for agents",
    description:
      "Notes from building ohmyho.st: deploying with coding agents, what a credit buys, priced comparisons with Vercel, Supabase and Resend, and migration guides.",
    kind: "collection",
    modified: BLOG_POSTS[0]?.modified ?? SITE_MODIFIED,
    crumb: "Blog",
    socialTitle: "ohmyho.st — From the build",
    socialDescription:
      "Hosting alternatives, practical deployment guides and lessons from production.",
  },
};

export const PAGE_META: Record<string, PageMeta> = {
  ...STATIC_PAGES,
  ...Object.fromEntries(
    CONTENT_PAGE_LIST.map((page) => [
      page.path,
      {
        title: page.title,
        description: page.description,
        kind: page.kind,
        modified: page.modified,
        published: page.published,
        parent: page.parent,
        ogImage: page.ogImage,
        ogImageAlt: page.ogImageAlt,
        socialTitle: page.socialTitle,
        socialDescription: page.socialDescription,
        crumb: page.crumb,
      } satisfies PageMeta,
    ]),
  ),
};

export function pageMeta(path: string): PageMeta {
  const meta = PAGE_META[path];
  if (!meta) throw new Error(`Page metadata missing: ${path}`);
  return meta;
}

/** Short label for the breadcrumb: the declared crumb, else the title's first clause. */
export function crumbLabel(meta: PageMeta): string {
  return meta.crumb ?? meta.title.split(/ — |: /u)[0] ?? meta.title;
}

export function sitemapEntries(): Array<{ path: string; lastmod: string }> {
  return [
    { path: "/", lastmod: SITE_MODIFIED },
    { path: "/brand", lastmod: SITE_MODIFIED },
    ...Object.entries(PAGE_META)
      .filter(([path]) => path !== "/login")
      .map(([path, meta]) => ({ path, lastmod: meta.modified.slice(0, 10) })),
  ];
}
