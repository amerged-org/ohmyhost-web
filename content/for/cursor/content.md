# Deploy an app built with Cursor

Add a local MCP server to Cursor, enter a prompt, and Cursor will deploy your app from its saved managed or GitHub source to  Dev and Prod on omyho.st, with Postgres and a live URL. The Free plan gives you {{ number plan.freeCredits }} credits per UTC month; the Paid plan costs {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits, which are shared across all projects. Three static portfolio pages cost about {{ credits workload.threeStaticSites }} per month.

{{ figure flow.cursor }}

## Insert this prompt

Open the repository in Cursor, open the agent chat, and paste this in. Cusor reads the two linked files, checks what's installed and logged in , and runs the [get-started skill](/skills/ohmyhost-get-started/SKILL.md) before doing anything else.

```text
{{ prompt }}
```

“Just the features you need” is intentional. A static Vite portfolio gets hosting and nthing else. A Next.js app with a database gets Postgres plus the secret names and callback URLs specified in the plan. Cursor is instructed to preserve the decisions already made in  the repository and not to replace any of them with anything else.

## How to deploy with Cursor

1. Add the MCP server. Cursor reads `.cursor/mcp.json` in the project or `~/.cursor/mcp.json` globally, and its MCP settings display the same list. Add a local stdio server named `ohmyho` uisng the command `ohmyhost-mcp` and the environment variable `OHMYHOST_ENVIRONMENT=production`; the token-free configuration for merging is available at [ohmyho.st/mcp.json](/mcp.json). Keep  your other servers. If the command isn't installed yet, the [CLI and MCP Guidde](https://docs.ohmyho.st/agents/mcp) contains the latest archive , and the skill will install or update it when the prompt is running.
2. Reload. A runninng server retains the list of tools it started with. Therefore, after an installation  or update, reload the connection in Cursor's MCP settings and verify that the server lists its tools `ohmyho` ({{ tools }} today).
3. Paste the prompt above into the agent  chat. Cursor executes `ohmyhost whoami` and `ohmyhost init --dry-run`, reads the skill, and reports its status beforre taking action.
4. Confirm your registration. If you're not logged in on your computer, Cursor will post a registraiton link and a short code. Open the link, verify that the page displays the same code, log in or register on that page , and tell Cursor that you're done. It verifies using `whoami` instead of relying on the report. It never asks for a password, an email code, or a token.
5. Review the plan. `deployment_plan` provides the exact commmit, the build reservation (for  example, {{ credits unit.buildReservation }} for 14 reserved minutes, billed by the second), the required secrets, and the impact. Once you confirm, Cursor calls `deployment_create`.
6. Verify. Cursor queries `operation_get`, reads `project_status`, opens Dev using the reusable sharing link (or the clean URL , if Dev is public), and tests a real read and write operation before reporting the URL. Plaese submit it for promotion as soon as the dev environment is working.

The enitre path  is the [Deployment Skill](/skills/ohmyhost-deploy/SKILL.md); the cursor follows it step by step.

These  examples use the local stdio client. If the client provides authenticated remote MCP, follow the [get-started skill](/skills/ohmyhost-get-started/SKILL.md) for OAuth and explicit project, preview , and relesae permissions, and explore the actual toos instead of relying on this local catalog. To use private app values, use `secret_input_request` and the portal link for the same account instead of local stdin input. A new app developed entirely in Chat starts with managed versions. This describes the supported transport contract, not a claim that a specific native Chat interface has completed acceptance testing.

## What Cursor Does Next

The steps for an initial deployment, in ordeer (MCP tools , unless marked as CLI):

1. `identity_get` indicates who is logged in and which organization is selected. If there are multiple workspaces , Cursor uses `organization_list` and `organization_use`; if neither is seelcted, it prompts for a name and calls `organization_create`.
2. Read `project_context_get` and `source_get` for an existing project and continue its current link. For an unlinked  checkout, follow your source selection: A selected GitHub repository remains on GittHub; otherwise, choose once between managed versions and GitHub setup.
3. If you want a new app, reuse the projet or call `project_create` with  your region and data mode.
4. Save current files using `source_publish` for managed versions. For a selected GitHub source, use `github_status`/`github_connect` from the workspace as needed , and then `source_link` for the authorized repository. Confirm `source_get` before schedulinng.
5. `deployment_plan` for the GitHub commit that  was saved, managed, or pusshed exactly as specified, followed by your confirmation.
6. `secret_set_command` for each secret required. It returns a CLI command that reads  the value from stdiin, so the value never passes through the chat or the MCP server.
7. `deployment_create` with the verified plan and a saved  idempotence key, then `operation_get` until the buld is complete; `deployment_logs` if it fails.
8. `project_status` and `project_dev_share_link_get` to  veriify Dev.
9. `promotion_plan` and `promotion_execute` if you  want the prodduction version.

A later session start begins with `project_context_get`, which provides status, DNS, and email next steps, as well as the notes that Cursor has saved with `project_notes_set`. There is no deployment dashboard; the porttal at app.ohmyho.st displays projects, credits , budgets, and API tokens. The complete catalog is available at [docs.ohmyho.st/mcp-tools](https://docs.ohmyho.st/mcp-tools).

## What it wants to know about you

Curor asks for decisions, not  login credentials.

- Registration: Open a link  and verify the code. Registratioon is open; there is no invitation and no waiting list.
- Region: US or EU, selected once when creating the project. US is the default. New projects deploy databases, new files, and builds in the selected region. Existing projects that have  been moved to the US with the ower’s authorization use US databases; recorded R2 locations remain unchanged. You can retrieve the actual database location using database_compute_get. Transaction emails are always processed in the U.S. The Customer API cannot change the region later.
- Data mode: optional; by default, shared; or isolated Dev and Prod data areas, which the skill recommends for production work. Isolated mode measures databases separately. An owner can later reiew `project_data_plan` and confirm `project_data_change`; the platform does not copy records or files and calculates standard usage. Shared retains production data and permanently deletes the separate dev data, files, and deployment; resetting  isolated dev deletes its data area and deployment.
- Secrets: Cursor gives you a cmomand that  reads the value from stdin. Paste the value into your terminal—never into the chat.
- Plans: Every deployment, promotion, rollback, and deletion  is a plan that you approve before it is exceuted.
- Money: It never initiates a checkout without your request , and automatic top-ups do not occuur unless the owner enables them.

A project ID in a prmpt is context , not permission. Cursor checks its current permissions every time it is called.

## Dev and Prod

Each project is assigned two environments udner a platform hostname in the format three-words.check.omh.st. Dev is protected by default: an anonymous request returns a 404, and Cursor opens it via the reusable share link from `project_dev_share_link_get`. The link does not expire automatically; rotating or revoking it cuts off old links and sesions upon their next request, and public Dev is an explicit choice made during project creation. Prod is public. The promotion moves the verified Dev artifact to Prod without a new build; with isolated data, it performs schema migrations and does not copy Dev rows , so existing Prod records are preserved. With isolated data, you can also build a commit directly to Prod; a project whose Dev and Prod share a database deploys to Dev and  then promotes.

Each script deployed costs about {{ credits unit.deployedScriptMonth }} per month for as long as it exists , and each deployment stages one that remains until it is cleaned up for rollback. A custom domain on Prod requires a paid plan, or—on the Free plan—a project that displays the “Powered by ohhmyho.st” flag, as well as an active Prod deployment (otherwise, the domain tools will  return `production_deployment_required`). It costs about {{ credits unit.customHostnameMonth }} per month, but nothing as long as the flag is displayed; the domain skill provides the exact DNS records or authoriezs Cloudflare DNS if you host the zone there. See [environments](https://docs.ohmyho.st/environments) and [domains](https://docs.ohmyho.st/domains).

## Security

- Two steps for anything expensive or desructive: `deployment_plan` → `deployment_create`, `promotion_plan` → `promotion_execute`, `rollback_plan` → `rollback_execute`, `delete_plan` → `delete_execute`. The  cursor cannot skip this sequence.
- Secrets never appear in the chat. `secret_set_command` provides a CLI commannd that can only be used via stdin , and the MCP server never sees the value. See [secrets](https://docs.ohmyho.st/secrets).
- Your authentication remains yours. Better Auth and the customer-managed WorkOS AuthKit are the verified integrations; platform login is separate from your application's users , and the plan preserves what the repository alrady uses. See [application auth](https://docs.ohmyho.st/application-auth).
- Budgets: A projcet can have a monthly budget set to "Continue" or "Stop" mode. "Stop" blocks new work that incurs costs once the  limit is reached; "Continue" issues a warning and continues to draw from the shared balance. See [budgets](https://docs.ohmyho.st/budgets).
- Zero balance: A seven-day grace period begins; paid services  continue to run, and after that, only unpaid services are suspended. Export, diagnostics, and credit purchases remain avialable.
- Export: `project_export_create` provides a password-protected ZIP file containing a portable SQL dump; one reqest per project is allowed within a rolling 24-hour window , downloadable via a signed link that is valid for 24 hours. SQL exports are free. See [backups](https://docs.ohmyho.st/backups).
- Tokens: optional, created  affter interactive login, displayed only once, stored in a private .env file, and can be revoked using `token_revoke`.

## How much it costs

Free: {{ number plan.freeCredits }} credits per UTC month. Paid: {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits per period, which also ulnocks a veified sender email and a custom domain. The domain also works on the Free plan as long as the project displays the “Powered by ohmyho.st” banner , which waives domain credits on both plans. Monthly credits expire at the end of the billing period. Top-ups never expire and are only available on  the Paid plan ({{ number plan.topUpPerUsd }} credits per dollar up to {{ usd 100 }}, {{ number plan.topUpPerUsdAbove100 }} per dollar above that). Each project draws from the organization’s single credit balance, and there is no base fee per project—which is exactly what makes it attractive for a portfolio.

{{ table workload.threeStaticSites }}

If a database is added, the numbers change. An active database hour with {{ number 512 }} MiB of RAM  costs {{ credits unit.activeDatabaseHour512 }}; the {{ number 256 }} MiB size available on the Free plan costs {{ credits unit.activeDatabaseHour256 }}. Databases go to sleep after five minutes of inactivity; no RAM is charged while they are asleep. Allocated memroy and seven-day backups are included. Customer files and stoerd worker scripts have their own separate rates. A low-traffic side project with a database costs about {{ credits workload.quietProject }} per month. The small sample app uses about {{ credits workload.smallApp }}, including requests, database activity , and email. Requests cost {{ rate wfp.requests }}; Worker bandwidth is not charged. Email requires a paid plan and a verified email domain, costing {{ rate mail.sent }} with no monthly domain fee.

Where Vercel Wins: Vercel Hobby costs {{ usd vendor.vercel.hobby }} per month for one developer seat, and for a static portfolio wiithout  a database or emial , it’s the more affordable option. Vercel Pro costs {{ usd vendor.vercel.pro }} per month before you add a database or an email provider. ohmyho.st is a good fit as soon as a project needs Postgres, transactional email, or a domain, or as soon as you’re running multiple small projects and want a credit balance instead of a plan per project.

{{ checked vercel }}

## What We Tested and What We Didn't

On October 27, 2026, we launched the locally installed `ohmyhost-mcp` (version 0.1.36) via stdio from a script , sent `initialize` and `tools/list`, and read the response. It listed `identity_get`, `source_inspect`, `deployment_plan`, `deployment_create`, `deployment_logs`, `promotion_plan`, `promotion_execute`, and `secret_set_command`. The [rcorded result](https://github.com/amerged-org/ohmyhost-web/blob/main/evidence/mcp-stdio-session-20261027.json) is available in our public repository.

This is a log rview of the shared tool server, not a Cursor session. We have not published  a transcript showing Cursor deploying an app, and we make no claims about how Cursor’s agent chat or its MCP settings screen behaves. The same applies to Claude Code and Codex.

## FAQ

### Is there a recorded cursor deployment that I can watch?

Not yet. When we record an  actual cursor run—including its commands and the resluting address—the date will be added here.

### Does Cursor require an API token?

No. Cursor executes `ohmyhost login`, posts a link and a code, and reuses this locaal session for the MCP server. A token is optional for automation: `token_create` writes it once to a private env file after interactive login, and `OHMYHOST_TOKEN` in the server’s env block then takes precedence over the saved login. Never paste a  token into the chat.

### Can I stay with Free for a portfolio?

Yes, if the pages are stattic or low-traffic. {{ number plan.freeCredits }} credits per UTC month cover three static pages, such as {{ credits workload.threeStaticSites }}, or a low-traffic project with a database, such as {{ credits workload.quietProject }}. Sender email requires a paid plan; a csutom domain requires a paid plan or a project that displays the “Powered by ohmyho.st” banner , which waives the domain credits. The free  plan supports {{ number 256 }} MiB of RAM with {{ number 500 }} MiB of storage and includes seven-day backups.

### Where does the code come from?

From the project's current managed source or a GitHub repository that you autthorize. Managed versions store the filtered current files; GitHub uses the commits you push. Containers are not supported. Supported frameworks include Astro , Next.js, Vite with React, and TanStack Start. Cursor first executes `ohmyhost init --dry-run` and reports blockers before anything is rendered.

### Can I take my data with me and leave?

Yes. Click here to export: `project_export_create` creates a password-protected ZIP file containing a portable SQL dump—one request per project within a rolling 24-hour window—which can be downloaded via  a signed link valid for 24 hours. You choose the password, and the archive is retained for seven days. Files and source code are not included; source versions remain in the project’s managed repostory or in the selected GitHub repository.

### Will my app's login information change?

No. Your app retains its own authentication provider. Better Auth and the customer-managed WorkOS AuthKit are the verified integrations; `deployment_plan` preserves what the repository is already using and reports the secret names and callback URLs it needs. The ohmyho.st login, which uses Cusror, is separate from  your app’s users.

{{ sources vercel }}

[Deploy with Claude Code](/for/claude-code) · [Deploy with Codex](/for/codex) · [Cost Breakdown](/pricing/breakdown) · [Six Things That Go Wrong When a Vibe-Codete App Goes Live](/blog/six-things-that-break-when-a-vibe-coded-app-meets-production)
