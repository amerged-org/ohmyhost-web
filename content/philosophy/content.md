# Hosting not per project: why one balance

ohmyho.st prices hosting per organization, not per project. One balance funds every project: Free gives {{ number plan.freeCredits }} credits a month, Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits, and each project draws what it uses. No per-project base fee, no deploy dashboard, and an export that works without asking. Rates are the provider's cost plus a small margin.

Short version: I got tired of paying five bills for two live projects and seven parked ones. ohmyho.st buys hosting, Postgres, domains and transactional mail from the providers underneath, adds a small margin, and meters what your projects actually use from one prepaid balance. This page is the reasoning, so you can decide whether it fits you before you connect an agent.

## Buy in bulk, sell at cost plus a little

Every credit you spend is priced by one formula: the provider's list cost times 1.15, divided by 0.0035. That is the whole business model. It is published as a rate card in the [pricing reference](https://docs.ohmyho.st/pricing), and your agent can read the active cards through organization_credits_get. One credit is {{ usd plan.usdPerCredit }} of nominal value. {{ usd plan.paidUsd }} a month buys {{ number plan.paidCredits }} credits that expire at period end. A top-up buys {{ number plan.topUpPerUsd }} credits per dollar and never expires; the part of a checkout above the first hundred dollars earns {{ number plan.topUpPerUsdAbove100 }} per dollar. Consumption rates never change with how much you buy.

The card reads like a receipt: {{ rate wfp.requests }}, {{ rate neon.storage.root }}, {{ rate wfp.script }}. One unfamiliar unit is the CU-hour, a database's compute size multiplied by the time it is awake. One active hour on the Paid standard profile ({{ value profile.standard.cu }} CU) is about {{ credits unit.activeDatabaseHourStandard }}; the same hour on the Free profile ({{ value profile.free.cu }} CU) is about {{ credits unit.activeDatabaseHourFree }}.

What the formula rules out matters as much as what it charges. There is no minimum charge on any meter. Bandwidth from Workers costs the provider nothing, so it costs you nothing. SQL exports are free. A failed or unperformed provider action is never charged. And the trade-off, stated plainly: provider free tiers stay with the platform, and you pay the list-cost rate from the first unit. That allowance, plus fifteen percent, is the margin, and it is written down.

Why a formula and not tiers: a plan has to guess your usage, and the guess is priced so that most customers overpay. A formula does not guess. It also stops me from hiding a price rise. When a provider changes its list cost, a new dated card is published before it takes effect, and the old card stays published because a published card is immutable.

## No per-project fee

Hosting is usually priced per project, per seat or per service. That punishes the person with nine side projects and two live ones. Supabase Pro starts at {{ usd vendor.supabase.pro }} a month, and each additional project's Micro instance is {{ usd vendor.supabase.microProject }} a month. Vercel Pro is {{ usd vendor.vercel.pro }} a month, and each developer seat is {{ usd vendor.vercel.developerSeat }}. Put five side projects on Vercel Pro, Supabase Pro and Resend Pro and the list price is {{ usd scenario.fiveProjects }} a month before you serve one request.

Here every project draws from the organization's one balance. There is no fixed project-count limit and no base fee per project. Every project gets a Dev and a Prod address on check.omh.st; a customer-owned hostname is Paid and uses credits at {{ rate domain.custom_hostname }}. What a parked project keeps paying is exactly what it keeps: stored data and its deployed script. Idle database compute suspends and stops costing. This is a quiet side project for one month:

{{ table workload.quietProject }}

A project can carry a monthly budget if you want a ceiling: continue, which warns and keeps going, or stop. A budget is a limit, not a second wallet. A zero balance starts a {{ number plan.graceDays }}-day grace period instead of a surprise invoice; funded services keep running, and afterwards only unfunded services suspend. Automatic recharge exists in the contract but is not enabled yet, so your balance never refills without you. The [budgets guide](https://docs.ohmyho.st/budgets) has the exact rules.

{{ checked vercel }} {{ checked supabase }} {{ checked resend }}

## No dashboard runs your deploys

There is no deploy dashboard. Your coding agent deploys through MCP: {{ tools }} tools, listed in the [tool catalog](https://docs.ohmyho.st/mcp-tools). It authorizes the GitHub repository with source_link, plans with deployment_plan, and you confirm before deployment_create runs. Every expensive or destructive action is that same pair: promotion_plan then promotion_execute, rollback_plan then rollback_execute, delete_plan then delete_execute. A plan quotes its build before it starts, so what you confirm is a price and a list of effects, not a spinner.

Secrets never travel through the chat. secret_set_command returns a stdin-only CLI command; the value goes from your terminal to the environment and nowhere else. See [secrets](https://docs.ohmyho.st/secrets).

The portal at app.ohmyho.st shows projects, credits, budgets and API tokens. It is a place to look, not a place to deploy: see what a project spent, set a budget, create a token. I wanted the thing that runs your deploy to be the same thing that wrote the code, because that is where the context is. Every tool call is a discrete, readable step, and a stalled operation is diagnosed with operation_get and deployment_logs rather than by refreshing a page.

For a portfolio this is the whole point. Ten projects in a dashboard world means ten deploy flows to remember. Here it means one prompt per project and one balance to watch.

## Unhappy? Take your database and go

Ask your agent for an export (project_export_create, then project_export_get) and you get a password-encrypted ZIP with a portable SQL dump. The password is yours: it is read from a private file on your machine and never enters the tool arguments. One accepted request per project per rolling 24 hours, a signed download link valid for 24 hours, and the archive is kept for seven days. SQL exports are free, and the Owner can request one at zero credits. There is no schedule and no bucket destination; it is on demand and asynchronous, and the plaintext SQL limit is 256 MiB. The steps are in the [export Skill](/skills/ohmyhost-export-database/SKILL.md) and the [backups guide](https://docs.ohmyho.st/backups).

Restore the dump on any Postgres host. Nothing in it is ours: the schema is your migrations, applied from your GitHub repository, and the runtime binding is plain PostgreSQL. For a look without an export, database_access_create issues a time-bound, revocable Postgres login you can use with psql.

Your users stay yours too. Application auth is customer-owned: Better Auth and your own WorkOS AuthKit are the verified integrations, and the platform login is a separate thing. Move the dump, point your app at the new host, and the user table moves with it because it was never in a proprietary store. When you are done, delete_plan then delete_execute removes the project and its archives.

## Honest about where others win

A single busy production app with serious traffic may still belong on Vercel and Supabase. Priced here, one busy production app for one month is about {{ credits workload.busyApp }}, about {{ usdValue workload.busyApp }} of credit value. Vercel Pro at {{ usd vendor.vercel.pro }}, Supabase Pro from {{ usd vendor.supabase.pro }} and Resend Pro at {{ usd vendor.resend.pro }} list at {{ usd scenario.threeSubscriptions }} together. If that usage fits inside their plans, they are cheaper. Metering wins when you have many small things; a plan wins when you have one big thing that fills it.

Vercel Hobby is {{ usd vendor.vercel.hobby }} a month for one developer seat. If that is all your projects need, it beats any paid balance, and I will not pretend otherwise.

Railway, Fly.io and Render run any container. ohmyho.st runs Next.js, Vite/React and TanStack Start on Workers, deployed from a GitHub repository, and nothing else. Resend Pro is {{ usd vendor.resend.pro }} for 50,000 emails a month; here mail is {{ rate ses.{region}.recipients (Essentials) }}, counted per recipient, and it needs Paid plus a verified sender subdomain. Send most of that plan every month and Resend is the better price. Supabase gives you Auth, Storage, Realtime and Edge Functions in one console; here you bring Better Auth or WorkOS AuthKit and write plain SQL.

Every comparison page says where the other side wins, with list prices checked on a named date. {{ checked vercel }} {{ checked supabase }} {{ checked resend }}

## Dated prices as a principle

Every comparison page on this site carries the date its list prices were checked and links the page they came from. The line looks like this: {{ checked vercel }}

The sources are screenshots in the repository, one per vendor, taken at a fixed viewport on that date. The filename records the host, the page and the size, for example {{ text vendor.vercel.evidence }}. A number the screenshot does not show is not recorded, even when the live page states it. That is why some pages carry fewer competitor numbers than you might expect: I would rather leave a figure out than quote one I cannot show.

Prices move. When a vendor changes a plan, the date on our page goes stale before the number does, and the stale date is the signal. Nothing here is generated from a vendor's live page at build time. Every competitor number is typed once into one source file, and a page cannot quote a number that is not there; the build fails on a price typed by hand. The same rule applies to our own rates: a rate card is published with a date, is immutable once published, and every credit price on this site is computed from the card rather than repeated from memory.

— Sebastian Mertens, founder

## FAQ

### Is there a per-project fee on ohmyho.st?

No. Every project draws from the organization's one balance, and there is no fixed project-count limit. A project costs what it keeps and uses: stored data, a deployed script, requests, database active time and, on Paid, a linked hostname or a mail sender zone. A parked project with suspended compute keeps costing only its storage and its script.

### What does a parked side project cost per month?

About {{ credits workload.quietProject }} for the quiet project itemized above, most of it one active database hour and stored data. With no requests at all, the only lines left are storage at {{ rate neon.storage.root }} and the script at {{ rate wfp.script }}. Bandwidth from Workers is not charged.

### Can I leave with my data?

Yes. The Owner requests an on-demand export and receives a password-encrypted ZIP with a portable SQL dump: one accepted request per project per rolling 24 hours, downloaded through a signed link valid for 24 hours. Exports are free and available at zero credits. Restore the dump on any Postgres host; your auth provider stays yours.

### Why is there no deploy dashboard?

Because the agent that wrote the code has the context a dashboard lacks. It deploys through {{ tools }} MCP tools, and every expensive or destructive action is a plan you confirm followed by an execute call. The portal at app.ohmyho.st shows projects, credits, budgets and API tokens, so you can watch spending without running anything.

### Does choosing the EU region cost more?

No. Region is a per-project choice made once at project creation, and US is the default. EU places the project's database, files and builds in the EU. Prices are identical in both regions. Transactional mail is sent from the platform's mail region regardless of the project's choice, so mail placement is not part of that decision.

### How do I know a comparison price is still right?

Read the date on the line under each comparison. Prices were checked on {{ text vendor.vercel.checkedOn }} from each vendor's own pricing page, and the screenshot is kept in the repository. If the date looks old, open the linked page and compare. If the vendor moved, the page is due for a re-check, and the stale date tells you so.

{{ sources vercel supabase resend }}

[Cost breakdown](/pricing/breakdown) · [Compare Vercel](/vs/vercel) · [About](/about) · [What Vercel, Supabase and Resend cost for five side projects](/blog/what-vercel-supabase-resend-cost-for-five-side-projects)
