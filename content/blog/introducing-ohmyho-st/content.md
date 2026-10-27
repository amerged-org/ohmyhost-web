# Introducing ohmyho.st

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · September 13, 2026

Bring a GitHub app and ask your Agent to deploy it. ohmyho.st gives your coding agent the CLI, MCP tools and task Skills to check the project, connect the repository and prepare a deployment you can review.

Signup is open, with no invitation or access code. Copy the agent prompt from the homepage. Your Agent sends back a sign-in link where you can sign in or create an account. Once connected, tell it which app you want to deploy.

For example:

```text
Check my GitHub app and prepare an ohmyho.st Dev deployment. Identify the services it needs, check its main flows and give me the preview URL. Explain anything I need to review before publishing to Prod, and preserve any existing production data.
```

## Check your app before publishing

Open the preview and try the parts people will use. A public Vite app may not need a database or login provider. An app with a database needs its migrations and real data flows checked. If it has accounts, forms or uploads, try those too before asking your Agent to publish.

Your projects share an organization balance. You can ask your Agent which project used credits, whether a domain is ready or what a deployment is waiting for. Shared project notes help the next agent session pick up the work. The [five-side-project cost comparison](/blog/what-vercel-supabase-resend-cost-for-five-side-projects) explains the shared balance alongside separate Vercel, Supabase and Resend subscriptions.

The docs describe the currently available setup paths. Start there with the app you already have, then review the deployment before sending people to it.

[Start with your agent](https://docs.ohmyho.st/quickstart) · [Explore the Skills](https://docs.ohmyho.st/skills) · [Home](/)
