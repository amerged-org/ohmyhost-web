# Deploy with Codex

Paste one prompt into Codex and it deploys your GitHub repository to ohmyho.st through the {{ tools }} MCP tools: hosting, Postgres, a domain and mail from one balance. Free gives {{ number plan.freeCredits }} credits a month; Paid is {{ usd plan.paidUsd }} for {{ number plan.paidCredits }}. A non-expiring token and a stop budget let the agent run without you watching.

{{ figure flow.codex }}

## Paste this prompt

Open Codex in the repository you want to deploy and paste this:

```text
{{ prompt }}
```

Codex reads llms.txt and the get-started Skill, then follows the deployment Skill. It stops only for the things you alone can do: the browser sign-in, the GitHub authorization, and for a new project the region and whether Dev and Prod share data. Everything else is a tool call it plans and you confirm.

## How to deploy with Codex

1. Register the local MCP server: `codex mcp add ohmyho -- ohmyhost-mcp`. The Skill's harness reference adds `--env OHMYHOST_ENVIRONMENT=production` before the `--`. Codex writes the entry to `~/.codex/config.toml`, which the Codex CLI and the IDE extension share (learn.chatgpt.com, read 2026-09-20). If `ohmyhost --version` fails, install the CLI and MCP packages first from the [CLI and MCP guide](https://docs.ohmyho.st/agents/mcp).
2. Paste the prompt above. Codex runs `ohmyhost whoami --json` and lists the `ohmyho` tools before it touches anything; a saved configuration alone is not a connection.
3. Sign in once. Codex runs `ohmyhost login --json` and prints a link plus a confirmation code such as `ABCD-EFGH`. Open the link, check that the page shows the same code, then sign in or sign up. No password, email code or token value ever goes into the chat.
4. Review the plan. Codex calls `project_create`, `source_link` and `deployment_plan`. The plan reserves 14 build minutes, about {{ credits unit.buildReservation }}, settles the measured seconds afterwards, and lists required secret names and blockers. Secrets go in through the stdin-only command returned by `secret_set_command`, never through the chat.
5. Verify. After `deployment_create`, Codex polls `operation_get`, reads the URL from `project_status`, opens Dev through a `project_dev_access_create` link and tests login plus a real read and write before it reports a URL as working.

## What Codex does next

The {{ tools }} tools cover the whole lifecycle, and the expensive or destructive ones come in pairs: `deployment_plan` → `deployment_create`, `promotion_plan` → `promotion_execute`, `rollback_plan` → `rollback_execute`, `delete_plan` → `delete_execute`. The plan is data you can read; the execute call carries the plan and one saved idempotency key, so a retry after an uncertain response cannot deploy twice.

- Resuming: `project_context_get` returns status, DNS and mail next actions and shared notes, so a new session does not re-read the repository.
- Auth: `deployment_plan` preserves your existing application auth, Better Auth or your own WorkOS AuthKit tenant. The platform login is separate and never becomes your app's users.
- Diagnosis: `deployment_logs` carries the sanitized tail of a failed build; `operation_logs` is a bounded ten-second snapshot, not a wait.
- Data: `database_query` reads at most 100 rows; `database_write` needs confirmation and an idempotency key; `database_access_create` issues a time-bound psql credential shown exactly once.
- Mail: sending needs Paid and a verified sender subdomain. `mail_domain_set` starts it and `mail_domain_status` reports DKIM and SPF until they verify.
- Leaving: `project_export_create` produces a password-encrypted ZIP with a portable SQL dump, one accepted request per project per rolling 24 hours, signed link valid 24 hours. Free, even at zero credits.

## Running without a human present

This is the part an agent builder came for. Four tools, in this order.

1. `token_create`, after one interactive login. It writes a non-expiring API token to the private env file you name, mode 600, and returns only metadata and the path; an existing token is never overwritten. Load that file into the process that runs Codex and `OHMYHOST_TOKEN` overrides the saved login. A token cannot create, list or select workspaces, or create, list or revoke tokens: do those once, interactively. Details: [login and tokens](https://docs.ohmyho.st/login-tokens).
2. `project_budget_set` as the ceiling. A budget is a UTC-month limit in microcredits ({{ number 1000000 }} microcredits is one credit) with two modes. `continue` keeps drawing from the organization's balance past the threshold; `stop` rejects new billable work with `project_budget_exceeded` and pauses the project's traffic with HTTP 402. Set stop at the Free allowance, {{ number plan.freeCredits }} credits, and a loop that redeploys every failed build ends on its own instead of draining your top-ups. Changing a budget never resets usage or adds credits ([budgets](https://docs.ohmyho.st/budgets)).
3. `organization_credits_get` before a run. It returns the shared balance, the grace window if one has started and the published rate cards, and it works at zero credits. An agent that reads it first declines a deployment it cannot fund instead of failing halfway. `organization_usage_get` adds the posted usage by project, environment and meter for the month.
4. `feedback_submit` when something looks wrong. It takes a redacted expected-versus-actual description and a minimal reproduction, returns a receipt ID and works at zero credits. No credentials, no raw logs.

The trade-off: an unattended agent cannot buy credits. `billing_checkout_create` is Owner-only and the Skills start it only on request, and automatic recharge is not enabled yet. A run that empties the balance starts a seven-day grace period in which funded services keep running; after that only unfunded services suspend, and data, diagnosis and export stay available.

## What an agent reads

Four public files, no login required:

- [llms.txt](https://ohmyho.st/llms.txt) — the index an agent reads first. It links the Skills, the docs and the tool catalog, and it never contains account data.
- [/.well-known/agent-skills/index.json](https://ohmyho.st/.well-known/agent-skills/index.json) — the nine Skills with descriptions, each served at `/skills/<name>/SKILL.md`, for example [ohmyhost-usage-and-budgets](/skills/ohmyhost-usage-and-budgets/SKILL.md).
- [/mcp-tools.json](https://ohmyho.st/mcp-tools.json) — the {{ tools }} tools with their descriptions, the same catalog the local server exposes. It is a catalog, not a remote endpoint; `ohmyhost-mcp` runs on your machine.
- The [OpenAPI 3.1 contract](https://ohmyho.st/api/openapi.json) — the REST `/v1` API behind the CLI, the MCP server and the SDK. An agent that prefers plain HTTP calls it with the same token.

## Dev and Prod

Every project gets two environments on `<three-words>.check.omh.st`. Dev is private: anonymous requests get a 404, and Codex opens it through a ten-minute single-use link from `project_dev_access_create`. Prod is reached only by `promotion_plan` → `promotion_execute`, which moves the verified Dev artifact without a rebuild.

At `project_create` you choose once: shared data, one database for both environments, or isolated data, two databases metered separately, where promotion applies migrations without copying Dev rows. The region is chosen once as well, US by default or EU, at identical prices; it cannot change later. A customer-owned domain on Prod needs Paid and uses credits, through `domain_paid_plan` → `domain_paid_apply`.

## What it costs

Free: {{ number plan.freeCredits }} credits per UTC month. Paid: {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits per period. Monthly credits expire at period end; purchased top-ups never expire, at {{ number plan.topUpPerUsd }} credits per dollar up to {{ usd 100 }} and {{ number plan.topUpPerUsdAbove100 }} per dollar above. Every project draws from the organization's one balance; there is no per-project base fee.

An agent loop spends on builds, requests, database time and whatever it keeps. One active hour on the Paid standard profile ({{ value profile.standard.cu }} CU) is about {{ credits unit.activeDatabaseHourStandard }}. Idle compute suspends, but stored data stays at {{ rate neon.storage.root }} and each deployed script at about {{ credits unit.deployedScriptMonth }} a month. Workers bandwidth is not charged.

{{ table workload.agentLoop }}

Compare that total with {{ number plan.freeCredits }} Free or {{ number plan.paidCredits }} Paid credits a month, and set the stop budget from it. The full rate card is at [/pricing/breakdown](/pricing/breakdown) and [docs.ohmyho.st/pricing](https://docs.ohmyho.st/pricing).

## FAQ

### Does Codex need a human for every deployment?

No, only for the first one. The sign-in, the workspace selection and `token_create` are interactive once. After that a process with `OHMYHOST_TOKEN` loaded from the mode-600 env file can plan, deploy, promote, roll back and read usage on its own. Set a stop budget with `project_budget_set` first, so the ceiling is the platform's rule, not the model's judgment.

### Where does the API token live?

In a private env file you choose, written by `token_create` with mode 600. The tool returns metadata and the file path, never the value, and it never overwrites an existing token. The Skills keep credentials out of chat, source and command arguments. Revoke a token with `token_revoke` from an interactive session when it is no longer needed.

### What stops an agent from spending everything?

A project budget. `project_budget_set` in `stop` mode rejects new billable work with `project_budget_exceeded` once the UTC-month threshold is reached and pauses the project's traffic. Automatic recharge is not enabled yet, so nothing buys more credits on its own; a zero balance starts a seven-day grace period during which funded services keep running.

### Can Codex deploy something other than a GitHub repository?

No. GitHub is the only deployment source, and the app must be Next.js, Vite/React or TanStack Start; there are no containers. `ohmyhost init --dry-run --json` reports blockers before any credit is reserved, and the [portable-app Skill](/skills/ohmyhost-build-portable-app/SKILL.md) covers the source changes a blocker usually needs.

### Does this work with the Codex IDE extension too?

Yes. The MCP entry lives in `~/.codex/config.toml`, which the Codex CLI and the IDE extension share for the same host (learn.chatgpt.com, read 2026-09-20). `ohmyhost-mcp` runs locally with Node.js, so a second computer needs its own installation and its own login or token file.

[Deploy with Claude Code](/for/claude-code) · [What is open](/open-source) · [Cost breakdown](/pricing/breakdown) · [Six things that break when a vibe-coded app meets production](/blog/six-things-that-break-when-a-vibe-coded-app-meets-production)
