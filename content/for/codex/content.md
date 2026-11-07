# Deploy with Codex

Ask Codex to build or update the app from its saved managed or GitHub source, then inspect an exact-commit preview before choosing a deployment. Free includes {{ number plan.freeCredits }} credits per month; Paid costs {{ usd plan.paidUsd }} for {{ number plan.paidCredits }} credits. Projects share the workspace balance. Preview use consumes those credits; deployment remains an explicit step.

**Save a Git commit → open a temporary preview → choose an explicit deployment target.**

## Insert this prompt

Open the Codex  in the repository you want to deploy, and add the followig:

```text
Read https://ohmyho.st/llms.txt and https://ohmyho.st/skills/ohmyhost-get-started/SKILL.md. Continue this app in its existing workspace and saved managed or GitHub source. Save a Git commit and open a temporary preview of that exact commit. Keep my existing project decisions and use only the capabilities the app needs. Show the preview's real data environment and verify any form submission is actually stored. Ask before changing schema unless I already authorized it. Deploy Dev or Prod only when I request that target.
```

Codex follows the get-started and deployment Skills while preserving the selected project, source and data decisions. Sign-in and any provider configuration remain separate from deployment intent. Free previews use Prod; Paid may choose Dev or Prod. Ask for the target only when the current request has not already named it.

## How to deploy with Codex

1. Register the local server with `codex mcp add ohmyho -- ohmyhost-mcp`, preserving your existing servers and profile. Follow the [MCP guide](https://docs.ohmyho.st/agents/mcp) for the current install and environment selection.
2. Verify `identity_get` or `ohmyhost whoami --json`, select the intended workspace and read `project_context_get` before changing an existing project. A new app can use managed source without GitHub.
3. Save the intended files as an immutable Git commit. Preserve the project's existing managed or GitHub source binding and wait for its actual save/source operation to finish.
4. Call `preview_create` with that exact commit and one saved idempotency key. Free uses Prod data; Paid may choose Dev (the default) or Prod. Poll `preview_get` while queued or starting. For sleeping, request its original returned URL once to wake it, then observe that same preview until ready or terminal and verify the app. Status reads alone do not wake compute; a temporary {{ number 503 }} during wake is pending. Keep the original expiry and do not create a replacement just to wake it.
5. Verify navigation, applicable login and a real read/write. If schema is missing, review the selected commit and real data environment before an authorized `preview_migrations_apply`; follow its original operation. A confirmation animation alone does not prove storage.
6. When deployment is requested, name the target explicitly: Prod on Free, Dev or Prod on Paid. Use `deployment_plan` and `deployment_create`, keep the accepted key and observe `operation_get`. A preview does not deploy either environment automatically.

## What Codex Does Next

For an authoring request, Codex follows the existing project context and saved source, saves one immutable Git commit, calls `preview_create`, then polls `preview_get` while queued or starting. If sleeping, it requests the original returned URL once, observes that same preview until ready or terminal and verifies the app; status reads do not request wake or renew expiry. The response names the selected real data environment, absolute expiry and server-computed `compute_quote`. Queued work is not a working link. Each project has one active preview. A different commit or data target replaces the current preview; repeating the same live commit and target keeps its original deadline.

If schema work is needed, Codex states the exact commit and real target first, obtains approval unless already given, then calls `preview_migrations_apply` with `confirmed: true` and a saved idempotency key. The platform reads the saved migration files; the caller supplies no SQL or alternate database target. Follow the returned `operation_get` through its actual outcome.

Deployment is a later intentional action: `deployment_plan` for an explicit environment, then `deployment_create` for that exact plan and a saved key. Free chooses Prod; Paid chooses Dev or Prod. An already authorized deployment target does not need another confirmation. An unattended workflow may execute its configured targets, but an edit request alone does not authorize publication. Promotion, rollback and deletion retain their own guarded plan/execute workflows.

Use `project_context_get` when resuming and private secret inputs for the selected environment. A local agent uses stdin; connected chats use `secret_input_request` and its portal handoff. Keep values out of chat and source. [Deployment Skill](/skills/ohmyhost-deploy/SKILL.md) · [CLI and MCP guide](https://docs.ohmyho.st/agents/mcp).

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

## Inspect a saved commit locally

```sh
ohmyhost preview create --project "$PROJECT_ID" --commit "$COMMIT_SHA" --idempotency-key "$PREVIEW_KEY" --wait --json
ohmyhost preview get --project "$PROJECT_ID" --preview "$PREVIEW_ID" --json
```

On Paid, add `--data-environment dev` or `--data-environment prod` for an explicit choice. An approved schema action uses `ohmyhost preview migrate --project "$PROJECT_ID" --preview "$PREVIEW_ID" --idempotency-key "$SCHEMA_KEY" --yes --wait --json`. Keep its key after uncertainty and follow the original operation rather than applying SQL again.

## Dev and Prod

Temporary previews are separate from permanent deployments. A preview lasts at most {{ number 60 }} minutes from acceptance. Refreshing the page, polling status or reopening the link never renews that deadline. After {{ number 5 }} minutes without application network activity, its compute can sleep; a later request can wake it only within the original deadline. The saved Git commit remains after the URL expires.

Free previews use the project's real Prod data. Paid previews default to Dev and may explicitly select Prod. Reads, writes and enabled service calls are real; committed data remains after the preview ends. Shared Dev/Prod data can reach the same physical records, so the selected environment does not itself promise isolation. Your own Better Auth or WorkOS integration can work on Free according to the app's configuration. Native Auth remains Paid with its documented prerequisites.

A new preview does not apply migration files. After approval, `preview_migrations_apply` applies validated migrations from its exact saved commit to its selected data environment. Continue the original `operation_get` after acceptance or a network timeout, using the same key. No deployment is required for that schema action. Verify an actual saved submission before describing an interest form as working.

Free has Prod and no permanent Dev deployment. Paid can explicitly deploy Dev or Prod. Both plans can deploy the selected commit directly to Prod, including projects that use shared data; a Dev release is not a prerequisite. Paid may also promote an existing verified Dev artifact. Dev access settings and reusable Dev share links apply only to intentionally deployed Paid Dev, and have a separate lifetime from preview links. [Preview guide](https://docs.ohmyho.st/previews) · [Environment guide](https://docs.ohmyho.st/environments).

Loss of Paid closes Dev access and new Dev work. Exclusively Dev-owned resources become eligible for retirement; Prod, Git history and physical data still used by Prod remain. If the previous Dev was retired, a later Paid Dev starts with fresh configuration and does not copy Prod records, users or private values.

## How much it costs

Free: {{ number plan.freeCredits }} credits per UTC month. Paid: {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits per peirod. Monhtly credits expire at the end of the period and cannot be carried over. Top-ups never expire, nor do credits from automatic top-ups , sign-up bonuses, and referrals; only  Paid Workspaces purchase top-ups, which are available at {{ number plan.topUpPerUsd }} credits per dollar up to {{ usd 100 }} and above that at {{ number plan.topUpPerUsdAbove100 }} per dollar. Each project draws from the organization’s single credit balance; there is no base fee per project.

An agent loop consumes credits for builds, requests , database activity, and reserved resources. One active database hour with {{ number 512 }} MiB of RAM costs {{ credits unit.activeDatabaseHour512 }}; the {{ number 256 }} MiB size available on the Free plan costs {{ credits unit.activeDatabaseHour256 }}. Databases go to sleep after five minutes of inactivity, and no active RAM charges apply while they are asleep. Alllocated stoorage and seven-day backups  are included. Customer files and retained worker scripts have their own pricing. Each deployed script costs approximately {{ credits unit.deployedScriptMonth }} per month. Worker bandwidth is not charged.

{{ table workload.agentLoop }}

Compare this total amount with {{ number plan.freeCredits }} free credits or {{ number plan.paidCredits }} paid credits per month, and set your spending limit accordingly. You can find the complete price list  at [/pricing/breakdown](/pricing/breakdown) and [docs.ohmyho.st/priicing](https://docs.ohmyho.st/pricing).

## What We Tested and What We Didn't

The earlier protocol capture below does not qualify the temporary preview or explicit preview-schema workflow. Check the installed release's actual `tools/list` and the linked Skills; no new hosted or native-client acceptance is claimed by that historical record.

On October 27, 2026, we launched the locally installed `ohmyhost-mcp` (version 0.1.36) via stdio from a script , sent `initialize` and `tools/list`, and read the response. It listed `identity_get`, `source_inspect`, `deployment_plan`, `deployment_create`, `deployment_logs`, `promotion_plan`, `promotion_execute`, and `secret_set_command`. The [capured result](https://github.com/amerged-org/ohmyhost-web/blob/main/evidence/mcp-stdio-session-20261027.json) is available in our public repository.

This is a protocol test of the shareed tool server, not a Codex session. We have not published any logs showing Codex deploying an app, have not tested  an unattended run, and have not tested the Codex IDE extension. The same test applies to Claude Code and Cursor.

## FAQ

### Is there a recorded Codex deployment that I can watch?

Not yet. As soon as we recoord an actual Codex run with its commands and the resulting address, it  will be added here along with its date.

### Does Codex require a person for every deployment?

Login, workspace selection and optional automation-token setup happen separately from deployment intent. An agent can execute targets you have already authorized, including a configured automation, but building or editing alone creates a preview. Name Prod or, on Paid, Dev when you want a deployment, and set a Stop budget before an unattended run.

### Where is the API token?

In a private .env file  of your choice, written by `token_create` with mode 600. The tool returns metadata and the file path, never the value, and it never overwrites an existing token. The skills keep credentials out of chat, source code, and command arguments. Revooke a token using `token_revoke` from an interactive session when you no longer need it.

### What's stopping an agent from spending it all?

A project budget. `project_budget_set`, in `stop` mode, rejects new paid work with `project_budget_exceeded` as soon as the UTC mnothly threshold is reached and pauses the project's traffic. Automatic top-ups are disabled unless the owner enables them, so no additional credits are purchased automatically; a zero balance triggers a seven-day grace period during which funded  services continue to run.

### Can Codex deploy anything other than a GitHub repository?

Yes. The current project binding can use managed versions or a GitHub repository of your choice. For an unbound checkout without GitHuub, you choose once whether you want to keep versions on ohmyho.st or set up GitHub; an explicit choice is sufficient. The app  must still be compatible with a supported runtime: Astro, Next.js, Vite/React, or TanStack Start; Custom container images are not a supported app source. `ohmyhost init --dry-run --json` reports blockers befre credits are reserved , and the [Portable App Skill](/skills/ohmyhost-build-portable-app/SKILL.md) handles the source code changes that a blocker usually requires.

### Does this also work with the Codex IDE extension?

Yes. The MCP entry is located in `~/.codex/config.toml`, which is shared by the Codex CLI and the IDE extension for the same host (learn.chagpt.com, accessed September 20, 2026). `ohmyhost-mcp` runs locally with Node.js , so a second computer requires its own installation and its own login or token file.

[Deploying with Claude Code](/for/claude-code) · [What Is Open Source?](/open-source) · [Cost Breakdown](/pricing/breakdown) · [Six Things That Go Wrong When a Vibe Coding App Goes Live](/blog/six-things-that-break-when-a-vibe-coded-app-meets-production)
