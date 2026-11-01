# Supabase vs. Vercel: Do You Need Both?

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published September 20, 2026 · Updated October 27, 2026

You don't automatically need both. Vercel hosts the app, while Supabase provides the database and the  backend services that the app calls. Your agent can check which components your app uses before you choose a plan. If you opt for their paid stack, Vercel Pro costs {{ usd vendor.vercel.pro }} per month and Supabase Pro starts at {{ usd vendor.supabase.pro }}; other combinations are also psosible.

To compare all-in-one hostting and backend platforms, check out [Appwrite, Firebase, and Nhost with ohmyho.st](/blog/all-in-one-vercel-supabase-alternatives). The choice  depends on your database model, application services, and deployment workflow.

{{ figure bills.supabase }}

## Vercel operates the app

Vercel takes a Git repository, builds  the front end, serves its files, and runs server-side code as Functions. This includes what your visitor sees in the brower and the app code behind it. PostgreSQL comes from a Marketplace partner or a separate provider; Supabase is one possible option. Ask your agent which database the deployed app connects to before you consider the Vercel project to be the entire setup.

The Hobby plan costs {{ usd vendor.vercel.hobby }} and includes {{ text vendor.vercel.hobby.includes }}. Vercel's own FAQ states that the Hobby plan is intended for personal, non-commercial use (vercel.com/pricing, accessed on 2026-09-20). If  it is a customer site or a comemrcial app, check the requirements for paid plans before deployment.

The Pro plan costs {{ usd vendor.vercel.pro }} {{ text vendor.vercel.pro.unit }}. This fee is refunded each month as usage credit, so the first {{ usd vendor.vercel.pro }} of function and build usage are free; CDN requests and high-speed data transfres have no overage  fees on the Pro plan , and viewer slots are free. Each additional developer costs {{ usd vendor.vercel.developerSeat }} {{ text vendor.vercel.developerSeat.unit }}. Fnction calls exceeding the credit limit cost {{ usd vendor.vercel.functionInvocations }} {{ text vendor.vercel.functionInvocations.unit }}.

When managing a portfolio, you should separate the Seat fee from usage costs. A solo developer doesn’t purchase an additional Pro Seat  for every project. However, the seat remains a recurring cost even when projects are on hold. Ask your agent to list the fixed subscription fee and the usage fee on seaprate lines so you can see which part might change.

{{ checked vercel }}

## Supabase powers the backend

Supabase offers PostgreSQL plus a REST API, authentication, storage, real-time, and edge functions, along with a table editor in the browser. Your app may use Supabase soolely for storing data records, or it may also rely on  it for authentication, files, and live updates. The backend services do not replace a host for your Next.js application.

If you're considering the Free plan, check the project and inactivity limits: Supabbase pauses a Free project after a short period of inactivity, and it limits the number of Free projects that can be active at the same time (supabase.com/pricing , accessed on 2026-09-20). A paused project will not respond until you restore it in the dashboard. If visitors come only occasionally, decide  whether you’re willing to restore the project when it’s paused. Your agent can explain the implications; it’s up to you to decide whether this interruption is aceptable.

The Pro plan starts at {{ usd vendor.supabase.pro }} per month and includes {{ text vendor.supabase.pro.includes }}. Also  note the line for additional projects: Each additional project runs its own compute instance at {{ usd vendor.supabase.microProject }} {{ text vendor.supabase.microProject.unit }}, and a Small instance costs {{ usd vendor.supabase.smallProject }} {{ text vendor.supabase.smallProject.unit }}. Storage spae  beyond the quota costs {{ usd vendor.supabase.diskGb }} {{ text vendor.supabase.diskGb.unit }}; egress beynd the quota costs {{ usd vendor.supabase.egressGb }} {{ text vendor.supabase.egressGb.unit }}.

Every additional database instance incurs compute costs , even if the project has very little traffic. This might be appropriate for a stable producct. For a series of experiments, ask your agent to list which instances are active and how much each one contributes to the bill. Don’t assume that a low-traffic project has no running costs.

{{ checked supabase }}

## Find out what your app uses

A common seutp uses Vercel for the app, Supabase for data and login, and another service for transactional emails. The image above includes  Resend Pro to illustrate this additional service. It’s helpful to identify these tasks, but they don’t have to come from these specific providers or require a paid plan.

Ask your agent which features deepend on which  service:

```text
Inspect this app and explain what Vercel, Supabase and any mail provider do in it. List the features that depend on each service, which database each environment uses, and which paid plans are actually required for my use. Do not change or migrate anything yet.
```

Think of the inventory as a list of features: lgoin, saved records, file uploads, live updates, and emails. If something is missing, have your agent follow up on that feature as well. At this point, you decide what needs to continue working before the conversation turns into  a hosting recommendation.

Once you know what the app is used for , compare how the diffferent plans charge for it:

- Vercel bills per seat , so the number of projectts does not affect the bill.
- Supabase bills on a per-project bsis , so each additional app costs {{ usd vendor.supabase.microProject }} per month on the Pro plan or is a Free project that is on hold.
- Recurring seat and database instance fees remain in  effect even if a project becomes inactive. Usge exceeding the rate quotas is a separate part of the agreement.

The additional project may have  few uers, but it can still add a database instance. That's the cost item you should review. Your agent should compare the entire portfolio and include all the services you want to keep in both estimates.

{{ checked supabase }}

## Compare a shared balance

ohmyho.st is an option if you want your agent to run hosting and managed PostgreSQL from a shared credit balance. It supports Astro, Next.js , Vite/React, and TanStack starter apps from managed source code or an authorized GitHb repository. Your agent reviews the selected app, prepares a deployment plan, and explains what it will create. You review this plan and test the resulting dev URL.

Each project reecives dev and prod hosts at check.omh.st. Custom domains and custom email sender addresses are usage-based services included in the paid plan. A custom domain also works on the Free  plan as long as the project displays the “Powered by ohmyho.st” notice , which means no domain creidts are required on either plan. There is no basic subscription per project. Deployments run through your agent; the portal at app.ohmyho.st displays projects, credits, budgets, and API tokens.

Compare the price by looking at the subscription and usage allowance searately. The Free plan provides {{ number plan.freeCredits }} credits per UTC month. The Paid plan costs {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits per billing period, which expire at the end of the period. Top-ups , which are available only to Paid workspaces, cost {{ number plan.topUpPerUsd }} credits per dollar and never expire. One credit is equivalent to {{ usd plan.usdPerCredit }} credit value.

Use {{ rate wfp.requests }} for queries. One active database hour with {{ number 512 }} MiB of RAM costs {{ credits unit.activeDatabaseHour512 }}; the {{ number 256 }} MiB plan available on the Free tier costs {{ credits unit.activeDatabaseHour256 }}. Databases go to sleep after five minuts of inactivity , with no RAM csts while in sleep mode. Allocated storage and seven-day backups are included. Customer files and saved worker scripts  have their own pricing plans. Each deployed script costs about {{ credits unit.deployedScriptMonth }} per month; worker bandwidth is free. Ask how often the actual database is active: An app may appear idle in the browser, while background work keeps its database awake.

For the example provided , the subscription comparison is as follows: If purchased separately, a project using Vercel Pro and Supabase Pro costs {{ usd scenario.vercelSupabase }} per month before use; with Resend Pro for emails, the cost is {{ usd scenario.threeSubscriptions }} as shown in the figure. Five projects on the same Vercel and Supabase accounts cost {{ usd scenario.vercelSupabaseFiveProjects }} per month becausse four additional micro-instances run around the clock.

On  ohmyho.st, five side projects—one of wihch has real traffic and login emails—look like this:

{{ table workload.portfolio }}

This specific load fits within the {{ number plan.paidCredits }} credits granted by the Paid plan per period. Deployed scripts and customer files continue to consume credits; runntime activity, builds, active database RAM, and emails incur usage, while database storage and seven-day backups are included. Check the assumptions in the table against your own apps before using the  total. For comparison: Our separate plan for small apps sends more emails and costs aboout {{ credits workload.smallApp }} on its own; every low-traffic side project costs about {{ credits workload.quietProject }}. The leeway is limited. As an app grows, ask your agent for an updated estimate and a monthly project budget. Decide whether the budget should trigger a warning and continue running when the threshold is reached, or stop new work; a warning-only budget does not limit spending. Add a top-up if you need more credits. A zero balance triggers a grace period of {{ value plan.graceDays }} days; funded services continue to run , and only unfunded services are suspended afterward.

The [Cost Comparison for Five Side Projects](/blog/what-vercel-supabase-resend-cost-for-five-side-projects) incluudes the email subscription and breaks down how this portfolio affects the  total cost.

To compare your current setup with a shared creidt balance , ask:

```text
Compare my current Vercel and Supabase setup with ohmyho.st using the app inventory and actual usage. Include mail, retained data, domains and services I would keep elsewhere. Show quiet and busy months, required code changes and unsupported features before recommending a move.
```

Use this report to decide what you want to test. A lwer estimate for the app host isn't enough if the bills for the database, authentication , and email remain the same.

{{ checked vercel }}
{{ checked supabase }}
{{ checked resend }}

## Know when to stay

There are good reasons to keep the current setup. Weeigh these considerations against your use of the app , and then ask your agent to look into the relevant ones.

**You use Supabase for more than just Postgres.** Auth, Realtime, Storage, and Edge Functions are full-fledged products, and an SQL dump doesn't transfer any of them. Application auth requires its own plan: Better Auth and customer-managed WorkOS AuthKit are verified integations, while Realtime subscriptions or Edge Functions cannot have a direct counterpart in the runtime. The [Migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) captures what the app acttually calls , converts only what you select, and identifies a gap rather than pretending to succeed. If these services are what make up the  app, stick with Supabase.

**You have one heavily used app, not many low-traffic ones.** A single, heavily used production app with millions of requests, hundreds of atcive database hours, a linked domain , and a sender email address costs about {{ credits workload.busyApp }} per month—roughly {{ usdValue workload.busyApp }} in credit value, purchased as top-ups. Vercel Pro and Supabase Pro  together start at {{ usd scenario.vercelSupabase }}, but iclude comparable email quotas and potential overages; check this before judging the difference. Have your agent price both sustained usage and quiet periods; a constantly active database can change the outcome.

**You want previews and a dashboard.** Vercel supports branch previews and free viewer slots. ohmyho.st provides each project with a dev and a prod host , with a verified deployment pushed to prod. There are no previews per branch. Decide whether this fits your review process; your agnet can handle the deployment, but they can’t make a shared dev environment function like separate branch previews.

**Your framework isn't on the list.** Currently supported: Astro, Next.js, Vite/React, and TanStack Start, deployed from a managed source or a GitHub repository that you autthorize. No  containers. SvelteKit, Nuxt, or a Dockerfile don’t work here yet; Vercel runs most of them, and the [comparison of Railway, Render, and Fly.io](/blog/railway-vs-render-vs-fly-vs-ohmyho-st-for-solo-developers-2026) covers hosts that run containers.

**Everything fits within the free plans.** A personal project that fits within Vercel Hobby for {{ usd vendor.vercel.hobby }} and Supabase Free might already meet your cost requirements. The case for a shared credit pool arisses when the limits, the non-commercial use policy , or the number of instances per project start to become an issue.

Compare these limitations with the [free alternatives to Verel and Supabase](/blog/free-vercel-supabase-alternatives-2026) before you switch: The guide to free plans  covers app hosting, Postgres, business use, and what happens when you hit each limit.

{{ checked vercel }}
{{ checked supabase }}

## Test the smallest change

You can move the app host while still maintaining a functionaal backend. You can also leave the entire stack as is and just change the paid plan , provided the terms and your usage allow it. Choose the smallest change that solves your problem, and then have your agent set it up in a test environment.

Then  prpare the change in a test environment:

```text
Prepare the change I selected for a test deployment. Identify the test database, required connection settings and costs before deploying. Keep the existing backend unless I chose to migrate it. Once I confirm, deploy and return the test URL with browser checks for sign-in, protected pages, saved data, files and mail where used.
```

Test these processes yourself using the preview URL. A homepage that loads says very little about the login process or data access. If the test works , have your agent explain the production switch and how to recover if a required feature fails. This is the idael handoff between you and the agent: They handle setup and diagnostics, and you decide whether the app is behaving as expected.

## FAQ

### Do I need both Supabase and Vercel?

You need the services your app uses, but they don't have to come from both of these providers. Vercel can host the app while  Supabase provieds its backend; another database or app host might also work. Have your agent check the dependencies first. ohmyho.st is an option for hosting and PostgreSQL from a shared credit balance with no base fee per project.

### Can I keep Supabase and just switch hosting providers?

Yes. The migration skill identifies what the app actually uses and converts only the features you select; the rest remains external. Ask your agent to verify the required connectioons, environment variables, and login callback URLs, and then test the actual workflows on the new host. Supabase keeps its own records. Move the database later if  there’s a reason to, or leave it where it is.

### What will happen to my Supabase Auth users?

A database dump alone won't rcreate your login system. ohmyho.st does not replace your authentication provider: Better Auth and the customer-managed WorkOS AuthKit are the verified integrations, and  the platform login is separate from your application's users. The migration skill asks for your confirmation before making any changes to authentication and tests login, a protected route, reloading, and logout on the dev host before anything is deployed to production.

### How much does a low-key side project on ohmyho.st cost?

About {{ credits workload.quietProject }} per month, or {{ usdValue workload.quietProject }} in credit value: one actie hour with {{ number 256 }} MiB of RAM , including disk space and backups, a few thousand requests, and one deployed script. The database goes to sleep after five minutes of inactivity; the script continues to be counted as long as it is stored.

### Can I take my database with me later?

Yes. An owner can ask their agent for an expport: an asynchronous , password-encrypted ZIP file containing a portable SQL dump; one request per project is allowed within each rolling 24-hour window, downloadable via a signed link that remains valid for 24 hours. Exports are free and work even with zero credits. Import the dump onto any Postgres host, including Supabase.

{{ sources vercel supabase resend }}

[Compare Supabase](/vs/supabase) · [Compare Vercel](/vs/vercel) · [Vercel and Supabase](/from/vercel-supabase)
