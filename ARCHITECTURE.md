# Architecture

## What this repository is

The website of ohmyho.st: a Cloudflare Worker that renders a tree of markdown pages, plus the agent
surface those pages index. It is deployed independently of the platform and holds no customer data,
no credential and no backend logic.

## Boundaries

| Owner           | Surface                                                                                                                                                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| This repository | every page of `https://ohmyho.st` — `/brand`, `llms.txt`, `AGENTS.md`, `mcp.json`, `mcp-tools.json`, `/skills/*`, `/.well-known/*`, the sitemap, robots, the social cards and the site's own `/want`, `/stats.json`, `/status.json` and contact endpoints |
| The platform    | `https://ohmyho.st/releases/*`, `/client-release.json` and `/0.sh` (the released clients), `omh.st`, `check.omh.st` and `*.check.omh.st` (project addresses), the REST API at `app.ohmyho.st`                                                             |

Cloudflare does not allow a route on a hostname that already has a custom domain, so the split is a
service binding rather than a DNS move: `ohmyho.st` stays attached to the platform's entry Worker,
which answers the paths above itself and hands every other request to this Worker. This repository
releases without touching DNS, and removing the binding puts the platform Worker back in charge.

## Content

`content/<path>/` is a page, and the folder path is its URL. Each page carries `page.json` (title,
description, kind, status, social card and, for an article, author and dates) and `content.md`
(prose only). The build compiles the tree into the Worker bundle: a Worker has no filesystem.

Published numbers are resolved at build time from `platform-inputs.json` and `content/data/*.json`
through a closed token vocabulary (`{{ usd … }}`, `{{ credits … }}`, `{{ rate … }}`, `{{ table … }}`,
`{{ figure … }}`). An unknown token, or one naming a vendor, workload or unit that does not exist,
fails the build. That is what keeps a published price traceable to a source.

## Platform inputs

`platform-inputs.json` is written by the platform's `prepare-web-inputs.mjs` and reviewed here as an
ordinary pull request. It carries the credit rate card, the Skill catalog, the MCP tool catalog and
the current client release, together with the platform commit it was generated from. The build reads
only that committed file, so a build is deterministic and offline.

## Decisions

| ID   | State       | Decision                                                                                                                                           |
| ---- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| W001 | Implemented | The website is its own public MIT repository; the platform stays private.                                                                          |
| W002 | Implemented | The folder path under `content/` is the URL, and every page carries `page.json` and `content.md`.                                                  |
| W003 | Implemented | Published numbers reach a page only through build-time tokens resolved from the rate card and dated competitor data.                               |
| W004 | Implemented | The agent surface (`llms.txt`, `AGENTS.md`, the Skill pages and the MCP catalog) is served by this repository, generated from the platform inputs. |
| W005 | Implemented | Client downloads, the project-address hostnames and the REST API stay with the platform.                                                           |

| W006 | Implemented | Website and docs share the GA4 web stream G-C1PWJM238R and a versioned 180-day analytics preference; Google loads only after consent on the two public hosts, with explicit sanitized page views and no advertising features; Accept/Edit opens a preference dialog and the only persistent control is a cookie icon in the footer. |

## Editorial SEO and response caching

The homepage and editorial JSON-LD graphs share the `WebSite` identity from
`src/site-identity.ts`. Editorial metadata accepts ISO dates or explicit timestamps with timezones.
Existing dates retain their original day and are serialized at the UTC day boundary for schema and
Open Graph; midnight represents the stored day's precision, not a recovered publication clock time.
Explicit timestamps retain their clock time. Build time never substitutes for publication time.

The canonical host permanently upgrades HTTP while retaining path and query. Known editorial
trailing-slash routes redirect to their slashless page; unknown paths still return 404. Markdown
mirrors and negotiated Markdown advertise the HTML canonical through the HTTP Link header, and
Accept quality weights select the representation with HTML winning ties.

`src/editorial-response.ts` generates weak body validators for anonymous editorial responses and
returns 304 only for a matching representation. Browser HTML navigation is private and revalidated
because the agent prompt can contain a region hint; other anonymous representations allow a
five-minute shared freshness period. Vary covers Accept, Cookie, Authorization and fetch metadata.
Any cookie, authorization header, referral query or Set-Cookie response keeps no-store and omits
validators. Dynamic API, contact and login responses retain their existing policies.

The small-app workload includes its deployed script and mail sender zone. The five-project example
adds four quiet workloads to that complete workload; its prose states when the monthly credits
need a top-up. The homepage links to the generated breakdown instead of repeating a hardcoded total.

## Approved alternative-positioning copy — 2026-09-21

The homepage names app hosting and the entry price in its H1, keeps competitor names in a scoped
alternative comparison, and states credit and tax terms by pricing. The original design template
stays immutable; approved copy is applied in `scripts/prepare-pages.mjs`. Social titles and short
card descriptions live in each page's `social` metadata independently of its longer SEO description;
`src/og-pages.ts` uses those same values and gives ohmyho.st a prominent brand label. Both Open Graph
and X include image descriptions. The owner approved transactional-email copy without a provider-
approval notice; this editorial decision is not evidence of SES production readiness.

The homepage social card uses the owner-selected migration motif, adding Resend to the Vercel and Supabase headline while retaining the shared ohmyho.st branding.

The homepage omits the extra credit-balance paragraph beneath its lead to keep the primary Copy prompt action higher in the initial viewport (owner correction, 2026-09-21).

The homepage preserves the original comparison heading/lead/cards hierarchy: attribution is a
single short line below the cards, pricing has one concise metering/reset note linking to usage
rates, and the closing CTA says “No card required.” (owner layout correction, 2026-09-21).
SEO and social metadata are unchanged by this correction.

The footer bottom row is a sibling of the link grid, spanning its full width with “© 2026 ohmyho.st — Made in Europe” at the left and the existing cookie-settings button at the right, without wrapping (2026-09-21).

Every editorial fenced prompt or command has a keyboard-accessible copy icon which copies that block’s full text, with success/error feedback and the existing clipboard fallback. Text prompts wrap for narrow screens; Markdown content and metadata remain unchanged.

The About page explains the product, intended builders, agent deployment, credits and portability; personal biography, founder photo, registration detail, the obsolete “Not yet” inventory and About-page Person markup are removed. Operator disclosures remain on legal pages, and the client/site/documentation licences are described accurately (2026-09-21).

The September 2026 copy audit corrects portal/CLI descriptions, default database idle timing, retained-resource costs, shared/isolated data and funded-service grace wording; deployment examples describe only actual plan/execute pairs. The owner supplied the homepage’s approximately 30-second deployment wording. Brand templates retain their original geometry but receive current copy, valid CLI examples and dated, data-derived plan prices. The changelog and open-source inventory cover verified releases and the MIT website repository. Billing availability and handle-rollout claims are outside this editorial release.
