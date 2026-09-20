import type { ContentPage } from "../content/types.js";
import {
  CTA_PROMPT,
  checkedLine,
  creditValueUsd,
  credits,
  number,
  priceLine,
  priceWorkload,
  rate,
  scenarioUsd,
  sourcesSection,
  usd,
  workloadTable,
} from "../content/format.js";
import { DATABASE_PROFILES, PLANS, SCENARIOS, VENDORS, WORKLOADS } from "../content/sources.js";
import { comparisonColumns, figureBills } from "../figures.js";

export const page: ContentPage = {
  path: "/vs/supabase",
  title: `Supabase alternative: Postgres by usage on ohmyho.st`,
  description: `Supabase Pro is $25 a month plus $10 per extra Micro project. ohmyho.st meters Postgres per active hour and GB-month from one balance shared by every project.`,
  kind: "page",
  modified: "2026-09-20",
  crumb: "vs Supabase",
  markdown: `# A Supabase alternative that bills Postgres by the active hour

Supabase Pro starts at ${usd(VENDORS.supabase.facts.pro.usd)} a month and each extra project's Micro instance adds ${usd(VENDORS.supabase.facts.microProject.usd)}. ohmyho.st has no per-project fee: ${usd(PLANS.paidUsd)} a month buys ${number(PLANS.paidCredits)} credits shared by every project, a Paid standard database costs about ${credits(priceLine("neon.compute.scale", DATABASE_PROFILES.standard.cu))} per active hour, storage ${rate("neon.storage.root")}, and idle compute suspends.

${figureBills("supabase")}

## What Supabase charges

Supabase prices the organization first, then each project's compute. Pro starts at ${usd(VENDORS.supabase.facts.pro.usd)} a month and covers ${VENDORS.supabase.facts.pro.includes}. That first Micro instance is the only compute the plan pays for.

Every further project needs its own instance. A Micro is ${usd(VENDORS.supabase.facts.microProject.usd)} a month; a Small is ${usd(VENDORS.supabase.facts.smallProject.usd)} a month. ${SCENARIOS.supabaseFiveProjects.name} come to ${usd(scenarioUsd(SCENARIOS.supabaseFiveProjects))} a month before disk or egress. That is Supabase pricing per project in one line: the plan, then an instance for every project after the first.

Above the allowances, disk is ${usd(VENDORS.supabase.facts.diskGb.usd)} ${VENDORS.supabase.facts.diskGb.unit}. Egress is ${usd(VENDORS.supabase.facts.egressGb.usd)} ${VENDORS.supabase.facts.egressGb.unit}, or ${usd(VENDORS.supabase.facts.cachedEgressGb.usd)} ${VENDORS.supabase.facts.cachedEgressGb.unit}. The instance runs all month whether anyone queries it or not. That is the trade Supabase makes, and it is a good one for a database that is never idle.

Hosting the app itself is not on this bill. A Supabase project still needs a separate hosting account in front of it, which is why the figure above stacks three receipts.

${checkedLine(VENDORS.supabase)}

## Postgres on ohmyho.st: profiles and credits

ohmyho.st runs your Next.js, Vite/React or TanStack Start app on Workers and provisions a managed Postgres next to it when the app declares one. Nothing carries a base price. Free gets ${number(PLANS.freeCredits)} credits per UTC month. Paid is ${usd(PLANS.paidUsd)} a month for ${number(PLANS.paidCredits)} credits per period. Monthly credits expire at period end; purchased top-ups never expire and grant ${number(PLANS.topUpPerUsd)} credits per dollar, rising to ${number(PLANS.topUpPerUsdAbove100)} per dollar on the part of one checkout above the first hundred dollars.

The database meters two things: compute while it is awake and storage while it exists.

### Three compute profiles

| Profile | Compute | RAM | Suspends after | One active hour |
| --- | --- | --- | --- | --- |
| Free | ${DATABASE_PROFILES.free.cu} CU | 1 GB | 1 minute idle | about ${credits(priceLine("neon.compute.scale", DATABASE_PROFILES.free.cu))} |
| Paid standard | ${DATABASE_PROFILES.standard.cu} CU | 2 GB | 1 minute idle | about ${credits(priceLine("neon.compute.scale", DATABASE_PROFILES.standard.cu))} |
| Paid performance | ${DATABASE_PROFILES.performance.cu} CU | 4 GB | 5 minutes idle | about ${credits(priceLine("neon.compute.performance", DATABASE_PROFILES.performance.cu))} |

The rates behind the table are ${rate("neon.compute.scale")} for Free and standard, and ${rate("neon.compute.performance")} for performance, which is 2.5 times standard compute for the same active minute. A CU-hour is one compute unit busy for one hour, so an hour of queries on the standard profile meters ${DATABASE_PROFILES.standard.cu} CU-hours. A database that answers a burst at 09:00, suspends a minute later and wakes again at noon meters minutes, not the day. Your agent switches profiles with database_compute_set after reading database_compute_get; the first query after a suspend pays a cold start. Details are in the [database docs](https://docs.ohmyho.st/database).

Storage is ${rate("neon.storage.root")} from the first gigabyte; there is no allowance. A deployed script meters ${rate("wfp.script")}. So a project that does nothing still pays for what it keeps: one idle project with 1 GB stored costs about ${credits(priceWorkload(WORKLOADS.idleDatabase).microcredits)} a month.

### Five quiet projects for a month

${workloadTable(WORKLOADS.fiveQuietProjects)}

That fleet fits inside one Paid month with credits to spare, and it is the same five projects that need five instances on Supabase. Every project draws from the organization's one balance. A project may carry a [monthly budget](https://docs.ohmyho.st/budgets) that continues with warnings or stops new work; a zero balance starts a seven-day grace period in which funded services keep running. Automatic recharge is not enabled in the current beta, so you top up on purpose. US is the default region; EU is a per-project choice made once at creation, at identical prices.

## Keep Supabase or import a dump

Both paths are supported and neither is hidden behind the other.

### Path 1: host on ohmyho.st, keep the Supabase project

A Lovable export usually arrives as a Vite/React repository with a Supabase project behind it. You can deploy that repository from GitHub and leave the database, Auth and Storage exactly where they are. The hosted app talks to Supabase over HTTPS through supabase-js; list the project's origin in \`runtime.egress.allow\` in \`ohmyhost.yaml\`, because outbound fetches are denied by default and at most sixteen HTTPS origins are allowed. Public keys stay in the app; private keys go through the stdin-only command from secret_set_command and never through chat. A direct Postgres socket from the Worker to Supabase is not available, so server code uses the HTTPS API as well.

You keep paying Supabase for the database and ohmyho.st meters only the hosting: requests, CPU time, build seconds and the deployed script. The migration Skill's first step, an inventory of what the app actually calls, tells you whether this path is enough. A package name alone is not a reason to move anything.

### Path 2: import the database

Ask for the [migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md). The agent runs \`ohmyhost init --dry-run --json\`, inventories real database queries, RPCs, RLS assumptions, Auth sessions, Storage calls, Edge Functions and Realtime subscriptions, and tells you what moves, what needs source changes and what has no equivalent.

The schema comes from a PostgreSQL schema-only dump of your \`public\` schema (plus an app-owned \`private\` one) and becomes reviewed, additive [migration files](https://docs.ohmyho.st/migrations) named \`YYYYMMDDHHMMSS_name.sql\` in your repository. Supabase's \`auth\` and \`storage\` schemas never enter that output. RLS policies are omitted and counted for review, because data access on ohmyho.st is server-side through the \`OHMYHOST_DATABASE\` binding rather than browser PostgREST calls, and every use case re-proves its authorization in code. Rows go in through a time-bound credential from database_access_create or \`ohmyhost database psql\`, which can write rows but never change schema and is revoked when it expires. The agent verifies reads and writes on Dev, then promotion_plan and promotion_execute apply the migrations to Prod without copying Dev records.

Be clear about what a dump does not carry: Auth users, Storage objects, Edge Functions and Realtime. Each is a separate decision, and the Skill states the gap instead of faking success.

### Leaving has the same shape

Exports on ohmyho.st are on-demand, asynchronous and free. project_export_create returns a password-encrypted ZIP with a portable SQL dump, at most one accepted request per project per rolling 24 hours, downloaded through a signed link valid 24 hours, even at zero credits. Files, source and secrets are not in the archive, and there is no schedule. Restore it on any Postgres, Supabase among them. See [ohmyhost-export-database](/skills/ohmyhost-export-database/SKILL.md) and the [backup docs](https://docs.ohmyho.st/backups).

## Auth stays yours

ohmyho.st is not a Supabase Auth replacement. It has no user pool, no social provider catalog and no MFA service of its own. Application users belong to whichever provider you choose, and two integrations are verified:

- **Better Auth**, the managed integration, selected explicitly in your project configuration. It owns its own \`auth\` schema and database sessions and sends verification and reset mail, so it needs Paid and a verified sender subdomain; your agent sets DKIM and SPF through mail_domain_set and checks them with mail_domain_status.
- **WorkOS AuthKit**, customer-owned. You bring your WorkOS account; the agent configures callback URLs per environment and installs the client secret through secret_set_command.

If you keep the Supabase project, keep Supabase Auth with it; the hosted app still calls it. If you import the dump and want off Supabase Auth, the migration Skill's opt-in mode rewrites \`auth.users\` into Better Auth's UUID \`auth."user"\` table and \`auth.uid()\` into a server-controlled helper. Test login, protected routes, session refresh and logout on Dev before you promote.

Your own login to ohmyho.st, and your agent's, runs through WorkOS and is a separate boundary: identity_get answers who is deploying, never who is signed in to your app. Read [application auth](https://docs.ohmyho.st/application-auth) before choosing.

## Side by side

${comparisonColumns("supabase")}

| | Supabase Pro | ohmyho.st Paid |
| --- | --- | --- |
| Base price | ${usd(VENDORS.supabase.facts.pro.usd)} a month, from | ${usd(PLANS.paidUsd)} a month for ${number(PLANS.paidCredits)} credits |
| Second project | ${usd(VENDORS.supabase.facts.microProject.usd)} a month for its Micro instance | no base fee; it draws from the same balance |
| Database compute | first Micro instance covered, runs all month | ${rate("neon.compute.scale")} on the ${DATABASE_PROFILES.standard.cu} CU standard profile; suspends when idle |
| Disk | ${usd(VENDORS.supabase.facts.diskGb.usd)} ${VENDORS.supabase.facts.diskGb.unit} | ${rate("neon.storage.root")} from the first gigabyte |
| Egress | ${usd(VENDORS.supabase.facts.egressGb.usd)} ${VENDORS.supabase.facts.egressGb.unit} | Workers bandwidth is not charged |
| App hosting | a separate account | Next.js, Vite/React, TanStack Start from GitHub |
| Auth | Supabase Auth | yours: Better Auth or WorkOS AuthKit |
| Realtime | yes | no |
| Getting data out | your own tooling | password-encrypted SQL ZIP, once per project per rolling day, free |

One busy app reads differently from five quiet ones. ${WORKLOADS.smallApp.name} costs about ${credits(priceWorkload(WORKLOADS.smallApp).microcredits)} on ohmyho.st with hosting, mail and database in that figure; a database that never suspends is where Supabase pulls ahead, as the next section shows.

${checkedLine(VENDORS.supabase)}

## When Supabase is the better choice

- **Realtime.** Supabase pushes Postgres changes and presence to the browser. ohmyho.st has no Realtime contract; the migration Skill marks a Realtime subscription as an unsupported blocker rather than quietly replacing it with polling.
- **Vector search.** Supabase documents pgvector as a product path with examples. ohmyho.st makes no claim there.
- **Auth breadth.** Social providers, phone sign-in and MFA out of one hosted user pool. ohmyho.st offers two integrations, and you run them.
- **Edge Functions ecosystem.** A catalog of function templates and integrations next to the database. ohmyho.st runs functions and crons inside your framework's own routes, which is smaller.
- **A database that never sleeps.** ${WORKLOADS.alwaysOnDatabase.name} costs about ${credits(priceWorkload(WORKLOADS.alwaysOnDatabase).microcredits)} on ohmyho.st, about ${creditValueUsd(priceWorkload(WORKLOADS.alwaysOnDatabase).microcredits)} of credit value. Supabase Pro covers that same always-on Micro instance in its base price. Constant traffic belongs on Supabase.
- **A dashboard.** Supabase has a table editor, SQL editor and logs in a browser. On ohmyho.st your agent reads a hundred rows at a time through database_query, and the portal shows projects, credits, budgets and tokens, not your tables.

${checkedLine(VENDORS.supabase)}

## When ohmyho.st is

- **Several small projects.** The five quiet projects above cost about ${credits(priceWorkload(WORKLOADS.fiveQuietProjects).microcredits)} together; on Supabase each one needs its own instance. Nine side projects and two live ones is the normal shape of a builder's account, and no base fee punishes it.
- **Databases that idle.** A portfolio site, an internal tool, a demo for a client: hours of activity a month, not hundreds. Compute suspends a minute after the last query, and storage is the only steady cost.
- **One balance for hosting, Postgres, mail and a domain.** The app, its database, its transactional mail (Paid, metered at ${rate("ses.{region}.recipients (Essentials)")}, To, CC and BCC counted separately) and a linked custom hostname (Paid, ${rate("domain.custom_hostname")}) all draw from the same ${number(PLANS.paidCredits)} credits a month. No second and third account.
- **You deploy from Claude Code, Cursor or Codex.** There is no deploy dashboard. The agent plans, you confirm, it executes: deployment_plan then deployment_create, promotion_plan then promotion_execute, rollback_plan then rollback_execute.
- **EU data per project.** Choose \`eu\` once at project creation and the database, files and builds live in the EU at the same prices. Transactional mail is sent from the platform mail region.
- **A ceiling per project.** project_budget_set gives a project a monthly budget that warns or stops. A zero balance starts a seven-day grace period; funded services keep running.

## How to move with your agent

1. Put the app on GitHub. GitHub is the only deployment source; a Lovable export syncs there, and a hand-written Next.js app already is.
2. Paste the prompt below into Claude Code, Cursor or Codex. The agent reads llms.txt and the get-started Skill, sends you one sign-in link, and links the repository with source_link.
3. Tell it which path: keep Supabase (it adds the origin to \`runtime.egress.allow\` and installs private keys through secret_set_command) or import (it follows the [migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md): inventory, schema dump to migration files, rows through a time-bound credential).
4. Review the plan. deployment_plan quotes the build and lists requirements; deployment_create runs it. The agent verifies the Dev URL through project_dev_access_create with a real login and a real read and write.
5. Promote with promotion_plan, then promotion_execute. Set a ceiling with project_budget_set if you want one.
6. Take a Supabase backup first, cancel Supabase Pro only after Prod checks pass, and keep your ohmyho.st export password somewhere private.

\`\`\`text
${CTA_PROMPT}
\`\`\`

## FAQ

### Does ohmyho.st replace Supabase Auth?

No. ohmyho.st hosts your app and its Postgres; application users stay with a provider you own. Better Auth is the managed integration and needs Paid plus a verified sender subdomain for its mail; customer-owned WorkOS AuthKit is the other verified path. If you keep your Supabase project, keep Supabase Auth with it. Your own ohmyho.st login is a separate WorkOS boundary.

### Can I host on ohmyho.st and keep my Supabase database?

Yes. Deploy the repository from GitHub, list the Supabase project's HTTPS origin in \`runtime.egress.allow\` in \`ohmyhost.yaml\`, and install the private key through secret_set_command. The app keeps calling supabase-js over HTTPS; a direct Postgres socket from the Worker is not available. You keep paying Supabase for the database, and ohmyho.st meters only requests, CPU time, builds and the deployed script.

### What does an idle project cost on ohmyho.st?

Storage and the deployed script. One project with 1 GB stored and nothing happening costs about ${credits(priceWorkload(WORKLOADS.idleDatabase).microcredits)} a month, because compute suspends a minute after the last query and Workers bandwidth is not charged. Five quiet projects that each wake for an hour cost about ${credits(priceWorkload(WORKLOADS.fiveQuietProjects).microcredits)} together, inside the ${number(PLANS.paidCredits)} credits a Paid month grants.

### How do I get my data out again?

Ask your agent for an export. project_export_create returns an asynchronous, password-encrypted ZIP with a portable SQL dump, and the owner chooses the password. One accepted request per project per rolling 24 hours, a signed download link valid 24 hours, retained seven days, free, and available even at zero credits. Files, source and secrets are not in it. Restore it on any Postgres host.

### Is there a per-project fee?

No. Every project draws from the organization's one balance, so a second or fifth project adds only what it uses: build seconds, requests, CPU time, active database hours, stored gigabytes and one deployed script. A project may carry a monthly budget that continues with warnings or stops new work, and the portal at app.ohmyho.st shows credits and budgets per project.

### Can I choose the EU for my database?

Yes, per project and once. Pass \`region: eu\` to project_create and the project's Postgres, files, build sandbox and build objects live in the EU, with the app running next to its database. US is the default, prices are identical in both regions, and the region cannot change after creation. Transactional mail is sent from the platform mail region regardless.

${sourcesSection(VENDORS.supabase, VENDORS.vercel, VENDORS.resend)}

[Compare Vercel](/vs/vercel) · [Move from Vercel and Supabase](/from/vercel-supabase) · [Where your credits go](/pricing/breakdown) · [Supabase vs Vercel: do you need both?](/blog/supabase-vs-vercel-do-you-need-both)`,
};
