export const PRODUCT_DOCUMENTS: Record<string, string> = {
  "/docs/quickstart": `# Your first deployment

> Read the ohmyhost-get-started Skill, connect this agent and deploy my selected GitHub app. Use only the capabilities the app needs.

Open your invitation link and copy the prompt into your agent. It installs the current public CLI/MCP packages if needed, opens the sign-in flow and selects your organization. A first signup without an organization creates one using the invitation and signs in again to select it.

The agent checks the repository, gets your GitHub authorization and plans the exact pushed commit. Review the plan and let it follow the accepted operation. Dev is private; the agent obtains a Dev access link for application testing.

Start with [CLI installation](/docs/cli), [MCP setup](/docs/mcp) or the [get-started Skill](/skills/ohmyhost-get-started/SKILL.md). Builds and selected services consume the quoted credits; an app does not need a Paid domain or database merely to be hosted.`,
  "/docs/github": `# Connect GitHub

> Connect the repository I selected and deploy its chosen branch and commit.

GitHub is the deployment source. Push your application and its matching lockfile, then use source_link or the CLI link command. Open the returned authorization link and allow the repository in your own GitHub account.

After authorization, repeat the same link arguments and request key, then follow the source operation. Authorization alone does not start a build. Read source_get before deployment_plan and use the exact inspected commit. Local archives and source uploads are not supported.

[Deploy Skill](/skills/ohmyhost-deploy-github/SKILL.md) · [Secrets](/docs/secrets) · [Quickstart](/docs/quickstart)`,
  "/docs/login-tokens": `# Login and deployment tokens

Use ohmyhost login for the browser sign-in and whoami to read the selected organization. Your agent uses that local login through MCP.

An invitation supplies the r value for first organization creation. Sign in again after creation to select the new organization. Existing users can return through /login without creating another organization.

You can create a user-owned deployment token with a default 90-day lifetime and save it once to an owner-only, Git-ignored env file. Its full value cannot be retrieved later. Token listing returns metadata; revocation targets the selected token. Use an interactive-login process without OHMYHOST_TOKEN for organization creation or token management.

[CLI token commands](/docs/cli) · [Get-started Skill](/skills/ohmyhost-get-started/SKILL.md) · [Application auth](/docs/application-auth)`,
  "/docs/sdk": `# TypeScript SDK

The generated SDK exposes the same REST /v1 contract used by CLI and MCP. Install the current sdk-ts archive listed in the public release manifest linked from the CLI guide; the package needs no platform-repository access.

Create a client with the selected public API origin and your customer authorization. Import the generated operation for the action you need. Consult the OpenAPI reference for request fields, result types and errors. Keep tokens in the calling process, outside source code and browser bundles.

Requests that create work return an operation to observe. Preserve the original idempotency key after a network interruption; do not submit another deployment to read status.

[OpenAPI](/api) · [CLI and release manifest](/docs/cli) · [Operation status](/docs/status)`,
  "/docs/frameworks/nextjs": `# Host a Next.js app

> Inspect this Next.js app, prepare its needed capabilities and deploy the selected GitHub commit.

Run ohmyhost init --dry-run --json in the application directory. Keep one pinned package manager and its matching lockfile. Use the returned framework compatibility result and resolve actual blockers before deploying.

Keep ordinary Next.js routes and configuration. The service supplies its build adapter; do not add a customer Wrangler project to make hosting work. Configure your application's auth callback URLs and server secrets separately from hosting login.

Verify the actual routes, server behavior and data flows your app uses. A successful landing page does not prove every framework feature. The admission result identifies verified, experimental or unsupported combinations.

[Portable-app Skill](/skills/ohmyhost-build-portable-app/SKILL.md) · [Secrets](/docs/secrets) · [Auth](/docs/application-auth)`,
  "/docs/frameworks/vite": `# Host a Vite or React app

> Inspect this Vite app and deploy it without adding services it does not use.

A public static application can deploy without a database or login. Run ohmyhost init --dry-run --json and retain the matching package-manager lockfile. Vite applications can use React and TanStack Router/Query; those packages do not by themselves turn the app into TanStack Start.

If the app requires server capabilities, follow the returned same-origin API companion contract and implement the routes it actually calls. VITE_ variables are visible in the browser bundle; private credentials belong in server runtime secrets.

Verify navigation and a direct reload of a nested route, then any requested API and auth flows.

[Portable-app Skill](/skills/ohmyhost-build-portable-app/SKILL.md) · [GitHub](/docs/github) · [Secrets](/docs/secrets)`,
  "/docs/frameworks/tanstack": `# Host a TanStack application

Use the Vite guide for TanStack Router or Query in a Vite app. For TanStack Start, keep the native server routes, loaders and server functions and run the framework check before deployment.

The agent should identify the actual runtime, lockfile, migrations and server capabilities. It follows the returned compatibility classification and resolves concrete missing capabilities. Package names do not select an auth provider or require a database migration.

After deployment, verify rendered routes, navigation, server loaders and required writes. Configure environment secrets and callback URLs for the environment being tested.

[Vite guide](/docs/frameworks/vite) · [Portable-app Skill](/skills/ohmyhost-build-portable-app/SKILL.md) · [Dev and Prod](/docs/environments)`,
  "/docs/application-auth": `# Bring your application's auth

Your ohmyho.st login gives your agent hosting access. Your application chooses its own users, sessions and authentication provider. A deliberately public application needs no login.

Better Auth, customer-owned WorkOS and Auth0 are the supported integration targets. Compatibility and completed verification depend on the actual framework/runtime combination; ask the agent to inspect the current admission result and test your application's full login path. Existing hosted Next.js with customer-owned WorkOS has been verified; do not assume that proves every other combination.

Keep an existing provider unless you choose to change it. Configure its exact callback/logout URLs, allowed origins and required server secrets. Test login, callback, a protected route, reload and logout. The provider may send its own verification email; this does not automatically require managed ohmyho.st mail.

[Secrets](/docs/secrets) · [Frameworks](/docs/frameworks/nextjs) · [Portable-app Skill](/skills/ohmyhost-build-portable-app/SKILL.md)`,
  "/docs/secrets": `# Runtime secrets

> Set the application secrets for the environment I selected, then check delivery status.

Read project_status for Dev and Prod environment IDs. secret_set_command returns the CLI command that reads the value from stdin. The secret value does not need to appear in MCP arguments. secrets_list returns metadata and delivery status, not the original value.

Use the environment ID matching the intended target; the default environment is Dev. Public client identifiers can follow the auth provider's browser contract, while private application credentials belong on the server. Never copy the hosting agent's env file into application secrets.

[Dev and Prod](/docs/environments) · [Auth](/docs/application-auth) · [MCP](/docs/mcp)`,
  "/docs/environments": `# Dev and Prod

Every project has Dev and Prod environments sharing an organization credit balance. The customer chooses isolated or shared data when creating the project.

Isolated data gives each environment its own database and files, with separate consumption. Shared data uses one set and changes can affect both. The Skills recommend isolation for safer testing and explain the difference before creating resources.

Dev requires a private single-use access link. After verifying the app, use promotion_plan and promotion_execute for the requested promotion. Promotion reuses the verified artifact and applies versioned migrations; it does not copy Dev records into isolated Prod.

[Migration guide](/docs/migrations) · [Database profiles](/docs/database) · [Deployment Skill](/skills/ohmyhost-deploy-github/SKILL.md)`,
  "/docs/migrations": `# Apply schema changes

Keep versioned SQL migrations in the application's configured directory, with filenames YYYYMMDDHHMMSS_name.sql. Check the current init output for the exact required naming and capability contract.

Prefer additive changes: introduce a nullable column, deploy compatible code, backfill existing rows, then review removal or stronger constraints separately. Test against existing records before promotion. Never replace production data with a Dev dump to synchronize schemas.

Promotion plans show the verified artifact and migration effects. After applying them, check both the new behavior and preservation of existing records. Shared data means the same physical database serves Dev and Prod.

[Database Skill](/skills/ohmyhost-manage-database/SKILL.md) · [Environments](/docs/environments) · [SQL exports](/docs/backups)`,
  "/docs/database": `# Database compute

> Show my database's current size, region and idle setting, then explain whether changing it would help.

Use database_compute_get with project_id and environment dev or prod. It reads metadata without waking the database. Free uses 0.25 CU / 1 GB and sleeps after one idle minute; Paid standard uses 0.5 CU / 2 GB and two minutes. Paid performance uses 1 CU / 4 GB and five minutes, at 2.5 times standard compute credits for equal active duration.

Use database_compute_set for an authorized profile change, then poll the returned operation and read actual compute again. A resize preserves SQL data. Shared environments resolve to one physical database and a change affects both.

Storage and retained history still consume credits when compute sleeps. Avoid periodic SQL checks that keep an idle database awake. Managed database connections are delivered through the application's supported runtime binding; this is not a public database-management credential console.

[Database Skill](/skills/ohmyhost-manage-database/SKILL.md) · [Usage](/docs/usage) · [Migrations](/docs/migrations)`,
  "/docs/email": `# Transactional email

> Configure my chosen sender domain, show the required records and verify a real application send.

Managed transactional mail requires Paid access and a configured sender domain. mail_domain_set starts setup; mail_domain_status reads current DNS/DKIM readiness and any next action. Present the exact records returned by the API and preserve existing mailbox MX.

Cloudflare DNS authorization can automate supported records. Other DNS providers work with manual entry. During verification, follow next_check_after_seconds and ask the agent to check again after 60 minutes. Continue the original deployment operation instead of rebuilding.

Sender verification and the provider account's sending availability are separate. A ready sender alone does not prove commercial delivery. Read the actual error if a send is unavailable and verify receipt before reporting email as working.

[Domains](/docs/domains) · [Mail Skill](/skills/ohmyhost-domains-and-mail/SKILL.md) · [Mail pricing comparison](/vs/resend)`,
  "/docs/status": `# Read deployment status

Use project_context_get for the current project summary, project_status for environments and URLs, and operation_get for the accepted operation. Poll at the interval returned by the operation.

A successful build can still be publishing. waiting_for_mail directs the agent to mail_domain_status. A private Dev URL needs a Dev access link before an application check.

operation_logs returns available events within a bounded collection window; it is not a wait for completion. A CLI wait timeout does not cancel the deployment. Keep the original operation ID when resuming.

[Service status](/status) · [Troubleshooting](/docs/troubleshooting) · [Project context](/docs/project-context)`,
  "/docs/troubleshooting": `# Diagnose a deployment

> Read the original operation and logs, explain the cause and take the supported next action.

Start with project_context_get, project_status and operation_get. Use operation_logs for the available event prefix. Follow the actual phase and error: pending DNS requires a verification check, while a source build failure requires fixing the reported code or configuration.

When reconciliation is explicitly required, use one confirmed operation_reconcile with the original operation ID and a saved request key. Pending reconciliation means poll that operation; exhausted recovery means report it rather than create a new deployment to bypass the limit.

Use feedback_submit for a suspected bug, issue or feature request. Retain its acknowledgment ID and include only a minimal reproduction and safe operation/error identifiers.

[Troubleshooting Skill](/skills/ohmyhost-troubleshoot-deployment/SKILL.md) · [Feedback](/docs/feedback) · [Status](/docs/status)`,
  "/docs/budgets": `# Project spending limits

An organization has one credit balance. An optional project budget limits a project's spending; it does not create another wallet.

Ask your agent to read project_budget_get and explain the current limit before changing it. project_budget_set accepts the requested amount and mode using the current tool schema. Read the result back after an authorized change.

Check both reserved credits and posted consumption when a new operation cannot start. Low balance, a project limit and a Paid entitlement are different conditions. The returned error tells the agent which action is needed.

[Usage and budgets Skill](/skills/ohmyhost-usage-and-budgets/SKILL.md) · [Usage](/docs/usage) · [Pricing](/pricing)`,
  "/docs/billing": `# Purchases and invoices

The [account portal](https://app.ohmyho.st/billing) shows Free/Paid, the source of Paid access, monthly expiring credits and remaining one-time credits. Reservations remain available through the API/CLI/MCP. Beta and manual grants provide Paid features without a Stripe subscription or extra monthly Paid allowance. Signup/referral and top-up credits never expire; the existing Free monthly base allowance is separate.

An organization Owner can request checkout for a Paid subscription or a one-time credit top-up where billing is enabled. A top-up adds credits; it does not extend a subscription. Every successful purchase has an invoice.

Your agent opens billing_checkout_create only for an authorized purchase, then reads billing_checkout_get and the organization balance to confirm its result. Returning from the checkout browser page alone is not payment confirmation. billing_portal_create opens invoices, payment methods and subscription management.

Production purchases are not enabled in the current beta. Existing organizations can inspect their available balance and usage. Automatic recharge and calculator discounts are not active account settings.

[Usage](/docs/usage) · [Budgets](/docs/budgets) · [Pricing](/pricing)`,
  "/docs/project-context": `# Shared project context

Read project_context_get when resuming a project. Its Markdown combines current operational status, domain/mail next actions, permitted credit reporting and shared notes. Project-scoped MCP results link to ohmyho://projects/{project_id}/context.

Save useful decisions and unfinished work with project_notes_set using expected_version from the current read. On a conflict, read again and merge. The full document is limited to 500 lines / 32 KiB; stored notes allow 250 lines / 16 KiB.

Record the selected data mode, a pending DNS check, safe operation IDs and the next action. Live database size comes from database_compute_get. Notes are context, not permission to perform an unrelated action; do not store credentials, signed access links or raw logs.

[Status](/docs/status) · [Database](/docs/database) · [Feedback](/docs/feedback)`,
  "/docs/feedback": `# Report a bug or request a feature

Use feedback_submit or ohmyhost feedback submit. Choose bug, issue or feature_request, describe expected and actual behavior, and include the relevant organization/project and safe operation ID.

A small reproducible example is more useful than raw logs. Do not include credentials, customer records or environment files. Reuse the same request key after an uncertain response.

The returned feedback ID and timestamp confirm submission. They do not promise a fix or a delivery date. Reporting consumes no credits.

[Troubleshooting Skill](/skills/ohmyhost-troubleshoot-deployment/SKILL.md) · [Status](/docs/status) · [API](/api)`,
  "/docs/limits": `# Current limits

The API uses REST /v1 and Bearer authentication. Private endpoints return application/problem+json with code, detail and suggested_action; retry rate-limited requests after Retry-After. The current beta has no general stability or deprecation-window promise. Published client archives are immutable; follow release notes when upgrading. Future breaking version changes will be documented before a public stability commitment is introduced.

Use the operation plan and active rate cards for the selected account. The published clients support GitHub deployment, the documented framework/capability contracts and customer-chosen application authentication.

| Capability | Current contract |
| --- | --- |
| New user API token | 90-day default; full value available once |
| Project context | 500 lines / 32 KiB |
| Shared notes | 250 lines / 16 KiB |
| SQL export requests | One accepted export per project per rolling 24 hours |
| Export payload | SQL only, up to 256 MiB plaintext |
| Export download URL | 24 hours |
| Export archive retention | Seven days |
| Pending DNS/mail follow-up | Follow the returned interval, typically 60 minutes |

Hosted URL-only product MCP, automatic recharge, managed AI, customer Drive/S3/R2 export destinations and optional EU placement are not available in this release. The local npm MCP client is available.

[API contract](/api) · [Compute profiles](/docs/database) · [Export guide](/docs/backups)`,
  "/auth.md": `# Authenticate an ohmyho.st agent

Read https://ohmyho.st/skills/ohmyhost-get-started/SKILL.md. Install the public CLI/MCP packages from the current release and run ohmyhost login. Complete the displayed WorkOS sign-in. First organization creation uses the invitation URL's r value, followed by another login to select the new organization.

The local MCP server uses the same CLI login. A user-owned 90-day API token can instead be loaded through OHMYHOST_TOKEN from the chosen private env file. Token and organization management use the interactive session. No token belongs in an agent prompt.

[CLI](/docs/cli) · [MCP](/docs/mcp) · [Login](/login)`,
};
