# What Vercel, Supabase and Resend cost for five side projects

By Sebastian Mertens · September 20, 2026

One project on Vercel Pro, Supabase Pro and Resend Pro costs {{ usd scenario.threeSubscriptions }} a month. Five projects cost {{ usd scenario.fiveProjects }}, because Supabase adds {{ usd vendor.supabase.microProject }} a month for each extra project. On ohmyho.st the same five draw from one balance: {{ usd plan.paidUsd }} a month buys {{ number plan.paidCredits }} credits, and four quiet projects plus one small app use about {{ credits workload.fiveSideProjects }}.

{{ figure bills.vercel }}

## One project, bought separately

Start with the honest baseline: one project, one developer, the three Pro plans most tutorials assume. Three accounts, three invoices, three usage pages to check at the end of the month.

- Vercel Pro: {{ usd vendor.vercel.pro }} per month for one developer. It comes with {{ usd vendor.vercel.pro }} of usage credit each month and free viewer seats. A second person who deploys is another {{ usd vendor.vercel.developerSeat }} {{ text vendor.vercel.developerSeat.unit }}. Function invocations above the credit cost {{ usd vendor.vercel.functionInvocations }} per million.
- Supabase Pro: from {{ usd vendor.supabase.pro }} per month. That covers {{ text vendor.supabase.pro.includes }}. Disk above that is {{ usd vendor.supabase.diskGb }} {{ text vendor.supabase.diskGb.unit }}.
- Resend Pro: {{ usd vendor.resend.pro }} per month for {{ text vendor.resend.pro.includes }}. Beyond that, {{ usd vendor.resend.overageThousand }} {{ text vendor.resend.overageThousand.unit }}.

Total: {{ usd scenario.threeSubscriptions }} a month before any usage above the allowances. Be fair to that number. It buys more than hosting, a database and mail. Supabase Pro carries application auth for its monthly active users, which ohmyho.st does not run for you; you bring Better Auth or your own WorkOS AuthKit, and the platform login stays separate from your app's users. Vercel Pro carries a team workflow a solo builder may never touch. If one project is all you run and it fills those allowances, {{ usd scenario.threeSubscriptions }} is a reasonable price for it.

{{ checked vercel }}
{{ checked supabase }}
{{ checked resend }}

## Five projects

The portfolio builder's problem is never one project. It is five: two that people use, one that is half done, two that are finished and just sit there. Price the same three subscriptions for five projects and only one vendor moves.

Vercel Pro stays at {{ usd vendor.vercel.pro }} in this scenario. Its price grows by seat, at {{ usd vendor.vercel.developerSeat }} {{ text vendor.vercel.developerSeat.unit }}, not by project, and a solo builder has one seat. Resend Pro stays at {{ usd vendor.resend.pro }}; its monthly email allowance is one pool shared by every sender you verify.

Supabase is the one that counts projects. Its own math is simple: Pro's compute credit covers one Micro instance, and each additional project runs its own at {{ usd vendor.supabase.microProject }} {{ text vendor.supabase.microProject.unit }}. Five projects on Supabase alone are {{ usd scenario.supabaseFiveProjects }} a month, the same figure as the whole one-project stack above. A project that needs a Small instance instead is {{ usd vendor.supabase.smallProject }} {{ text vendor.supabase.smallProject.unit }}.

The five-project bill, itemized:

- Vercel Pro: {{ usd vendor.vercel.pro }}
- Supabase Pro, first project: {{ usd vendor.supabase.pro }}
- Four more Supabase Micro projects: {{ usd vendor.supabase.microProject }} each
- Resend Pro: {{ usd vendor.resend.pro }}
- Total: {{ usd scenario.fiveProjects }} a month

The free tiers, honestly. Vercel Hobby is {{ usd vendor.vercel.hobby }} and covers {{ text vendor.vercel.hobby.includes }}. Resend Free is {{ usd vendor.resend.free }} for {{ text vendor.resend.free.includes }}. If all five projects fit inside those allowances and their terms, the stack drops to {{ usd scenario.fiveProjectsFreeTiers }} a month, and every dollar of it goes to Supabase. That is the point of this post: for a portfolio, the per-project fee is the bill, not the hosting.

{{ checked vercel }}
{{ checked supabase }}
{{ checked resend }}

## The same five on ohmyho.st

There is no per-project base fee. Every project draws from the organization's one balance. Free gives {{ number plan.freeCredits }} credits per UTC month. Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits per period; monthly credits expire at the end of the period, and a top-up pack never expires ({{ number plan.topUpPerUsd }} credits per dollar, {{ number plan.topUpPerUsdAbove100 }} per dollar above the first hundred dollars). A project may carry a monthly budget, continue or stop, so one experiment cannot drain the other four.

Credits are priced from what the providers underneath charge, plus a margin, and the rate card is public. The rates that decide a side project's month: requests at {{ rate wfp.requests }}, database compute at about {{ credits unit.activeDatabaseHourStandard }} per active hour on the Paid standard profile, storage at {{ rate neon.storage.root }}, mail at {{ rate ses.{region}.recipients (Essentials) }}. Bandwidth from the Workers runtime is not charged. SQL exports are free. The full card is at [docs.ohmyho.st/pricing](https://docs.ohmyho.st/pricing).

### A quiet project

A finished side project keeps paying for three things: the data it stores, the script that serves it, and the minutes its database is awake. Idle database compute suspends on its own. A deployed script is about {{ credits unit.deployedScriptMonth }} a month. Here is a quiet month, line by line:

{{ table workload.quietProject }}

One active database hour, two build minutes, a few thousand requests, a fifth of a gigabyte stored. The project stays on its Dev and Prod hosts under check.omh.st. A customer-owned domain is a Paid capability that uses credits, about {{ credits unit.customHostnameMonth }} a month per linked hostname; a quiet project can skip it.

### The small app

One of the five is real. People log in, it sends mail, and its database is awake for eight hours across the month:

{{ table workload.smallApp }}

The database line dominates, and it is the one you control: fewer active hours, fewer credits. Sending mail needs Paid and a verified sender subdomain; the agent sets DKIM and SPF through mail_domain_set and reads mail_domain_status until the records verify. Every recipient is metered, and To, CC and BCC count separately.

### Five together

Four quiet projects and the small app, added up as one workload:

{{ table workload.fiveSideProjects }}

About {{ credits workload.fiveSideProjects }}, inside the {{ number plan.paidCredits }} credits that {{ usd plan.paidUsd }} buys, with room for a few extra builds. Two lines are missing, because the small-app workload leaves them out: the small app's own deployed script, and the mail sender zone behind its verified subdomain, about {{ credits unit.mailSenderZoneMonth }} a month. Count both and the five projects use about {{ credits workload.fiveSideProjectsWithSender }}: the monthly grant and a fraction of a credit more. Keep one top-up pack in the balance. A zero balance starts a seven-day grace period during which funded services keep running, but a new build the balance cannot cover is rejected until you refill. Automatic recharge is not enabled in the current beta.

Set that against the {{ usd scenario.fiveProjects }} a month from the section above. The difference is not a discount. It is that four of the five projects are quiet, and here quiet costs almost nothing.

### How to price your own five

Paste this into Claude Code, Cursor or Codex from the repository you want to host first:

```text
{{ prompt }}
```

The agent reads the get-started Skill, signs you in through the browser, creates the project with project_create, links the repository with source_link and quotes the build with deployment_plan before deployment_create runs. Every plan states its credits before anything is charged. Once two or three projects are live, ask the agent for a cost report: it calls organization_usage_get and organization_credits_get and tells you which project used what. If one experiment must never spend more than a set amount, project_budget_set gives it a ceiling with continue or stop. The [usage and budgets Skill](/skills/ohmyhost-usage-and-budgets/SKILL.md) describes the whole loop, and [budgets](https://docs.ohmyho.st/budgets) has the exact semantics.

## What changes at scale

Metering cuts both ways. A quiet project costs less than any subscription; a busy one can cost more. Here is one busy production app with its own domain and sender mail:

{{ table workload.busyApp }}

That is about {{ usdValue workload.busyApp }} of credit value, most of it bought as top-up packs, against {{ usd scenario.threeSubscriptions }} for Vercel Pro, Supabase Pro and Resend Pro, if the app fits inside their allowances. Where the money goes, and where the subscriptions win:

- The database. Two hundred active hours on the standard profile cost about {{ credits unit.hundredDatabaseCuHours }}. Supabase Pro runs a Micro instance all month inside its {{ usd vendor.supabase.pro }}, and a Small instance is {{ usd vendor.supabase.smallProject }} {{ text vendor.supabase.smallProject.unit }}. An app whose database never sleeps belongs on a fixed instance. The performance profile on ohmyho.st is about {{ credits unit.activeDatabaseHourPerformance }} per active hour and gives more compute, not a lower bill.
- Mail. Twenty thousand recipients cost about {{ credits unit.twentyThousandMailRecipients }}. Resend Pro's {{ usd vendor.resend.pro }} covers {{ text vendor.resend.pro.includes }}. Use that whole allowance and Resend wins: {{ text workload.fiftyThousandRecipients.name }} costs about {{ credits workload.fiftyThousandRecipients }} here.
- Requests. Neither bill is decided here. The busy app's requests line is small, and Vercel Pro bills {{ usd vendor.vercel.functionInvocations }} per million function invocations above its credit.
- Team and auth. Vercel Pro's viewer seats are free. Supabase Pro authenticates its monthly active users for you. ohmyho.st runs neither: application auth stays with Better Auth or your own WorkOS AuthKit, and every extra collaborator needs nothing from the balance because there are no seats to buy.
- Previews and runtimes. Every ohmyho.st project has a Dev host and a Prod host, not a preview per branch. It deploys Next.js, Vite/React and TanStack Start from a GitHub repository you authorize, and nothing else; no containers.

Rule of thumb: many quiet projects, meter them. One busy project with an always-awake database, buy the instance.

{{ checked vercel }}
{{ checked supabase }}
{{ checked resend }}

## FAQ

### Does ohmyho.st charge a base fee per project?

No. Every project draws from the organization's one balance: {{ number plan.freeCredits }} credits a UTC month on Free, {{ number plan.paidCredits }} credits per period for {{ usd plan.paidUsd }} on Paid. A project pays for what it keeps and uses: stored data, a deployed script, active database time, requests, mail and any linked domain. A monthly budget per project is optional and is a limit, not a second wallet.

### What does a quiet side project cost a month?

About {{ credits workload.quietProject }}, or {{ usdValue workload.quietProject }} of credit value: one active database hour, two build minutes, a few thousand requests, a fifth of a gigabyte stored and one deployed script. Idle database compute suspends by itself. Storage and the deployed script are the parts that keep using credits while nobody visits.

### Why does Supabase cost more with five projects?

Supabase Pro covers the first project's Micro instance through its compute credits. Each additional project runs its own Micro instance at {{ usd vendor.supabase.microProject }} {{ text vendor.supabase.microProject.unit }}, so five projects are {{ usd scenario.supabaseFiveProjects }} a month on Supabase alone. Vercel Pro and Resend Pro add no per-project line in this scenario, which puts the whole five-project stack at {{ usd scenario.fiveProjects }}.

### Can I cap what one project spends?

Yes. A project may carry a monthly budget in credits with mode continue or stop. Continue keeps drawing from the shared balance past the threshold and warns; stop rejects new work that would exceed it. The agent sets it with project_budget_set and reads it back with project_budget_get, and the portal's usage page edits the same setting. Delayed measurements can still settle after a limit is reached.

### Can I take my databases with me?

Yes. The organization Owner can request an export per project: an asynchronous, password-encrypted ZIP with a portable SQL dump, at most one accepted request per project per rolling 24 hours, downloaded through a signed link valid for 24 hours. There is no schedule and no bucket destination. SQL exports are free and work at zero credits. Restore the dump on any Postgres host; the [export Skill](/skills/ohmyhost-export-database/SKILL.md) walks the agent through it.

{{ sources vercel supabase resend }}

[Cost breakdown](/pricing/breakdown) · [Compare Vercel](/vs/vercel) · [Compare Supabase](/vs/supabase)
