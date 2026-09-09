import { listOhmyhostSkillResources } from "@ohmyhost/agent-skills";

export const CLIENT_RELEASE = "0.1.0-beta.7";
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

Never invent an invitation source or reuse someone else's token. Interactive clients keep their own hosting login credential in the native credential store. An already issued and permitted ohmyho.st user key can instead be supplied through OHMYHOST_TOKEN in your local environment; this bypasses native credential reads. Self-service issuance with the planned 90-day default is not yet available. This hosting token never authenticates your application's end users.

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

Paid transactional mail uses an explicitly configured customer sender domain. Discover mail domain set/status in CLI help. Follow the exact DNS records returned by the service, or the optional Cloudflare authorization flow. Never replace mailbox MX records. An external authentication provider may handle its own verification/reset mail; this does not automatically require ohmyho.st mail or DKIM. The current managed Better Auth integration uses its declared database/mail path. Domain verification is a separate provider step and can take longer than the build; report its actual status. Do not remove mail/Auth capabilities just to make deployment pass, bypass email verification or claim pending mail is ready.

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

const GUIDE_HTML = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Deploy with ohmyho.st</title><style>:root{color-scheme:dark;font-family:system-ui;background:#080808;color:#eee}body{max-width:900px;margin:48px auto;padding:24px}a{color:#ddd}pre{white-space:pre-wrap;overflow-wrap:anywhere;font:16px/1.6 ui-monospace,monospace}</style><nav><a href="/">ohmyho.st</a> · <a href="/docs.md">Markdown</a> · <a href="/llms.txt">Agent index</a></nav><pre>${CUSTOMER_GUIDE.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</pre></html>`;

export const AGENT_INDEX = `# ohmyho.st

Invite-only, API-first hosting for applications and agents.

- [Customer guide](https://ohmyho.st/docs): client installation, login, GitHub deployment, verification, promotion and recovery.
- [Guide as Markdown](https://ohmyho.st/docs.md)
- [Release manifest](https://ohmyho.st${RELEASE_PATH}/manifest.json)
- [OpenAPI contract](https://ohmyho.st${RELEASE_PATH}/openapi.json)
- [Skill catalog](https://ohmyho.st/.well-known/skills/index.json)
- [Portable app Skill](https://ohmyho.st/skills/ohmyhost-build-portable-app/SKILL.md)
- [Supabase migration Skill](https://ohmyho.st/skills/ohmyhost-migrate-supabase-postgres/SKILL.md)

Use the production platform with OHMYHOST_ENVIRONMENT=production. Read the customer guide; do not guess private installation paths, credentials, endpoints or resource state.
`;

export function customerDocument(path: string): { text: string; type: string } | null {
  if (path === "/llms.txt") return { text: AGENT_INDEX, type: "text/plain; charset=utf-8" };
  if (path === "/docs.md") return { text: CUSTOMER_GUIDE, type: "text/markdown; charset=utf-8" };
  if (path === "/docs") return { text: GUIDE_HTML, type: "text/html; charset=utf-8" };
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
