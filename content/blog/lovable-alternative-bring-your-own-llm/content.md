# A Lovable alternative with your own LLM

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published September 25, 2026 · Updated October 21, 2026

You can open your Lovable project in the coding tool you prefer and ask your Agent to work on it. You do not need to choose a new host or move your database first. Get the current code, run it locally and try a change you can review. That gives you something useful to compare with the workflow you already know.

Maybe you prefer how your Agent explains a bug. Maybe you want to work in your own editor, review changes before accepting them or use model access you already pay for. Those are good reasons to try the workflow. Whether you also want different hosting is a decision you can make later.

I build ohmyho.st. This guide explains how to try your own coding agent with a Lovable project, what still needs to run elsewhere and where our hosting fits if you decide to move.

## Start with the part you want to change

Before asking your Agent to migrate anything, tell it what is bothering you about the current setup. “I want to edit this app in my own editor” is a much smaller job than “move everything away from Lovable.” It also gives you a clearer way to judge the result.

| What you want | What to try | What you will need to check |
| --- | --- | --- |
| Keep the browser editor and integrated publishing | Continue building in Lovable | Whether its workflow and plan still fit your work |
| Use your preferred coding agent | Open a synced copy outside Lovable | Local setup, code review and coordination between editors |
| Choose where the app runs | Try a compatible host | Build output, secrets, external connections and release checks |
| Move the backend too | Plan a separate migration | Data, accounts, files, functions and application behavior |

For editor setup and access, use the documentation for [Claude Code](https://code.claude.com/docs/en/setup), [Codex](https://developers.openai.com/codex/auth), [Cursor](https://cursor.com/docs) or the tool you choose. Check the model access and usage allowance available to your account. Start with a tool you are comfortable using; a comparison of model names will not tell you whether you like reviewing its work on your app.

## Get the current code into your Agent

Use the [export and sync guide](/blog/how-to-export-lovable-code-to-github) if your project is not connected yet. In Lovable, check the repository, selected branch and sync status. Wait for any current edit to finish before handing that version to your Agent.

Lovable's [GitHub integration](https://docs.lovable.dev/integrations/github) syncs changes in both directions on the active branch. You can keep working in Lovable and also edit the repository externally. Coordinate those sessions so the tools are not changing the same files at the same time. Ask your Agent to work on a separate feature branch and review its changes before bringing them back to the synced branch.

Point your Agent at the repository and branch:

```text
Open my Lovable project from [GitHub repository URL], starting from
[branch name], and create a separate branch for this trial. Follow the
project's setup, install its dependencies and start it locally. Return the
working local URL, or name the missing setup without exposing secrets.
Do not change application code or write to production data.
```

Replace the brackets with your repository and the branch shown in Lovable. A private repository needs an authenticated account with access. Once your Agent has opened it, compare a recent visible change with the version you expected. This is a quick way to catch the wrong branch before you start debugging an old copy.

## Your coding LLM and your app's AI are separate

In this guide, “your own LLM” means the model access used by your coding tool to read and edit source files. It does not mean adding a key that replaces Lovable's internal development agent. You are opening the code in another tool and using that tool's workflow.

A coding subscription and bringing your own API key are also different arrangements. The tool you select may support subscription access, provider API access or both. Check what your account actually includes. An existing subscription may cover your trial, but additional usage and features can have their own limits or charges.

Now consider a chatbot inside your app. When a visitor sends it a message, that request needs an AI connection at runtime. Paying for an Agent to write the chatbot does not pay for the visitor's request. Lovable makes this distinction in its [app AI documentation](https://docs.lovable.dev/features/ai): the built-in connector powers features inside the app, separately from the agent that builds it.

Keep in mind: changing your editor does not automatically replace that connector. If you later switch the app to a direct provider API, your Agent needs to implement the connection, keep its credentials on the server and verify the feature. On ohmyho.st, a compatible app can keep that provider key in a [runtime secret](https://docs.ohmyho.st/secrets). Its API usage is still a separate cost from your development tool and hosting.

## Ask what the exported app depends on

Your Agent should inspect the actual project before choosing how to run or host it. Lovable's [external-hosting guide](https://docs.lovable.dev/tips-tricks/external-deployment-hosting) distinguishes older React/Vite apps from TanStack Start apps. A dependency on `@tanstack/react-start` in `package.json` identifies the latter. TanStack Start includes server execution, so uploading only static files will not run its server features. The presence of `vite.config.ts` alone is not enough to classify the project.

Have your Agent give you a short inventory you can understand:

| Part | What you need to know |
| --- | --- |
| Code and build | Which framework, package manager and scripts the repository uses |
| Database | Where the records live and which environment local code will contact |
| Login | Who handles authentication and which callback addresses are allowed |
| Files | Where uploads live and how private downloads are authorized |
| Functions and integrations | Which features need server code, secrets, scheduled work or external APIs |
| App AI | Whether calls use a managed connector or your own provider account |

The source export does not include the records in your database or the files in storage. Keeping your code gives you editing options, but provider-specific APIs still need attention when you replace a service. Check the data export and recovery path before planning a complete move.

Then ask what the app depends on:

```text
Inspect this project's configuration and API calls. Explain which database, auth service, file storage and AI services it uses. Show variable names, never secret values. Tell me whether local development would contact production and what test configuration is missing. Do not migrate or replace any service.
```

This matters before you click around locally. A Git branch separates code changes; it does not create a separate database. Existing environment files may connect to live records. Use a development backend for a trial that writes data, and ask your Agent to confirm that destination.

There can also be a gap between a working local page and working integrations. On TanStack Start projects, Lovable-managed AI and connector credentials may be unavailable to the server running on your machine. Test those features in Lovable's preview until you configure an independent integration. Lovable describes this limitation in its [local workflow documentation](https://docs.lovable.dev/integrations/git-sync-overview#work-locally-in-your-ide).

## Give your Agent a small, reversible job

Once the app starts, choose a change you can judge yourself. A clearer empty state, an awkward form label or a small mobile layout problem works well. Avoid using a full authentication rewrite as your first test of a new coding workflow; it makes the result harder to assess and undo.

A first job could look like this:

```text
On [page or route], replace the empty-state message with “[new message]”. Keep the existing behavior and styling. Run the relevant checks and show me the page locally. Then summarize the files changed and anything you could not verify. Leave the change on this branch for review.
```

Open the local page yourself. Does the message appear in the right situation? Is it readable on your phone-sized screen? Ask your Agent to show the diff, which is the before-and-after view of the changed files. For this example, you should be able to connect each change to the message you requested. An unrelated dependency update needs an explanation.

For a later change involving saved data, check the complete flow with a test account: sign in, perform the action and confirm the expected record appears. Check access while signed out too. Use harmless test records, and keep track of anything that sends mail or calls a paid API. A screenshot can show the interface; it cannot establish that permissions and integrations work.

Judge the workflow as well as the output. Could you explain the task naturally? Did you understand the changes? Could you recover when the Agent took a wrong turn? If the experience works for you, try a slightly larger task. If it adds friction, you can keep using Lovable while retaining your repository and the work you want to keep.

## Compare the costs you will actually keep

Changing editors may leave most of your app's running costs untouched. Moving its frontend can leave the database bill untouched too. Write down what stays before comparing monthly totals.

- **Development:** your coding tool's subscription, API usage and additional tool usage.
- **Hosting:** builds, requests, compute, storage and retained deployments at the selected host.
- **Backend services:** the database, files, mail or other services you continue using.
- **App AI:** model calls made by visitors or background jobs inside the deployed app.

Lovable currently documents a general credit balance covering building and running, with usage-specific grants consumed first. Read [its usage breakdown](https://docs.lovable.dev/introduction/credits-and-usage) for the account and project you have. A shared balance does not mean the activities have the same cost, and moving an activity does not remove charges for the services left behind.

On ohmyho.st, a shared credit balance pays for running the app and the managed services it uses. It does not pay for your coding Agent's tokens. Free provides {{ number plan.freeCredits }} credits per UTC month; Paid provides {{ number plan.paidCredits }} credits for {{ usd plan.paidUsd }} per month. These are usage allowances. Check the [rates and plan terms](/pricing) against your app's requirements before assuming it will fit.

Include your time in the decision. If you already have a working app, migrating accounts and files is work you need a reason to take on. You can prefer another editor without deciding that every service must move with it. Keep the dependencies that are doing their job until you have a clear benefit and a way to test a replacement.

## Try a Dev preview when you are ready to change hosting

ohmyho.st is a host that compatible Agents operate through [MCP or CLI](https://docs.ohmyho.st/agents/mcp). It can use an authorized GitHub repository or [managed source versions](/skills/ohmyhost-deploy/SKILL.md). Keeping GitHub is useful when you want continued sync with Lovable. Choose the source route deliberately, especially if the project already has one configured.

Start with a Dev preview you can open and test. Tell your Agent which services you intend to keep and ask it to explain any compatibility changes before applying them. Have it declare the external connections the app needs on the new host. Keep in mind that a preview address does not establish data isolation: check whether Dev and Prod share a backend before making test writes.

When you are ready to try another host, ask for a plan first:

```text
Prepare an ohmyho.st deployment plan for this version of my app. Keep the existing backend and auth provider. Identify runtime compatibility, required secrets and callback URLs. Explain the cost estimate and whether Dev data is isolated. After I approve the plan, deploy to Dev and give me the preview to test. Wait for my approval before promoting to Prod.
```

In Dev, check login, protected reads and writes, uploads and any AI features your app uses. When those checks pass, your Agent can prepare promotion of that verified artifact to Prod. Review the release and approve it when you are ready for users to receive it.

The [Lovable hosting guide](/blog/host-a-lovable-app-after-export) covers this handoff in more detail, and [Bring your app from Lovable](/from/lovable) provides the ohmyho.st entry prompt. Start with the local trial if your immediate goal is to work with your preferred Agent. You will have a better basis for the hosting decision after you have made and reviewed a real change.
