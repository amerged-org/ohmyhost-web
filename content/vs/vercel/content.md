# Vercel alternative with a database: ohmyho.st vs Vercel

You ship the app on Vercel, the database on Supabase and the mail on Resend. That is three dashboards, three invoices and three usage models to keep in your head — and the two side projects nobody visited this month cost you exactly as much as the one that did.

ohmyho.st puts those four pieces on one prepaid balance. {{ usd plan.paidUsd }} a month buys {{ number plan.paidCredits }} credits, every project you run draws from the same balance, and a quiet project spends almost nothing. Vercel Pro alone is {{ usd vendor.vercel.pro }} a month before you have a database or a way to send a password-reset mail; the usual three-subscription stack is {{ usd scenario.threeSubscriptions }} a month. A small app here uses about {{ credits workload.smallApp }} a month.

{{ figure bills.vercel }}

## What Vercel charges

Vercel sells the front end and its functions, and charges for every person who deploys. It does not run your Postgres and it does not send your mail. That is where the second and third subscription come from — not from Vercel being expensive, but from Vercel being one part of what an app needs.

- Hobby: {{ usd vendor.vercel.hobby }} {{ text vendor.vercel.hobby.unit }}, with {{ text vendor.vercel.hobby.includes }}. Vercel states that Hobby is for personal, non-commercial use (vercel.com/pricing, read 2026-09-20), so a project that earns money belongs on Pro.
- Pro: {{ usd vendor.vercel.pro }} {{ text vendor.vercel.pro.unit }}. The price carries {{ usd vendor.vercel.pro }} of usage credit each month to spend across resources, and viewer seats are free.
- Seats: {{ usd vendor.vercel.developerSeat }} {{ text vendor.vercel.developerSeat.unit }}. A second person who deploys doubles the base: Pro with one extra developer seat is {{ usd scenario.vercelProTwoSeats }} a month.
- Overages: {{ usd vendor.vercel.functionInvocations }} {{ text vendor.vercel.functionInvocations.unit }}. On the current Pro CDN tier, CDN requests and fast data transfer carry no overage charge.

The database and the mail are where the bill grows. Supabase Pro starts at {{ usd vendor.supabase.pro }} a month and covers the first project's Micro instance through its compute credits; every further project's Micro instance adds {{ usd vendor.supabase.microProject }} a month. Resend Free is {{ usd vendor.resend.free }} with {{ text vendor.resend.free.includes }}. Resend Pro is {{ usd vendor.resend.pro }} {{ text vendor.resend.pro.unit }} with {{ text vendor.resend.pro.includes }}.

One developer with one project on all three accounts: {{ usd scenario.threeSubscriptions }} a month before any usage above the allowances. The same accounts with five projects: {{ usd scenario.fiveProjects }} a month, because every extra Supabase project pays its own instance while Vercel Pro and Resend Pro stay the same.

{{ checked vercel }} {{ checked supabase }} {{ checked resend }}

## What ohmyho.st charges for the same small app

One balance, every project, no seat price. {{ usd plan.paidUsd }} a month buys {{ number plan.paidCredits }} credits that expire at the end of the paid period. Free gets {{ number plan.freeCredits }} credits per UTC month. Top-ups never expire: {{ number plan.topUpPerUsd }} credits per dollar, and {{ number plan.topUpPerUsdAbove100 }} per dollar on the part of a larger purchase. A credit has a nominal value of {{ usd plan.usdPerCredit }}. There is no per-project base fee and no seat price: an organization has one balance, every project draws from it, and a second person who deploys costs nothing extra.

This is hosting for vibe-coded apps priced by what the app measures. Here is the workload the [rate card](https://docs.ohmyho.st/pricing) prices for a small app with some traffic, some mail and a database that is awake for a few hours a day:

{{ table workload.smallApp }}

Read the table from the largest line down. The database is most of the bill. One active hour on the Paid standard profile ({{ value profile.standard.cu }} CU) is about {{ credits unit.activeDatabaseHourStandard }}; compute suspends after a minute of idle, so a project nobody visits stops paying for compute and pays only for what it keeps. Stored data is {{ rate neon.storage.root }}. Requests are {{ rate wfp.requests }}, and bandwidth from the Worker is not charged. Mail is {{ rate ses.{region}.recipients (Essentials) }}, counted per recipient with To, CC and BCC separate; sending needs Paid and a verified sender subdomain.

Three things keep drawing credits while a project sits still: each deployed script, about {{ credits unit.deployedScriptMonth }} a month; a linked custom hostname, about {{ credits unit.customHostnameMonth }} a month on Paid; and a mail sender zone, about {{ credits unit.mailSenderZoneMonth }} a month on Paid. SQL exports are free. A quiet side project whose database wakes for one hour a month costs about {{ credits workload.quietProject }}. Five of them cost about {{ credits workload.fiveQuietProjects }}, which leaves most of the monthly {{ number plan.paidCredits }} unused.

## Side by side

{{ figure comparison.vercel }}

The left card is one developer and one project. It costs {{ usd scenario.threeSubscriptions }} before any usage above the allowances and before a second developer seat. Add four more projects to the same accounts and the left card becomes {{ usd scenario.fiveProjects }}, because each Supabase project after the first pays {{ usd vendor.supabase.microProject }} a month. The right card stays at {{ usd plan.paidUsd }} whether you run one project or nine; what changes is how fast the {{ number plan.paidCredits }} credits go. The small app above uses about {{ credits workload.smallApp }} of them, {{ usdValue workload.smallApp }} of credit value.

The trade-off is metering with no quota to hide behind. One busy production app, with a database awake for 200 hours a month, 5M requests and 20,000 mail recipients, uses about {{ credits workload.busyApp }}: {{ usdValue workload.busyApp }} of credit value against {{ usd scenario.threeSubscriptions }} for the three subscriptions. Many quiet projects favor ohmyho.st; one loud one favors Vercel and Supabase.

{{ checked vercel }} {{ checked supabase }} {{ checked resend }}

## When Vercel is the better choice

- One loud app instead of many quiet ones. Once your database is awake most of the day, a fixed-price Supabase instance beats per-hour metering: the busy workload above is {{ usdValue workload.busyApp }} of credit value a month, and it grows with traffic.
- A framework ohmyho.st does not run. The runtime takes Next.js, Vite with React and TanStack Start from a GitHub repository; nothing else, and no containers. Astro, SvelteKit, Nuxt and Remix deploy on Vercel and not here.
- The newest Next.js features. Next.js is Vercel's framework, and its Vercel-specific features land there first. ohmyho.st builds Next.js with its own adapter for Cloudflare Workers, so check a feature on Dev before you depend on it.
- A team that wants a dashboard. Vercel previews every branch and gives the whole team a dashboard with free viewer seats. ohmyho.st has exactly two environments per project, Dev and Prod, and no deploy dashboard; a coding agent runs the deploy through MCP, and the portal only shows projects, credits, budgets and tokens.
- A non-commercial site with no database. Vercel Hobby at {{ usd vendor.vercel.hobby }} carries {{ text vendor.vercel.hobby.includes }}. ohmyho.st Free is {{ number plan.freeCredits }} credits a month at the same rates as Paid, with requests at {{ rate wfp.requests }}. For a static portfolio with no database both cost nothing; compare the two allowances against your real traffic.
- You do not work with a coding agent. There is no button to press here. If you want to push to main and forget about it, Vercel's git integration does that on its own.

{{ checked vercel }} {{ checked supabase }}

## When ohmyho.st is

- Several small projects, most of them idle. There is no per-project base fee and no seat price. Five quiet projects cost about {{ credits workload.fiveQuietProjects }} a month in total, and a project nobody visits keeps paying only for its stored data and its deployed script.
- You want the database and the mail on the same balance as the hosting. Postgres, transactional mail and a custom domain are metered from the same {{ number plan.paidCredits }} credits, so the second and third account become optional. Your [application auth](https://docs.ohmyho.st/application-auth) stays yours: Better Auth and a customer-owned WorkOS AuthKit are the verified integrations, and the platform login is separate from your app's users.
- You deploy from Claude Code, Cursor or Codex. The agent has {{ tools }} MCP tools. Every expensive or destructive action is two steps: deployment_plan then deployment_create, promotion_plan then promotion_execute, rollback_plan then rollback_execute, delete_plan then delete_execute. You read the plan and confirm; nothing runs on its own.
- You want a database you can leave with. project_export_create returns a password-encrypted ZIP with a portable SQL dump, on demand, at most one accepted request per project per rolling 24 hours, with a signed download link valid for 24 hours. It is free and it works at zero credits ([backups](https://docs.ohmyho.st/backups)).
- You want one project in the EU and the rest in the US. Region is chosen once per project at creation; US is the default and prices are identical. Transactional mail is sent from the platform mail region regardless.
- You want a ceiling instead of an invoice. A project can carry a monthly [budget](https://docs.ohmyho.st/budgets) set to continue or stop. A zero balance starts a {{ number plan.graceDays }}-day grace period in which funded services keep running; afterwards only unfunded services suspend. Automatic recharge is not enabled yet, so nothing charges your card without you.

## How to move with your agent

Hosting moves first; the database moves only if you want it to. If your app uses Supabase purely as Postgres, the [migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) converts the queries to the managed database binding, keeps the versioned migrations and verifies reads and writes on Dev. If it uses Supabase Auth, Storage, Realtime or Edge Functions, keep Supabase as an external service and point the hosted app at it: a database dump does not migrate those services, and the Skill says which capability stays external before it changes anything. Resend can stay the same way until you want mail metered here.

Push the app to GitHub first; a GitHub repository you authorize is the only deployment source. Then paste this prompt into Claude Code, Cursor or Codex with the repository open:

```text
{{ prompt }}
```

What happens next, step by step:

1. The agent checks what is installed and signed in. If nothing is, it sends you one browser link with a confirmation code; you sign in once and it verifies the session with a command.
2. It connects GitHub once through `github_connect`, then runs `ohmyhost init --dry-run` on the repository and reports blockers and requirements before anything is built.
3. It creates the project with `project_create`, asking once for US or EU and for isolated or shared Dev/Prod data, then asks for a `deployment_plan`. You read the plan, including the build cost it reserves, and confirm; `deployment_create` builds the commit. Secrets travel through the stdin-only CLI command returned by `secret_set_command`, never pasted into chat.
4. Dev is private. `project_dev_access_create` gives you a single-use link; test login, a protected route and a real read and write. Then `promotion_plan` and `promotion_execute` publish to Prod at your project's three-word host on check.omh.st without a rebuild.
5. On Paid, `domain_paid_plan` then `domain_paid_apply` link your own hostname, and `mail_domain_set` then `mail_domain_status` set up the sender subdomain's DKIM and SPF and wait for verification. Move your DNS when Prod works, then cancel the Vercel Pro seat.

## FAQ

### Is ohmyho.st cheaper than Vercel?

For a portfolio of small apps, usually. {{ usd plan.paidUsd }} a month buys {{ number plan.paidCredits }} credits shared by every project, and the small app above uses about {{ credits workload.smallApp }} of them. Vercel Pro is priced per developer seat and still needs a database and a mail provider beside it. One busy app whose database is awake all day can cost more here, so read the busy workload before deciding.

### Can I keep Supabase and only move the hosting?

Yes. The migration Skill converts only the capabilities you pick. If the app uses Supabase Auth, Storage, Realtime or Edge Functions, keep Supabase as an external service and point the hosted app at it. If it uses Supabase only as Postgres, the agent can move the schema and the rows to the managed database and verify reads and writes on Dev before Prod.

### Is there a free plan?

Yes. Free gives {{ number plan.freeCredits }} credits per UTC month, a Dev and a Prod host on check.omh.st and a database on the {{ value profile.free.cu }} CU profile at the same rates as Paid. A custom domain and sending mail need Paid at {{ usd plan.paidUsd }} a month. Monthly credits expire at the end of the period; purchased top-ups never expire.

### How do I get my database out?

Ask the agent for project_export_create. You get a password-encrypted ZIP with a portable SQL dump, at most one accepted request per project per rolling 24 hours, through a signed link valid for 24 hours. Exports are free and still work at zero credits. Restore the dump on any Postgres host; files and source are not part of it.

### Do I need a coding agent to use it?

Yes. There is no deploy dashboard. Deployments, promotions, domains, mail and exports run through the {{ tools }} MCP tools from Claude Code, Cursor or Codex, or through the CLI. The portal at app.ohmyho.st shows projects, credits, budgets and API tokens; it does not deploy anything.

### What happens when my credits run out?

A zero balance starts a {{ number plan.graceDays }}-day grace period during which funded services keep running. After it, only unfunded services suspend; your data, an export and buying credit stay available. A project can carry a monthly budget set to continue or stop. Automatic recharge is not enabled yet, so nothing charges your card on its own.

{{ sources vercel supabase resend }}

[Cost breakdown](/pricing/breakdown) · [From Vercel and Supabase](/from/vercel-supabase) · [vs Supabase](/vs/supabase) · [What Vercel, Supabase and Resend cost for five side projects](/blog/what-vercel-supabase-resend-cost-for-five-side-projects)
