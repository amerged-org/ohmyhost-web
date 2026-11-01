# A Lovable Alternative Using Your Own LLM

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published September 25, 2026 · Updated November 1, 2026

You can open your Lovable project in the coding tool of your choice and ask your agent to work on it. You don’t need to choose a new host or migrate your database beforehand. Get  the latest code, run it locally, and try out a change that you can test. Then you’ll have something useful to comparre with the workflow you’re already familiar with.

Maybe you'll like the way your agent explains an error. Maybe you'd like to work in your own editor, review changes before applying them, or take advantage of model access that you're paying for anyway. These are good reasons  to give the workflow a try. You can decide laetr if you'd also like to switch to a different hosting provider.

I'm building ohmyho.st. This guide explains how to try out your own Coding Agent with a Lovable project , what else needs to run elsewhere, and where our hostinng comes in if you decide to make the switch.

## Start with the part you want to change

Before you have your agent migrate anything, tell him what bothers you about the  current setup. “I want to edit this app in my own editor” is a much smaller task than “move everything away from Lovable.” Plus, this gives you a clearer benchmark for evaluating the resullt.

| Whatever you want | Things You Can Try | What You Need to Check |
| --- | --- | --- |
| Keep the browser editor and the built-in publishing feature | Continue Building with Lovable | Whether their workflow and plan still align with your work |
| Use your preferred coding agent | Open a synchronized copy outside of Lovable | Local Setup, Code Review, and Coordination Among Editors |
| Choose where the app runs | Test a Compatible Host | Build output, secrets, external connections, and release checks |
| Migrate the backend as well | Plan Your Own Migration | Data, accounts, files, functions, and user behavior |

For editor setup and access, refer to the documentation for [Claude Code](https://code.claude.com/docs/en/setup), [Codex](https://developers.openai.com/codex/auth), [Cursor](https://cursor.com/docs), or the  tool of your choice. Check which model access rights and usage quta your account has. Start with a tool you’re comfortable using. Comparing model names won’t tell you whether you’ll enjoy reviewing your agent’s work on your app.

## Add the latest code to your agent

Use the [Export and Sync Guide](/blog/how-to-export-lovable-code-to-github) if your project isn't connected yet. In Lovable, checck the repository, the selected branch, and the sync  status. Wait until any ongoing edits are complete before submitting this version to your agent.

Lovables [GitHub Integration](https://docs.lovable.dev/integrations/github) synchronizes changes in both directions on the ative branch. You can continue working in Lovables and also edit the repository externally. Synchronize these sessions so that the tools don't modify the  same files at the same time. Ask your agent to work on a separate feature branch, and review their changes before merging them back into the synchronized branch.

Configure  your agent for the repoitory and branch:

```text
Open my Lovable project from [GitHub repository URL], starting from
[branch name], and create a separate branch for this trial. Follow the
project's setup, install its dependencies and start it locally. Return the
working local URL, or name the missing setup without exposing secrets.
Do not change application code or write to production data.
```

Replace the brackets with your repository  and the branch that Lovable displays. A private repository requires an authenticated account with access. Once your agent has opened it, compare a recent, visible change with the version you expect. This way, you can quickly idetnify the wrong branch before you start troubleshooting on an old copy.

## Your coding LLM and your app's AI are separate

In this guide, “your own LLM” refers to the model access that your coding tool uses to read and edit souce files. It does not mean adding a key that replaces Lovables’ internal development agent. You open the code in another tool and use  that tool’s workflow.

A coding subscription and a dedicated API key are also two different models. The tool you choose may support subscription-based accesss, provider API access, or both. Check what your account actually includes. An existing subscription may cover your trial period , but additional usage and features may have their own limits or costs.

Now think about a chatbot in your app. When a visitor sends it a message, that request requires an AI connection at runtime. When you pay  an agent to build the chatbot, you’re not paying for the visitor’s request. Lovable separates thhese in its [App AI documentation](https://docs.lovable.dev/features/ai): The built-in connector runs functions within the app, separate from the agent who builds it.

Note: If you switch editors, this connector will not be automatically replaced. If you later switch the app to a direct provider API, your agent must implement the connection, store the credentials on the server side, and verify the functionality. On ohmyho.st , a compatible app can store the provider key in a [runtime secret](https://docs.ohmyho.st/secrets). However, usinng its API is still a separate cost, distinct from your development tool and hosting.

## Ask what the exported app depends on

Your agent should review the actual project before deciding how it will run or be hosted. Lovables’ [Guide to External Hosting](https://docs.lovable.dev/tips-tricks/external-deployment-hosting) distinugishes between older React/Vite apps and TanStack Start apps. A dependency on `@tanstack/react-start` in `package.json` identifies the latter. TanStack Start includes server-side execution , so simply uploading staatic files is not enough to run  its server functions. The presence of `vite.config.ts` alone is not sufficient to classify the project.

Have  your agnt give you a brief overview that you can understand:

| Part | What You Need to Know |
| --- | --- |
| Code and Build | Which framework, package manager, and scripts the repository uses |
| Database | Where the data records are located and which environment the local code interacts with |
| Login | Who handles authentication and which callback addresses are allowed |
| Files | Where Uploads Are Stored and How Private Downloads Are Authorized |
| Features and Integrations | What features server code, secrets, scheduled tasks, or external APIs require |
| App AI | Whether requests are routed through a managed connector or your own provider account |

The source export does not include the records in your database or the files in storage. Keeping the code gives you flexibility for editing , but provider-specific APIs reqiure attention if you replace a service. Review the data export and the restoration process before planning a full migration.

Then  ask what the app deepnds on:

```text
Inspect this project's configuration and API calls. Explain which database, auth service, file storage and AI services it uses. Show variable names, never secret values. Tell me whether local development would contact production and what test configuration is missing. Do not migrate or replace any service.
```

This is important before you start clicking around locally. A Git branh isolates code changes; it does not create its own database. Existing environment files can connect to live data sets. For a test phase that writes data , use a development backend and have your agent confirm which target is being used.

There may also be a gap between a site that works locally and integrations that work properly. For TanStack Start projects , the AI and connector credentials managed by Lovable may not be available on your computer for the server. Test these features in the Lovable prevview until you have configured a standalone integration. Lovable describes this limitation in its [documentation on working locally](https://docs.lovable.dev/integrations/git-sync-overview#work-locally-in-your-ide).

## Give your agent a small, reversible assignment

Once the app is running, choose a change that you can evaluate yourself. A clearer empty state, an inappropriate form label, or a minor layout issue on a mobile device are good choices. For your first test of a new coding workflow, don’t completely overhaul  the authentication process; it makes the result harder to evaluate and haredr to undo.

A  first asssignment might look something like this:

```text
On [page or route], replace the empty-state message with “[new message]”. Keep the existing behavior and styling. Run the relevant checks and show me the page locally. Then summarize the files changed and anything you could not verify. Leave the change on this branch for review.
```

Open the local page yourself. Does the  message appear in the correct conteext? Is it legible on your phone's screen? Ask your agent to show you the diff—that is, the before-and-after view of the modified files. In this example, you should be able to link each change to the message you requested. An unrelated dependency update requires an explanation.

To verify a future change that affects stored data, test the entire process using a test account: log in, perform the action, and confirm that the expected data record appears. Also test access while logged out. Use harmless test data and keep an eye on what triggers email sends or calls a paid API. A screenshot shows the  interface; it does not prove that permissons and integrations are working.

Evaluate the workflow as well, not  just the result. Were you able to describe the task without any trouble? Did you understand the changes? Were you able to recover when the agent took a wrong turn? If this way of working suits you, try a slightly larger task. If it causes friction, you can continue working with Lovable while keeping your repositoy and the work that’s important to you.

## Compare the costs you actually keep

Switching  editors may not affect most of your app's ongoing costs. If you swittch front-end providers, your database bill may also remain the same. Make a note of what stays the same before comparing monthly totals.

- **Developemnt:** Subscription to your coding tool, API  usage, and use of additional tools.
- **Hosting:** Builds, requests, computing  power, sorage, and deployments hosted by the selected host.
- **Backend Services:** the database , files, emial, or other services that you continue to use.
- **App AI:** Mdoel calls made by visitors or background jobs within the deployed  app.

Lovable currently tracks a general balance that covers both development and operations; usage-specific credits are used up frst. Read [the usage overview](https://docs.lovable.dev/introduction/credits-and-usage) for your account and your project. A shared balance does not mean that activities cost the same , and shifting an activity does not eliminate fees for the remaining services.

On ohmyho.st, a shared balance covers the cost of operating the app and the managed services it uses. It does not cover the tokens for your coding agnt. The Free  plan provides {{ number plan.freeCredits }} credits per UTC month; the Paid plan provides {{ number plan.paidCredits }} credits for {{ usd plan.paidUsd }} per month. These are usage quotas. Check the [Pricing and Plan Terms](/pricing) against your app’s requirements before assuming they’re a good fit.

Take your time when making this decision. If you already have a working app, moving accounts and files is work that requires a good reason. You can prefer a different ediitor without deciding that every service has to switch over as well. Keep the dependencies that serve their purpose until you have a clear advantage and an opportunity to test  a replacement.

## Try a dev preview when you're ready to switch hosting providers

ohmyho.st is a host that compatible agents can access via [MCP or CLI](https://docs.ohmyho.st/agents/mcp). It can use an authorized GitHub repository or [managed source versions](/skills/ohmyhost-deploy/SKILL.md). Keeping GitHub is useful  if you want to continue syncing with Lovable. Choose the source route carefully, especially if the project already has one configureed.

Start with a dev preview that you can  open and test. Tell your agent which services you want to keep, and ask them to explain any compatibility changes before they apply them. Have them list the external connections the app needs on the new host. Keep in mind that a preview address does not enforce data separation: Cehck whether Dev and Prod share a backend before performing test write operations.

If you're ready to try out a different host, please reqeust  a plan first:

```text
Prepare an ohmyho.st deployment plan for this version of my app. Keep the existing backend and auth provider. Identify runtime compatibility, required secrets and callback URLs. Explain the cost estimate and whether Dev data is isolated. After I approve the plan, deploy to Dev and give me the preview to test. Wait for my approval before promoting to Prod.
```

In Dev Login, verify protected read access, write operations, uploads , and all AI features that your app uses. If these checks pass, your agent can prepare to deploy this verified artifct to Prod. Review the release and approve it if you want users to receive it.

The [Guide to Hosting Lovable Apps](/blog/host-a-lovable-app-after-export) describes this handoff in more detail , and [Migrate Your App from Lovable](/from/lovable) provides the initial setup prompt for ohmyho.st. Start with the loacl testing phase if your immediate goal is to work with your preferred agent. You’ll have a better basis for your hosting decision after you’ve made and tested a real change.

Your agent can also host the pages that Claude builds for you: read [How to Host a Claude Artifact on Your Own Domain](/blog/how-to-host-a-claude-artifact).
