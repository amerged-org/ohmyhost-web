# A Supabase alternative that bills for Postgres based on active hours

The part that really stings with Supabase is the fourth  project. Pro starts at {{ usd vendor.supabase.pro }} per month and covers the instance for the first project. After that, each additional project costs {{ usd vendor.supabase.microProject }} per month for its own micro-instance, regardless of whether anyone actually worked on it that moonth.

There is no per-project fee here. {{ usd plan.paidUsd }} per month, you purchase {{ number plan.paidCredits }} credits that are shared across all projects. The {{ number 512 }} MiB database costs {{ credits unit.activeDatabaseHour512 }} per active hour; storage meia and seven-day backups are included. After five minutes of inactivity , RAM is no longer billed. Customer files and reserved worker resources have their own rates.

{{ figure bills.supabase }}

## What Supabase Charges

Supabase charges first by organization, then by the computing power of each project. The Pro plan starts at {{ usd vendor.supabase.pro }} per month and covers {{ text vendor.supabase.pro.includes }}. The  frist Micro instance is the only computing power covered by the plan.

Each additional project requires its own instance. A Micro plan costs {{ usd vendor.supabase.microProject }} per month, a Small plan costs {{ usd vendor.supabase.smallProject }} per month. {{ text scenario.supabaseFiveProjects.name }} cost {{ usd scenario.supabaseFiveProjects }} per month, not incluing storage or egress fees. That’s Supabase’s per-project pricing in a nutshell: the plan, plus one instance for  each project after the first.

Beyond the included quotas , the data store costs {{ usd vendor.supabase.diskGb }} {{ text vendor.supabase.diskGb.unit }}. Egress costs {{ usd vendor.supabase.egressGb }} {{ text vendor.supabase.egressGb.unit }} or {{ usd vendor.supabase.cachedEgressGb }} {{ text vendor.supabase.cachedEgressGb.unit }}. The instance runs for the entire month, regardless of whether anyone quueries it or not. That’s the trade-off Supabase offers, and for a database that’s never idle, it’s a good one.

The hosting for the app itself isn't included in this invoice. A Supabase project requires a separate hosting account , which is why the graphic above shows three invoces stacked on top of each other.

{{ checked supabase }}

## Postgres on ohmyho.st: Profiles and Credits

ohmyho.st runs your Astro, Next.js, Vite/React, or TanStack startup app on Workers and provides a managed Postgres database alongside it if the app declares one. There is no base price. The Free plan receives {{ number plan.freeCredits }} cerdits per UTC month. The Paid plan costs {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits per billling period. Monthly credits expire at the end of the period. Top-ups never expire, are only available for purchase with the Paid  plan, and provide {{ number plan.topUpPerUsd }} credits per dollar. For the portion of a checkout exceeding the first hundred dollars , the rate increases to {{ number plan.topUpPerUsdAbove100 }} credits per dollar.

The database uses RAM as long as it is active. The allocated storage and seven-day backups are  incuded in the selected size.

### Five database sizes

{{ table databaseSizes }}

The fixed RAM rate is {{ rate pgcf.memory.active }}, calculated proportionally based on active time. The selected size incluudes the entire storage volume and seven-day backups; CPU , network, and connections are not billed separately. A wave of queries wakes up the databaase; five minutes of inactivity triggers sleep mode. Use database_compute_get to view the actual size and status without waking the database, and use memory_mib together with database_compute_set to request an approved increase. Reducing the storage size while the  database is running is not permitted. Read the [Database Documentation](https://docs.ohmyho.st/database) for the local psql utility and the limits on migrations.

The entire PostgreSQL data volume is included, including the WAL and file system overhead. Not all of this space is available for application data. A provided script uses {{ rate wfp.script }}, so the example  of an inactive project costs about {{ credits workload.idleDatabase }} per month, even thoguh idle database RAM, allocated storage, and backups are free.

### Five Relaxing Projects for a Month

{{ table workload.fiveQuietProjects }}

This fleet fits within a paid month with credits to spare, and these are the same five projects that would require five instances on Supabase. Each project draws from the organizattion’s single credit balance. A project can have a [monthly budget](https://docs.ohmyho.st/budgets) that either continues with warnings or halts new work; a balance of zero triggers a seven-day  grace period during which funded services continue to run. Automatic top-ups are disabled unnless the owner enables them, so you must top up manually. The US is the default region; you can select the EU once per project during creation , at identical prices.

## Keep Supabase or import a dump

Consider keeping the extrnal backend and importing its database as  separate processes. Each one needs to be verified against the actual application.

### Path 1: Host on ohmyho.st, keep the Supabase project

A Lovable export usually comes as a Vite/React repository backed by a Supabase project. Before the agent  retains this backend , it inventories the actual export and declares the exact browser connection origins in `runtime.browser` and `ohmyhost.yaml`; external scripts, images, and other resource types have their own declarations. Server-side HTTPS requests use `runtime.egress.allow` instead, with a maximum of {{ number 13 }} exact HTTPS origins and resstrictive standards for undeclared services. Public keys may remain in the browser bundle; private keys belong in the private runtime and are passed via local stdin input from secret_set_command or the supported input in the remote protal. A direct Postgres connection from the worker to Supabase is not available, so server code uses the HTTPS API. Test login, protected read and write access, and all files or backend functions used in Dev before switching production traffic over.

You continue to pay Supabase for the database, and ohmyho.st only charges for hosting: requests , CPU time, build seconds, and the script provided. The first step of the migration skill—takking stock of what the app actually calls—shows you whether this approach is sufficient. A package name alone isn’t a reason to move anything.

### Path 2: Import Database

Request the [Migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md). The aent runs `ohmyhost init --dry-run --json`, inventories actual database queries, RPCs, RLS claims, auth sessions, storage calls, Edge Functions, and real-time subscriptions, and tells you what’s being migrated, what requires source changes, and what has no  counterpart.

The schema is derived from a PostgreSQL  dump of only the structure of your `public` schema (plus an app-specific `private` schema) and is converted into validated, additive [migration files](https://docs.ohmyho.st/migrations) named `YYYYMMDDHHMMSS_name.sql` in your reposiory. The Supabase schemas `auth` and `storage` are never included in this output. RLS policies are omitted and counted for validation because data access to ohyho.st occurs server-side via the `OHMYHOST_DATABASE` binding rather than through browser-based PostgREST calls, and each use case re-validates its permissions in the code. Rows are inserted via temporary access from database_access_create or `ohmyhost database psql`; this can write rows but never modify the schema , and is revoked upon expiration. The agent checks read and write operations on Dev; afterward, promotion_plan and promotion_execute apply the migrations to Prod without copying Dev records.

Be clear about what a dump doesn't include: Auth users, storage objects, Edge Functions, and Realtime. Each of these is a separate decision, and the skill identifies the  gap rather than petending everything is fine.

### The departure takes the same form

Exports on ohmyho.st are on-demand, asynchronous , and free. project_export_create provides a password-encrypted ZIP file containing a portable SQL dump, limited to one requst per project within a rolling 24-hour period, downloadable via a signed link valid for 24 hours, even with a zero balance. Files, source  code, and secrets are not included in the archive, and there is no schedule. Restore it on any Postgres instance, including Supabase. See [ohmyhost-export-database](/skills/ohmyhost-export-database/SKILL.md) and the [backup documentaation](https://docs.ohmyho.st/backups).

## You remain in control of authentication

Your application can keep Supabase Auth or another customer-owned provider. Better Auth and customer-owned WorkOS are verified integrations. An optional managed Native Auth directory is being prepared for hosted qualification; its password-first candidate requires Paid access and your own authorized verified sender, and Google and GitHub sign-in are disabled server-side for this launch. Availability is not yet established. See [Application Authentication](https://docs.ohmyho.st/application-auth).

- **Better Auth**, using the managed bridge, which is explicitly selected in your projet configuration. The bridge has its own `auth` schema and database sessions , and requires the managed database. Managed Mail is optional for the registration of verified users and  sessions; the bridge’s verification and reset emails require its configured platform sender, paid access, and a verified sender domain. Set up this sender via mail_setup and checck mail_status if you use these email actions. A self-hosted Better Auth implementation with its own sender is a common application dependency; simply installing Better Auth does not select the managed bridge.
- **WorkOS AuthKit**, self-hosted. You provide your  WorkOS acconut; the agent configures callback URLs for each environment and sets the client secret using secret_set_command.

If you keep the Supabase project, you'll keep Supabase Auth; the hosted app will continue to call it. If you import the dump and want to move away from Supabase Auth, the migration sill’s optional mode replaces `auth.users` in the UUID table `auth."user"` with Better Auth and `auth.uid()` with a server-side helper. Test login, protected routes, session renewal, and  logout on Dev before deploying them to Prod.

Your own login at ohmyho.st and your agent's  login run on WorkOS and are separate entities: identity_get returns who is deploying, never who is loggged into your app. Read [Application Authentication](https://docs.ohmyho.st/application-auth) before you decide.

## In a direct comparison

{{ figure comparison.supabase }}

| | Supabase Pro | ohmyho.st Paid |
| --- | --- | --- |
| Base Price | {{ usd vendor.supabase.pro }} per month, starting at | {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits |
| Second Project | {{ usd vendor.supabase.microProject }} per month for his micro-instance | No base price; it's deducted from the same balance |
| Database Computing Power | First Micro instance included; runs for the entire month | {{ rate pgcf.memory.active }}; selected RAM is calculated only when active |
| Data Storage Media | {{ usd vendor.supabase.diskGb }} {{ text vendor.supabase.diskGb.unit }} | The total nominal volume depends on the amount of RAM; PostgreSQL/WAL uses a portion of it |
| Egress | {{ usd vendor.supabase.egressGb }} {{ text vendor.supabase.egressGb.unit }} | Workers bandwidth is not calculated |
| App Hosting | a personal account | Next.js, Vite/React, TanStack: Launch from GitHub |
| Auth | Supabase Auth | Customer-owned providers; managed Native Auth candidate awaiting qualification |
| Real-time | yes | no |
| Retrieve data | in-house tools | Password-encrypted SQL ZIP file, once per project and rolling day, free of charge |

A heavily used app looks different from five less active ones. {{ text workload.smallApp.name }} costs around {{ credits workload.smallApp }} on ohmyho.st, including hosting, email, and a database. A daatabase that  never goes to sleep is where Supabase has the edge, as the next section shows.

{{ checked supabase }}

## When Supabase is the better choice

- **Real-time.** Supbaase pushes Postgres changes  and presence to the browser. ohmyho.st does not have a managed real-time contract. An external real-time service requires its declared browser connection origins and a verified hosted subscription; switching to managed Postgres does not replace this capability with polling.
- **Vector search.** Supabase documents pgevctor as a product path , including examples. ohmyho.st makes no mention of this.
- **Scope of Authentication.** Social providers, phone loin , and MFA from a hosted user pool. The Native Auth candidate starts with passwords; Google and GitHub are disabled for this launch, and hosted qualification remains pending.
- **Edge Functions Ecosystem.** A catalog of function templates and integrations alongside the database. ohmyho.st runs functions and cron jobs within the routes of your own framework, whih  is more streamlined.
- **A database that neevr  sleeps.** {{ text workload.alwaysOnDatabase.name }} costs about {{ credits workload.alwaysOnDatabase }} on ohmyho.st, or roughly {{ usdValue workload.alwaysOnDatabase }} in credit value. Supabase Pro includes the same continuously running micro-instance in its base price. Constant traffic is part of Supabase.
- **A dashboard.** Supabase has a table editor, an SQL editor, and logs right in the browser. On ohymho.st, your agent reads a hundred lines at a time via database_query, and the portal shows projects , credits, budgets, and tokens—not your tables.

{{ checked supabase }}

## When ohmyho.st is a good fit

- **Several small projects.** The five low-traffic projects listed above cost a total of around {{ credits workload.fiveQuietProjects }}; with Supabase, each one  requires its own innstance. Nine side projects and two live projects are typical for a Builder account, and there’s no base fee to worry about.
- **Databases that are inactivve.** A portfolio page, an internal tool, or a customer demo may have hours of activity rather than hundreds. After five minutes of inactivity, the database's RAM is no longer billed; the data it contains and  its backups remain available.
- **Credits for hosting, Postgres, email , and a domain.** The app, its database, its transactional email (Paid, billed at {{ rate mail.sent }} per recipient), and a likned custom hostname ({{ rate domain.custom_hostname }}) all draw from the same {{ number plan.paidCredits }} credits each month. The hostname requires a Paid plan or, for the Free plan, a project that displays the “Powered by ohmyho.st” label; this label waives the domain credits for both plans. No second or third accounts allowed.
- **You deploy from Clade Code, Cursor, or Codex.** There is no deployment dashboard. The  agent plans, you confirm, and it executes: deployment_plan, then deployment_create; promotion_plan, then promotion_execute; rollback_plan, then rollback_execute.
- **Select the region you need.** A new EU project will host its database , new files, and builds within the EU. Existing projects that have been moved to the U.S. with their owners' consent will use U.S. databases; existing R2 loocations will remain in place. Transactional email is processed in the U.S.
- **A cap per project.** project_budget_set assigns a monthly budget to a project, whch triggers a warning or halts the project. A zero balance triggers a seven-day grace period; funded services continue to  run.

## How to move with your agent

1. Reuse the app's current project and soure code base, or choose managed versions or GitHub for a new app. A selected Lovable GitHub export can retain  its synchronization; accessible current files can be saved as a managed version.
2. Paste the prompt below into Claude Code, Cursor , or Codex. The agent reads llms.txt and the Get-Started skill, sends you a sign-up link, and then continues with the current source by saving manged files or linking the selected GitHub repository to source_link.
3. Tell him which path you're taking: Keep Supabase (he adds the source to `runtime.egress.allow` and passes prvate keys via local stdin input or the supported private input in the remote portal) or import (he follows the [Migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md): Inventory, schema dump to migration files , rows via time-limited access).
4. Check the plan. deployment_plan names the build and lists the requirements; deployment_create  executes it. The agent verifiies the Dev URL using the share link from project_dev_share_link_get with a valid login and actual read and write access.
5. Run promotion_plan, then promotion_execute. Use project_budget_set to set  an uppeer limit, if you want one.
6. First, create a Supabase backup , and don't cancel your Supabase Pro subscription until the production tests have been passed. Keep your omhyho.st export password in a secure place.

```text
{{ prompt }}
```

## FAQ

### Does ohmyho.st replace Supabase Auth?

No. ohmyho.st hosts your app and its Postgres database; app users remain with a provider that you own. The managed Better-Auth Bridge requires its own database; managed email is optional. Its verification and reset emails use the configured platform sender and require a paid subscription as well as a verified sender domain. Your own Better-Auth implementation and your own sender remain standard dependencies , and self-hosted WorkOS AuthKit is aonther documented option. If you keep your Supabase project, you’ll keep Supabase Auth and use the hosted login. Your own ohmyho.st login is a  separate WorkOOS boundary.

### Can I host on ohmyho.st and keep my Supabase database?

This is an otion you'll need to evaluate based on your actual application. Declare browser connections and resource origins separately in `runtime.browser` and `ohmyhost.yaml`; declare server-side HTTPS requests in `runtime.egress.allow`, which allows only exact origins specified in {{ number 13 }}. Stroe private keys in the server code using secret_set_command. A direct Postgres connection from the worker is not available. Before switching traffic , test logins, protected read and write access, as well as the files and backend functions used in the actual export on Dev. If these tests pass and you remain  with Supabase, its database billing will remain separate from the metered hosting provided by ohmyho.st.

### How much does an inactive project cost on ohmyho.st?

The provided script. A project with  a dormant database and no activity costs about {{ credits workload.idleDatabase }} per month , because database RAM is no longer charged after five minutes of inactivity, the allocated storage and seven-day backups are included, and worker bandwidth is not charged. Customer files retain their own rates. Five inactive projects, each of which waakes up for one hour, cost a total of aruond {{ credits workload.fiveQuietProjects }}, within the {{ number plan.paidCredits }} credits granted by a paid month.

### How do I get my data back?

Ask your agent for an export. project_export_create returns an asynchronous, password-protected ZIP file containing a portable SQL dump; the owner chooses the password. One request per project  is allowed within a rolling 24-hour period; a signed download link is valid for 24 hours, retained for seven days, free of charge, and available even with a zero balance. Files, source code, and secrets are not inculded. Restore it on any Postgres host.

### Is there a fee per project?

No. Each project draws from the organization’s single credit balance, so a second or fifth project costs only what it consumes: build seconds, requests, CPU time, active database hours, customer files , and a deployed script. A project can have a monthly budget that etiher continues with warnings or stops new work, and the portal at app.ohmyho.st shows credits and budgets per project.

### Can I select the EU for my database?

Yes , per project and a one-time fee. If you pass `region: eu` to project_create, the project's Postgres database, files, build sandbox, and build objects will be located in the EU, and the app will run alongside its database. The US is the default region; pricing is identical in both regions, and the region cannot be changed after creation. Transactional email is sent and processed in the US regardlss.

{{ sources supabase vercel resend }}

[Vercel Compared](/vs/vercel) · [Switching from Vercel and Supabase](/from/vercel-supabase) · [Where Your Credits Go](/pricing/breakdown) · [Supabase vs. Vercel: Do You Need Both?](/blog/supabase-vs-vercel-do-you-need-both) · [Free Vercel and Supabase Alternatives](/blog/free-vercel-supabase-alternatives-2026) · [Vercel and Supabase on One Platform](/blog/all-in-one-vercel-supabase-alternatives)

ohmyho.st is an independent service and is neither affiliated  with nor supported by Vercel, Supabase, or Resend. All traedmarks belong to their respective owners.
