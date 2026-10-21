# Railway vs Render vs Fly.io vs ohmyho.st for solo developers: 2026 pricing

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · September 20, 2026

You have an app ready to host. Before you choose a plan, ask your Agent what the app needs to keep running: a web server, a database, background work, file storage and email. The cheapest web-service price only answers part of that question.

Railway starts at {{ usd vendor.railway.hobby }} a month minimum usage. Render is {{ usd vendor.render.hobby }} plus compute from {{ usd vendor.render.webService512 }} a month for a web service. Fly.io bills a small machine from {{ usd vendor.fly.sharedCpu1x }} a month by the second. ohmyho.st is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits shared by every project; the small-app example below uses about {{ credits workload.smallApp }}.

The competitor prices in this article are a dated snapshot, with the checked dates and sources below. Use them to understand the bill, then have your Agent check the selected plan before you pay.

{{ figure bills.railway }}

## Check what your app needs

Start with the repository. A static site, a server-rendered app and a worker that runs continuously need different hosting. A small homepage can also depend on a database or an email service that has its own bill.

Here a prompt:

```text
Inspect this repository and list what must run in production: the app, database, files, email and background work. Explain which requirements Railway, Render, Fly.io and ohmyho.st can meet. Flag anything you cannot verify. Do not create services yet.
```

Read the result as a description of your app. If it mentions a database you thought you had removed, ask your Agent to show which feature still uses it. If it proposes a rewrite just to fit a host, decide whether that work is worth doing before comparing prices.

If your priority is staying on a free plan, start with the [hosting and Postgres free-plan comparison](/blog/free-vercel-supabase-alternatives-2026). It covers ongoing allowances, trials, sleep, data retention, custom domains and business-use restrictions.

## Read the bill

Railway has a monthly minimum with usage included. Render charges for the instances you choose alongside its workspace plan. Fly.io charges for machines and related resources. ohmyho.st deducts metered usage from a prepaid credit balance shared across projects.

Your Agent can calculate from these rules, but it needs assumptions. Tell it whether a slow first request is acceptable, whether the database must always be available, and whether the app already has real users. Those choices affect which services can sleep.

### Railway

Railway's Free tier is {{ text vendor.railway.free.includes }}. Hobby is {{ usd vendor.railway.hobby }} a month minimum usage, with the same amount of usage credit for a single-developer workspace. Pro is {{ usd vendor.railway.pro }} a month minimum usage with {{ usd vendor.railway.pro }} of usage credit and team seats. You pay for usage above that credit. The minimum is not added again to every dollar of usage.

Compute is metered per second. Over a full month, a vCPU lists at {{ usdPerMonth vendor.railway.vcpuSecond }}, a GB of memory at {{ usdPerMonth vendor.railway.memoryGbSecond }} and a GB of volume at {{ usdPerMonth vendor.railway.volumeGbSecond }}. Service egress is {{ usd vendor.railway.egressGb }} per GB; object storage is {{ usd vendor.railway.objectStorageGbMonth }} per GB-month.

Railway can sleep an inactive service when Serverless is enabled and wake it for the next request. Ask your Agent to check which services can actually sleep; do not assume the database follows the web app. Background activity can also affect whether a service becomes inactive. The original comparison checked docs.railway.com/deployments/serverless on September 20, 2026; the [Serverless documentation](https://docs.railway.com/deployments/serverless) explains the behavior.

### Render

Render's Hobby plan is {{ usd vendor.render.hobby }} a month plus compute and covers {{ text vendor.render.hobby.includes }}. Pro is {{ usd vendor.render.pro }} a month plus compute and adds seats, bandwidth, domains and build minutes.

A small web service is {{ usd vendor.render.webService512 }} a month; the larger row in this comparison is {{ usd vendor.render.webService2g }}. Postgres starts at {{ usd vendor.render.postgres256 }} a month, with the next checked size at {{ usd vendor.render.postgres1g }}. Expandable database storage is {{ usd vendor.render.postgresStorageGb }} per GB.

Check the other lines too. Beyond the plan allowance, bandwidth is {{ usd vendor.render.bandwidthGb }} per GB, an extra custom domain is {{ usd vendor.render.domainOverage }} per month, and build minutes are {{ usd vendor.render.buildMinutes }} per {{ number 1000 }} minutes. Persistent disk is {{ usd vendor.render.diskGbMonth }} per GB per month.

The free web service sleeps without traffic and takes time to restart. Free Postgres expires unless upgraded. Those limits make a free demo different from the paid instances priced here. The original comparison checked render.com/docs/free on September 20, 2026; see [Render's free-instance limits](https://render.com/docs/free).

### Fly.io

The checked Fly.io price list has no plan floor. A small shared-CPU machine in Ashburn lists at {{ usd vendor.fly.sharedCpu1x }} a month if it runs throughout the month; the checked performance machine lists at {{ usd vendor.fly.performance1x }}. Additional RAM is {{ usd vendor.fly.additionalRamGb }} per GB per month.

Stopping a machine stops its CPU and RAM charges, but its root filesystem still costs {{ usd vendor.fly.stoppedMachineGb }} per GB per month. Volumes are {{ usd vendor.fly.volumeGbMonth }} per GB per month. Snapshots are {{ usd vendor.fly.snapshotGbMonth }} per GB per month after the free allowance, and egress in North America and Europe is {{ usd vendor.fly.egressGb }} per GB.

Your Agent can configure autostop and autostart, then test the first request after the app has been idle. The original comparison checked fly.io/docs/launch/autostop-autostart on September 20, 2026; see [Fly.io's current explanation](https://fly.io/docs/launch/autostop-autostart/). Postgres is outside our checked Fly.io price list, so the machine price is not a complete app-and-database total.

{{ checked railway }}

{{ checked render }}

{{ checked fly }}

## Price the same workload

The example is a Next.js app with Postgres, a small amount of stored data, occasional database activity, builds and transactional mail. The ohmyho.st table below states the quantities and rates. For the competitors, we use their checked price rows and billing formulas. We have not measured their containers, so we cannot turn the same feature list into an exact usage bill.

Here a prompt:

```text
Estimate a quiet month and a busy month for this app on the compatible hosts. Include the database, storage, builds, traffic and email. Cite the current prices and show every assumption. Keep measured usage, fixed prices and estimates separate, and identify missing costs.
```

Check the assumptions yourself. An app that sends a message after every form submission has a different mail workload from a portfolio with no forms. A scheduled task may keep a database active even when nobody visits the site. Ask your Agent to explain what happens during an idle month as well.

### On Railway

Start with the Hobby minimum of {{ usd vendor.railway.hobby }}, covering the first {{ usd vendor.railway.hobby }} of usage. Add the app's and database's CPU, memory and storage usage, plus egress at {{ usd vendor.railway.egressGb }} per GB. Whether the total stays within the minimum depends on their measured resource use.

Budget for a mail provider separately. The figure above shows Railway Pro with Resend Pro at {{ usd scenario.railwayStack }} a month before usage above the included credits. That combination is a reference scenario, not a requirement for every Railway project.

### On Render

The checked combination is Hobby at {{ usd vendor.render.hobby }}, a small web service at {{ usd vendor.render.webService512 }} and the smallest checked Postgres instance at {{ usd vendor.render.postgres256 }}. Together they list at {{ usd scenario.renderSmallApp }} a month.

Database growth adds storage at {{ usd vendor.render.postgresStorageGb }} per GB, and bandwidth beyond the Hobby allowance adds {{ usd vendor.render.bandwidthGb }} per GB. Add mail separately. Ask your Agent to confirm the selected database has room for your existing data and expected growth.

### On Fly.io

An always-running small machine lists at {{ usd vendor.fly.sharedCpu1x }} a month. With autostop, stopped hours retain the root-filesystem charge of {{ usd vendor.fly.stoppedMachineGb }} per GB instead of CPU and RAM charges. Add volumes at {{ usd vendor.fly.volumeGbMonth }} per GB and outbound traffic at {{ usd vendor.fly.egressGb }} per GB.

You still need to price the database and mail. Our checked list does not include a Fly.io database price, so there is no full-stack total here. Have your Agent fill that gap before comparing it with a price that already includes database usage.

### On ohmyho.st

The example uses about {{ credits workload.smallApp }}, including its mail and database active time. Paid provides {{ number plan.paidCredits }} credits for {{ usd plan.paidUsd }} per month. The table below shows the assumptions so you can replace them with your own.

{{ checked railway }}

{{ checked render }}

{{ checked fly }}

{{ checked resend }}

## Choose what you want to manage

Railway is worth considering when your repository needs containers, several connected services or a runtime outside ohmyho.st's supported application frameworks. Render suits people who want to choose fixed instance sizes and understand their baseline bill before traffic arrives. Fly.io suits people who need control over machines and placement and are comfortable owning more of the setup.

ohmyho.st is designed for using your Agent to operate supported Astro, Next.js, Vite/React and TanStack Start apps. It has no container runtime. Ask your Agent to check compatibility before treating it as a destination for a custom binary, native addon or long-running container.

The practical advantage for several small projects is a shared balance with no per-project base plan. Hosting, Postgres, transactional mail and linked domains draw from that balance. The trade-off is that you still need to understand usage, supported runtimes and feature access. Mail needs Paid. A custom domain needs Paid or, on Free, the “Powered by ohmyho.st” flag; that flag waives domain credits on either plan.

Your choice should also include the work after launch. Decide who will investigate a failed login, restore data, update dependencies and check a cost increase. Your Agent can help with each task, but you need a way to verify its work and recover if a change goes wrong.

## Check the ohmyho.st costs

Free grants {{ number plan.freeCredits }} credits per UTC month. Paid grants {{ number plan.paidCredits }} for {{ usd plan.paidUsd }} per period. Monthly credits expire at period end without rollover. Paid-only top-ups carry over until a downgrade to Free, starting at {{ number plan.topUpPerUsd }} credits per dollar with better rates on larger packs. A credit has a nominal value of {{ usd plan.usdPerCredit }}.

Every project in the organization uses that balance. You can give a project a monthly budget that warns or stops new work. A zero balance starts a grace period of {{ number plan.graceDays }} days. Funded services continue; unfunded services suspend after an unresolved grace period. Review [pricing](https://docs.ohmyho.st/pricing) and [budgets](https://docs.ohmyho.st/budgets) with your Agent before choosing a limit.

{{ table workload.smallApp }}

Database active time is the largest line in this example. Paid standard uses {{ value profile.standard.cu }} CU at {{ rate neon.compute.scale }}, making an active hour about {{ credits unit.activeDatabaseHourStandard }}. Idle database compute suspends; retained storage continues at {{ rate neon.storage.root }}. Free uses {{ value profile.free.cu }} CU, while the Paid performance profile uses {{ value profile.performance.cu }} CU at {{ rate neon.compute.performance }}.

For a project you rarely use, inspect the quiet-project example:

{{ table workload.quietProject }}

This example fits within the Free grant. Storage remains billable, as does each deployed script at about {{ credits unit.deployedScriptMonth }} a month. A linked custom hostname uses about {{ credits unit.customHostnameMonth }} a month unless the project shows the “Powered by ohmyho.st” flag. A mail domain has no monthly fee. Workers bandwidth and SQL exports are not charged. Sent mail uses {{ rate mail.sent }} per recipient; the table's mail line shows the effect of its stated volume.

## Test before you move

Give your Agent the existing project and source. It can continue that source, save a managed version or use the GitHub repository you select. It prepares a deployment plan that quotes the build before running it. You review the Dev app before promoting that version to Prod.

You do not need to memorize the tool names. Ask for the planned cost, the version being tested and the Dev link. Supply secrets through the private input flow. US hosting is the default; EU is a project-creation choice at the same prices. The portal at app.ohmyho.st shows projects, credits, budgets and API tokens. Deployment runs through your Agent; the [MCP tools](https://docs.ohmyho.st/mcp-tools) reference documents the {{ tools }}-tool catalog.

Here a prompt:

```text
Prepare this app on Dev using its current source. Show the build quote, required settings and expected ongoing costs. Give me a link and a short checklist for login, data, files and email. Keep the current production site serving while I review the result.
```

Open that link yourself. Sign in with a test account, save something, reload the page and retrieve it. Check an email if the app sends mail. Then ask your Agent to explain the traffic switch and rollback before moving your domain.

For the initial connection to ohmyho.st, use this prompt:

```text
{{ prompt }}
```

## Common questions

### Which host is cheapest for an idle app?

There is no complete answer from the web-service price alone. Consider Fly.io autostop or Railway Serverless where the workload supports sleeping, then price the database and other services. Render's checked small web service and Postgres combination is {{ usd scenario.renderSmallApp }} a month. The ohmyho.st quiet-project example uses about {{ credits workload.quietProject }}, within the {{ number plan.freeCredits }} Free grant.

### Can ohmyho.st run my Dockerfile?

No. It supports the application frameworks described above, not arbitrary containers. Ask your Agent to inspect the runtime requirements. If keeping the Dockerfile and its services is central to the project, compare container hosts before planning a port.

### What happens when credits run out?

The first zero balance starts a {{ number plan.graceDays }}-day grace period. A refill clears it. Funded services keep running; only unfunded services suspend after an unresolved period. Data, diagnosis, cancellation, credit purchase and export remain available. Automatic recharge stays off unless the Owner enables it.

### Can I take my data elsewhere?

The organization Owner can request a free password-encrypted ZIP containing a portable SQL dump, including at zero credits. It is built asynchronously, with a time-limited signed link and a rolling request limit described in [backups](https://docs.ohmyho.st/backups). Files and source are outside the archive. Have your Agent test restoration to the intended PostgreSQL destination before relying on it as your exit plan.

### Do domains and mail need Paid?

Managed transactional mail needs Paid. A customer-owned hostname needs Paid or, on Free, a project displaying the “Powered by ohmyho.st” flag and an active Prod deployment. It uses about {{ credits unit.customHostnameMonth }} a month without the flag. A verified mail domain has no monthly fee; sending is metered per recipient. Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits.

{{ sources railway render fly resend }}

[ohmyho.st and Railway](/vs/railway) · [Cost breakdown](/pricing/breakdown) · [Deploy from Codex](/for/codex)
