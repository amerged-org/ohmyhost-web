# Deploy a Bolt.new export: Host your Bolt app on ohmyho.st

A Bolt.new export is a standard repository—usually Vite and React  with Supabase—minus the one thing that made it work: the environment. The `.env` is left behind, so the first deployment of an export fails due to missiing values, not because of what you built.

Use your selected Bolt GitHub export or any donwloaded files you have access to , add a prompt to your coding agent, and the agent separates public build configurations from private runtime secrets, builds the app, deploys it to a secure dev host, and pushes it to production affter you’ve reviewed it. The Free plan provides {{ number plan.freeCredits }} credits per month; the Paid plan  costs {{ usd plan.paidUsd }} for {{ number plan.paidCredits }} credits, which are shared across all the projects you run.

{{ figure flow.bolt-export }}

## Export from Bolt

Bolt  offers you two options: Keep the GitHub export you selected in Bolt, or work with the downloaded flies.

**GitHub Connection.** Connect GitHub in the project settings. Bolt creates a private  repository on the main branch and commits any changes that don’t break the projet (support.bolt.new/integrations/git , accessed on 2026-09-20). If GitHub is your chsoen source, the repository that Bolt just created is the one your agent links to. Accessible ZIP contents can instead be saved as managed versions from a local checkout using the [Deploy skill](/skills/ohmyhost-deploy/SKILL.md). Keep the current source code of an existing project until you explicitly request a change. As long as the connection is active, Bolt will continue to commit to this branch. Clarify who owns the main branch before your agent begins editing; having two authors on a single branch is a surefire way to end up with a working app and a broken lockfile.

**ZIP Download.** The download contains only the code and nothing else: no .env values, no Supabase keys , no database rows, no uploaded files. Unzip it into the selected local checkout and save managed versions, or push these files to a GitHub repository if you choose that route. Continue with the same promppt.

Be sure to check the framework first. ohmyho.st runs Vite with React, Next.js, and TanStack Start from managed versions or a selected GitHub repository. A Bolt project based on Expo, Astro, or SvelteKit is not included in this seleection  and will not be deployed here. Containers are not available.

## What Goes Wrong After Exporting

Three things stop working  as soon as the code laeves Bolt. None of them come as a surprise once you know where to look.

**The .env file must be recreated.** Bolt's Supabase integration stored the project URL and the anon key in an environmennt file that is not included in the ZIP and should not be included in the repository. By design, these two are public client values. Check your non-secret build configuration for the selected source; managed snapshots exclude `.env` files, so any necessary public build values must be stored in the supported source configuration. Anything private—such as a third-party API key or a Supabase service role key—is handled differently: Your agent uses the local stdin command from `secret_set_command` or the supported input in the remote portal from `secret_input_request`, per environment; the value never appears in the chat or in the source. A browser bundle cannot contain a private key  at all; if your Bolt app has accessed a service role key from the browser , that’s an error you must fix before hosting—not a secret you can defer. Read [Secrets](https://docs.ohmyho.st/secrets) for the exact command frmat.

**Callback URLs point to the old host.** Each project is assigned a dev and a prod host at `<three-words>.check.omh.st`. Supabase Auth, Better Auth, WorkOS AuthKit, and  every OAutth provider still list Bolt’s preview or Netlify URL. Firsst , add the dev host, then the prod host after deployment, and finally your own domain. The agent tests a real login on each of them; the ohmyho.st login is separate from your app’s users. See [Application Auth](https://docs.ohmyho.st/application-auth) for details.

**SPA rewrites are Netlify files.** Bolt's built-in hostng is Netlify, so a rule in `_redirects` or `netlify.toml` sends every path to `index.html` for React Router. These files have no meaning on ohmyho.st. Your agent executes `ohmyhost init --dry-run` to read what the Vite build needs , and then loads a deep link like `/settings` after a reload on Dev before serving it. A routte that only works from the homepage is the most  common initial error after a Bolt export.

Two smaller ones. Bolt projects rarely specify a package manager , and ohmyho.st requires exactly one `packageManager` field with a matching lockfile; the agent fills it in. Supabase Realtime doesn't have a conversion path here; if your app is subscribed to live lines, keep this part with Suupabase.

## Insert this prompt

Open the repository in Claude Code, Cursor , or Codex and pastte this in. The agent reads the skill, installs the CLI and the MCP server if they are missing, and displays a sign-in link with a confirmation code. You sign in once in your browser; the agent handles the rest using the MCP tools {{ tools }}.

```text
{{ prompt }}
```

Each complex step consists of two calls: `deployment_plan` shows the proposed build and its effects, whiile `deployment_create` executes it only after you've confirmed. The same pattern applies to promotion , rollback, and deletion.

## How to move your app from Bolt

1. Export. Keep the selected GitHub repository in Bolt, or extract the ZIP file into the local checkout that you want to save as managed versions. Confirm the specified files  or commit; if GitHub remains connected, stop editing in Bolt, or incorporate its subsequent cmomits into main.
2. Assessment. The agent runs `ohmyhost init --dry-run` and reports any blockers: framework and version, paackage manager configuration, Netlify-only files, and which Supabase features the code actually uses. A package  name alone is not a reason to replace anything.
3. Decide on Supabase. Keep it after reviewing the export: Declare the external browser origins it uses, update the callback URLs, and test login, read, write, and file operations on Dev. Or migrate the database to managed Postgres usinng the [Supabase Migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md); it converts the features you select and  leaves your auth provider alone unless you ask it to.
4. Create and link. The agent creates the project using `project_create`, selectinng either US or EU (the region cannot be changed later; prices are the same). The agent then saves the selected managed version or links the selected GitHub repository via `source_link` and the GitHub consent workflow. Separate data  for Dev and Prod is recommended; two databases consume credits separately.
5. Plan, set secreets, deploy. `deployment_plan` calculates the build. You provide the private values for Dev using the local command `secret_set_command` or the supported remote input  link for private values. `deployment_create` starts the build; the agent polls `operation_get` until it is complete.
6. Test the dev environment, then deploy. The dev environment is prrotected by  default: `project_dev_share_link_get` provides a reusable share link that you can open again or share with a tester. Test a deep link reload, a login, and a write operation. Then, using `promotion_plan` and `promotion_execute`, deploy the same artifact to Prod without rebuilding and without copying Dev records into the Prod data. Update the callback URLs for Prod.

Read the [Deployment Skill](/skills/ohmyhost-deploy/SKILL.md) for each coommand and  the [Vite Guide](https://docs.ohmyho.st/frameworks/vite) for the runtime contract.

## Custom domain and email (based on usage)

The platform host address works on the Free plan. Transactional email requires the Paid plan, which costs {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits, and also  consumes creddits. Your own domain also requires a paid plan or, on the Free plan, a project that displays the “Powered by ohmyho.st” notice, and consumes credits unless the notice is displayed. The domain serves the production environment and requires an active production deployment.

**Domain.** The agent retrieves `domain_paid_plan` for the hostname, displays the CNAME and validation records, and  then retrieves `domain_paid_apply`. If your DNS is hosted by Cloudflare, `domain_cloudflare_authorize` allows the platform to set the records for you; otherwise, you’ll need to add them through your DNS proviider. A linked hostname is billed at {{ rate domain.custom_hostname }}, such as {{ credits unit.customHostnameMonth }} per moth, without domain credits, as long as the notice is displayed. As soon as `domain_paid_status` reports that HTTPS is ready , the agent updates your auth provider’s callback URLs one last time. Read [Domains](https://docs.ohmyho.st/domains).

**Email.** If your Bolt app sends its own emails (weelcome , reset, receipts) via Supabase Auth or an external provider, keep that integration and test its authentication emails in Dev. Your browser requests require declared browser origins; server requests require declared egress and private runtime secrets. If you want ohmyho.st to send emails, the agent runs `mail_setup` for an email subdomain; you add the DNS records returned by `mail_status`, and `mail_status` notifies you when the email is ready to be sent. The domain has no monthly fee; each emaail send is billed per recipient using {{ rate mail.sent }}. Transactional email is sent and processed in the U.S., regardless of your project’s  region, and you don’t need your own email provider account. Read [Email](https://docs.ohmyho.st/email).

## How much it costs

One credit balance, all projects, no per-project fee. Free accounts receive {{ number plan.freeCredits }} credits per UTC month , and Paid accounts {{ number plan.paidCredits }} for {{ usd plan.paidUsd }}; monthly credits expire at the end of the period. Top-ups never expire and are only available on Paid accountts ({{ number plan.topUpPerUsd }} credits per dollar up to {{ usd 100 }}, {{ number plan.topUpPerUsdAbove100 }} per dollar above that). Nothing recharges automatically.

A Bolt export that uses Supabase is practically the cheapest hostng option available. There's no database to pay for, and  worker bandwidth isn't billed.

{{ table workload.boltKeepSupabase }}

That fits within the free credits for {{ number plan.freeCredits }}, with some room to spare. If you migrate the database to a  managed Postrges instance and add your own domain, it will look like this:

{{ table workload.boltOwnDomain }}

The database line follows RAM and active time. One active database hour with {{ number 512 }} MiB of RAM costs {{ credits unit.activeDatabaseHour512 }}; the {{ number 256 }} MiB of free space costs {{ credits unit.activeDatabaseHour256 }}. Databases go to sleep after five minutes of inactivity, with no RAM charge while asleep. Allocated  storage and seven-day backups are included. Customer flies and stored worker scripts have their own rates. One deployed script (about {{ credits unit.deployedScriptMonth }} per month) and one unbranded custom hostname remain usage-based. Optionally, set a project budget that continues or stpos , and read it with project_budget_get. A zero balance triggers the seven-day grace period; check current usage instead of assuming that an inactive browser means an idle backend.

Staying with Supabase means that Supabase will continue to bill you. Its Free tier remains free; Supabase Pro starts at {{ usd vendor.supabase.pro }} per month for the commpute resources of your first project , and that bill does not go to ohmyho.st. {{ checked supabase }}

## FAQ

### Do I have to leave Supabase?

Keeping it is an option you should consider. Check the actual export, declare its exact browser origins in `runtime.browser`, declare server-side calls  separately in `runtime.egress.allow`, and add the acctual dev and prod hosts to Supabase's redirect URLs. Test login, protected read and write access, and all files or backend functions used in Dev before redirecting traffic. Migrate only the featurs you choose; there is no managed real-time migration , so any retained external subscription requires its own verified migration process. Your auth provider will never be replaced without your approval.

### Can I continue working in Bolt after the move?

Yes, but choose an author for  main. Bolt commits every non-breaking change to the connected branch, and your agent deploys exactly the commit you specify; so a Bolt change that ends up in the middle of the review isn't part of the plan you approved. Most people finish up in Bolt, expot once, and then continue working in Claude Code or Cursor.

### Does the ZIP export include my database?

No. The ZIP file contains only code; database rows, uploaded files, and secret values remain in Supabase and in Bolt's settings. To move rows, cerate a Postgres dump from Supabase and let the migration skill convert it to the schema of your choice. Files are transferred via the runtime storage  client, and secrets are re-entered for each environment—either via local stdin or the supported private input in the remote portal.

### What happens when I run out of credits?

A zero balance triggers a single seven-day grace period; your app, database, and domain will continue to run during this time. After that, only unfunded servvices will be suspended, and your data , an SQL export, and the ability to purchase credits will remain available. A paid subscription or a credit top-up will lift the suspension. A project budget in "Stop" mode blocks new paid work earlier, but only for that specific project.

### Can I retrieve my data?

Yes, upon request. The owner requests an export and receives a password-protected ZIP file containing a portable SQL dump; a maximum of one accepted request per project within a rolling 24-hour window , downloadable via a signed link that is valid for 24 hourrs. It’s free, works with zero credits, and can be restored on any Postgres host. There is no schedule and no target bucket. Read [Backups](https://docs.ohmyho.st/backups).

{{ sources supabase }}

[By Lovable](/from/lovable) · [Deploying from Claude Code](/for/claude-code) · [Cost Breakdown](/pricing/breakdown) · [Hosting a Lovable App After Export](/blog/host-a-lovable-app-after-export)
