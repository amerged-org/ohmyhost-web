# Railway vs Render vs Fly.io vs ohmyho.st for solo developers: 2026 pricing

By Sebastian Mertens · September 20, 2026

Railway starts at {{ usd vendor.railway.hobby }} a month minimum usage, Render is {{ usd vendor.render.hobby }} plus compute from {{ usd vendor.render.webService512 }} a month for a web service, and Fly.io bills a small machine from {{ usd vendor.fly.sharedCpu1x }} a month by the second. ohmyho.st is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits shared by every project; a small app uses about {{ credits workload.smallApp }}.

{{ figure bills.railway }}

## How each one bills

Three models. Railway meters seconds against a monthly minimum. Render sells fixed-price instances on top of a plan. Fly.io meters machines by the second with no plan at all. ohmyho.st meters usage from one prepaid credit balance. Which one is cheapest depends on how much of the month your app is actually awake.

### Railway

Railway is a plan floor plus usage. The Free tier is {{ text vendor.railway.free.includes }}. Hobby is {{ usd vendor.railway.hobby }} a month minimum usage and carries the same amount of usage credit for a single developer workspace. Pro is {{ usd vendor.railway.pro }} a month minimum usage with {{ usd vendor.railway.pro }} of usage credit and team seats. Usage above the credit is added to the bill; the minimum is not charged on top of every dollar again.

Compute is metered per second on what the service actually uses. Over a full 30-day month, one vCPU lists at {{ usdPerMonth vendor.railway.vcpuSecond }}, one GB of memory at {{ usdPerMonth vendor.railway.memoryGbSecond }} and one GB of volume at {{ usdPerMonth vendor.railway.volumeGbSecond }}. Service egress is {{ usd vendor.railway.egressGb }} per GB; object storage is {{ usd vendor.railway.objectStorageGbMonth }} per GB-month. Railway can put an inactive service to sleep when you enable Serverless for that service, and wakes it on the next request (docs.railway.com/deployments/serverless, read 2026-09-20). A sleeping web service costs less; a Postgres service stays up.

### Render

Render is a plan plus fixed-price instances. Hobby is {{ usd vendor.render.hobby }} a month plus compute and covers {{ text vendor.render.hobby.includes }}. Pro is {{ usd vendor.render.pro }} a month plus compute and adds seats, bandwidth, domains and build minutes. A web service with 0.5 CPU and 512 MB is {{ usd vendor.render.webService512 }} a month; one with 1 CPU and 2 GB is {{ usd vendor.render.webService2g }} a month. Postgres starts at {{ usd vendor.render.postgres256 }} a month for 0.1 CPU and 256 MB, or {{ usd vendor.render.postgres1g }} a month for 0.5 CPU and 1 GB; expandable storage is {{ usd vendor.render.postgresStorageGb }} per GB. Beyond the plan, bandwidth is {{ usd vendor.render.bandwidthGb }} per GB, an extra custom domain is {{ usd vendor.render.domainOverage }} per month and build minutes are {{ usd vendor.render.buildMinutes }} per {{ number 1000 }} minutes. Persistent disk is {{ usd vendor.render.diskGbMonth }} per GB per month.

Render's free web service instance spins down after a period without traffic and spins up again on the next request, with a delay; its free Postgres expires after a set period unless upgraded (render.com/docs/free, read 2026-09-20). The instance rows above are the ones that stay awake.

### Fly.io

Fly.io has no plan floor on the page we checked. You pay for machines by the second. A shared-cpu-1x machine with 256 MB in Ashburn lists at {{ usd vendor.fly.sharedCpu1x }} a month if it runs the whole month; a performance-1x with 2 GB lists at {{ usd vendor.fly.performance1x }} a month. Additional RAM is {{ usd vendor.fly.additionalRamGb }} per GB per month. A stopped machine keeps paying {{ usd vendor.fly.stoppedMachineGb }} per GB of root filesystem per month. Volumes are {{ usd vendor.fly.volumeGbMonth }} per GB per month and snapshots are {{ usd vendor.fly.snapshotGbMonth }} per GB per month after a free allowance. Egress in North America and Europe is {{ usd vendor.fly.egressGb }} per GB.

Fly.io's proxy can stop machines when the app has spare capacity and start them again when a request arrives; a stopped machine is not charged for CPU and RAM (fly.io/docs/launch/autostop-autostart, read 2026-09-20). Postgres on Fly.io is not in our checked price list, so this page prices only the machine.

{{ checked railway }}

{{ checked render }}

{{ checked fly }}

## The same small app on each

The assumptions, stated once. One Next.js app with a Postgres database. About 1 GB of stored data. 100,000 requests a month. 20 build minutes. 2,000 transactional mail recipients. The database is active for about 8 hours in the month and idle the rest. That is exactly the ohmyho.st workload itemized in the next section. For the three competitors we give the list-price formula and the fixed rows; we do not invent a usage total, because their meters measure what your container actually consumes.

### On Railway

Start from the Hobby minimum of {{ usd vendor.railway.hobby }} a month, which covers the first {{ usd vendor.railway.hobby }} of usage. Then add vCPU-seconds, memory GB-seconds and volume GB-seconds for two services (the app and Postgres) at the per-second rates, plus egress at {{ usd vendor.railway.egressGb }} per GB. Two always-on services with a full vCPU each would list above the Hobby credit; two small idle containers may stay inside it. Serverless can sleep the web app, not the database. Railway has no mail product, so add a mail provider: the figure above shows Railway Pro with Resend Pro at {{ usd scenario.railwayStack }} a month before usage above the credits.

### On Render

Render is the easiest to price because the rows are fixed. Hobby at {{ usd vendor.render.hobby }}, one 0.5 CPU / 512 MB web service at {{ usd vendor.render.webService512 }} and one 0.1 CPU / 256 MB Postgres at {{ usd vendor.render.postgres256 }} sum to {{ usd scenario.renderSmallApp }} a month at list price. Our 1 GB of data sits at the edge of that instance's SSD; growth costs {{ usd vendor.render.postgresStorageGb }} per GB. Bandwidth above the Hobby allowance is {{ usd vendor.render.bandwidthGb }} per GB. Mail is again a separate provider.

### On Fly.io

Machine seconds times the machine rate. One shared-cpu-1x that never stops lists at {{ usd vendor.fly.sharedCpu1x }} a month; with autostop it drops toward {{ usd vendor.fly.stoppedMachineGb }} per GB of root filesystem for the stopped hours. Add {{ usd vendor.fly.volumeGbMonth }} per GB of volume if the app keeps files, and {{ usd vendor.fly.egressGb }} per GB out. Postgres means a second machine plus a volume, or a managed option; neither is in our checked list, so there is no total here. Mail is a separate provider.

### On ohmyho.st

The same app is about {{ credits workload.smallApp }}, with mail and database active time counted in the metered lines, against the {{ number plan.paidCredits }} credits a Paid month grants for {{ usd plan.paidUsd }}. The line items are in the next section.

{{ checked railway }}

{{ checked render }}

{{ checked fly }}

{{ checked resend }}

## Where each one wins

An honest list. Each of these is a real reason to pick the other platform.

### Railway wins when you need a container

Any Dockerfile runs on Railway: a Go binary, a Python worker, Redis, a queue consumer, a cron container. Several services in one project talk over a private network. ohmyho.st runs Next.js, Vite/React and TanStack Start from a GitHub repository and nothing else; there is no container runtime. If your app is not one of those three, Railway is the answer and this comparison is over.

### Render wins when you want a bill you can forecast

Render's compute rows are fixed monthly prices. A web service and a Postgres instance cost the same in a quiet month and a busy one, which some people prefer to any meter. Background workers and cron jobs are first-class service types. A free static site or a spin-down web service is fine for a demo.

### Fly.io wins on placement and raw machines

Fly.io lets you put machines in specific regions, or several regions at once, close to your users. You get a real VM: your own Postgres, custom binaries, long-lived processes, WebSockets that hold state. Per-second billing with no monthly floor rewards a machine that stops when idle.

### ohmyho.st wins when you have several small apps and a coding agent

No per-project base fee: five side projects draw from the same balance, and a dead one only pays for its stored data and one deployed script. Hosting, Postgres, transactional mail and a linked domain are metered from that one balance, so you are not stacking a hosting plan, a database plan and a mail plan. Your agent deploys through MCP; there is no dashboard to babysit. And you can leave: an on-demand export gives you a password-encrypted ZIP with a portable SQL dump.

The trade-offs run the other way too. ohmyho.st is young. Automatic recharge is not enabled yet. Mail and a custom domain need Paid. Exports are SQL only, one accepted request per project in any rolling 24-hour window, and the signed download link lasts 24 hours.

## Where ohmyho.st fits

The model in a few lines. Free is {{ number plan.freeCredits }} credits per UTC month. Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits per period. Monthly credits expire at period end; purchased top-ups never expire, at {{ number plan.topUpPerUsd }} credits per dollar with a better rate on larger packs. One credit has a nominal value of {{ usd plan.usdPerCredit }}. Every project in the organization draws from the same balance. A project may carry a monthly budget that either continues with warnings or stops new work. A zero balance starts a grace period of {{ number plan.graceDays }} days; funded services keep running, and only unfunded services suspend afterwards. Details on [pricing](https://docs.ohmyho.st/pricing) and [budgets](https://docs.ohmyho.st/budgets).

Here is the small app from the section above, line by line.

{{ table workload.smallApp }}

That total sits under the Paid grant. The biggest line is database active time: {{ rate neon.compute.scale }} on the Paid standard profile of {{ value profile.standard.cu }} CU, so one active hour is about {{ credits unit.activeDatabaseHourStandard }}. Idle database compute suspends and stops that meter; retained storage keeps billing at {{ rate neon.storage.root }}. The Free profile is {{ value profile.free.cu }} CU; the Paid performance profile is {{ value profile.performance.cu }} CU at {{ rate neon.compute.performance }}.

A side project you rarely touch looks different.

{{ table workload.quietProject }}

That fits inside the Free grant. What keeps drawing credits when nothing happens: stored data, each deployed script at about {{ credits unit.deployedScriptMonth }} a month, a linked custom hostname (Paid) at about {{ credits unit.customHostnameMonth }} a month and a mail sender zone (Paid) at about {{ credits unit.mailSenderZoneMonth }} a month. Workers bandwidth is not charged. SQL exports are free. Mail is metered per recipient at the Essentials rate, and To, CC and BCC each count; the small-app table shows what 2,000 recipients cost.

How a deploy actually happens when you deploy from Claude Code, Codex or Cursor: the agent reads the Skill, calls project_create and source_link for the GitHub repository you authorize, then deployment_plan, which quotes the build and its credits before deployment_create runs it. Promotion to Prod is promotion_plan then promotion_execute; rollback is rollback_plan then rollback_execute. Secrets go through the stdin-only CLI command from secret_set_command, never through chat. Every project gets Dev and Prod hosts on a three-word check.omh.st address; a customer-owned domain is Paid and metered, set up through domain_paid_plan and domain_paid_apply, and a sender subdomain for mail through mail_domain_set and mail_domain_status. US hosting is the default; EU is a per-project choice made once at creation, at the same prices. The portal at app.ohmyho.st shows projects, credits, budgets and API tokens; it does not deploy. The full 62-tool catalog is on the [MCP tools](https://docs.ohmyho.st/mcp-tools) page.

To try it, paste this into your agent:

```text
{{ prompt }}
```

## FAQ

### Which is cheapest for one small app that is mostly idle?

Fly.io with autostop or Railway with Serverless, if you accept a cold start and run Postgres yourself. Render's fixed rows land at {{ usd scenario.renderSmallApp }} a month for a small web service and Postgres. On ohmyho.st the quiet project above is about {{ credits workload.quietProject }}, inside the Free grant of {{ number plan.freeCredits }} credits, because idle database compute suspends.

### Does ohmyho.st run Docker containers like Railway or Fly.io?

No. ohmyho.st deploys Next.js, Vite/React and TanStack Start applications from a GitHub repository the customer authorizes, and nothing else. There is no container runtime and no other deployment source. An app that needs a native addon, a custom binary or an arbitrary Dockerfile belongs on Railway or Fly.io.

### What happens on ohmyho.st when the credits run out?

The first zero balance starts a grace period of {{ number plan.graceDays }} days. Funded services keep running. Any refill clears it. After an unresolved grace period only unfunded services suspend; your data, diagnosis, cancellation, buying credit and export stay available. Automatic recharge is not enabled yet, so a top-up is a deliberate purchase.

### Can I leave ohmyho.st with my data?

Yes. The organization Owner requests an export with project_export_create; the platform builds a password-encrypted ZIP with a portable SQL dump asynchronously and returns a signed download link valid for 24 hours. One accepted request per project in any rolling 24-hour window, free, even at zero credits. Restore it on any PostgreSQL host. Files and source are not in the archive. See [backups](https://docs.ohmyho.st/backups).

### Do I need Paid for a custom domain or transactional mail?

Yes. Free projects use their check.omh.st hosts. A customer-owned hostname needs Paid and draws about {{ credits unit.customHostnameMonth }} a month; a verified mail sender zone needs Paid and draws about {{ credits unit.mailSenderZoneMonth }} a month, plus the per-recipient mail rate. Paid itself is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits.

{{ sources railway render fly resend }}

[ohmyho.st and Railway](/vs/railway) · [Cost breakdown](/pricing/breakdown) · [Deploy from Codex](/for/codex)
