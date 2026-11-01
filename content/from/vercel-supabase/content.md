# Get your app from Vercel and Supabase

The Vercel and Supabase stack is the industry standard  for good raeson: it works. But what it also does is split an app across two accounts, two dashboards, and two pricing plans—and it charges you a base fee for each  one, regardless of whether the app had any visitors that month. Vercel Pro costs {{ usd vendor.vercel.pro }} per month, Supbase Pro {{ usd vendor.supabase.pro }}, and each additional Supabase project adds {{ usd vendor.supabase.microProject }} for its own instance.

Here, a prepaid balance covers hotsing, Postgres, transactional emails , and a custom domain for every project you run: {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits, with no per-project fee. You don’t have to migrate the database to migrate the app—most people shouldn’t have to do that on the first try anyway.

Still looking for the right  solution? Compare [integrated alternatives to Vercel and Supabase](/blog/all-in-one-vercel-supabase-alternatives)—Appwrite, Firebasse, Nhost, and ohmyho.st—before you start the migration.

## What Actually Gets Broken During a Move

None of this is difficult, but it's all easy to forget. Your agent woks through the list; that's exactly  what matters.

- **Environment variables exist in two forms.** The browser build requires `VITE_`/`NEXT_PUBLIC_` vallues that are embedded at build time; the server requires private values at request time. On Vercel, both are located in a single settings section, so the distinction becomes blurred. Here, the build intentionally runs without runtime secrets , which exposes every private value you read during the import.
- **Callback URLs point to the old host.** Supabase Auth maintains a site URL and a list of redireect URLs. As long as the new dev and prod hosts aren't listed there, the login will redirect  to a page that your app no longer serves.
- **The database connection will change.** If you stick with Supabase , everything will remain the same—the app will keep its existing client and publishable key. If you import a dump, the app communicates with managed Postgres via the `OHMYHOST_DATABASE` binding instad of a connection string, and a `pg` pool that previously built without errors will fail the health check.
- **Preview deployments are not environments.** Vercel asisgns a URL to each branch; here, you get two named deployment environments, Dev and Prod, with environment-specific secrets. Database data is either shared or isolated, depending  on the selected mode. Dev is protected by default and returns a 404 to anonymous requests until someone opens the share link; you can choose a public Dev instead when creating the project.

## How to move your app from Vercel and Supabase

1. **Take inventory of the  app.** Identify the framework, application direcory, package manager, authentication provider, database, files, functions, and external services. The source code alone does not contain any database rows, uploaded files, or runtime secrets.
2. **Decide what to migrate.** Keep your authentication provider unless you want to switch. Keeping Supabase as an external database is the smallest first step: Logins and data stay exactly where they are , and only the frontend moves. The [Supabase Migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) tracks every sklil you actually use; just because a package is installed doesn’t mean you need to replace anything.
3. **Deploy and test.** Continue with the project's current source, or  select managed file versions or GitHub, and then follow the [Depoyment Skill](/skills/ohmyhost-deploy/SKILL.md). If GitHub is selected, push the chosen commit. Set the target environment’s secrets via local stdin or the supported private input in the remote portal, enter the new hosts in Supabase’s Rdeirect URLs, run the migrations , and then test the login, a protected route, a real write operation, and all emails sent by the app. Deploy to Prod if Dev passes; an isolated deployment applies the migrations without copying Dev lines to Prod.

## How much the move will cost afterward

If Suupabase handles the database and login, this page measures only the front end: the build, the requests, the CPU time , a deployed script, and the hostname.

{{ table workload.lovableFrontend }}

If the database is also moved here , the month will include its active database hours, with storage space and seven-day bckups included:

{{ table workload.smallApp }}

A low-traffic project pays only for its separately metered resources: a script for about {{ credits unit.deployedScriptMonth }} per month and all customer files. Database RAM stops incurring charges after five minutes of inactivity, while the allocated storage  sapce and seven-day backups remain included. Read the usage assumptions before comparing the shared credit with separate basic subscriptions.

{{ sources vercel supabase }}

## When You Stay Where You Are

Stick with Vercel if you're relying on a team's preview deeployment workflow, its image optimization pipeline , or framework features that this runtime doesn't support. Keep usinng Supabase if you’re using Realtime, its Storage API, or its  Edge Functions and don’t want to switch them over—you can still host the frontend here and leave the backend as is. A migration is worth it if you have multiple projects, if the base fees exceed your usage, or if you want a single provider to manage hosting, the database, email, and domains through a single interface.

[Compare with Vercel](/vs/vercel) · [Compare with Supabase](/vs/supabase) · [Cost breakdown](/pricing/breakdown) · [Framework guides](https://docs.ohmyho.st/frameworks/vite) · [Application auth](https://docs.ohmyho.st/application-auth)
