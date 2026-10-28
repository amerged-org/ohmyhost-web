# Vercel and Supabase in One Platform: 2026 Comparison

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published October 10, 2026 · Updated October 22, 2026

Several platforms put app hosting and a backend in one account: Appwrite, Netlify, InsForge, Firebase, Nhost and ohmyho.st. This comparison lists what each covers, what its free plan allows and the catch that matters most. There is no ranking, because the right choice depends on the login, files and database your app already uses.

I build ohmyho.st, so the table below states where it is the weaker choice. Figures for Appwrite, Netlify and InsForge were read from their own pricing pages on October 22, 2026, with dated screenshots. Firebase and Nhost are described from their documentation, without free-plan numbers. Allowances change, so ask your Agent to check the current page before you move.

## What each free plan covers

**Included** means the free plan has it. **Integration** means it works with a service you connect and run yourself. **Paid only** means a paid plan is needed. **Not provided** means the platform has no managed feature for it.

| Platform | App hosting | Postgres | Login | File storage | Catch on the free plan |
| --- | --- | --- | --- | --- | --- |
| ohmyho.st | Included | Included | Integration (Better Auth or WorkOS AuthKit) | Included, uses credits | Email is Paid only; Realtime is Not provided |
| Appwrite | Included (Sites) | Dedicated databases only; Free uses TablesDB | Included | Included | Projects pause after a quiet week; no pausing is Paid only |
| Netlify | Included | Included (Netlify Database) | Included (Identity) | Included (Blob storage) | Projects pause when the 300 credits are used up |
| InsForge | Included, built on Vercel | Included | Included | Included | Projects pause after 1 week of inactivity |

Firebase and Nhost are not in this table because we did not compare their free allowances here; their sections below describe what each combines and what it costs to start. Already using Vercel and Supabase? Keep them on your shortlist. They come from different providers, which puts them outside a table of integrated platforms, but that alone is not a problem to solve. A move only helps if it improves something you care about without breaking the parts that work.

## Check what you already use

Vercel builds and serves the app. Supabase holds its PostgreSQL data and provides services such as Auth, Storage, Realtime and Edge Functions. Your app might use all of those, or only the database. Ask your Agent to read the code before comparing replacements; a list of subscriptions does not show which features would need work. [Vercel Functions](https://vercel.com/docs/functions) and [Supabase's database overview](https://supabase.com/docs/guides/database/overview) describe the separate responsibilities.

Check your testing setup too. Vercel creates preview deployments, and [Supabase Branching](https://supabase.com/docs/guides/deployment/branching) can supply isolated backend instances with their own credentials. Its Vercel integration connects corresponding previews and backend branches. Keep in mind: a preview URL does not create a separate database. Have your Agent show which backend the preview uses before you test a change that writes or deletes records. [Vercel environments](https://vercel.com/docs/deployments/environments) and [Supabase's branching integration](https://supabase.com/docs/guides/deployment/branching/integrations) explain that pairing.

Consolidating billing does not always require replacing this stack. Supabase's [Vercel Marketplace integration](https://supabase.com/docs/guides/integrations/vercel-marketplace) offers unified billing, resource management through Vercel and automatic environment-variable synchronization. Supabase currently documents this integration as Public Alpha. The backend still comes from Supabase. If your only problem is managing invoices, ask your Agent to check whether that option applies to your account before you plan a migration.

There is no rule that every small app needs both paid plans. Your hosting plan, database plan and workload are separate decisions. Vercel's Hobby plan is restricted to personal, noncommercial use; Supabase's Free plan has its own project and inactivity limits. See [Vercel Hobby](https://vercel.com/docs/plans/hobby) and [Supabase pricing](https://supabase.com/pricing). For a detailed free-plan comparison, use our [free Vercel and Supabase alternatives](/blog/free-vercel-supabase-alternatives-2026); for the basic division of responsibilities, read [Supabase vs Vercel](/blog/supabase-vs-vercel-do-you-need-both).

## Ask for an app inventory

You do not need to identify every dependency yourself. Open the repository with your Agent and ask for a plain-language inventory. It should connect the technical parts to things you recognize: signing in, uploading a file, getting an email or seeing a live update. That gives you something useful to check against the platform descriptions below.

Ask your Agent for that inventory with this prompt:

```text
Inspect this app without changing it. List its framework, server routes, database, login, files, realtime features and background jobs. For each, explain what the user would notice if it stopped working and whether it depends on a provider-specific service.
```

Read the result and correct any missing feature. Your Agent can find code, but you know which workflows your customers actually use. Mark those as required before asking it to choose a platform.

## Appwrite: services and previews

Look at Appwrite if you want frontend hosting and ready backend services in the same place. [Appwrite Sites](https://appwrite.io/products/sites) hosts static sites, single page applications and supported server rendered frameworks. Deployment can come from Git, the CLI or a manual upload. Its [preview deployments](https://appwrite.io/docs/products/sites/previews) also give developers branch and pull request URLs. Previews are private and require an Appwrite account in the site's organization; their URLs do not by themselves isolate the backend.

On the backend, Appwrite supplies [authentication](https://appwrite.io/docs/products/auth), [file storage](https://appwrite.io/docs/products/storage) and [functions](https://appwrite.io/docs/products/functions). Functions can respond to HTTP requests or events and run scheduled work. If your app needs those features, ask your Agent how much existing code can stay and which calls would need to use Appwrite’s SDKs and permissions.

Ask your Agent to be specific about the database connection. Appwrite's managed [native PostgreSQL](https://appwrite.io/docs/products/databases/postgresql) accepts standard database drivers and ORMs. Direct SQL access bypasses the Appwrite SDK and its permissions layer. Using a native database is therefore a different architecture from using Appwrite's database APIs. Keep in mind: connecting with SQL does not automatically apply Appwrite user permissions. Your Agent needs to check that the server still prevents users from reading or changing each other’s data.

Appwrite is a good fit when you want an integrated console, SDKs and frontend previews. Its self-hosting option also gives you another deployment path. Before choosing it, ask which parts you could move later. A standard Postgres connection is easier to replace than application code tied to a provider’s auth, storage and permissions. [Self-hosting documentation](https://appwrite.io/docs/advanced/self-hosting) covers the operational alternative.

Appwrite also documents [pausing PostgreSQL compute while retaining storage](https://appwrite.io/docs/products/databases/postgresql/maintenance). That matters for quiet projects on a paid plan.

The free plan has its own rules. Appwrite's pricing page lists {{ text vendor.appwrite.free.includes }}. Its February 2026 [changelog](https://appwrite.io/changelog/entry/2026-02-20-1) explains the pause: a Free project with no development activity for 7 consecutive days is paused, its data is kept, end users cannot reach it and background jobs such as cron and scheduled functions stop. You resume it from the Console. A later [notice](https://appwrite.io/changelog/entry/2026-06-29) says a free project that stays paused for 90 days is deleted with its resources, after email alerts. Paid projects are never paused for inactivity, and Appwrite's pricing page lists "No project pausing" as a feature of its paid plan. Read on October 22, 2026.

The database is the other catch. Free projects use TablesDB. Native PostgreSQL appears under dedicated databases, which start at {{ usd vendor.appwrite.dedicatedDatabase.usd }} a month per database: {{ text vendor.appwrite.dedicatedDatabase.includes }}. If standard SQL drivers matter to you, price the dedicated database, not only the free plan.

{{ checked appwrite }}

## Netlify: one credit pool for deploys, compute and traffic

Look at Netlify if you want a frontend host with Postgres, login and file storage under one account. [Netlify Database](https://www.netlify.com/platform/database/) is described as "a fully managed Postgres database built into the platform" that "branches with every preview". [Netlify Identity](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/) is available on every credit-based plan at no additional cost, and its documentation lists no cap on active users. Files go to Blob storage, and server code runs as Functions.

The Free card on Netlify's [pricing page](https://www.netlify.com/pricing/) lists {{ text vendor.netlify.free.includes }}. Everything draws on the same pool, so a busy month of deploys, functions and traffic competes for the same credits. Netlify's own [Personal comparison](https://www.netlify.com/pricing/personal-vs-free) states the consequence: "When you reach that limit, projects pause until the next billing cycle." Decide whether an app with real users can accept that before you rely on it. Read on October 22, 2026.

In two places Netlify's free plan is stronger than ours. A custom domain with SSL is on its Free card, while ohmyho.st Free needs the Powered by flag for your own domain. And Identity gives you a hosted login without an integration. Ask your Agent which of these your app uses and what each would cost in credits at your actual traffic.

{{ checked netlify }}

## InsForge: backend first, frontend on Vercel

InsForge is a backend platform. Its [pricing page](https://insforge.dev/pricing) says every project runs on its own dedicated server that hosts the project's API server and its Postgres database. Login, file storage and edge functions come with the project.

Frontend hosting is [InsForge Sites](https://docs.insforge.dev/core-concepts/deployments/overview). The CLI uploads your frontend source through InsForge, which creates a Vercel production deployment; static assets are served from Vercel's global CDN, and server-side code runs in the Vercel project's default region unless you change it. InsForge therefore gives you one workflow and one invoice, but a Vercel dependency stays underneath. If removing Vercel from the picture is the goal, this is not the platform that does it.

The free plan lists {{ text vendor.insforge.free.includes }}. The pricing page states "Free projects are paused after 1 week of inactivity". Paid plans bill compute separately for each project's backend server. Read on October 22, 2026.

{{ checked insforge }}

## Firebase: choose the database

With Firebase, first ask your Agent which products it is proposing. The similar names can hide quite different setups. [App Hosting](https://firebase.google.com/docs/app-hosting) builds applications, runs their dynamic code on Cloud Run and delivers through Cloud CDN. Next.js and Angular have preconfigured support maintained by Google; other frameworks depend on their adapter and support status. Check the [framework guidance](https://firebase.google.com/docs/app-hosting/frameworks-tooling) before choosing a deployment path.

For data, [Firestore](https://firebase.google.com/docs/firestore) is a document database with realtime listeners and offline synchronization. It suits applications built around that model. Firebase also offers [SQL Connect](https://firebase.google.com/docs/sql-connect), formerly Data Connect, backed by Cloud SQL for PostgreSQL. It provides schemas, authenticated endpoints and typed client SDKs. Firebase's [SQL Connect announcement](https://firebase.blog/posts/2026/03/fdc-native-sql) confirms the name change and support for native SQL operations.

Firebase Authentication, Cloud Storage and Cloud Functions round out the backend. Their integration is useful when your app already depends on Firebase client SDKs. Those services also bring their own authorization and configuration model. The relevant starting points are [Authentication](https://firebase.google.com/docs/auth), [Storage](https://firebase.google.com/docs/storage) and [Functions](https://firebase.google.com/docs/functions).

Check what you are signing up to before enabling the services. App Hosting requires the Blaze pay as you go plan, even when usage stays within its no-cost allowances. SQL Connect has API service costs and a separate underlying Cloud SQL instance. App Hosting's staging guidance recommends separate Firebase projects, while classic [Firebase Hosting has its own preview-channel workflow](https://firebase.google.com/docs/hosting/test-preview-deploy). Ask your Agent to use the documentation for the product it selected. A preview feature in Hosting does not automatically apply to App Hosting. See [App Hosting costs](https://firebase.google.com/docs/app-hosting/costs), [SQL Connect pricing](https://firebase.google.com/docs/sql-connect/pricing) and [App Hosting environments](https://firebase.google.com/docs/app-hosting/multiple-environments).

Firebase makes more sense when those client services are useful to your app. Ask your Agent to explain that benefit in terms of a feature you need. A Firestore application can export its data, but replacing its query model, realtime behavior and Security Rules is a separate engineering task. PostgreSQL makes the database path more conventional; SQL Connect still adds its own API layer. [Firestore export and import](https://firebase.google.com/docs/firestore/manage-data/export-import) documents the data path.

## Nhost: Postgres and containers

Look at Nhost if your app needs PostgreSQL and GraphQL together. Its managed stack combines [PostgreSQL](https://docs.nhost.io/products/database), Hasura APIs, authentication, storage and functions. That makes it useful for teams that want a ready backend around a relational database. The [Nhost overview](https://docs.nhost.io/getting-started) explains how those services fit together.

The hosting half comes through [Nhost Run](https://docs.nhost.io/products/run), which deploys custom containers beside the backend. Its [getting started guide](https://docs.nhost.io/products/run/getting-started) describes exposed ports and service endpoints. That runtime can serve a containerized web application. It is a workable integrated stack, but packaging a container is a different experience from selecting a frontend framework and receiving a managed build pipeline.

Your Agent can assess the container setup for you. Ask whether it can package the existing app as it is, how it will check that the container starts correctly, and what you would need to manage afterwards. Nhost's plans are per organization, with one invoice across projects. Account for the backend project's compute and the Run service you allocate; review the [pricing page](https://nhost.io/pricing) for the project's actual configuration. A backend subscription alone does not describe the complete price of an always running frontend container.

Nhost's Postgres foundation and [self-hosting documentation](https://docs.nhost.io/platform/self-hosting) provide a useful exit path. The work left after a database export sits around it: Hasura metadata, permissions, authentication and storage integration. Ask your Agent to list those separately. Having a SQL dump is useful; it does not mean your whole backend can be restored somewhere else without changes.

## ohmyho.st: where it fits and where it does not

ohmyho.st fits when you give your Agent a supported repository, want app hosting and conventional Postgres on one balance, and run several small projects. Supported apps use Astro, Next.js, Vite/React or TanStack Start. Your first job is to choose the repository and explain what you want to run; your Agent checks whether it fits. The [platform documentation](https://docs.ohmyho.st/) explains the services and supported workflows.

Free gives {{ number plan.freeCredits }} credits every month with no card. Paid starts at {{ usd plan.paidUsd }} for {{ number plan.paidCredits }} monthly credits shared across projects, and there is no separate project base subscription. Builds, runtime work, database compute, retained data and enabled services consume that balance. A sleeping database's RAM stops charging, with disk and seven-day backups included, while retained scripts and customer files still cost credits. A zero balance starts a {{ number plan.graceDays }}-day grace period, after which unfunded services suspend. That model suits a portfolio of quiet apps; it does not show that every busy workload costs less. The [free-plan comparison](/blog/free-vercel-supabase-alternatives-2026) prices a quiet app month by month.

Know the catches before you choose it:

- **Login is an integration.** ohmyho.st has no user pool of its own. Better Auth and WorkOS AuthKit are the verified integrations, and signing in to ohmyho.st is separate from your customers signing in to your app. Ask your Agent what will happen to existing accounts before agreeing to an auth migration. The [application authentication guide](https://docs.ohmyho.st/application-auth) covers integrations, and the [Supabase migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) inventories the services an existing app calls. Auth users, storage objects and realtime behavior need their own migration decisions.
- **No managed Realtime.** If the app depends on Supabase Realtime, keep that service or plan a replacement.
- **Email and your own domain.** Transactional email is Paid only. A domain you own works on Free while the Powered by ohmyho.st flag shows, and on Paid.
- **Fixed Dev and Prod.** Each project has Dev and Prod environments, with configurable shared or isolated data. That is different from giving every pull request its own frontend and backend. Review the [environment guide](https://docs.ohmyho.st/environments) against your team's workflow.
- **Frameworks, not containers.** There is no Dockerfile or long-running process. If the app needs a container, Nhost Run or another container host fits better.

For database portability, [encrypted SQL exports](https://docs.ohmyho.st/backups) provide a documented way to take the data to another PostgreSQL host.

## Compare your shortlist

Now use the inventory from your Agent. Pick the providers that look suitable and ask it to compare the same app on each. You want to see what stays, what needs changing and what is unsupported, with links you can check.

Use this prompt to compare the shortlist against that inventory:

```text
Compare my current setup with the platforms I shortlisted using the app inventory above. Show required code changes, login and data migration work, preview isolation and costs at my actual usage. Check current official docs and dated pricing. Explain any unknowns before recommending a move.
```

Use the recommendation as a decision aid. If it says a feature is unsupported, decide whether that feature can stay on its existing service. There is no need to replace a working backend just to reduce the number of product names in your stack.

- **Appwrite** suits a frontend and backend managed through an integrated platform, with Sites previews and ready application services, if you accept the free-project pause or pay for a paid plan.
- **Netlify** suits teams that want Postgres, hosted login and file storage next to a frontend host and can live within one credit pool.
- **InsForge** suits a backend-first project that accepts Vercel underneath for the frontend.
- **Firebase** suits apps that benefit from its client ecosystem, or supported full stack apps that fit App Hosting and a deliberate Firestore or SQL Connect choice.
- **Nhost** suits a PostgreSQL and GraphQL backend paired with a custom container deployment.
- **ohmyho.st** suits supported repositories deployed through a coding agent, with conventional PostgreSQL and a shared metered balance.
- **Vercel with Supabase** remains a sensible choice when its previews, integrations and backend services already fit the product.

Once you choose, start with a test deployment. For ohmyho.st, your Agent can follow the [getting started Skill](/skills/ohmyhost-get-started/SKILL.md). You check the result in the browser: sign in, open a protected page, save a record and use any file or realtime feature that matters.

When you have picked one, ask for a test deployment:

```text
Prepare a test deployment on the platform I chose. Explain the data and login setup first, keep production traffic on the current host, and give me a short browser checklist for the features we marked as required. Show remaining migration work before we plan the live move.
```

That test gives you a better reason to move than a table. If the app works and the running costs fit, plan the production change. If it reveals a large rewrite, you can keep the existing setup while deciding whether the benefit is worth it.

## FAQ

### Which platform combines Vercel and Supabase in one?

None replaces both for every app. Appwrite combines Sites hosting with ready backend services. Netlify pairs its frontend host with Netlify Database, Identity and Blob storage. InsForge is a backend whose frontend hosting runs on Vercel. Firebase combines App Hosting with its backend products, and Nhost pairs its Postgres stack with Run containers. ohmyho.st combines app hosting and managed Postgres and leaves login to an integration. Choose around the services your repository uses.

### Do these free plans pause or stop?

Yes, each in its own way. Appwrite pauses a Free project after 7 days without development activity and deletes it after 90 paused days. InsForge pauses free projects after 1 week of inactivity. Netlify pauses projects when the 300 monthly credits are used up, until the next billing cycle. On ohmyho.st the {{ number plan.freeCredits }} credits renew every UTC month, and a zero balance starts a {{ number plan.graceDays }}-day grace period before unfunded services suspend.

### Can Vercel and Supabase already share billing?

Yes. Projects created through the [Vercel Marketplace integration](https://supabase.com/docs/guides/integrations/vercel-marketplace) can use unified billing through Vercel, resource management and synchronized environment variables. Hosting and the backend still come from separate providers. A single invoice alone is therefore not a reason to migrate.

### Is an all in one hosting platform a drop in Supabase replacement?

A PostgreSQL migration moves database data. Auth users, uploaded files, realtime subscriptions, functions and application permissions need separate decisions. Check the [Supabase migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) before switching. Retain an external service where converting it would remove behavior your app requires.

### Does ohmyho.st replace Supabase Auth?

No. ohmyho.st has no user pool of its own; your app keeps its login provider, and Better Auth and WorkOS AuthKit are the verified integrations. If your app depends on Supabase Auth, keep that service or plan the auth migration as its own task.

{{ sources appwrite netlify insforge }}

Also read on October 22, 2026: the Appwrite [pause policy](https://appwrite.io/changelog/entry/2026-02-20-1) and [deletion notice](https://appwrite.io/changelog/entry/2026-06-29), Netlify's [Personal comparison](https://www.netlify.com/pricing/personal-vs-free) and [Identity documentation](https://docs.netlify.com/manage/security/secure-access-to-sites/identity/overview/), and InsForge's [Sites documentation](https://docs.insforge.dev/core-concepts/deployments/overview). Firebase and Nhost documentation was checked on October 10, 2026. Published allowances and rates can change.

[Free Vercel and Supabase alternatives](/blog/free-vercel-supabase-alternatives-2026) · [ohmyho.st vs Supabase](/vs/supabase) · [Supabase vs Vercel](/blog/supabase-vs-vercel-do-you-need-both) · [Pricing](/pricing)
