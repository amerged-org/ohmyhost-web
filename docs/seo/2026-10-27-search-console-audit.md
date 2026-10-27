# ohmyho.st Search Console audit and SEO plan (2026-10-27)

Owner: Sebastian Mertens (amerged). Scope: the public website `https://ohmyho.st`, served by this
repository (`ohmyhost-web`, Cloudflare Worker `ohmyho-web-production`, remote
`github.com/amerged-org/ohmyhost-web`). The documentation site `docs.ohmyho.st` is a Mintlify
site that is not built from this repository; findings about it are recommendations only.

Status: plan written, local implementation done, verification recorded below. Nothing has been
committed, pushed, deployed or submitted to Search Console.

## 1. Inputs and coverage

| Export                      | Files                                                                 | Rows                          | What it is                                                                    |
| --------------------------- | --------------------------------------------------------------------- | ----------------------------- | ----------------------------------------------------------------------------- |
| Performance on Search (zip) | Chart, Queries, Pages, Countries, Devices, Search appearance, Filters | 36 / 53 / 50 / 80 / 3 / 0 / 2 | Web search, "Last 3 months"; data starts 2026-09-20, ends 2026-10-25          |
| Coverage (zip)              | Chart, Critical issues, Non-critical issues, Metadata                 | 34 / 6 / 0 / 1                | Page indexing report, sitemap filter "All known pages"; no URL-level examples |
| Top linking sites (csv)     | one table                                                             | 5                             | Site, linking pages, target pages                                             |

The property includes both `ohmyho.st` and `docs.ohmyho.st` URLs, so it behaves as a domain
property. Queries.csv covers 120 of 895 chart impressions (13.4 percent); the rest is anonymised
or below the export's row limit. Pages.csv sums per-page impressions (1,031), which need not
equal the property total. The coverage export lists reasons and counts only; it does not say
which URL has which reason, so no URL-level reason is claimed here.

Reproducible scripts and raw outputs were kept in the task scratch directory
(`aggregate.py`, `live_audit.py`, `probes.py`, `summarize_audit.py`).

## 2. Measurements (from the exports)

- Totals 2026-09-20 to 2026-10-25: 4 clicks, 895 impressions, CTR 0.45 percent,
  impression-weighted average position 8.75.
- 2026-09-20 to 2026-10-09 (20 days): 875 impressions, 43.8 per day, 4 clicks.
- 2026-10-10 to 2026-10-25 (16 days): 20 impressions, 1.2 per day, 0 clicks.
- Indexed pages: 81 (09-21), 101 (09-22), 103 (10-05 to 10-09), 80 (10-10), 66 (10-13),
  64 (10-17), 63 (10-20 to 10-23). Not indexed: 75, then 192, 203, 226, 241, 245, 248.
- Not-indexed reasons: Crawled, currently not indexed 157; Discovered, currently not indexed 83;
  Not found (404) 3; Page with redirect 3; Excluded by noindex 1; Blocked by robots.txt 1.
  The last four are small and match intended behaviour seen live (`/login` and `/*?r=` are
  disallowed in robots.txt; `/docs`, `/api`, trailing slashes and `http://` redirect).
- Pages: blog articles carry 784 of 1,031 page impressions with 0 clicks. Largest:
  `/blog/free-vercel-supabase-alternatives-2026` 344 impressions at position 7.1;
  Railway/Render/Fly comparison 97 at 5.5; Supabase vs Vercel 84 at 8.5; Lovable alternative 75;
  Lovable hosting 70; five-project cost 50. Docs pages: 81 impressions, 2 clicks.
- Queries: no query contains "ohmyho.st" or "ohmyhost". Five "oh my ..." queries
  (10 impressions) are false brand matches. Non-brand themes (overlapping):
  Supabase free plan limits 37 impressions at position 5.9; Vercel Hobby pricing and commercial
  use 27 at 10.3; Lovable export and hosting 24 at 17.0; Supabase vs Vercel 7 at 62.3;
  Railway, Render, Fly 4 at 5.5. Top query: "supabase pricing free plan 2026", 21 impressions at
  position 3.3, 0 clicks.
- Devices: desktop 823 impressions (4 clicks), mobile 71, tablet 1.
- Countries: 80; United States 471 impressions (52.6 percent); clicks only from the Netherlands
  (2), France and Czechia (1 each).
- Links: 5 sites, 11 linking pages. 6 of them are `mintlify.app` (the docs host, which is our
  own documentation and canonicalises to `docs.ohmyho.st`), the rest are MCP or tool directory
  listings. This export has no anchor text, dates or follow attributes, and no information about
  link quality.

## 3. Live and code audit (2026-10-27)

Checked with a Googlebot user agent, without following redirects, on all 43 sitemap URLs plus
redirect and machine endpoints:

- robots.txt allows everything except `/login` and `/*?r=`; it lists the sitemap. The sitemap
  has 43 URLs, all returning 200 HTML with a self-referencing canonical, one H1, unique titles
  (40 to 60 characters) and unique descriptions. No `noindex` meta or `X-Robots-Tag` found.
- Markdown twins (`/path.md`) return `Link: <canonical>; rel="canonical"`, so they consolidate to
  the HTML page. Content negotiation returns HTML for every Accept header a browser or Googlebot
  sends; Markdown is served only when `text/markdown` is preferred.
- Structured data parses on every page (BreadcrumbList, WebPage, BlogPosting, FAQPage, HowTo).
- Defect: `/brand` is in the sitemap and in Pages.csv but has no canonical. It is an approved,
  hash-verified artifact, so the HTML cannot be edited without approval.
- Defect: the published introduction of `/blog/run-lovable-project-locally` is an unedited
  draft ("ask your Agent eg codex, claude code etc. to Therefore you need to install ... you are
  lucky this is just a prompt", "lovabale cloud", "SupaBase"). This is visible to every reader.
- Pattern: 13 articles introduce 42 prompts with the same ungrammatical line, "Here a prompt:".
  Repeated boilerplate across a young site makes pages look templated rather than edited.
- Internal links: `/blog/run-lovable-project-locally` and `/blog/best-astro-hosting-2027` have
  2 inbound links from sitemap pages, `/blog/move-out-of-lovable-cloud` and the Railway
  comparison have 3. Landing pages in the shared navigation have 41.
- Git history around 2026-10-09/10: content additions (an all-in-one comparison article,
  2026-10-10 11:03) and platform-input releases. No change to robots, canonicals, status codes,
  `noindex` or rendering in that window.
- Google Search Status Dashboard (Ranking history): the September 2026 spam update began
  2026-09-24 and lasted 13 days 16 hours, ending around 2026-10-08. No other ranking incident is
  listed for October 2026. Source: https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history
- docs.ohmyho.st sitemap: 169 URLs, 124 of them generated `api-reference/*` operation pages.
  `ohmyhost.mintlify.app` duplicates canonicalise to `docs.ohmyho.st`.

Not measured: Core Web Vitals field data (no CrUX or Search Console experience export was
supplied), full Google index membership, manual actions, and per-URL inspection results.

## 4. Interpretation (not proven)

1. The 2026-10-10 cliff is a site-level loss of visibility, not a crawl or indexing block. The
   site still returns 200 with correct canonicals and no `noindex`, and nothing technical changed
   that day. Impressions and indexed pages fell together the day after the September 2026 spam
   update finished. That timing is consistent with Google reassessing the site, but the exports
   cannot prove the cause. A young domain losing its initial test impressions is an alternative
   explanation that fits the same data.
2. The site has almost no independent signals: no branded search demand, 11 linking pages
   mostly from directories and our own docs host, and about 13 vendor-written comparison
   articles in five weeks targeting competitor names. Google's guidance says it may rely on
   site-wide signals and that scaled, unhelpful content can affect a whole site
   (https://developers.google.com/search/docs/essentials/spam-policies,
   https://developers.google.com/search/docs/fundamentals/creating-helpful-content).
3. "Crawled, currently not indexed" (157) and "Discovered" (83) are mostly larger than this
   site's 43 URLs, so a large share must be docs URLs, very likely the 124 generated API
   reference pages. That is consistent with Google choosing not to index thin generated pages.
4. Before the cliff, CTR was already near zero at positions 5 to 8. That suggests the snippets
   did not answer the searcher (for example, "supabase pricing free plan 2026" landed on a page
   whose title is about alternatives) or that AI Overviews answered on the results page. Neither
   can be separated with these exports.

## 5. Prioritised plan

High impact, technical (this repository):

1. Done: give `/brand` a canonical through the HTTP `Link` header, leaving the approved HTML
   unchanged. Google supports `rel="canonical"` HTTP headers
   (https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
2. Done: add a regression test so every sitemap page keeps a canonical (HTML or header).

Content and positioning (this repository):

3. Done: rewrite the broken draft introduction of `/blog/run-lovable-project-locally`.
4. Done: replace the 42 "Here a prompt:" lines with context-specific sentences and add a test
   that blocks the phrase.
5. Done: align the free-plan article's title, description and Supabase/Vercel section headings
   with the measured queries (Supabase Free limits, Vercel Hobby commercial use) without
   changing facts.
6. Done: add contextual internal links to the least-linked useful articles from the pages
   readers arrive on.

Recommended, needs Sebastian's decision or another system:

7. docs.ohmyho.st: keep the generated API reference pages out of the index or the sitemap, and
   link from them to the human guide for the operation. Mintlify supports per-page `noindex`
   front matter and sitemap control. This lives in the docs source, not here.
8. `/blog/best-astro-hosting-2027`: a 2027 title on a page published October 2026. Decide
   whether to retitle (the URL can stay, or move with a 301).
9. Slow the publishing of new comparison articles. Prefer revising existing pages with first
   hand evidence (measured deployments, screenshots, real cost logs) over new competitor-name
   pages.
10. Keep `modified` dates for substantive changes only, so sitemap `lastmod` stays trustworthy.

Authority, longer term:

11. Earn mentions from real use: Seb Builds case study, changelog posts, integration listings
    where ohmyho.st is a genuine fit, and talks or posts by the founder. No link buying.
12. After release: inspect the changed URLs in Search Console, resubmit the sitemap, then
    compare 28-day windows. Do not expect recovery before Google reprocesses the site; a site
    level reassessment can take months.

## 6. Implementation log

Agent changes, made on top of the existing uncommitted work in this worktree (that work was
snapshotted first and left intact; `git status` shows only additional paths):

- `src/worker-main.ts`: `/brand` responses send
  `Link: <https://ohmyho.st/brand>; rel="canonical", </brand.md>; rel="alternate"; type="text/markdown"`.
  The approved, hash-verified `/brand` HTML is untouched. Every other page keeps its old header.
- `content/blog/run-lovable-project-locally/`: rewrote the broken draft introduction (answer
  first, then one starter prompt, then what stays in the cloud, with a link to the Lovable Cloud
  move guide). Byline and `modified` set to 2026-10-27 because the visible content changed.
- 13 articles: replaced all 42 "Here a prompt" lead-ins with sentences that say what each prompt
  does. The prompts themselves are unchanged.
- `content/blog/free-vercel-supabase-alternatives-2026/`: title "Supabase Free and Vercel Hobby
  limits vs alternatives", a description that states the measured facts the top queries ask
  about (2 active projects, 500 MB database, quiet-week pause, Hobby non-commercial), and H2s
  "Vercel Hobby limits and commercial use" and "Supabase Free plan limits and pausing". All
  facts already appeared on the page and come from `content/data/vendors.json` (checked
  2026-09-28, screenshot evidence in `evidence/`). The H1 and URL are unchanged.
- `content/from/lovable/`: corrected an outdated claim. The page said Lovable Cloud passwords
  cannot be exported; Lovable's current database export documentation (read 2026-10-27) says
  the export includes users' password hashes and gives a new menu path. Added links to the local
  development and Lovable Cloud move guides.
- Internal links added: `/blog/host-a-lovable-app-after-export` to the local-run guide,
  `/blog/supabase-vs-vercel-do-you-need-both` to the Railway, Render and Fly.io comparison.
- Tests: `test/content-contract.test.ts` forbids "Here a prompt"; `test/seo-contract.test.ts`
  requires every sitemap URL to return 200, have no `noindex`, and carry a self-referencing
  canonical in HTML or the `Link` header; `test/worker-main.test.ts` and
  `test/editorial-response.test.ts` assert the `/brand` header.
- `src/generated-*.ts` are regenerated by `pnpm prepare:all` from the content tree, as for every
  content change.

Not changed on purpose: the homepage and `/brand` HTML (approval path), URLs, robots.txt, the
sitemap generator, prices, and product claims. No new pages were added.

## 7. Verification and completion evidence

Run on 2026-10-27 in this worktree:

- Baseline before edits (user worktree as found): `pnpm test` 18 files, 75 tests passed.
- TDD: the `/brand` header test and the sitemap canonical test failed against the original
  `src/worker-main.ts` (only `https://ohmyho.st/brand` failed) and passed after the fix. The
  "Here a prompt" rule failed on the original content and passed after the rewrite.
- After edits: `pnpm lint` exit 0, `pnpm typecheck` exit 0, `pnpm build` exit 0 (includes the
  Wrangler dry-run bundle), `pnpm test` 18 files, 76 tests passed.
- `pnpm format:check` reports one file, `test/worker-main.test.ts`, because of a pre-existing
  uncommitted line (`expect(privacy).toContain("US or EU region ...")`) that is also unformatted
  in the pre-edit snapshot. It was left as the user wrote it. All agent-edited files pass
  Prettier.
- Rendered check: the built Worker bundle (`dist/worker-bundle/worker-main.js`) was served
  locally with `public/` as its assets. All 43 sitemap URLs were fetched: 200, one H1, unique
  titles and descriptions, JSON-LD parses, no "Here a prompt". 17 targeted assertions passed
  (new `/brand` header, unchanged home header, new intro and links, BlogPosting `dateModified`
  and sitemap `lastmod` 2026-10-27 for the local-run guide, new title and H2s, corrected Lovable
  export text). Inbound links from sitemap pages: local-run guide 2 to 4, Lovable Cloud move
  guide 3 to 4, Railway comparison 3 to 4.
- Browser: `/blog/run-lovable-project-locally` and `/blog/free-vercel-supabase-alternatives-2026`
  rendered with normal layout and no console messages or JavaScript errors.
- Diff review: no em dashes in added lines, no secret-like strings, and no changes to the
  user's existing edits.

Release step (not done in this run): review and commit in
`/Users/sebastianmertens/Documents/GitHub/ohmyhost-web` (remote
`https://github.com/amerged-org/ohmyhost-web.git`, branch `main`), then deploy the Worker
`ohmyho-web-production` (`wrangler.jsonc`) through the usual release path. ohmyho.st reaches this
Worker through the platform's front door service binding, so the release does not touch DNS.
After it is live: inspect the changed URLs in Search Console, resubmit `https://ohmyho.st/sitemap.xml`,
and optionally run `scripts/indexnow-submit.mjs --submit` for Bing. Compare 28-day windows
afterwards. No ranking change is claimed until it is observed.

Local only, not deployed.
