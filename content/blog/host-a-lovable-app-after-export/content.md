# Lovable app after export: a migration checklist

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published September 20, 2026 · Updated October 27, 2026

Your Lovable code is in GitHub. Before you pick a host, work through this checklist with your Agent. It applies to any host, not only ours. If you have already decided to deploy on ohmyho.st, the short path is [Deploy your exported Lovable app on ohmyho.st](/from/lovable).

## The checklist

Lovable's [external-hosting guide](https://docs.lovable.dev/tips-tricks/external-deployment-hosting), read October 27, 2026, is the source for the Lovable-specific items. Check each one before you move traffic.

1. **Identify the stack.** Older React + Vite apps build to static files in `dist/` and need a static host with a fallback to `index.html`. TanStack Start apps created from May 13, 2026 also need a host that runs their server part. Open `package.json`: a TanStack Start project lists `@tanstack/react-start`.
2. **Decide what moves.** Hosting, the built-in backend (Cloud) and your data are separate. You can move the frontend and leave the backend where it is.
3. **Set the three `VITE_` values.** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_SUPABASE_PROJECT_ID` are embedded at build time. A TanStack Start app also needs the server-side `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_PROJECT_ID`. Rebuild after changing them.
4. **Add redirect URLs.** If login uses Google or another OAuth provider, add the new address to the provider's allowed redirect URLs. Users who are signed in will need to sign in again.
5. **Fix single-page routing.** If opening a deep link directly returns 404, the host needs a fallback rewrite that serves `/index.html`.
6. **Export data if the backend moves.** Request the full database export under More → Database → Manage → Settings. Lovable says it includes user accounts with their password hashes, so users keep their passwords when restored into a Supabase project. Storage files, secrets and sign-in provider settings are manual. Users who are signed in need to sign in again.
7. **Recreate secrets and scheduled jobs.** Edge Function code is in `supabase/functions/`; secrets are set separately; inventory scheduled jobs and recreate missing ones. App connectors keep working through Lovable only while the project uses the built-in backend.
8. **Test before switching.** Deploy to a separate address, sign in, read and write a test record, then reload a deep link. Only then point your domain at it.

The sections below turn each item into prompts for your Agent.

After the checklist, ask your Agent to check what it needs and prepare a Dev preview on the new host. Open that preview, test the important parts of your app and decide when to make it live.

The work between export and a working app depends on your project. Login needs the right return URLs. Server functions need their secrets. The database may still be with Lovable or Supabase. This guide gives you prompts for those jobs so you can review the result without working through deployment commands yourself.

{{ figure flow.lovable-export }}

## Decide what you want to move

You can change hosting while continuing to build in Lovable. You can also use another coding tool while leaving the current hosting alone. Start with the part you want to change, then tell your Agent what should stay in place.

If cost is your reason, compare the full app. Lovable's [pricing page](https://lovable.dev/pricing), checked October 21, 2026, describes credits used for building and running apps, with included grants. A different host does not automatically make the same app cheaper. Any database, storage, email or AI service you keep will still have its own usage.

For a first hosting trial, aim for a working preview. You do not need to move production data or point your existing domain at it to find out whether the app works there.

If you also want a different editor, [using your own coding agent as a Lovable alternative](/blog/lovable-alternative-bring-your-own-llm) explains that decision separately. Pick the Agent you want to work with, then let it inspect the app before you choose the rest.

## Give your Agent the export

Start with [How to export Lovable code to GitHub](/blog/how-to-export-lovable-code-to-github) if you do not have the repository yet. Check its owner, active branch and sync status, then share that repository URL with your Agent. If you want to try the app on your computer before choosing a host, [run the Lovable project locally](/blog/run-lovable-project-locally) first.

Keep in mind that a Lovable export is not always a static frontend. Its [external-hosting guide](https://docs.lovable.dev/tips-tricks/external-deployment-hosting) distinguishes older React + Vite apps from TanStack Start apps that run server code. Your Agent should identify the actual framework and build output before choosing how to deploy it.

Start the inspection with this prompt:

```text
Inspect my Lovable export at [REPOSITORY URL], branch [BRANCH], for hosting
on ohmyho.st. Identify the framework, build, backend, login, files and
external services. Explain what can stay as it is and what needs adapting.
Prepare a Dev deployment plan without changing production or moving data.
```

Ask for the result in terms of your app. “Uploads still go to your existing storage” helps you understand the plan. A list of package names alone does not. Your Agent should also name the source version it inspected so the later preview can be traced back to the same code.

## Check the configuration

Ask your Agent to handle the configuration and show you what works. These are the results to look for when you open the preview.

**The right data appears.** Your Agent should confirm which database the preview uses before testing a write. Open a page that reads a known test record, then check that a new test record appears in the intended place. Missing data is something for the Agent to investigate before publication.

**Login returns to the preview.** Sign in and check that you land on the new app, then reload a protected page and sign out. If login sends you to the old website, ask your Agent to fix the preview's return address while preserving the live site's login. It can follow [Supabase's redirect guidance](https://supabase.com/docs/guides/auth/redirect-urls) or check the settings in Lovable if that is where your authentication runs.

**Private keys stay private.** Your Agent should check that private credentials stay on the server and request missing values through the host's private input flow. Ask it to report which checks passed without showing the values. [Vite's environment documentation](https://vite.dev/guide/env-and-mode) is the reference for its browser-exposure check.

**Links survive a refresh.** Open a page inside the app directly, then refresh it. Your Agent should fix the hosting configuration if that fails while the homepage works. Give it the exact page address so it can repeat the same check for your app's framework.

Give your Agent an example of each feature that matters: the customer login, a file upload, a booking form or a payment test. That turns a general deployment review into a concrete list of things it can verify. The [production deployment checklist](/blog/six-things-that-break-when-a-vibe-coded-app-meets-production) covers more cases, including transactional mail and database configuration.

## Connect your Agent to the host

Open the repository in your coding tool and use the ohmyho.st entry prompt:

```text
{{ prompt }}
```

Your Agent uses the supported connection flow for its environment. A local tool may set up the CLI or MCP connection; a supported native chat can use its connected tools. You complete the account sign-in and any GitHub authorization. There is no reason to paste private keys into the chat.

If this app already has an ohmyho.st project, tell your Agent to use it. The [deploy Skill](/skills/ohmyhost-deploy/SKILL.md) supports the saved source and project rather than starting over for each release. GitHub is useful when you want to keep the Lovable sync. Accessible source files can also be saved as managed versions when that is the selected workflow.

Before a new project is created, check the workspace and region with your Agent. Before a build, read the plan: it should identify the source version, the intended environment, required secrets, any blockers and the costs or effects it reports. If the plan describes a database move you did not ask for, narrow the task back to the hosting preview.

## Test the Dev preview

Your Agent can deploy to Dev and return its working address. If Dev is protected, it should give you the supported access link. An accepted build request is not the same as a working app, so wait for the completed deployment and open the actual preview.

When the inspection is done, ask for the Dev deployment:

```text
Deploy the inspected version to Dev. Use test data and confirm which
backend Dev will reach before writing records. Check sign-in, a protected
page, refresh, a read and write, and uploads if used. Return the preview
link, source version and any failed checks. Leave Prod and my domain alone.
```

Try the app yourself too. Use the account type your customers use, follow the main flow and reload a page after signing in. If an action fails, tell your Agent what you clicked, which page you were on and what happened. It can use that detail with the deployment logs.

Check where the test data went. A Dev URL does not by itself prove that every connected service has a separate development environment. This matters for emails, payments, scheduled jobs and existing external databases as much as it does for a simple form.

When you are happy with the preview, you can ask for publication. Promotion uses the verified artifact; it does not rebuild it or copy Dev records into Prod. Your Agent still needs to check the project's data arrangement and Prod secrets before publishing. After publication, repeat the important checks on the public address.

## Keep the backend or move it

Keeping an existing Supabase backend can make the initial hosting task smaller. Ask your Agent to verify its login, database access, functions and files from the new host. The existing backend remains part of the app even though the frontend address has changed.

Ask your Agent to configure the connections ohmyho.st needs to reach those services, then verify them in Dev. You should be able to sign in, load your test data and upload or download a file if the app supports it. Have the Agent name any service that still fails and explain which feature that prevents you from testing.

Moving to managed Postgres is a separate job. A database import alone does not replace Supabase Auth, Storage, Realtime or Edge Functions. Your Agent needs to identify which of those your app uses, propose replacements where required and test the resulting behavior. Keep the current app available while that work is prepared.

If you decide to move the backend as well, plan it as a separate job:

```text
Plan a separate backend migration for this app. Inventory database records,
users, files, functions, scheduled jobs and integrations. Explain the
replacement for each service, how to test the restore and how to switch
safely later. Do not move production data or change live connections yet.
```

The same distinction applies to data in Lovable Cloud. Its [external-hosting guide](https://docs.lovable.dev/tips-tricks/external-deployment-hosting) describes separate work for data, storage, authentication and integrations. Export and verify what you need before removing any existing service. Ask your Agent to account for records that could change between a rehearsal and the eventual switch.

For that backend move, use [How to move out of Lovable Cloud](/blog/move-out-of-lovable-cloud), with prompts for the export, the API bridge and importing your data.

## Add your domain and email

Connect the domain after you have a clear publication plan. A custom domain serves Prod. It can be prepared before the first production deployment, but activation needs a working Prod version. Your Agent should report whether the domain is waiting for deployment, DNS or HTTPS rather than calling an accepted request finished.

A custom domain requires Paid, or a Free project showing the “Powered by ohmyho.st” flag. The flag waives domain credits on either plan. Without it, a linked hostname costs about {{ credits unit.customHostnameMonth dp=0 }} per month. Decide whether to show the flag before asking your Agent to configure the domain.

Your Agent can handle supported Cloudflare DNS after you authorize the connection, or give you the exact records for another DNS provider. Tell it if the hostname already serves a live site. Changing its DNS is the point where visitors can move to the new app; keep that step for the release you have approved.

Managed transactional email needs Paid and a verified sender domain. A website domain alone does not enable sending. Your Agent sets up the sender, checks the DNS records and reports when sending is ready. The sender domain has no monthly fee; each thousand sent recipients costs about {{ credits unit.thousandMailRecipients dp=0 }}. If you already use the domain for company inboxes, tell your Agent so it preserves that mail routing.

## Read the cost estimate

A frontend that keeps its existing Supabase backend pays ohmyho.st for the resources it uses here. The external backend keeps its own bill. This worked example includes deployment, traffic and a custom hostname:

{{ table workload.lovableFrontend }}

The next example also includes managed Postgres and mail:

{{ table workload.lovableFirstMonth }}

These example workloads fit within the {{ number plan.paidCredits }} credits included with Paid at {{ usd plan.paidUsd }} per month. They are examples, not a quote for every exported app. Ask your Agent which rows apply to your project, which services remain external and what changes when traffic grows.

For the separate-subscription comparison, the selected plans total {{ usd scenario.threeSubscriptions }} before additional usage. {{ checked vercel }} {{ checked supabase }} {{ checked resend }} Compare those services with the same workload and requirements before deciding that either arrangement is cheaper.

## FAQ

### Will my Google login keep working?

Have your Agent verify it on the actual new address. It should check the provider callback, the app's return URL, a protected page, reload and sign-out. Repeat that check after adding a custom domain. A successful homepage load does not establish that login works.

### Can I keep building in Lovable?

Yes. Keep the repository connection and agree on the branch used for reviewed releases. Ask your Agent to deploy the version you want live. New edits and a new production release are separate decisions.

### Do I have to use the terminal?

That depends on your Agent's connection. Local tools may need initial client setup; supported connected chats can use their integration. Ask your Agent to follow the get-started Skill for its environment and give you only the sign-in or authorization steps it needs you to complete.

### What does it cost to try?

Free includes {{ number plan.freeCredits }} credits per UTC month. Builds, hosting and managed services use that balance at their published rates. Managed mail needs Paid; a Free custom domain needs the powered-by flag. Have your Agent explain the plan for your actual app before starting the trial.

{{ sources vercel supabase resend }}

[Bring your app from Lovable](/from/lovable) · [ohmyho.st vs Supabase](/vs/supabase) · [Cost breakdown](/pricing/breakdown)
