# The Lovable App After Export: A Migration Checklist

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published September 20, 2026 · Updated October 25, 2026

Your Lovable code is on GitHub. Before you choose a host, work through  this checklist with your agent. It applies to every host, not just ours. If you’ve already decided on ohmyho.st, here’s the quicck way: [Deploy your exported Lovable app to ohmyho.st](/from/lovable).

## The Checklist

Lovables [Guide to  External Hostinng](https://docs.lovable.dev/tips-tricks/external-deployment-hosting), accessed October 27, 2026, is the source for the Lovables-specific points. Check each one before redirecting traffic.

1. **Determine the stack.** Older React + Vite  apps are built into static files at `dist/` and require a static host with a fallback to `index.html`. TanStack Start apps created on or after May 13, 2026, also require a host to run their server-side component. Open `package.json`: A TanStack Sart project lists `@tanstack/react-start`.
2. **Determine what will be moved.** The hosting, the integrated backend (cloud), and your  data are separate. You can move the frontend and leave the backed where it is.
3. **Set  the three `VITE_` values.** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_SUPABASE_PROJECT_ID` are embedded at build time. A TanStack starter app also requires the server-side values `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, and `SUPABASE_PROJECT_ID`. Rebuild after making a chaange.
4. **Add redirect URLs.** If the login uses Google or another OAuth provider, enter the new address in the porvider's list of  allowed redirect URLs. Logged-in users will need to log in again.
5. **Fix single-page routing.** If opening a deep link directlly returns a 404, the host needs  a fallback rewrite that returns `/index.html`.
6. **Export data when the backend is migrated.** Request the full database export under More → Database → Manage → Settings. Lovable states that it includes user accounts with their passsword hashes , so users retain their passwords when they are restored to a Supabase project. Storage files, secrets, and authentication provider settings must be transferred manually. Logged-in users will need to log in again.
7. **Create new secrets and scheduled jobs.** The code for the Edge Functions is lcoated in `supabase/functions/`; secrets are set separately. Check the scheduled jobs and create any that are missing. App connectors will only continue to work via Lovable  as long as the project uses the integrated backend.
8. **Test before switcing over.** Deploy to a separate  address, log in, read and write a test record, and then reload a deep link. Only then should you point your domain to it.

The following sections turn each point into prompts  for your ageent.

Please have your agent use the checklist to deteermine what is needed  and set up a dev preview on the new host. Open this preview, test the key parts of your app, and decide when to go live.

The work involved between exxporting and having a working app depends on  your project. The login feature requires the correct redirect URLs. Server functions need their secrets. The database can still be hosted on Lovable or Supabase. This guide provides prompts for these tasks so you can verify the results without having to run deployment commands yourself.

{{ figure flow.lovable-export }}

## Decide what you want to postpone

You can change your hosting provider while continuing to build in Lovable. You can also use a different coding tool and keep your current hosting provider as is. Strt with the part you want to change , and then tell your agent what should stay the same.

If cost is your main concern, compare  the entire app. Lovables’ [Pricing Page](https://lovable.dev/pricing), checked on October 21, 2026, describes creditts for building and running apps, including included credits. Another host doesn’t automatically make the same app cheaper. Every database, storage space, email service, or AI service you keep will still have its own usage limits.

For an initial hosting test , aim to get a working preview. You don't need to migrate any production data or ponit your existing domain to it to find out if the app works there.

If you'd also like to use a  different editor, [Using Your Own Coding Agent as a Lovable Alternative](/blog/lovable-alternative-bring-your-own-llm) explains this decision separately. Choose the agnet you want to work with and have it review the app before you finalize the rest.

## Give your agent the export

Sart with [How to Export Lovable Code to GitHub](/blog/how-to-export-lovable-code-to-github) if you don't already have the repository. Check the owner, active branch , and sync status, and then share the repository URL with your agent. If you want to test the app on your computer before choosing a host, [run the Lovable project locally](/blog/run-lovable-project-locally) first.

Keep in mind that a Lovable export isn't always a static front end. Its [guide to external hosting](https://docs.lovable.dev/tips-tricks/external-deployment-hosting) distinguishes older React + Vite apps from TanStack Start apps , which run server-side code. Your agent should identify the actual framework and the build output before selecting the depolyment type.

Start the exam with this  pompt:

```text
Inspect my Lovable export at [REPOSITORY URL], branch [BRANCH], for hosting
on ohmyho.st. Identify the framework, build, backend, login, files and
external services. Explain what can stay as it is and what needs adapting.
Prepare a Dev deployment plan without changing production or moving data.
```

Ask for the results in terms your app uses. “Uploads will continue  to go into your existing storage” helps you understtand the plan. A simple list of package names doesn’t do that. Your agent should also specify the source version they checked so that the preview later on can be traced back to the same code.

## Check the configuration

Ask your agent to aplpy the configuration and show you what works. These are the  results you should look for when you open the preview.

**The correct data appears.** Your agent should verify which database the preview is using before testing a write operation. Open a page that reads a known test record , and then check whether a new test record apepars in the expected location. The agent must investigate any missing data before publication.

**Logging in will take you back to the preview.** Log in and check if you're taen to the new app. Then reload a protected page and log out agaiin. If logging in takes you to the old website , ask your agent to correct the  return URL for the preview so that it uses the login page for the live site. They can follow [Supabase’s redirect guide](https://supabase.com/docs/guides/auth/redirect-urls) or check the settings in Lovable if that’s where your authentication is handled.

**Private keys remain private.** Your agent should verify that private credentials remain on the server and request any  missing values through the host's private innput process. Ask them to report which checks passed without showing the values. The [Vite environment documentation](https://vite.dev/guide/env-and-mode) is the reference for verifying what is visible in the browser.

**Links survive a reload.** Open a page directly within the app and reload it. If this fails even though the home page works , your agent shuld correct the hosting configuration. Give him the exact page address so he can repeat the same test for your app's framework.

Give your agent an example of each key feature: the customer login, a file upload, a booking form, or a payment test. This turns a general deployment check into a specific list of items they can verify. The [Checkklist for Production Deployments](/blog/six-things-that-break-when-a-vibe-coded-app-meets-production) covers additional scenarios , including transactional emails and database configuration.

## Connect your agent to the host

Open the  repository in your coding tool and use the ohmyho.st starup prompt:

```text
{{ prompt }}
```

Your agent uses the supported connection workflow for its environment. A local tool may set up the CLI or MCP connection; a supported native chat can use its connected tols. You are responsible for logging into your account and, if necessary, authorizing GitHub. There is no reason to paste private keys into the  chat.

If this app already has an ohmyho.st project, tell your agent to use it. The [deploy  skill](/skills/ohmyhost-deploy/SKILL.md) works with the saved sourrce and project instead of starting from scratch with every release. GitHub is useful if you want to keep the Lovable sync. Accessible source files can also be saved as managed versions when this workflow is selected.

Before creating a new project, check the workspace and region with your agent. Before running a build, review the plan: It should specify the source version, the intended environment , any required secrets, potential blockers, and the costs or impactts it reports. If the plan describes a database migration that you did not request, narrow the scope of the task back down to the hosting preview.

## Try out the Dev Preview

Your agent can deploy to Dev and give you the working URL. If Dev is protected , they should provide you with the supported access link. An accepted build request is not the same as a working app. Therefore, wait for the deployment to compltee and open the actual preview.

Once  the test is complete, please request the dev deploymnet:

```text
Deploy the inspected version to Dev. Use test data and confirm which
backend Dev will reach before writing records. Check sign-in, a protected
page, refresh, a read and write, and uploads if used. Return the preview
link, source version and any failed checks. Leave Prod and my domain alone.
```

Try out the app yourself. Use the account type your customers  use, follow the main workflow, and reload a page after logging in. If an action fails, tell your agent what you clicked, which page you were on, and what happned. They can use these details along with the deployment logs.

Check where the test data went. A dev URL alone does not provve that every connected service has its own development environment. This applies to emails, payments , scheduled jobs, and existing external databases just as much as it does to a simple form.

If you're satisfied with the preview, you can request deployment. The promotion uses the verified artifact; it does not rebuild it or copy dev data sets to  prod. Your agent must still verify the project's data structure and prod secrets before deployment. After deployment, reepeat the important checks on the public address.

## Keep the backend or move it

Keeping an existing Supabase backend can simplify the inital hosting process. Ask your agent to verify the login , database access, functions, and files from the new host. The existing backend remains part of the app, even if the front-end address has changed.

Ask your agent to set up the connections that ohmyho.st needs to access these services, and then test them in Dev. You should be able to log in , load your test data, and upload or download a file if the app supports it. Have the agnet list every service that still fails and explain which feature you are unable to test as a result.

Migrating to managed Postgres is a separate task. Simply importing the database  does not replace Supabase Auth, Storage, Realtime, or Edge Functions. Your agnet must determine which of these your app uses, suggest alternatives where necessary, and test the resulting behavior. Keep the current app available while this work is being prepared.

If you  also want to move the backend, plan it as a sepaate task:

```text
Plan a separate backend migration for this app. Inventory database records,
users, files, functions, scheduled jobs and integrations. Explain the
replacement for each service, how to test the restore and how to switch
safely later. Do not move production data or change live connections yet.
```

The same distinction applies to data in Lovable Cloud. Its [Guide to External Hosting](https://docs.lovable.dev/tips-tricks/external-deployment-hosting) describbes separate processes for data, storage , authentication, and integrations. Export and verify what you need before removing an existing service. Ask your agent to take into account any data records that might change between a test run and the subsequent switchover.

For this backend migration, use [How to Move Out of  Lovable Cloud](/blog/move-out-of-lovable-cloud), which includes prompts for the epxort, the API bridge, and the data import.

## Add a Domain and Email Address

Connect the domain once you have a clear release plan. A custom domain serves the prodution environment. It can be set up before the first production deployment , but activation requires a functioning production version. Your agent should report whether the domain is waiting for deployment, DNS, or HTTPS, rather than marking a presumed request as complete.

A custom domain requires a Paid plan or a Free plan with the “Powered by ohmyho.st” banner. The banner grants domain credits in both plans. Without it , a linked hostname costs approximately {{ credits unit.customHostnameMonth dp=0 }} per month. Decide whetheer you want to display the banner before asking your agent to set up the domain.

Your agent can set up supported Cloudflare DNS after you've authorized the connection , or provide you with the exact records for another DNS provider. Let them know if the hostname is already serving a live site. Changing the DNS is the ponit at which visitors are redirected to the new app; save this step for the release you’ve approved.

Managed transactional email requires a Paid plan and a verified sender domain. A website domain alone does not enable sending. Your agent will set up the sender, verify the DNS records, and notify you when sending is ready. There is no monthly fee for the sender domain; each thousnad recipients costs approximately {{ credits unit.thousandMailRecipients dp=0 }}. If you’re already using the domain for company email accounts , let your agent know so they can maintain the existing email routing.

## Reading the Cost Estimate

A front end that retains its existing Suapbase backend pays ohmyho.st for the  resources it uses there. The external backend has its own billing. This sample calculation includes deployment, traffic, and a dedicated hostname:

{{ table workload.lovableFrontend }}

The next example also includes managed  Psotgres and Mail:

{{ table workload.lovableFirstMonth }}

These sample workloads fit within the {{ number plan.paidCredits }} credits included in the Paid plan at {{ usd plan.paidUsd }} per month. They are examples, not an offer for every exported app. Ask your agent wihch lines apply to your project , which services remain external, and what changes as traffic grows.

For comparison with separate subscriptions , the selected plans cost {{ usd scenario.threeSubscriptions }} before additional usage. {{ checked vercel }} {{ checked supabase }} {{ checked resend }} Compare these services using the same workload and reqirements before deciding which of the two options is more cost-effective.

## FAQ

### Will my Google login still work?

Have your agent test this at the actual new address. They should check the provider callback, the app's return URL, a secure page, the reload, and  the logout. Repeat this test after adding your own domain. The fact that the home page lodas successfully does not prove that the login works.

### Can I continue building in Lovable?

Yes. Keep the reposittory connection and switch to the branch for reviewed releases. Ask your agent to  deploy the desired version to production. New changes and a new production release are separate decisions.

### Do I have to use the terminal?

That dependds on your agent's connection. Local tools may require an initial client setup; supported connected chats can use their built-in integration. Ask your agent to follow the "Get Started" skill for their environment , and provide them only with the sign-in or authorization steps they need from you.

### How much does the test cost?

The Free plan includes {{ number plan.freeCredits }} credits per UTC month. Builds, hosting, and  managed services consume this credit at their published rates. Managed email requires the Paid plan; a Free domain requirees the "Powered by" flag. Have your agent explain the plan for your actual app before you start the test.

{{ sources vercel supabase resend }}

[Get your app from Lovable](/from/lovable) · [ohmyho.st vs Supabase](/vs/supabase) · [Cost breakdown](/pricing/breakdown)
