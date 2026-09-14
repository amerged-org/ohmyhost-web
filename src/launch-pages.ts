/** Launch prose is exported as the reviewed Mintlify snapshot; runtime contracts stay in the platform. */
export const LAUNCH_DOCUMENTS: Record<string, string> = {
  "/terms": `# Beta terms

Last updated: September 13, 2026. ohmyho.st is provided by amerged B.V., Netherlands. Use [our contact form](/contact).

## Access and your projects

Hosting access requires an accepted invitation and an authorized account. You must have permission to deploy the GitHub repository and use the content, domains and services you connect. Keep your account credentials private and review the actions you authorize your agent to perform.

You retain ownership of your application and data. The service processes them to build, host and operate the capabilities you request. Use the service lawfully; do not use it to send spam, distribute malware, attack other systems or access another customer's resources.

## Credits and purchases

Deployment plans and the service's published rate cards describe resource consumption. Organization credits are shared across projects; optional project budgets limit a project's use. Review the quote before authorizing work. Purchases, where enabled, take place through the displayed checkout and applicable price. A top-up is not a subscription renewal. The website's pricing calculator does not authorize a payment.

## Availability and leaving

This is a beta and has no uptime SLA. Features, limits and availability can change. Use the current product documentation and returned operation status to determine whether a requested capability is ready. Maintain a recovery plan for important data. Available database exports are requested through the API, CLI or MCP using a password you retain.

By accepting these Terms of Service, you also accept the [Data Processing Agreement (DPA)](/dpa), including its annexes, which is incorporated into these terms by reference. The DPA applies to personal data we process on your behalf.

These terms do not remove rights that applicable law makes mandatory. Our [Privacy notice](/privacy) explains personal-data processing. [Read the docs](/docs) or [return home](/).`,
  "/about": `# Hosting for agents

<img src="/brand/assets/founder.png" width="96" height="96" loading="lazy" alt="Founder of ohmyho.st" style="border-radius:50%">

ohmyho.st brings supported application hosting, Postgres, domains and transactional mail into an agent-operated workflow. You use your existing coding agent to plan changes, deploy, check usage and export a database.

Projects share an organization credit balance. You choose which services each application needs and whether Dev and Prod share data or keep it separate.

The operator is Amerged B.V., KVK 42154221, Venray, Limburg, NL. Use [our contact form](/contact).

[How to start](/docs/quickstart) · [Where credits go](/pricing/breakdown) · [Our approach](/#philosophy)`,
  "/pricing": `# One balance for your projects

Free starts with 200 credits. Paid starts at $10 for 1,000 monthly credits. Projects use the same organization balance; there is no separate project base subscription.

## What uses credits

Measured builds, worker requests and CPU time, database compute and storage, file storage and operations, and enabled mail use their published rates. An idle database can suspend its compute; retained storage still uses credits.

| Database profile | Size | Sleep after idle |
| --- | --- | --- |
| Free | 0.25 CU / 1 GB | 1 minute |
| Paid standard | 0.5 CU / 2 GB | 2 minutes |
| Paid performance | 1 CU / 4 GB | 5 minutes |

Performance uses 2.5 times standard database-compute credits for equal active time. Shared Dev/Prod uses one database; isolated data uses two independently metered databases.

## Control your spending

Ask your agent for remaining credits, measured usage and optional project budgets. A top-up adds credits but does not extend a subscription. Automatic recharge and promotional calculator discounts are not enabled in the current beta. Production purchases are not yet enabled; invited organizations can use their available balance.

[Worked cost example](/pricing/breakdown) · [Usage guide](/docs/usage) · [Compare Vercel](/vs/vercel)`,
  "/pricing/breakdown": `# Where your credits go

Published rate basis checked September 13, 2026. At the standard purchase rate, 100 credits represent $1 of credit value. Credit consumption and the amount of a subscription payment are different.

| Measured quantity | Credits |
| --- | ---: |
| Build minute | 1.642857 |
| One million Worker requests | 98.571429 |
| One million Worker CPU milliseconds | 6.571429 |
| Standard database CU-hour | 72.942857 |
| Performance database CU-hour | 91.178571 |
| Database GB-month | 115 |
| File-storage GB for 30 days | 4.928571 |
| 1,000 mail recipients, published Essentials example | 52.571429 |

Actual charges use the active rate card, measured quantities and microcredit rounding. Your agent can read those cards and usage through the [usage API](/docs/usage). Storage, history and other operations may add consumption; different mail configurations can have different rates.

## An example workload

Twenty build minutes (32.857143 credits), 100,000 worker requests (9.857143), one million CPU milliseconds (6.571429), four standard database CU-hours (291.771429), one database GB-month (115), and 2,000 Essentials mail recipients (105.142857) total **561.2 credits**: $5.612 in credit value.

Five identical workloads total **2,806 credits**. At the standard pack rate, 3,000 credits would cover these selected quantities. This is arithmetic, not a benchmark, a guaranteed bill or a complete estimate for an unspecified app.

## A separate subscription scenario

One developer on Vercel Pro ($20), one Supabase Micro project on Pro ($25 total) and Resend Pro ($20) totals $65/month before extras and taxes. With five Supabase Micro projects, that scenario totals about $105/month. Vercel and Resend base plans are not charged again for each project. Free allowances can reduce the alternative cost, and the services do not offer identical capacity or features.

Sources: [Vercel](https://vercel.com/docs/plans/pro-plan), [Supabase billing](https://supabase.com/docs/guides/platform/billing-on-supabase), [Resend](https://resend.com/pricing).

[Pricing](/pricing) · [Read your usage](/docs/usage) · [Compare services](/vs/vercel)`,
  "/vs/vercel": `# ohmyho.st and Vercel

Choose the hosting workflow that fits your application. Vercel provides an extensive deployment platform; ohmyho.st combines supported application hosting and optional managed services with an agent-operated organization balance.

## Price model

Vercel Pro starts at $20/month with one deploying seat and $20 usage credit; additional deploying seats cost $20/month. Its current lowest Flat Rate CDN tier includes one million requests and 1 TB transfer. Hobby is for personal, non-commercial use. These are service allowances, not prices to multiply by your app count.

## What your app needs

ohmyho.st focuses on supported Next.js, Vite and TanStack applications. Database, auth, mail, secrets and migrations depend on the capabilities your application actually uses. Your agent plans the deployment and checks the resulting app.

Vercel can be a better fit when its deployment ecosystem, integrations or supported features are requirements. Compare a concrete workload and framework behavior; a lower starting balance does not imply equal capacity.

## Move with your agent

Keep your application in GitHub, inventory its services and use the [deployment Skill](/skills/ohmyhost-deploy-github/SKILL.md). Changing hosts does not require replacing your auth provider by default.

Checked September 13, 2026: [Vercel Pro](https://vercel.com/docs/plans/pro-plan), [Vercel pricing](https://vercel.com/pricing).

[Cost breakdown](/pricing/breakdown) · [GitHub guide](/docs/github) · [From Vercel and Supabase](/from/vercel-supabase)`,
  "/vs/supabase": `# ohmyho.st and Supabase

Supabase combines Postgres with Auth, Realtime and database tooling. ohmyho.st hosts supported applications with optional managed Postgres while you choose your application's authentication.

## Price model

Supabase Pro costs $25/month per organization and includes $10 compute credit. Micro compute is approximately $10/month per project: one Micro project is $25 total, while five continuously running Micro projects are approximately $65 before extras. A Free plan is available.

## Keep the capabilities you use

An exported repository may use Supabase Auth, Storage, Realtime or Functions as well as Postgres. Inventory actual usage before planning a move. A package name alone does not establish which services need migration, and a plain database dump does not migrate every Supabase feature.

Supabase may fit best when those integrated services are central to your app. If you choose a migration, your agent should verify login, protected routes, reads and writes after the change.

Checked September 13, 2026: [Supabase pricing](https://supabase.com/pricing), [billing guide](https://supabase.com/docs/guides/platform/billing-on-supabase).

[Migration guide](/from/vercel-supabase) · [Application auth](/docs/application-auth) · [Cost breakdown](/pricing/breakdown)`,
  "/vs/resend": `# ohmyho.st and Resend

ohmyho.st provides transactional mail alongside supported application hosting. Resend is a dedicated email product with its own tooling and allowances.

## Compare the quantities

Resend Free includes 3,000 emails/month, up to 100/day, and three domains. Pro costs $20/month for 50,000 emails, with additional usage at $0.90 per 1,000, ten domains and no daily quota. Recipients in To, CC and BCC count separately.

The published ohmyho.st Essentials mail example uses about 52.571429 credits per 1,000 recipients: $0.525714 of credit value at the base purchase rate. Two thousand recipients are about $1.051429; 50,000 are about $26.285714. Resend Free can cover the smaller example if its daily limit fits, while Resend Pro includes the larger volume for $20. Read your active rate card before comparing costs.

## Connect and verify

Managed mail requires Paid access and verified sender DNS. A verified sender is distinct from successful delivery and account sending availability. Ask your agent to check the sender, the original deployment operation and a real application send.

Checked September 13, 2026: [Resend pricing](https://resend.com/pricing), [pricing details](https://resend.com/docs/knowledge-base/what-is-resend-pricing).

[Email guide](/docs/email) · [DNS guide](/docs/domains) · [Cost breakdown](/pricing/breakdown)`,
  "/vs/railway": `# ohmyho.st and Railway

Railway runs a broad range of services and containers. ohmyho.st focuses on supported application frameworks and an agent workflow for hosting, Postgres, domains, mail and usage.

## Price model

Railway provides a $5 trial credit for 30 days, followed by a Free plan with $1 monthly credit. Hobby has a $5 minimum including $5 usage; Pro has a $20 minimum including $20 usage. Usage beyond the included amount adds to the bill. These are not a base fee plus every dollar of usage again.

## Runtime fit

Railway supports Docker and many runtimes, with optional Serverless sleeping for inactive services. It may be a better fit for applications needing arbitrary containers or services outside ohmyho.st's supported contracts.

For Next.js, Vite or TanStack, start with a real framework/capability check and a workload estimate. Both products meter resource usage; compare what your app needs and how you want to operate it.

Checked September 13, 2026: [Railway pricing](https://railway.com/pricing), [Serverless](https://docs.railway.com/deployments/serverless).

[Supported frameworks](/docs/frameworks/vite) · [Usage](/docs/usage) · [Pricing](/pricing)`,
  "/status": `# Service status

This page reports the scope of the current observation. An available API does not establish that every customer application or provider is healthy.

<div id="service-status" role="status">Checking current API and reporting availability…</div>

For your application's deployment, domain, database or mail status, ask your agent to read the project context and original operation. Those results include the action relevant to your project.

[Project status](/docs/status) · [Troubleshooting](/docs/troubleshooting) · [Home](/)`,
  "/changelog": `# Changelog

## September 13, 2026

The beta website now distinguishes invited signup from registering interest. Task Skills cover initial connection, GitHub deployment, database sizing, DNS and email, usage and budgets, troubleshooting and encrypted SQL export.

Public CLI/MCP releases provide project context, operation diagnostics, usage reports and user-owned deployment tokens. See the current [release manifest](/docs/cli) for the exact published version.

[Documentation](/docs) · [Skills](/docs/skills) · [Beta introduction](/blog/introducing-ohmyho-st)`,
  "/blog": `# From the build

[Introducing the ohmyho.st beta](/blog/introducing-ohmyho-st): the agent workflow, GitHub deployment and what to try first.

[Read the docs](/docs) · [Home](/)`,
  "/blog/introducing-ohmyho-st": `# Introducing the ohmyho.st beta

September 13, 2026.

The first thing to try is simple: bring a GitHub app and ask your coding agent to deploy it. ohmyho.st provides the CLI, MCP tools and task Skills to plan the work, connect the repository and check the result.

Your projects share an organization balance. You can ask which project used credits, whether a domain is ready or what a deployment is waiting for. Shared project notes keep the next action available when an agent session changes.

Start with the capabilities your app needs. A public Vite app can be public without a database or auth provider. A database-backed application needs its migrations and real data flows checked. Production promotion should preserve existing production records.

The beta is invitation-only. Open your invitation link to get the agent prompt, or use Get beta access on the homepage to register interest. The docs describe the currently available paths; upcoming features remain separate.

[Start with your agent](/docs/quickstart) · [Explore the Skills](/docs/skills) · [Home](/)`,
};

const agentPages = {
  "claude-code": ["Claude Code", "claude mcp add ohmyho -- ohmyhost-mcp"],
  cursor: [
    "Cursor",
    "Add a local stdio MCP server with command ohmyhost-mcp in Cursor's MCP settings.",
  ],
  codex: ["Codex", "codex mcp add ohmyho -- ohmyhost-mcp"],
};
for (const [slug, [name, command]] of Object.entries(agentPages))
  LAUNCH_DOCUMENTS[`/for/${slug}`] = `# Deploy with ${name}

Keep working in ${name} and let the ohmyho.st Skills guide the hosting steps.

## Connect

Open your project and your invitation link. Copy the agent prompt, or follow the [CLI/MCP installation guide](/docs/mcp) first. The current MCP server runs locally with Node.js.

${command}

Use the installed tool's help when a version has different setup syntax. Preserve your other MCP servers and reload the connection if required. Ask the agent to list the ohmyho.st tools and read the get-started Skill.

## Deploy

Your agent signs in, selects your organization, gets authorized GitHub access and reviews a plan for the selected commit. It follows the accepted operation and verifies the actual application before reporting a working URL.

## Continue later

Ask “Read this project's context and finish its next action.” The agent can check usage, DNS/email readiness and deployment errors through the same tools.

[Get-started Skill](/skills/ohmyhost-get-started/SKILL.md) · [GitHub guide](/docs/github) · [Pricing](/pricing)`;

const sourcePages = {
  lovable: "Lovable",
  bolt: "Bolt",
  replit: "Replit",
  "vercel-supabase": "Vercel and Supabase",
};
for (const [slug, name] of Object.entries(sourcePages))
  LAUNCH_DOCUMENTS[`/from/${slug}`] = `# Bring your app from ${name}

Start with your application's GitHub repository. Keep the application working while your agent checks what it uses and plans the move.

## Inventory the app

Identify the framework, application directory, package manager, auth provider, database, files, functions and external services. Exported source does not automatically include database rows, uploaded files or runtime secrets.

## Choose what moves

Preserve your existing authentication choice unless you request a change. If the repository uses Supabase-specific services, the migration Skill inventories each capability; a package name alone is not a reason to replace it. Some capabilities require source changes or may not fit the supported runtime.

## Deploy and verify

Push the chosen source to GitHub and use the [deployment Skill](/skills/ohmyhost-deploy-github/SKILL.md). Configure the correct environment's secrets, callback URLs and migrations. Test login, protected routes, data reads/writes and any files or email your app needs. Promote after Dev verification without copying Dev records over Prod data.

[Supabase migration Skill](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md) · [Framework guides](/docs/frameworks/vite) · [Application auth](/docs/application-auth) · [Home](/)`;
