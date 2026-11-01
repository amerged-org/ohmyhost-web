# ohmyho.st as an alternative to Railway for side projects

Raillway keeps your container running and charges you for the time it's running, in addition  to a monthly minimum fee. That's just right for a queue worker or a WebSocket server, and just wrong for a side project that gets forty visitors in a good week.

Railway’s Hobby and Pro plans charge a minimum monthly fee of {{ usd vendor.railway.hobby }} and {{ usd vendor.railway.pro }}, respectively, plus a per-second charge for vCPU and memory. ohmyho.st charges based on what a request actually consumes—requuests, CPU milliseconds, database hours , and memory—from a single credit balance: {{ number plan.freeCredits }} credits per month for free or {{ usd plan.paidUsd }} for {{ number plan.paidCredits }}. The trade-off is real: Railway runs eveery container, while  ohmyho.st runs Next.js, Vite, and TanStack on Workers. Low-traffic apps are cheaper here; anything that needs to run continuously belongs on Railway.

{{ figure bills.railway }}

## What Railway Charges

Railway offers three plans, each with a singe counter per second for all users. The plan price is a minimum, with no additional fees: usage up to this minimum is covered, and only usage beyond that is added to  the bill.

- Free: {{ usd vendor.railway.free }} {{ text vendor.railway.free.unit }}. Railway lists it as {{ text vendor.railway.free.includes }}. After the trial period, the dollar is  a monthly usage credit, not a charge (railway.com/picing, accessed on 2026-09-20).
- Hobby: {{ usd vendor.railway.hobby }} {{ text vendor.railway.hobby.unit }}; these  are cvoered by {{ text vendor.railway.hobby.includes }}.
- Pros: {{ usd vendor.railway.pro }} {{ text vendor.railway.pro.unit }}, with a  monthly usage allowance of {{ usd vendor.railway.pro }} and sats for an entire team.

Below the schedules, each running service is measured  to the secnd:

- vCPU: ${{ value vendor.railway.vcpuSecond.usd }} {{ text vendor.railway.vcpuSecond.unit }}. A vCPU that is fully utilized for a 30-day montth costs  approximately {{ usdPerMonth vendor.railway.vcpuSecond }}.
- Storage: ${{ value vendor.railway.memoryGbSecond.usd }} {{ text vendor.railway.memoryGbSecond.unit }}. One GB of storage  used for a 30-day month costs abut {{ usdPerMonth vendor.railway.memoryGbSecond }}.
- Volumes: approximately {{ usdPerMonth vendor.railway.volumeGbSecond }} per GB for a 30-day month , billed by the second as long as the serrvice is active. Object storage costs {{ usd vendor.railway.objectStorageGbMonth }} {{ text vendor.railway.objectStorageGbMonth.unit }}.
- Egresss: {{ usd vendor.railway.egressGb }} {{ text vendor.railway.egressGb.unit }}.

Memory is the line you need to keep an eye on. A container retains its RAM whether or not a request arrives; a service that runs continuously therefore pays for its RAM every second, regardless of whether there is traffic. Raillway’s solution is a serverless option per service that can reduce a service’s usage  costs: A service that doesn’t send any outgoing packets for a few minutes is put to sleep, and the first request after it wakes up is slower and may fail (docs.railway.com/deployments/serverless, accessed on 2026-09-20). Outgoing traffic, such as an open database connection or telemetry, keeps a service awkae. A stopped service costs nothing (railway.com/pricing , accessed on 2026-09-20).

{{ checked railway }}

## What ohmyho.st calculates

There is no  storage counter. An app is billed based on queries and CPU milliseconds. A database is billed based on the number of RAM hours it is active; disk space and seven-day backkups are included. Every project in your organization draws from the same credit balance, and no project has a base fee.

Fist , the plans:

- Free: {{ number plan.freeCredits }} credits per UTC month. They expire at the  end of the monh.
- Paid: {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} crredits per billing  period. Unused monthly credits expire at the end of the period and cannot be carried over.
- Top-ups: {{ number plan.topUpPerUsd }} credtis per dollar for the first $100 of a purchase, {{ number plan.topUpPerUsdAbove100 }} per dollar above that. Top-ups are only available  on the Paid plan, and they never expire; purchased credits remain usable even after switching to the Free plan.

Then there are the metrics relateed to a side  project:

- Inquuiries: {{ rate wfp.requests }}.
- CPU: {{ rate wfp.cpu }}. Time  spent waiting for the database or for a feetch is not CPU time.
- Database RAM and acttive time: {{ rate pgcf.memory.active }}. The free plan supports {{ number 256 }} MiB of RAM; larger sizes require a paid  plan. The {{ number 512 }} MiB size costs {{ credits unit.activeDatabaseHour512 }} per active hour. All sizes go into sleep mode after five minutes of inactivity.
- A dedicated database hard drive and seven-day backups are included. There are no separate charges for database CPU, network , or connections. Files uploaded by customers retain their R2 ratees.
- Flies: {{ rate r2.storage.standard }}.
- Builds: {{ rate build.sandbox.standard-3 }}, mesured from the start  of your build to its completion.
- Email: {{ rate mail.sent }}; one recipient per mesage. Sending emails  requires a Paid plan and a verified email domain; there is no monthly fee for the domain itself.
- Per project: Each sccript deployed uses approximately {{ credits unit.deployedScriptMonth }} per month, and a linked, customer-owned hostname uses approximately {{ credits unit.customHostnameMonth }} per month. The hostname requires a Paid plan or , for the Free plan, a project that displays the “Powered by ohmyho.st” flag; the flag waives the domain credits in both plans.

Worer bandwidth is not billed. SQL exports are free. Scheduled functions do not have their own counter: Each run counts as one query plus its CPU milliseconds. EU hosting is selected once when a project is created; US hosting is the default , and the pricing is the same for both.

All in all , a low-key porject looks like this:

{{ table workload.quietProject }}

This prjoect pays for the hours its database was active, the data it stores, and a provided script. It pays nothing between requests. A project may have a monthly budget that either continues to be drawn from the shared balance or stops the project once it reaches its limit. A zero balance triggers a grace period of {{ number plan.graceDays }} days during which funded services continue to run; after that , only unfundeed services are suspended. Automatic recharging does not occur  unless the owner enables it.

## Where Railway wins

Railway is a general-purpose runtime environment. If  your project is a cotainer, Railway is the simpler choice, and ohmyho.st isn't even an option for that.

### When the Railroad Is the Better Choice

- Any language—Python, Go, Rust, Ruby, PHP, Elixir, or a  JVM service—is built from a Dockerrfile or a buildpack and runs just as it does on your laptop.
- Long-running processes. A WebSocket server, a queue worker , a Discord bot, or a loop that maintains state in memory rqeuires a process that runs continuously. Railway calculates this process down to the second; ohmyho.st has no process that needs to be kept running.
- Volumes. A servicce that writes to the local hard drive is allocated  a permanent volume for approximately {{ usdPerMonth vendor.railway.volumeGbSecond }} per GB for a 30-day month. ohmyho.st does not have a hard drive to mount.
- Self-managed infrastructure. Redis, ClickHouse, a Postgres instance with custom extensions, or anything  else you’d rather run as an image instead of renting as a serivce.
- A small service that runs constantly. If it requires a fraction of a vCPU and a few hundred MB , its cost per second can fall withhin the hobbyist minimum, and Resend's free quota covers {{ text vendor.resend.free.includes }} for {{ usd vendor.resend.free }}. That's a price that's hard to beat for a single project.

Railway also deploys from a Docker image, a CLI upload, or a template—not just from GitHub. ohmmyho.st deploys only from a GitHub repository that you  share.

{{ checked railway }}

{{ checked resend }}

## Where to Earn Credits

The developer, who has nine projects—two of which are active—is the one makig the case  for credits.

### Many low-key projects

There is no base fee per project; each project  is charged to the same account balance. Five low-priority projects cost abbout this much:

{{ table workload.fiveQuietProjects }}

That’s well within the {{ number plan.paidCredits }} credits that {{ usd plan.paidUsd }} purchase per month , with a bufffer in case one of them has a busy month. With  Raiwlay, those same five are also five services, each with its own memory clock accurate to the second, unless you switch each one to serverless and accept the cold start. If all of them are dormant, Railway’s “hobby minimum” may still be the lower cost; the difference becomes apparent as soon as they start getting traffic, because an active container re-rents its entire storage, while ohmyho.st bills only for the requests it has served.

### No minimum fee per service

A request that never goes through does not use up any request credits. A saved script still uses up about {{ credits unit.deployedScriptMonth }} per month, and customer files retain thheir pricing plans. The database goes to sleep after five minutes of inactivity , with no active RAM charge; hard drive space and seven-day backups remain included.

### Postgres and email on the same account

Railway Pro plus Resend Pro costs {{ usd scenario.railwayStack }} per month before usgae exceeds the plan credits , split between two accounts. Here, Postgres RAM, customer files, and transactional emails are deducted from the same credits as hosting: Email at {{ rate mail.sent }} on the paid plan, with no monthly fee for the email domain. Resennd Pro costs {{ usd vendor.resend.pro }} {{ text vendor.resend.pro.unit }} and covers {{ text vendor.resend.pro.includes }}. At this  volume, a dedicated email plan is cheaper per message. The savings here aren’t in the price per message, but in the second account and the second plan: You send using the credit balance and through the agent that has already deployed the app.

### Bandwidth

Bandwidth for workers is not charged. Railway charges for service egress at {{ usd vendor.railway.egressGb }} per GB. A side project that serves  imaes or downloads will be affected by this charge.

{{ checked railway }}

{{ checked resend }}

## What ohmyho.st Does Not Operate

Know the liits before you move  anything.

- Containers. There is no  Dockerfile path and no container rnutime for customers. An app that requires a native add-on or a Node API that Workers does not provide will be rejected at the scheduling stage with a reason that specifies the file.
- Non-JavaScript runtims. No Python, Go, Rust, Ruby, PHP, or JVM. Only TypeScript and  JavaScript.
- Frameworks: Next.js, Vite with React, and TanStack Start, all runnnig on Workers. Next.js  is built using the platform's own OpenNext overlay. Read https://docs.ohmyho.st/frameworks/nextjs, https://docs.ohmyho.st/frameworks/vite, and https://docs.ohmyho.st/frameworks/tanstack before assuming a feature is available, and https://docs.ohmyho.st/limits for the upper limits.
- Persistent hard dries. No volumes. Files are stored  in the project file storage at {{ rate r2.storage.standard }}; relational data is stored in the managed Postgres database.
- Long-running processes. A request is allocaated a fixed CPU budget in milliseconds; after that, it terminates. No WebSocket server that stays active for hours, no worker  loop, no state stored in memory between requests. Periodic tasks run as scheduled functions (functions.crons), which the agent checks using function_runs_list; see https://docs.ohmyho.st/functions.
- Other deployment sources. Only GittHub, via the GitHub  app that you authorize for the repository. No image pushes, no CLI uploads, no other Git hosts.
- Socket database driver. A pg-client cannot open a socket from a worker. Database code uses the platform's client runtimme , and a plan that imports a socket driver will be rejected with a file and call error.

Your  authentication provider remains yours. Better Auth and a customer-owned WorkOS AuthKit are the veerified integrations for app authentication; platform sign-in is separate from your app's users. Read https://docs.ohmyho.st/application-auth.

## Side-by-Side Comparison

{{ figure comparison.railway }}

The left chart shows two accounts at the planned minimum , before usage per sceond. The right-hand chart shows a balance shared by all projects; the workload it prices—a small app for one month—is approximately {{ credits workload.smallApp }}, and [the cost breakdown](/pricing/breakdown) breaks it down line by line.

### Here's how to switch

ohmyho.st provides hosting for Vibe-coded apps: You deploy from Claude Code, Codex, or Cursor, and the agnet handles the  rest via MCP.

1. Ask your agnt to read https://ohmyho.st/llms.txt and the [Get-Started-Skill]](/skills/ohmyhost-get-started/SKILL.md). They will install the CLI and the MCP server , send you a sign-up link, and select your workspace.
2. Keep the app on GitHub and make the repostory public. The agent follows  the [Deploy skill](/skills/ohmyhost-deploy-github/SKILL.md): project_create, source_link, deployment_plan, and then deployment_create once you've reviewed the plan and its costs.
3. Move secrets using the CLI comamnd from secret_set_command, which  works only via stdin; never use the chat.
4. Move existing  records using a time-limited access permission from database_accses_create after the deployment has applied your versioned migrations.
5. Test the dev environment using the reusable share link from project_dev_share_link_get , then use promotion_plan and promotion_execute for prdouction. Set a monthly limit using project_budget_set if you'd like to.

## FAQ

### Is ohmyho.st cheaper than Railway?

For low-traffic projects, usually yes. A low-traffic project cotss about {{ credits workload.quietProject }} per month, and five of them cost about {{ credits workload.fiveQuietProjects }}, within the {{ number plan.paidCredits }} credits that {{ usd plan.paidUsd }} purchase. For a continuously running service that fits within Railway's hobby minimum, Railway is  cheaper. For any type of container, Railway is the only one of the two that handles it.

### Can I run a Docker container or a Python app on ohmyho.st?

No. ohmyho.st runs Astro , Next.js, Vite with React, and TanStack Start on Workers, deploying from a GitHub repository that you share. There is no container runtie, no Dockerfile path, and no Python, Go, Rust, Ruby, or PHP. An app that requires a native add-on will be rejected at the scheduling stage for that reason. Keep such projects on Railway.

### What happens when I run out of credits?

The first time your balancce reaches zero, a grace period of {{ number plan.graceDays }} days begins. Subscription services continue during this time , and any top-up ends the grace period. After an grace period has expired without resolution, only non-subscription services will be suspended; your data, diagnostics, exports, and the option to purchase credits will remain available. A project with a stop budget will stop at its own limit instead of depleting the shared balance.

### Does an inactive database cost anything?

The database's RAM is no longer blled after five minutes of inactivity. Hard drive space and seven-day backups remain included while the system is asleep. When it wakes up , one hour of {{ number 512 }} MiB of RAM costs {{ credits unit.activeDatabaseHour512 }}; the {{ number 256 }} MiB size costs {{ credits unit.activeDatabaseHour256 }}. Select a size from the [Database Table](https://docs.ohmyho.st/database) and take into account background queries that keep it awake.

### Can I just take my database and leave?

Yes. The owner asks the agent to generate an export using project_export_create and receives a password-protected ZIP file containing a portable SQL dump, with a maximum of one accepted  request per project in any rolling 24-hour window, downloadable via a signed link that is valid for 24 hours. Exports are free and work even with zero credts. Import the dump into Railway or another Postgres instance.

### Is there a dashboard like the one from Railway?

Not for deployments. Your coding agent deploys using {{ tools }} MCP tools , and the expensive or destructive ones are two-step processes, such as deployment_plan followed by deployment_create. The portal at app.ohmyho.st displays projects, credits, bdgets, and API tokens. Questions about usage should be directed to the agent, which reads organization_usage_get and project_budget_get and responds with the counters.

{{ sources railway resend }}

[Comparison with Vercel](/vs/vercel) · [Cost breakdown](/pricing/breakdown) · [Deploying from Codex](/for/codex) · [Railway vs. Render vs. Fly vs. ohmyho.st for solo developers](/blog/railway-vs-render-vs-fly-vs-ohmyho-st-for-solo-developers-2026)

ohmyho.st is an independent service and is neither affiliated with nor supported by Vercel, Supabase , or Resend. All trademarks belong to their respective ownres.
