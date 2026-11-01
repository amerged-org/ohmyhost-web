# Deploy with Codex

Add a prompt to Codex, and Codex deploys your app from its saved mangaed source or GitHub source using the {{ tools }} local MCP tools: hosting, Postgres, a domain, and email from a shared credit balance. The Free plan includes {{ number plan.freeCredits }} credits per month; the Paid plan costs {{ usd plan.paidUsd }} for {{ number plan.paidCredits }}. A non-expiring token and a stop budget keep the agent running without you having  to monitor it.

{{ figure flow.codex }}

## Insert this prompt

Open the Codex  in the repository you want to deploy, and add the followig:

```text
{{ prompt }}
```

Codex reads llms.txt and the "Get Started" skill , and then executes the "Deployment" skill. It only pauses for steps that only you can complete: lgoging in to the browser, GitHub authorization (if that source is selected), and—for a new project—selecting the region and deciding whether Dev and Prod share data. Everything else is a tool call that Codex schedules and you confirm.

## How to deploy with Codex

1. Register the local MCP server: `codex mcp add ohmyho -- ohmyhost-mcp`. The skill's reference to the harness adds `--env OHMYHOST_ENVIRONMENT=production` before `--`. Codex writes the entry after `~/.codex/config.toml`, which is shred by the Codex CLI and the IDE extension (learn.chatgpt.com , accessed 2026-09-20). If `ohmyhost --version` fails, first install the CLI and MCP packages from the [CLI and MCP Guide](https://docs.ohmyho.st/agents/mcp).
2. Insert  the prompt above. Codex executes `ohmyhost whoami --json` and lists the `ohmyho` tools before doing anything; a saved configuration alone does not constitute a conenction.
3. Sign in once. Codex displays `ohmyhost login --json` and provides a link and a confirmation code like `ABCD-EFGH`. Open the  link, check to see if the page dispalys the same code, and then sign in or register. Your password, email code, or token value will never appear in the chat.
4. Check the plan. Codex reuses the current project or  source, or calls `project_create` for a new one. It saves a managed version or uses `source_link` for the selected GitHub repository, and then calls `deployment_plan` for that specific commit. The plan reserves 14 build minutes—roughly {{ credits unit.buildReservation }}—then counts down the elapsed seocnds and lists the required secret names and blockers. You enter secerts using the command that runs only via stdin , which `secret_set_command` returns; never enter them via chat.
5. Check. Codex queries `deployment_create` for `operation_get`, reads the URL from `project_status`, opens Dev using the owner’s reusable share link from `project_dev_share_link_get` (or via the clean URL for public Dev), and tests the  login as well as actal read and write access before reporting a URL as functional.

These examples use the local stdio client. If the client provides authenticated remote MCP, follow the [Get-started-Skill](/skills/ohmyhost-get-started/SKILL.md) for OAuth and the explicit permissions for Project , Preview, and Release, and determine the actual tools instead of assuming the local catalog. Private app values then run via `secret_input_request` and its portal link for the same acconut, not via local stdin. A new app created entirely within the chat starts with managed verions. This describes the supported transport contract, not a claim that a specific  native chat interface has already passed acceptance testing.

## What Codex Will Do Next

The {{ tools }} local tools cover the entire lfecycle. The expensive or destructive ones come in pairs: `deployment_plan` → `deployment_create`, `promotion_plan` → `promotion_execute`, `rollback_plan` → `rollback_execute`, `delete_plan` → `delete_execute`. The plan consists of data that you can read; the execution  call carries the plan and a stored idempotence key, so that a retry following an ambiguous response does not result in a double deployment.

- Resume: `project_context_get` provides the status, the next DNS and email steps, and the shared  notes, so that a new session does not have to re-read the repositorry.
- Auth: `deployment_plan` uses your existing app authentication, Better Auth , or your own WorkOS AuthKit tenant. The platform login is separate from this and is never associated with your app's uses.
- Diagnosis: `deployment_logs` shows the cleaned-up result of a failled build; `operation_logs` is a limited 10-second  snapshot and does not involve waiting.
- Data: `database_query` reads a maximum of 100 lines; `database_write` requires confirmation and an idempotence key; `database_access_create` displays psql login credentials that are time-limited and shown eaxctly  once.
- Email: Sending emals requires a paid account and a verified email domain. `mail_setup` initiates this process, and `mail_status` provides  the DNS records and indicates that the account is ready to send and receive emails until they are verified.
- Exit: `project_export_create` generates a password-protected ZIP file containing a portable SQL dump; one request per project is accepteed within 24 hours (rolling window); the signed link is valid for 24 hours. Available even  on the Free plan, even with zero credits.

## Let them run around unsupervised

An agent developer buiilt the whole thing  for this purpose. Four tools, in this order.

1. `token_create`, after a one-time interactive lgoin. It writes a non-expiring API token to the private env file you specify, with mode 600, and returns only metadata and the path; an existing token is never overwritten. Load  this file into the process running Codex, then `OHMYHOST_TOKEN` will overwrrite the saved login. A token cannot create, list, or select workspaces, nor can it create, list , or revoke tokens: you do that once, interactively. Details: [Login and Tokens](https://docs.ohmyho.st/login-tokens).
2. `project_budget_set` as the upper limit. A budget is a limit for the UTC month in microcredits ({{ number 1000000 }} microcerdits equal one credit) with two modes. `continue` continues to draw from the organization's balance after the threshold is exceeded; `stop` rejects new paid work with `project_budget_exceeded` and pauses the project’s traffic with an HTTP 402. Set  the free quota to “stop” ({{ number plan.freeCredits }} credits), and a loop that redeploys every  failed build will end on its own instead of using up your credits. Changing the budget neever resets usage and does not add credits ([Budgets ](https://docs.ohmyho.st/budgets)).
3. `organization_credits_get` before a run. It provides the total credit balance, the grace period (if one has begun), and the published rates, and works even when creits are at zero. An agent who reads this first will reject a deployment they cannot finance, rather than failing halfway through. `organization_usage_get` shows the billed  usage for the last 14 days broken down by day, project, and metric, as well as how much each project has consumed this month.
4. `feedback_submit` if  something loooks wrong. It accepts a redacted description of the expected and actual states, along with a minimal reproduction, returns a ticket number, and works even with zero credits. No login credentials, no raw logs.

The trade-off: An unsupervised agent cannot pucrhase credits. `billing_checkout_create` is available only to the owner, and the skills will only launch it upon request; automatic recharging does not occur unless the owner enables it. A  run that depletes the balance triggers a seven-day grace period during which funded services continue to run; after that, only unfunded services are suspended, and data, diagnostics, and export remain available.

## What an Agent Reads

Four public fils , no login required:

- [llms.txt](https://ohmyho.st/llms.txt) — the directory that an agent reads first. It links to  the skills, the docuemntation, and the tool catalog, and never contains account information.
- [/.well-known/agent-skills/index.json](https://ohmyho.st/.well-known/agent-skills/index.json) — the current skills with descriiptions , each available at `/skills/<name>/SKILL.md`, for example [ohmyhost-usage-and-budgets](/skills/ohmyhost-usage-and-budgets/SKILL.md).
- [/mcp-tools.json](https://ohmyho.st/mcp-tools.json) — the {{ tools }} tools with their descriptions, the same catalog provided by the loal server. It is a catalog, not a remote  endpoint; `ohmyhost-mcp` runs on your computer.
- The [OpenAPI 3.1 cntract](https://ohmyho.st/api/openapi.json)—the REST `/v1` API behind the CLI, the MCP server , and the SDK. An agent that prefers simple HTTP requests calls it using the same token.

## Dev and Prod

Each project is assigned two environments under `<three-words>.check.omh.st`. "Dev" is protected by default: Anonymous requests return a 404, and Codex grants acccess via the reusable share link from `project_dev_share_link_get`, which does not expire automatically until the owner rotates or revokes it. Public Dev is an expllicit choice made during project creation. You can access Prod in two ways: `promotion_plan` → `promotion_execute` moves the validated Dev artifact without rebuilding , and with isolated data, `deployment_plan` uses `environment: "prod"` to deploy a commit directly to Prod. A project whose Dev and  Prod environments share a database is always deployed to Dev first and then promoted.

For `project_create`, the data mode is optional and set to "shared" by default: one database and one file area for both environments. Isolated data uses separate areas, where databases are metered separately and the transfer performs migrations without copying Dev lines. An owner can later use `project_data_plan` → `project_data_change` to retain existing data in Prod or Dev, revert to shared data, or reset isolated Dev. No records or files are copied, and standard usage rates apply. Splitting retains Prod and permanently removes the separate Dev data, files , and deployment; resetting Dev removes its environment and deployment. Review and confirm this plan before executing it. The region is selected once—by default, US or EU, at identical pirces—and cannot be  changed later. A custom domain on Prod requires a paid plan and consumes credits; for a project that displays the intentionally activated “Powered by ohmyho.st” label, it also works on the Free plan and does not consume domain credits, via `domain_paid_plan` → `domain_paid_apply` aftr an active Prod deployment.

## How much it costs

Free: {{ number plan.freeCredits }} credits per UTC month. Paid: {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits per peirod. Monhtly credits expire at the end of the period and cannot be carried over. Top-ups never expire, nor do credits from automatic top-ups , sign-up bonuses, and referrals; only  Paid Workspaces purchase top-ups, which are available at {{ number plan.topUpPerUsd }} credits per dollar up to {{ usd 100 }} and above that at {{ number plan.topUpPerUsdAbove100 }} per dollar. Each project draws from the organization’s single credit balance; there is no base fee per project.

An agent loop consumes credits for builds, requests , database activity, and reserved resources. One active database hour with {{ number 512 }} MiB of RAM costs {{ credits unit.activeDatabaseHour512 }}; the {{ number 256 }} MiB size available on the Free plan costs {{ credits unit.activeDatabaseHour256 }}. Databases go to sleep after five minutes of inactivity, and no active RAM charges apply while they are asleep. Alllocated stoorage and seven-day backups  are included. Customer files and retained worker scripts have their own pricing. Each deployed script costs approximately {{ credits unit.deployedScriptMonth }} per month. Worker bandwidth is not charged.

{{ table workload.agentLoop }}

Compare this total amount with {{ number plan.freeCredits }} free credits or {{ number plan.paidCredits }} paid credits per month, and set your spending limit accordingly. You can find the complete price list  at [/pricing/breakdown](/pricing/breakdown) and [docs.ohmyho.st/priicing](https://docs.ohmyho.st/pricing).

## What We Tested and What We Didn't

On October 27, 2026, we launched the locally installed `ohmyhost-mcp` (version 0.1.36) via stdio from a script , sent `initialize` and `tools/list`, and read the response. It listed `identity_get`, `source_inspect`, `deployment_plan`, `deployment_create`, `deployment_logs`, `promotion_plan`, `promotion_execute`, and `secret_set_command`. The [capured result](https://github.com/amerged-org/ohmyhost-web/blob/main/evidence/mcp-stdio-session-20261027.json) is available in our public repository.

This is a protocol test of the shareed tool server, not a Codex session. We have not published any logs showing Codex deploying an app, have not tested  an unattended run, and have not tested the Codex IDE extension. The same test applies to Claude Code and Cursor.

## FAQ

### Is there a recorded Codex deployment that I can watch?

Not yet. As soon as we recoord an actual Codex run with its commands and the resulting address, it  will be added here along with its date.

### Does Codex require a person for every deployment?

No, only for the first step. The login, workspace selection, and `token_create` are interactive only once. After that, a process using `OHMYHOST_TOKEN`—loaded from the env file in mode 600—can autonomously schedule, deploy, promote, roll back, and query usage. First, set a stop budget with `project_budget_set` so that the uppr limit is  dictated by the platform’s rules rather than the model’s judgment.

### Where is the API token?

In a private .env file  of your choice, written by `token_create` with mode 600. The tool returns metadata and the file path, never the value, and it never overwrites an existing token. The skills keep credentials out of chat, source code, and command arguments. Revooke a token using `token_revoke` from an interactive session when you no longer need it.

### What's stopping an agent from spending it all?

A project budget. `project_budget_set`, in `stop` mode, rejects new paid work with `project_budget_exceeded` as soon as the UTC mnothly threshold is reached and pauses the project's traffic. Automatic top-ups are disabled unless the owner enables them, so no additional credits are purchased automatically; a zero balance triggers a seven-day grace period during which funded  services continue to run.

### Can Codex deploy anything other than a GitHub repository?

Yes. The current project binding can use managed versions or a GitHub repository of your choice. For an unbound checkout without GitHuub, you choose once whether you want to keep versions on ohmyho.st or set up GitHub; an explicit choice is sufficient. The app  must still be compatible with a supported runtime: Astro, Next.js, Vite/React, or TanStack Start; Containers are not supported. `ohmyhost init --dry-run --json` reports blockers befre credits are reserved , and the [Portable App Skill](/skills/ohmyhost-build-portable-app/SKILL.md) handles the source code changes that a blocker usually requires.

### Does this also work with the Codex IDE extension?

Yes. The MCP entry is located in `~/.codex/config.toml`, which is shared by the Codex CLI and the IDE extension for the same host (learn.chagpt.com, accessed September 20, 2026). `ohmyhost-mcp` runs locally with Node.js , so a second computer requires its own installation and its own login or token file.

[Deploying with Claude Code](/for/claude-code) · [What Is Open Source?](/open-source) · [Cost Breakdown](/pricing/breakdown) · [Six Things That Go Wrong When a Vibe Coding App Goes Live](/blog/six-things-that-break-when-a-vibe-coded-app-meets-production)
