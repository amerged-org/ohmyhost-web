# A Lovable alternative with your own LLM

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published September 25, 2026 · Updated October 20, 2026

You can keep a Lovable project's code and edit it with your own coding agent, without choosing a new host first. That separates the tool that writes the app from the services that run it. The useful question is which part you want to change: editing, hosting, or the backend. Each has a different migration cost.

I build ohmyho.st. This guide explains which parts of a Lovable workflow you can change separately, and the work each change creates.

## Choose what you want to change

An existing app does not have to move all at once. Start with the problem you actually have.

| Your priority | A possible next step | What you take responsibility for |
| --- | --- | --- |
| Keep the browser editor, visual changes and integrated publishing | Keep building in Lovable | Its current plan, workflow and available integrations |
| Use a coding agent you already prefer | Edit a synced copy of the project outside Lovable | Reviewing code changes, running the project and coordinating writes |
| Choose hosting separately from the builder | Deploy the inspected project to a compatible host | Runtime configuration, secrets, release checks and availability |
| Replace the backend as well | Plan a separate migration | Data, authentication, files, server functions and application behavior |

If your frustration is how changes are made, try another coding tool before moving production hosting. If the editor is working well but you want a different hosting arrangement, there is no requirement to replace the editor too. A backend migration is another decision again.

Lovable's [GitHub integration](https://docs.lovable.dev/integrations/github) supports changes in both directions on the active branch. You can therefore keep using Lovable while also reviewing or editing the repository externally. Agree on which tool is writing, pull the latest changes before starting, and inspect the resulting diff before merging. Those habits matter more than the name of the agent.

## Your coding agent is not your app's AI

“Bring your own LLM” can describe different arrangements. Here, it means choosing the coding agent and model access you use to work on source files. It does not mean supplying a key to replace Lovable's internal development agent.

**A coding-agent subscription and BYOK are different.** Your chosen tool may offer subscription access, provider API access, or both. Which models, features and usage allowances are available depends on that tool and its current plan. A subscription you already have can be useful, but it does not make every additional task free.

**AI inside the deployed app is a separate service.** A customer-facing chatbot or image feature still needs its own model connection. Lovable explicitly distinguishes its [app AI connector](https://docs.lovable.dev/features/ai) from the agent that builds the project. If you move that feature to a direct provider API, it may need a server-side key and separate usage billing.

ohmyho.st hosts the result independently of your development agent's LLM credentials. An app that calls a model provider directly can store its provider key separately as a [runtime secret](https://docs.ohmyho.st/secrets).

## What stays with the code, and what does not

A repository gives you source files you can inspect and change with another tool. It does not, by itself, recreate the services those files call.

| Part of the app | What to check before changing hosts |
| --- | --- |
| Source and build configuration | The actual framework, package manager, dependencies and build output |
| Database | Where the records live and whether you are keeping that service or migrating it |
| Sign-in | The auth provider, allowed callback URLs, sessions and protected routes |
| Uploaded files | Storage location, permissions and any signed-download behavior |
| Server functions and integrations | Required runtime, external calls, scheduled work and private secrets |
| AI features | Whether they use a builder-managed connector or a provider connection you operate |

Do not assume every export is a static Vite app. Lovable's current [external-hosting guide](https://docs.lovable.dev/tips-tricks/external-deployment-hosting) distinguishes older React/Vite projects from TanStack Start projects, which also run server code. Inspect `package.json` and the actual build before selecting a runtime. A successful homepage load is not enough to verify an application.

Keeping an existing Supabase backend may reduce the scope of the first move, but it still needs verification. Test sign-in, a protected read and write, file access if used, and any backend function the app depends on. Declare required external connections on the new host and verify them on its real addresses. Moving the data can wait until those flows work.

### What “no vendor lock-in” means in practice

Choosing another coding agent is easier when it can read the same files and you can review the changes in version control. That is a useful form of independence. It does not make a provider-specific database API, authentication system or AI connector portable without work.

A practical portability check is whether you can explain the app's dependencies, run it outside its original preview, and recover its data through a documented export. Keep the provider choices that are working; replace a dependency when you have a reason and a test for the replacement. Treat source ownership, hosting choice and backend portability as separate capabilities.

## Compare the complete cost

Compare the same work on both arrangements, including services you would keep paying for after a move:

- **Development:** the coding tool's plan or API usage, including additional usage and any tools it calls.
- **Hosting:** builds, requests, compute, retained storage and deployed resources at the host you choose.
- **Existing backend:** a database, storage or mail service that stays in place keeps its own bill.
- **App AI:** calls made by your visitors are separate from the model usage involved in writing the code.

Lovable currently documents a general credit balance covering building and running, with usage-specific grants consumed before general credits. Check [its usage breakdown](https://docs.lovable.dev/introduction/credits-and-usage) for the project you actually have. A shared balance is an accounting arrangement; it is not proof that a different setup costs less.

For example, keeping the same backend while changing editors may mostly change development costs. Moving only the frontend changes the hosting cost while leaving the backend bill in place. Moving the backend as well changes the comparison again and adds migration work. A cheap frontend estimate does not establish the total cost of the application.

On ohmyho.st, a shared credit balance pays for running the app and the managed services it uses. It does not pay for the coding agent's tokens. Free provides {{ number plan.freeCredits }} credits per UTC month; Paid provides {{ number plan.paidCredits }} credits for {{ usd plan.paidUsd }} per month. These are usage allowances, not a promise that a particular export will fit. Read the [rates and plan terms](/pricing) and the plan for your inspected app before deciding.

## Try a small change before moving production

Try a modest experiment to decide whether the external-agent workflow suits you:

1. **Get the current source.** Use the [export and sync guide](/blog/how-to-export-lovable-code-to-github). Keep GitHub sync if you want continued edits in Lovable to reach that repository.
2. **Run it locally.** Use the project's package manager and build scripts. Identify required configuration before asking an agent to change it.
3. **Make a contained change.** Ask for a form label, validation rule or small layout adjustment. Read the diff and check that unrelated files and dependencies stayed under control.
4. **Verify the behavior.** Run the build and relevant tests, then exercise the changed flow. If it involves a backend, verify the real integration rather than accepting a screenshot as proof.
5. **Choose the next move.** If this workflow helps, decide separately whether to keep the current host or try another one. If it adds friction, continuing in Lovable remains a reasonable outcome.

For editor setup and access, use the documentation for [Claude Code](https://code.claude.com/docs/en/setup), [Codex](https://developers.openai.com/codex/auth), [Cursor](https://cursor.com/docs) or the coding tool you choose. Check its model access, usage allowances and ability to run the project's commands before committing to that workflow.

## Where ohmyho.st fits

ohmyho.st is a host that compatible coding agents operate through [MCP or CLI](https://docs.ohmyho.st/agents/mcp). It can use the GitHub repository you authorize or [managed source versions](/skills/ohmyhost-deploy/SKILL.md). GitHub is useful when you want to preserve the Lovable sync; it is not the only source route the host supports.

An agent can inspect the selected source, plan a deployment and prepare a Dev preview. After the app has been checked, the verified artifact can be promoted to Prod. The agent's model access remains separate from the app's hosting usage. This provides another workflow to evaluate, not a substitute for checking the exported application's dependencies.

If you are ready to try hosting, the [Lovable hosting guide](/blog/host-a-lovable-app-after-export) covers the technical handoff, and [Bring your app from Lovable](/from/lovable) gives the ohmyho.st entry prompt. If you prefer the integrated browser editor and publishing workflow, you can keep using Lovable. Choosing the smallest change that solves your problem is a better starting point than replacing the entire stack.
