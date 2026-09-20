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
import { figureBills } from "../figures.js";

export const page: ContentPage = {
  path: "/blog/supabase-vs-vercel-do-you-need-both",
  title: `Supabase vs Vercel: do you need both? — ohmyho.st`,
  description: `Vercel hosts the app, Supabase holds the data, and a portfolio of side projects pays for both. List prices, the credit math and when one balance is enough.`,
  kind: "article",
  published: "2026-09-20",
  modified: "2026-09-20",
  parent: "/blog",
  crumb: "Supabase vs Vercel",
  markdown: `# Supabase vs Vercel: do you need both?

By Sebastian Mertens · September 20, 2026

For most small apps, yes: Vercel Pro is ${usd(VENDORS.vercel.facts.pro.usd)} a month and Supabase Pro starts at ${usd(VENDORS.supabase.facts.pro.usd)}, because neither one does the other's half. ohmyho.st puts hosting and Postgres on one balance: ${usd(PLANS.paidUsd)} a month buys ${number(PLANS.paidCredits)} credits shared by every project, and a quiet side project uses about ${credits(priceWorkload(WORKLOADS.quietProject).microcredits)}.

${figureBills("supabase")}

## What Vercel does and what it charges

Vercel takes a Git repository, builds the frontend, serves the static files from its CDN and runs the server code as functions. It is very good at that. It does not run a Postgres database of its own; databases on Vercel come through marketplace partners or a separate account, which is where Supabase enters the picture.

Hobby costs ${usd(VENDORS.vercel.facts.hobby.usd)} and comes with ${VENDORS.vercel.facts.hobby.includes}. Vercel's own FAQ says Hobby is for personal, non-commercial use (vercel.com/pricing, read 2026-09-20). A client site or an app that takes payments belongs on Pro.

Pro costs ${usd(VENDORS.vercel.facts.pro.usd)} ${VENDORS.vercel.facts.pro.unit}. That fee comes back as usage credit each month, so the first ${usd(VENDORS.vercel.facts.pro.usd)} of function and build usage costs nothing extra; CDN requests and fast data transfer carry no overages on Pro, and viewer seats are free. Each further developer is ${usd(VENDORS.vercel.facts.developerSeat.usd)} ${VENDORS.vercel.facts.developerSeat.unit}. Function invocations beyond the credit are ${usd(VENDORS.vercel.facts.functionInvocations.usd)} ${VENDORS.vercel.facts.functionInvocations.unit}.

The shape matters more than the number. Vercel bills per seat, not per project, so one developer with nine side projects pays the seat once. That is the good news for a portfolio builder. The bad news is that the seat is due whether the nine projects had a million visitors or none.

${checkedLine(VENDORS.vercel)}

## What Supabase does and what it charges

Supabase is a Postgres database with a REST API, Auth, Storage, Realtime and Edge Functions wrapped around it, plus a table editor in the browser. It does not host your Next.js app. It hosts the data and the services your app calls.

The Free plan is where most portfolios start, and it has two rules that bite: Supabase pauses a Free project after a short stretch of inactivity, and it limits how many Free projects can be active at once (supabase.com/pricing, read 2026-09-20). A paused project does not answer until you restore it from the dashboard. For a side project that gets a visitor every few weeks, that is a broken link most of the time.

Pro starts at ${usd(VENDORS.supabase.facts.pro.usd)} a month and includes ${VENDORS.supabase.facts.pro.includes}. The catch is in the word "first": every further project runs its own compute instance at ${usd(VENDORS.supabase.facts.microProject.usd)} ${VENDORS.supabase.facts.microProject.unit}, and a Small instance is ${usd(VENDORS.supabase.facts.smallProject.usd)} ${VENDORS.supabase.facts.smallProject.unit}. Disk beyond the allowance is ${usd(VENDORS.supabase.facts.diskGb.usd)} ${VENDORS.supabase.facts.diskGb.unit}; egress beyond the allowance is ${usd(VENDORS.supabase.facts.egressGb.usd)} ${VENDORS.supabase.facts.egressGb.unit}.

So Supabase bills per project, the opposite of Vercel. The instance runs around the clock and the charge is the same at zero queries and at a thousand. That is fine for one product. It is expensive for a shelf of experiments.

${checkedLine(VENDORS.supabase)}

## Why most small apps end up with both

Vercel hosts, Supabase stores. A Next.js app with a login form and a table of records needs both halves, so the default stack for a vibe-coded app is Vercel for the app, Supabase for Postgres and Auth, and a third account for transactional mail. The figure above adds Resend Pro for that reason. Three accounts, three dashboards, three invoices, three places where a card can expire.

Nothing is wrong with either product. The problem is how the two pricing shapes combine for one person with several small apps:

- Vercel charges per seat, so the project count does not move the bill.
- Supabase charges per project, so every extra app is another ${usd(VENDORS.supabase.facts.microProject.usd)} a month on Pro, or a Free project that pauses.
- Neither bill falls when a project goes quiet. Capacity is reserved; usage is not what you pay for.

The portfolio builder's fifth app has a dozen users and a database that wakes up twice a day. On this stack it costs the same as the first app did.

${checkedLine(VENDORS.supabase)}

## When one balance replaces both

ohmyho.st is hosting for vibe-coded apps. Your coding agent deploys a Next.js, Vite/React or TanStack Start repository from GitHub through MCP tools (\`deployment_plan\`, then \`deployment_create\` once you confirm), and every project gets managed Postgres, a Dev host and a Prod host on a three-words.check.omh.st address and, on Paid, a custom domain and sender mail, both of which use credits. All of it is metered from one organization balance. There is no per-project base fee and no deploy dashboard; the portal at app.ohmyho.st shows projects, credits, budgets and API tokens.

The plans are short. Free grants ${number(PLANS.freeCredits)} credits per UTC month. Paid is ${usd(PLANS.paidUsd)} a month for ${number(PLANS.paidCredits)} credits per period; those expire at period end, while top-ups at ${number(PLANS.topUpPerUsd)} credits per dollar never expire. One credit is ${usd(PLANS.usdPerCredit)} of credit value.

The rates a small app meets: ${rate("wfp.requests")}; ${rate("neon.compute.scale")}, so one active hour on the Paid standard ${DATABASE_PROFILES.standard.cu} CU profile is about ${credits(priceLine("neon.compute.scale", DATABASE_PROFILES.standard.cu))}; stored data is ${rate("neon.storage.root")}; each deployed script is about ${credits(priceLine("wfp.script", 1))} a month. Bandwidth from Workers is not charged. Database compute suspends after a minute idle, so a project nobody visits pays for its stored data and its script, nothing else. That is the property a Supabase Micro instance does not have.

Now the math. Bought separately, one project on Vercel Pro and Supabase Pro is ${usd(scenarioUsd(SCENARIOS.vercelSupabase))} a month before usage; with Resend Pro for mail it is the ${usd(scenarioUsd(SCENARIOS.threeSubscriptions))} in the figure. Five projects on the same Vercel and Supabase accounts are ${usd(scenarioUsd(SCENARIOS.vercelSupabaseFiveProjects))} a month, because four extra Micro instances run around the clock.

On ohmyho.st, five side projects, one of them with real traffic and login mail, look like this:

${workloadTable(WORKLOADS.portfolio)}

That fits inside the ${number(PLANS.paidCredits)} credits the Paid plan grants each period. The fixed part is stored data, five scripts and one mail sender zone; everything else only accrues while someone uses an app. On its own, the small app is about ${credits(priceWorkload(WORKLOADS.smallApp).microcredits)} and each quiet side project about ${credits(priceWorkload(WORKLOADS.quietProject).microcredits)}. The headroom is real but not huge. If one app gets popular, give it a monthly budget through \`project_budget_set\` (continue or stop) so it cannot drain the others, and buy a top-up when the balance runs low. A zero balance starts a ${PLANS.graceDays}-day grace period; funded services keep running, and only unfunded services suspend afterwards.

To try it, open your repository in Claude Code and paste this:

\`\`\`text
${CTA_PROMPT}
\`\`\`

${checkedLine(VENDORS.vercel)}
${checkedLine(VENDORS.supabase)}
${checkedLine(VENDORS.resend)}

## When it does not

Be honest about the other direction.

**You use Supabase for more than Postgres.** Auth, Realtime, Storage and Edge Functions are real products, and a SQL dump moves none of them. ohmyho.st does not replace your auth provider; Better Auth and customer-owned WorkOS AuthKit are the verified integrations, and Realtime subscriptions or Edge Functions may have no direct equivalent in the runtime. The [migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) inventories what the app actually calls, converts only what you select and states a gap instead of faking a success. If those services are the app, stay.

**You have one busy app, not many quiet ones.** A single busy production app with millions of requests, hundreds of active database hours, a linked domain and sender mail is about ${credits(priceWorkload(WORKLOADS.busyApp).microcredits)} a month, roughly ${creditValueUsd(priceWorkload(WORKLOADS.busyApp).microcredits)} of credit value bought as top-ups. Vercel Pro and Supabase Pro at ${usd(scenarioUsd(SCENARIOS.vercelSupabase))} may well come out cheaper there, before their overages. Metering favors the quiet portfolio; reserved capacity favors the steady product.

**You want previews and a dashboard.** Vercel builds a preview for every branch and lets viewers in for free. ohmyho.st gives each project a Dev host and a Prod host, promotes Dev to Prod through \`promotion_plan\` and \`promotion_execute\`, and has no per-branch previews. Deploys go through the agent, not through a web UI.

**Your framework is not on the list.** Supported today: Next.js, Vite/React and TanStack Start, deployed from a GitHub repository you authorize. No containers, no other deployment source. SvelteKit, Nuxt, Astro or a Dockerfile do not run here yet; Vercel runs most of them.

**Everything fits the free tiers.** A personal project with steady traffic on Vercel Hobby at ${usd(VENDORS.vercel.facts.hobby.usd)} plus a Supabase Free project that never pauses costs nothing, and no balance beats nothing. The case for one balance starts when the pauses, the non-commercial rule or the per-project instances start to hurt.

${checkedLine(VENDORS.vercel)}
${checkedLine(VENDORS.supabase)}

## FAQ

### Do I need both Supabase and Vercel?

If you stay with them, yes. Vercel hosts the app and leaves the database to a partner or another account; Supabase hosts the database and does not serve a Next.js app. A database-backed app therefore needs both accounts. The alternative is a host that meters hosting and Postgres from one balance, which is what ohmyho.st does: no per-project base fee, one pool of credits shared by every project.

### Can I keep Supabase and move only the hosting?

Yes. The migration Skill inventories what the app really uses and converts only the capabilities you select; the rest stays external. An app that talks to Supabase over its HTTPS API keeps doing so once the agent lists that origin in the app's egress rules, and you keep paying Supabase for it. Move the database later, or never.

### What happens to my Supabase Auth users?

They do not travel inside a SQL dump. ohmyho.st does not replace your auth provider: Better Auth and customer-owned WorkOS AuthKit are the verified integrations, and the platform login is separate from your application's users. The migration Skill asks you to decide before touching Auth, then tests login, a protected route, reload and logout on the Dev host before anything is promoted.

### What does a quiet side project cost on ohmyho.st?

About ${credits(priceWorkload(WORKLOADS.quietProject).microcredits)} a month, or about ${creditValueUsd(priceWorkload(WORKLOADS.quietProject).microcredits)} of credit value: one active database hour, a little stored data, a few thousand requests and one deployed script. Idle database compute suspends after a minute; stored data at ${rate("neon.storage.root")} and the script keep using credits while the project exists.

### Can I take my database with me later?

Yes. An Owner asks the agent for an export through \`project_export_create\`: an asynchronous, password-encrypted ZIP holding a portable SQL dump, one accepted request per project in any rolling 24-hour window, downloaded through a signed link that stays valid for 24 hours. Exports are free and work at zero credits. Restore the dump on any Postgres host, including Supabase.

${sourcesSection(VENDORS.vercel, VENDORS.supabase, VENDORS.resend)}

[Compare Supabase](/vs/supabase) · [Compare Vercel](/vs/vercel) · [From Vercel and Supabase](/from/vercel-supabase)`,
};
