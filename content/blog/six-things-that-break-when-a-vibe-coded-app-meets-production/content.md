# Six Things That Go Wrong When a Vibe-Coded App Goes Live

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published September 20, 2026 · Updated October 25, 2026

Your app works in the preview. Now have your agent check what it needs outside of this preview: production  URLs, a working login, pesristent data, private secrets, the correct build settings, and a verified email sender. A successful build only covers part of the process.

This gudie explains what you should hand over to your agent and what you should test yourself before people start using the app. The examples use ohmyho.st, where your agent prepares the deployment and makes it available on Dev for testing. The sample month below costs  about {{ credits workload.lovableFirstMonth }}; the Free plan grants {{ number plan.freeCredits }} credits per month.

Start with the existing repository and a brief description of the app's key features. Also describe what happens ater a user clicks a button—such as sending a password-reset email or saving an uploaded file. This is  easy to overlook when a preview looks complete.

For a Lovable repository, the [Guide to Hosting Afteer Export](/blog/host-a-lovable-app-after-export)] applies these checks to its environment variables, the Supabase connection, the login , and the routes.

## Check Production URLs

A local app can access  an API or database on your computer. After deployment, these addresses will continue to point to the computer that is executing the request. They do not become publicly accessiblle simply because the build was successful.

Have your agent find localhost addresses and identify the service behind each one. Some should map to app routes on the same  origin. Others need the address of a hosted service. A sample environment file lists the necessary settings, but does not prove that the acctual values have been set.

Have  your aggent look for deployment blockers:

```text
Check this app for deployment blockers. Find local URLs, missing configuration, login callbacks and external API calls. Explain which feature each affects, fix the code where needed, and list the account settings I must supply. Use a development environment for checks that write data.
```

On ohmyho.st , your agent performs the compatibilitty check and resolves any blockers. Runtime secrets are provided to the deployed app separately from the build. Outbound requests require their HTTPS origins to be declared in the app configuration. Your agent should use the platform’s runtime settings and not assume that a checked-in environment file configures the production environment. Implementation details are available in the [Portable App Skill](/skills/ohmyhost-build-portable-app/SKILL.md).

Check the Dev and Prod addresses in your agent's response. These are different environments that may  use different data. A branch isolates code changes, but not a daabase. Ask which database a test writes to before you create a record that you plan to delete later.

Dev on ohmyho.st is protected by default. Your agent can retrieve the owner's reusable sare link so you can open the page. An anonymous error under the simple Dev URL does not necessarily mean that the deployment has  failed. The [Environments Guide](https://docs.ohmyho.st/environments) explains the access model.

## Testing Login and API Calls

A login may work locally but fail on the new hostname. The identity provider may still redirect uers back to  localhost or an old preview address. Cookies may also be associated with the old host, so the deployed app will not have a session.

Provide your agent with the designated dev and prod origins. They should synchronize callback URLs, logout URLs , and trusted origins with the authentication provider you’re already using. Keep the account mapping clear: The login you use to manage the hosting is separate from the login your app provieds to its users.

When making an API  request, the first question is whether it belongs in browser code or server code. Sensitive credentials belong on the server. Your agent can route a sensitive request throguh the app’s own server instead of exposing credentials in the browser. However, a public browser API still requires that the external service allow the intended origin.

Don't accept "I've enabled CORS" as a complete explanation. Ask which origin is allowed and how the API verifies  authorization. A wildcard origin is not a solution for a browser request with credentials. The declaration in the hostiing configuration does not set up the external API on your behalf.

Better Auth and the WoorkOS AuthKit you operate are documented integrations on ohmyho.st. Your agent should follow the [App Authentication Guide](https://docs.ohmyho.st/application-auth) for the selected provider. It can retain an existing provider if the app supports it; a  host change alone is not a reason to replace the authentication.

Then test the entire process yoursself. Log in with a test account, open a protected page, reload it, log out , and log back in. An old browser session can hide a broken callback. If you add your own domain, repeat the test because the puublic origin will change. A custom hostname costs about {{ credits unit.customHostnameMonth }} per month, unless the project displays the “Powered by ohmyho.st” label; access  requires a paid plan or this label for the free plan.

## Move Local Data

Before deployment, check for a local database file. Your agent might find an SQLite configuration, a checked-in development database, or a library that exepcts a persistent local hard drive. This may be a reasonable development setup , but it requires an explicit production plan for runtime without that hard drive.

On ohmyho.st, the app runs on  Workers, and persistent application data belongs in the managed database or another supported service. A native database add-on may need to be replaced. The compatibility check shhould explain the issue before your agent begins modifying the application.

To find out where your data is stroed and  plan the move, use:

```text
Inspect where this app stores data. Prepare a supported production setup while preserving its features and existing records. Explain what will change, use isolated development data for the trial, and show how you will verify record counts, relationships and new writes before any production switch.
```

Your agent can set up managed Postgres access , versioned schema migrations, and a plan for data migration. The database client uses the managed connection; it should not create its own connection string for this purpose. Migrating from SQite also requires checking identifiers, date values, Booleans, and constraints. Simply renaming the tables is not enough.

Check which data will be migrated and which services will remain in place. For a Lovabe export that uses Supabase, the [Supabase Migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) applies only to the features you want to migrate. Authentication, file storage, features, and real-time behavior require separate checks. A  database export does not restore all of these.

When creating a project , decide whether Dev and Prod will share data and whether to use the US or EU region by default. Have your agent explain the implications before creating the project. A development preview with production data may be ueful in some cases, but you need to know when a test might affect real users.

The [Database Sikll](/skills/ohmyhost-manage-database/SKILL.md), the [Database Guide](https://docs.ohmyho.st/database), and the [Migration Guide](https://docs.ohmyho.st/migrations) cover the supported operations. After testing, open an existing  record, create a temporary record, reload the page, and check both. If the app has linked records, test that relationship as well.

Database cossts depend on the selected RAM  and activity level. One active database hour with {{ number 512 }} MiB of RAM costs {{ credits unit.activeDatabaseHour512 }}; the {{ number 256 }} MiB plan available on the Free tier costs {{ credits unit.activeDatabaseHour256 }}. Databases go into sleep mode after five minutes of inactivity , with no RAM charges while in sleep mode. Allocated storage and seven-day backups are included. Customer files and stored worker scripts have their own rates. Have your agent check scheduled jobs and health checks before assuming the database will remain idle; repeated reqquests can keep it awake.

## Replace Checked-In Secrets

Before deployment, have your agent check how the app handles secretts. A provider key in a checked-in environment file requires attention , even if the repository is private. Deleting the file in the last commit does not remove it from the history.

Treat a disclosed access token as something that needs to be replaced by the provider. Use your own registered account or the provider’s approved process, and then generate the replacement by entering the private secret. Your aent should ask about the purpose and name of the access token during the conversation , not its value.

On ohmyho.st, the local Secret input is read from stdin, and the supported remote execution uses a private input. The secret list returns only nammes and  metadata. The application source code should document the required names without including the values. A managed source version and a GitHub repository require the same level of care.

Your agent should also verify that local secret files are ignorred by Git and that credentials do not appear in browser code, screenshots , or notes. They should not copy their own hosting credentials into your application. The [Secrets Guide](https://docs.ohmyho.st/secrets) describes the supported input formats and reserved names.

To separate public settings from secretts , ask:

```text
Review secrets and environment variables in this project without printing their values. Separate public browser settings from private server settings. Identify credentials that need rotation, prepare the private input flow for replacements, and verify that the production build does not expose them.
```

Review the  resulting list by purpose. A public clinet identifier is not the same as a key that can read private records or debit an account. If the difference is unclear, have your agent refer to the provider's documentation before moving the value.

## Check the production build

A development server can mask configuration isuses that occur in a production build. Browser settings can be  embedded when the bundle is created. Private server settings must be read when the deployed app processes a request. Setting a secret after the fact cannot fix the fact that the code was already expecting it during the build.

Your agent should classify each setting based on where and when the code reads it. Public Vite and Next.js setttings become part of the browser output. A database password, a private provider key , or server access credentials must remain outside of this output. A publishable key still requires the backend permissions provided by its provider.

On ohmyho.st , runtime secrets are not available in the build sandbox. Your agent should read them from the supported runtime context as needed. If a library initializes during import and requires a private setting as early as the build phase, the solution may be to initializze it later. Your agent should investigate the error instead of filling the gap with a hard-coded value.

The deployment plan specifies the build cost before it starts. The reservation ranges from approximately {{ credits unit.buildReservation }} to {{ rate build.sandbox.standard-3 }} and is then settled based on the measured build time. Have your agent display this estimate and monitor the process until it completes. If it fails , the agent should review the relevant build output before changing dependencies or remmoving features. The [troubleshooting skill](/skills/ohmyhost-troubleshoot-deployment/SKILL.md) handles failed or stalled processes.

A successful build is the moment to start testing in the browser. Open a route directly, reload it , and try out the feature that requires the new configuraton. A home page might work, while an API route or a login callback might still be broken.

Deployed versions remain available for rollbacks, and each script costs approximately {{ credits unit.deployedScriptMonth }} per month until it is cleaned up. Keep enough history for a restore and have your agent specify which version it wants to deploy. This way , a later rollback becomes a matter of choosing a known versoin rather than guessing which source code was running.

## Check the email sender

Emails deserve a thorough test before launch. A form may report success even if the  message was rjected. Password reset and confirmation emails are especially important because users cannot complete the next step without them.

You can keep using an external email provider or use the managed transactional email service on ohmmyho.st. If you keep your current provider , your agent will configure its private credentials on the server and verify the permitted outgoing origin. Emails from an external identity provider can remain with that provider.

Managed email requires a Paid plan and a sendeer domain that you own. Your agent will start the setup process and provide the DNS records you need to add , or use an authorized DNS connection. The agent will verify sending and receiving capabilities separately. DNS verification may remain pending while the records propagate; your agent should then follow the existing process and the returned repeat instructions.

Once the sender is ready, test the app action that actually sends the message. Use an email address that belongs to you, verify delivery, and follow the link. The provider’s notification that the message was accepted is useful proof, but  you also need to know that the recipient can use the result. Check the reply-to address and the hostname in the password reset or confiramtion link.

Managed email cots {{ rate mail.sent }} per recipient to whom a message is sent , with no monthly fee for the email domain. Hosting does not require managed email. Set it up if your app needs it; the managed Better-Auth integration requires the database and does not make email a general requirement for hosting. See the [Domains and Email Skill](/skills/ohmyhost-domains-and-mail/SKILL.md) and the [Email Guide](https://docs.ohmyho.st/email).

## Check the Dev App

Continue working with the source code you already have , whether it's managed source code or a Gitub repository that you've authorized. The [Deploy skill](/skills/ohmyhost-deploy/SKILL.md) guides your agent through this process. Containers remain outside the supported runtime.

To cnnect your agent and start  the dev deployment, use:

```text
{{ prompt }}
```

Once the agent has connected, ask them to set up Dev and provide you  with a short test list based on your app's features. Open the share link yourself. Test the login, a protected page, a saved reecord, and all files or emails that the app uses. Have your agent report any failed tests, including the route and action that caused the failure, so you can retest them after making the necessary corrections.

Deploy the tested version when you're ready. With isolated data, the deployment applies migrations without copying your test data to production. Confirm which database the deployed version will use, and then  repeat the key tets on the production environment.

Set a monthly budget if you want to set a limit on the project. The budget can trigger a warning while work continues, or stop new work from being added. Each project draws from the organization's balance. The Paid plan costs {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits. Monthly crredits expire at the end of the billing  period; top-ups never expire.

Here is an examlpe month  with managed email, broken down according to the published price list:

{{ table workload.lovableFirstMonth }}

Active database hours make up a large portion of this example; the selected database size includes storage and seven-day backups. If you use an external email provider, the line item for managed email will be omitted from this invoice, whiile that provider retains its own costs. A static page without a database does not require these database lines. Have your agent customize the example to match your app’s  features.

## Frequently Asked Questions

### Can an export be deployed without any changes?

Sometimes. A static app without a database , authentication, or email has fewer dependencies to configure. An app with these features needs to be reviewed before anyone approves a direct deployment. Have your agent run the compatibility checck and explain the necessary work before the build starts.

### What if the app uses Supabase?

Select the functions you want to migrate. Your agent should track the actual usage of the database, authentication, storage, functions , and real-time services, and then follow the migration guide for the selected scope. Keeping a service is a valid option. Make a note of which account is running it so that the host change doesn’t create a misleading piture of the remaining dependencies.

### How do I specify Secret values?

Use the private input metod described above. Ask the agent to provide the required secret and explain how to use it, without requesting the value in the chat. Check the stored names and test the function that each one requires. Also , keep export passwords and temporary database credentials out of source code and notes.

### Do I need Paid?

Hosting, Potgres, and platform hostnames can use the free credit of {{ number plan.freeCredits }} credits per month. Managed transactional email requires a  Paid plan with {{ usd plan.paidUsd }} for {{ number plan.paidCredits }} credits. A customer domain requires a Paid plan or a Free project with the "Powered by ohmyho.st" label. Email continues to be billed based on usage, and the linked domain does not consume any credits as long as the label is displayed.

### Why does the Dev address show an error?

Dev is protected by default. Please ask your agent for the share link before interpreting an anonymous response as a  build error. A project created with a public Dev environment does not need this link; Prod under the platform hostname is pbulic. Once access is working, repeat the failed app action and use its actual error to guide the next fix.

[Deploy with Claude Code](/for/claude-code) · [Switch from Lovable](/from/lovable) · [Cost breakdown](/pricing/breakdown)
