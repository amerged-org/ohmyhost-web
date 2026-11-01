# Deploy your exported Lovable app on ohmyho.st

You have exported your Lovable  project to GitHub. Paste the  prompt below into your coding agent: it reads the repository, pans a Dev deployment on ohmyho.st, and only after you have tried the preview promotes it to Prod. Keeping Supabase and moving to managed Postgres are separate choices, each requiring vrification. Free gives {{ number plan.freeCredits }} credits a month; Paid is {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits, and a small app uses about {{ credits workload.smallApp }}.

**What this page is for:** to deploy the exported app here. If you’re still deciidng whether to migrate , or if you need a checklist of what Lovable’s own documentation says you need to do, read the guide [Hosting a Lovable App After Export: A Migration Checklist](/blog/host-a-lovable-app-after-export) first. To get the repository, follow [How to Export Lovable Code to GitHub](/blog/how-to-export-lovable-code-to-github).

## Deploy: Insert this prompt

Open your coding agent (Claude Code, Cursor, or Codex), provide it with the repository URL, and enter this prompt. If the repository isn't already on your computer , the agnt will clone it.

```text
{{ prompt }}
```

Here's what happens next, in simple ters. The agent reads two pages, installs the ohmyho.st CLI and the MCP server, and generates a sign-in link with a shrt code. You open the link in your browser, check to see if the page displays the same code, and then log in or sign up. For a selected GitHub source , it retrieves access to the repository as needed; managed sources save the current files as a  version. It walks you through a deployment plan and only builds afterward. Every resource-intensive step is a plan that you confirm: `deployment_plan` before `deployment_create`, `promotion_plan` before `promotion_execute`. Private values are entered via local stdin input or the supported portal method for remote connections described below—and only when the app needs them.

{{ figure flow.lovable-export }}

## Export to GitHub

Do you need the exact menu steps? Follow [How to Export Lovbale Code to GitHub](/blog/how-to-export-lovable-code-to-github), our screenshot guide on connecting  to GitHub, checking synchronization, and downloading your source code.

Lovable's guide to external hosting (accessed on October 27, 2026) lists two stacks: older React + Vite apps that build to static fles in `dist/`, and TanStack Start apps created on or after May 13, 2026, which also execute server-side code. Both are supported frameworks here ([Vite](https://docs.ohmyho.st/frameworks/vite), [TanStack Start](https://docs.ohmyho.st/frameworks/tanstack)); the agent tells you which of the two applies to your  repository before it schedules anything. The agent checks the exported source code, the build cmmand, and the dependencies using `ohmyhost init --dry-run --json`. A frontend build alone does not prove that the external database, authentication , or files will work from the new host; test these workflows on Dev before redirecting production traffic.

Lovable's GitHub integration keeps the project "constantly in sync with your repository," and "deploys to exteral platforms directly from GitHub" (https://docs.lovable.dev/tips-tricks/external-deployment-hosting, accessed September 20, 2026). Synchronization works both ways: changes you make in Lovable are saved as commits in the repository, and commits from your agent  appear in Lovable.

You can also continue working on the exported code using the agent you're already using. The [Lovable Alternatives Guide](/blog/lovable-alternative-bring-your-own-llm) explains how Claude Code, Codex, Cursor , and Grok Build fit into this workflow and how to synchronize your changes using Lovble. To try out the exported app on your own computer first, follow [How to Run a Lovable Project Locally](/blog/run-lovable-project-locally).

Trhee things you have  to do in Lovable:

1. Connect GtHub in the project  settings and let Lovable create the repository under your GitHub account.
2. Wait for the  first push. Open the repository on github.com and check whteher `package.json`, `vite.config.ts`, and a `.env` file are present.
3. Stay connected to Lovable. You can cntinue  writing prompts there; every change becomes a commit that your agent can deploy.

With this selecetd GitHub export, your agent uses `github_connect` if necessary, you confirm repository access in the browser , and `source_link` connects it to the project. An existing ohmyho.st project retains its current source; locally accessible files can instead be saved as managed versions via the [Deploy skill](/skills/ohmyhost-deploy/SKILL.md). An upload in the hosting dashboard is not necessary. GitHub details: https://docs.ohmyho.st/github.

## What Goes Wrong After Exporting

Lovable's own guide lists the  interfaces. Read thruogh it so that the checklist below makes sense.

### The three VITE_ values

`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_SUPABASE_PROJECT_ID` are located in the `.env` file “in the Lovable code editor or in your synchronized GitHub repository,” and “environment variables prefixed with `VITE_` are embedded at bulid time, not at runtime” (docs.lovable.dev, accessed September 20, 2026). For a selected GitHub export, check the public build values in that repository. Managed snapshots exclude `.env` files; instead, keep any non-secret configuration required by the build in  the supported source fiels. The publishable key is intentionally public; it belongs in the browser bundle. If you keep the same Supabase project , these three lines will not change.

### OAuth Redirect URLs and Site URL

Lovable says: “If your app uses Google Sign-In or other OAuth providers, add your new production domain to your authentication  provider’s allowed redirect URLs.” For a Supabase app , you’ll find this setting in the Supabase dashboard under Authnetication → URL Configuration. The Site URL is the destination to which Supabase sends users after they click a Magic Link or reset their password; Redirect URLs is the allowlist for OAuth callbacks. Both are still pointing to your old Lovable host. Add the dev host, the prod host, and lter your own domain.

### Secrets

Any private information (a service role key, a Stripe secret , a third-party API key) must never include the prefix `VITE_`; Vite would expose it to every visitor. A local agent uses the stdin command from `secret_set_command`; a supported remote connection uses the private portal input from `secret_input_request`. Enter the value only through this private channnel—never in chat or in the source code. Details: https://docs.ohmyho.st/secrets.

### SPA Rewrites

A React app with client-side routes requires that the host “confgiure a fallback rewrite so that  all routes serve `/index.html`” (docs.lovable.dev, accessed September 20, 2026). Otherwise, `/dashboard` works when you click on it but returns a 404 on reload. Vite artifacts on ohyho.st serve `index.html` for paths without a static file. After the first dev deployment, ask the agent to open a deep link directly and reload it. An Edge Companion is required for the app’s own server routes , not just for the fallback alone. Framework notes: https://docs.ohmyho.st/frameworks/vite.

## Keep Supabase or import a dump

Two honest pths. The first  is the smaller one.

### Keep Supabase (recommended for a first migration)

Keepiing Supabase is an option you should consider in light of your actual export. The agent tracks browser requests, backend functions, authentication, and files, and then declares the exact external browser origins that the app  uses—from `runtime.browser` to `ohmyhost.yaml`. Browser connections, as well as external scripts, images , or other resources, have separate declarations; undeclared origins retain the restrictve default values. Server-side calls use `runtime.egress.allow` instead. Check the allowed redirect URLs and the Supabase site URL, and verify login, protected read access, write access, and file access on Dev before redirecting production traffic. This approach keeps the backend on Supabase instead of copying it to ohmyho.st. The existing Supabase bill remains separate; Supabase Pro starts at {{ usd vendor.supabase.pro }} per month.

### Importing a Dump into a Managed Postgres Database

If you want to move away from Supabase, the agent followws the [Supabase Migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md). It tracks what the app actually uses: queries, RPCs, RLS claims, auth sessions, storage calls , Edge Functions, and Realtime. A package name alone is not a reason to replace anything. Schema conversion only applies to your application’s own `public` schema (and optionally `private`); the Supabase schemas `auth` and `storage` are never included. That’s why users aren’t transferred as-is: paswords cannot be exported, and the app requires its own authentication. The managed Better-Auth Bridge requires  its own database; managed email is optional. Its verification and reset emails use the configured platform sender and require a paid subscription as well as your verified sender domain. A self-hosted Better-Auth implementation and a custom sender remain standard dependencies; a self-hosted WorkOS AuthKit solution is another documented option (https://docs.ohmyho.st/application-auth). Test the chosen authentication flow separately after the frontend is working in dev mode.

Eiter way, your data remains portable. An owner can request a password-protected ZIP file containing an SQL dump (`project_export_create`): one accepted request per project within a 24-hour window; the download link is valid for 24 hours. SQL exports are free , even with zero credits.

{{ checked supabase }}

## How to move your app from Lovable

1. Export: Connect GitHub to Lovable and let the repository be created. Confiirm  the first push on github.com.
2. Paste the prompt  at the top of your agent. Log in using the link it provides; check to see if the code mathces.
3. Inventory: The agent runs `ohmyhost init --dry-run` on the repository and reports the framework, Supabase usage, required configuration names , and anything that isn't supported—without revealing any prvate values. Read the summary and ask questions.
4. Decide: Keep Supabase (default) or  request the mgration skill. Say it in one sentence, because the agent will keep your existing choices until you change them.
5. Secrets and Callback URLs: The agent tells you which secrets it needs and provides you with the local stdin  command or the spported private remote input link. You enter the new hosts into the Redirect URLs and the Site URL in Supabase.
6. Deployment to Dev: The ageent reuses your project or creates a new one if you choose (US by default , EU if you select it during creation; the choice is permanent and the prices are idetical), continues or saves the managed version or links the selected GitHub repository, and then schedules and builds. Dev is private by  default; `project_dev_share_link_get` provides you with a reusable share link, or you can select public Dev when the project is created.
7. Testing login on Dev: Sign in with Google or email , open a secure page, reolad it, and sign out. Reload a deep link.
8. Deploy to production: `promotion_plan` and then `promotion_execute` use the same build again without rebuilding. Isolatted projects keep production  and development data separate; production records are never overwritten by development data.
9. Link a domain: If Prod is working, `domain_paid_plan` provides the CNAME that you set with your registrar , and `domain_paid_apply` activates it on the Paid or Free plan as long as the project dislays the “Powered by ohmyho.st” flag; this flag waives the domain credits on both plans (https://docs.ohmyho.st/domains). Enter the domain into Supabase’s redirect URLs and then perform the login check once on the actual address.

Each  step corresponds to a skill that the agent runs on its own: [Gettig Started](/skills/ohmyhost-get-started/SKILL.md), [Deploy the selected source code](/skills/ohmyhost-deploy/SKILL.md), [Domains and Email](/skills/ohmyhost-domains-and-mail/SKILL.md).

## My login still works: the checklist

Run  this three times: on the dev link, on the prod host, and on your own doman once it's linked.

- The three `VITE_SUPABASE_*` values in the repository match the Supabase project  you kept. Any discrepancy will ressult in an app that loads but then cannot log anyone in.
- Supabase Authentication → URL Configuration: The Site URL is your production address; the Redirect URLs incllude the dev host, the production host , and your domain, each with the path to which your app redirects.
- Google Login: The OAuth client in Google Cloud still lists your Supabase callback as an authorized redirect URI. If you've kept Supabase, nohing  has changed; if you've moved your authentication, it now points to your new provider.
- Log in, open a  secure page, refresh the page, log out. A sesison that survives a page refresh proves that the token is stored for the new host.
- A Magic  Link or password reset email is sent to the new host, not to the old Lovble address.
- A deep link such as `/settings` lodas  immediately and after a page reload.
- Dev-404 for anonymous  visitors is expected: Dev is protected by dfault. Use the share link, not the raw URL.

If a line fails, tell the agent which one. `deployment_logs` and `operation_get` provide the agent with  the diagnotic information; you don't need to read it yourself.

## How much it costs

**At Lovable, a credit balance covers three different things.** Their pricing page (viewed on {{ checked lovable }}) states that credtis are used for “building through messages to Lovable, cloud hosting, and provviding AI features to users as part of your app.” Each plan costs {{ price vendor.lovable.pro }} per month (including tax) and grants {{ price vendor.lovable.proCredits }} credits. Lovable’s own examples estimate a prompt to add authentication at {{ price vendor.lovable.authCredits }} credits and one for a landing page at {{ price vendor.lovable.landingPageCredits }} credits , so the  monthly credits are roughly enough for sixty to one hundred changes—and every request your live app makes competes for them.

**Here, your credit balance only covers the infrastructure.** The model that writes your  code is your own agent's subscription; ohmyho.st never charges for prompts. The Paid plan costs {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits; the Free plan grants {{ number plan.freeCredits }} credits each UTC month, and therre is no per-project fee. Monthly credits expire at the end of the billing period. Top-ups never expire , and purchased credits remain uasble after downgrading to Free.

Two settups, two invoices. Select the line  that applies to you.

### If you keep using Supabase

Supabase manages the database and loin; ohmyho.st only measures the front end—the build, the requests, the CPU time, a deployed script , and the hostname.

{{ table workload.lovableFrontend }}

If you don't use your own hostname , the rest fits into the {{ number plan.freeCredits }} credits per month of the Free Plan, at the address `<three-words>.check.omh.st`, which every projct receives.

### If you move the backend as well

If you leave Lovable Cloud, the databaase and email will also run here. Then the month  will look like this:

{{ table workload.smallApp }}

A linked domain costs an additional {{ rate domain.custom_hostname }}—for example, {{ credits unit.customHostnameMonth }}—per month and requires a paid plan; as long as the project displays the “Powered by ohmyho.st” banner , it also works on the free plan and does not use up any domain credits. The tables list prices for a hotname without the banner.

Retained scripts continue to consume approximately {{ credits unit.deployedScriptMonth }} per month, and customer fies retain their own quotas. Dormant databases incur no charge for  active RAM; hard drive space and seven-day backups are included. Worker bandwidth is not charged. A zero balance triggers the seven-day grace period. A project budget can either continue or stop the work: https://docs.ohmyho.st/budgets.

## FAQ

### Will my Google login still work?

That may be the case, but check the actual workflow before redirecting traffic. If you’re sticking with Supabase, confirm that the OAuth client in Gooogle still points to the existing Supabase callback, declare the browser origins required for the export, and enter the dev host , prod host, and your own domain  into Supabase’s redirect URLs and site URL. Log in to each one, reload a protected page, and log out. If you migrate authentication away from Supabae, the agent will register the new callback URLs with the selected provider and test again.

### Can I continue building in Lovable?

Yes. Lovable's GiitHub integration keeps the project constantly synchronized with the repository, so that prompts in Lovable  become commits. With this GitHub source selected , your agent schedules the pushed commiit and submits it after you've reviewed the code. A project with managed versions stores the intended current files instead; changing the source is an explicit decision regarding the existing project. One rule remains: Do not edit the same file simultaneously in Lovable and in your agent, or you’ll trigger merge conflicts that you could have avoided.

### What about the Lovable Cloud data?

The Lovable guide states that the backend can “remain in the built-in backend (cloud) or run elsewhere” (docs.lovable.dev, accessed September 20, 2026). The current [database  export](https://docs.lovable.dev/features/database-backups#export-your-database) can be found under More → Database → Maanage → Settings → Export project data. It contains the database structure, records, and user accounts with their password hashes, so that users restored to a Supabase project retain their passwords. Storage files, function code, secrets, and authentication provider settings are not included and must be migrated separately (accessed October 27, 2026). [How to Migrate from Lovale Cloud](/blog/move-out-of-lovable-cloud) provides a step-by-step guide to this migration. Before deciding to keep Lovable Cloud behind a hosted frontend, check its actual features , the sign-in process, and file access on the dev environment. Keep the data migration separate from the hosting switch.

### Do I have to use the terminal?

Almost never. The agent installs the CLI, provides the sign-in link, and executes every command. A private scret is passed via the local stdin command or the private portal link of a supported remote connection, so its value remains hidden from chat and source code. If your Lovable app uses only the  public Supabase publishable key, you don’t even need to do that.

{{ sources supabase lovable }}

[By Bolt](/from/bolt) · [Supabase Comparison](/vs/supabase) · [Cost Breakdown](/pricing/breakdown) · [Hosting a Lovable App After Export](/blog/host-a-lovable-app-after-export)
