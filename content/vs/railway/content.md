# ohmyho.st as a Railway alternative for side projects

Railway keeps your container running and bills you for the time it runs, on top of a monthly minimum. That is exactly right for a queue worker or a websocket server, and exactly wrong for a side project that gets forty visitors in a good week.

Railway's Hobby and Pro plans bill a {{ usd vendor.railway.hobby }} or {{ usd vendor.railway.pro }} monthly minimum plus per-second vCPU and memory. ohmyho.st bills what a request actually uses — requests, CPU-ms, database hours and storage — from one balance: {{ number plan.freeCredits }} credits free each month, or {{ usd plan.paidUsd }} for {{ number plan.paidCredits }}. The trade is real: Railway runs any container, ohmyho.st runs Next.js, Vite and TanStack on Workers. Quiet apps are cheaper here; anything that must stay running belongs on Railway.

{{ figure bills.railway }}

## What Railway charges

Railway has three plans and one per-second meter underneath all of them. The plan price is a minimum, not a fee on top: usage up to the minimum is covered by it, and only usage above it is added to the bill.

- Free: {{ usd vendor.railway.free }} {{ text vendor.railway.free.unit }}. Railway lists it as {{ text vendor.railway.free.includes }}. The dollar after the trial is a monthly usage credit, not a charge (railway.com/pricing, read 2026-09-20).
- Hobby: {{ usd vendor.railway.hobby }} {{ text vendor.railway.hobby.unit }}, covering {{ text vendor.railway.hobby.includes }}.
- Pro: {{ usd vendor.railway.pro }} {{ text vendor.railway.pro.unit }}, covering {{ usd vendor.railway.pro }} of monthly usage credits and seats for a whole team.

Below the plans, every running service is metered by the second:

- vCPU: ${{ value vendor.railway.vcpuSecond.usd }} {{ text vendor.railway.vcpuSecond.unit }}. One vCPU kept busy for a 30-day month is about {{ usdPerMonth vendor.railway.vcpuSecond }}.
- Memory: ${{ value vendor.railway.memoryGbSecond.usd }} {{ text vendor.railway.memoryGbSecond.unit }}. One GB held for a 30-day month is about {{ usdPerMonth vendor.railway.memoryGbSecond }}.
- Volumes: about {{ usdPerMonth vendor.railway.volumeGbSecond }} per GB for a 30-day month, billed by the second while provisioned. Object storage is {{ usd vendor.railway.objectStorageGbMonth }} {{ text vendor.railway.objectStorageGbMonth.unit }}.
- Egress: {{ usd vendor.railway.egressGb }} {{ text vendor.railway.egressGb.unit }}.

Memory is the line to watch. A container holds its memory whether or not a request arrives, so a service that stays up pays for its RAM every second, traffic or not. Railway's answer is a per-service serverless option that can reduce a service's usage cost: a service that sends no outbound packets for a few minutes is put to sleep, and the first request after it wakes is slower and may fail (docs.railway.com/deployments/serverless, read 2026-09-20). Outbound traffic such as an open database connection or telemetry keeps a service awake. A stopped service costs nothing (railway.com/pricing, read 2026-09-20).

{{ checked railway }}

## What ohmyho.st charges

There is no memory meter. An app is billed for requests and CPU milliseconds. A database is billed for the hours it is awake and the gigabytes it keeps. Every project in your organization draws from the same balance, and no project carries a base fee.

Plans first:

- Free: {{ number plan.freeCredits }} credits per UTC month. They expire at month end.
- Paid: {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits per period. Purchased credits never expire and stack.
- Top-ups: {{ number plan.topUpPerUsd }} credits per dollar for the first hundred dollars of a purchase, {{ number plan.topUpPerUsdAbove100 }} per dollar above that. Purchased credits never expire.

Then the meters a side project touches:

- Requests: {{ rate wfp.requests }}.
- CPU: {{ rate wfp.cpu }}. Time spent waiting on the database or on a fetch is not CPU time.
- Database compute: {{ rate neon.compute.scale }}. Free runs at {{ value profile.free.cu }} CU, Paid standard at {{ value profile.standard.cu }} CU, Paid performance at {{ value profile.performance.cu }} CU. One active hour on the standard profile is about {{ credits unit.activeDatabaseHourStandard }}. Free and standard suspend after a minute without queries; performance waits five minutes and charges 2.5 times standard compute for each active minute.
- Database storage: {{ rate neon.storage.root }}, charged whether the database is awake or not.
- Files: {{ rate r2.storage.standard }}.
- Builds: {{ rate build.sandbox.standard-3 }}, measured from the start of your build to its end.
- Mail: {{ rate mail.sent }}, one recipient per message. Sending needs Paid and a verified mail domain; the domain itself has no monthly fee.
- Per project: each deployed script uses about {{ credits unit.deployedScriptMonth }} a month, and a linked customer-owned hostname uses about {{ credits unit.customHostnameMonth }} a month on Paid.

Bandwidth from Workers is not charged. SQL exports are free. Scheduled functions have no meter of their own: each run is one request plus its CPU milliseconds. EU hosting is a choice made once when a project is created, US is the default, and the rates are the same in both.

Put together, a quiet project looks like this:

{{ table workload.quietProject }}

That project pays for the hour its database was awake, the data it keeps and one deployed script. Between requests it pays nothing. A project may carry a monthly budget that either continues from the shared balance or stops the project at its limit. A zero balance starts a {{ number plan.graceDays }}-day grace period during which funded services keep running; afterwards only unfunded services suspend. Automatic recharge is not enabled yet.

## Where Railway wins

Railway is a general-purpose runtime. If your project is a container, Railway is the simpler choice and ohmyho.st is not a choice at all.

### When Railway is the better choice

- Any language. Python, Go, Rust, Ruby, PHP, Elixir or a JVM service builds from a Dockerfile or a buildpack and runs the way it runs on your laptop.
- Long-running processes. A WebSocket server, a queue worker, a Discord bot or a loop that holds state in memory needs a process that stays up. Railway bills that process by the second; ohmyho.st has no process to keep up.
- Volumes. A service that writes to local disk gets a persistent volume at about {{ usdPerMonth vendor.railway.volumeGbSecond }} per GB for a 30-day month. ohmyho.st has no disk to mount.
- Self-managed infrastructure. Redis, ClickHouse, a Postgres with your own extensions, or anything you would rather run as an image than rent as a service.
- One small always-on service. If it needs a slice of a vCPU and a few hundred MB, its per-second bill can sit inside the Hobby minimum, and Resend's free tier covers {{ text vendor.resend.free.includes }} for {{ usd vendor.resend.free }}. That is a hard price to beat for one project.

Railway also deploys from a Docker image, a CLI upload or a template, not only from GitHub. ohmyho.st deploys only from a GitHub repository you authorize.

{{ checked railway }}

{{ checked resend }}

## Where credits win

The case for credits is the developer with nine projects and two alive ones.

### Many quiet projects

There is no per-project base fee; every project draws from the one balance. Five quiet projects cost about this:

{{ table workload.fiveQuietProjects }}

That sits well inside the {{ number plan.paidCredits }} credits that {{ usd plan.paidUsd }} a month buys, with room for one of them to have a busy month. On Railway the same five are five services, each with its own per-second memory clock unless you switch every one to serverless and accept the cold start. If every one of them sleeps, Railway's Hobby minimum may still be the smaller bill; the difference shows up when they get traffic, because a woken container rents its whole memory again while ohmyho.st bills the requests it served.

### No per-service floor

A request that never arrives costs nothing. An app with no traffic keeps only its script (about {{ credits unit.deployedScriptMonth }} a month) and its stored data; the database suspends a minute after the last query and its storage keeps costing {{ rate neon.storage.root }}. Nothing rents memory while nothing runs.

### Postgres and mail on the same balance

Railway Pro plus Resend Pro is {{ usd scenario.railwayStack }} a month before any usage above the plan credits, across two accounts. Here Postgres compute, storage and transactional mail come off the same credits as hosting: mail at {{ rate mail.sent }} on Paid, with no monthly fee for the mail domain. Resend Pro is {{ usd vendor.resend.pro }} {{ text vendor.resend.pro.unit }} and covers {{ text vendor.resend.pro.includes }}. At that volume a dedicated mail plan is cheaper per message. The saving here is not the per-message price, it is the second account and the second plan: you send from the balance and the agent that already deployed the app.

### Bandwidth

Workers bandwidth is not charged. Railway meters service egress at {{ usd vendor.railway.egressGb }} per GB. A side project that serves images or downloads notices this line.

{{ checked railway }}

{{ checked resend }}

## What ohmyho.st does not run

Know the fence before you move anything.

- Containers. There is no Dockerfile path and no customer container runtime. An app that needs a native addon or a Node API that Workers does not provide is rejected at plan time with a reason that names the file.
- Non-JavaScript runtimes. No Python, Go, Rust, Ruby, PHP or JVM. TypeScript and JavaScript only.
- Frameworks. Next.js, Vite with React, and TanStack Start, each on Workers. Next.js builds through the platform-owned OpenNext overlay. Read https://docs.ohmyho.st/frameworks/nextjs, https://docs.ohmyho.st/frameworks/vite and https://docs.ohmyho.st/frameworks/tanstack before assuming a feature works, and https://docs.ohmyho.st/limits for the ceilings.
- Persistent disks. No volumes. Files go to project file storage at {{ rate r2.storage.standard }}; relational data goes to the managed Postgres.
- Long-running processes. A request gets a fixed CPU budget measured in milliseconds, then it ends. No WebSocket server that lives for hours, no worker loop, no in-memory state between requests. Periodic work runs as scheduled functions (functions.crons) that the agent verifies with function_runs_list; read https://docs.ohmyho.st/functions.
- Other deployment sources. GitHub only, through the GitHub App you authorize for the repository. No image push, no CLI upload, no other git host.
- Socket database drivers. A pg client cannot open a socket from a Worker. Database code uses the platform's customer-runtime client, and a plan that imports a socket driver is rejected with the file and the call named.

Your auth provider stays yours. Better Auth and a customer-owned WorkOS AuthKit are the verified application-auth integrations; the platform login is separate from your app's users. Read https://docs.ohmyho.st/application-auth.

## Side by side

{{ figure comparison.railway }}

The left card is two accounts at their plan minimum, before per-second usage. The right card is one balance shared by every project; the workload it prices, a small app for one month, is about {{ credits workload.smallApp }}, and [the cost breakdown](/pricing/breakdown) itemizes it line by line.

### How to move

ohmyho.st is hosting for vibe-coded apps: you deploy from Claude Code, Codex or Cursor, and the agent does the work through MCP.

1. Ask your agent to read https://ohmyho.st/llms.txt and the [get-started Skill](/skills/ohmyhost-get-started/SKILL.md). It installs the CLI and MCP server, sends you a sign-in link and selects your workspace.
2. Keep the app in GitHub and authorize the repository. The agent follows the [deploy Skill](/skills/ohmyhost-deploy-github/SKILL.md): project_create, source_link, deployment_plan, then deployment_create once you have seen the plan and its cost.
3. Move secrets through the stdin-only CLI command from secret_set_command, never through chat.
4. Move existing rows through a time-bound credential from database_access_create after the deployment has applied your versioned migrations.
5. Verify Dev through the reusable share link from project_dev_share_link_get, then promotion_plan and promotion_execute for Prod. Set a monthly ceiling with project_budget_set if you want one.

## FAQ

### Is ohmyho.st cheaper than Railway?

For quiet projects, usually. A quiet project is about {{ credits workload.quietProject }} a month and five of them about {{ credits workload.fiveQuietProjects }}, inside the {{ number plan.paidCredits }} credits that {{ usd plan.paidUsd }} buys. For one always-on service that fits inside Railway's Hobby minimum, Railway is cheaper. For a container of any kind, Railway is the only one of the two that runs it.

### Can I run a Docker container or a Python app on ohmyho.st?

No. ohmyho.st runs Next.js, Vite with React and TanStack Start on Workers, deployed from a GitHub repository you authorize. There is no container runtime, no Dockerfile path and no Python, Go, Rust, Ruby or PHP. An app that needs a native addon is rejected at plan time with the reason named. Keep those on Railway.

### What happens when my credits run out?

The first zero balance starts a {{ number plan.graceDays }}-day grace period. Funded services keep running during it, and any refill ends it. After an unresolved grace period only unfunded services suspend; your data, diagnosis, exports and the option to buy credits stay available. A project with a stop budget stops at its own limit instead of draining the shared balance.

### Does an idle database cost anything?

Compute stops after a minute without queries on the Free and standard profiles, so an idle database pays only for storage at {{ rate neon.storage.root }}. When it wakes, an active hour on the Paid standard profile is about {{ credits unit.activeDatabaseHourStandard }}. The performance profile waits five minutes before suspending and charges more for each active minute.

### Can I take my database and leave?

Yes. The owner asks the agent for an export through project_export_create and gets a password-encrypted ZIP with a portable SQL dump, at most one accepted request per project in any rolling 24 hours, downloadable through a signed link that is valid for 24 hours. Exports are free and work at zero credits. Restore the dump on Railway or any other Postgres.

### Is there a dashboard like Railway's?

Not for deploys. Your coding agent deploys through {{ tools }} MCP tools, and the expensive or destructive ones are two steps, such as deployment_plan then deployment_create. The portal at app.ohmyho.st shows projects, credits, budgets and API tokens. Usage questions go to the agent, which reads organization_usage_get and project_budget_get and answers with the meters.

{{ sources railway resend }}

[Compare Vercel](/vs/vercel) · [Cost breakdown](/pricing/breakdown) · [Deploy from Codex](/for/codex) · [Railway vs Render vs Fly vs ohmyho.st for solo developers](/blog/railway-vs-render-vs-fly-vs-ohmyho-st-for-solo-developers-2026)

ohmyho.st is an independent service, not affiliated with or endorsed by Vercel, Supabase or Resend. All trademarks belong to their respective owners.
