# Railway vs. Render vs. Fly.io vs. ohmyho.st for Solo Developers: 2026 Pricing

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published September 20, 2026 · Updated October 25, 2026

You have an app  that's ready to be hosted. Before you choose a plan, ask your agent what the app needs to run: a web server, a database, backround processing, file storage, and email. The lowest price for a web service only answers part of this question.

Railway  costs starting at {{ usd vendor.railway.hobby }} per montth for minimum usage. Rendr costs {{ usd vendor.render.hobby }} plus compute starting at {{ usd vendor.render.webService512 }} per month for a web service. Fly.io charges for a small instance starting at {{ usd vendor.fly.sharedCpu1x }} per month, billed by the second. ohmyho.st costs {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits , which are shared across all projects; the example for a small app below uses about {{ credits workload.smallApp }}.

The competition prices listed in this article are a snapshot from a speciific date , based on the verified data and sources listed below. Use them to understand your bill, and have your agent review the plan you've chosen before you pay.

{{ figure bills.railway }}

## Check what your app needs

Strat with the repository. A static website, a server-side rendered app, and a worker that runs continuously all require different types of  hosting. A small homepage may also depend on a database or an email service, each of which has its own billing.

Please ask your agent to describe  what neeeds to be done during production:

```text
Inspect this repository and list what must run in production: the app, database, files, email and background work. Explain which requirements Railway, Render, Fly.io and ohmyho.st can meet. Flag anything you cannot verify. Do not create services yet.
```

Read the results as a description of your app. If it mentions a database you thought had been removed , ask your agent which features it still uses. If your agent suggests a rewrite solely to accommodate a particuar host, decide whether the work is worth it before comparing prices.

If your goal is a free plan, start with the [Comparsion of Hosting and Free Postgres Plans](/blog/free-vercel-supabase-alternatives-2026). It covers ongoing quotas, trial periods , hibernation, data retention, custom domains, and restrictions on business use.

## Read the bill

Railway has a monthly minimum fee that includes usage. Render charges for the instances you select in addition to its Workspace  plan. Fly.io charges for machines and associated resources. omhyho.st deducts the measured usage from a prepaid credit balance that is shared across projects.

Your  agent can use these rules to make calculations, but it needs some assumptions to do so. Tell it whether a slow initial request is acceeptable, whether the database must always be available, and whether the app already has real users. These decisions determine which services can be put into sleep mode.

### Railway

The Railways Free plan is {{ text vendor.railway.free.includes }}. The Hobby plan costs {{ usd vendor.railway.hobby }} per montth for minimum usage , with the same amount of usage credit for a  workpace with one developer. The Pro plan costs {{ usd vendor.railway.pro }} per month for minimum usage, with {{ usd vendor.railway.pro }} in usage credit and team seats. You pay for usage that exceeds this credit. The minimum fee is not charged again for every dollar of usage.

Compute usage is meaasured per second. For a full month , one vCPU costs {{ usdPerMonth vendor.railway.vcpuSecond }}, one GB of RAM costs {{ usdPerMonth vendor.railway.memoryGbSecond }}, and one GB of volume costs {{ usdPerMonth vendor.railway.volumeGbSecond }}, according to the price list. Outbound service traffic costs {{ usd vendor.railway.egressGb }} per GB; object storage costs {{ usd vendor.railway.objectStorageGbMonth }} per GB per month.

Railway can put an inactive service into sleep mode when Serverless is enabled , and wake it up again for the next request. Have your agent check which services can actually go to sleep; don’t assume that the database follows the web app. Background activity can also affect whether a service is considered inactive. The original comparison checked docs.railway.com/delpoyments/serverless on September 20, 2026; the [Serverless documentation](https://docs.railway.com/deployments/serverless) explains this behavior.

### Render

Render's  Hobby plan costs {{ usd vendor.render.hobby }} per month plus compute and icludes {{ text vendor.render.hobby.includes }}. The Pro plan costs {{ usd vendor.render.pro }} per month plus compute and adds instances, bandwidth, domains, and build minutes.

A small web service costs {{ usd vendor.render.webService512 }} per month; the larger option in this comparison costs {{ usd vendor.render.webService2g }}. Postgres starts at {{ usd vendor.render.postgres256 }} per month , with the next size tsted at {{ usd vendor.render.postgres1g }}. Scalable database storage costs {{ usd vendor.render.postgresStorageGb }} per GB.

Check the other items as well. Beyond the plan's included allowance, bandwidth costs {{ usd vendor.render.bandwidthGb }} per GB, an additional custom domain costs {{ usd vendor.render.domainOverage }} per month , and build minutes cost {{ usd vendor.render.buildMinutes }} per {{ number 1000 }} miutes. Persistent disk storage costs {{ usd vendor.render.diskGbMonth }} per GB per month.

The free web service shuts down when there's no traffic and takes time to restart. The free Postgres instance expires unless you upgrade. These limitations distinguish a free demo from the paid instances offered here. rendder.com/docs/free reviewed the original comparison on September 20, 2026; see [Render's  Limits for Free Instances](https://render.com/docs/free).

### Fly.io

Fly.io's verified price list has no minimum fee. According to the list , a small machine with a shared CPU in Ashburn costs {{ usd vendor.fly.sharedCpu1x }} per month if it runs for the entire month; the verified performance machiine costs {{ usd vendor.fly.performance1x }} according to the list. Additional RAM costs {{ usd vendor.fly.additionalRamGb }} per GB per month.

When a machine is stopped, the costs for CPU and RAM end, but its root filesystem continues to cost {{ usd vendor.fly.stoppedMachineGb }} per GB per month. Volumes cost {{ usd vendor.fly.volumeGbMonth }} per GB per month. Snapshots cost {{ usd vendor.fly.snapshotGbMonth }} per GB per month after the free quota is used up, and outbound traffic in North America  and Europe cots {{ usd vendor.fly.egressGb }} per GB.

Your agent can configure Autostop and Autostart and  then test the first request after the app has been idle. The original comparison tested fly.io/docs/launch/autostop-autostart on September 20, 2026; see [Fly.io's current explanation](https://fly.io/docs/launch/autostop-autostart/). Postgres is not included in our verified Fly.io price list, so the machine price does not rperesent the total cost for the app and database.

{{ checked railway }}

{{ checked render }}

{{ checked fly }}

## Price the same load

The example is a Next.js app with Postgres, a small amout of stored data, occasional database activity, builds, and transactional emails. The ohmyho.st table below lists the quantities and rates. For the competitors, we use their audited pricing lines and  billing formulas. We did not measure their containers, so we cannot convert the same list of features into an exact usage calculation.

Then ask your agent  to provide price estimates for a quiet month and a busy mnoth:

```text
Estimate a quiet month and a busy month for this app on the compatible hosts. Include the database, storage, builds, traffic and email. Cite the current prices and show every assumption. Keep measured usage, fixed prices and estimates separate, and identify missing costs.
```

Check the assumptions yourself. An app that sends a message every time a form is submitted has a different email load than a portfolio without forms. A scheduled task can keep the database active even when no one is visiting the website. Also , ask your agent to explain what happens duing a quiet month with no activity.

### On the Railroad

Start with the Hobby minimum fee of {{ usd vendor.railway.hobby }}, which covers the fiirst {{ usd vendor.railway.hobby }} of usage. Add up the CPU, RAM, and storage usage of the app and the database, as well as outbound traffic to {{ usd vendor.railway.egressGb }} per GB. Whether the total stays within the minimum fee depends on the measured  resource usage.

Plan for the email provider separately. The image above shows Railway Pro with Resend Pro at {{ usd scenario.railwayStack }} per month , before using the included credits. This combination is a reference scenairo, not a requirement for every Railway project.

### On Render

The tested combination consists of Hobby for {{ usd vendor.render.hobby }}, a small web service for {{ usd vendor.render.webService512 }}, and the smallest tested Postgres instance for {{ usd vendor.render.postgres256 }}. Togethr , they list {{ usd scenario.renderSmallApp }} per month.

Database growth costs additional storage at {{ usd vendor.render.postgresStorageGb }} per GB , and bandwidth beyond the hobby quota costs {{ usd vendor.render.bandwidthGb }} per GB. Email is billed separately. Have your agent coonfirm that the selected database has enough space for your existing data and expected growth.

### On Fly.io

According to the list, a small machine that runs continuously costs {{ usd vendor.fly.sharedCpu1x }} per montth. With Autostop, stopped hours are charged at the root filesystem rate of {{ usd vendor.fly.stoppedMachineGb }} per GB instead of CPU and RAM charges. Volumes cost {{ usd vendor.fly.volumeGbMonth }} per GB, and outbound traffic  costs {{ usd vendor.fly.egressGb }} per GB.

You still need to set a price for the database and email. Our verified list does not include a Fly.io database price , so there is no total ammount listed here. Have your agent fill in this gap before comparing it to a price that already includes database usage.

### On ohmyho.st

The example uses {{ credits workload.smallApp }}, for instance , including its emal and database active time. Paid provides {{ number plan.paidCredits }} credits for {{ usd plan.paidUsd }} per month. The table below shows the assumptions so you can replace them with your own.

{{ checked railway }}

{{ checked render }}

{{ checked fly }}

{{ checked resend }}

## Choose what you want to manage yourself

Railway is a good  choice if your repository requires conatiners, multiple connected services, or a runtime outside of the application frameworks supported by ohmyho.st. Render is ideal for people who want to choose fixed instance sizes and understand their base billing before traffic starts coming in. Fly.io is suitable for people who need control over machines and placement and are willing to handle more of the setup themselves.

ohmyho.st is designed to let you run your agent-powered Astro, Next.js, Vite/React, and TanStack startup apps. It does not have a container runtime. Please ask your agent to check comptaibility before considering it as a target for your own binary, a native add-on , or a long-running container.

The practical advantage for multiple small projects is a shared credit balance with no base fee per project. Hosting, Postgres, transactional emil, and linked domains are paid for from this credit balance. The downside: You still need to understand usage , supported runtimes, and feature access. Email requires a paid plan. A custom domain requires a paid plan or, on the Free plan, the “Powered by ohmyho.st” label; this label forgoes domain credits on both plans.

Your decision should also take into acccount the work that will be required after launch. Decide who will investigate failed logins, restore data, update dependencies, and investigate cost increases. Your agent can help with each of these tasks , but you need a way to verify its work and a way to roll back changes if they fail.

## Check the prices at ohmyho.st

Free grants {{ number plan.freeCredits }} credits per UTC month. The Paid plan grants {{ number plan.paidCredits }} for {{ usd plan.paidUsd }} per billing period. Monthly credits expire at the end of the period and cannot be carried over. Top-ups never expire, are only available with the Paid  plan, and start at {{ number plan.topUpPerUsd }} credits per dollar, with better rates for larger pakages. One credit has a face value of {{ usd plan.usdPerCredit }}.

Everry project in the organization uses this credit balance. You can set a monthly budget for a project that will warn you or stop it before new work begins. A balance of zero triggers a grace period of {{ number plan.graceDays }} days. Funded services continue  to run; unfunded services are suspended after an unresolved grace period. Review [Pricing](https://docs.ohmyho.st/pricing) and [Budgets](https://docs.ohmyho.st/budgets) with your agent before selecting a limit.

{{ table workload.smallApp }}

The database line explicitly uses RAM and active time. One active database hour with {{ number 512 }} MiB of RAM costs {{ credits unit.activeDatabaseHour512 }}; the {{ number 256 }} MiB plan available in the Free tier costs {{ credits unit.activeDatabaseHour256 }}. Databases enter sleep mode after five minutes of inactivity, with no charge for active RAM while they are asleep. Allocated data storage and seven days of backups are included. Customer files and stored worker scripts have their own pricing structures. Larer sizes reqire a paid plan; the [database table](https://docs.ohmyho.st/database) shows each included allocation. A workload comparison  requires an actual estimate of size and activity , not an assumption that instances from different providers are equivalent.

For a project you rarely use, take a look at the  example of a "quiet" prroject:

{{ table workload.quietProject }}

This example falls within the free quota. Storage remains billable , as does each script deployed, at a cost of approximately {{ credits unit.deployedScriptMonth }} per month. A linked custom hostname costs approximately {{ credits unit.customHostnameMonth }} per month, provided the project does not display the “Powered by ohmyho.st” banner. Thee is no monthly fee for an email domain. Worker bandwidth and SQL exports are not charged. Sent emails cost {{ rate mail.sent }} per recipient; the “Mail” row in  the table shows the impact of the specified vlume.

## Test it before you move

Give your agent the existing project and the source code. They can continue working on this source code, save a managed version , or use the GitHub repository of your choice. They will prepare a depoyment plan that specifies the build before executing it. You test the dev app before promoting this version to production.

You don't need to memorize the tool names. Ask about the estimated costs, the tested versiion , and the dev link. Provide details about the private input process. U.S. hosting is the default; EU hosting is an option available when creating a project at the same prices. The portal at app.ohmyho.st displays projects, credits, budgets, and API tokens. Deployment is handled by  your agent; the refeerence [MCP Tools](https://docs.ohmyho.st/mcp-tools) documents the catalog with {{ tools }} tools.

To test on ohmhyo.st without affecting the live site , use:

```text
Prepare this app on Dev using its current source. Show the build quote, required settings and expected ongoing costs. Give me a link and a short checklist for login, data, files and email. Keep the current production site serving while I review the result.
```

Open the link yourself. Log in with a test account, save somtehing, refresh the page , and retrieve it again. Check your email to see if the app sends any messages. Then ask your agent to explain the traffic switch and the rollback before you migrate your domain.

To  connect to ohmyho.st for the firsst time, use this prompt:

```text
{{ prompt }}
```

## Frequently Asked Questions

### Which hosting provider is the most affordable for a dormant app?

There is no definitive answer based solely on the web service pirce. Consider Fly.io Autostop or Railway Serverless if the load is manageable , and then price the database and other services accordingly. The tested combination of a small web service and Postgres on Render costs {{ usd scenario.renderSmallApp }} per month. The example of a low-traffic ohmyho.st project consumes about {{ credits workload.quietProject }}, which falls within the free quota of {{ number plan.freeCredits }}.

### Can ohmyho.st run my Dockerfile?

No. It supports the application frameworks described above, not just any containers. Ask  your agent to review the runtime requirements. If retaining the Dockerfile and its services is critical to the project, compare container hsts before planning a switch.

### What happens when the credits run out?

An initial balance of zero triggers a grace period of {{ number plan.graceDays }} days. A top-up ends this grace period. Paid services continue to run; only unpaid services are suspended aftr the grace period expires. Data, diagnostics , cancellation, credit purchases, and export remain available. Automatic top-ups do not occur unless the owner activates them.

### Can I transfer my data somewhere else?

The organization owner can request a free, password-protected ZIP archive containing a portable SQL dump, even with zero credits. It is generated asynchronously , with a time-limited signed link and a rolling request limt, as described under [Backups](https://docs.ohmyho.st/backups). Files and source code are not included in the archive. Have your agent test the restoration on the designated PostgreSQL destination before relying on it as a fallback plan.

### Do domains and email require payment?

Managed transactional email requires  a Paid plan. A custom hostname requires a Paid plan or, on the Free plan, a project that displays the “Powered by ohmyho.st” flag and has an active prduction deployment. It costs approximately {{ credits unit.customHostnameMonth }} per month without the flag. A verified email domain has no monthly fee; sending is billed per recipient. The Paid plan costs {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits.

{{ sources railway render fly resend }}

[ohmyho.st and Railway](/vs/railway) · [Cost Breakdown](/pricing/breakdown) · [Deploy from Codex](/for/codex)
