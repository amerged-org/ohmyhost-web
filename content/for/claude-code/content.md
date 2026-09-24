# Deploy a Claude Code app in one prompt

Paste one prompt into Claude Code and it deploys your GitHub repository to ohmyho.st over MCP: it links the repo, plans the build, sets secrets and returns a live URL. Free is {{ number plan.freeCredits }} credits a month; Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits shared by every project. A small app for one month uses about {{ credits workload.smallApp }}.

{{ figure flow.claude-code }}

## Paste this prompt

Open your project in Claude Code and paste this. It tells the agent where the instructions live and what it may do. Nothing else is needed on the first run.

```text
{{ prompt }}
```

## How to deploy with Claude Code

1. Register the MCP server once: `claude mcp add ohmyho -- ohmyhost-mcp`. The [get-started Skill](/skills/ohmyhost-get-started/SKILL.md) adds `--scope user` and `--env OHMYHOST_ENVIRONMENT=production`; the [CLI and MCP guide](https://docs.ohmyho.st/agents/mcp) has the archive to install first. Open `/mcp` in Claude Code and check that the ohmyho server lists its tools.
2. Paste the prompt above. Claude Code reads llms.txt and the Skill, runs `ohmyhost whoami`, and continues without a single question when this machine is already signed in.
3. Confirm the sign-in link. With no session, Claude Code prints a link and a short code such as ABCD-EFGH. The page shows the same code; sign in or sign up there and tell the agent when you are done. The code lives a few minutes, so a fresh one is normal.
4. Review the deployment plan. `deployment_plan` lists the build it will reserve, the secret names it needs, the callback URLs your auth provider wants and any blocker in the repository. You say go, and `deployment_create` starts the build.
5. Verify the URL. Dev is private, so Claude Code asks for a single-use link, opens it, tests login and one read/write flow, and reports the URL and the deployed commit. Ask for Prod once you have seen it work.

## What Claude Code does next

This is the call order behind steps 2 to 5. Every name is a real tool in the [{{ tools }}-tool catalog](https://docs.ohmyho.st/mcp-tools).

- `identity_get` confirms who is signed in and which workspace is selected. It says nothing about your app's users; those stay with your own auth provider.
- `organization_list` shows your workspaces. With exactly one, it is selected already.
- `project_create` makes the project with a region and a data mode. The API default is US and shared data; the Skill recommends isolated data.
- `source_link` authorizes one GitHub repository for the project. It never starts a build.
- `deployment_plan` reads the pushed commit and returns costs, requirements and effects. It is a read.
- `deployment_create` starts the reviewed plan with a saved idempotency key, so a retry after a dropped connection cannot start a second build.
- `operation_get` reports the phase and the next poll interval. Claude Code waits instead of building again.
- `project_status` returns both environment IDs and the deployment URLs.

Secrets go through `secret_set_command`. It returns a stdin-only CLI command; you run it in your own terminal and the value never enters MCP or the chat. A customer domain goes through `domain_paid_plan`, which only returns the DNS records, and `domain_paid_apply`, which activates the hostname you named. Both need Paid.

## What it asks you

Claude Code stops for five decisions and nothing else.

- Sign-in. One browser page, with the code shown in the chat. Sign-up is open; there is no waitlist.
- GitHub authorization. An Owner or Admin opens one `authorization_url` and picks the repositories the ohmyho.st App may read. A repository you did not select is added later from the same settings page, never with a pasted token.
- Region and data mode, once. US is the default; EU places the database, files, build sandbox and build objects in the EU at the same prices. The region cannot change after creation, and shared or isolated Dev/Prod data is decided in the same call. Transactional mail is sent from the platform mail region either way.
- Secrets. The agent names each secret and hands you a command. You paste the value into your terminal, not into the chat.
- Domain decisions. A custom hostname needs Paid and uses credits. Claude Code shows the CNAME and validation records, or offers a scoped Cloudflare DNS authorization when the zone is on Cloudflare. Until DNS is ready, the project answers on its platform hostname.

## Dev and Prod

Every project gets a Dev and a Prod environment on `<three-words>.check.omh.st`. Dev is private: an anonymous request gets a 404, and the owner opens it through a ten-minute single-use link from `project_dev_access_create`. Prod answers publicly.

Promotion is two calls. `promotion_plan` describes the move of the current Dev artifact to Prod without a rebuild; `promotion_execute` runs it with the unchanged plan guards after you confirm. The [deploy Skill](/skills/ohmyhost-deploy-github/SKILL.md) tells the agent to verify Dev first and to test that existing Prod rows survive.

Data mode is chosen at `project_create`. Shared data means one physical database for both environments, so a schema change tested on Dev is already live for Prod. Isolated data means two databases, metered separately; promotion applies your migrations to Prod without copying Dev records. Isolated costs more while both databases are active and is still the recommendation for anything with real users. Changing the mode later is a data migration, so decide before the first deploy. The [environments guide](https://docs.ohmyho.st/environments) has the rest.

## Safety

The catalog has {{ tools }} tools. 35 carry the MCP read-only annotation: status, usage, logs, plans and the secret command are reads that cannot change a project. 7 are marked destructive, and the expensive or irreversible actions only run as a pair: `deployment_plan` then `deployment_create`, `promotion_plan` then `promotion_execute`, `rollback_plan` then `rollback_execute`, `delete_plan` then `delete_execute`. The plan shows the cost and the effect; the execute call takes that plan and a saved idempotency key. Claude Code cannot delete a project or promote to Prod in one step.

Spending has a ceiling if you want one. `project_budget_set` sets a monthly budget per project with mode `continue` (warn and keep drawing from the organization balance) or `stop` (reject new billable work). A budget is a limit, not a second wallet; usage already reserved still settles. See the [budgets guide](https://docs.ohmyho.st/budgets) or the [usage Skill](/skills/ohmyhost-usage-and-budgets/SKILL.md).

Tokens are optional. The browser login is enough for Claude Code on your machine. For a CI runner or a second machine, `token_create` writes a non-expiring API token to a private env file you name; the value appears once and never returns. `OHMYHOST_TOKEN` overrides the saved login wherever it is set, and a token cannot create, list or select workspaces or mint another token. Revoke it with `token_revoke` or in the portal at app.ohmyho.st. Details in [login and tokens](https://docs.ohmyho.st/login-tokens).

## What it costs

A small app for one month uses about {{ credits workload.smallApp }}, about {{ usdValue workload.smallApp }} of credit value, and the table shows where each credit goes.

{{ table workload.smallApp }}

Free gives {{ number plan.freeCredits }} credits per UTC month. Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits per period. Free credits expire at month end; purchased credits never expire, and top-ups grant {{ number plan.topUpPerUsd }} credits per dollar up to {{ usd 100 }} and {{ number plan.topUpPerUsdAbove100 }} per dollar for the part above. Every project draws from the organization's one balance; there is no per-project base fee. A zero balance starts a {{ number plan.graceDays }}-day grace period in which funded services keep running; afterwards only unfunded services suspend. Automatic recharge is not enabled yet.

A quiet month is cheaper. Idle database compute suspends; what remains is retained storage at {{ rate neon.storage.root }}, the deployed script at about {{ credits unit.deployedScriptMonth }} a month and a linked custom hostname at about {{ credits unit.customHostnameMonth }} a month (Paid). A mail domain has no monthly fee. {{ text workload.quietProject.name }} comes to about {{ credits workload.quietProject }}. Requests are {{ rate wfp.requests }}; Workers bandwidth is not charged and SQL exports are free. One active hour on the Paid standard {{ value profile.standard.cu }} CU database is about {{ credits unit.activeDatabaseHourStandard }}.

## FAQ

### Do I need anything besides Claude Code?

Two local pieces: the ohmyhost CLI and the ohmyhost-mcp server, both from the archive linked in the [CLI and MCP guide](https://docs.ohmyho.st/agents/mcp). They run on Node.js on your machine; there is no hosted MCP URL to paste. Claude Code starts the server itself once it is registered. If they are missing or old, the first prompt installs the published archive and asks you to reload the MCP connection.

### Does Claude Code see my secrets?

No. `secret_set_command` returns a CLI command that reads the value from stdin. You run it in your own terminal, the value goes straight to the chosen environment, and it never passes through MCP, the chat or the transcript. `secrets_list` shows names only. The Skills tell the agent never to ask for a secret, a password or a token value.

### Can I run this in CI without the browser login?

Yes. After one interactive login, `token_create` writes a non-expiring API token to a private env file and returns only metadata. Set `OHMYHOST_TOKEN` from that file in the runner; it overrides any saved login. A token can deploy, promote and read usage, but it cannot create or select a workspace or mint another token. Revoke it with `token_revoke` when the runner goes away.

### What does a project cost when nobody visits it?

{{ text workload.quietProject.name }} comes to about {{ credits workload.quietProject }}: two build minutes, a few thousand requests, one active database hour, a fifth of a gigabyte of storage and the deployed script. Idle database compute suspends; storage at {{ rate neon.storage.root }} and the script at about {{ credits unit.deployedScriptMonth }} a month keep using credits. Workers bandwidth is not charged.

### Can I leave with my data?

Yes. The owner asks for an export and gets a password-encrypted ZIP with a portable SQL dump, built asynchronously, at most once per project per rolling 24 hours, with a signed download link that lasts 24 hours. Exports are free. Restore it on any Postgres host. There is no schedule and no bucket destination; the [export Skill](/skills/ohmyhost-export-database/SKILL.md) walks through the steps.

### Which apps can Claude Code deploy here?

Next.js, Vite/React and TanStack Start, from a GitHub repository you authorize. GitHub is the only source and there are no containers. Better Auth and customer-owned WorkOS AuthKit are the verified application-auth integrations; you keep your own auth provider, and the platform login is separate from your app's users. The [deploy Skill](/skills/ohmyhost-deploy-github/SKILL.md) checks the repository before planning.

[Deploy from Cursor](/for/cursor) · [Bring your app from Lovable](/from/lovable) · [Where your credits go](/pricing/breakdown) · [Six things that break when a vibe-coded app meets production](/blog/six-things-that-break-when-a-vibe-coded-app-meets-production)
