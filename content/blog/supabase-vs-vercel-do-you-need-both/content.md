# Supabase vs Vercel: do you need both?

By Sebastian Mertens · September 20, 2026

For most small apps, yes: Vercel Pro is {{ usd vendor.vercel.pro }} a month and Supabase Pro starts at {{ usd vendor.supabase.pro }}, because neither one does the other's half. ohmyho.st puts hosting and Postgres on one balance: {{ usd plan.paidUsd }} a month buys {{ number plan.paidCredits }} credits shared by every project, and a quiet side project uses about {{ credits workload.quietProject }}.

{{ figure bills.supabase }}

## What Vercel does and what it charges

Vercel takes a Git repository, builds the frontend, serves the static files from its CDN and runs the server code as functions. It is very good at that. It does not run a Postgres database of its own; databases on Vercel come through marketplace partners or a separate account, which is where Supabase enters the picture.

Hobby costs {{ usd vendor.vercel.hobby }} and comes with {{ text vendor.vercel.hobby.includes }}. Vercel's own FAQ says Hobby is for personal, non-commercial use (vercel.com/pricing, read 2026-09-20). A client site or an app that takes payments belongs on Pro.

Pro costs {{ usd vendor.vercel.pro }} {{ text vendor.vercel.pro.unit }}. That fee comes back as usage credit each month, so the first {{ usd vendor.vercel.pro }} of function and build usage costs nothing extra; CDN requests and fast data transfer carry no overages on Pro, and viewer seats are free. Each further developer is {{ usd vendor.vercel.developerSeat }} {{ text vendor.vercel.developerSeat.unit }}. Function invocations beyond the credit are {{ usd vendor.vercel.functionInvocations }} {{ text vendor.vercel.functionInvocations.unit }}.

The shape matters more than the number. Vercel bills per seat, not per project, so one developer with nine side projects pays the seat once. That is the good news for a portfolio builder. The bad news is that the seat is due whether the nine projects had a million visitors or none.

{{ checked vercel }}

## What Supabase does and what it charges

Supabase is a Postgres database with a REST API, Auth, Storage, Realtime and Edge Functions wrapped around it, plus a table editor in the browser. It does not host your Next.js app. It hosts the data and the services your app calls.

The Free plan is where most portfolios start, and it has two rules that bite: Supabase pauses a Free project after a short stretch of inactivity, and it limits how many Free projects can be active at once (supabase.com/pricing, read 2026-09-20). A paused project does not answer until you restore it from the dashboard. For a side project that gets a visitor every few weeks, that is a broken link most of the time.

Pro starts at {{ usd vendor.supabase.pro }} a month and includes {{ text vendor.supabase.pro.includes }}. The catch is in the word "first": every further project runs its own compute instance at {{ usd vendor.supabase.microProject }} {{ text vendor.supabase.microProject.unit }}, and a Small instance is {{ usd vendor.supabase.smallProject }} {{ text vendor.supabase.smallProject.unit }}. Disk beyond the allowance is {{ usd vendor.supabase.diskGb }} {{ text vendor.supabase.diskGb.unit }}; egress beyond the allowance is {{ usd vendor.supabase.egressGb }} {{ text vendor.supabase.egressGb.unit }}.

So Supabase bills per project, the opposite of Vercel. The instance runs around the clock and the charge is the same at zero queries and at a thousand. That is fine for one product. It is expensive for a shelf of experiments.

{{ checked supabase }}

## Why most small apps end up with both

Vercel hosts, Supabase stores. A Next.js app with a login form and a table of records needs both halves, so the default stack for a vibe-coded app is Vercel for the app, Supabase for Postgres and Auth, and a third account for transactional mail. The figure above adds Resend Pro for that reason. Three accounts, three dashboards, three invoices, three places where a card can expire.

Nothing is wrong with either product. The problem is how the two pricing shapes combine for one person with several small apps:

- Vercel charges per seat, so the project count does not move the bill.
- Supabase charges per project, so every extra app is another {{ usd vendor.supabase.microProject }} a month on Pro, or a Free project that pauses.
- Neither bill falls when a project goes quiet. Capacity is reserved; usage is not what you pay for.

The portfolio builder's fifth app has a dozen users and a database that wakes up twice a day. On this stack it costs the same as the first app did.

{{ checked supabase }}

## When one balance replaces both

ohmyho.st is hosting for vibe-coded apps. Your coding agent deploys a Next.js, Vite/React or TanStack Start repository from GitHub through MCP tools (`deployment_plan`, then `deployment_create` once you confirm), and every project gets managed Postgres, a Dev host and a Prod host on a three-words.check.omh.st address and, on Paid, a custom domain and sender mail, both of which use credits. All of it is metered from one organization balance. There is no per-project base fee and no deploy dashboard; the portal at app.ohmyho.st shows projects, credits, budgets and API tokens.

The plans are short. Free grants {{ number plan.freeCredits }} credits per UTC month. Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits per period that never expire, and top-ups at {{ number plan.topUpPerUsd }} credits per dollar never expire. One credit is {{ usd plan.usdPerCredit }} of credit value.

The rates a small app meets: {{ rate wfp.requests }}; {{ rate neon.compute.scale }}, so one active hour on the Paid standard {{ value profile.standard.cu }} CU profile is about {{ credits unit.activeDatabaseHourStandard }}; stored data is {{ rate neon.storage.root }}; each deployed script is about {{ credits unit.deployedScriptMonth }} a month. Bandwidth from Workers is not charged. Database compute suspends after a minute idle, so a project nobody visits pays for its stored data and its script, nothing else. That is the property a Supabase Micro instance does not have.

Now the math. Bought separately, one project on Vercel Pro and Supabase Pro is {{ usd scenario.vercelSupabase }} a month before usage; with Resend Pro for mail it is the {{ usd scenario.threeSubscriptions }} in the figure. Five projects on the same Vercel and Supabase accounts are {{ usd scenario.vercelSupabaseFiveProjects }} a month, because four extra Micro instances run around the clock.

On ohmyho.st, five side projects, one of them with real traffic and login mail, look like this:

{{ table workload.portfolio }}

That fits inside the {{ number plan.paidCredits }} credits the Paid plan grants each period. The fixed part is stored data, five scripts and one mail sender zone; everything else only accrues while someone uses an app. For comparison, our separate small-app workload sends more mail and costs about {{ credits workload.smallApp }} on its own; each quiet side project costs about {{ credits workload.quietProject }}. The headroom is real but not huge. If one app gets popular, give it a monthly budget through `project_budget_set` (continue or stop) so it cannot drain the others, and buy a top-up when the balance runs low. A zero balance starts a {{ value plan.graceDays }}-day grace period; funded services keep running, and only unfunded services suspend afterwards.

To try it, open your repository in Claude Code and paste this:

```text
{{ prompt }}
```

{{ checked vercel }}
{{ checked supabase }}
{{ checked resend }}

## When it does not

Be honest about the other direction.

**You use Supabase for more than Postgres.** Auth, Realtime, Storage and Edge Functions are real products, and a SQL dump moves none of them. ohmyho.st does not replace your auth provider; Better Auth and customer-owned WorkOS AuthKit are the verified integrations, and Realtime subscriptions or Edge Functions may have no direct equivalent in the runtime. The [migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) inventories what the app actually calls, converts only what you select and states a gap instead of faking a success. If those services are the app, stay.

**You have one busy app, not many quiet ones.** A single busy production app with millions of requests, hundreds of active database hours, a linked domain and sender mail is about {{ credits workload.busyApp }} a month, roughly {{ usdValue workload.busyApp }} of credit value bought as top-ups. Vercel Pro and Supabase Pro at {{ usd scenario.vercelSupabase }} may well come out cheaper there, before their overages. Metering favors the quiet portfolio; reserved capacity favors the steady product.

**You want previews and a dashboard.** Vercel builds a preview for every branch and lets viewers in for free. ohmyho.st gives each project a Dev host and a Prod host, promotes Dev to Prod through `promotion_plan` and `promotion_execute`, and has no per-branch previews. Deploys go through the agent, not through a web UI.

**Your framework is not on the list.** Supported today: Next.js, Vite/React and TanStack Start, deployed from a GitHub repository you authorize. No containers, no other deployment source. SvelteKit, Nuxt, Astro or a Dockerfile do not run here yet; Vercel runs most of them.

**Everything fits the free tiers.** A personal project with steady traffic on Vercel Hobby at {{ usd vendor.vercel.hobby }} plus a Supabase Free project that never pauses costs nothing, and no balance beats nothing. The case for one balance starts when the pauses, the non-commercial rule or the per-project instances start to hurt.

{{ checked vercel }}
{{ checked supabase }}

## FAQ

### Do I need both Supabase and Vercel?

If you stay with them, yes. Vercel hosts the app and leaves the database to a partner or another account; Supabase hosts the database and does not serve a Next.js app. A database-backed app therefore needs both accounts. The alternative is a host that meters hosting and Postgres from one balance, which is what ohmyho.st does: no per-project base fee, one pool of credits shared by every project.

### Can I keep Supabase and move only the hosting?

Yes. The migration Skill inventories what the app really uses and converts only the capabilities you select; the rest stays external. An app that talks to Supabase over its HTTPS API keeps doing so once the agent lists that origin in the app's egress rules, and you keep paying Supabase for it. Move the database later, or never.

### What happens to my Supabase Auth users?

They do not travel inside a SQL dump. ohmyho.st does not replace your auth provider: Better Auth and customer-owned WorkOS AuthKit are the verified integrations, and the platform login is separate from your application's users. The migration Skill asks you to decide before touching Auth, then tests login, a protected route, reload and logout on the Dev host before anything is promoted.

### What does a quiet side project cost on ohmyho.st?

About {{ credits workload.quietProject }} a month, or about {{ usdValue workload.quietProject }} of credit value: one active database hour, a little stored data, a few thousand requests and one deployed script. Idle database compute suspends after a minute; stored data at {{ rate neon.storage.root }} and the script keep using credits while the project exists.

### Can I take my database with me later?

Yes. An Owner asks the agent for an export through `project_export_create`: an asynchronous, password-encrypted ZIP holding a portable SQL dump, one accepted request per project in any rolling 24-hour window, downloaded through a signed link that stays valid for 24 hours. Exports are free and work at zero credits. Restore the dump on any Postgres host, including Supabase.

{{ sources vercel supabase resend }}

[Compare Supabase](/vs/supabase) · [Compare Vercel](/vs/vercel) · [From Vercel and Supabase](/from/vercel-supabase)
