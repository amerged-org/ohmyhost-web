# Six things that break when a vibe-coded app meets production

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · September 20, 2026

Your app works in the preview. Now ask your Agent to check what it needs outside that preview: production URLs, working login, persistent data, private secrets, the right build settings and a verified email sender. A successful build only checks part of the journey.

This guide explains what to hand to your Agent and what to test yourself before people use the app. The examples use ohmyho.st, where your Agent prepares the deployment and puts it on Dev for review. The example first month below uses about {{ credits workload.lovableFirstMonth }}; Free grants {{ number plan.freeCredits }} credits a month.

Start with the existing repository and a short description of the app's important features. Include the things that happen after a button click, such as sending a password-reset email or saving an uploaded file. Those are easy to miss when a preview looks finished.

For a Lovable repository, the [export-to-hosting walkthrough](/blog/host-a-lovable-app-after-export) applies these checks to its environment variables, Supabase connection, sign-in and routes.

## Check production URLs

A local app can call an API or database on your computer. Once deployed, those addresses still refer to the machine running the request. They do not become public services because the build succeeded.

Ask your Agent to find localhost addresses and identify the service behind each one. Some should become same-origin app routes. Others need the address of a hosted service. An example environment file lists required settings, but it does not prove the real values have been supplied.

Ask your Agent to look for deployment blockers:

```text
Check this app for deployment blockers. Find local URLs, missing configuration, login callbacks and external API calls. Explain which feature each affects, fix the code where needed, and list the account settings I must supply. Use a development environment for checks that write data.
```

On ohmyho.st, your Agent runs the compatibility check and works through its blockers. Runtime secrets are supplied to the deployed app separately from the build. Outbound requests need their HTTPS origins declared in the app configuration. Your Agent should use the platform's runtime settings rather than assume a committed environment file configures production. The [portable-app Skill](/skills/ohmyhost-build-portable-app/SKILL.md) contains the implementation details.

Check the Dev and Prod addresses in the Agent's response. They are different environments and may use different data. A branch isolates code changes; it does not itself isolate a database. Ask which database a test will write to before creating a record you intend to delete.

Dev on ohmyho.st is protected by default. Your Agent can retrieve the owner's reusable share link so you can open it. An anonymous error at the plain Dev URL does not by itself mean the deployment failed. The [environments guide](https://docs.ohmyho.st/environments) explains the access model.

## Test login and API calls

A login can work locally and fail on the new hostname. The identity provider may still send people back to localhost or an old preview address. Cookies can also belong to the old host, leaving the deployed app without a session.

Give your Agent the intended Dev and Prod origins. It should check callback URLs, logout URLs and trusted origins against the authentication provider you already use. Keep the account ownership clear: the login you use to manage hosting is separate from the login your app gives its users.

For an API request, the first question is whether it belongs in browser code or server code. Private credentials belong on the server. Your Agent can route a private request through the app's own server instead of exposing a credential to the browser. A public browser API still needs the external service to permit the intended origin.

Do not accept “I enabled CORS” as the whole explanation. Ask which origin is allowed and how the API checks authorization. A wildcard origin is not a fix for a credentialed browser request. The declaration in the hosting configuration does not configure the remote API on your behalf.

On ohmyho.st, Better Auth and customer-owned WorkOS AuthKit are documented integrations. Your Agent should follow the [application auth guide](https://docs.ohmyho.st/application-auth) for the selected provider. It can keep an existing provider where the app supports it; changing hosts is not a reason on its own to replace authentication.

Then test the full path yourself. Sign in with a test account, open a protected page, reload it, sign out and sign in again. An old browser session can hide a broken callback. When you add a custom domain, repeat the check because the public origin changes. A custom hostname uses about {{ credits unit.customHostnameMonth }} a month unless the project shows the “Powered by ohmyho.st” flag; access requires Paid or that flag on Free.

## Move local data

Look for a local database file before deploying. Your Agent may find SQLite configuration, a checked-in development database or a library that expects a persistent local disk. That can be a reasonable development setup, but it needs an explicit production plan on a runtime without that disk.

On ohmyho.st, the app runs on Workers and persistent application data belongs in the managed database or another supported service. A native database addon may also need replacement. The compatibility check should explain the issue before your Agent starts changing the application.

To find where data lives and plan the move, use:

```text
Inspect where this app stores data. Prepare a supported production setup while preserving its features and existing records. Explain what will change, use isolated development data for the trial, and show how you will verify record counts, relationships and new writes before any production switch.
```

Your Agent can prepare managed Postgres access, versioned schema migrations and a data-transfer plan. The database client uses the managed binding; it should not invent a connection string for that binding. A conversion from SQLite also needs a check of identifiers, dates, booleans and constraints. Moving the table names alone is not enough.

Review which data is being moved and which services remain where they are. For a Lovable export that uses Supabase, the [Supabase migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) applies only to the capabilities you choose to move. Authentication, file storage, functions and realtime behavior need their own checks. A database export does not recreate all of them.

At project creation, decide whether Dev and Prod share data and whether to use the default US region or the EU region. Ask your Agent to explain the consequences before it creates the project. A development preview with production data is useful in some circumstances, but you need to know when a test can affect real users.

The [database Skill](/skills/ohmyhost-manage-database/SKILL.md), [database guide](https://docs.ohmyho.st/database) and [migrations guide](https://docs.ohmyho.st/migrations) cover the supported operations. After the trial, open an existing record, create a disposable record, reload and verify both. If the app has related records, test that relationship too.

Database cost depends on selected RAM and activity. One active database hour at {{ number 512 }} MiB RAM costs {{ credits unit.activeDatabaseHour512 }}; the {{ number 256 }} MiB size available on Free costs {{ credits unit.activeDatabaseHour256 }}. Databases sleep after five idle minutes, with no active-RAM charge while asleep. Allocated disk and seven-day backups are included. Customer files and retained Worker scripts keep their separate rates. Ask your Agent to check scheduled jobs and health checks before assuming the database will stay idle; repeated requests can keep it awake.

## Replace committed secrets

Ask your Agent to inspect how the app handles secrets before deployment. A provider key in a committed environment file needs attention even if the repository is private. Deleting the file from the latest commit does not remove it from the history.

Treat an exposed credential as something to replace at its provider. Use your own signed-in account or the provider's approved flow, then supply the replacement through private secret input. Your Agent should ask for the credential's purpose and name in the conversation, not its value.

On ohmyho.st, local secret input reads from stdin, and the supported remote flow uses private input. The secret list returns names and metadata. The application source should document required names without containing the values. A managed source version and a GitHub repository need the same care.

Your Agent should also check that local secret files are ignored by Git and that credentials are absent from browser code, screenshots and notes. It should not copy its own hosting credentials into your application. The [secrets guide](https://docs.ohmyho.st/secrets) describes the supported input paths and reserved names.

To separate public settings from secrets, ask:

```text
Review secrets and environment variables in this project without printing their values. Separate public browser settings from private server settings. Identify credentials that need rotation, prepare the private input flow for replacements, and verify that the production build does not expose them.
```

Read the resulting list by purpose. A public client identifier is different from a key that can read private records or charge an account. If the distinction is unclear, ask your Agent to point to the provider's documentation before moving the value.

## Check the production build

A development server can hide configuration problems that appear in a production build. Browser settings may be embedded when the bundle is built. Private server settings need to be read when the deployed app handles a request. Supplying a secret later cannot repair code that expected it while building.

Your Agent should classify each setting by where and when the code reads it. Public Vite and Next.js settings become part of the browser output. A database password, private provider key or server credential must stay outside that output. A publishable key still needs the backend permissions intended by its provider.

On ohmyho.st, runtime secrets are absent from the build sandbox. Your Agent should read them from the supported runtime context when needed. If a library initializes at import time and demands a private setting during the build, the fix may be to initialize it later. It should inspect the failure rather than fill the gap with a hardcoded value.

The deployment plan quotes the build before it starts. The reservation is about {{ credits unit.buildReservation }} at {{ rate build.sandbox.standard-3 }}, then settles against measured build time. Ask your Agent to show that quote and follow the operation to completion. If it fails, it should read the relevant build output before changing dependencies or removing features. The [troubleshooting Skill](/skills/ohmyhost-troubleshoot-deployment/SKILL.md) covers failed or stuck operations.

A successful build is the point to begin browser checks. Open a route directly, reload it and try the feature that needs the new configuration. A homepage can work while an API route or login callback remains broken.

Deployed versions remain available for rollback and each script uses about {{ credits unit.deployedScriptMonth }} a month until cleaned up. Keep enough history for recovery, and have your Agent explain which version it plans to promote. This makes a later rollback a choice of a known version rather than a guess about which source was running.

## Verify the email sender

Email deserves a real test before launch. A form can report success even when its message was rejected. Password-reset and verification emails are especially important because users cannot complete the next step without them.

You can keep an external mail provider or use managed transactional mail on ohmyho.st. If you keep the provider, your Agent configures its private credential on the server and checks its permitted outbound origin. Mail owned by an external identity provider can stay with that provider.

Managed mail needs Paid and a sender domain you control. Your Agent starts setup and returns the DNS records to add, or uses an authorized DNS connection. It checks sending and receiving readiness separately. DNS verification can remain pending while records propagate, so the Agent should follow the existing operation and the returned retry guidance.

Once the sender is ready, test the app action that actually sends the message. Use an address you control, check delivery and follow the link. A provider reporting acceptance is useful evidence, but you also need to know that the recipient can use the result. Check the return address and the hostname inside a reset or verification link.

Managed mail uses {{ rate mail.sent }} per sent recipient, with no monthly mail-domain fee. Hosting does not require managed mail. Set it up when your app needs it; the managed Better Auth integration requires the database and does not make mail a general hosting prerequisite. See the [domains and mail Skill](/skills/ohmyhost-domains-and-mail/SKILL.md) and [email guide](https://docs.ohmyho.st/email).

## Review the Dev app

Continue the source you already have, whether it is managed source or a GitHub repository you authorize. The [deploy Skill](/skills/ohmyhost-deploy/SKILL.md) guides your Agent through that route. Containers remain outside the supported runtime.

To connect your Agent and start the Dev deployment, use:

```text
{{ prompt }}
```

After the Agent connects, ask it to prepare Dev and give you a short test list based on your app's features. Open the share link yourself. Check login, a protected page, a saved record and any files or email the app uses. Have the Agent report failed checks with the route and action that failed so you can repeat them after the fix.

Promote the tested version when you are ready. With isolated data, promotion applies migrations without copying your test rows into Prod. Confirm which database the promoted version will use, then repeat the important checks on the production address.

Set a monthly budget if you want a project limit. The budget can warn while work continues or stop new work. Every project draws from the organization's balance. Paid costs {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits. Monthly credits expire at period end; Paid-only top-ups carry over until a downgrade to Free.

Here is the example first month with managed mail, itemized from the published rate card:

{{ table workload.lovableFirstMonth }}

Database activity and storage make up much of this example. Keeping an external mail provider removes the managed-mail line from this bill, while that provider keeps its own charges. A static site without a database does not need these database rows. Ask your Agent to adapt the example to the features your app actually uses.

## Common questions

### Can an export deploy without changes?

Sometimes. A static app with no database, authentication or mail has fewer dependencies to configure. An app with those features needs an inspection before anyone promises a direct deployment. Ask your Agent to run the compatibility check and explain the required work before starting the build.

### What if the app uses Supabase?

Choose the capabilities you want to move. Your Agent should inventory actual database, Auth, Storage, Functions and Realtime usage, then follow the migration Skill for the selected scope. Keeping a service is a valid choice. Record which account operates it so the hosting move does not create a misleading picture of the remaining dependencies.

### How should I provide secret values?

Use the private input flow described above. Ask the Agent to name the required secret and explain its use without requesting the value in chat. Review the stored names and test the feature that needs each one. Keep export passwords and temporary database credentials out of source and notes too.

### Do I need Paid?

Hosting, Postgres and platform hostnames can use the Free grant of {{ number plan.freeCredits }} credits a month. Managed transactional mail needs Paid at {{ usd plan.paidUsd }} for {{ number plan.paidCredits }} credits. A customer domain needs Paid or a Free project displaying the “Powered by ohmyho.st” flag. Mail remains metered, and the linked domain uses no credits while the flag shows.

### Why does the Dev address show an error?

Dev is protected by default. Ask your Agent for the share link before diagnosing an anonymous response as a build failure. A project created with public Dev does not need that link; Prod on the platform hostname is public. Once access works, repeat the app action that failed and use its actual error to guide the next fix.

[Deploy from Claude Code](/for/claude-code) · [Move from Lovable](/from/lovable) · [Cost breakdown](/pricing/breakdown)
