# Deploy an app built with Cursor

Add one local MCP server to Cursor, paste one prompt, and Cursor deploys your GitHub repository to Dev and Prod on ohmyho.st with Postgres and a live URL. Free gives {{ number plan.freeCredits }} credits a UTC month; Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits shared by every project. Three static portfolio sites cost about {{ credits workload.threeStaticSites }} a month.

{{ figure flow.cursor }}

## Paste this prompt

Open the repository in Cursor, open the agent chat and paste this. Cursor reads the two linked files, checks what is installed and signed in, and follows the [get-started Skill](/skills/ohmyhost-get-started/SKILL.md) before it touches anything.

```text
{{ prompt }}
```

"Only the capabilities it needs" is deliberate. A static Vite portfolio gets hosting and nothing else. A Next.js app with a database gets Postgres plus the secret names and callback URLs the plan reports. Cursor is told to keep the decisions already in the repository, not to replace them.

## How to deploy with Cursor

1. Add the MCP server. Cursor reads `.cursor/mcp.json` in the project or `~/.cursor/mcp.json` globally, and its MCP settings show the same list. Add a local stdio server named `ohmyho` with the command `ohmyhost-mcp` and the environment variable `OHMYHOST_ENVIRONMENT=production`; the token-free configuration to merge is served at [ohmyho.st/mcp.json](/mcp.json). Keep your other servers. If the command is not installed yet, the [CLI and MCP guide](https://docs.ohmyho.st/agents/mcp) has the current archive, and the Skill installs or upgrades it when the prompt runs.
2. Reload. A running server keeps the tool list it started with, so after an install or upgrade reload the connection in Cursor's MCP settings and confirm that the `ohmyho` server lists its tools ({{ tools }} today).
3. Paste the prompt above into the agent chat. Cursor runs `ohmyhost whoami` and `ohmyhost init --dry-run`, reads the Skill and reports the state before it acts.
4. Confirm sign-in. With no session on the machine, Cursor posts a sign-in link and a short code. Open the link, check that the page shows the same code, sign in or sign up on that page, and tell Cursor you are done. It verifies with `whoami` instead of trusting the report. It never asks for a password, an email code or a token.
5. Review the plan. `deployment_plan` returns the exact commit, the build hold (about {{ credits unit.buildReservation }} for 14 reserved minutes, settled to the measured seconds), required secrets and effects. Confirm, and Cursor calls `deployment_create`.
6. Verify. Cursor polls `operation_get`, reads `project_status`, opens the private Dev app through a single-use link and tests a real read and write before it reports the URL. Ask it to promote once Dev works.

The whole path is the [deployment Skill](/skills/ohmyhost-deploy-github/SKILL.md); Cursor follows it step by step.

## What Cursor does next

The sequence for a first deployment, in order (MCP tools unless marked CLI):

1. `identity_get` reads who is signed in and which organization is selected. With several workspaces Cursor uses `organization_list` and `organization_use`; with none it asks you for a name and calls `organization_create`.
2. CLI: `ohmyhost github status` for the workspace, then `ohmyhost github connect` once if it has no GitHub installation. You open one authorization link. Cursor never asks for a GitHub token or an installation ID.
3. `project_create` with your region and data mode.
4. `source_link` for the repository, then `source_get` for its state.
5. `deployment_plan` for the pushed commit, then your confirmation.
6. `secret_set_command` for each required secret. It returns a CLI command that reads the value from stdin, so the value never passes through the chat or the MCP server.
7. `deployment_create` with the reviewed plan and one saved idempotency key, then `operation_get` until the build finishes; `deployment_logs` if it fails.
8. `project_status` and `project_dev_access_create` to verify Dev.
9. `promotion_plan` and `promotion_execute` when you ask for Prod.

A later session starts with `project_context_get`, which returns status, DNS and mail next actions and the notes Cursor saved with `project_notes_set`. There is no deploy dashboard; the portal at app.ohmyho.st shows projects, credits, budgets and API tokens. The full catalog is at [docs.ohmyho.st/mcp-tools](https://docs.ohmyho.st/mcp-tools).

## What it asks you

Cursor asks for decisions, not credentials.

- Sign-in: open one link and check the code. Sign-up is open; there is no invitation and no waitlist.
- Region: US or EU, once, at project creation. US is the default. EU places the database, files and builds in the EU at identical prices; transactional mail is sent from the platform mail region either way. The choice cannot change later.
- Data mode: isolated Dev and Prod databases, which the Skill recommends, or one shared database. Isolated is safer for Prod records and meters two databases.
- Secrets: it hands you a command that reads the value from stdin. You paste the value into your terminal, never into the chat.
- Plans: every deployment, promotion, rollback and deletion is a plan you confirm before it executes.
- Money: it never starts a checkout without your request, and automatic recharge is not enabled yet.

A project ID in a prompt is context, not permission. Cursor checks its current authorization on every call.

## Dev and Prod

Every project gets two environments on a platform hostname of the form three-words.check.omh.st. Dev is private: an anonymous request gets a 404, and Cursor opens it through a ten-minute single-use link from `project_dev_access_create`. Prod is public. Promotion moves the verified Dev artifact to Prod without a rebuild; with isolated data it applies schema migrations and copies no Dev rows, so existing Prod records survive.

Each deployed script uses about {{ credits unit.deployedScriptMonth }} a month while it exists, and every deployment stages one that stays for rollback until cleanup. A customer-owned domain on Prod needs Paid and uses about {{ credits unit.customHostnameMonth }} a month; the domain Skill returns the exact DNS records, or authorizes Cloudflare DNS when you host the zone there. See [environments](https://docs.ohmyho.st/environments) and [domains](https://docs.ohmyho.st/domains).

## Safety

- Two steps for anything expensive or destructive: `deployment_plan` → `deployment_create`, `promotion_plan` → `promotion_execute`, `rollback_plan` → `rollback_execute`, `delete_plan` → `delete_execute`. Cursor cannot skip the plan.
- Secrets never enter the chat. `secret_set_command` returns a stdin-only CLI command, and the MCP server never sees the value. See [secrets](https://docs.ohmyho.st/secrets).
- Your auth stays yours. Better Auth and customer-owned WorkOS AuthKit are the verified integrations; the platform login is separate from your application's users, and the plan preserves whatever the repository already uses. See [application auth](https://docs.ohmyho.st/application-auth).
- Budgets: a project can carry a monthly budget in continue or stop mode. Stop blocks new billable work at the limit; continue warns and keeps drawing from the shared balance. See [budgets](https://docs.ohmyho.st/budgets).
- Zero balance: a seven-day grace period starts, funded services keep running, and afterwards only unfunded services suspend. Export, diagnosis and buying credit stay available.
- Leaving: `project_export_create` returns a password-encrypted ZIP with a portable SQL dump, one accepted request per project in any rolling 24 hours, downloaded through a signed link valid 24 hours. SQL exports are free. See [backups](https://docs.ohmyho.st/backups).
- Tokens: optional, created after interactive login, shown once, saved to a private env file, revocable with `token_revoke`.

## What it costs

Free: {{ number plan.freeCredits }} credits per UTC month. Paid: {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits per period, which also unlocks a customer-owned domain and verified sender mail. Monthly credits expire at period end; purchased top-ups never expire ({{ number plan.topUpPerUsd }} credits per dollar up to {{ usd 100 }}, {{ number plan.topUpPerUsdAbove100 }} per dollar above). Every project draws from the organization's one balance and there is no per-project base fee, which is the point for a portfolio.

{{ table workload.threeStaticSites }}

Add a database and the numbers move. One active hour on the Paid standard profile ({{ value profile.standard.cu }} CU) is about {{ credits unit.activeDatabaseHourStandard }}; on the Free profile ({{ value profile.free.cu }} CU) about {{ credits unit.activeDatabaseHourFree }}. Idle compute suspends, but stored data is {{ rate neon.storage.root }} whether the compute is awake or not. A quiet side project with a database costs about {{ credits workload.quietProject }} a month. A small app with 100,000 requests, eight active database hours and 2,000 mail recipients costs about {{ credits workload.smallApp }}. Requests are {{ rate wfp.requests }}; Workers bandwidth is not charged. Mail needs Paid and a verified sender subdomain, is metered per recipient (To, CC and BCC count separately), and a sender zone uses about {{ credits unit.mailSenderZoneMonth }} a month.

Where Vercel wins: Vercel Hobby costs {{ usd vendor.vercel.hobby }} a month for one developer seat, and for a static portfolio with no database and no mail it is the cheaper answer. Vercel Pro is {{ usd vendor.vercel.pro }} a month before you add a database or a mail provider. ohmyho.st fits once a project needs Postgres, transactional mail or a domain, or once you run several small projects and want one balance instead of one plan each.

{{ checked vercel }}

## FAQ

### Does Cursor need an API token?

No. Cursor runs `ohmyhost login`, posts a link and a code, and reuses that local session for the MCP server. A token is optional for automation: `token_create` after interactive login writes it once to a private env file, and `OHMYHOST_TOKEN` in the server's env block then wins over the saved login. Never paste a token into the chat.

### Can I stay on Free for a portfolio?

Yes, when the sites are static or quiet. {{ number plan.freeCredits }} credits a UTC month cover three static sites at about {{ credits workload.threeStaticSites }}, or one quiet project with a database at about {{ credits workload.quietProject }}. A customer-owned domain and sender mail need Paid, and the Free profile runs at {{ value profile.free.cu }} CU.

### Where does the code come from?

From a GitHub repository you authorize. GitHub is the only deployment source; there is no local upload and no container image. Supported frameworks are Next.js, Vite with React and TanStack Start. Cursor runs `ohmyhost init --dry-run` first and reports blockers before anything is provisioned.

### What happens when the balance hits zero?

A seven-day grace period starts and the Owner gets one warning mail. Funded services keep running during grace, and any refill clears it. After an unresolved grace period only unfunded services suspend; data, exports, diagnosis and buying credit stay available. Automatic recharge is not enabled yet.

### Can I take my data and leave?

Yes. Ask Cursor for an export: `project_export_create` builds a password-encrypted ZIP with a portable SQL dump, one accepted request per project in any rolling 24 hours, downloaded through a signed link valid 24 hours. You choose the password and the archive is kept seven days. Files and source are not in it; the source is already in your GitHub repository.

### Does my app's login change?

No. Your app keeps its own auth provider. Better Auth and customer-owned WorkOS AuthKit are the verified integrations; `deployment_plan` preserves whatever the repository already uses and reports the secret names and callback URLs it needs. The ohmyho.st login that Cursor uses is separate from your application's users.

{{ sources vercel }}

[Deploy with Claude Code](/for/claude-code) · [Deploy with Codex](/for/codex) · [Cost breakdown](/pricing/breakdown) · [Six things that break when a vibe-coded app meets production](/blog/six-things-that-break-when-a-vibe-coded-app-meets-production)
