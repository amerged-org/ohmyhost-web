# Deploy a Claude Code app using a prompt

Ask Claude Code to build or update the app from its saved managed or GitHub source, then inspect an exact-commit preview before choosing a deployment. Free includes {{ number plan.freeCredits }} credits per month; Paid costs {{ usd plan.paidUsd }} for {{ number plan.paidCredits }} credits. Projects share the workspace balance. Preview use consumes those credits; deployment remains an explicit step.

**Save a Git commit → open a temporary preview → choose an explicit deployment target.**

## Insert this prompt

Open your project in Claude Code and paste this in. It tells the  agent where the instructionns are located and what it's allowed to do. Nothing else is needed on the first run.

```text
Read https://ohmyho.st/llms.txt and https://ohmyho.st/skills/ohmyhost-get-started/SKILL.md. Continue this app in its existing workspace and saved managed or GitHub source. Save a Git commit and open a temporary preview of that exact commit. Keep my existing project decisions and use only the capabilities the app needs. Show the preview's real data environment and verify any form submission is actually stored. Ask before changing schema unless I already authorized it. Deploy Dev or Prod only when I request that target.
```

## How to deploy with Claude Code

1. Register the local server with `claude mcp add ohmyho -- ohmyhost-mcp`, preserving your existing servers and profile. Follow the [MCP guide](https://docs.ohmyho.st/agents/mcp) for the current install and environment selection.
2. Verify `identity_get` or `ohmyhost whoami --json`, select the intended workspace and read `project_context_get` before changing an existing project. A new app can use managed source without GitHub.
3. Save the intended files as an immutable Git commit. Preserve the project's existing managed or GitHub source binding and wait for its actual save/source operation to finish.
4. Call `preview_create` with that exact commit and one saved idempotency key. Free uses Prod data; Paid may choose Dev (the default) or Prod. Poll `preview_get` while queued or starting. For sleeping, request its original returned URL once to wake it, then observe that same preview until ready or terminal and verify the app. Status reads alone do not wake compute; a temporary {{ number 503 }} during wake is pending. Keep the original expiry and do not create a replacement just to wake it.
5. Verify navigation, applicable login and a real read/write. If schema is missing, review the selected commit and real data environment before an authorized `preview_migrations_apply`; follow its original operation. A confirmation animation alone does not prove storage.
6. When deployment is requested, name the target explicitly: Prod on Free, Dev or Prod on Paid. Use `deployment_plan` and `deployment_create`, keep the accepted key and observe `operation_get`. A preview does not deploy either environment automatically.

## What Claude Code Does Next

For an authoring request, Claude Code follows the existing project context and saved source, saves one immutable Git commit, calls `preview_create`, then polls `preview_get` while queued or starting. If sleeping, it requests the original returned URL once, observes that same preview until ready or terminal and verifies the app; status reads do not request wake or renew expiry. The response names the selected real data environment, absolute expiry and server-computed `compute_quote`. Queued work is not a working link. Each project has one active preview. A different commit or data target replaces the current preview; repeating the same live commit and target keeps its original deadline.

If schema work is needed, Claude Code states the exact commit and real target first, obtains approval unless already given, then calls `preview_migrations_apply` with `confirmed: true` and a saved idempotency key. The platform reads the saved migration files; the caller supplies no SQL or alternate database target. Follow the returned `operation_get` through its actual outcome.

Deployment is a later intentional action: `deployment_plan` for an explicit environment, then `deployment_create` for that exact plan and a saved key. Free chooses Prod; Paid chooses Dev or Prod. An already authorized deployment target does not need another confirmation. An unattended workflow may execute its configured targets, but an edit request alone does not authorize publication. Promotion, rollback and deletion retain their own guarded plan/execute workflows.

Use `project_context_get` when resuming and private secret inputs for the selected environment. A local agent uses stdin; connected chats use `secret_input_request` and its portal handoff. Keep values out of chat and source. [Deployment Skill](/skills/ohmyhost-deploy/SKILL.md) · [CLI and MCP guide](https://docs.ohmyho.st/agents/mcp).

## What it asks you

Claude Code asks about the settings this app requires and  saves any settings you've already chosen. For an unlinked local checkout without GitHub, you'll choose once between managed versions and GitHub setup; making an explicit choice skips this questiion.

- Registrtaion. A web page; the code is displayed in the chat. Registration is  open; there is no waiting list.
- GitHub authorization when GitHub is selected as the souce. An owner or admin opens an `authorization_url` and selects the repositories that the ohmyho.st app is allowed to read. You can add a repository that you didn't select later via the same  settings page—never using an embedded token.
- Region, one-time, and an initial data  mode. US is the default; new projects create databases, new files , and bulds in their selected region. Existing projects that have been moved to the US with the owner’s authorization use US databases; recorded R2 locations remain unchanged. You can retrieve the actual database location using database_compute_get. The customer API cannot change the region after creation. Free uses Prod; Paid may select shared or isolated Dev/Prod data and change assignments through a separate reviewed plan. In both cases, transactional eails are sent and processed in the U.S.
- Secrets. The agent nmes each secret and gives you a command. Enter  the value into your terminal, not into the chat.
- Doain decisions. A custom hostname requires a paid plan and uses credits; for a project that displays the “Powered by ohmyho.st” option, it also works on the free plan and does not use any domain credits. Claude Code displays the CNAME and validation records or offers a very limited Cloudflare DNS authorization if the zone is hosted on Cloudflare. Until the DNS is ready , the project responds under its platform hostname.

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

## Security

The catalog contains {{ tools }} tools. Read-only annotations identify tools that check status, usage , or logs, or return the secret command. Plans that reserve resources or issue authorization tokens are marked as write operations. Tools that removve or replace something are  marked as destructive, and expensive or irreversible actions are executed via a validated plan: `deployment_plan` then `deployment_create`, `promotion_plan` then `promotion_execute`, `rollback_plan` then `rollback_execute`, `delete_plan` then `delete_execute`, and `project_data_plan` then `project_data_change`. The plan shows costs and effects; the execution call accepts its safety conditions and a stored idempotence key. Claude Code cannot delee a project or deploy it to production in a single step.

You can set a spending limit if you want one. `project_budget_set` sets a monthly budget per project using mode `continue` (warn and continue deducting from the organization's balance) or `stop` (reject new paid work). A budget is a limit, not a second credit  balance; usage that has already been reserved will stiill be billed. See the [Budget Guide](https://docs.ohmyho.st/budgets) or the [Usage Skill](/skills/ohmyhost-usage-and-budgets/SKILL.md).

Tokens are  optional. The browser login is sufficient for Claude Code on your computer. For a CI runner or a second computer, `token_create` writes a non-expiring API token to a private environment file that you name; the value appears only once and is never reuseed. `OHMYHOST_TOKEN` overwrites the stored login wherever it is set, and a token cannot create, list, or select workspaces , nor can it generate another tokeen. Revoke it with `token_revoke` or in the portal at app.ohmyho.st. See the [Guide to Login and Tokens](https://docs.ohmyho.st/login-tokens) for details.

## How much it costs

A small app uses about {{ credits workload.smallApp }} per month, which is equivalent to about {{ usdValue workload.smallApp }} in credt value , and the table shows where each credit goes.

{{ table workload.smallApp }}

The Free plan provides {{ number plan.freeCredits }} cerdits per UTC month. The Paid plan costs {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits per period. Monthly credits expire at the end of the period and cannot be carried over. Top-ups never expire, nor do recharge, registration bonus, and referrl credits. Only Paid workspaces can purchase top-ups, which grant {{ number plan.topUpPerUsd }} credits per dollar up to {{ usd 100 }}, and {{ number plan.topUpPerUsdAbove100 }} per dollar for the amount above that. Each project draws from the organization’s single credit balance; there is no base fee per project. A zero balance triggers a {{ number plan.graceDays }}-day grace period during which funded  services continue to run; after that , only unfunded services are suspended. Automatic top-ups do not occur unless the owner enables them.

A quiet month is more affordable. Databases go to sleep after five minutes of inactivity , with no active RAM charegs while in sleep mode. Allocated storage and seven-day backups are included. Customer files and stored worker scripts have their own rates. A script costs about {{ credits unit.deployedScriptMonth }} per month, and a linked custom hostname costs about {{ credits unit.customHostnameMonth }}, but this fee is waived as long as the project displays the option. An email domain has no monthly fee. An inactive project costs about {{ credits workload.quietProject }}. An active database hour with {{ number 512 }} MiB of RAM costs {{ credits unit.activeDatabaseHour512 }}; the {{ number 256 }} MiB size available  on the Free plan costs {{ credits unit.activeDatabaseHour256 }}. Worker bandidth and SQL exports have no separate fees.

## What We Tested and What We Didn't

The earlier protocol capture below does not qualify the temporary preview or explicit preview-schema workflow. Check the installed release's actual `tools/list` and the linked Skills; no new hosted or native-client acceptance is claimed by that historical record.

On October 27, 2026, we launched the locally installed `ohmyhost-mcp` (version 0.1.36) via stdio from a scrippt, sent `initialize` and `tools/list`, and read the response. The list contained `identity_get`, `source_inspect`, `deployment_plan`, `deployment_create`, `deployment_logs`, `promotion_plan`, `promotion_execute`, and `secret_set_command`—the earlier deployment catalog. The [captured response](https://github.com/amerged-org/ohmyhost-web/blob/main/evidence/mcp-stdio-session-20261027.json) is available in our public repository.

This is a protocol review of the shared tool server. It is not a recorded Claude Code session: We have not published a transript showing Claude Code deploying an app, and we make no claims about how Claude Code behaves beyond what is stated in its own MCP documentation. The same review applies to Cursor and Codex , so it does not distinguish between the three.

## FAQ

### Is there a recorded Claude Code deployment that I can watch?

Not yet. The evidence above shows  that the MCP server is responding and listing the deployment tools. When we record an actual Claude code run—including its commands and the resultinng address—it will be added here along with the date.

### Do I need anything else besides Claude Code?

Two locaal components: the ohmyhost-CLI and the ohmyhost-mcp server , both from the archive linked in the [CLI and MCP Guide](https://docs.ohmyho.st/agents/mcp). These local stdio examples  run on your computer using Node.js. A client with an authenticated remote connection follows the seprate OAuth path in this guide; the availability of a native interface is not implied here. Claude Code starts the server itself as soon as it is registered. If they are missing or out of date, the first prompt will install the published archive and ask you to reload the MCP connection.

### Can Claude Code see my secrets?

No. `secret_set_command` returns a CLI command that reads the value from stdin. You run it in your  own terminal; the value goes directly into the selected environment and nevver passes through MCP, the chat, or the transcript. `secrets_list` only displays names. The skills instruct agents never to ask for a secret, a password, or a token value.

### Can I run this in CI without logging in to the browser?

Yes. After a one-time interactive login, `token_create` writes  a non-expiring API token to a private env file and returns only metadata. Load `OHMYHOST_TOKEN` from this file in the runner; it overwrites any saved login. A token can deploy, take over, and read usage, but it cannot create or select a workspae, nor can it generate another token. Revoke it with `token_revoke` when the runner is shut down.

### Can I take my data with me?

Yes. The owner requests an export and receives a password-protected ZIP file  containing a portable SQL dump, generated asynchronously, at most once per project within a rolling 24-hour window, along with a signed download link that is valid for 24 hous. Exports are free. Restore it on any Postgres host. There is no schedule and no bucket destination; the [Export skill](/skills/ohmyhost-export-database/SKILL.md) walks you through the steps.

### Which apps can Claude Code deploy here?

Next.js, Vite/React , TanStack Start, and simple worker moddules, from the project's saved managed source or a GitHub repository that you authorize. The application must be compatible with the Workers runtime: native add-ons, socket-based database drivers, persistent local files, listening servers, and containerized applications require a different runtime or an adapter. The [Deploy Skill](/skills/ohmyhost-deploy/SKILL.md) checks the repository before scheduilng and obtains your application authentication; the platform login is  separate from your app’s users.

Vite can declare `runtime.mode: edge` for your own HTTP endpoints, even without managed database, email, or file functions. Cron schedules also require a scheduled handler. Workers-compatible JavaScript, MJS, and WASM modules use the same  packaging formaat across all framework adapters; this means that an incompatible dependency will not run on Workers.

You declare extrenal browser services in `runtime.browser` and `ohmyhost.yaml`: exact HTTPS or WSS origins  for connections, separate HTTPS origins for scripts , stylesheets, images, fonts, and frames, as well as explicit permissions for same-origin or Blob workers. Resource declarations maintain restrictive standardds for anything that is omitted. Server egress remains separate. Declared CORS support still requires the application’s authorization checks and valid response headers. The agent checks the required external workflow in the selected preview or intentionally deployed environment before reporting that it works.

[Deploy with Cursor](/for/cursor) · [Migrate your app from Lovable](/from/lovable) · [Where your credits go](/pricing/breakdown) · [Six things that break when a Vibe-coded app goes live](/blog/six-things-that-break-when-a-vibe-coded-app-meets-production)
