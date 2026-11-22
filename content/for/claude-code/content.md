# Deploy a Claude Code app using a prompt

Paste the prompt into Claude Code on your computer or in a cloud session. Claude Code checks your workspace, saves the app, deploys it and opens a live preview. The Free plan includes {{ number plan.freeCredits }} credits per month; the Paid plan costs {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits, which are shared across all projects. A small app uses about {{ credits workload.smallApp }} credits per month.

{{ figure flow.claude-code }}

## Insert this prompt

Open your project in Claude Code and paste this prompt.

```text
{{ prompt }}
```

## How to deploy with Claude Code

1. Paste the prompt. The [get-started Skill](/skills/ohmyhost-get-started/SKILL.md) directs an agent with a shell to check `ohmyhost whoami --json` and install or upgrade the clients if needed. Local MCP registration is optional. See the [CLI and MCP guide](https://docs.ohmyho.st/agents/mcp) for setup.
2. If you are signed out, open the link Claude Code gives you, confirm the code and sign in or create your account. This works on a desktop and in a Linux cloud session or container. Linux stores the login in owner-only files under your home directory.
3. Claude Code verifies the account and workspace and reuses the saved project and source binding. For an unbound checkout, it publishes the current files as managed source unless you ask for GitHub.
4. For a new project, choose EU or US. The first deployment uses protected Dev and shared data by default. After deployment, Claude Code opens [Live Preview](https://docs.ohmyho.st/quickstart#5-verify-the-app) and shares it when the saved version is ready. Ask for the deployed Dev site if you need its share link.

A connected chat without a shell uses managed OAuth and `identity_get`. It can use the private portal link from `secret_input_request` for application secrets. Unattended automation uses a private `OHMYHOST_TOKEN` in the runner's environment. [Login and API tokens](https://docs.ohmyho.st/login-tokens).

## What Claude Code Does Next

The CLI can complete the workflow. When MCP is connected, the [{{ tools }} tool catalog](https://docs.ohmyho.st/mcp-tools) describes these operations.

- `identity_get` confirms who is logged in and whicch workspace is selected. It doesn't provide any information about your app's users; they remain with  your own authentication provider.
- `organization_list` shows your workspaces. If there is exactly one, it is  alreaddy selected.
- Use the selected existing project. `project_create` creates  a new project with a region and data mode only if required. The agent uses the selected region and shared data by default.
- Read `source_get` and retain the current binding. Managed sources use `source_publish` to save current local files; the selected GitHub path uses `source_link` for an authoriized repository. Saving or linking the source  never triggers a build.
- `deployment_plan` checks the specific GitHub commiit (whether it's saved , managed, or pushed), reserves the build lock, and returns the costs, requirements, and impact.
- `deployment_create` starts the verified plan with a saved idempotence key , so that a retry after a connectin failure does not start a second build.
- `operation_get` reports the phase  and the next polling interval. Calude Code waits instead of rebuilding.
- `project_status` provides the environment IDs and deployment URLs. The agent opens Live Preview to show the app after deployment.

Secrets run via `secret_set_command`. It returns a CLI command that reads only from stdin; you run it in your own terminal, and the value never makes it into MCP or the chat. A customer domain runs via `domain_paid_plan`, whiich returns the DNS records, and `domain_paid_apply`, which activates the hostname  you specified. Both require a Paid plan, or on the Free plan , a project that dislpays the “Powered by ohmyho.st” option; both respond with `production_deployment_required` without making any changes until Prod has an active deployment.

## What it asks you

Claude Code asks for the decisions the app needs and reuses settings you have already chosen.

- Registrtaion. A web page; the code is displayed in the chat. Registration is  open; there is no waiting list.
- GitHub authorization when GitHub is selected as the souce. An owner or admin opens an `authorization_url` and selects the repositories that the ohmyhost app is allowed to read. You can add a repository that you didn't select later via the same  settings page—never using an embedded token.
- Region, once for a new project. US is the default; new projects create databases, new files , and bulds in their selected region. Existing projects that have been moved to the US with the owner’s authorization use US databases; recorded R2 locations remain unchanged. You can retrieve the actual database location using database_compute_get. The customer API cannot change the region after creation. The data mode is optional and is shared by default; an owner can change it later via a reviewed plan. In both cases, transactional eails are sent and processed in the U.S.
- Secrets. The agent nmes each secret and gives you a command. Enter  the value into your terminal, not into the chat.
- Doain decisions. A custom hostname requires a paid plan and uses credits; for a project that displays the “Powered by ohmyho.st” option, it also works on the free plan and does not use any domain credits. Claude Code displays the CNAME and validation records or offers a very limited Cloudflare DNS authorization if the zone is hosted on Cloudflare. Until the DNS is ready , the project responds under its platform hostname.

## Dev and Prod

Each project gets a dev and a prod environment at `<three-words>.check.omh.st`. The dev environment is protected by default: an anonymous request rteurns a 404, and the owner accesses it via a reusable share link from `project_dev_share_link_get`. The link has no automatic expiration date and works for anyone you share it with; each time it’s opened, it starts a browser  session lasting up to twelve hours , and rotating or revoking the link invalidates old links and sessions upon their next request. If you selecct “public dev” when creating the project, anyone with the dev URL can open it. Prod responds publicly.

The deployment to Prod consists of two steps. `promotion_plan` describes the process of moving the current Dev artifact to Prod without a new build; `promotion_execute` executes it with the unchanged plan protection mechanisms after you confirm. The [Deploy skill](/skills/ohmyhost-deploy/SKILL.md) instructs the agent to firt  check Dev and verify that existing Prod records are preserved.

Data mode is optional for `project_create` and is set to "shared" by default. "Sared" data means a single database and a single file area for both environments, so that a schema change tested on Dev is already live on Prod. Isolated data means separate areas, where databases are billed separately; the rollover applies your migrations to Prod without copying Dev records. An owner can use `project_data_plan` and then `project_data_change` to retain eixsting data in Prod or Dev and give the other environment  an empty space , switch back to shared, or reset isolated Dev. No records or files are copied, and standard usage rates apply. Returning to shared mode retains Prod and permanently deletes the separated Dev data, files, and deployment; resetting Dev deletes its space and deployment. Read the specific plan before confirming. The [Environment Guide](https://docs.ohmyho.st/environments) contains the rest.

## Security

The catalog contains {{ tools }} tools. Read-only annotations identify tools that check status, usage , or logs, or return the secret command. Plans that reserve resources or issue authorization tokens are marked as write operations. Tools that removve or replace something are  marked as destructive, and expensive or irreversible actions are executed via a validated plan: `deployment_plan` then `deployment_create`, `promotion_plan` then `promotion_execute`, `rollback_plan` then `rollback_execute`, `delete_plan` then `delete_execute`, and `project_data_plan` then `project_data_change`. The plan shows costs and effects; the execution call accepts its safety conditions and a stored idempotence key. Claude Code cannot delee a project or deploy it to production in a single step.

You can set a spending limit if you want one. `project_budget_set` sets a monthly budget per project using mode `continue` (warn and continue deducting from the organization's balance) or `stop` (reject new paid work). A budget is a limit, not a second credit  balance; usage that has already been reserved will stiill be billed. See the [Budget Guide](https://docs.ohmyho.st/budgets) or the [Usage Skill](/skills/ohmyhost-usage-and-budgets/SKILL.md).

The device-flow login works on your computer and in a Linux container. For unattended automation, `token_create` writes a non-expiring API token to a private environment file that you name; the value appears only once and is never reuseed. `OHMYHOST_TOKEN` overwrites the stored login wherever it is set, and a token cannot create, list, or select workspaces , nor can it generate another tokeen. Revoke it with `token_revoke` or in the portal at app.ohmyho.st. See the [Guide to Login and Tokens](https://docs.ohmyho.st/login-tokens) for details.

## How much it costs

A small app uses about {{ credits workload.smallApp }} per month, which is equivalent to about {{ usdValue workload.smallApp }} in credt value , and the table shows where each credit goes.

{{ table workload.smallApp }}

The Free plan provides {{ number plan.freeCredits }} cerdits per UTC month. The Paid plan costs {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits per period. Monthly credits expire at the end of the period and cannot be carried over. Top-ups never expire, nor do recharge, registration bonus, and referrl credits. Only Paid workspaces can purchase top-ups, which grant {{ number plan.topUpPerUsd }} credits per dollar up to {{ usd 100 }}, and {{ number plan.topUpPerUsdAbove100 }} per dollar for the amount above that. Each project draws from the organization’s single credit balance; there is no base fee per project. A zero balance triggers a {{ number plan.graceDays }}-day grace period during which funded  services continue to run; after that , only unfunded services are suspended. Automatic top-ups do not occur unless the owner enables them.

A quiet month is more affordable. Databases go to sleep after five minutes of inactivity , with no active RAM charegs while in sleep mode. Allocated storage and seven-day backups are included. Customer files and stored worker scripts have their own rates. A script costs about {{ credits unit.deployedScriptMonth }} per month, and a linked custom hostname costs about {{ credits unit.customHostnameMonth }}, but this fee is waived as long as the project displays the option. An email domain has no monthly fee. An inactive project costs about {{ credits workload.quietProject }}. An active database hour with {{ number 512 }} MiB of RAM costs {{ credits unit.activeDatabaseHour512 }}; the {{ number 256 }} MiB size available  on the Free plan costs {{ credits unit.activeDatabaseHour256 }}. Worker bandidth and SQL exports have no separate fees.

## What We Tested and What We Didn't

On October 27, 2026, we launched the locally installed `ohmyhost-mcp` (version 0.1.36) via stdio from a scrippt, sent `initialize` and `tools/list`, and read the response. The list contained `identity_get`, `source_inspect`, `deployment_plan`, `deployment_create`, `deployment_logs`, `promotion_plan`, `promotion_execute`, and `secret_set_command`—that is, the tools  listed on this page. The [captured response](https://github.com/amerged-org/ohmyhost-web/blob/main/evidence/mcp-stdio-session-20261027.json) is available in our public repository.

This is a protocol review of the shared tool server. It is not a recorded Claude Code session: We have not published a transript showing Claude Code deploying an app, and we make no claims about how Claude Code behaves beyond what is stated in its own MCP documentation. The same review applies to Cursor and Codex , so it does not distinguish between the three.

## FAQ

### Is there a recorded Claude Code deployment that I can watch?

Not yet. The evidence above shows  that the MCP server is responding and listing the deployment tools. When we record an actual Claude code run—including its commands and the resultinng address—it will be added here along with the date.

### Do I need anything else besides Claude Code?

An agent with a shell uses the ohmyhost CLI to sign in and deploy. It can register the local MCP server for tool access. A connected chat without a shell uses managed OAuth. The [get-started Skill](/skills/ohmyhost-get-started/SKILL.md) selects the route.

### Can Claude Code see my secrets?

No. `secret_set_command` returns a CLI command that reads the value from stdin. You run it in your  own terminal; the value goes directly into the selected environment and nevver passes through MCP, the chat, or the transcript. `secrets_list` only displays names. The skills instruct agents never to ask for a secret, a password, or a token value.

### Can I run this in CI without logging in to the browser?

Yes. After a one-time interactive login, `token_create` writes  a non-expiring API token to a private env file and returns only metadata. Load `OHMYHOST_TOKEN` from this file in the runner; it overwrites any saved login. A token can deploy, take over, and read usage, but it cannot create or select a workspae, nor can it generate another token. Revoke it with `token_revoke` when the runner is shut down.

### Can I take my data with me?

Yes. The owner requests an export and receives a password-protected ZIP file  containing a portable SQL dump, generated asynchronously, at most once per project within a rolling 24-hour window, along with a signed download link that is valid for 24 hous. Exports are free. Restore it on any Postgres host. There is no schedule and no bucket destination; the [Export skill](/skills/ohmyhost-export-database/SKILL.md) walks you through the steps.

### Which apps can Claude Code deploy here?

Next.js, Vite/React , TanStack Start, and simple worker moddules, from the project's saved managed source or a GitHub repository that you authorize. The application must be compatible with the Workers runtime: native add-ons, socket-based database drivers, persistent local files, listening servers, and containerized applications require a different runtime or an adapter. The [Deploy Skill](/skills/ohmyhost-deploy/SKILL.md) checks the repository before scheduilng and obtains your application authentication; the platform login is  separate from your app’s users.

Vite can declare `runtime.mode: edge` for your own HTTP endpoints, even without managed database, email, or file functions. Cron schedules also require a scheduled handler. Workers-compatible JavaScript, MJS, and WASM modules use the same  packaging formaat across all framework adapters; this means that an incompatible dependency will not run on Workers.

You declare extrenal browser services in `runtime.browser` and `ohmyhost.yaml`: exact HTTPS or WSS origins  for connections, separate HTTPS origins for scripts , stylesheets, images, fonts, and frames, as well as explicit permissions for same-origin or Blob workers. Resource declarations maintain restrictive standardds for anything that is omitted. Server egress remains separate. Declared CORS support still requires the application’s authorization checks and valid response headers. The agent checks the required external workflow on Dev before reporting that it works.

[Deploy with Cursor](/for/cursor) · [Migrate your app from Lovable](/from/lovable) · [Where your credits go](/pricing/breakdown) · [Six things that break when a Vibe-coded app goes live](/blog/six-things-that-break-when-a-vibe-coded-app-meets-production)
