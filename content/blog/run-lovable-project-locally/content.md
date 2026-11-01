# Run a Lovable project locally

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published October 21, 2026 · Updated October 25, 2026

To run a Lovable project locally, connect it to GitHub and then ask your agent—such as Codex, Claude Code, or Cursor—to clone the repository, install its dependencies, and start the development server. Open the local address  it provdies. The code is now running on your computer, while the database, login, and files usually remain where they were.

A sngle prompt is  all it takes to get started:

```text
Start my Lovable project from [GitHub URL] locally.
```

Next, check the login and data access. Just because a page loads on your computer doesn’t mean its database, files, or inttegrations have  been moved there as well. If the project uses Lovable Cloud, the data stays with Lovable; if it uses your own Supabase project, it stays there. For separate test data , you may need a development database—such as a local Supabsae instance—and your agent can set that up for you. To move the data yourself, see [How to Move Out of Lovable Cloud](/blog/move-out-of-lovable-cloud).

This guide is intended for day-to-day dveelopment in your own editor. You can make this change before deciding whether to migrate your hosting. If you still need to get the source code, start with  our [Lovable GitHub Export Guide](/blog/how-to-export-lovable-code-to-github).

<nav aria-label="On this page" style="display:block;height:auto"><p><strong>On this page</strong></p><ul><li><a href="#check-the-project">What stays in the cloud</a></li><li><a href="#clone-and-install">Clone the Lovable project</a></li><li><a href="#local-environment">Set up environment variables</a></li><li><a href="#start-and-test">Start and test the app</a></li><li><a href="#troubleshooting">Troubleshoot common localhost errors</a></li><li><a href="#local-development-faq">FAQ on local development</a></li></ul></nav>

<div id="check-the-project"></div>

## What Stays in the Cloud

Think of the application as a series of interconnected parts. Your local development server serves the app; the services it cals can still run elsewhere. This is important when you click a button that creates a record, sends an email , or initiates a payment.

<figure class="fig"><a href="/images/lovable-local-development-map.png" target="_blank" rel="noopener" aria-label="Open the full-size local development diagram"><img src="/images/lovable-local-development-map.png" alt="Diagram showing how to run a Lovable project locally while keeping authentication, the database, and files hosted" width="1200" height="675" fetchpriority="high" decoding="async"></a><figcaption>When the app runs locally, the location where your code runs changes. Connected services require their own development environment if you want isolated test data.</figcaption></figure>

Keep an eye  on:
- Which repository and banch contain  the version you want to work on?
- Which bacckend (database, functions , etc.) will the local app connect to?
- Which functions call a hosed function , an AI service, or another external API?

Ask your aget to record these  connections first:

```text
Check which parts of this app will run locally and which still use hosted services. List the database, login, files, functions and AI calls.
Tell me which connections point to production and what we need for a separate development setup.
```

Use a  development backend for changes that write data. A Git branch isolates code changes but does not create its own database. An existing environment file can still point to the production environment. Loavble explains these differences in his [Guide to Local Development](https://docs.lovable.dev/integrations/git-sync-overview#work-locally-in-your-ide).

<div id="clone-and-install"></div>

## Clone the Lovable Project

In the project's Git settings , check the repository name, the selected branch, and the sync status. The screenshot beolw shows an existing connection. Use the clone URL for your own project, not the example URL shown in the image.

<figure class="fig"><a href="/shots/lovable-export-github-connected.png" target="_blank" rel="noopener" aria-label="Open full-size screenshot of the Lovable repository connection"><img src="/shots/lovable-export-github-connected.png" alt="Lovable repository settings showing the selected branch, connection status, GitHub sync status, and HTTPS clone address" width="1794" height="1094" loading="lazy" decoding="async"></a><figcaption>Check the branch and sync status, then copy your project’s clone address. Screenshot from our existing export guide.</figcaption></figure>

```text
Clone my Lovable project from [GitHub URL] using [source branch].
Create a separate branch for my local changes and open the project. Check what it needs to run locally and tell me which backend it will connect to.
```
Check that `git --version` works, and  then open a terminal in the parent folder whee you store your projects:

```bash
git clone --branch YOUR-SOURCE-BRANCH https://github.com/YOUR-ACCOUNT/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
git switch -c local-development
git status
```

Replace "Branch," "URL," and "directory name" with your own. Use the source branch that you checked out in Lovable; a simple clone selects the repository's default branch , which may be different. The next command creates a working branch named `local-development` for your chagnes. A privaate repository requires GitHub authentication. [GitHub’s  documentation on cloning](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) explains access and cloning. Let your agent switch branches unless you want to do it yourself.

Open the folder in your editor. Compare a recent visible change with the Lovable version you wanted to export. This way, you'll notice an older branch or a similarly named repository before you waste  time trying to figure out which project is the wrog one.

<div id="start-and-test"></div>

## Launch and test the app

Now ask your agent to launch the app. You don't need to figure out whether the project uses npm , pnpm, or Bun. Your agent can read the project, install the necessary packages, and prrovide you with the local URL.

<div id="local-environment"></div>

Keep in mind: The agent still needs to know which backend you want to use. If the project requires environment variables, ask the agent for their names and where you need to enter them. Private  keys should not be included in a prompt or posted on GitHub. [Vite’s Environment Guide](https://vite.dev/guide/env-and-mode) explains which vaues end up in the browser.]

Ask your aggent to open the app and  check the basics:

```text
Start this project locally. Read its README and package.json, use the package manager it already uses and install the required dependencies.
Check the environment variables and tell me which backend the app will use. If anything is missing, tell me where to enter it privately.
Give me the local URL. Then check login, a protected page, reading and writing test data, and uploads if the app uses them. Use a development backend for writes and show me what passed and what still needs attention.
```

Open the URL yourself. Does this look like your app? Try doing the things your users actually do. Log in, open a page that requires an account, and reload it. If the app stores data, cretae a test record and retrieve it. If  it processes files, upload a test file and open it.

Your agent can help with thsee tests , but you know what the app is supposed to do. Tell him what you expected and what happened instead. A screenshot or the exact error message is more helpful than just saying, “It doesn’t work.”

If that works , have the production build tested as well. Starting a development server and buildig the app for hosting are two different tests. Keep the first change small so you can see that your local version is updated as expected.

### If logging in takes you back to the live page

This can happen if the login still points to your published app. Ask your agent to check the return URL befroe  changing the authentication settings.

Give your agent the  adddress where you'll be staying:

```text
Login from my local app sends me to [the URL you land on]. Find out why.
Check which service handles authentication, the callback requested by the app and its allowed redirect URLs. Fix the local setup while keeping the live app's login working, then test sign-in, reload and sign-out.
```

Use the  settings for the backend you're actually using. The settings in Lovable Clod and your own Supabase dashboard are in different places. [Lovable explains its Supabase connection here](https://docs.lovable.dev/integrations/supabase).

With Supabase Auth, the loocal redirect URL must be allowed , and the app must request it. Adding this URL does not mean replacing the default URL of the live page with localhost. Your agent can verify both using the [Supabase Redirect Documentation](https://supabase.com/docs/guides/auth/redirect-urls).

After that, try again with a new login. An account that's already logged in migght mask the problem you were  trying to fix.

<div id="troubleshooting"></div>

## If something isn't working

Provide your agent with the error and the step that triggered it. You don't need to diagnose the problem yourself first. It's important to let them know whether the problem occurs when launching the app, opening a page , logging in, or saing.

| What happens | What You Should Ask Your Agent |
| --- | --- |
| The app won't start | Check the project requirements, dependencies, and the startup script |
| The page is blank | Read the first browser error and the output from the local server |
| Your information is missing | Check the backend connection, the account, and the access permissions |
| Logging in opens the live page | Check the local redirect and callback settings |
| An AI feature fails | Check where the request is being processed and what login credentials it requires |
| A local test changes live data | Stop any write operations and set up a development backend before running tests again |

Describe the step that  fialed:

```text
I tried [what you did] at [local URL] and expected [result]. Instead I got [error or screenshot].
Find the cause, explain it briefly and fix it. Keep the existing project setup unless a change is needed, then repeat the failing action to verify the fix.
```

Keep in mind: Some integrations still depend on services hosted by Lovables. AI and connector cedentials managed by Lovables are not automatically available to a local TanStack starter server. An older Vite app may still use hosted Edge Functions. Your agent will  need to review the actual project. [Lovable’s guide to local development](https://docs.lovable.dev/integrations/git-sync-overview#work-locally-in-your-ide) describes these differences.

Don't let the agent replace every service just because a single function faiils. Let it figure out what that function needs , and then decide whether you want to keep the existing service or move it.

## Save your changes to GitHub

If the app workks locally , ask your agent to show you the changes. Review them before sending them back to the repository.

Please review the  changes befoe committing:

```text
Show me the changes we made to get this app running locally. Check that private keys and local environment files are not included.
Commit the reviewed changes on our working branch. Tell me how that branch relates to the one Lovable is syncing, and ask me before merging into the shared branch or publishing the app.
```

Lovable follows the branch selected in its Git connection. If your loacl work is on a different branch , it will not appear there until you select that branch or merge the changes. Pushing to GitHub also does not publish the website. See [Lovable's overview of Git synchronization](https://docs.lovable.dev/integrations/git-sync-overview).

If anyone else is building in Lovable, work together to decide where you'll be working. That way , you won't be surprised when your local version and the Lovable preview show differrent things.

<div id="local-development-faq"></div>

## FAQ

### Can I run a Lovable project locally for free?

You don't need an additional hosting plan to run the  exported code on your computer. Howwever, the services your app calls upon may still incur costs. Ask your agent which database, AI, email, and file services the app uses before assuming that the entire setup is free.

### Does "localhost" mean that the app works offline?

No. It means that you open the app on your computer. Logins, data, and integrations may still reequire an internet connection. If you  want an offline app, be sure to tell your agent explicitly so they can check what needs to run locally or be replaced.

### Do I need to move my database first?

You can work with the code before migrating the database. Ask your agent to set up a development backend if you want to test write operations. Migrating the actual data is a separate task with its own checks. Do that when you're ready , rather than mixing it in with your fiirst local change.

For this next step , use [How to Move Out of Lovable Cloud](/blog/move-out-of-lovable-cloud), which includees prompts for exporting the data and populating the database that your agent has prepared.

## Tell your agent where to go

Your app is now running locally. If you want other people to use it, you'll also need a hosted version. Let your agent know whether you want to continue working locally or prepare for deplyment to  ohmyho.st.

When you're readdy to perform the deployment , use:

```text
I want this app on ohmyho.st. Read https://docs.ohmyho.st/quickstart and follow the current deployment Skill.
Inspect this project, reuse its existing project connection if there is one and tell me what needs to change. Check which backend services stay where they are.
Deploy to Dev and give me the URL so I can test the app. Show me the result and ask before publishing to Prod or switching my domain.
```

We're building ohmyho.st. Your agent can prepare the deployment and provide you with a dev URL for testing. For the  next step, use our [Guuide to Hosting Lovable Apps](/blog/host-a-lovable-app-after-export).

If you want to stay local for now, that's fine, too. Ask the agent to keep the project running on your computer and to save your changes to GitHub. Our [Gudie to  Using Your Own Coding Agent](/blog/lovable-alternative-bring-your-own-llm) describes this workflow.
