import { marked } from "marked";
import { listOhmyhostSkillResources } from "@ohmyhost/agent-skills";

export const CLIENT_RELEASE = "0.1.0-beta.24";
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
  "0.1.0-beta.8",
  "0.1.0-beta.9",
  "0.1.0-beta.10",
  "0.1.0-beta.11",
  "0.1.0-beta.12",
  "0.1.0-beta.13",
  "0.1.0-beta.14",
  "0.1.0-beta.15",
  "0.1.0-beta.16",
  "0.1.0-beta.17",
  "0.1.0-beta.18",
  "0.1.0-beta.19",
  "0.1.0-beta.20",
  "0.1.0-beta.21",
  "0.1.0-beta.22",
  "0.1.0-beta.23",
  CLIENT_RELEASE,
]);

const skills = listOhmyhostSkillResources();
export const CUSTOMER_GUIDE = `# Deploy with ohmyho.st

Deploy your GitHub app, connect a domain, and manage it through your agent.

## Start with your agent

Open a terminal in your project and run:

    curl -fsSL https://omh.st/0.sh | bash

Choose Codex, Claude Code, Cursor, Hermes or OpenClaw. Follow the sign-in link and authorize your GitHub repository. Then ask:

> Deploy this project to ohmyho.st. Show me the plan, then verify the deployed app.

Your agent checks the app, configures the project and follows the deployment. It can also connect your domain, check usage and export your database.

## Prefer the CLI?

Install with Node.js 22 or newer:

    npm install --global https://ohmyho.st${RELEASE_PATH}/ohmyhost-product-cli-${CLIENT_RELEASE}.tgz
    export OHMYHOST_ENVIRONMENT=production
    ohmyhost login --json

Continue with the [CLI guide](/docs/cli). For native Windows, use the [MCP setup](/docs/mcp) without Bash.

## What next?

- [Connect your agent with MCP](/docs/mcp)
- [Install task Skills](/docs/skills)
- [Connect a domain or email](/docs/domains)
- [Check usage and database size](/docs/usage)
- [Download a database export](/docs/backups)
- [Read the API reference](/api)

Ask your agent for status and changes: “Is my domain ready?” or “Which project used the most credits this month?”
`;

const DOCUMENTATION: Record<string, string> = {
  "/docs": CUSTOMER_GUIDE,
  "/docs/cli": `# CLI

Deploy and manage projects from your terminal. Requires Node.js 22 or newer.

## Install and log in

    npm install --global https://ohmyho.st${RELEASE_PATH}/ohmyhost-product-cli-${CLIENT_RELEASE}.tgz
    ohmyhost login --json
    ohmyhost whoami --json

Open the sign-in link printed by login. Use the organization ID returned by whoami. If signup asks for an invitation, use the link you received.

## Prepare your app

Run these commands in your GitHub repository:

    ohmyhost init --dry-run --json
    ohmyhost project create --organization "$ORGANIZATION_ID" --name "My app" --data-mode isolated --idempotency-key "$PROJECT_REQUEST_KEY" --json
    ohmyhost link --help
    ohmyhost plan --help
    ohmyhost deploy --help

Choose a unique request key for project creation. Link your repository, review the plan for the exact pushed commit, then deploy. Reuse the same request key if a response is interrupted. Your agent can handle this workflow with the [GitHub deployment Skill](/skills/ohmyhost-deploy-github/SKILL.md).

Isolated data gives Dev and Prod separate databases; each uses credits. Shared data uses one database for both. Keep your application's existing authentication choice.

## Check progress

    ohmyhost project context --project "$PROJECT_ID" --json
    ohmyhost project status --help
    ohmyhost operation get --help

Use the operation ID returned by deploy to follow progress. Dev links are private; ask your agent to open a Dev access link before testing.

## Save a token for your agent

From your interactive login:

    ohmyhost token create --organization "$ORGANIZATION_ID" --name "Deployment agent" --idempotency-key "$TOKEN_REQUEST_KEY" --out .env.local --json
    ohmyhost token list --organization "$ORGANIZATION_ID" --json

Tokens default to 90 days. The command saves the newly issued value to the private file; it cannot be retrieved again later. Ignore the file in Git. Existing credentials are not overwritten. Load it into your agent process using Node's --env-file option. Use token revoke --help to revoke a selected key from your interactive login.

[Release manifest and checksums](https://ohmyho.st${RELEASE_PATH}/manifest.json) · [MCP setup](/docs/mcp) · [API reference](/api)`,
  "/docs/mcp": `# Connect your agent

The ohmyho.st MCP server lets your agent deploy apps, check status, connect domains, inspect usage and export databases.

## 1. Install

Requires Node.js 22 or newer. Works on macOS, Linux and native Windows.

    npm install --global https://ohmyho.st${RELEASE_PATH}/ohmyhost-product-cli-${CLIENT_RELEASE}.tgz https://ohmyho.st${RELEASE_PATH}/ohmyhost-mcp-${CLIENT_RELEASE}.tgz
    ohmyhost login --json

Follow the sign-in link.

## 2. Add the MCP server

Add this local server to your agent's MCP settings:

    {
      "mcpServers": {
        "ohmyho": {
          "command": "ohmyhost-mcp",
          "env": { "OHMYHOST_ENVIRONMENT": "production" }
        }
      }
    }

Keep any other configured servers. Client settings formats can differ; your agent can add this command using its own MCP setup. Reload the connection if requested, then ask it to list the ohmyho.st tools and Skills.

The current server runs locally and uses your CLI login. A hosted URL-only connection is not available yet.

## 3. Ask your agent

> Deploy this GitHub project to ohmyho.st.

> Check whether my domain and email are ready.

> Show this month's usage by project.

> Export my database using the password file I selected.

[Agent Skills](/docs/skills) provide the workflow for each task. Project tools link to a shared project note with current status and unfinished actions, so another session can pick up where you left off.

[CLI guide](/docs/cli) · [API reference](/api)`,
  "/docs/skills": `# Agent Skills

Skills teach your agent how to complete a specific task with ohmyho.st. Install the ones you need:

    npx skills add amerged/ohmyho -s ohmyhost-deploy-github

Replace the Skill name to install another. Current MCP releases also expose these instructions as readable resources.

${skills
  .filter((skill) => skill.relativePath === "SKILL.md")
  .map(
    (skill) => `- [${skill.skillName}](/skills/${skill.skillName}/SKILL.md) — ${skill.description}`,
  )
  .join("\n")}

[Machine-readable catalog](/.well-known/skills/index.json) · [Connect MCP](/docs/mcp)`,
  "/docs/domains": `# Domains and email

Every project gets a hosting address. For a custom domain or transactional email, ask your agent:

> Connect app.example.com and set up email from my sender domain.

Custom domains and managed email require Paid access. We prefer Cloudflare-hosted DNS: your agent can provide an authorization link and apply the required records. Other DNS providers work too; your agent gives you the exact records to add manually.

Website routing, HTTPS and email verification have separate statuses. Keep existing mailbox records. While DNS, certificates or DKIM are pending, ask your agent to check again after 60 minutes. It follows the existing deployment instead of starting another build.

[Domains and email Skill](/skills/ohmyhost-domains-and-mail/SKILL.md)`,
  "/docs/usage": `# Usage and database size

Ask your agent: “Show this month's usage by project and my remaining credits.”

    ohmyhost credits balance --organization "$ORGANIZATION_ID" --json
    ohmyhost credits usage --organization "$ORGANIZATION_ID" --month YYYY-MM --json

Credits are shared across your organization. Optional project budgets limit an individual project's spending. Reports show posted measurements; recent usage can take time to appear. Status and reporting remain available at zero credits.

## Database profiles

| Profile | Compute | Memory | Sleeps after idle |
| --- | --- | --- | --- |
| Free | 0.25 CU | 1 GB | 1 minute |
| Paid standard | 0.5 CU | 2 GB | 2 minutes |
| Paid performance | 1 CU | 4 GB | 5 minutes |

Performance uses 2.5 times Paid-standard database compute credits for the same active duration. Its longer idle window can add active minutes. Storage and retained history are metered separately. An idle database sleeps automatically; its first query may take longer to respond.

    ohmyhost database compute get --project "$PROJECT_ID" --environment prod --json

Ask your agent to select standard or performance and show the cost before changing it. With shared data, a resize affects both environments; isolated databases are sized and metered separately.

## Billing

Your agent can show invoices and open the billing portal. Each successful purchase has an invoice, including top-ups. A top-up adds credits; it does not extend a subscription. Automatic recharge is not currently available. Production purchases are not yet enabled; existing organizations can inspect their available balance.

[Usage and budgets Skill](/skills/ohmyhost-usage-and-budgets/SKILL.md) · [Database Skill](/skills/ohmyhost-manage-database/SKILL.md)`,
  "/docs/backups": `# Export your database

Ask your agent to create a password-encrypted SQL ZIP using a private password file you choose. You keep the password.

Exports run asynchronously. Your agent requests one, checks its progress, then gives you a download link valid for 24 hours. You can request one export per project per rolling 24 hours. An accepted failed request still uses that allowance.

The export contains SQL dumps for your project's databases. It excludes application source, files and configuration. The plaintext SQL limit is 256 MiB. Use an AES-compatible ZIP reader such as 7-Zip to open it.

Exports require the organization Owner and remain available at zero credits. Direct Google Drive, S3 and R2 destinations are not currently available.

[Database export Skill](/skills/ohmyhost-export-database/SKILL.md)`,
  "/login": `# Log in to ohmyho.st

[Continue to login](https://app.ohmyho.st/login), then connect your [CLI](/docs/cli) or [MCP server](/docs/mcp).

Ask your agent for project status, usage and changes.`,
};

export const AGENT_INDEX = `# ohmyho.st

Hosting for agents. Deploy GitHub apps and manage projects through CLI, MCP or API.

- [Start here](https://ohmyho.st/docs.md)
- [CLI](https://ohmyho.st/docs/cli.md)
- [MCP setup](https://ohmyho.st/docs/mcp.md)
- [Agent Skills](https://ohmyho.st/docs/skills.md)
- [Domains and email](https://ohmyho.st/docs/domains.md)
- [Usage and database size](https://ohmyho.st/docs/usage.md)
- [SQL exports](https://ohmyho.st/docs/backups.md)
- [API reference](https://ohmyho.st/api.md)
- [OpenAPI YAML](https://ohmyho.st/api/openapi.yaml)
- [Design system](https://ohmyho.st/brand.md)
- [Homepage](https://ohmyho.st/index.md)
- [Login](https://ohmyho.st/login.md)
- [Release manifest](https://ohmyho.st${RELEASE_PATH}/manifest.json)
- [Skill catalog](https://ohmyho.st/.well-known/skills/index.json)
${skills
  .filter((skill) => skill.relativePath === "SKILL.md")
  .map((skill) => `- [${skill.skillName}](https://ohmyho.st/skills/${skill.skillName}/SKILL.md)`)
  .join("\n")}
`;

export function customerDocument(path: string): { text: string; type: string } | null {
  if (path === "/llms.txt") return { text: AGENT_INDEX, type: "text/plain; charset=utf-8" };
  const documentPath = path.endsWith(".md") ? path.slice(0, -3) : path;
  const markdown = DOCUMENTATION[documentPath];
  if (markdown) {
    if (path.endsWith(".md")) return { text: markdown, type: "text/markdown; charset=utf-8" };
    return {
      type: "text/html; charset=utf-8",
      text: `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>ohmyho.st — documentation</title><link rel="alternate" type="text/markdown" href="${documentPath}.md"><style>:root{color-scheme:dark;font-family:'Space Grotesk',system-ui,sans-serif;background:#000;color:#F0F1F2}*{box-sizing:border-box}body{max-width:1000px;margin:0 auto;padding:32px 22px 80px}nav{display:flex;gap:20px;flex-wrap:wrap;padding:0 0 24px;border-bottom:1px solid #26282C}nav a{font-size:14px}main{max-width:78ch}h1{font-size:clamp(36px,7vw,58px);letter-spacing:-.04em}h2{margin-top:48px;letter-spacing:-.03em}p,li{line-height:1.7;color:#b5b9bf}a{color:#F0F1F2;text-underline-offset:4px}pre{background:#0C0D10;border:1px solid #26282C;border-radius:12px;padding:20px;overflow:auto;line-height:1.65}code{font-family:'JetBrains Mono',ui-monospace,monospace;font-size:.9em}:focus-visible{outline:2px solid #F0F1F2;outline-offset:4px}</style></head><body><nav><a href="/">ohmyho.st</a><a href="/docs">Docs</a><a href="/docs/cli">CLI</a><a href="/docs/mcp">MCP</a><a href="/docs/skills">Skills</a><a href="/api">API</a><a href="/brand">Brand</a><a href="${documentPath}.md">Markdown</a><a href="/login">Login</a></nav><main>${marked.parse(markdown, { async: false })}</main></body></html>`,
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
