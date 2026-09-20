# Host a Lovable app after you export it to GitHub

Export your Lovable project to GitHub, paste one prompt into a coding agent, and ohmyho.st hosts the Vite app from that repository. Keep Supabase or import a dump into managed Postgres. Free gives {{ number plan.freeCredits }} credits a month; Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits, and a small app uses about {{ credits workload.smallApp }}.

{{ figure flow.lovable-export }}

## Export to GitHub

We like Lovable. It builds a plain Vite and React app, and that is exactly what ohmyho.st hosts. You do not rebuild anything; you move the repository. ohmyho.st's own test fixtures include a Lovable export, unchanged.

Lovable's GitHub integration keeps the project "in continuous sync with your repository", and "external platforms deploy directly from GitHub" (https://docs.lovable.dev/tips-tricks/external-deployment-hosting, read 2026-09-20). The sync runs both ways: edits you make in Lovable land in the repository as commits, and commits from your agent show up in Lovable.

Three things to do in Lovable:

1. Connect GitHub from your project's settings and let Lovable create the repository under your GitHub account.
2. Wait for the first push. Open the repository on github.com and check that `package.json`, `vite.config.ts` and a `.env` file are there.
3. Leave Lovable connected. You can keep prompting there; each change becomes a commit your agent can deploy.

GitHub is the only source ohmyho.st deploys from. Your agent asks for one authorization link (`github_connect`), you approve the repository in the browser once, and `source_link` ties it to the project. No ZIP uploads, no drag-and-drop. Details: https://docs.ohmyho.st/github.

## What breaks after export

Lovable's own guide lists the seams. Read them once so the checklist further down makes sense.

### The three VITE_ values

`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_SUPABASE_PROJECT_ID` sit in the `.env` file "in Lovable's code editor or in your synced GitHub repository", and "environment variables prefixed with `VITE_` are embedded at build time, not runtime" (docs.lovable.dev, read 2026-09-20). Because Lovable commits that `.env`, a build from your repository sees the same values. The publishable key is public by design; it belongs in the browser bundle. If you keep the same Supabase project, these three lines do not change.

### OAuth redirect URLs and Site URL

Lovable says: "If your app uses Google sign-in or other OAuth providers, add your new production domain to your authentication provider's allowed redirect URLs." For a Supabase app the place is Supabase's dashboard, Authentication → URL Configuration. Site URL is where Supabase sends people after a magic link or a password reset; Redirect URLs is the allowlist for OAuth callbacks. Both still point at your old Lovable host. Add the Dev host, the Prod host and, later, your own domain.

### Secrets

Anything private (a service role key, a Stripe secret, a third-party API key) must never carry the `VITE_` prefix; Vite would ship it to every visitor. On ohmyho.st the agent asks for the command `secret_set_command` returns, which reads the value from stdin. You paste the value into your terminal once, not into the chat. That is the one moment this move touches a terminal. Details: https://docs.ohmyho.st/secrets.

### SPA rewrites

A React app with client-side routes needs the host to "configure a fallback rewrite so all routes serve `/index.html`" (docs.lovable.dev, read 2026-09-20). Otherwise `/dashboard` works when you click there and returns 404 when you reload. After the first Dev deploy, ask the agent to open a deep link directly and reload it. If it fails, the agent adds the Vite companion that `ohmyhost init` returns; a companion deployment serves `index.html` for unknown routes. Framework notes: https://docs.ohmyho.st/frameworks/vite.

## Keep Supabase or import a dump

Two honest paths. The first is smaller.

### Keep Supabase (recommended for a first move)

Your app already talks to Supabase from the browser. Leave the database, Auth, Storage and Edge Functions where they are; ohmyho.st hosts only the frontend. Nothing about your data or your users changes, and Google login keeps its existing callback into Supabase. You keep paying Supabase whatever you pay today; Supabase Pro is from {{ usd vendor.supabase.pro }} per month. What you drop is Lovable's hosting.

### Import a dump into managed Postgres

If you want off Supabase, the agent follows the [Supabase migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md). It inventories what the app really uses: queries, RPCs, RLS assumptions, Auth sessions, Storage calls, Edge Functions, Realtime. A package name alone is not a reason to replace anything. The schema conversion takes only your application-owned `public` (and optional `private`) schema; Supabase's `auth` and `storage` schemas never enter it. So users do not come across as-is: passwords cannot be exported, and the app needs its own auth. The verified integrations are Better Auth and customer-owned WorkOS AuthKit (https://docs.ohmyho.st/application-auth); Better Auth sends mail, so it needs Paid and a verified sender domain. Budget a real afternoon, and do it after the frontend is already live.

Either way your data stays portable. An Owner can request a password-encrypted ZIP with a SQL dump (`project_export_create`): one accepted request for each project in any 24-hour window, download link valid 24 hours. SQL exports are free, even at zero credits.

{{ checked supabase }}

## Paste this prompt

Open your coding agent (Claude Code, Cursor or Codex), tell it the repository URL, and paste this. If the repository is not on your machine yet, the agent clones it.

```text
{{ prompt }}
```

What happens next, in plain words. The agent reads two pages, installs the ohmyho.st CLI and MCP server, and prints a sign-in link with a short code. You open the link in your browser, check that the page shows the same code, and sign in or sign up. The agent then asks for one GitHub authorization, reviews a deployment plan with you, and only then builds. Every expensive step is a plan you confirm: `deployment_plan` before `deployment_create`, `promotion_plan` before `promotion_execute`. You never type a command yourself except the one secret command above, and only if your app has a private key.

## How to move your app from Lovable

1. Export: connect GitHub in Lovable and let it create the repository. Confirm the first push on github.com.
2. Paste the prompt above into your agent. Sign in through the link it prints; check that the code matches.
3. Inventory: the agent runs `ohmyhost init --dry-run` on the repository and reports the framework, the Supabase usage, the `.env` values and anything unsupported. Read its summary; ask questions.
4. Decide: keep Supabase (default) or ask for the migration Skill. Say it in one sentence, because the agent keeps your existing decisions unless you change them.
5. Secrets and callback URLs: the agent tells you which secrets it needs and gives you the stdin command. You add the new hosts to Supabase's Redirect URLs and Site URL.
6. Deploy to Dev: the agent creates the project (US by default, EU if you say so at creation; the choice is permanent and prices are identical), links the repository, plans, and builds. Dev is private; `project_dev_access_create` gives you a single-use browser link.
7. Verify login on Dev: sign in with Google or email, open a protected page, reload it, sign out. Reload a deep link.
8. Promote to Prod: `promotion_plan` then `promotion_execute` reuse the same build without a rebuild. Isolated projects keep Dev and Prod data apart; Prod records are never overwritten by Dev rows.
9. Link the domain: on Paid, `domain_paid_plan` returns the CNAME to set at your registrar and `domain_paid_apply` activates it (https://docs.ohmyho.st/domains). Add the domain to Supabase's Redirect URLs, then run the login check once more on the real address.

Every step maps to a Skill the agent reads on its own: [get started](/skills/ohmyhost-get-started/SKILL.md), [deploy from GitHub](/skills/ohmyhost-deploy-github/SKILL.md), [domains and mail](/skills/ohmyhost-domains-and-mail/SKILL.md).

## My login still works: the checklist

Run this three times: on the Dev link, on the Prod host, and on your own domain after it is linked.

- The three `VITE_SUPABASE_*` values in the repository match the Supabase project you kept. A mismatch shows up as an app that loads and then cannot sign anyone in.
- Supabase Authentication → URL Configuration: Site URL is your Prod address; Redirect URLs contain the Dev host, the Prod host and your domain, each with the path your app redirects to.
- Google login: the OAuth client in Google Cloud still lists your Supabase callback as its authorized redirect URI. If you kept Supabase, this did not change; if you moved auth, it now points at your new provider.
- Sign in, open a protected page, reload it, sign out. A session that survives a reload proves the token is stored for the new host.
- A magic link or password-reset mail lands on the new host, not on the old Lovable address.
- A deep link such as `/settings` loads directly and after a reload.
- Dev 404 for anonymous visitors is expected: Dev is private. Use the access link, not the raw URL.

If any line fails, tell the agent which one. `deployment_logs` and `operation_get` give it the diagnostics; it does not need you to read them.

## What it costs

There is no per-project base fee. Every project draws from your organization's one balance: Free gives {{ number plan.freeCredits }} credits each UTC month; Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits. Monthly credits expire at the end of the period; a purchased top-up never expires ({{ number plan.topUpPerUsd }} credits per dollar, {{ number plan.topUpPerUsdAbove100 }} per dollar above {{ usd 100 }} in one checkout).

{{ table workload.smallApp }}

That workload assumes the database and mail also run here. A linked domain adds the hostname rate, {{ rate domain.custom_hostname }}, about {{ credits unit.customHostnameMonth }} a month, and needs Paid.

### If you keep Supabase

Then ohmyho.st meters only the frontend: the build, the requests, the CPU time, one deployed script and the hostname.

{{ table workload.lovableFrontend }}

Drop the hostname line and the rest fits inside the Free plan's {{ number plan.freeCredits }} credits a month, on the `<three-words>.check.omh.st` hosts every project gets. Idle costs are honest too: a deployed script keeps using about {{ credits unit.deployedScriptMonth }} a month and retained database storage {{ rate neon.storage.root }}; Workers bandwidth is not charged. A zero balance starts a seven-day grace period during which everything keeps running. You can put a monthly budget on the project (continue or stop) so a traffic spike cannot surprise you: https://docs.ohmyho.st/budgets.

Lovable's own pricing page (https://lovable.dev/pricing, read 2026-09-20) says hosting on Lovable Cloud draws from your credit balance once an app reaches significant traffic or size. Compare that against the tables above with your real request numbers; `organization_usage_get` shows them after the first month.

## FAQ

### Will my Google login keep working?

Yes, if you keep Supabase and add the new hosts. Google's OAuth client still calls back into Supabase, which did not move. What changes is Supabase's Redirect URLs and Site URL: add the Dev host, the Prod host and your own domain, then sign in, reload a protected page and sign out on each. If you migrate auth away from Supabase, the agent registers new callback URLs with your provider and you test again.

### Can I keep building in Lovable?

Yes. Lovable's GitHub integration keeps the project in continuous sync with the repository, so prompts in Lovable become commits. Your agent deploys any commit you point it at with a fresh `deployment_plan`, and promotes it after you check Dev. Keep one rule: do not edit the same file in Lovable and in your agent at the same moment, or you will be resolving merge conflicts you did not need.

### What about Lovable Cloud data?

Lovable's guide says the backend "can remain on the built-in backend (Cloud) or run elsewhere", and that you export data under More → Cloud → Overview → Advanced settings → Export data (docs.lovable.dev, read 2026-09-20). Table contents and storage files move manually; user passwords cannot be exported, so moved users need a password reset. The simplest first move is to leave Cloud as the backend and host only the frontend here.

### Do I have to use the terminal?

Almost never. The agent installs the CLI, prints the sign-in link and runs every command. The single exception is a private secret: the agent hands you a command that reads the value from your keyboard, so the key never appears in the chat or in a file. If your Lovable app only uses the public Supabase publishable key, you will not even do that.

{{ sources supabase }}

[From Bolt](/from/bolt) · [Compare Supabase](/vs/supabase) · [Cost breakdown](/pricing/breakdown) · [Host a Lovable app after export](/blog/host-a-lovable-app-after-export)
