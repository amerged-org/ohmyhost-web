import { marked } from "marked";
import { listOhmyhostSkillResources } from "@ohmyhost/agent-skills";

export const CLIENT_RELEASE = "0.1.0-beta.8";
export const RELEASE_PATH = `/releases/${CLIENT_RELEASE}`;
const CLIENT_PACKAGES = [
  "product-cli",
  "mcp",
  "sdk-ts",
  "customer-runtime",
  "customer-auth-better-auth",
];
const RETAINED_CLIENT_RELEASES = new Set([
  "0.1.0-beta.1",
  "0.1.0-beta.2",
  "0.1.0-beta.3",
  "0.1.0-beta.4",
  "0.1.0-beta.5",
  "0.1.0-beta.6",
  "0.1.0-beta.7",
  CLIENT_RELEASE,
]);

const skills = listOhmyhostSkillResources();
export const CUSTOMER_GUIDE = `# Deploy with ohmyho.st

ohmyho.st (omh / omh.st) is an invite-only hosting beta. You need your invitation and authorized access to your GitHub repository. The hosting CLI/MCP never need ohmyho.st's AWS, Neon, Cloudflare, Stripe or WorkOS management credentials.

## Install the clients

Use Node.js 22 or newer and npm. These public, pinned archives require no access to the platform repository. Release metadata and SHA-256 checksums: https://ohmyho.st${RELEASE_PATH}/manifest.json and https://ohmyho.st${RELEASE_PATH}/SHA256SUMS.

    npm install --global https://ohmyho.st${RELEASE_PATH}/ohmyhost-product-cli-${CLIENT_RELEASE}.tgz
    export OHMYHOST_ENVIRONMENT=production
    ohmyhost --version
    ohmyhost login --json
    ohmyhost whoami --json

Follow the displayed WorkOS device authorization. If an organization is missing, use the signup source from the r parameter in your invitation, then log in again and select the organization:

    ohmyhost organization create --name "My organization" --source "$INVITATION_SOURCE" --idempotency-key "$ORGANIZATION_REQUEST_KEY" --json
    ohmyhost login --json
    ohmyhost whoami --json

Never invent an invitation source or reuse someone else's token. Interactive clients keep their own hosting login credential in the native credential store. An already issued and permitted ohmyho.st user key can instead be supplied through OHMYHOST_TOKEN in your local environment; this bypasses native credential reads. Discover ohmyhost token create --help before using self-service issuance; older installed clients may lack it. This hosting token never authenticates your application's end users.

## Save a deployment token

Self-service API-key creation/list/revocation is not activated in this beta and is omitted from the default CLI/MCP command catalog. Continue with ohmyhost login or an already issued token. Once the platform activates token create, use your interactive login and returned organization ID:

    ohmyhost token create --organization "$ORGANIZATION_ID" --name "Deployment agent" --idempotency-key "$TOKEN_REQUEST_KEY" --out .env.local --json
    ohmyhost token list --organization "$ORGANIZATION_ID" --json

The token defaults to 90 days and is saved to the selected private env file. Existing variables remain intact; existing tokens are never overwritten. Inside a Git repository the file must be ignored. CLI and MCP responses show metadata and the file path, not the full value. Load the file into the agent's CLI/MCP process using Node's --env-file option. Never paste its value into chat or copy the entire file into application secrets.

Manage tokens through the interactive login, outside a process supplying OHMYHOST_TOKEN. Revoke an explicitly selected token with ohmyhost token revoke --organization "$ORGANIZATION_ID" --key "$TOKEN_ID" --yes --json. This preserves your login session and local files.

After uncertain creation, reuse the original name and Idempotency-Key. A recovered request returns metadata without revealing the full value again. If the value was not saved, explicitly revoke that key before creating its replacement. A user-key permission configuration error must be reported through feedback; repeated login or token creation will not repair it.

## Create and deploy a project

Read the relevant Skill before preparing source:
- Portable applications: https://ohmyho.st/skills/ohmyhost-build-portable-app/SKILL.md
- Existing Supabase applications: https://ohmyho.st/skills/ohmyhost-migrate-supabase-postgres/SKILL.md

Use the organization ID returned by whoami. Recommend isolated Dev/Prod data, with its additional database consumption; shared data is the customer's alternative. Choose explicitly:

    ohmyhost project create --organization "$ORGANIZATION_ID" --name "My app" --data-mode isolated --idempotency-key "$PROJECT_REQUEST_KEY" --json
    ohmyhost project list --json
    ohmyhost link --help
    ohmyhost plan --help
    ohmyhost deploy --help

Use the documented GitHub authorization, exact repository/branch/commit and resulting project ID. The platform builds verified GitHub source; the local repository is not an upload source. Plans show the proposed work and credit impact before execution. New customer databases and AWS build/mail default to US placement. Organization credits are shared; project budgets are optional.

Reuse the same idempotency key for the same request. After acceptance, observe the returned operation rather than submitting another deployment. Read operation get, project status and deployment logs. A failed operation includes a safe code and next action; retain its operation ID. A queued/running operation or a successful build is not proof of a healthy application.

## Authentication, mail and DNS

Bring the authentication system your application needs. You or your agent choose and integrate it; a public app can work without login. Your ohmyho.st account/agent token is separate from the accounts of your application's users. Our WorkOS login does not provision an AuthKit tenant or end-user login for your app.

The required application-auth support set is Better Auth, customer-owned WorkOS AuthKit and Auth0 across Next.js, Vite (including TanStack Router/Query) and TanStack Start. Better Auth has retained managed-integration proof; complete WorkOS/Auth0 application-flow acceptance is still in progress. Customer SDK declarations follow the same hosting contract and do not select a managed database or auth service. We do not claim every integration is already tested, and agents must not replace your existing auth without your decision. See the application Skill for the current init/admission limits and required feedback. Private keys for your own auth integration belong in server runtime secrets; ohmyho.st platform-management credentials never belong in your app.

Paid transactional mail uses an explicitly configured customer sender domain. Discover mail domain set/status in CLI help. Follow the exact DNS records returned by the service, or the optional Cloudflare authorization flow. Never replace mailbox MX records. An external authentication provider may handle its own verification/reset mail; this does not automatically require ohmyho.st mail or DKIM. The current managed Better Auth integration uses its declared database/mail path. Domain verification is a separate provider step and can take longer than the build; report its actual status. Prefer Cloudflare-hosted DNS with the customer-authorized product flow. Otherwise give the exact returned records for manual setup: mail delegation uses four NS records on the sender subdomain with TTL 300. A mail response with observed_at is a fresh provider check; verification_pending does not prove missing DNS. Follow next_check_after_seconds (one hour), and keep observing the same deployment instead of starting another build. Do not remove mail/Auth capabilities just to make deployment pass, bypass email verification or claim pending mail is ready.

## Verify and promote

Use project status to discover Dev/Prod URLs. Protected Dev access is obtained through project dev-access create; keep its ticket private. Verify real application writes and reads, authentication and declared capabilities. A landing-page 200 is insufficient. Then discover deployment promote plan and deployment promote in CLI help. Promotion transfers the verified artifact without rebuilding; isolated Prod applies versioned schema migrations without copying Dev records. Preserve production data.

## MCP and application libraries

    npm install --global https://ohmyho.st${RELEASE_PATH}/ohmyhost-mcp-${CLIENT_RELEASE}.tgz

Configure your agent's stdio MCP client with command ohmyhost-mcp and environment OHMYHOST_ENVIRONMENT=production. It uses the same customer login and public REST API as the CLI. Discover tools/list and resources/list; Skills are also available as MCP resources. Never pass provider management keys to an agent or application.

The same release supplies @ohmyhost/sdk-ts, @ohmyhost/customer-runtime and @ohmyhost/customer-auth-better-auth as pinned archives listed in manifest.json. Install application libraries as dependencies of the application. The generated SDK uses https://app.ohmyho.st; every product mutation goes through REST /v1.

## Feedback and recovery

Report a bug, suspected issue or feature gap with ohmyhost feedback submit or MCP feedback_submit. Include expected/actual behavior, a minimal redacted reproduction and safe operation/error IDs. Reporting costs no credits. Only the returned feedback ID and timestamp confirm submission. Never include passwords, tokens, environment files, raw logs or personal records. Continue independent work while reporting a blocked step honestly.

## Billing

Paid purchases are currently enabled on the development test platform. Production subscription and top-up purchases are not yet enabled. Deployment trials use the credits available to the invited organization; check its balance before planning a build.

Discover credits balance, credits usage and budget through CLI help. An organization Owner starts a Paid subscription or a one-time top-up through the same public API:

    ohmyhost billing checkout --organization "$ORGANIZATION_ID" --offer paid --idempotency-key "$PURCHASE_REQUEST_KEY" --json

For a one-time purchase of 1,000 credits, use --offer topup --packs 1 with its own request key. Complete the returned Stripe-hosted checkout only with the customer's explicit payment authorization. Then read the original purchase; the browser return alone does not confirm payment:

    ohmyhost billing status --organization "$ORGANIZATION_ID" --checkout "$CHECKOUT_ID" --json
    ohmyhost credits balance --organization "$ORGANIZATION_ID" --json
    ohmyhost billing portal --organization "$ORGANIZATION_ID" --json

Every successful purchase has a Stripe invoice, including one-time credits. The owner-only portal opens invoice history and invoice downloads, payment methods and subscription management; request a fresh portal link when needed. A top-up does not extend a Paid subscription. Automatic recharges are not available in this release and are never enabled by login or an ordinary purchase.
`;

const DOCUMENTATION: Record<string, string> = {
  "/docs": CUSTOMER_GUIDE,
  "/docs/cli": `# CLI

${CUSTOMER_GUIDE}`,
  "/docs/mcp": `# MCP server

Use the installable local stdio server with Codex, Claude Code, Cursor, Hermes or OpenClaw. Native Windows uses Node.js; Bash and WSL are not required for the MCP executable.

${CUSTOMER_GUIDE}`,
  "/docs/skills": `# Agent Skills

Read these instructions before preparing or deploying an application. They are also embedded MCP resources.

- [Build a portable app](/skills/ohmyhost-build-portable-app/SKILL.md)
- [Migrate an existing Supabase app](/skills/ohmyhost-migrate-supabase-postgres/SKILL.md)
- [Machine-readable Skill catalog](/.well-known/skills/index.json)

Bring your application's own authentication. Better Auth, WorkOS and Auth0 are distinct from the ohmyho.st login. Report suspected bugs through feedback_submit; never include credentials.`,
  "/docs/usage": `# Status, usage and credits

Ask your agent. ohmyho.st has no customer dashboard; your agent reads the same API through CLI or MCP.

## CLI

\`\`\`sh
ohmyhost project status --help
ohmyhost operation get --help
ohmyhost credits balance --organization "$ORGANIZATION_ID" --json
ohmyhost credits usage --organization "$ORGANIZATION_ID" --month YYYY-MM --json
\`\`\`

## MCP

Use organization_credits_get and organization_usage_get for the organization you own. Use operation_get to poll an accepted operation. Discover the tool schema before calling it.

## API

GET /v1/organizations/{organization_id}/credit-usage?month=YYYY-MM returns measured usage by project, environment and meter. Follow its cursor for all projects. GET /v1/organizations/{organization_id}/credits returns the wallet, reservations, published rates and active meters.

Reporting is available at zero credits. It reads posted measurements; absent or delayed provider observations are not proof of zero usage. Current R2 measurement activation and additional meters are still being completed.

A submitted deployment is not automatically ready. Poll its original operation and inspect its status, error and next action; do not submit another build while the existing operation runs.`,
  "/login": `# Log in to ohmyho.st

[Continue to login](https://app.ohmyho.st/login). The login page supplies your CLI/MCP entry command. Ask your agent for project status, usage and other operational data.

There is no customer dashboard. New deployment tokens default to 90 days and are available only once at issuance. Keep the saved token private; token listing and revocation use CLI/API/MCP.

[CLI installation](/docs/cli.md) · [MCP installation](/docs/mcp.md)`,
};

export const AGENT_INDEX = `# ohmyho.st

Invite-only, API-first hosting for applications and agents.

- [Customer guide](https://ohmyho.st/docs): client installation, login, GitHub deployment, verification, promotion and recovery.
- [Guide as Markdown](https://ohmyho.st/docs.md)
- [CLI guide](https://ohmyho.st/docs/cli.md)
- [MCP server](https://ohmyho.st/docs/mcp.md)
- [Usage and status](https://ohmyho.st/docs/usage.md)
- [API reference](https://ohmyho.st/api.md)
- [OpenAPI YAML](https://ohmyho.st/api/openapi.yaml)
- [Design system](https://ohmyho.st/brand.md)
- [Homepage Markdown](https://ohmyho.st/index.md)
- [Login](https://ohmyho.st/login.md)
- [Release manifest](https://ohmyho.st${RELEASE_PATH}/manifest.json)
- [OpenAPI contract](https://ohmyho.st${RELEASE_PATH}/openapi.json)
- [Skill catalog](https://ohmyho.st/.well-known/skills/index.json)
- [Portable app Skill](https://ohmyho.st/skills/ohmyhost-build-portable-app/SKILL.md)
- [Supabase migration Skill](https://ohmyho.st/skills/ohmyhost-migrate-supabase-postgres/SKILL.md)

Use the production platform with OHMYHOST_ENVIRONMENT=production. Read the customer guide; do not guess private installation paths, credentials, endpoints or resource state.
`;

export function customerDocument(path: string): { text: string; type: string } | null {
  if (path === "/llms.txt") return { text: AGENT_INDEX, type: "text/plain; charset=utf-8" };
  const documentPath = path.endsWith(".md") ? path.slice(0, -3) : path;
  const markdown = DOCUMENTATION[documentPath];
  if (markdown) {
    if (path.endsWith(".md")) return { text: markdown, type: "text/markdown; charset=utf-8" };
    return {
      type: "text/html; charset=utf-8",
      text: `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ohmyho.st — documentation</title><link rel="alternate" type="text/markdown" href="${documentPath}.md"><style>:root{color-scheme:dark;font-family:'Space Grotesk',system-ui,sans-serif;background:#000;color:#F0F1F2}*{box-sizing:border-box}body{max-width:1000px;margin:0 auto;padding:32px 22px 80px}nav{display:flex;gap:20px;flex-wrap:wrap;padding:0 0 24px;border-bottom:1px solid #26282C}nav a{font-size:14px}main{max-width:78ch}h1{font-size:clamp(36px,7vw,58px);letter-spacing:-.04em}h2{margin-top:48px;letter-spacing:-.03em}p,li{line-height:1.7;color:#b5b9bf}a{color:#F0F1F2;text-underline-offset:4px}pre{background:#0C0D10;border:1px solid #26282C;border-radius:12px;padding:20px;overflow:auto;line-height:1.65}code{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.9em}:focus-visible{outline:2px solid #F0F1F2;outline-offset:4px}</style></head><body><nav><a href="/">ohmyho.st</a><a href="/docs">Docs</a><a href="/docs/cli">CLI</a><a href="/docs/mcp">MCP</a><a href="/api">API</a><a href="/brand">Brand</a><a href="${documentPath}.md">Markdown</a><a href="/login">Login</a></nav><main>${marked.parse(markdown, { async: false })}</main></body></html>`,
    };
  }
  if (path === "/.well-known/skills/index.json")
    return {
      text: JSON.stringify({
        skills: skills
          .filter((skill) => skill.relativePath === "SKILL.md")
          .map((skill) => ({
            name: skill.skillName,
            description: skill.description,
            url: `https://ohmyho.st/skills/${skill.skillName}/SKILL.md`,
          })),
      }),
      type: "application/json",
    };
  const skill = skills.find((item) => path === `/skills/${item.skillName}/${item.relativePath}`);
  return skill ? { text: skill.text, type: "text/markdown; charset=utf-8" } : null;
}

export function isClientDownload(path: string): boolean {
  const parts = path.split("/");
  const version = parts[2] ?? "";
  const file = parts[3] ?? "";
  if (
    parts.length !== 4 ||
    parts[0] !== "" ||
    parts[1] !== "releases" ||
    !RETAINED_CLIENT_RELEASES.has(version)
  )
    return false;
  return (
    ["manifest.json", "SHA256SUMS", "openapi.json"].includes(file) ||
    CLIENT_PACKAGES.some((name) => file === `ohmyhost-${name}-${version}.tgz`)
  );
}
