# Who runs ohmyho.st

ohmyho.st is run by Amerged B.V., a Dutch company registered at the KVK under number 42154221 in Venray, Limburg, and founded by Sebastian Mertens. It hosts vibe-coded apps that your coding agent deploys from GitHub. Free gives {{ number plan.freeCredits }} credits a month; Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits shared by every project.

## Who

<img src="/brand/assets/founder.png" width="96" height="96" loading="lazy" alt="Founder of ohmyho.st" style="border-radius:50%">

Sebastian Mertens founded ohmyho.st and runs it. The legal operator is Amerged B.V., registered with the Dutch Chamber of Commerce (KVK) under number 42154221, in Venray, Limburg, the Netherlands. The same company name is on the [terms](/terms), the [privacy notice](/privacy), the [data processing agreement](/dpa) and every Stripe invoice. Signup opened to everyone on September 16, 2026, and the [changelog](/changelog) dates every change since.

Will it exist in a year? Nobody can promise that about a young service, so this page does not. What can be said: the company is registered and invoices with tax through Stripe; every credit you spend is priced above the provider's list cost, so usage is not sold below cost; and if it stops, your app leaves with you. Your source stays in your GitHub repository, your users stay on your own auth provider, and your database leaves as a portable SQL dump on request.

## Why it exists

The founder ran several small apps and paid for each one three times: hosting, a database and a mail sender, each on its own subscription with its own dashboard. One developer on Vercel Pro, Supabase Pro and Resend Pro pays {{ usd scenario.threeSubscriptions }} a month for one project before any usage, and Supabase adds {{ usd vendor.supabase.microProject }} a month for each additional project's Micro instance. Most of those projects were idle most of the month.

ohmyho.st is the answer to that bill. It buys hosting, Postgres, domains and transactional mail from the providers underneath, adds a small margin and meters what each project actually uses from one prepaid balance. Free gives {{ number plan.freeCredits }} credits per UTC month. Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits per period. Monthly credits expire at the end of the period; purchased top-ups never expire, at {{ number plan.topUpPerUsd }} credits per dollar. Every project draws from the organization's one balance, and there is no per-project base fee. A quiet project pays for what it keeps: retained database storage at {{ rate neon.storage.root }} and a deployed script at about {{ credits unit.deployedScriptMonth }} a month. A zero balance starts a {{ number plan.graceDays }}-day grace period; funded services keep running, and only unfunded services suspend afterwards. The reasoning is on the [philosophy page](/philosophy).

- {{ checked vercel }}
- {{ checked supabase }}
- {{ checked resend }}

## What it is and is not

ohmyho.st is hosting for vibe-coded apps, operated by your coding agent. You keep working in Claude Code, Cursor or Codex. The agent installs the ohmyho.st CLI and MCP server, you sign in once in the browser, and from then on it plans, deploys, checks usage and exports through {{ tools }} MCP tools. Expensive or destructive actions come in pairs, so you see the plan before anything happens: deployment_plan then deployment_create, promotion_plan then promotion_execute, rollback_plan then rollback_execute, delete_plan then delete_execute. Secrets never pass through the chat: secret_set_command returns a stdin-only CLI command, and the value goes from your terminal to the platform without touching the conversation.

What it hosts: Next.js, Vite with React, and TanStack Start, deployed from a GitHub repository you authorize. GitHub is the only deployment source. Every project gets a Dev and a Prod environment on a three-word hostname under check.omh.st. A domain you own is a Paid capability and uses credits. Transactional mail sends from a verified subdomain of your own domain, also Paid, metered per recipient.

What it is not:

- Not a dashboard product. The portal at app.ohmyho.st shows projects, credits, budgets and API tokens. It has no deploy button; deploys go through the agent.
- Not a container host. There is no Dockerfile, no long-running process and no arbitrary runtime. Railway and Fly.io run any container; ohmyho.st runs three frameworks on Workers. If your app needs a container, use them.
- Not an auth provider for your users. Your application keeps its own identity system. The verified integrations are Better Auth and your own WorkOS AuthKit; other OAuth or OIDC SDKs are ordinary dependencies of your app. ohmyho.st never owns your user table.
- Not open source. The platform is a private repository. The documentation is MIT-licensed, and everything an agent reads is public; the [open-source page](/open-source) lists exactly what.

## How it runs

ohmyho.st is a thin layer over providers you already know. The layer is the metering, the per-project isolation and the agent tools; the heavy lifting is theirs.

- Application runtime and builds: Cloudflare Workers for Platforms. Each deployment builds in a Cloudflare build sandbox and runs as its own immutable script, which stays available for rollback. Bandwidth from Workers is not charged.
- Database: Neon Postgres. Dev and Prod each get their own database unless you choose to share one. Idle compute suspends; retained storage keeps using credits.
- Files: Cloudflare R2, in the project's region.
- Transactional mail: Amazon SES, sent from a verified sender subdomain on your domain. The agent sets DKIM and SPF through mail_domain_set and checks them with mail_domain_status. Mail is metered per recipient at the Essentials rate; To, CC and BCC each count.
- Money: Stripe holds the payment method and issues the invoice with tax. Credits live in an append-only ledger on our side. A balance never goes negative; usage the balance cannot fund becomes our cost, never your debt.
- Platform login: WorkOS. The CLI signs you in with a device code in your browser, and the portal uses the same login. This is the login for you and your agent, separate from your application's users.

Region: a project chooses US or EU once, when it is created, and the choice never changes. US is the default. The choice places the project's database, files and builds, and the application runs next to its database. Prices are identical in both regions. Two things do not move with it: the platform's control database, which sits in the EU, and transactional mail, which is sent from the platform's mail region. An EU project is therefore not an EU-only promise, and the [privacy notice](/privacy) says so.

## Where to look

- [Status](/status): a live check of the API and the reporting path. An available API does not prove that every customer app or provider is healthy, and the page says so. For your own project, ask the agent for project_context_get; it returns the current state and the next action.
- [Changelog](/changelog) on this site and the [docs changelog](https://docs.ohmyho.st/changelog): what shipped, dated.
- [Documentation](https://docs.ohmyho.st/): the [quickstart](https://docs.ohmyho.st/quickstart), the [MCP tool reference](https://docs.ohmyho.st/mcp-tools), the [rate card](https://docs.ohmyho.st/pricing) and the [limits](https://docs.ohmyho.st/limits). The docs source is public on GitHub, so a wrong sentence can be fixed with a pull request.
- [Contact form](/contact): the one channel for questions, billing disputes, privacy requests and legal notices. No email address is published; the form asks for your name, an address to reply to and the matter, so every request arrives through one channel. Bugs, suspected issues and feature requests from inside a session go through the feedback_submit tool.
- [Terms](/terms), [privacy](/privacy) and the [DPA](/dpa) with its annexes on [technical measures](/dpa/toms), [providers](/dpa/subprocessors) and [transfers](/dpa/transfers).

## What is not there yet

A plain list, so nobody finds out later:

- No video. The homepage is a prompt and a login link. Not yet.
- No ISO or SOC certification. The technical and organizational measures are published in the DPA; an auditor's letter is not. Not yet.
- No SLA and no published uptime figure. The terms say so in one sentence.
- No roadmap page. The roadmap votes live on the [homepage](/); vote there, and the count is the roadmap.
- No automatic recharge yet. When the balance runs low you top up by hand; the agent reads the balance and the grace deadline with organization_credits_get.
- No export schedule. Exports are on demand: a password-encrypted ZIP with a portable SQL dump, at most one accepted request for each project in any rolling 24 hours, a signed download link valid for 24 hours, free, and available even at zero credits.

## FAQ

### Is ohmyho.st a real company?

Yes. The operator is Amerged B.V., registered with the Dutch Chamber of Commerce under KVK number 42154221 in Venray, Limburg. Stripe issues every invoice with tax under that name, and the terms, privacy notice and data processing agreement all name it. The founder is Sebastian Mertens. Use the [contact form](/contact) to reach the company.

### What happens to my data if ohmyho.st shuts down?

Your source is already in your GitHub repository, and your users are on your own auth provider. Your database leaves as a password-encrypted ZIP with a portable SQL dump that restores on any Postgres host. An export is free and can be requested even at zero credits. Nothing in the dump depends on ohmyho.st.

### Where do projects run?

In the US by default. A project can choose the EU once, at creation, which places its database, files and builds in the EU and runs the app next to its database. Prices are the same in both regions. Transactional mail is sent from the platform's mail region and the control database sits in the EU, so an EU project is not an EU-only guarantee.

### Is ohmyho.st open source?

No. The platform that runs the Workers, provisions Postgres and sends mail is a private repository, and the CLI and MCP packages are published without an open-source license. The documentation is MIT-licensed on GitHub, and the Skills, llms.txt, MCP tool catalog and OpenAPI contract are public. The [open-source page](/open-source) lists each item.

### How do I reach a person?

Through the [contact form](/contact). No email address is published anywhere on the site, so every request arrives through one channel with a name and a matter attached. Bugs, suspected issues and feature requests from inside a session go through the feedback_submit tool, which can attach the project and the operation it concerns.

### What does it cost to try?

Nothing at first. Free gives {{ number plan.freeCredits }} credits per UTC month, and they expire at the end of the month. Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits per period, and top-ups at {{ number plan.topUpPerUsd }} credits per dollar never expire. Every project draws from the same balance; there is no per-project base fee.

{{ sources vercel supabase resend }}

[Philosophy](/philosophy) · [Open source](/open-source) · [Contact](/contact)
