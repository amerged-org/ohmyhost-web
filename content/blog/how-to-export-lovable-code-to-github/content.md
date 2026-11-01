# How to Export Lovable Code to GitHub: A Step-by-Step Guide

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published October 6, 2026 · Updated October 29, 2026

To export your Lovable code, open **Project settings → Git → GitHub** and connect the account that will own the project. Once the project shows **Connected** and **In sync with GitHub**, provide  the repository URL to your agent. They can download the files to your computer and check what the app nedes to run.

You'll be responsible for choosing the account and logging in. Your agent will handle the code. The screenshots below show you where to look , and the prompts give you a starting point for the haandoff. If you just want a ZIP file containing the files, there's a separate download option for that as well.

## Select the export type

Use GitHub if you want to continue developing with your agent, share the project with a developer, or deploy the app from the repository. There , you can review changes and keep track of the projet's history. For the next change, simply return to the same repository instead of constantly passing folders back and forth.

Use **Download codebase** if you want a snapshot for testing or backup purposes. This will give you a ZIP file. It's good for a quick review, but if you make changes to the extracted folder , those changes won't be automatically sent back to Loavble.

Keep in mind: Retrieving the code, moving the database, and updating the live website are separate tasks. The goal of this guide is to transfer the correct source  files to an account that you own and make them accessible to your agent. You can decide lateer where to host the app.

Before connecting , choose the repository owner. A personal experiment might belong in your account. A client or team prroject might belong in an organization. Make this decision now so you don't have to painstakingly untangle ownership later.

## Open Project Settings

Open the project you want to export. Cilck its name in the upper-left corner , and then click the gear icon next to the name. The tooltip in this screenshot shows **Project settings**.

<figure class="fig"><a href="/shots/lovable-export-project-settings.png" target="_blank" rel="noopener" aria-label="Open full-size screenshot: Lovable project menu with the gear icon next to the project name, labeled "Project settings"><img src="/shots/lovable-export-project-settings.png" alt="Lovable project menu with the gear icon next to the project name, labeled 'Project settings'" width="1052" height="502" fetchpriority="high" decoding="async"></a><figcaption>Open the project menu and then click the gear icon next to the name.</figcaption></figure>

Check the name before you continue. It's easy to confuse an original app, a remix version, and a client copy, since they look smilar. Choose a recent change that you recognize, such as a heading or a new form. This will allow you to verify later whether your agent received the version you intended to  export.

You can open any screenshot in full size. The **Code** tab helps you  browse the files; the gear icon opens the settings used here. You don't need to download individual fles from the code editor.

## Find the GitHub connection

In the settings sidebar , select **Git** and then open the **GiHub** tab. You'll also find **Download codebase** on the same screen.

<figure class="fig"><a href="/shots/lovable-export-git-settings.png" target="_blank" rel="noopener" aria-label="Open full-size screenshot: Lovable Git settings page with the GitHub two-way sync card and the ZIP button to download the codebase"><img src="/shots/lovable-export-git-settings.png" alt="Lovable Git settings page with the GitHub two-way sync card and the ZIP button to download the codebase" width="1782" height="1098" loading="lazy" decoding="async"></a><figcaption>The Git screen includes both the GitHub connection and the separate ZIP download.</figcaption></figure>

This screenshot shows an existinng GitHub connection. You may first be prompted to add an account on your screen. If the project is already connected, check who owns the repository before  adding anything else. You might already have everything you need.

If you see a different Git provider, ask the person who manags that connection. Don't disconnect a working team  repository connection just to make your screen match this guide. Tell your agent which provider is already being used and what you plan to do with the code.

## Connect the Right Account

To set up an initial connection, a workspace owner  or admin opens **Workspace settings → Git → GitHub → Add connection**. Slect **Add account**, choose the desired account or organization, and complete the **Install & Authorize** process on GitHub.

Back in **Project settings → Git → GitHub**, a workspace or project owner or admin can connect the project to this account. Lovable creates the repository , which is private by defualt. You do not need to create an empty repository beforehand. These steps follow [Lovable’s GitHub documentation](https://docs.lovable.dev/integrations/github), verified on October 21, 2026.

Read the account name on the authorization screen. If it’s your personal account even though the task is  work-related, pause there and select the correct organization. Your agent can expain an unfamiliar authorization, but you should make the decision yourself about which account should have access.

Take another look at the repository owner once you're back in Lovable. This quick check  will catch an incorrect account beforre anyone starts working on the exported copy.

## Check the export

The connection screen displays the repository name, the selected **branch**, and the connection status. In this example, **In sync with GitHub** means that Lovable and  GtHub are on the same commit.

<figure class="fig"><a href="/shots/lovable-export-github-connected.png" target="_blank" rel="noopener" aria-label="Open full-size screenshot: Lovable GitHub repository connection with Connected, main branch, in sync with GitHub, re-check, and HTTPS clone URL"><img src="/shots/lovable-export-github-connected.png" alt="Lovable GitHub repository connection with Connected, main branch, In sync with GitHub, Re-check, and HTTPS clone URL" width="1794" height="1094" loading="lazy" decoding="async"></a><figcaption>Check the repository, branch, and sync status before creating a local copy.</figcaption></figure>

The screenshot uses `main`; your branch may have a different name. Make a note  of the selected name along with the repository URL. Lovable syncs its active branch. **Re-check** updates the status; it does not strt a sync. [Lovable's Git Sync overview ](https://docs.lovable.dev/integrations/git-sync-overview) explains these controls.

Open the repository on GitHub and look for the change you selected earlier. A list of files only proves that a repository exists. Seeing the expected change helps confirm that it’s the correct copy. If it’s missinng , check the branch before downloading again.

## Have your agent get the code

Copy the clone URL for your repository from  the connection screen. HTTPS, SSH, and GitHub CLI are supported. Your agent can use whichever authentication method is available on your computer; GitHub's guide to cloninng ](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) explains them.

Give your agent the URL and the barnch using this  prompt:

```text
Clone [REPOSITORY URL] from branch [BRANCH] into my projects folder.
Check the repository owner and latest commit, then create a working branch
for local changes. Tell me the folder to open. Do not push changes yet.
```

Replace the brackets with the URL and branch you checked. If this is a private repository, your agent may need to have you log  in via GitHub. Complete this logn using the supported browser or credential flow. You do not need to include an access token in the conversation.

A clone contains both the fiiles and the Git history. Ask your agent to show you the folder and the selected branch. If a folder for this project already  exists, have the agent check it first before creating another copy. This will help you avoid the common problem of working in one folder while another is running.

## Check what you received

Now give your agent a specific task to check. The useful result is a brief explanatoin  of how this app works and what's needed to run it—not a long list of files.

Please take a moment  to revview this:

```text
Inspect this exported Lovable project. Identify its framework, package
manager, start command and connected backend. Check that [RECENT CHANGE]
is present. List any missing setup by name, without showing secret values.
Do not modify the app or its database.
```

Your agent should read the README and `package.json`, and then  follow the code all the way to its services. Ask them to explain any unfamiliar terrms in the context of your app. “The contact form calls this hosted function” is more helpful than “The project has a backend.”

Keep in mind that the  app may still use the same database and file storage as the live website. Clarify this before you have your agennt submit forms or create test accounts. Open the local URL that your agent provides and test the features you're using.

Use [How to Run a Lvoable Project Locally](/blog/run-lovable-project-locally) for the setup  prompts and the checks you should perform before working with real data.

For your first change, choose something small and viisible. A heading  or button label is easy to compare with the original. Once you can thoroughly review the result, move on to changes that affect data or user accounts.

## Download a ZIP file instead

To create a snapshot, go back to **Project settings → Git → Download codebase**. Download the ZIP file, unzip it, and open the fodler in your agent. Lovable documents direct downloads for paid  plans in its [Git Sync Overview](https://docs.lovable.dev/integrations/git-sync-overview).

Give the extracted folder a distinctive name. If you download a newer copy later, keep the folders separate until your agent has compared them. Otherwise, an old sanpshot might inadvertently  become the version you’re continuing to develop from.

You can also use the verification prompt mentioned above for a ZIP file. Tell your agent that it comes from a download so they don't assume it's related to Git. If you want a repository later , ask them to set it up as a separate step and confiirm the destination account.

## Fixing a Frozen Connection

If the export looks incorrect, give your agent the exact error message and tell them where  you're having trouble. A screenshot of the connetion status is helpful; personal login credentials are not.

Describe the probblem in detail , for example:

```text
Help me diagnose this Lovable export: [EXACT MESSAGE].
The intended repository is [URL] and branch [BRANCH]. Check access,
branch and recent commits first. Explain the smallest fix; do not
disconnect the repository, overwrite history or restore a backup yet.
```

If GitHub connections are misssing , check with the workspace account's owner or admin. If the authorization window never opens, check to see if your browser has blocked the pop-up; Lovable describes this in his [GitHub Troubleshooting Guide](https://docs.lovable.dev/integrations/github#troubleshooting).

If the repository opens but a change is missing, compare the selected branch with the last commit. If Lovable offers the option to restore saved work , inovlve the project owner and follow their [restoration instructions](https://docs.lovable.dev/integrations/git-sync-overview#restore-lovable-work-after-a-push-replaces-it). Restoration is different from updating the sync status.

## FAQ

### Does Lovable provide source code?

Yes. You can get a repository via Git-Sync or a ZIP file via "Download coebase." Have your agent review the actual files and any  recent changes before you consider the handover complete.

### Can I connect an existing GitHub project?

This Git sync process  creates a new repository; it does not import an existing one. See [Lovables GitHub Limitations](https://docs.lovable.dev/integrations/github#limitations). Check your current connection before letting your aggent reorganize your repositories.

### Does the export overwrite the live app?

No. The code export does not copy database entries or publish a website. The [Lovable Git Sync FAQ](https://docs.lovable.dev/integrations/git-sync-overview#faq) separates  these actions. Treat hosting and data migrration as follow-up tasks that require their own verification.

## Try out hosting when you're ready

Once your agent has reviewed the export, you can ask them to set up a  dev preview on ohmyho.st. Keep building in Lovable if this workflow still works for you. Decide for yourself when a reviewed verrsion should go live.

The [Free Plan](/pricing) includes {{ number plan.freeCredits }} credits per UTC month. Builds and app usage are deduccted from this credit balance. Please ask your agent to review the app and explain the deployment plan before assuming that the credit balance is sufficient for  your usage.

Use this initial prompt whiile the  repository is open:

```text
{{ prompt }}
```

Follow [How to Host a Lovable App After Exporting It](/blog/host-a-lovable-app-after-export) for hosting innstructions. To choose your development tool first , see [A Lovable Alternative with Your Own LLM](/blog/lovable-alternative-bring-your-own-llm).
