# How to export Lovable code to GitHub: a step-by-step guide

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published October 6, 2026 · Updated October 21, 2026

To export your Lovable code, open **Project settings → Git → GitHub** and connect the account that should own it. Once the project shows **Connected** and **In sync with GitHub**, give the repository URL to your Agent. It can get the files onto your computer and check what the app needs to run.

You handle the account choice and sign-in. Your Agent handles the code. The screenshots below show where to look, and the prompts give you a starting point for the handoff. If you just want a ZIP of the files, there is a separate download option too.

## Choose the kind of export

Use GitHub if you want to keep building with your Agent, share the project with a developer or deploy from the repository. It gives you somewhere to review changes and keep the project's history. You can return to that same repository for the next change instead of passing another folder around.

Use **Download codebase** if you want a snapshot to inspect or save. That gives you a ZIP. It is useful for a quick review, but editing the extracted folder will not automatically send changes back to Lovable.

Keep in mind: getting the code, moving the database and changing the live website are separate jobs. For this guide, the goal is to get the right source files into an account you control and make them available to your Agent. You can decide where to host the app afterwards.

Before connecting anything, choose the repository owner. A personal experiment can live in your account. A client or team project may belong in an organization. Make that choice now so you do not have to untangle the ownership later.

## Open project settings

Open the project you want to export. Click its name at the top left, then the gear beside the name. The tooltip in this screenshot says **Project settings**.

<figure class="fig"><a href="/shots/lovable-export-project-settings.png" target="_blank" rel="noopener" aria-label="Open full-size screenshot: Lovable project dropdown with the gear icon labelled Project settings beside the project name"><img src="/shots/lovable-export-project-settings.png" alt="Lovable project dropdown with the gear icon labelled Project settings beside the project name" width="1052" height="502" fetchpriority="high" decoding="async"></a><figcaption>Open the project menu, then click the gear beside its name.</figcaption></figure>

Check the name before you continue. It is easy to have an original app, a remix and a client copy that look similar. Pick a recent change you recognize, such as a heading or a new form. You can use it later to confirm that your Agent received the version you meant to export.

You can open each screenshot at full size. The **Code** tab helps you browse files; the gear opens the settings used here. There is no need to download individual files from the code editor.

## Find the GitHub connection

In the settings sidebar, choose **Git**, then open the **GitHub** card. The same screen also contains **Download codebase**.

<figure class="fig"><a href="/shots/lovable-export-git-settings.png" target="_blank" rel="noopener" aria-label="Open full-size screenshot: Lovable Settings Git page showing the GitHub two-way sync card and Download codebase ZIP button"><img src="/shots/lovable-export-git-settings.png" alt="Lovable Settings Git page showing the GitHub two-way sync card and Download codebase ZIP button" width="1782" height="1098" loading="lazy" decoding="async"></a><figcaption>The Git screen contains both the GitHub connection and the separate ZIP download.</figcaption></figure>

This screenshot shows an existing GitHub connection. Your screen may first ask you to add an account. If the project is already connected, check who owns the repository before adding anything else. You may already have everything you need.

If you see a different Git provider, check with the person who manages that connection. Do not disconnect a working team repository just to make your screen match this guide. Tell your Agent which provider is already in use and what you want to do with the code.

## Connect the right account

For an initial connection, a workspace owner or admin opens **Workspace settings → Git → GitHub → Add connection**. Choose **Add account**, select the intended account or organization, then complete **Install & Authorize** on GitHub.

Back in **Project settings → Git → GitHub**, a workspace or project owner or admin can connect the project to that account. Lovable creates the repository, private by default. You do not need to create an empty repository first. These steps follow [Lovable's GitHub documentation](https://docs.lovable.dev/integrations/github), checked October 21, 2026.

Read the account name on the authorization screen. If it is your personal account but this is company work, stop there and select the right organization. Your Agent can explain an unfamiliar permission, but you should make the decision about which account gets access.

Once you return to Lovable, look at the repository owner again. That small check catches a wrong account before anyone starts working in the exported copy.

## Check the export

The connection screen shows the repository name, the selected **Branch** and the connection status. In this example, **In sync with GitHub** means Lovable and GitHub are on the same commit.

<figure class="fig"><a href="/shots/lovable-export-github-connected.png" target="_blank" rel="noopener" aria-label="Open full-size screenshot: Lovable GitHub repository connection showing Connected, main branch, In sync with GitHub, Re-check and HTTPS clone URL"><img src="/shots/lovable-export-github-connected.png" alt="Lovable GitHub repository connection showing Connected, main branch, In sync with GitHub, Re-check and HTTPS clone URL" width="1794" height="1094" loading="lazy" decoding="async"></a><figcaption>Check the repository, branch and in-sync status before taking a local copy.</figcaption></figure>

The screenshot uses `main`; your branch may have another name. Write down the selected name with the repository URL. Lovable syncs its active branch. **Re-check** refreshes the status; it does not start a sync. [Lovable's Git sync overview](https://docs.lovable.dev/integrations/git-sync-overview) explains those controls.

Open the repository on GitHub and look for the recent change you picked earlier. Seeing a file list proves that a repository exists. Seeing the change you expected helps establish that it is the right copy. If it is missing, check the branch before downloading again.

## Let your Agent get the code

Copy your repository's clone URL from the connection screen. HTTPS, SSH and GitHub CLI are supported options. Your Agent can use the authentication method available on your computer; [GitHub's cloning guide](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) explains them.

Here a prompt:

```text
Clone [REPOSITORY URL] from branch [BRANCH] into my projects folder.
Check the repository owner and latest commit, then create a working branch
for local changes. Tell me the folder to open. Do not push changes yet.
```

Replace the brackets with the URL and branch you checked. If this is a private repository, your Agent may need you to sign in through GitHub. Complete that sign-in through the supported browser or credential flow. You do not need to paste an access token into the conversation.

A clone includes Git history as well as the files. Ask your Agent to show you the folder and the branch it selected. If a folder for this project already exists, have it inspect that folder before creating another copy. That avoids the familiar problem of editing one folder while running another.

## Check what you received

Now give your Agent a specific inspection task. The useful result is a short explanation of how this app works and what is needed to run it, not a long list of files.

Here a prompt:

```text
Inspect this exported Lovable project. Identify its framework, package
manager, start command and connected backend. Check that [RECENT CHANGE]
is present. List any missing setup by name, without showing secret values.
Do not modify the app or its database.
```

Your Agent should read the README and `package.json`, then follow the code to its services. Ask it to explain unfamiliar terms in the context of your app. “The contact form calls this hosted function” is more useful than “the project has a backend.”

Keep in mind that the app may still call the same database and file storage as the live website. Get that destination clear before asking your Agent to submit forms or create test accounts. Open the local URL your Agent gives you and test the parts you use.

Use [How to run a Lovable project locally](/blog/run-lovable-project-locally) for the setup prompts and the checks to make before working with real data.

For your first change, pick something visible and small. A heading or button label is easy to compare with the original. Once you are comfortable reviewing the result, move on to changes that affect data or user accounts.

## Download a ZIP instead

For a snapshot, return to **Project settings → Git → Download codebase**. Download and extract the ZIP, then open the folder in your Agent. Lovable documents direct downloads for paid plans in its [Git sync overview](https://docs.lovable.dev/integrations/git-sync-overview).

Give the extracted folder a recognizable name. If you download a newer copy later, keep the folders separate until your Agent has compared them. Otherwise an old snapshot can quietly become the version you continue developing.

You can use the inspection prompt above on a ZIP too. Tell your Agent it came from a download so it does not assume there is a Git connection. If you later want a repository, ask it to prepare that as a separate step and confirm the destination account.

## Fix a stuck connection

If the export looks wrong, give your Agent the exact message and the point where you got stuck. A screenshot of the connection status is useful; private credentials are not.

Here a prompt:

```text
Help me diagnose this Lovable export: [EXACT MESSAGE].
The intended repository is [URL] and branch [BRANCH]. Check access,
branch and recent commits first. Explain the smallest fix; do not
disconnect the repository, overwrite history or restore a backup yet.
```

For missing GitHub connections, check the workspace account with its owner or admin. If authorization never opens, check whether the browser blocked the popup; Lovable includes that in its [GitHub troubleshooting](https://docs.lovable.dev/integrations/github#troubleshooting).

If the repository opens but an edit is missing, compare the selected branch and latest commit. If Lovable offers saved-work recovery, involve the project owner and follow its [recovery instructions](https://docs.lovable.dev/integrations/git-sync-overview#restore-lovable-work-after-a-push-replaces-it). Recovery is a different action from refreshing sync status.

## FAQ

### Does Lovable give me source code?

Yes. You can get a repository through Git sync or a ZIP through Download codebase. Have your Agent check the actual files and a recent change before treating the handoff as complete.

### Can I connect an existing GitHub project?

This Git sync flow creates a new repository; it does not import an existing one. See [Lovable's GitHub limitations](https://docs.lovable.dev/integrations/github#limitations). Check the current connection before asking your Agent to reorganize repositories.

### Does exporting move the live app?

No. Code export does not copy database records or publish a website. [Lovable's Git sync FAQ](https://docs.lovable.dev/integrations/git-sync-overview#faq) separates those actions. Treat hosting and data migration as follow-up work with their own checks.

## Try hosting when you are ready

Once your Agent has checked the export, you can ask it to prepare a Dev preview on ohmyho.st. Keep building in Lovable if that workflow still suits you. Choose when a reviewed version should become live.

The [Free plan](/pricing) includes {{ number plan.freeCredits }} credits per UTC month. Builds and app usage draw from that balance. Ask your Agent to inspect the app and explain its deployment plan before assuming the allowance covers your use.

Use this entry prompt with the repository open:

```text
{{ prompt }}
```

Follow [How to host a Lovable app after export](/blog/host-a-lovable-app-after-export) for the hosting walkthrough. To choose your development tool first, see [A Lovable alternative with your own LLM](/blog/lovable-alternative-bring-your-own-llm).
