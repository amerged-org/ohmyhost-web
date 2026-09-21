# Hosting a Lovable app after export: the exact path

By Sebastian Mertens · September 20, 2026

Exporting a Lovable project to GitHub is one click. Everything after it is the work: three `VITE_` values, OAuth redirect URLs, private secrets that must not ship to the browser, and a rewrite rule for client-side routes. This is that path, written out, and what a coding agent does instead of you.

{{ figure flow.lovable-export }}

## Why people leave

Not because Lovable is bad at building. It is very good at building, and most people who move keep building there. They move because hosting inside the builder is priced with the same credits that write the code, so a month of real traffic competes with a month of prompting. Lovable's pricing page says hosting on Lovable Cloud draws from your credit balance as an app takes on traffic and size (https://lovable.dev/pricing, read 2026-09-20). Once an app has users, most people want its running costs on a bill that does not move when they stop prompting.

## Export to GitHub

Lovable's GitHub integration keeps the project in continuous sync with a repository, and external platforms deploy from that repository (https://docs.lovable.dev/tips-tricks/external-deployment-hosting, read 2026-09-20). Connect GitHub in the project, let Lovable create the repository, and you have a normal Vite + React codebase with a normal commit history. Nothing is ejected and nothing is locked: you can keep prompting in Lovable, and every change still lands in the same repository you are about to deploy from.

## What breaks by hand

Four things, in the order they bite.

**The three `VITE_` values.** `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_SUPABASE_PROJECT_ID` live in the `.env` file in Lovable's editor and in the synced repository (docs.lovable.dev, read 2026-09-20). A host that does not have them builds an app that loads and then cannot reach its backend.

**OAuth redirect URLs and the Site URL.** Lovable's guide is explicit: if the app uses Google sign-in or another OAuth provider, add the new production domain to the provider's allowed redirect URLs. For a Supabase app that is Authentication → URL Configuration, where the Site URL is the address Supabase sends people back to and the Redirect URLs list every host allowed to complete a sign-in. Miss it and login fails only in production, which is the worst place to discover it.

**Private secrets.** A Stripe secret key or a service-role key must never carry the `VITE_` prefix, because Vite inlines prefixed variables into the client bundle at build time and ships them to every visitor. They belong in server-side configuration on the host.

**SPA rewrites.** A React app with client-side routes needs the host to serve `/index.html` for unknown paths. Without it the home page works, and `/dashboard` returns a 404 the moment somebody refreshes.

## The prompt

Paste this into Claude Code, Cursor or Codex with the exported repository open:

```text
{{ prompt }}
```

## What your agent does, step by step

1. Reads the repository and reports what it found: the framework, the package manager, the auth provider, the database, and which external services the code calls.
2. Signs you in. `ohmyhost login --json` returns a link and a confirmation code; you open it in a browser once.
3. Creates the project and links the repository you authorize. GitHub is the only deployment source, so nothing is uploaded from your machine.
4. Plans the deployment before it runs anything. The plan names the commit, the framework it detected, the secrets it still needs and any blocker it found.
5. Asks you for secret values and gives you a stdin-only command to set them, so no key is ever pasted into a chat transcript.
6. Deploys to Dev, returns a `check.omh.st` host, and waits while you test the real thing: sign in, a protected route, a read and a write.
7. Promotes the verified artifact to Prod. Promotion moves the artifact that already passed; it does not rebuild and it does not copy Dev records over Prod data.

The agent stops at the points where only you can decide: the browser sign-in, the workspace on first use, the GitHub authorization, the secret values, and the region, which is chosen once per project and cannot be changed afterwards.

## Keep your Supabase or move it

Keeping Supabase is the smaller change and usually the right first move. The three `VITE_` values stay as they are, you add the new Dev and Prod hosts to Supabase's Redirect URLs and Site URL, and your Google OAuth client keeps calling back into Supabase, which did not move. You are changing where the frontend runs, nothing else.

Moving the database is the second step, once the app is live and calm. Export from Supabase, import into the project's managed Postgres, and switch the application to the database binding the platform provides. Do it as its own change, with its own verification, and not on the same evening as the move.

## Custom domain and mail

Both need Paid, and both are metered rather than bundled. `domain_paid_plan` returns the CNAME to set at your registrar and `domain_paid_apply` activates the hostname once DNS resolves; a linked hostname costs about {{ credits unit.customHostnameMonth dp=0 }} a month. Transactional mail needs a delegated sender subdomain that the agent configures with `mail_domain_set` and verifies with `mail_domain_status`; the zone costs about {{ credits unit.mailSenderZoneMonth dp=0 }} a month and each 1,000 recipients about {{ credits unit.thousandMailRecipients dp=0 }}.

## What it costs

A Lovable frontend that keeps Supabase and runs on its own domain pays for the deployment, the traffic and the hostname, and nothing for a database it does not use here:

{{ table workload.lovableFrontend }}

A first month that also brings Postgres and managed mail across looks like this:

{{ table workload.lovableFirstMonth }}

Both sit inside the {{ number plan.paidCredits }} credits that {{ usd plan.paidUsd }} a month buys, and both leave room for the extra deployments a move always needs. For comparison, the same app on separate subscriptions starts at {{ usd scenario.threeSubscriptions }} a month before any usage. {{ checked vercel }} {{ checked supabase }} {{ checked resend }}

## FAQ

### Will my Google login keep working?

Yes, if you keep Supabase and add the new hosts. Google still calls back into Supabase, which has not moved. What changes is Supabase's own configuration: the Site URL becomes your production address, and the Redirect URLs gain the Dev host, the Prod host and your domain.

### Can I keep building in Lovable after I move?

Yes. The GitHub sync is two-way, so prompting in Lovable still lands commits in the same repository you deploy from. Ask your agent to deploy the new commit when you want the change live; the build runs from the repository, not from your machine.

### What about data that lives in Lovable Cloud?

Export it before you switch anything off. Lovable's guide describes exporting data from the project's Cloud settings, and the backend can stay where it is while the frontend moves. Treat the data move as a separate step with its own verification.

### Do I have to use the terminal?

You need it once, to install the clients and register the MCP server; the get-started Skill gives your agent the exact commands for your harness. After that the work happens in the agent, and the browser handles sign-in, GitHub authorization and your registrar's DNS.

### What does it cost to try?

Nothing. Free gives {{ number plan.freeCredits }} credits a UTC month with hosting, a database and Dev and Prod hosts, which is enough to deploy the exported app and click through it. A custom domain and mail are what Paid adds.

{{ sources vercel supabase resend }}

[Bring your app from Lovable](/from/lovable) · [ohmyho.st vs Supabase](/vs/supabase) · [Cost breakdown](/pricing/breakdown)
