# Cheaper than Vercel? The ohmyho.st cost breakdown

Yes for several small projects, no for one busy app. {{ usd plan.paidUsd }} a month buys {{ number plan.paidCredits }} credits shared by every project; a small app uses about {{ credits workload.smallApp }} of them, a quiet side project about {{ credits workload.quietProject }}. Vercel Pro, Supabase Pro and Resend Pro bought separately cost {{ usd scenario.threeSubscriptions }} a month before any usage.

## What a credit is

One credit has a nominal value of {{ usd plan.usdPerCredit }}, so {{ number plan.topUpPerUsd }} credits represent {{ usd 1 }} of credit value. The published rate card sets each price. Managed database RAM uses the fixed size tariff shown on the pricing page; other meters use their published provider-derived rates. Each rate rounds up to the next microcredit (one credit is a million microcredits), no meter has a minimum charge, and a balance never goes negative. Provider free tiers are not passed through: you pay the list-cost rate from the first unit, which is also why nothing on this page depends on a quota you might exceed.

Credits arrive three ways:

- Free grants {{ number plan.freeCredits }} credits per UTC month. They expire at the end of that month.
- Paid costs {{ usd plan.paidUsd }} a month before tax and grants {{ number plan.paidCredits }} credits per paid period. Unused monthly credits expire at the end of their billing period without rollover. Verified sender mail needs Paid. A customer-owned domain needs Paid or, on Free, a project that shows the “Powered by ohmyho.st” flag; mail uses credits, and the domain uses none while the flag shows.
- Top-ups never expire, and neither do automatic recharge, signup-bonus and referral credits: all one-time credits stay until you spend them, also after a downgrade to Free. Only Paid users can buy top-ups or turn on automatic recharge. A purchase grants {{ number plan.topUpPerUsd }} credits per dollar up to {{ usd 100 }} and {{ number plan.topUpPerUsdAbove100 }} credits per dollar for the part above that. Monthly credits are spent before top-ups.

Every project draws from the organization's one balance. There is no per-project base fee and no project-count limit. A project may carry a monthly budget in continue mode (warn, keep going) or stop mode (reject new work past the line); a budget is a ceiling, not a second wallet. A zero balance starts a {{ number plan.graceDays }}-day grace period during which funded services keep running; after it, only unfunded services suspend, and data, export and buying credit stay available. Automatic recharge stays off unless the Owner turns it on.

## Every published rate

{{ table rates }}

How to read it: the Credits column is what you pay for the measured quantity, rounded up to microcredits. Worker requests and CPU are separate meters; functions and crons use those same meters. Database RAM is multiplied by active time, with allocated disk and seven-day backups included. Database CPU, network and connections have no separate charge. The R2 rows meter customer-uploaded files: storage by daily peak, then writes and reads by operation. Sent mail is charged per sent recipient and received mail per message; webhook retries add no mail charge. A mail domain has no monthly fee.

The build row deserves a closer look. It reads {{ rate build.sandbox.standard-3 }}, but the code does not store a per-second decimal. It stores the exact sandbox rational, {{ number unit.buildRateUnit dp=4 }} for every {{ number 175 }} build seconds, and prices each build from its measured seconds, rounded up to the full second. Sandbox start-up time is not billed. A deployment plan holds the build price before the build starts and releases what the build did not use. So 20 build minutes cost {{ credits unit.twentyBuildMinutes dp=6 }}, and the workloads below all use that figure.

## Where the credits go

{{ figure creditBars }}

The bars put the rate card in proportion. A million requests cost about {{ credits unit.millionRequests }}; an active database hour at {{ number 512 }} MiB costs {{ credits unit.activeDatabaseHour512 }}, including allocated disk and backups. Eight active hours cost more than a hundred thousand requests. A custom hostname uses about {{ credits unit.customHostnameMonth }} a month unless the project shows the “Powered by ohmyho.st” flag. It needs Paid or that flag on Free, and an active Prod deployment. The examples price a hostname without a flag. Mail has no fixed line: a thousand sent recipients cost {{ credits unit.thousandMailRecipients }}. The last bar is the small app, itemized below.

## Four worked workloads

Each table prices one month of measured usage at the published rates. The quantities are assumptions you can change; the arithmetic is not.

### A quiet side project

{{ table workload.quietProject }}

This is a project you deploy twice a month and open a few times a week. The database line is one active hour at {{ number 256 }} MiB RAM with its total disk and backups included. If no query wakes it, only the retained script in this example continues to use credits. Customer-uploaded files, if added, would have their own storage and operation charges.

### A small app

{{ table workload.smallApp }}

This is the homepage example: a real app with users, mail and regular deploys. The 2,000 mail recipients are the largest line, ahead of the database's eight active hours, and together they are most of the total. The 100,000 requests are a small fraction of either.

### A client site with its own domain and sender mail

{{ table workload.clientSite }}

Less traffic, half the database time and half the mail of the small app. The custom hostname is a retained charge whether or not the site is busy, waived while the project shows the “Powered by ohmyho.st” flag; mail costs only what the site sends. The table prices a hostname without that flag.

### One busy production app

{{ table workload.busyApp }}

Two hundred active database hours at four GiB RAM, including eight GiB total disk, dominate; mail and traffic follow. This is the workload where the {{ number plan.paidCredits }} monthly credits are a small fraction of the total and the rest is bought as top-ups, which is the honest way to say ohmyho.st is not the cheapest place for it.

## The three subscriptions, bought separately

The classic side-project stack is three accounts:

- Vercel Pro: {{ usd vendor.vercel.pro }} a month for one developer seat.
- Supabase Pro: from {{ usd vendor.supabase.pro }} a month, which covers the first project's Micro instance. Each additional project's Micro instance is {{ usd vendor.supabase.microProject }} a month.
- Resend Pro: {{ usd vendor.resend.pro }} a month.

For one developer and one project that is {{ usd scenario.threeSubscriptions }} a month before usage above the plans and before tax. Vercel Pro and Resend Pro are per account, so five projects do not multiply them; Supabase is per project, so the same stack for five projects is {{ usd scenario.fiveProjects }} a month.

On ohmyho.st the same five projects share one {{ usd plan.paidUsd }} balance. Five quiet projects together use about {{ credits workload.fiveQuietProjects }}, inside the {{ number plan.paidCredits }} monthly credits with room left; the small app alone uses about {{ credits workload.smallApp }}. Two caveats. The free tiers on all three services narrow the gap for a single personal project, and the three plans buy capacity and features the credit tables do not replicate, so read the workload tables against your own numbers rather than the headline.

{{ checked vercel }}

{{ checked supabase }}

{{ checked resend }}

## What has no usage cost, and what keeps costing while idle

Three things a pricing-showdown reader expects to pay for cost nothing here:

- SQL exports. The Owner can request an asynchronous, password-encrypted ZIP with a portable SQL dump, at most one accepted request per project per rolling 24 hours, even at zero credits. The signed download link is valid for 24 hours. There is no schedule and no bucket destination; you ask, you download.
- Workers bandwidth. The provider cost is zero, so the formula yields zero. Egress from your app is not a line on any table above.
- The platform login, the portal at app.ohmyho.st, reading usage and holding projects. Signing in through WorkOS is the platform's own login and is separate from your application's users, whose Better Auth or WorkOS AuthKit setup stays yours.

Three things keep using credits while nobody visits:

- Customer-uploaded files use their R2 storage and operation rates. Database disk and seven-day backups stay included while the database sleeps; there is no separate database-storage charge.
- Each deployed script, about {{ credits unit.deployedScriptMonth }} a month. Every deployment stages one immutable script that stays for rollback until it is cleaned up or the project is deleted.
- A linked custom hostname, about {{ credits unit.customHostnameMonth }} a month, nothing while the project shows the “Powered by ohmyho.st” flag. It needs Paid or that flag on Free.

Periodic SQL health checks keep idle compute awake. The agent reads database state through database_compute_get, which does not wake the database.

## When ohmyho.st is dearer

Three cases, with the numbers.

The busy app. One busy production app uses about {{ credits workload.busyApp }} a month, {{ usdValue workload.busyApp }} of credit value, most of it in active database RAM and mail. At that scale Vercel Pro at {{ usd vendor.vercel.pro }} a month with its usage allowance and Supabase Pro from {{ usd vendor.supabase.pro }} a month with a fixed compute instance can come out cheaper, and a usage meter stops being an advantage. Compare a concrete quote before moving a busy app.

Resend at high volume. Resend Pro is {{ usd vendor.resend.pro }} a month for 50,000 emails. The same 50,000 recipients on ohmyho.st cost about {{ credits workload.fiftyThousandRecipients }}, {{ usdValue workload.fiftyThousandRecipients }} of credit value, and Resend Scale is {{ usd vendor.resend.scale }} a month for 100,000. Up to about 10,000 recipients a month the per-recipient meter is cheaper than Resend Pro because there is no plan to buy; above that, Resend is.

Railway for containers. Railway runs any container and bills CPU and memory by the second above a {{ usd vendor.railway.pro }} a month minimum on Pro. ohmyho.st runs no containers. It deploys Astro, Next.js, Vite/React and TanStack Start from a GitHub repository the customer authorizes, and nothing else. A long-running process, a websocket server you manage yourself or a binary dependency belongs on Railway, whatever the credits say.

{{ checked vercel }}

{{ checked supabase }}

{{ checked resend }}

{{ checked railway }}

## How to read your own usage

Ask the agent; whether you deploy from Claude Code or another MCP client, it has the tools. organization_usage_get returns the billed usage of the last 14 days by day, project and published meter, and each project's use this month, in microcredits (one credit is a million); older days are not kept. organization_credits_get returns the shared balance, any grace-period dates and the published rate cards. organization_account_get shows the effective plan, the monthly credits that expire at period end and the one-time credits (top-up, recharge, signup-bonus, referral) that never expire. project_budget_get reads a project's monthly ceiling and project_budget_set changes it, in continue or stop mode; the portal's Usage page edits the same setting.

Two things to know when reading a report. Posted usage lags measurement: Worker requests and CPU are posted once an hour, a few minutes after the hour ends, database hours about two hours after the hour ends, and storage, R2 requests, scripts and hostnames once a day, after the UTC day ends, so a fresh deploy that shows nothing has not cost nothing. And a project budget is a limit on that project, not a wallet; the credits still come from the organization's one balance.

Read more in [Usage](https://docs.ohmyho.st/usage), [Budgets](https://docs.ohmyho.st/budgets), [Billing](https://docs.ohmyho.st/billing) and the [usage and budgets Skill](/skills/ohmyhost-usage-and-budgets/SKILL.md).

## FAQ

### Is ohmyho.st cheaper than Vercel?

For several small projects, yes: {{ usd plan.paidUsd }} a month buys {{ number plan.paidCredits }} credits shared by every project, and five quiet projects use about {{ credits workload.fiveQuietProjects }}. Vercel Pro alone is {{ usd vendor.vercel.pro }} a month. For one busy production app with heavy database use the usage total can exceed the subscriptions, so price your own workload first.

### Do unused credits roll over?

Monthly credits do not roll over: the {{ number plan.freeCredits }} Free credits expire at UTC month end and the {{ number plan.paidCredits }} Paid credits and any flag bonus at billing-period end. Top-up, recharge, signup-bonus and referral credits never expire, also after a downgrade to Free. Monthly credits are spent before them, so a top-up is the way to bank credits for a busy month later.

### What does a project cost when nobody visits it?

Only separately metered resources: customer files, retained deployed scripts at about {{ credits unit.deployedScriptMonth }} a month each, and a custom hostname if you linked one, with domain credits waived while the “Powered by ohmyho.st” flag shows. Database RAM stops charging after five idle minutes; allocated disk and seven-day backups remain included.

### Can I cap what one project spends?

Yes. A project budget is a monthly ceiling in credits with two modes: continue keeps the project running past the line and warns, stop rejects new work past it. The agent sets it with project_budget_set and reads it back with project_budget_get. It is a limit, not a separate balance; every project still draws from the organization's one wallet.

### Why is the build price a fraction?

Because the sandbox is billed per second and the rate is kept exact. The published row is {{ rate build.sandbox.standard-3 }}; in code it is stored as {{ number unit.buildRateUnit dp=4 }} for every {{ number 175 }} seconds so no per-second decimal ever rounds. Twenty build minutes therefore cost {{ credits unit.twentyBuildMinutes dp=6 }}, the figure every table on this page uses.

{{ sources vercel supabase resend railway }}

[Pricing](/pricing) · [Compare Vercel](/vs/vercel) · [Philosophy](/philosophy) · [What Vercel, Supabase and Resend cost for five side projects](/blog/what-vercel-supabase-resend-cost-for-five-side-projects)
