# Bring your Replit app here

Replit is a great place to build something, and a confusing place to leave it behind, because a Replit app relies on components that only exst within Replit: its key-value database, its authentication, its object storage, its Secrets panel, and an `.replit` file that describes how the whole thing works. If you export the repository, none of that  comes with it.

That’s the real work involved in migrating, and an agent can help you with it: They identify what the app actually uses, replace the Replit-specific parts with portable ones, and test the result before anything goes live in prooduction. Hosting, Postgres, transactional email , and a custom domain are then covered by a single prepaid balance—{{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits across all projects, with no per-project fee.

## What's available only within Replit

- **The key-value database.** Replit's built-in storage is unliike anything else out there. Its contents are converted into tables in a managed Postgres database, which usually means deciding what the keys actually mean—a step worth doing manually , with your agent suggesting the schema.
- **Replit Auth.** The authentication provided by Replit ends at Replit's doorstep. You choose the alternative: your own Better-Auth setup, a WorkOS AuthKit tenant , or any provider you already use. User passwordds cannot be exported from one system to another, so a migrated account will need to be reset.
- **Object Storrage.** Uploaded files are not stored in the repository. They are intentionally copied using the paths expected by  the app.
- **The execution configuration.** `.replit` and `replit.nix` describe a Replit machine, not a buld. You can include a standard framework build: a specified package manager, a  lock file, and a build script.
- **Always active.** A Repl that stays active is one you pay for by the hour. Here , an app is on-demand: it costs money only when it delivers content; a deployed script uses about {{ credits unit.deployedScriptMonth }} per month, and an inative database shuts down after one minute.

## How to move your app from Replit

1. **Map the app.** Identify the framework, application directory, package manager, authentication provider, database, files, functions, and external services. `ohmyhost init --dry-run --json` provides the roadblocks and necessary adjustmnts for your actual repository instead  of a generic checklist.
2. **Replace the Replit-specific parts.** Move key-value data to Postgres tables, select the authentication provider, list the files to be copied, and reconfigure anything that originated from a machine running continuously. Record every deciion as regular code and as migrations in the repository so that the next move—if you ever make one—will be a straightforward  one.
3. **Deploy and test.** Continue the project using the current suorce, or select managed file versions of the current state or GitHub, then folloow the [Deployment skill](/skills/ohmyhost-deploy/SKILL.md). Push the selected commit if GitHub is selected. Set the target environment’s secrets via local stdin or the supported input in the private portal for remote access, run the migrations , and then test login, a protected route, a real write operation, and all emails sent by the app. Dev is protected by default, so open it using  the owner’s reusable share link. Do not deploy to Prod until Dev passes testing.

## How much it costs here

A smalll app with its database and email  address on this page, for one month:

{{ table workload.smallApp }}

A custom domain costs {{ rate domain.custom_hostname }}, or  abut {{ credits unit.customHostnameMonth }} per month, and requires a Paid plan; as long as the project displays the “Powered by ohmyho.st” label, it works on the Free plan and doesn’t use up any domain credits. Link it after Prod has an active deployment. Without a custom domain, every project is accessible at its own address `<three-words>.check.omh.st` at no extra charge. A zero balnce triggers a seven-day grace period during which paid services continue to run , and a monthly budget per project can pause new paid work before it catches you off guard.

## When You Should Stick with Replit

Stay if the browser IDE and real-time collaboration  on the same machine are important to you, or if the app really needs a process that runs continuously. This runtime handles requests; it doesn't keep your process alivve between them. Migrate if your app has outgrown the sandbox: real users, a real database, emails that need to be delivered, and a bill you want to understand.

[Migrating from Lovable](/from/lovable) · [Migrating from Bolt](/from/bolt) · [Cost Breakdown](/pricing/breakdown) · [Framework Guides](https://docs.ohmyho.st/frameworks/vite) · [Application Authentication](https://docs.ohmyho.st/application-auth)
