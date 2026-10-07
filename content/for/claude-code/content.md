# Deploy a Claude Code app in one prompt

Paste one prompt into Claude Code and it deploys your app from its current managed or GitHub source over MCP: it saves or links the source, plans the build, sets secrets and returns a live URL. Free is {{ number plan.freeCredits }} credits a month; Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits shared by every project. A small app for one month uses about {{ credits workload.smallApp }}.

{{ figure flow.claude-code }}

## Paste this prompt

Open your project in Claude Code and paste this. It tells the agent where the instructions live and what it may do. Nothing else is needed on the first run.

```text
{{ prompt }}
```

## How to deploy with Claude Code

1. Register the MCP server once: `claude mcp add ohmyho -- ohmyhost-mcp`. The [get-started Skill](/skills/ohmyhost-get-started/SKILL.md) adds `--scope user` and `--env OHMYHOST_ENVIRONMENT=production`; the [CLI and MCP guide](https://docs.ohmyho.st/agents/mcp) has the archive to install first. Open `/mcp` in Claude Code and check that the ohmyho server lists its tools.
2. Paste the prompt above. Claude Code reads llms.txt and the Skill, runs `ohmyhost whoami`, confirms the intended workspace and reads any existing project/source before continuing.
3. Confirm the sign-in link. With no session, Claude Code prints a link and a short code such as ABCD-EFGH. The page shows the same code; sign in or sign up there and tell the agent when you are done. The code lives a few minutes, so a fresh one is normal.
4. Review the deployment plan. `deployment_plan` lists the build it will reserve, the secret names it needs, the callback URLs your auth provider wants and any blocker in the repository. You say go, and `deployment_create` starts the build.
5. Verify the URL. Dev is protected by default, so Claude Code opens it through your reusable Dev share link (or directly, if you chose public Dev), tests login and one read/write flow, and reports the URL and the deployed commit. Ask for Prod once you have seen it work.

These examples use the local stdio client. When the client exposes authenticated remote MCP, follow the [get-started Skill](/skills/ohmyhost-get-started/SKILL.md) for OAuth and explicit project/preview/publishing grants; discover its actual tools instead of assuming this local catalog. Private application values then use `secret_input_request` and its same-account portal link rather than local stdin. A new app developed entirely in chat starts with managed versions. This describes the supported transport contract, not a claim that a particular native chat UI has completed acceptance.

## What Claude Code does next

This is the call order behind steps 2 to 5. Every name is a real tool in the [{{ tools }}-tool catalog](https://docs.ohmyho.st/mcp-tools).

- `identity_get` confirms who is signed in and which workspace is selected. It says nothing about your app's users; those stay with your own auth provider.
- `organization_list` shows your workspaces. With exactly one, it is selected already.
- Reuse the selected existing project. `project_create` makes a new project with a region and a data mode only when requested. The API default is US and shared data; the Skill recommends isolated data.
- Read `source_get` and keep the current binding. Managed source uses `source_publish` to save current local files; the selected GitHub route uses `source_link` for an authorized repository. Saving/linking source never starts a build.
- `deployment_plan` inspects the exact saved managed or pushed GitHub commit, reserves the build hold and returns costs, requirements and effects.
- `deployment_create` starts the reviewed plan with a saved idempotency key, so a retry after a dropped connection cannot start a second build.
- `operation_get` reports the phase and the next poll interval. Claude Code waits instead of building again.
- `project_status` returns both environment IDs and the deployment URLs.

Secrets go through `secret_set_command`. It returns a stdin-only CLI command; you run it in your own terminal and the value never enters MCP or the chat. A customer domain goes through `domain_paid_plan`, which returns the DNS records, and `domain_paid_apply`, which activates the hostname you named. Both need Paid, or on Free a project that shows the opt-in “Powered by ohmyho.st” flag, and both answer `production_deployment_required` without changing anything until Prod has an active deployment.

## What it asks you

Claude Code asks for the decisions this app needs, preserving any choices already made. For an unbound local checkout without GitHub, choose once between managed versions and GitHub setup; an explicit choice skips the question.

- Sign-in. One browser page, with the code shown in the chat. Sign-up is open; there is no waitlist.
- GitHub authorization, when GitHub is the selected source. An Owner or Admin opens one `authorization_url` and picks the repositories the ohmyho.st App may read. A repository you did not select is added later from the same settings page, never with a pasted token.
- Region, once, and an initial data mode. US is the default; EU places the database, files, build sandbox and build objects in the EU at the same prices. The region cannot change after creation. Data mode is optional and defaults to shared; an Owner can change it later through a reviewed plan. Transactional mail is sent and processed in the US either way.
- Secrets. The agent names each secret and hands you a command. You paste the value into your terminal, not into the chat.
- Domain decisions. A custom hostname needs Paid and uses credits; on a project that shows the opt-in “Powered by ohmyho.st” flag it also works on Free and uses no domain credits. Claude Code shows the CNAME and validation records, or offers a scoped Cloudflare DNS authorization when the zone is on Cloudflare. Until DNS is ready, the project answers on its platform hostname.

## Dev and Prod

Every project gets a Dev and a Prod environment on `<three-words>.check.omh.st`. Dev is protected by default: an anonymous request gets a 404, and the owner opens it through a reusable share link from `project_dev_share_link_get`. The link has no automatic expiry and works for everyone you give it to; each opening starts a browser session of up to twelve hours, and rotating or revoking the link cuts off old links and sessions on their next request. If you choose public Dev when the project is created, anyone with the Dev URL can open it. Prod answers publicly.

Promotion is two calls. `promotion_plan` describes the move of the current Dev artifact to Prod without a rebuild; `promotion_execute` runs it with the unchanged plan guards after you confirm. The [deploy Skill](/skills/ohmyhost-deploy/SKILL.md) tells the agent to verify Dev first and to test that existing Prod rows survive.

Data mode is optional at `project_create` and defaults to shared. Shared data means one database and file area for both environments, so a schema change tested on Dev is already live for Prod. Isolated data means separate areas, with databases metered separately; promotion applies your migrations to Prod without copying Dev records. An Owner can use `project_data_plan` then `project_data_change` to keep existing data with Prod or Dev and give the other an empty area, return to shared, or reset isolated Dev. No records or files are copied and ordinary usage prices apply. Returning to shared keeps Prod and permanently deletes the separate Dev data, files and deployment; resetting Dev deletes its area and deployment. Read the concrete plan before confirming. The [environments guide](https://docs.ohmyho.st/environments) has the rest.

## Safety

The catalog has {{ tools }} tools. Read-only annotations identify tools that inspect status, usage or logs, or return the secret command. Plans that reserve resources or issue confirmation tokens are marked as writes. Tools that remove or replace something are marked destructive, and expensive or irreversible actions use a reviewed plan: `deployment_plan` then `deployment_create`, `promotion_plan` then `promotion_execute`, `rollback_plan` then `rollback_execute`, `delete_plan` then `delete_execute`, and `project_data_plan` then `project_data_change`. The plan shows the cost and effect; the execute call takes its guards and a saved idempotency key. Claude Code cannot delete a project or promote to Prod in one step.

Spending has a ceiling if you want one. `project_budget_set` sets a monthly budget per project with mode `continue` (warn and keep drawing from the organization balance) or `stop` (reject new billable work). A budget is a limit, not a second wallet; usage already reserved still settles. See the [budgets guide](https://docs.ohmyho.st/budgets) or the [usage Skill](/skills/ohmyhost-usage-and-budgets/SKILL.md).

Tokens are optional. The browser login is enough for Claude Code on your machine. For a CI runner or a second machine, `token_create` writes a non-expiring API token to a private env file you name; the value appears once and never returns. `OHMYHOST_TOKEN` overrides the saved login wherever it is set, and a token cannot create, list or select workspaces or mint another token. Revoke it with `token_revoke` or in the portal at app.ohmyho.st. Details in [login and tokens](https://docs.ohmyho.st/login-tokens).

## What it costs

A small app for one month uses about {{ credits workload.smallApp }}, about {{ usdValue workload.smallApp }} of credit value, and the table shows where each credit goes.

{{ table workload.smallApp }}

Free gives {{ number plan.freeCredits }} credits per UTC month. Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits per period. Monthly credits expire at period end without rollover. Paid-only top-ups carry over until downgrade to Free and grant {{ number plan.topUpPerUsd }} credits per dollar up to {{ usd 100 }} and {{ number plan.topUpPerUsdAbove100 }} per dollar for the part above. Every project draws from the organization's one balance; there is no per-project base fee. A zero balance starts a {{ number plan.graceDays }}-day grace period in which funded services keep running; afterwards only unfunded services suspend. Automatic recharge stays off unless the Owner turns it on.

A quiet month is cheaper. Idle database compute suspends; what remains is retained storage at {{ rate neon.storage.root }}, the deployed script at about {{ credits unit.deployedScriptMonth }} a month and a linked custom hostname at about {{ credits unit.customHostnameMonth }} a month, nothing while the project shows the “Powered by ohmyho.st” flag. A mail domain has no monthly fee. {{ text workload.quietProject.name }} comes to about {{ credits workload.quietProject }}. Requests are {{ rate wfp.requests }}; Workers bandwidth is not charged and SQL exports are free. One active hour on the Paid standard {{ value profile.standard.cu }} CU database is about {{ credits unit.activeDatabaseHourStandard }}.

## FAQ

### Do I need anything besides Claude Code?

Two local pieces: the ohmyhost CLI and the ohmyhost-mcp server, both from the archive linked in the [CLI and MCP guide](https://docs.ohmyho.st/agents/mcp). These local stdio examples run on Node.js on your machine. A client with an authenticated remote connection follows the separate OAuth route in that guide; no native UI availability is implied here. Claude Code starts the server itself once it is registered. If they are missing or old, the first prompt installs the published archive and asks you to reload the MCP connection.

### Does Claude Code see my secrets?

No. `secret_set_command` returns a CLI command that reads the value from stdin. You run it in your own terminal, the value goes straight to the chosen environment, and it never passes through MCP, the chat or the transcript. `secrets_list` shows names only. The Skills tell the agent never to ask for a secret, a password or a token value.

### Can I run this in CI without the browser login?

Yes. After one interactive login, `token_create` writes a non-expiring API token to a private env file and returns only metadata. Set `OHMYHOST_TOKEN` from that file in the runner; it overrides any saved login. A token can deploy, promote and read usage, but it cannot create or select a workspace or mint another token. Revoke it with `token_revoke` when the runner goes away.

### What does a project cost when nobody visits it?

{{ text workload.quietProject.name }} comes to about {{ credits workload.quietProject }}: two build minutes, a few thousand requests, one active database hour, a fifth of a gigabyte of storage and the deployed script. Idle database compute suspends; storage at {{ rate neon.storage.root }} and the script at about {{ credits unit.deployedScriptMonth }} a month keep using credits. Workers bandwidth is not charged.

### Can I leave with my data?

Yes. The owner asks for an export and gets a password-encrypted ZIP with a portable SQL dump, built asynchronously, at most once per project per rolling 24 hours, with a signed download link that lasts 24 hours. Exports are free. Restore it on any Postgres host. There is no schedule and no bucket destination; the [export Skill](/skills/ohmyhost-export-database/SKILL.md) walks through the steps.

### Which apps can Claude Code deploy here?

Next.js, Vite/React, TanStack Start and plain Worker modules, from the project's saved managed source or a GitHub repository you authorize. The application must fit the Workers runtime: native addons, socket-based database drivers, persistent local files, listening servers and container applications require a different runtime or an adapter. The [deploy Skill](/skills/ohmyhost-deploy/SKILL.md) checks the repository before planning and preserves your application auth; the platform login is separate from your app's users.

Vite can declare `runtime.mode: edge` for its own HTTP endpoints even without managed database, mail or file capabilities. Cron schedules additionally require a scheduled handler. Workers-compatible JavaScript, MJS and WASM modules use the same packaging contract across the framework adapters; that does not make an incompatible dependency run on Workers.

Declare external browser services in `runtime.browser` in `ohmyhost.yaml`: exact HTTPS or WSS origins for connections, separate HTTPS origins for scripts, styles, images, fonts and frames, and explicit permissions for same-origin or blob workers. Resource declarations retain restrictive defaults for everything omitted. Server egress remains separate. Declared CORS support still needs the application's authorization checks and valid response headers. The agent verifies the required external flow on Dev before reporting that it works.

[Deploy from Cursor](/for/cursor) · [Bring your app from Lovable](/from/lovable) · [Where your credits go](/pricing/breakdown) · [Six things that break when a vibe-coded app meets production](/blog/six-things-that-break-when-a-vibe-coded-app-meets-production)
