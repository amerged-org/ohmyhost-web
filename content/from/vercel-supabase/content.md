# Bring your app from Vercel and Supabase

The Vercel plus Supabase stack is the default for a reason: it works. What it also does is split one app across two accounts, two dashboards and two usage models, and charge you a base fee on each one whether the app had visitors this month or not. Vercel Pro is {{ usd vendor.vercel.pro }} a month, Supabase Pro {{ usd vendor.supabase.pro }}, and every further Supabase project adds {{ usd vendor.supabase.microProject }} for its own instance.

Here, one prepaid balance covers hosting, Postgres, transactional mail and a custom domain for every project you run: {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits, no per-project fee. You do not have to move the database to move the app — most people shouldn't, on the first pass.

## What actually breaks when you move

None of this is hard, but all of it is easy to forget. Your agent works through the list; the list is the point.

- **Environment variables exist twice.** The browser build needs `VITE_`/`NEXT_PUBLIC_` values baked in at build time; the server needs private values at request time. On Vercel both live in one settings pane, so the distinction blurs. Here the build runs with runtime secrets deliberately absent, which surfaces any private value you were reading at import time.
- **Callback URLs point at the old host.** Supabase Auth keeps a Site URL and a Redirect URLs list. Until the new Dev and Prod hosts are in it, sign-in returns to a page that no longer serves your app.
- **The database connection changes shape.** If you keep Supabase, nothing moves — the app keeps its existing client and publishable key. If you import a dump, the app talks to managed Postgres through the `OHMYHOST_DATABASE` binding instead of a connection string, and a `pg` Pool that built fine will fail its health check.
- **Preview deployments are not environments.** Vercel gives every branch a URL; here you get two named deployment environments, Dev and Prod, with environment-scoped secrets. Database data is shared or isolated according to the mode you choose. Dev is private and answers 404 to anonymous requests until a ten-minute access ticket is redeemed.

## How to move your app from Vercel and Supabase

1. **Inventory the app.** Identify the framework, application directory, package manager, auth provider, database, files, functions and external services. Source alone does not carry database rows, uploaded files or runtime secrets.
2. **Decide what moves.** Keep your authentication provider unless you ask to change it. Keeping Supabase as an external database is the smallest first step: the login and the data stay exactly where they are, and only the front end moves. The [Supabase migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) inventories each capability you actually use; an installed package is not a reason to replace anything.
3. **Deploy and verify.** Push the chosen source to GitHub and follow the [deployment Skill](/skills/ohmyhost-deploy-github/SKILL.md). Set the target environment's secrets through the stdin command, add the new hosts to Supabase's Redirect URLs, run the migrations, then test sign-in, a protected route, one real write and any mail the app sends. Promote to Prod after Dev passes; an isolated promotion applies migrations without copying Dev rows into Prod.

## What it costs after the move

If Supabase keeps the database and the login, this side meters the front end only: the build, the requests, the CPU time, one deployed script and the hostname.

{{ table workload.lovableFrontend }}

If the database moves here too, the month includes its active hours and its stored data:

{{ table workload.smallApp }}

A quiet project costs close to nothing: a deployed script is about {{ credits unit.deployedScriptMonth }} a month, stored data {{ rate neon.storage.root }}, and idle database compute suspends after a minute. That is the difference from two base fees that do not care how quiet the month was.

{{ sources vercel supabase }}

## When to stay where you are

Stay on Vercel if you rely on its preview-deployment workflow for a team, on its image optimization pipeline, or on framework features this runtime does not support. Keep Supabase if you use Realtime, its Storage API or its Edge Functions and do not want to convert them — you can still host the front end here and leave the backend untouched. Moving is worth it when you have several projects, when the base fees outweigh the usage, or when you want one agent to operate hosting, database, mail and domains through one interface.

[Compare against Vercel](/vs/vercel) · [Compare against Supabase](/vs/supabase) · [Cost breakdown](/pricing/breakdown) · [Framework guides](https://docs.ohmyho.st/frameworks/vite) · [Application auth](https://docs.ohmyho.st/application-auth)
