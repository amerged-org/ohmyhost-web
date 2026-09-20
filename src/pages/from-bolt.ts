import type { ContentPage } from "../content/types.js";
import {
  CTA_PROMPT,
  checkedLine,
  credits,
  number,
  priceLine,
  rate,
  sourcesSection,
  usd,
  workloadTable,
} from "../content/format.js";
import { DATABASE_PROFILES, PLANS, VENDORS, WORKLOADS } from "../content/sources.js";
import { figureFlow } from "../figures.js";

export const page: ContentPage = {
  path: "/from/bolt",
  title: `Deploy a Bolt.new export: host your Bolt app — ohmyho.st`,
  description: `Exported from Bolt.new? Connect GitHub or push the ZIP, paste one prompt, and your agent recreates the .env, deploys to Dev and promotes to Prod on ohmyho.st.`,
  kind: "howto",
  modified: "2026-09-20",
  crumb: "From Bolt",
  markdown: `# Deploy a Bolt.new export: host your Bolt app on ohmyho.st

A Bolt.new export is a repository, usually Vite and React with Supabase. Connect GitHub in Bolt, paste one prompt into your coding agent, and ohmyho.st builds it, deploys it to a Dev host and promotes it to Prod. Free is ${number(PLANS.freeCredits)} credits a month; Paid is ${usd(PLANS.paidUsd)} for ${number(PLANS.paidCredits)}. The .env is yours to recreate.

${figureFlow("Bolt export")}

## Export from Bolt

Bolt gives you two ways out, and only one of them lands where ohmyho.st can read it.

**GitHub connection.** Connect GitHub from the project's settings. Bolt creates a private repository on a main branch and commits every change that does not break the project (support.bolt.new/integrations/git, read 2026-09-20). This is the path to use: GitHub is the only deployment source on ohmyho.st, so the repository Bolt just made is exactly what your agent links. Bolt keeps committing to that branch while the connection is on. Decide who owns main before your agent starts editing; two authors on one branch is how a working app ends up with a broken lockfile.

**ZIP download.** The download gives you the code and nothing else: no .env values, no Supabase keys, no database rows, no uploaded files. To host it you create a private repository yourself, push the ZIP contents to it and continue with the same prompt.

Either way, check the framework first. ohmyho.st runs Vite with React, Next.js and TanStack Start from a GitHub repository. A Bolt project built on Expo, Astro or SvelteKit is outside that set and will not deploy here. There are no containers.

## What breaks after export

Three things stop working the moment the code leaves Bolt. None of them is a surprise once you know where to look.

**The .env must be recreated.** Bolt's Supabase integration kept the project URL and anon key in an environment file that the ZIP does not carry and the repository should not. Those two are public client values by design, so they can live in the repository's Vite environment file. Anything private, such as a third-party API key or a Supabase service-role key, is different: your agent asks for it with the stdin-only command from \`secret_set_command\`, per environment, and the value never enters the chat. A browser bundle cannot hold a private key at all; if your Bolt app called a service-role key from the browser, that is a bug to fix before hosting, not a secret to move. Read [secrets](https://docs.ohmyho.st/secrets) for the exact command shape.

**Callback URLs point at the old host.** Every project gets a Dev and a Prod host on \`<three-words>.check.omh.st\`. Supabase Auth, Better Auth, WorkOS AuthKit and any OAuth provider still list Bolt's preview or Netlify URL. Add the Dev host first, the Prod host after promotion and your own domain last. The agent tests a real login on each one; the ohmyho.st login is separate from your app's users. Details in [application auth](https://docs.ohmyho.st/application-auth).

**SPA rewrites are Netlify files.** Bolt's built-in hosting is Netlify, so a \`_redirects\` or \`netlify.toml\` rule sends every path to \`index.html\` for React Router. Those files mean nothing on ohmyho.st. Your agent runs \`ohmyhost init --dry-run\` to read what the Vite build needs, then loads a deep link such as \`/settings\` after a reload on Dev before promoting. A route that works only from the home page is the most common first bug after a Bolt export.

Two smaller ones. Bolt projects rarely pin a package manager, and ohmyho.st needs exactly one \`packageManager\` field with one matching lockfile; the agent adds it. Supabase Realtime has no conversion path here; if your app subscribes to live rows, keep that part on Supabase.

## Paste this prompt

Open the repository in Claude Code, Cursor or Codex and paste this. The agent reads the Skill, installs the CLI and the MCP server if they are missing, and shows you a sign-in link with a confirmation code. You sign in once in the browser; the agent does the rest through the 62 MCP tools.

\`\`\`text
${CTA_PROMPT}
\`\`\`

Every expensive step is two calls: \`deployment_plan\` shows the quoted build and its effects, \`deployment_create\` runs it only after you confirm. The same pattern covers promotion, rollback and deletion.

## How to move your app from Bolt

1. Export. Connect GitHub in Bolt, or push the ZIP contents to a new private repository. Confirm the main branch holds the version you want to host, then stop editing in Bolt or accept that its commits keep landing on main.
2. Inventory. The agent runs \`ohmyhost init --dry-run\` and reports blockers: framework and version, package manager pin, Netlify-only files and which Supabase capabilities the code actually uses. A package name alone is not a reason to replace anything.
3. Decide about Supabase. Keep it, and your app talks to the same project from the new host; only the callback URLs change. Or migrate the database to managed Postgres with the [Supabase migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md), which converts the capabilities you select and leaves your auth provider alone unless you ask.
4. Create and link. The agent creates the project with \`project_create\`, choosing US or EU once (the region cannot change later and prices are identical), then authorizes the repository through \`source_link\` and one GitHub consent screen. Isolated Dev and Prod data is the recommendation; two databases consume credits separately.
5. Plan, set secrets, deploy. \`deployment_plan\` quotes the build. You supply private values through the command from \`secret_set_command\` for the Dev environment. \`deployment_create\` starts the build; the agent polls \`operation_get\` until it is done.
6. Verify Dev, then promote. Dev is private: \`project_dev_access_create\` returns a single-use link. Test a deep-link reload, a login and one write. Then \`promotion_plan\` and \`promotion_execute\` move the same artifact to Prod without a rebuild and without copying Dev records over Prod data. Update the Prod callback URLs.

Read the [deployment Skill](/skills/ohmyhost-deploy-github/SKILL.md) for every command and the [Vite guide](https://docs.ohmyho.st/frameworks/vite) for the runtime contract.

## Custom domain and mail (Paid, metered)

The platform host works on Free. Your own domain and transactional mail need Paid, which is ${usd(PLANS.paidUsd)} a month for ${number(PLANS.paidCredits)} credits, and both use credits on top.

**Domain.** The agent calls \`domain_paid_plan\` for the hostname, shows the CNAME and validation records, then \`domain_paid_apply\`. If your DNS is on Cloudflare, \`domain_cloudflare_authorize\` lets the platform set the records for you; otherwise you paste them at your DNS provider. A linked hostname is metered at ${rate("domain.custom_hostname")}, about ${credits(priceLine("domain.custom_hostname", 1))} a month. Once \`domain_paid_status\` reports HTTPS ready, the agent updates your auth provider's callback URLs one last time. Read [domains](https://docs.ohmyho.st/domains).

**Mail.** If your Bolt app sends its own mail (welcome, reset, receipts) through Supabase Auth or an external provider, that keeps working unchanged. If you want ohmyho.st to send, the agent runs \`mail_domain_set\` for a sender subdomain, you add four NS records, and \`mail_domain_status\` reports DKIM and SPF verification. The sender zone is metered at ${rate("route53.zone")}, about ${credits(priceLine("route53.zone", 1))} a month, and every send at ${rate("ses.{region}.recipients (Essentials)")}; To, CC and BCC each count as one recipient. Transactional mail is sent from the platform mail region regardless of your project's region. Read [email](https://docs.ohmyho.st/email).

## What it costs

There is no per-project fee. Every project draws from your organization's one balance: Free grants ${number(PLANS.freeCredits)} credits per UTC month, Paid grants ${number(PLANS.paidCredits)} credits per period for ${usd(PLANS.paidUsd)}, and both expire at period end. Top-ups never expire: ${number(PLANS.topUpPerUsd)} credits per dollar up to ${usd(100)}, ${number(PLANS.topUpPerUsdAbove100)} per dollar for the part above. Automatic recharge is not enabled in the current beta.

A Bolt export that keeps Supabase is close to the cheapest thing you can host. There is no database here to meter, and Workers bandwidth is not charged.

${workloadTable(WORKLOADS.boltKeepSupabase)}

That fits inside the Free ${number(PLANS.freeCredits)} credits with room to spare. Move the database to managed Postgres and add your own domain, and the picture looks like this:

${workloadTable(WORKLOADS.boltOwnDomain)}

The database line is the one to watch. One active hour on the Paid standard ${DATABASE_PROFILES.standard.cu} CU profile is about ${credits(priceLine("neon.compute.scale", DATABASE_PROFILES.standard.cu))}; idle compute suspends after a minute and is not metered while it sleeps, but retained storage keeps metering at ${rate("neon.storage.root")}. Each deployed script (about ${credits(priceLine("wfp.script", 1))} a month) and a linked hostname keep using credits while the app sits there. A project may carry a monthly budget that either continues from the shared pool or stops new billable work; the agent reads it with \`project_budget_get\`. A zero balance starts a seven-day grace period during which funded services keep running.

Keeping Supabase means Supabase keeps billing you. Its free tier stays free; Supabase Pro starts at ${usd(VENDORS.supabase.facts.pro.usd)} a month for the first project's compute, and that invoice does not move to ohmyho.st. ${checkedLine(VENDORS.supabase)}

## FAQ

### Do I have to leave Supabase?

No. Keep the Supabase project, add the new Dev and Prod hosts to its redirect URLs, and the app talks to it from ohmyho.st like it did from Netlify. Migrate only the capabilities you choose, database first; Realtime has no conversion here and stays on Supabase. Your auth provider is never swapped without your decision.

### Can I keep editing in Bolt after the move?

You can, but pick one author for main. Bolt commits every non-breaking change to the connected branch, and your agent deploys the exact commit you name, so a Bolt edit that lands mid-review is not in the plan you confirmed. Most people finish in Bolt, export once and continue in Claude Code or Cursor.

### Does the ZIP export include my database?

No. The ZIP carries code only; database rows, uploaded files and secret values stay in Supabase and in Bolt's settings. To move rows, take a Supabase Postgres dump and let the migration Skill convert the schema you select. Files move through the runtime storage client, and secrets are re-entered per environment through the stdin-only command.

### What happens when my credits run out?

A zero balance starts one seven-day grace period; your app, database and domain keep running through it. After it, only unfunded services suspend, and your data, an SQL export and buying credit stay available. A Paid subscription or a top-up clears it. A project budget in stop mode blocks new billable work earlier, on that project alone.

### Can I get my data out again?

Yes, on demand. The Owner asks for an export and receives a password-encrypted ZIP with a portable SQL dump, at most one accepted request per project per rolling 24 hours, downloadable through a signed link valid for 24 hours. It is free, works at zero credits and restores on any Postgres host. There is no schedule and no bucket destination. Read [backups](https://docs.ohmyho.st/backups).

${sourcesSection(VENDORS.supabase)}

[From Lovable](/from/lovable) · [Deploy from Claude Code](/for/claude-code) · [Cost breakdown](/pricing/breakdown) · [Host a Lovable app after export](/blog/host-a-lovable-app-after-export)`,
};
