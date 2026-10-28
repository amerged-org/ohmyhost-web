# Supabase vs Vercel: do you need both?

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published September 20, 2026 · Updated October 21, 2026

You do not automatically need both. Vercel hosts the app, while Supabase provides the database and backend services it calls. Your Agent can check which parts your app uses before you choose a plan. If you choose their paid stack, Vercel Pro is {{ usd vendor.vercel.pro }} a month and Supabase Pro starts at {{ usd vendor.supabase.pro }}; other combinations are possible.

For a hosting and backend platform in one place, compare [Appwrite, Firebase and Nhost alongside ohmyho.st](/blog/all-in-one-vercel-supabase-alternatives). The choice depends on your database model, application services and deployment workflow.

{{ figure bills.supabase }}

## Vercel runs the app

Vercel takes a Git repository, builds the frontend, serves its files and runs server code as functions. That covers what your visitor opens in the browser and the app code behind it. PostgreSQL comes from a Marketplace partner or a separate provider; Supabase is one possible choice. Ask your Agent to show which database the deployed app connects to before treating the Vercel project as the whole setup.

Hobby costs {{ usd vendor.vercel.hobby }} and comes with {{ text vendor.vercel.hobby.includes }}. Vercel's own FAQ says Hobby is for personal, non-commercial use (vercel.com/pricing, read 2026-09-20). If this is a client site or a commercial app, check the paid-plan requirements before deploying it.

Pro costs {{ usd vendor.vercel.pro }} {{ text vendor.vercel.pro.unit }}. That fee comes back as usage credit each month, so the first {{ usd vendor.vercel.pro }} of function and build usage costs nothing extra; CDN requests and fast data transfer carry no overages on Pro, and viewer seats are free. Each further developer is {{ usd vendor.vercel.developerSeat }} {{ text vendor.vercel.developerSeat.unit }}. Function invocations beyond the credit are {{ usd vendor.vercel.functionInvocations }} {{ text vendor.vercel.functionInvocations.unit }}.

For a portfolio, separate the seat charge from usage. A solo developer does not buy another Pro seat for each project. The seat is still a recurring cost when the projects are quiet, though. Ask your Agent to show the fixed subscription and usage charges on separate lines so you can see which part could change.

{{ checked vercel }}

## Supabase runs the backend

Supabase gives you PostgreSQL plus a REST API, Auth, Storage, Realtime and Edge Functions, with a browser table editor. The app might use Supabase only to save records, or it might depend on it for sign-in, files and live updates as well. Its backend services do not replace a host for your Next.js application.

If you are considering Free, check the project and inactivity limits: Supabase pauses a Free project after a short stretch of inactivity, and it limits how many Free projects can be active at once (supabase.com/pricing, read 2026-09-20). A paused project does not answer until you restore it from the dashboard. If people visit only occasionally, decide whether you are willing to restore the project when it pauses. Your Agent can explain the dependency; you decide whether that interruption is acceptable.

Pro starts at {{ usd vendor.supabase.pro }} a month and includes {{ text vendor.supabase.pro.includes }}. Check the extra-project line as well: every further project runs its own compute instance at {{ usd vendor.supabase.microProject }} {{ text vendor.supabase.microProject.unit }}, and a Small instance is {{ usd vendor.supabase.smallProject }} {{ text vendor.supabase.smallProject.unit }}. Disk beyond the allowance is {{ usd vendor.supabase.diskGb }} {{ text vendor.supabase.diskGb.unit }}; egress beyond the allowance is {{ usd vendor.supabase.egressGb }} {{ text vendor.supabase.egressGb.unit }}.

Each extra database instance adds a compute cost, even if the project gets little traffic. That can suit a steady product. For a shelf of experiments, ask your Agent to list which instances are active and what each contributes to the bill. Do not assume a quiet project has no ongoing cost.

{{ checked supabase }}

## Find out what your app uses

A common setup uses Vercel for the app, Supabase for data and login, and another service for transactional mail. The figure above includes Resend Pro to show that extra service. Those are useful jobs to identify, but they do not have to come from those exact vendors or require every paid plan.

Ask your Agent which features depend on each service:

```text
Inspect this app and explain what Vercel, Supabase and any mail provider do in it. List the features that depend on each service, which database each environment uses, and which paid plans are actually required for my use. Do not change or migrate anything yet.
```

Read the inventory as a list of features: login, saved records, file uploads, live updates and emails. If something is missing, ask your Agent to trace that feature too. This is the point where you decide what needs to stay working, before the conversation turns into a hosting recommendation.

Once you know what the app uses, compare the way the plans charge for it:

- Vercel charges per seat, so the project count does not move the bill.
- Supabase charges per project, so every extra app is another {{ usd vendor.supabase.microProject }} a month on Pro, or a Free project that pauses.
- The recurring seat and database-instance charges remain when a project goes quiet. Usage above the plan allowances is a separate part of the comparison.

The extra project may have few users, but it can still add a database instance. That is the cost to investigate. Your Agent should compare the whole portfolio and keep any services you intend to retain in both estimates.

{{ checked supabase }}

## Compare a shared balance

ohmyho.st is an option when you want your Agent to operate hosting and managed PostgreSQL from a shared balance. It supports Astro, Next.js, Vite/React and TanStack Start apps from managed source or an authorized GitHub repository. Your Agent inspects the selected app, prepares a deployment plan and explains what it will create. You check that plan and test the resulting Dev address.

Each project gets Dev and Prod hosts under check.omh.st. Custom domains and sender mail are metered services on Paid. A custom domain also works on Free while the project shows the “Powered by ohmyho.st” flag, which removes domain credits on either plan. There is no per-project base subscription. Deployments happen through your Agent; the portal at app.ohmyho.st shows projects, credits, budgets and API tokens.

Keep the subscription and usage allowance separate when comparing the price. Free grants {{ number plan.freeCredits }} credits per UTC month. Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits per period that expire at period end, and Paid-only top-ups at {{ number plan.topUpPerUsd }} credits per dollar carry over until downgrade to Free. One credit is {{ usd plan.usdPerCredit }} of credit value.

Use {{ rate wfp.requests }} for requests. One active database hour at {{ number 512 }} MiB RAM costs {{ credits unit.activeDatabaseHour512 }}; the {{ number 256 }} MiB size available on Free costs {{ credits unit.activeDatabaseHour256 }}. Databases sleep after five idle minutes, with no active-RAM charge while asleep. Allocated disk and seven-day backups are included. Customer files and retained Worker scripts keep their separate rates. Each deployed script is about {{ credits unit.deployedScriptMonth }} a month; Worker bandwidth is not charged. Ask how often the actual database is active: an app can look quiet in the browser while background work keeps its database awake.

For the published example, the subscription comparison is: Bought separately, one project on Vercel Pro and Supabase Pro is {{ usd scenario.vercelSupabase }} a month before usage; with Resend Pro for mail it is the {{ usd scenario.threeSubscriptions }} in the figure. Five projects on the same Vercel and Supabase accounts are {{ usd scenario.vercelSupabaseFiveProjects }} a month, because four extra Micro instances run around the clock.

On ohmyho.st, five side projects, one of them with real traffic and login mail, look like this:

{{ table workload.portfolio }}

This particular workload fits inside the {{ number plan.paidCredits }} credits the Paid plan grants each period. Deployed scripts and any customer files keep using credits; runtime activity, builds, active database RAM and mail add usage, and database disk and seven-day backups are included. Check the table’s assumptions against your own apps before using its total. For comparison, our separate small-app workload sends more mail and costs about {{ credits workload.smallApp }} on its own; each quiet side project costs about {{ credits workload.quietProject }}. There is limited headroom. If one app grows, ask your Agent for an updated estimate and a monthly project budget. Choose whether the budget should warn and continue or stop new work at the threshold; a warning-only budget does not cap spending. Add a top-up when you need more credit. A zero balance starts a {{ value plan.graceDays }}-day grace period; funded services keep running, and only unfunded services suspend afterwards.

The [five-side-project cost comparison](/blog/what-vercel-supabase-resend-cost-for-five-side-projects) includes the mail subscription and breaks down how that portfolio changes the bill.

To compare your current setup with one shared balance, ask:

```text
Compare my current Vercel and Supabase setup with ohmyho.st using the app inventory and actual usage. Include mail, retained data, domains and services I would keep elsewhere. Show quiet and busy months, required code changes and unsupported features before recommending a move.
```

Use that report to decide what to try. A lower estimate for the app host is not enough if the database, auth and mail bills remain unchanged.

{{ checked vercel }}
{{ checked supabase }}
{{ checked resend }}

## Know when to stay

There are good reasons to keep the current setup. Match these tradeoffs to how you use the app, then ask your Agent to investigate the relevant ones.

**You use Supabase for more than Postgres.** Auth, Realtime, Storage and Edge Functions are real products, and a SQL dump moves none of them. Application auth needs its own plan: Better Auth and customer-owned WorkOS AuthKit are verified integrations, while Realtime subscriptions or Edge Functions may have no direct equivalent in the runtime. The [migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) inventories what the app actually calls, converts only what you select and states a gap instead of faking a success. If those services are the app, stay.

**You have one busy app, not many quiet ones.** A single busy production app with millions of requests, hundreds of active database hours, a linked domain and sender mail is about {{ credits workload.busyApp }} a month, roughly {{ usdValue workload.busyApp }} of credit value bought as top-ups. Vercel Pro and Supabase Pro start at {{ usd scenario.vercelSupabase }} together, but include comparable mail and any overages before judging the difference. Ask your Agent to price sustained usage as well as quiet periods; an always-active database can change the result.

**You want previews and a dashboard.** Vercel supports branch previews and free viewer seats. ohmyho.st gives each project a Dev host and a Prod host, with promotion of a verified deployment to Prod. It has no per-branch previews. Decide whether that fits your review process; your Agent can handle deployment, but it cannot make a shared Dev environment behave like separate branch previews.

**Your framework is not on the list.** Supported today: Astro, Next.js, Vite/React and TanStack Start, deployed from managed source or a GitHub repository you authorize. No containers. SvelteKit, Nuxt or a Dockerfile do not run here yet; Vercel runs most of them, and the [Railway, Render and Fly.io comparison](/blog/railway-vs-render-vs-fly-vs-ohmyho-st-for-solo-developers-2026) covers hosts that run containers.

**Everything fits the free tiers.** A personal project that fits Vercel Hobby at {{ usd vendor.vercel.hobby }} and Supabase Free may already have the cost you want. The case for one balance starts when the pauses, the non-commercial rule or the per-project instances start to hurt.

Compare those constraints with the [free Vercel and Supabase alternatives](/blog/free-vercel-supabase-alternatives-2026) before moving: the free-plan guide covers app hosting, Postgres, business use and what happens at each limit.

{{ checked vercel }}
{{ checked supabase }}

## Test the smallest change

You can move the app host while keeping a working backend. You can also leave the whole stack in place and change only the paid plan, if the terms and usage allow it. Choose the smallest change that solves your problem, then ask your Agent to prepare it on a test environment.

Then prepare the change on a test environment:

```text
Prepare the change I selected for a test deployment. Identify the test database, required connection settings and costs before deploying. Keep the existing backend unless I chose to migrate it. Once I confirm, deploy and return the test URL with browser checks for sign-in, protected pages, saved data, files and mail where used.
```

Check those flows yourself at the preview address. A homepage that loads proves very little about login or data access. When the test works, have your Agent explain the production switch and how to recover if a required feature fails. That is the useful handoff between you and the Agent: it handles setup and diagnostics, while you decide whether the app behaves as expected.

## FAQ

### Do I need both Supabase and Vercel?

You need the services your app uses, but they do not have to come from both of these providers. Vercel can host the app while Supabase supplies its backend; another database or app host may also fit. Ask your Agent to inspect the dependencies first. ohmyho.st is one option for hosting and PostgreSQL from a shared balance without a per-project base fee.

### Can I keep Supabase and move only the hosting?

Yes. The migration Skill inventories what the app really uses and converts only the capabilities you select; the rest stays external. Ask your Agent to check the required connections, environment values and login callback URLs, then test the real flows on the new host. Supabase keeps its own bill. Move the database later if there is a reason, or keep it where it is.

### What happens to my Supabase Auth users?

A database dump alone does not recreate your sign-in system. ohmyho.st does not replace your auth provider: Better Auth and customer-owned WorkOS AuthKit are the verified integrations, and the platform login is separate from your application's users. The migration Skill asks you to decide before touching Auth, then tests login, a protected route, reload and logout on the Dev host before anything is promoted.

### What does a quiet side project cost on ohmyho.st?

About {{ credits workload.quietProject }} a month, or {{ usdValue workload.quietProject }} of credit value: one active hour at {{ number 256 }} MiB RAM with disk/backups included, a few thousand requests and a deployed script. The database sleeps after five idle minutes; the script remains metered while retained.

### Can I take my database with me later?

Yes. An Owner can ask their Agent for an export: an asynchronous, password-encrypted ZIP holding a portable SQL dump, one accepted request per project in any rolling 24-hour window, downloaded through a signed link that stays valid for 24 hours. Exports are free and work at zero credits. Restore the dump on any Postgres host, including Supabase.

{{ sources vercel supabase resend }}

[Compare Supabase](/vs/supabase) · [Compare Vercel](/vs/vercel) · [From Vercel and Supabase](/from/vercel-supabase)
