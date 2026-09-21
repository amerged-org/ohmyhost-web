# Six things that break when a vibe-coded app meets production

By Sebastian Mertens · September 20, 2026

Deploy a vibe-coded app and the same six things break: localhost URLs, CORS and callback URLs, SQLite, committed secrets, build-time configuration and mail without a verified sender. On ohmyho.st your coding agent fixes each through named MCP tools and deploys from GitHub. The example first month below costs about {{ credits workload.lovableFirstMonth }}; the Free plan grants {{ number plan.freeCredits }} credits a month.

This list comes from watching agents deploy Lovable exports and weekend portfolio apps. The app runs on a laptop. It does not run anywhere else. None of the six is exotic, and all six are invisible in a preview window. ohmyho.st is hosting for vibe-coded apps that a coding agent operates through MCP. There is no deploy dashboard, and that is the point: the agent reads the blockers and fixes them in your repository, and you approve each plan before it runs.

## 1. Environment variables and localhost URLs

What breaks: the browser calls `http://localhost:3000/api`, the server calls `http://localhost:54321` for the database, and a copied `.env.example` was never turned into real values. Locally the dev server fills the gaps. In production nothing does.

Why it breaks here: the deployed app runs as a Worker next to its database. A committed `.env` is source, not configuration; the build sandbox runs your install and build under an emptied environment, and runtime secrets are delivered to the deployed Worker separately. Outbound requests only reach the HTTPS origins listed under `runtime.egress.allow` in `ohmyhost.yaml` (at most sixteen; local names and private addresses are rejected). A localhost URL fails at the first request, not at build time.

What the agent does: it runs `ohmyhost init --dry-run --json` and works through the returned blockers and requirements instead of stripping features to get a green build. It reads hosted values from the framework's request context (for Next.js on this runtime, `getCloudflareContext({ async: true }).env`; in a plain Worker module, the `env` argument of `fetch(request, env, ctx)`) and never treats the request Host header as configuration. It reads `project_status` for both environment IDs and URLs: Prod at `https://<three-words>.check.omh.st`, Dev at `https://dev-<three-words>.check.omh.st`. Each environment gets its own values; Dev is not Prod. Dev is private, so an anonymous 404 is expected; `project_dev_access_create` returns a ten-minute single-use link for browser checks. The [portable-app Skill](/skills/ohmyhost-build-portable-app/SKILL.md) and the [environments guide](https://docs.ohmyho.st/environments) carry the details.

## 2. CORS and callback URLs

What breaks: the bundle calls an API on another origin and the preflight fails. The usual reflex, `Access-Control-Allow-Origin: *`, does not work with cookies and opens the API to every site. Separately, the OAuth callback still points at localhost or the builder's preview domain, so sign-in returns to a page that does not exist, and cookies set for the old host never arrive.

Why it breaks here: CORS is an origin problem, and you now have two new origins, Dev and Prod. Callback URLs live at your identity provider; no deploy can change them for you.

What the agent does: `deployment_plan` reports required secret names and callback configuration as plan blockers before anything builds. For the API, it moves calls to same-origin routes so CORS disappears: Next.js route handlers, native TanStack Start server functions, or the Vite API companion that `init` asks for under the `vite-api-companion` requirement (every used `/api/*` route in one same-origin module). For sign-in it keeps your provider. Better Auth and customer-owned WorkOS AuthKit are the verified integrations; the ohmyho.st login is a separate thing and is never reused for your users. With isolated Dev and Prod data it registers both origins as callback and logout URLs, then tests sign-in, a protected route, a reload and sign-out on the deployed Dev app. An external provider's origin goes into `runtime.egress.allow`. When a custom domain arrives later (Paid; `domain_paid_plan`, `domain_paid_apply`, `domain_paid_status`; about {{ credits unit.customHostnameMonth }} a month), the trusted origin and callbacks change again and host-only cookies mean a fresh login. The agent does not widen cookie domains to hide an origin mismatch. See [application auth](https://docs.ohmyho.st/application-auth).

## 3. SQLite in the repo (Postgres instead)

What breaks: a `dev.db` file is committed, Prisma says `provider = "sqlite"`, or Drizzle points at a local file through `better-sqlite3`. A Worker has no persistent disk, and `better-sqlite3` is a native addon, so `init` stops with the typed `workers_runtime_incompatible` blocker instead of pretending. Even if it built, every deploy would start with an empty database.

Why it breaks here: production data has to outlive deploys and be shared by every instance. That is a server, not a file.

What the agent does: it creates the project with `project_create`, choosing shared or isolated Dev and Prod data and the hosting region (US by default, EU as a one-time choice at creation; prices are identical). It replaces the file database with managed Postgres through the `OHMYHOST_DATABASE` binding and `createPrivateDatabaseClient` from `@ohmyhost/customer-runtime/database`. There is no connection string, no `pg` pool and no Hyperdrive; a `pg` Pool builds green, deploys and then fails its health check. The schema becomes versioned migrations named `YYYYMMDDHHMMSS_name.sql`, and SQLite habits change on the way: AUTOINCREMENT, text timestamps and 0/1 booleans. Existing rows move through `database_write` (one parameterized statement, at most 1,000 rows and five seconds) or a time-bound psql credential from `database_access_create`, whose connection URI is returned exactly once. `database_query` verifies the result, 100 rows at a time, with your row-level security applied.

Cost, so you can decide: Free runs a 0.25 CU profile, Paid standard 0.5 CU. One active hour on Paid standard is about {{ credits unit.activeDatabaseHourStandard }}; idle compute suspends after a minute, and stored data keeps using credits at {{ rate neon.storage.root }}. A periodic health ping keeps the database awake and turns a quiet project into a billed one, so the agent does not add one. The [database Skill](/skills/ohmyhost-manage-database/SKILL.md) covers sizing; a Lovable export that talks to Supabase uses the [Supabase migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) only for the capabilities you choose to move. Reference: [database](https://docs.ohmyho.st/database) and [migrations](https://docs.ohmyho.st/migrations).

## 4. Secrets committed to the repository

What breaks: `.env` is in the first commit with an OpenAI key, a Stripe secret and a Supabase service-role key. The preview worked, so nobody looked. Git history keeps the file even after you delete it.

Why it breaks here: a committed key is a leaked key, and on ohmyho.st a committed `.env` does not configure anything anyway. The build sandbox holds no platform credential and no customer runtime-secret values, so the file is dead weight with a live key in it.

What the agent does: it treats every committed key as burned and tells you to rotate it at the provider; the agent cannot do that for you and should not ask you to paste the new value into chat. It removes the file, adds it to `.gitignore` and pushes. Then it delivers each value with `secret_set_command`: the tool returns a stdin-only CLI command for the chosen environment ID, and the value never enters MCP, the conversation, a command argument or project notes. `secrets_list` shows names only; `secret_delete` removes one. Source lists secret names, never values. One reserved name: `BETTER_AUTH_SECRET` belongs to the platform-managed integration, so an app that owns its Better Auth setup uses its own name, for example `APP_AUTH_SECRET`, mapped to the library's `secret` option. The agent also never copies its own ohmyho.st token file into application secrets. Reference: [secrets](https://docs.ohmyho.st/secrets).

## 5. Build-time versus runtime configuration

What breaks: `VITE_*` and `NEXT_PUBLIC_*` values are inlined at build time, so a key placed there ships to every browser. The reverse also fails: server code that reads `process.env.STRIPE_SECRET` at module load during the build gets undefined and either throws or bakes in nothing. A vibe-coded app uses one `.env` for both, and the difference never shows locally.

Why it breaks here: build and runtime are two machines with two environments. The build sandbox runs with runtime secrets deliberately absent; they are delivered to the deployed Worker and nowhere else.

What the agent does: it sorts every variable into public (a publishable key or client ID, fine as a build literal) or private (read lazily at request time from `env`, never at import time). It detects the platform by the presence of `OHMYHOST_PROJECT_ID` rather than probing a binding for methods, because a service binding answers "function" for every name you ask about. It then calls `deployment_plan`, which quotes the build before it starts: 840 seconds are reserved, about {{ credits unit.buildReservation }} held at {{ rate build.sandbox.standard-3 }}, settled on the measured seconds. A sandbox that is not running five minutes after the request, or a build longer than eight minutes, ends as timed out. You approve, `deployment_create` starts it, and `operation_get` follows progress. On `build_failed`, `deployment_logs` returns the BUILD_FAILED item with an excerpt: the sanitized tail of your own install and build output. The agent reads that before touching source. Every deployment stages one immutable script that stays for rollback and keeps using about {{ credits unit.deployedScriptMonth }} a month until it is cleaned up. Stuck operations go to the [troubleshooting Skill](/skills/ohmyhost-troubleshoot-deployment/SKILL.md).

## 6. Mail without a verified sender

What breaks: signup verification, password reset and the contact form. Locally a test key sent from the provider's sandbox address. In production the sender domain has no DKIM record, the mail is rejected or filed as spam, and the provider key sits in the browser bundle.

Why it breaks here: mail reputation is tied to a domain, and every provider needs proof that you control it. That proof is DNS, and DNS takes time.

What the agent does, with two honest options. First: keep your external mail provider. Server code calls it with a runtime secret from `secret_set_command` and its origin in `runtime.egress.allow`; verification and reset mail owned by an external identity provider stays there. Second: managed transactional mail on ohmyho.st, which needs Paid. The agent reads `organization_account_get` first, because a credit balance alone is not feature access. `mail_domain_set` declares your sender subdomain and returns four NS records with TTL 300 for that subdomain; you set them, or you authorize Cloudflare DNS through `domain_cloudflare_authorize` and the agent sets them. `mail_domain_status` reports DKIM verification with an `observed_at` timestamp; pending is not the same as wrong. A deployment that needs mail waits in `waiting_for_mail` and resumes without another build; the agent asks you to check again after 60 minutes. Sending uses `no-reply@` your sender domain and goes out from the platform mail region, also for EU projects. It uses credits per recipient at {{ rate ses.{region}.recipients (Essentials) }}, with To, CC and BCC counted separately, and the sender zone uses about {{ credits unit.mailSenderZoneMonth }} a month. A new sender starts with a small daily limit that rises over the first week, and high bounce or complaint rates suspend sending. If you select the managed Better Auth integration, it needs both the database and a verified sender, because it sends the verification and reset mail. Reference: the [domains and mail Skill](/skills/ohmyhost-domains-and-mail/SKILL.md) and the [email guide](https://docs.ohmyho.st/email).

## How to run this on your repository

1. Push the exported source to a GitHub repository you can authorize. GitHub is the only deployment source; there is no upload path and no container.
2. Open Claude Code, or another agent that speaks MCP, in that checkout and paste the prompt below. The agent installs the CLI and MCP server, sends you one sign-in link with a code, and runs `ohmyhost init --dry-run --json`.
3. Work through the six items above as the returned blockers and requirements. The agent commits the fixes; you approve each `deployment_plan` before `deployment_create` runs.
4. Check the private Dev app through `project_dev_access_create`: sign-in, a protected route, one real write and one mail if you enabled it.
5. Promote with `promotion_plan` and `promotion_execute`. Isolated promotion applies the migrations without copying Dev rows into Prod.
6. Set a monthly ceiling with `project_budget_set` if you want one, in continue or stop mode. Every project draws from the organization's one balance; Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits, and purchased top-ups never expire.

```text
{{ prompt }}
```

What the first month of such an export costs with managed mail, itemized from the published rate card:

{{ table workload.lovableFirstMonth }}

The sender zone and database compute are most of it. A project that keeps an external mail provider drops the zone and the recipients, and a static site drops the database rows as well.

## FAQ

### Can I deploy a Lovable export without changing code?

Rarely. A static Vite site with no database, auth or mail deploys as it is. Anything with data has at least three of the six problems above. The agent's `ohmyhost init --dry-run --json` lists the exact blockers and requirements for your repository before any credits are spent, so you know the scope before you approve a plan.

### What if my export talks to Supabase?

You choose what moves. The migration Skill inventories real database, Auth, Storage, Functions and Realtime usage, not just an installed SDK, and converts only the capabilities you select. Your auth provider stays yours unless you decide otherwise. A database dump alone does not migrate every Supabase service, and the agent says so instead of faking a green check.

### Can the agent see my secret values?

No. `secret_set_command` returns a CLI command that reads the value from stdin, so the value never passes through MCP or the chat. `secrets_list` returns names and metadata only. The same rule applies to export passwords and database credentials: a psql connection URI from `database_access_create` is shown once and never stored anywhere the agent can read it back.

### Do I need the Paid plan for this?

Not for hosting, Postgres or the platform hostnames: the Free plan grants {{ number plan.freeCredits }} credits a month and every project draws from the same balance. A customer domain and managed transactional mail need Paid at {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits, and both keep using credits while they exist.

### Why does my Dev URL return a 404?

Because Dev is private by design. An anonymous request gets a 404, which is not a deployment failure. The agent calls `project_dev_access_create` for a ten-minute single-use link, opens it once in your browser, and then the clean Dev origin works with that session cookie. Prod on the platform hostname is public.

[Deploy from Claude Code](/for/claude-code) · [Move from Lovable](/from/lovable) · [Cost breakdown](/pricing/breakdown)
