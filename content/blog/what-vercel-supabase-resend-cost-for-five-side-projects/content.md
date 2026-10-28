# What Vercel, Supabase and Resend cost for five side projects

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published September 20, 2026 · Updated October 21, 2026

For the plans and instance sizes used here, Vercel Pro, Supabase Pro and Resend Pro total {{ usd scenario.threeSubscriptions }} a month for a project and {{ usd scenario.fiveProjects }} for five. Your bill depends on the services and usage you actually have. Give those details to your Agent before comparing them with a metered setup such as ohmyho.st.

{{ figure bills.vercel }}

The [introduction to ohmyho.st](/blog/introducing-ohmyho-st) explains how your Agent plans a deployment and helps you check it. This guide is about the bill. Start with what you already pay, then compare the same features and usage on each setup. You do not need to move an app to find out whether a move is worth investigating.

## Start with the current bill

This baseline uses a project, a developer and the Pro plans from all of the services. It is a comparison scenario, not a claim that every app needs those plans. Collect the plan names and recent usage for your own accounts. Your Agent can organize the numbers and point out missing information; you should confirm that the list covers everything you pay for.

The [Vercel and Supabase comparison](/blog/supabase-vs-vercel-do-you-need-both) explains why app hosting and backend services occupy separate parts of this stack, and which capabilities you would need to keep when moving.

- Vercel Pro: {{ usd vendor.vercel.pro }} per month for one developer. It comes with {{ usd vendor.vercel.pro }} of usage credit each month and free viewer seats. A second person who deploys is another {{ usd vendor.vercel.developerSeat }} {{ text vendor.vercel.developerSeat.unit }}. Function invocations above the credit cost {{ usd vendor.vercel.functionInvocations }} per million.
- Supabase Pro: from {{ usd vendor.supabase.pro }} per month. That covers {{ text vendor.supabase.pro.includes }}. Disk above that is {{ usd vendor.supabase.diskGb }} {{ text vendor.supabase.diskGb.unit }}.
- Resend Pro: {{ usd vendor.resend.pro }} per month for {{ text vendor.resend.pro.includes }}. Beyond that, {{ usd vendor.resend.overageThousand }} {{ text vendor.resend.overageThousand.unit }}.

Total: {{ usd scenario.threeSubscriptions }} a month before usage above the allowances. Check what those subscriptions do for you before treating the total as money you could save. Supabase Pro also provides application auth for its monthly active users. With ohmyho.st, application auth needs its own setup, such as Better Auth or your own WorkOS AuthKit; platform login is separate from your app’s users. Vercel Pro also supplies a team workflow you might rely on.

Give your Agent the invoices and usage, then ask:

```text
Review the plan names, invoices and usage I provide. Separate subscriptions, seats, per-project compute and overages. Connect each service to the features my apps use, and flag missing costs. Keep unknown usage explicit instead of filling it with estimates.
```

If a project uses the allowances and features it pays for, {{ usd scenario.threeSubscriptions }} may be a reasonable price. The useful question is which costs remain necessary for your portfolio.

{{ checked vercel }}
{{ checked supabase }}
{{ checked resend }}

## Add the extra projects

Now imagine a portfolio with some active apps, some unfinished experiments and some projects you keep online but rarely change. Under this article’s assumptions, adding projects changes the Supabase compute bill. It does not add a Vercel seat or another Resend Pro subscription by itself. Your actual usage can still exceed a shared allowance.

Vercel Pro stays at {{ usd vendor.vercel.pro }} in this scenario. Its price grows by seat, at {{ usd vendor.vercel.developerSeat }} {{ text vendor.vercel.developerSeat.unit }}, not by project, and a solo builder has one seat. Resend Pro stays at {{ usd vendor.resend.pro }}; its monthly email allowance is one pool shared by every sender you verify.

Check the Supabase instances separately: Pro's compute credit covers one Micro instance, and each additional project runs its own at {{ usd vendor.supabase.microProject }} {{ text vendor.supabase.microProject.unit }}. Five projects on Supabase alone are {{ usd scenario.supabaseFiveProjects }} a month, the same figure as the whole one-project stack above. A project that needs a Small instance instead is {{ usd vendor.supabase.smallProject }} {{ text vendor.supabase.smallProject.unit }}.

The five-project bill, itemized:

- Vercel Pro: {{ usd vendor.vercel.pro }}
- Supabase Pro, first project: {{ usd vendor.supabase.pro }}
- Four more Supabase Micro projects: {{ usd vendor.supabase.microProject }} each
- Resend Pro: {{ usd vendor.resend.pro }}
- Total: {{ usd scenario.fiveProjects }} a month

Keep in mind: you may not need all of those paid plans. Vercel Hobby is {{ usd vendor.vercel.hobby }} and covers {{ text vendor.vercel.hobby.includes }}. Resend Free is {{ usd vendor.resend.free }} for {{ text vendor.resend.free.includes }}. If all five projects fit inside those allowances and their terms, the stack drops to {{ usd scenario.fiveProjectsFreeTiers }} a month, and every dollar of it goes to Supabase. In that example, the recurring database instances are the cost to investigate. If your apps need commercial hosting or exceed the mail allowance, put those costs back into the comparison.

{{ checked vercel }}
{{ checked supabase }}
{{ checked resend }}

## Price the same usage here

ohmyho.st has no per-project base fee. Every project uses the organization’s shared balance, so your Agent needs to estimate both active usage and the resources each project keeps. Free gives {{ number plan.freeCredits }} credits per UTC month. Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits per period. Monthly credits expire at period end; Paid-only top-ups carry over until downgrade to Free ({{ number plan.topUpPerUsd }} credits per dollar, {{ number plan.topUpPerUsdAbove100 }} per dollar above the first hundred dollars). You can give a project a monthly budget. Decide whether it should warn and continue or stop new work at the threshold; the continue setting does not cap spending.

The rate card shows what your Agent should use in its estimate. Requests use {{ rate wfp.requests }}, the {{ number 512 }} MiB database costs {{ credits unit.activeDatabaseHour512 }} per active hour including disk and seven-day backups, and mail uses {{ rate mail.sent }}. Database CPU, network and connections have no separate charge. Worker bandwidth and SQL exports are free. Read the [full price card](https://docs.ohmyho.st/pricing).

### A quiet app

An app can be quiet and still cost something. The deployed script remains, and the database charges for RAM only when it is awake. Idle database RAM stops charging on its own, and allocated disk and seven-day backups are included. A deployed script is about {{ credits unit.deployedScriptMonth }} a month. Here is the quiet workload used in this comparison:

{{ table workload.quietProject }}

One active database hour, two build minutes, a few thousand requests and one deployed script. You can use the project’s Dev and Prod hosts under check.omh.st for this setup. A customer-owned domain needs Paid, or on Free a project that shows the “Powered by ohmyho.st” flag, and uses about {{ credits unit.customHostnameMonth }} a month per linked hostname unless the flag shows; a quiet project can skip it.

### An app people use

For the more active app, the example assumes people log in, the app sends mail, and its database is awake for eight hours across the month:

{{ table workload.smallApp }}

Mail and database compute are the larger lines here. Ask your Agent to explain what creates that usage in your app: which actions send mail, and what keeps the database active? Sending managed mail needs Paid and a verified sender domain. Your Agent can prepare the setup and give you the DNS records to add, then check verification. Each recipient of each sent message is metered.

### Add them together

Four quiet projects and the small app, added up as one workload:

{{ table workload.fiveSideProjects }}

The total is about {{ credits workload.fiveSideProjects }}, including the deployed scripts and the small app’s mail. That fits within the {{ number plan.paidCredits }} credits bought by the {{ usd plan.paidUsd }} plan under these explicit RAM and activity assumptions. Allow room for extra usage when comparing monthly outlay; busier databases, larger allocations or more mail can need top-ups. A zero balance starts a {{ value plan.graceDays }}-day grace period during which funded services keep running, but a new build the balance cannot cover is rejected until you refill. Automatic recharge stays off unless the Owner turns it on.

Compare that workload with the {{ usd scenario.fiveProjects }} subscription scenario above. The lower usage estimate depends on most of the projects being quiet. It also assumes you can run the features you need on the proposed setup. Neither assumption should be carried over to your portfolio without checking it.

### Use your own numbers

Give your Agent the app inventory and billing breakdown from earlier. It should inspect the repositories to see whether they fit the proposed runtime, then estimate their usage. If you do not have measurements yet, ask for a range with visible assumptions. A precise-looking total based on guessed activity is still a guess.

Then price the same usage on ohmyho.st:

```text
Estimate this portfolio on ohmyho.st using its current rate card and the usage we collected. Include builds, active database time, retained data, deployed scripts, mail and domains. Keep external services in the total, identify required migrations, and show a monthly breakdown per project for quiet and busier usage with clear assumptions.
```

Compare the breakdown, not only the total. You should be able to point to a line and explain why it gets cheaper or more expensive. If moving auth or functions requires substantial work, include that work in your decision even though it does not appear on the hosting invoice.

After a test deployment, ask your Agent for actual usage by project and compare it with the estimate. The [usage and budgets Skill](/skills/ohmyhost-usage-and-budgets/SKILL.md) covers that process, and the [budget documentation](https://docs.ohmyho.st/budgets) explains what each mode does.

## Price a busier month

An estimate for quiet projects says little about an app that stays busy. Metered usage can grow beyond a subscription that covers the same workload. Use this busier example to see which lines change; it includes a custom domain and sender mail:

{{ table workload.busyApp }}

That is about {{ usdValue workload.busyApp }} of credit value, most of it bought as top-up packs, against {{ usd scenario.threeSubscriptions }} for Vercel Pro, Supabase Pro and Resend Pro, if the app fits inside their allowances. Where the money goes, and where the subscriptions win:

- The database. Two hundred active hours at {{ number 4096 }} MiB RAM with {{ number 8 }} GiB total disk cost {{ credits unit.twoHundredDatabaseHours4096 }}. Supabase Pro includes its first Micro instance within {{ usd vendor.supabase.pro }}. These are different allocations, so compare the app's actual memory, storage and active-time requirements rather than treating the instances as identical.
- Mail. Twenty thousand recipients cost about {{ credits unit.twentyThousandMailRecipients }}. Resend Pro's {{ usd vendor.resend.pro }} covers {{ text vendor.resend.pro.includes }}, which is why you should compare a separate mail plan as volume grows: {{ text workload.fiftyThousandRecipients.name }} costs about {{ credits workload.fiftyThousandRecipients }} here.
- Requests. Neither bill is decided here. The busy app's requests line is small, and Vercel Pro bills {{ usd vendor.vercel.functionInvocations }} per million function invocations above its credit.
- Team and auth. Vercel Pro's viewer seats are free. Supabase Pro authenticates its monthly active users for you. With ohmyho.st, application auth stays with Better Auth or your own WorkOS AuthKit. There are no collaborator seats to buy, but check which review and access features your team needs.
- Previews and runtimes. Every ohmyho.st project has a Dev host and a Prod host, not a preview per branch. It supports Astro, Next.js, Vite/React and TanStack Start from managed source or an authorized GitHub repository, with no container runtime. Ask your Agent to check the actual repository before estimating a migration.

Keep in mind: you can keep a service that suits the workload. Moving app hosting does not require moving every email or database service too. Ask your Agent to compare the combination you would actually run, including any subscriptions that remain.

{{ checked vercel }}
{{ checked supabase }}
{{ checked resend }}

## Decide what may spend

Once the estimate looks useful, choose a project for a test. You decide how much usage is acceptable and what should happen at a limit. Your Agent can configure and read back the budget, but it needs that preference from you. A warning is useful for a live app that must keep running; a stop setting may fit an experiment you are happy to pause.

Before a real deployment, ask about budgets:

```text
Explain the current balance and project-budget options for this test app. Ask me to choose the amount and whether to warn or stop, then apply and read back that choice. Keep automatic recharge off unless I explicitly choose it, and show which retained or delayed charges can remain.
```

After you have real usage, compare the report with the estimate. Investigate a surprising line before adding more projects. Your Agent should be able to connect the cost to database activity, retained resources, mail or another recorded service. That makes the next decision concrete: change the app, change the service, add credit or keep the current setup.

## FAQ

### Does ohmyho.st charge a base fee per project?

No. Every project draws from the organization's one balance: {{ number plan.freeCredits }} credits a UTC month on Free, {{ number plan.paidCredits }} credits per period for {{ usd plan.paidUsd }} on Paid. A project pays for what it keeps and uses: customer files, a deployed script, active database time, requests, mail and any linked domain. A monthly budget per project is optional and is a limit, not a second wallet.

### What does a quiet side project cost a month?

About {{ credits workload.quietProject }}, or {{ usdValue workload.quietProject }} of credit value: one active database hour, two build minutes, a few thousand requests and one deployed script. Idle database RAM stops charging by itself, with disk and seven-day backups included. The deployed script and any customer files are the parts that keep using credits while nobody visits.

### Why does Supabase cost more with five projects?

Supabase Pro covers the first project's Micro instance through its compute credits. Each additional project runs its own Micro instance at {{ usd vendor.supabase.microProject }} {{ text vendor.supabase.microProject.unit }}, so five projects are {{ usd scenario.supabaseFiveProjects }} a month on Supabase alone. Vercel Pro and Resend Pro add no per-project line in this scenario, which puts the whole five-project stack at {{ usd scenario.fiveProjects }}.

### Can I cap what one project spends?

Yes. A project may carry a monthly budget in credits with mode continue or stop. Continue keeps drawing from the shared balance past the threshold and warns; stop rejects new work that would exceed it. Ask your Agent to apply your choice and read it back, or use the same setting on the portal’s usage page. Delayed measurements can still settle after a limit is reached.

### Can I take my databases with me?

Yes. The organization Owner can request an export per project: an asynchronous, password-encrypted ZIP with a portable SQL dump, at most one accepted request per project per rolling 24 hours, downloaded through a signed link valid for 24 hours. There is no schedule and no bucket destination. SQL exports are free and work at zero credits. Restore the dump on any Postgres host; the [export Skill](/skills/ohmyhost-export-database/SKILL.md) walks your Agent through it.

{{ sources vercel supabase resend }}

[Cost breakdown](/pricing/breakdown) · [Compare Vercel](/vs/vercel) · [Compare Supabase](/vs/supabase)
