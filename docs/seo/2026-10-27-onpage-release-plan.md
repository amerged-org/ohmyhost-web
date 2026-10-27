# On-page SEO release plan — 2026-10-27

Canonical checklist for the Sonnet 5.5 on-page release. Evidence lives beside it in `evidence/`. Deferred listings are in `docs/seo/distribution-backlog.md` and were **not** submitted. Search Console context is in `2026-10-27-search-console-audit.md`.

Release tree: branch `seo/onpage-release-20261027`, created from `origin/main` `da2742a`. The original checkout and its uncommitted user work were left untouched.

## Status

| #   | Item                                          | Status                               | Evidence                                                                                                                                                                                                                                                                        |
| --- | --------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Free Vercel and Supabase alternatives article | Done in tree                         | Short-answer table dated 2026-10-27; vendor facts in `content/data/vendors.json` (`supabaseFree`, `vercelHobby`); seven dated screenshots `evidence/free-tiers-20261027--*`; capture manifests `evidence/manifest-free-tiers-20261027*.json`                                    |
| 2   | Lovable intent separation                     | Done in tree                         | `/from/lovable` is now "Deploy your exported Lovable app on ohmyho.st", prompt first. The blog is a vendor-neutral migration checklist. No merge, no redirect, no cannibalisation claim                                                                                         |
| 3   | Framework pages                               | Pages done; hosted proof **blocked** | `/frameworks/nextjs`, `/frameworks/vite`, `/frameworks/tanstack`; public repository `amerged-org/ohmyhost-framework-examples`; local builds and `ohmyhost init --dry-run` results. No hosted deployment was made, so no live example URL is claimed                             |
| 4   | Agent pages                                   | Partial, stated honestly             | A real MCP `initialize` and `tools/list` against the installed `ohmyhost-mcp` 0.1.36 (`evidence/mcp-stdio-session-20261027.json`). Each page says it is a protocol check, not a Claude Code, Cursor or Codex session. No agent deployment transcript exists, so none is claimed |
| 5   | Cleanup                                       | Done in tree                         | Organization JSON-LD with `legalName`, address, `founder` and `sameAs` to the GitHub organization; founder is a separate Person node with the LinkedIn profile. Astro 2027 title and URL untouched. Homepage and `/brand` untouched                                             |
| +   | MCP Registry                                  | Done and read back                   | See below                                                                                                                                                                                                                                                                       |
| +   | Distribution backlog                          | Written, nothing submitted           | `docs/seo/distribution-backlog.md`                                                                                                                                                                                                                                              |

## 1. Free alternatives article

- Rule followed: numbers come from `content/data/vendors.json`, each with a dated screenshot. Nothing is typed into prose.
- New first-party sources read on 2026-10-27: Supabase pricing and project-pausing docs, Vercel Hobby plan, fair-use guidelines, pricing and Postgres docs.
- Facts recorded: Supabase Free has 2 active projects, a 500 MB database and pauses after 1 week of inactivity (restorable for up to 1 year). Vercel Hobby is non-commercial personal use only, allows up to 200 projects, has no database of its own, and when a limit is hit you in most cases wait 30 days.
- The commercial-use cell for Supabase says only that the pricing and pausing pages show no such rule, and that we did not read the full terms. That is deliberate: we did not verify Supabase's terms.
- The previous 2026-09-28 prices for the other providers keep their original dates and screenshots. Only the two vendors that were re-read carry the new date.
- The Vercel Postgres sentence was reworded to what the page says today (external Postgres through the Marketplace) rather than a statement about a product being discontinued.
- Title, H1 and URL were not changed: the article keeps `/blog/free-vercel-supabase-alternatives-2026`.

## 2. Lovable

- Current-source facts re-read from Lovable's external-hosting guide on 2026-10-27: two stacks (older React + Vite, and TanStack Start apps created from May 13, 2026), the three `VITE_` values plus server-side values for TanStack Start, SPA fallback, and that the database export includes password hashes.
- Corrected hash fact carried forward: the export includes user accounts with their password hashes; signed-in users must sign in again; storage files, secrets and sign-in provider settings are manual.
- Product page keeps all useful guide content; only the order changed so the deployment prompt is first.
- Not done: no fresh Lovable screenshots. The existing export screenshots (2026-10-06) were not re-captured because that needs a logged-in Lovable account that is not part of this scope. The export guide is unchanged.

## 3. Framework pages

- Public repository: https://github.com/amerged-org/ohmyhost-framework-examples (MIT, no secrets, no accounts, no customer data). Written from scratch, not exported from any private source.
- Verified identity before creating it: `gh` login `sebmer-com`, admin of `amerged-org`, the organization that already owns the public `ohmyhost-web`, `ohmyhost-docs` and `ohmyhost-mcp` repositories.
- Each example built locally with pinned versions and passed `ohmyhost init --root <folder> --dry-run --json`: Next.js 16.4.3 (admitted, `nextjs-adapter` requirement), Vite 8.3.5 (admitted, static), TanStack Start 1.169.4 (admitted, static).
- **Blocked:** a hosted build and a live URL for each example. Two saved ohmyho.st logins exist on this machine (`amerged` and `sebmer`), neither is documented as a dedicated zero-cost demo scope, and a deployment creates a project and spends credits. Each page therefore states "not done" and links no live URL. Next step for the owner: name the demo workspace, then run plan, deploy and promote for each example.
- TanStack edge mode was not exercised; only static mode was.

## 4. Agent pages

- Added a short "what we have tested, and what we have not" section to each page, and one FAQ on whether a recorded deployment exists.
- The captured session lists the tools those pages name. It does not distinguish the three agents and the pages say so.
- Claude Code, Cursor and Codex FAQ counts stay inside the 3 to 6 contract.
- Blocked: a real recorded deployment in each agent. Next step: run one in the named demo workspace and add its transcript, URL and measured time.

## 5. Cleanup

- `/about` now emits Organization with `legalName`, `address` (Venray, Limburg, NL, matching the terms page), `founder` and `sameAs: ["https://github.com/amerged-org"]`, plus a separate Person node for the founder with the LinkedIn profile. The founder photo is deliberately omitted on `/about`, as an existing test requires.
- Not added to the organization's `sameAs`: no other official profile could be verified (the GitHub organization lists no social account). The founder's personal LinkedIn stays on the Person node only.
- Docs indexing, read only: `https://docs.ohmyho.st/api` and `/quickstart` answer 200 with no robots meta and no `X-Robots-Tag`; the docs robots.txt disallows only `/cdn-cgi/` and `/_next/`; the sitemap lists 169 URLs including the `api-reference/*` pages. Nothing was changed and no index request was made.

## MCP Registry

- Identity: `io.github.amerged-org/ohmyhost-mcp`. npm package `@amerged/ohmyhost-mcp`, `mcpName` matches, npm `latest` is 0.1.39.
- Before: the registry's latest was 0.1.38.
- Action: validated and published `server.json` for 0.1.39 with the official `mcp-publisher` (v1.8.6, downloaded from the registry's GitHub release and checked against its published checksums), authenticating through GitHub. The token stayed in the process environment and was not written to any file. The only change from the existing record is the version (top level and package).
- Readback: `https://registry.modelcontextprotocol.io/v0.1/servers/io.github.amerged-org%2Fohmyhost-mcp/versions/latest` returns 0.1.39 with `isLatest: true`; 0.1.38 and earlier are `isLatest: false`; one server identity, no duplicate. Published at 2026-10-27T21:33:13Z. `websiteUrl` is preserved as `https://docs.ohmyho.st/agents/mcp`.
- No new npm version was published and no remote endpoint was added.

## Release checks

Run on the exact tree that is published: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test` (77 tests: 76 prior plus one new regression test for the Organization and Person nodes, written failing first). Results and the live probes are in `final-report.txt` in the task scratch directory.

## Rollback

Previous production version: `3129a502-3c8a-4f5a-8799-3bf55f70c79d` (tag `da2742a7cedcc1ecc4dd6b3133f855f8ab62c30b`) on Worker `ohmyho-web-production`, account `9e753b729403274e3c62ea1ffd4fddd7`. Roll back with `pnpm exec wrangler rollback 3129a502-3c8a-4f5a-8799-3bf55f70c79d --config wrangler.jsonc`.
