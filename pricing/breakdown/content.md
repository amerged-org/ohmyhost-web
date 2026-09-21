# Cheaper than Vercel? The ohmyho.st cost breakdown

Yes for several small projects, no for one busy app. {{ usd plan.paidUsd }} a month buys {{ number plan.paidCredits }} credits shared by every project; a small app uses about {{ credits workload.smallApp }} of them, a quiet side project about {{ credits workload.quietProject }}. Vercel Pro, Supabase Pro and Resend Pro bought separately cost {{ usd scenario.threeSubscriptions }} a month before any usage.

## What a credit is

One credit has a nominal value of {{ usd plan.usdPerCredit }}, so {{ number plan.topUpPerUsd }} credits represent {{ usd 1 }} of credit value. Every rate on this page comes from one formula: the provider's list cost in dollars times 1.15, divided by 0.0035. That is the whole margin. Each rate rounds up to the next microcredit (one credit is a million microcredits), no meter has a minimum charge, and a balance never goes negative. Provider free tiers are not passed through: you pay the list-cost rate from the first unit, which is also why nothing on this page depends on a quota you might exceed.

Credits arrive three ways:

- Free grants {{ number plan.freeCredits }} credits per UTC month. They expire at the end of that month.
- Paid costs {{ usd plan.paidUsd }} a month before tax and grants {{ number plan.paidCredits }} credits per paid period. They expire at the end of the period, with no rollover. Paid also unlocks a customer-owned domain and verified sender mail; both still use credits.
- Top-ups never expire. A purchase grants {{ number plan.topUpPerUsd }} credits per dollar up to {{ usd 100 }} and {{ number plan.topUpPerUsdAbove100 }} credits per dollar for the part above that. Monthly credits are spent before top-up credits, so the ones that expire go first.

Every project draws from the organization's one balance. There is no per-project base fee and no project-count limit. A project may carry a monthly budget in continue mode (warn, keep going) or stop mode (reject new work past the line); a budget is a ceiling, not a second wallet. A zero balance starts a {{ number plan.graceDays }}-day grace period during which funded services keep running; after it, only unfunded services suspend, and data, export and buying credit stay available. Automatic recharge is not enabled yet.

## Every published rate

{{ table rates }}

How to read it: the Credits column is what you pay for the measured quantity, and a charge is that rate times the measured amount, rounded up. Requests and CPU are two separate meters, so a request that burns CPU costs more than one that returns quickly. Functions and crons have no meter of their own; each run is one request plus its CPU-ms. The two compute rows are database profiles. Free runs at {{ number profile.free.cu }} CU and Paid standard at {{ number profile.standard.cu }} CU, so one active hour on Paid standard is half a CU-hour, about {{ credits unit.activeDatabaseHourStandard }}. The performance profile is {{ number profile.performance.cu }} CU on its own row, about {{ credits unit.activeDatabaseHourPerformance }} per active hour, which is 2.5 times Paid standard for the same active minute. The r2 rows meter uploaded files: storage by daily peak, then writes and reads by operation. Sender mail is charged at the Essentials row, per recipient; To, CC and BCC each count. The a-la-carte row is a published card, not the row a verified sender uses.

The build row deserves a closer look. It reads {{ rate build.sandbox.standard-3 }}, but the code does not store a per-second decimal. It stores the exact sandbox rational, {{ number unit.buildRateUnit dp=4 }} for every {{ number 175 }} build seconds, and prices each build from its measured seconds, rounded up to the full second. Sandbox start-up time is not billed. A deployment plan holds the build price before the build starts and releases what the build did not use. So 20 build minutes cost {{ credits unit.twentyBuildMinutes dp=6 }}, and the workloads below all use that figure.

## Where the credits go

{{ figure creditBars }}

The bars put the rate card in proportion. A million requests cost about {{ credits unit.millionRequests }}; one active database hour on Paid standard about {{ credits unit.activeDatabaseHourStandard }}; one stored gigabyte for a month {{ rate neon.storage.root }}. For a side project the database, not the traffic, is where the credits go: eight active hours cost more than a hundred thousand requests. The two Paid-only fixed lines, a custom hostname at about {{ credits unit.customHostnameMonth }} a month and a mail sender zone at about {{ credits unit.mailSenderZoneMonth }} a month, are what turn a quiet project into a client site. The last bar is the small app, itemized in the next section.

## Four worked workloads

Each table prices one month of measured usage at the published rates. The quantities are assumptions you can change; the arithmetic is not.

### A quiet side project

{{ table workload.quietProject }}

This is a project you deploy twice a month and open a few times a week. Most of it is the one active database hour and the fifth of a gigabyte it keeps; the stored data and the deployed script are the only lines that would remain if nobody ever opened it.

### A small app

{{ table workload.smallApp }}

This is the homepage example: a real app with users, mail and regular deploys. The database's eight active hours are more than half the total, and the 2,000 mail recipients cost more than the 100,000 requests.

### A client site with its own domain and sender mail

{{ table workload.clientSite }}

Less traffic and half the database time of the small app, yet nearly the same total. The custom hostname and the mail sender zone are Paid fixed lines that run whether or not the site is busy, and the zone alone costs more than the site's database compute.

### One busy production app

{{ table workload.busyApp }}

Two hundred active database hours and ten stored gigabytes dominate; traffic and mail come next. This is the workload where the {{ number plan.paidCredits }} monthly credits are a small fraction of the total and the rest is bought as top-ups, which is the honest way to say ohmyho.st is not the cheapest place for it.

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

Four things keep using credits while nobody visits:

- Stored data, at {{ rate neon.storage.root }}. Idle database compute suspends after 60 seconds on the standard profiles (five minutes on performance), so compute stops but storage does not, and the first query after a suspension is a cold start.
- Each deployed script, about {{ credits unit.deployedScriptMonth }} a month. Every deployment stages one immutable script that stays for rollback until it is cleaned up or the project is deleted.
- A linked custom hostname, about {{ credits unit.customHostnameMonth }} a month, Paid.
- A mail sender zone, about {{ credits unit.mailSenderZoneMonth }} a month, Paid. It is free if removed within twelve hours; otherwise it costs a full month, then a month on each first of the month while it exists.

Periodic SQL health checks keep idle compute awake. The agent reads database state through database_compute_get, which does not wake the database.

## When ohmyho.st is dearer

Three cases, with the numbers.

The busy app. One busy production app uses about {{ credits workload.busyApp }} a month, {{ usdValue workload.busyApp }} of credit value, most of it in database compute and storage. At that scale Vercel Pro at {{ usd vendor.vercel.pro }} a month with its usage allowance and Supabase Pro from {{ usd vendor.supabase.pro }} a month with a fixed compute instance can come out cheaper, and a usage meter stops being an advantage. Compare a concrete quote before moving a busy app.

Resend at high volume. Resend Pro is {{ usd vendor.resend.pro }} a month for 50,000 emails. The same 50,000 recipients on ohmyho.st cost about {{ credits workload.fiftyThousandRecipients }}, {{ usdValue workload.fiftyThousandRecipients }} of credit value, and Resend Scale is {{ usd vendor.resend.scale }} a month for 100,000. Below a few thousand recipients the per-recipient meter is cheaper because there is no plan to buy; in the tens of thousands, Resend is.

Railway for containers. Railway runs any container and bills CPU and memory by the second above a {{ usd vendor.railway.pro }} a month minimum on Pro. ohmyho.st runs no containers. It deploys Next.js, Vite/React and TanStack Start from a GitHub repository the customer authorizes, and nothing else. A long-running process, a websocket server you manage yourself or a binary dependency belongs on Railway, whatever the credits say.

{{ checked vercel }}

{{ checked supabase }}

{{ checked resend }}

{{ checked railway }}

## How to read your own usage

Ask the agent; whether you deploy from Claude Code or another MCP client, it has the tools. organization_usage_get returns posted UTC-month usage by project, environment and published meter, in microcredits (one credit is a million). organization_credits_get returns the shared balance, any grace-period dates and the published rate cards. organization_account_get shows the effective plan and which credits expire. project_budget_get reads a project's monthly ceiling and project_budget_set changes it, in continue or stop mode; the portal's Usage page edits the same setting.

Two things to know when reading a report. Posted usage lags measurement: Worker requests and CPU arrive in two to three minutes, database hours about an hour later, scripts and hostnames up to a day, so a fresh deploy that shows nothing has not cost nothing. And a project budget is a limit on that project, not a wallet; the credits still come from the organization's one balance.

Read more in [Usage](https://docs.ohmyho.st/usage), [Budgets](https://docs.ohmyho.st/budgets), [Billing](https://docs.ohmyho.st/billing) and the [usage and budgets Skill](/skills/ohmyhost-usage-and-budgets/SKILL.md).

## FAQ

### Is ohmyho.st cheaper than Vercel?

For several small projects, yes: {{ usd plan.paidUsd }} a month buys {{ number plan.paidCredits }} credits shared by every project, and five quiet projects use about {{ credits workload.fiveQuietProjects }}. Vercel Pro alone is {{ usd vendor.vercel.pro }} a month. For one busy production app with heavy database use the usage total can exceed the subscriptions, so price your own workload first.

### Do unused credits roll over?

Monthly credits do not: the {{ number plan.freeCredits }} Free credits expire at the end of the UTC month and the {{ number plan.paidCredits }} Paid credits at the end of the paid period. Top-up credits never expire and are spent after the monthly ones, so a top-up is the way to bank credits for a busy month later.

### What does a project cost when nobody visits it?

Only what it keeps. Stored data at {{ rate neon.storage.root }}, one deployed script at about {{ credits unit.deployedScriptMonth }} a month, and on Paid a custom hostname or mail sender zone if you linked one. Database compute suspends after a minute of idle time and costs nothing until the next query wakes it.

### Can I cap what one project spends?

Yes. A project budget is a monthly ceiling in credits with two modes: continue keeps the project running past the line and warns, stop rejects new work past it. The agent sets it with project_budget_set and reads it back with project_budget_get. It is a limit, not a separate balance; every project still draws from the organization's one wallet.

### Why is the build price a fraction?

Because the sandbox is billed per second and the rate is kept exact. The published row is {{ rate build.sandbox.standard-3 }}; in code it is stored as {{ number unit.buildRateUnit dp=4 }} for every {{ number 175 }} seconds so no per-second decimal ever rounds. Twenty build minutes therefore cost {{ credits unit.twentyBuildMinutes dp=6 }}, the figure every table on this page uses.

{{ sources vercel supabase resend railway }}

[Pricing](/pricing) · [Compare Vercel](/vs/vercel) · [Philosophy](/philosophy) · [What Vercel, Supabase and Resend cost for five side projects](/blog/what-vercel-supabase-resend-cost-for-five-side-projects)
