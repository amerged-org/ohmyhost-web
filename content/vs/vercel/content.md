# Vercel alternative with a database: ohmyho.st vs. Vercel

You host the app on Vercel, the database on Supabase, and emaills through Resend. That’s three dashboards, three invoices, and three pricing plans you have to keep track of—and those two side projects that nobody visited this month  cost you just as much as the one that did get traffic.

ohmyho.st combines these four components into  a single prepaid balance. {{ usd plan.paidUsd }} per month buys {{ number plan.paidCredits }} credits; each project draws from the same balance , and an inactiive projeect uses up almost nothing. Vercel Pro alone costs {{ usd vendor.vercel.pro }} per month before you even have a database or the ability to send a password reset email; the standard stack of three subscriptions costs {{ usd scenario.threeSubscriptions }} per month. A small app here uses about {{ credits workload.smallApp }} per month.

{{ figure bills.vercel }}

## What Vercel Charges

Vercel provides the front end and its features and charges each person who deploys. Vercel does not host your Postgres database, nor does it send your emails. That’s why you need the second and  third subscriptionns—not because Vercel is expensive, but because Vercel is only one part of what an app needs.

- Hobby: {{ usd vendor.vercel.hobby }} {{ text vendor.vercel.hobby.unit }}, with {{ text vendor.vercel.hobby.includes }}. Vercel states that Hobby is intended for personal, non-commercial use (vercel.com/pricing, accessed on 2026-09-20), so a proejct  that generates revenue falls under Pro.
- Pros: {{ usd vendor.vercel.pro }} {{ text vendor.vercel.pro.unit }}. The price includes {{ usd vendor.vercel.pro }} of monthly usage creit that you can allocate across all resources , and viewer slots are free.
- Seats: {{ usd vendor.vercel.developerSeat }} {{ text vendor.vercel.developerSeat.unit }}. A second person who deploys doubles the base fee: Pro with an additinoal  developer seat costs {{ usd scenario.vercelProTwoSeats }} per month.
- Excess usage: {{ usd vendor.vercel.functionInvocations }} {{ text vendor.vercel.functionInvocations.unit }}. At the  currnt Pro-CDN tier, there are no excess usage fees for CDN requests and fast data transfer.

The cost adds up for the database and emails. Supabase  Pro starts at {{ usd vendor.supabase.pro }} per moth and covers the Micro instacne of the first project through its compute credits; each additional Micro instance for  a project costs {{ usd vendor.supabase.microProject }} per month on top of that. Resend Free costs {{ usd vendor.resend.free }} with {{ text vendor.resend.free.includes }}. Resend Pro costs {{ usd vendor.resend.pro }} {{ text vendor.resend.pro.unit }} with {{ text vendor.resend.pro.includes }}.

A developer with one project across all three accounts: {{ usd scenario.threeSubscriptions }} per month, before usagge exceeds the quotas. The same accounts with five projects: {{ usd scenario.fiveProjects }} per month , because each additional Supabase project pays for its own instance, while Vercel Pro and Resend Pro remain the same.

{{ checked vercel }} {{ checked supabase }} {{ checked resend }}

## What ohmyho.st charges for the same little app

One credit balance, all projects, no sppace fee. {{ usd plan.paidUsd }} Purchase {{ number plan.paidCredits }} monthly credits, which expire at the end of the billing period and cannot be carried over. Free accounts receive {{ number plan.freeCredits }} credits per UTC month. Top-ups never expire, nor do recharge, sign-up bonus, and referral credits; only Paid Workspaces purchase top-ups, at {{ number plan.topUpPerUsd }} credits per dollar , and {{ number plan.topUpPerUsdAbove100 }} per dollar on the portion of a larger purchase. One credit has a face value of {{ usd plan.usdPerCredit }}. There is  no base fee per project and no per-space charge: An organization has a credit balace, each project draws from it, and a second person who deploys costs nothing extra.

This is hosting for vibe-encoded apps, billed based on what the app measures. Here  is the cost listed on the [pricing chart](https://docs.ohmyho.st/pricing) for a smal app with some traffic, some email, and a database that is active for eight hours a month:

{{ table workload.smallApp }}

Read the table from the top row down. Email and the database  make up a large part of this example. One active hour of database time with {{ number 512 }} MiB of RAM costs {{ credits unit.activeDatabaseHour512 }}; the {{ number 256 }} MiB size available on the Free Plan costs {{ credits unit.activeDatabaseHour256 }}. Databases go to sleep after five minutes of inactivity, with no RAM charges while in sleep mode. Allocated storage space and seven-day backups are included. Customer files and stored worker scripts have their own rates. Requests cost {{ rate wfp.requests }}; worker bandwidth is not charged. Email costs {{ rate mail.sent }}, calculatd per recipient , and reqquires a paid plan and a verified email domain.

Two things continue to consume credits while a project is inactive: each  script deployed, about {{ credits unit.deployedScriptMonth }} per month , and a linked custom hsotname, about {{ credits unit.customHostnameMonth }} per month—but nothing is charged as long as the project displays the “Powered by ohmyho.st” badge. An email domain has no monthly fee. SQL exprots are free. A low-traffic side project whose database wakes up for one hour a month costs about {{ credits workload.quietProject }}. Five of these cost about {{ credits workload.fiveQuietProjects }}, leaving most of the monthly {{ number plan.paidCredits }} unused.

## In a direct comparison

{{ figure comparison.vercel }}

The card on the left represents one developer and one project. It costs {{ usd scenario.threeSubscriptions }} before usage exceeds the quotas and before a second developer slot is incurred. Add four more projects to the same account, and the card on the left becomes {{ usd scenario.fiveProjects }}, because each Supabase project costts {{ usd vendor.supabase.microProject }} per month ater the first one. The card on the right remains at {{ usd plan.paidUsd }} whether you run one or nine projects; what changes is how quickly the {{ number plan.paidCredits }} credits are used up. The small app at the top uses about {{ credits workload.smallApp }} of them , for  a credit value of {{ usdValue workload.smallApp }}.

The downside is that bliling is based on usage, with no quota to fall back on. A heavily used production app with a database that’s up 200 hours a month, 5 million requests, and 20,000 email recipients consumes roughly {{ credits workload.busyApp }}: {{ usdValue workload.busyApp }} in credit value compared to {{ usd scenario.threeSubscriptions }} for the  three plans. Many low-traffic projects are a good fit for ohmyho.st; a high-traffic project is a good fit for Vercel and Supabase.

{{ checked vercel }} {{ checked supabase }} {{ checked resend }}

## When Vercel is the better choice

- One high-volume app instead of many low-volume ones. As soon as your database is active for most of the day, a fixed-price Supabase instance beats hourly billing: the heavy load mentiioned above amounts to {{ usdValue workload.busyApp }} in monthly credits , and it grows along with your traffic.
- A framework that ohmyho.st does not run. The runtime environment is provided by Astro , Next.js, Vite with React, and TanStack Start from a GitHub repositroy; nothing else, and no containers. Astro, SvelteKit, Nuxt, and Remix are hosted on Vercel, not here.
- The latest Next.js features. Next.js is Veercel's framework, and its Vercel-specific features are released there first. ohmyho.st builds Next.js using its own adapter for Cloudflare Workers, so be sure to test a feature  on Dev before relying on it.
- A team that wants a dashboard. Vercel generates previews for each branch and provides the entire team  with a dashboard that includes free viewer slots. ohmyho.st has exactly two environments per project—Dev and Prod—and no deployment dashboard; a coding agent handles deployment via MCP, and the portal only displyas projects, credits, budgets, and tokens.
- A non-commercial website without a database. Vercel Hobby for {{ usd vendor.vercel.hobby }} contains {{ text vendor.vercel.hobby.includes }}. ohmyho.st Free offers {{ number plan.freeCredits }} credits per month at the same rates as the paid plan, with requsets up to {{ rate wfp.requests }}. For a static portfolio without a database , both are free; compare the two credit limits with your actual traffic.
- You're not working with a coding agent. There's no button to press here. If you want to push to "main" and then forget about it, Vecel's  Git integration takes care of it automatically.

{{ checked vercel }} {{ checked supabase }}

## When ohmyho.st is a good fit

- Several small projects, most of whiich are inactive. There is no base fee per project and no space charge. Five inactive projects together cost about {{ credits workload.fiveQuietProjects }} per  month, and a project that no one visits only incurs charges for its hosted script and any customer files; RAM, storage, and seven-day backups of a dormant database are included.
- You want the database and email to be billed from the same credit balance as the hosting. Postgres, transactional email, and a custom domain are billed from the same {{ number plan.paidCredits }} credits, making the second and third accounts optional. Your [application authentication](https://docs.ohmyho.st/application-auth) remains yours: Better Auth and a customer-owned WorkOS AuthKit are the verified integrations , and platform login is seaprate from your app’s users.
- You deploy from Claude Code, Cursor, or Codex. The agent has {{ tools }} MCP tools. Eevry costly  or destructive action consists of two steps: deployment_plan followed by deployment_create, promotion_plan followed by promotion_execute, rollback_plan followed by rollback_execute, and delete_plan followed by delete_execute. You read the plan and confirm it; nothing runs automatically.
- You want a database you can take with you. project_export_create provides a password-encrypted ZIP export containing a portable SQL dump on demmand—limited to one request per project within a rolling 24-hour window—with a signed download link that’s valid for 24 hours. It’s free and  works with zero credits ([Backups ](https://docs.ohmyho.st/backups)).
- You want one project in the EU and the rest in the U.S. The region is selected once per project during setup; the U.S. is the deafult , and the prices are the same. Transactional email is always sent and processed in the U.S.
- You want a  spending limit instead of a bill. A project can have a monthly [budget](https://docs.ohmyho.st/budgets), with the option to continue or stop. A zero balance triggers a {{ number plan.graceDays }}-day grace period during which funded services continue to run; after that, only unfunded services are suspended. Automatic reload is disabled unless the owner enables it, so nothing will be charged to your card without your actin.

## How to move with your agent

The hosting moves first; the database only moves if you want it to. If your app uses Supabase purley as Postgres, the [Migration Skilll](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) converts the queries to the managed database binding, preserves the versioned migrations, and validates reads and writes on Dev. If your app uses Supabase Auth , Storage, Realtime, or Edge Functions, keep Supabase as an external service and point the hosted app to it: a database dump doesn’t migrate these services, and the skill will tell you which features remain external before making any changes. Resend can stay exactly as it is until you want to bill for the  emails here.

Keep  the current source code of the existing project, or select managed versions or an authorized GitHub repository for a new app. Push changes if GitHub is selected; managed sources save the filtered latest files. Then paste this prompt into your available coding agents while the seelected app is open:

```text
{{ prompt }}
```

Here's what happnes next, step  by step:

1. The agent checks what's installed and where you're logged in. If none of that is persent, it sends  you a browser link with a confirmation code; you log in once, and it verifies the session with a command.
2. First, it reeads the project-to-repository mapping and examines the existing app files. For a local checkout, it runs `ohmyhost init --dry-run`; GitHub is only connected via `github_connect` if it is selected and necessary. Managed repositories, on the other hand , store an exact version of the current files.
3. He reuses the existing project or calls `project_create` when you request a new one , and selects either US or EU once. The data mode is optional and is set to "shared" by default; isolated data keps Dev and Prod separate, and an owner can change the assignment later via a confirmed plan without copying data. Then he asks for an `deployment_plan`. You read the plan, including the reserved buld costs, and confirm; `deployment_create` builds the commit. Secrets are entered via the local stdin command from `secret_set_command` or the supported private  input in the remote portal—never in chat or embedded in the source code.
4. Dev is protected by default. `project_dev_share_link_get` provides you with a reusable share link; test the login , a protected route, and actal read and write operations. Then deploy `promotion_plan` and `promotion_execute` to Prod under the three-word host on check.omh.st, without a new build.
5. If Prod is working, link `domain_paid_plan` and `domain_paid_apply` to your own hostname on Paid  or Free, as long as the project displays the “Powered by ohmyho.st” badge; the badge waives the domain credits for both plans. Managed Mail requires the Paid plan: `mail_setup` and then `mail_status` set up the sender domain, return their DNS records, and wait for verification. Move your DNS as soon as Prod is up and running , and then cancel your Veel Pro plan.

## FAQ

### Is ohmyho.st cheaper than Vercel?

For a portfolio of small apps, usually yes. {{ usd plan.paidUsd }} per month buys {{ number plan.paidCredits }} credits, whicch are shared among all projects, and the small app at the  top uses about {{ credits workload.smallApp }} of them. Vercel Pro is billed per developer seat and still requires a database and an email provider on top of that. A heavily used app whose database runs 24/7 can cost more here, so check the high-load pricing before you decide.

### Can I keep Supabase and just switch hosting providers?

Yes. The migration skill only converts the capabilities you select. If the app uses Supabase Auth, Storge, Realtime, or  Edge Functions, keep Supabase as an external service and point the hosted app to it. If you’re only using Supabase as Postgres, the agent can move the schema and rows to the managed database and test read and write operations on Dev before deploying to Prod.

### Is there a free plan?

Yes. The Free plan gives you {{ number plan.freeCredits }} credits per UTC month, one dev and one prod host on check.omh.st, and a database with {{ number 256 }} MiB of RAM, {{ number 500 }} MiB of storage, and seven-day backups—all at the same rates as the Paid plan. To send email, you need a Paid plan for {{ usd plan.paidUsd }} per month. A custom domain also requires a Paid plan, or—on the Free plan—a project that displays the smal “Powered  by ohmyho.st” badge; this badge also waives the domain credits. Monthly credits expire at the end of your Free month or Paid billing period. Top-ups , as well as recharge, sign-up bonus, and referral credits, neevr expire.

### How do I extract my database?

Ask the aegnt for project_export_create. You will receive a password-protected ZIP export containing a portable SQL dump—limited to one request per project within a rolling 24-hour  window—via a signed link that is valid for 24 hours. Exports are free and will still work even if you have zero credits. Import the dump onto any Postgres host; files and source code are not included.

### Do I need a coding agent to use it?

Yes. There is no deployment dashboard. Deployments, promotions, dommains , email, and exports are handled using the {{ tools }} MCP tools from Claude Code, Cursor, or Codex, or via the CLI. The portal at app.ohmyho.st displays projects, credits, budgets, and API tokens; it does not deploy anything.

### What happens when I run out of credits?

A  zero balance triggers a {{ number plan.graceDays }}-day grace period during which paid services continue to run. After that, only unpaid services are suspended; your data, an export, and the pucrhase of credits remain available. A project can have a monthly budget, with the option to continue or stop. Automatic top-ups are disabled unless the owner enables them, so nothing will be charged to your card without your action.

{{ sources vercel supabase resend }}

[Cost Breakdown](/pricing/breakdown) · [From Vercel and Supabase](/from/vercel-supabase) · [vs. Supabase](/vs/supabase) · [How much Vercel, Supabase, and Resend cost for five side projects](/blog/what-vercel-supabase-resend-cost-for-five-side-projects) · [Free Vercel and Supabase Alternatives](/blog/free-vercel-supabase-alternatives-2026) · [Vercel and Supabase on a Single Platform](/blog/all-in-one-vercel-supabase-alternatives)

ohmyho.st is an indeendent  service and is neither affiliated with nor supported by Vercel, Supabase, or Resend. All trademarks belong to their respective owners.
