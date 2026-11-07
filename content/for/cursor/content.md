# Deploy an app built with Cursor

Ask Cursor to build or update the app from its saved managed or GitHub source, then inspect an exact-commit preview before choosing a deployment. Free includes {{ number plan.freeCredits }} credits per month; Paid costs {{ usd plan.paidUsd }} for {{ number plan.paidCredits }} credits. Projects share the workspace balance. Preview use consumes those credits; deployment remains an explicit step.

**Save a Git commit → open a temporary preview → choose an explicit deployment target.**

## Insert this prompt

Open the repository in Cursor, open the agent chat, and paste this in. Cusor reads the two linked files, checks what's installed and logged in , and runs the [get-started skill](/skills/ohmyhost-get-started/SKILL.md) before doing anything else.

```text
Read https://ohmyho.st/llms.txt and https://ohmyho.st/skills/ohmyhost-get-started/SKILL.md. Continue this app in its existing workspace and saved managed or GitHub source. Save a Git commit and open a temporary preview of that exact commit. Keep my existing project decisions and use only the capabilities the app needs. Show the preview's real data environment and verify any form submission is actually stored. Ask before changing schema unless I already authorized it. Deploy Dev or Prod only when I request that target.
```

“Just the features you need” is intentional. A static Vite portfolio gets hosting and nthing else. A Next.js app with a database gets Postgres plus the secret names and callback URLs specified in the plan. Cursor is instructed to preserve the decisions already made in  the repository and not to replace any of them with anything else.

## How to deploy with Cursor

1. Add a local stdio server named `ohmyho` using `ohmyhost-mcp` in the project or global MCP configuration, preserving your other servers. Follow the [MCP guide](https://docs.ohmyho.st/agents/mcp) and reload the connection after a client update.
2. Verify `identity_get` or `ohmyhost whoami --json`, select the intended workspace and read `project_context_get` before changing an existing project. A new app can use managed source without GitHub.
3. Save the intended files as an immutable Git commit. Preserve the project's existing managed or GitHub source binding and wait for its actual save/source operation to finish.
4. Call `preview_create` with that exact commit and one saved idempotency key. Free uses Prod data; Paid may choose Dev (the default) or Prod. Poll `preview_get` while queued or starting. For sleeping, request its original returned URL once to wake it, then observe that same preview until ready or terminal and verify the app. Status reads alone do not wake compute; a temporary {{ number 503 }} during wake is pending. Keep the original expiry and do not create a replacement just to wake it.
5. Verify navigation, applicable login and a real read/write. If schema is missing, review the selected commit and real data environment before an authorized `preview_migrations_apply`; follow its original operation. A confirmation animation alone does not prove storage.
6. When deployment is requested, name the target explicitly: Prod on Free, Dev or Prod on Paid. Use `deployment_plan` and `deployment_create`, keep the accepted key and observe `operation_get`. A preview does not deploy either environment automatically.

## What Cursor Does Next

For an authoring request, Cursor follows the existing project context and saved source, saves one immutable Git commit, calls `preview_create`, then polls `preview_get` while queued or starting. If sleeping, it requests the original returned URL once, observes that same preview until ready or terminal and verifies the app; status reads do not request wake or renew expiry. The response names the selected real data environment, absolute expiry and server-computed `compute_quote`. Queued work is not a working link. Each project has one active preview. A different commit or data target replaces the current preview; repeating the same live commit and target keeps its original deadline.

If schema work is needed, Cursor states the exact commit and real target first, obtains approval unless already given, then calls `preview_migrations_apply` with `confirmed: true` and a saved idempotency key. The platform reads the saved migration files; the caller supplies no SQL or alternate database target. Follow the returned `operation_get` through its actual outcome.

Deployment is a later intentional action: `deployment_plan` for an explicit environment, then `deployment_create` for that exact plan and a saved key. Free chooses Prod; Paid chooses Dev or Prod. An already authorized deployment target does not need another confirmation. An unattended workflow may execute its configured targets, but an edit request alone does not authorize publication. Promotion, rollback and deletion retain their own guarded plan/execute workflows.

Use `project_context_get` when resuming and private secret inputs for the selected environment. A local agent uses stdin; connected chats use `secret_input_request` and its portal handoff. Keep values out of chat and source. [Deployment Skill](/skills/ohmyhost-deploy/SKILL.md) · [CLI and MCP guide](https://docs.ohmyho.st/agents/mcp).

## What it wants to know about you

Curor asks for decisions, not  login credentials.

- Registration: Open a link  and verify the code. Registratioon is open; there is no invitation and no waiting list.
- Region: US or EU, selected once when creating the project. US is the default. New projects deploy databases, new files, and builds in the selected region. Existing projects that have  been moved to the US with the ower’s authorization use US databases; recorded R2 locations remain unchanged. You can retrieve the actual database location using database_compute_get. Transaction emails are always processed in the U.S. The Customer API cannot change the region later.
- Data: Free previews use Prod. Paid can choose Dev or Prod and may use shared or isolated data; isolated databases consume credits separately. A later data-assignment change requires its own reviewed plan and never copies records or files.
- Secrets: Cursor gives you a cmomand that  reads the value from stdin. Paste the value into your terminal—never into the chat.
- Plans: Every deployment, promotion, rollback, and deletion  is a plan that you approve before it is exceuted.
- Money: It never initiates a checkout without your request , and automatic top-ups do not occuur unless the owner enables them.

A project ID in a prmpt is context , not permission. Cursor checks its current permissions every time it is called.

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

The earlier protocol capture below does not qualify the temporary preview or explicit preview-schema workflow. Check the installed release's actual `tools/list` and the linked Skills; no new hosted or native-client acceptance is claimed by that historical record.

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

From the project's current managed source or a GitHub repository that you autthorize. Managed versions store the filtered current files; GitHub uses the commits you push. Custom container images are not a supported app source. Supported frameworks include Astro , Next.js, Vite with React, and TanStack Start. Cursor first executes `ohmyhost init --dry-run` and reports blockers before anything is rendered.

### Can I take my data with me and leave?

Yes. Click here to export: `project_export_create` creates a password-protected ZIP file containing a portable SQL dump—one request per project within a rolling 24-hour window—which can be downloaded via  a signed link valid for 24 hours. You choose the password, and the archive is retained for seven days. Files and source code are not included; source versions remain in the project’s managed repostory or in the selected GitHub repository.

### Will my app's login information change?

No. Your app retains its own authentication provider. Better Auth and the customer-managed WorkOS AuthKit are the verified integrations; `deployment_plan` preserves what the repository is already using and reports the secret names and callback URLs it needs. The ohmyho.st login, which uses Cusror, is separate from  your app’s users.

{{ sources vercel }}

[Deploy with Claude Code](/for/claude-code) · [Deploy with Codex](/for/codex) · [Cost Breakdown](/pricing/breakdown) · [Six Things That Go Wrong When a Vibe-Codete App Goes Live](/blog/six-things-that-break-when-a-vibe-coded-app-meets-production)
