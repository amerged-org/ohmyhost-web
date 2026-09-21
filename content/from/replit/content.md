# Bring your app from Replit

Replit is a good place to build something and a confusing place to leave, because a Replit app leans on pieces that only exist inside Replit: its key-value database, its auth, its object storage, its secrets pane and a `.replit` file that describes how to run the thing. Export the repository and none of that comes with it.

That is the actual work of moving, and it is work an agent can do with you: inventory what the app really uses, replace the Replit-only pieces with portable ones, and verify the result before anything points at production. Hosting, Postgres, transactional mail and a custom domain then come from one prepaid balance — {{ usd plan.paidUsd }} a month for {{ number plan.paidCredits }} credits across every project, with no per-project fee.

## What only exists inside Replit

- **The key-value database.** Replit's built-in store has no equivalent elsewhere. Its contents become tables in managed Postgres, which usually means deciding what the keys actually meant — a step worth doing by hand, with your agent proposing the schema.
- **Replit Auth.** Sign-in that Replit provides ends at Replit's door. You choose the replacement: your own Better Auth setup, a WorkOS AuthKit tenant, or any provider you already use. Users' passwords cannot be exported from one system into another, so a moved account needs a reset.
- **Object storage.** Uploaded files are not in the repository. They are copied deliberately, with the paths the app expects.
- **The run configuration.** `.replit` and `replit.nix` describe a Replit machine, not a build. What travels is a normal framework build: one pinned package manager, one lockfile, one build script.
- **Always-on.** A Repl that stays awake is a Repl you pay for by the hour. Here an app is request-driven: it costs when it serves, a deployed script keeps using about {{ credits unit.deployedScriptMonth }} a month, and an idle database suspends after a minute.

## How to move your app from Replit

1. **Inventory the app.** Identify the framework, application directory, package manager, auth provider, database, files, functions and external services. `ohmyhost init --dry-run --json` returns the blockers and the required conversions for your actual repository instead of a generic checklist.
2. **Replace the Replit-only pieces.** Move key-value data into Postgres tables, pick the auth provider, list the files to copy, and convert anything that assumed a long-running machine. Keep every decision in the repository as ordinary code and migrations, so the next move — if you ever make one — is a normal one.
3. **Deploy and verify.** Push to GitHub and follow the [deployment Skill](/skills/ohmyhost-deploy-github/SKILL.md). Set the target environment's secrets through the stdin command, run the migrations, then test sign-in, a protected route, one real write and any mail the app sends. Dev is private, so open it once through a ten-minute access ticket. Promote to Prod only after Dev passes.

## What it costs here

A small app with its database and its mail on this side, for one month:

{{ table workload.smallApp }}

A custom domain adds {{ rate domain.custom_hostname }}, about {{ credits unit.customHostnameMonth }} a month, and needs Paid. Without one, every project is reachable at its own `<three-words>.check.omh.st` address at no extra cost. A zero balance starts a seven-day grace period in which everything keeps running, and a per-project monthly budget can stop new billable work instead of surprising you.

## When to stay on Replit

Stay if what you value is the browser IDE and instant collaboration on the same machine, or if the app genuinely needs a process that runs continuously. This runtime serves requests; it does not keep your process alive between them. Move when the app has outgrown the sandbox: real users, a real database, mail that must arrive, and a bill you would like to understand.

[Move from Lovable](/from/lovable) · [Move from Bolt](/from/bolt) · [Cost breakdown](/pricing/breakdown) · [Framework guides](https://docs.ohmyho.st/frameworks/vite) · [Application auth](https://docs.ohmyho.st/application-auth)
