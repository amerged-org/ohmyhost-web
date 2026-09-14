/** Launch prose is exported as the reviewed Mintlify snapshot; runtime contracts stay in the platform. */
export const LAUNCH_DOCUMENTS: Record<string, string> = {
  "/terms": `# Terms of Service

Version: September 14, 2026.

## 1. Your agreement

These terms govern ohmyho.st, operated by Amerged B.V., KVK 42154221, Venray, Limburg, NL (we, us). The customer is the person or organisation for whom you create the account or place an order (you). You must have capacity to enter this agreement and authority to bind an organisation you represent. Use our [contact form](/contact) for service, billing and legal enquiries.

By signing up, you accept these Terms of Service and the [Data Processing Agreement](/dpa), including its [processing description](/dpa), [TOMs](/dpa/toms), [provider register](/dpa/subprocessors) and [transfer annex](/dpa/transfers). The DPA applies to personal data we process on your behalf. You acknowledge our [Privacy notice](/privacy); that acknowledgement is not consent to every processing activity, marketing or a payment.

The order or checkout you expressly accept states the purchased service, price, tax and any recurring payment terms. That order prevails for its specific commercial terms; the DPA and any applicable mandatory transfer clauses prevail for their subject matter. You can retain these documents using their Markdown versions or your browser’s print/save function.

## 2. Beta and supported hosting

ohmyho.st is an invite-only beta. An invitation grants only its configured access and promotional benefits. Beta or manual Paid-feature access is not a paid subscription and does not authorise a charge. A beta entitlement can be withdrawn; we give reasonable notice where practicable, while urgent security or legal restrictions can take effect immediately.

The service hosts supported GitHub applications and requested database, domain, transactional-mail, file and runtime capabilities. Your agent uses the API, CLI or MCP to plan and operate them; the portal exposes supported account, project, credit and budget controls. Current [documentation](https://docs.ohmyho.st/), returned plans and service status describe availability and limits. A roadmap vote or marketing calculator is not an order for an unimplemented feature.

You choose shared or isolated Dev/Prod data and the resources each application needs. New customer application/database placements are in US East. Control databases, edge delivery and provider operations have distinct locations described in the Privacy notice and DPA; the workload setting is not a promise that every category of service data stays exclusively in that region.

## 3. Accounts, credentials and agents

Provide accurate account/billing details and keep them current. Protect your account, tokens, repository permissions, application secrets and export passwords. New API keys have no scheduled expiry and remain usable until revoked, subject to current membership and permissions. The full value is shown once; retain it securely and revoke a key when it is no longer needed or may have been exposed. Browser-session expiry is separate.

You control which people and agents act for your organisation. A project ID or user ID in a prompt is context, not access authority. Review material changes, spending and destructive operations before authorising your agent. Tell us promptly through the contact form if you suspect unauthorised access. We remain responsible for our own contractual and statutory security duties.

Your application’s end-user authentication remains your responsibility. Our hosting login does not supply your application’s users or replace the auth provider you choose. Customer-selected agents, authentication services and external integrations operate under your separate agreements with them.

## 4. Your content and permitted use

You retain your rights in your source code, application data and content. You grant us and the providers engaged for the service only the rights needed to access authorised GitHub source, build, store, host, transmit, troubleshoot, export and delete that material according to your instructions. We do not acquire ownership of it or use application content to train a general-purpose AI model. We retain our rights in the platform, documentation and branding; applicable open-source licences govern their components.

You must have the rights and lawful basis needed for the content and processing you submit. Do not use the service for unlawful content, spam, phishing, malware, unauthorised access or attacks, infringement of rights, evasion of service limits or conduct that materially harms other customers or the infrastructure. Special-category, criminal-offence or other regulated data requiring additional safeguards needs an agreed arrangement that supports that use before submission.

You are responsible for your application code, dependencies, user notices and authorised messages. We may investigate credible abuse, restrict the affected activity and comply with binding legal obligations. We do not promise to review every application or guarantee that an agent-generated application is correct or secure.

## 5. Credits, measurement and budgets

Projects use their organisation’s shared credit balance. The current rate card and deployment plan describe measured charges. Prices, tax and credit consumption are different quantities. Retained database or file storage can use credits while compute is idle.

Monthly allowance credits expire on their recorded allowance date. One-time credits, including purchased top-ups, configured signup/referral bonuses and manual grants, have no scheduled expiry. Credits are service-use units, not money, a deposit or an investment. They are not transferable between customers or redeemable for cash except where law or an expressly agreed refund requires it. Corrections, refunds and disputes can adjust associated credit entries; one payment does not earn credit twice.

Project budgets use UTC calendar months. You may select no limit or a credit limit with the supported Continue/Stop behaviour. Measurements can arrive after work starts: a budget does not erase already incurred, reserved or delayed usage. Insufficient credits or a Stop limit can restrict affected capabilities under the documented rules. Keep monitoring and a recovery plan for important workloads.

## 6. Purchases, subscriptions and recharge

Where purchases are enabled, Stripe processes checkout and invoices. Checkout shows the amount, currency, applicable tax and recurring terms before payment. Provide a correct billing address and a valid business tax ID if relevant. We calculate applicable taxes through Stripe Tax; any business status or tax treatment you claim must be accurate. Each completed purchase receives an invoice.

A subscription renews on its stated billing cycle until cancelled. Cancel future renewals using the Stripe management link in Billing; the subscription ends at the period end displayed there unless an applicable right requires otherwise. Contact us for assistance. A top-up does not renew a subscription. Turning recharge off does not cancel a subscription.

Automatic recharge is a separate opt-in. Saving a payment method, signing up, accepting these terms or moving a marketing calculator does not enable it. When you explicitly enable the current policy, you authorise 1,000 one-time credits for USD 9 plus applicable tax when available credits fall below 100, subject to your displayed gross monthly limit. The limit uses UTC calendar months and includes tax. There is at most one unresolved recharge attempt at a time.

Turn recharge off in Billing or through the supported API, CLI or MCP to prevent new attempts. An invoice or payment already initiated can still complete and is reconciled to your balance. A tax-address problem, failed payment or unresolved result can pause recharge; the status identifies the required action. We do not silently disable tax or create another charge to hide an uncertain result.

## 7. Cancellation, refunds and data return

You may stop using the service, cancel future subscription renewals and turn recharge off using the controls above. Delete projects through the supported client workflow, or use the contact form for account closure and assistance. Deleting an application does not itself cancel a separate subscription or payment already initiated. Charges already incurred remain payable, subject to any correction or refund owed.

Use the contact form to report an incorrect charge or request a refund. Mandatory refund, withdrawal and conformity rights remain available. Where consumer law gives a distance-service withdrawal right, it is generally fourteen days from contract formation; send an unambiguous withdrawal request identifying your account and purchase through the contact form. Any lawful exception or proportionate charge for service supplied during that period applies only when its statutory conditions and required prior request or acknowledgement are met. Signup alone does not waive those rights.

We may suspend the affected service for a material breach, credible security risk, unlawful activity, payment failure or binding legal requirement. Where safe and lawful, we explain the reason and provide a reasonable opportunity to resolve it. Suspension does not itself erase credit history or mandatory rights. If we permanently discontinue a paid service for our convenience, we provide reasonable notice and an appropriate return of unused purchased service value; promotional credits do not acquire a cash value as a result.

Retrieve the data you need before deletion or closure. Supported exports are asynchronous password-encrypted ZIP archives containing portable SQL only: no source code, application files or configuration. At most one request per project is accepted per rolling 24 hours. You supply and retain the password, poll for completion and request an authorised download link valid for 24 hours. The hosted archive expires after seven days. Retain and retrieve application files separately. Downloaded copies are your responsibility; the DPA governs personal-data return/deletion assistance beyond the SQL archive.

## 8. Availability, responsibility and changes

We provide the service with reasonable care and skill. The beta has no agreed uptime SLA or universal recovery-time/recovery-point guarantee. External identity, repository, DNS, mail and payment providers can affect timing and availability. Check the actual operation state; a successful build alone does not establish that a domain or email identity is ready.

We maintain the DPA security measures and address faults according to their impact. You are responsible for choices within your application and your recovery arrangements. Neither an “as available” beta description nor your agent’s involvement removes our obligations under applicable law.

For business customers, to the extent permitted by law, we are not liable for loss that was not reasonably foreseeable at contract formation or for indirect loss of profit, opportunity or goodwill. We do not exclude liability that cannot lawfully be excluded, including intentional misconduct, fraud, or mandatory data-protection and consumer rights. Consumers retain the liability standards and remedies required by their applicable law.

We may update the service and terms. Material commercial changes apply prospectively after appropriate notice and any consent required by law; a change to recurring charges is not authorised by silence. You may end the affected service before a material change takes effect. Urgent legal or security changes can take effect sooner, with an explanation where permitted. A later website edit does not rewrite an issued invoice or retrospectively establish consent.

## 9. Law, disputes and contact

Dutch law governs this agreement. Consumers retain mandatory protection under the law of their habitual residence where applicable, including applicable US state rights; this choice does not remove statutory rights to bring a claim in a competent court. Business disputes may be brought before the competent courts in the Netherlands. These terms impose no mandatory arbitration or class-action waiver.

First describe a service or billing complaint through our contact form so we can investigate and respond. This does not prevent urgent relief, regulatory complaints or other available remedies. If one provision is unenforceable, the remaining provisions continue to the extent legally possible; a replacement may not reduce mandatory rights.

[Contact](/contact) · [Privacy](/privacy) · [Cookies](/cookies) · [DPA and annexes](/dpa) · [Documentation](https://docs.ohmyho.st/)`,
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
