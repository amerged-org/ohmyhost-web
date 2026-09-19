import { LEGAL_DOCUMENTS } from "./legal-documents.js";
import MCP_REFERENCE from "./generated-mcp-tools.json" with { type: "json" };
import { SITE_CSS, BETA_SCRIPT, PRIVACY_UI } from "./generated-site-frame.js";
import { LAUNCH_DOCUMENTS } from "./launch-pages.js";
import { marked } from "marked";
import { listOhmyhostSkillResources } from "@ohmyhost/agent-skills";

export const CLIENT_RELEASE = "0.1.2";
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
  "0.1.0-beta.24",
  "0.1.0-beta.25",
  "0.1.0-beta.26",
  "0.1.0-beta.27",
  "0.1.0-beta.28",
  "0.1.0-beta.29",
  "0.1.0-beta.30",
  "0.1.0-beta.31",
  "0.1.0-beta.32",
  "0.1.0-beta.33",
  "0.1.0-beta.34",
  "0.1.0-beta.35",
  "0.1.0-beta.36",
  "0.1.0-beta.37",
  "0.1.0-beta.38",
  "0.1.0-beta.39",
  "0.1.0-beta.40",
  "0.1.0",
  "0.1.1",
  CLIENT_RELEASE,
]);

const skills = listOhmyhostSkillResources();
export const DOCS_ORIGIN = "https://docs.ohmyho.st";
export const MCP_CONFIG = {
  mcpServers: {
    ohmyho: { command: "ohmyhost-mcp", env: { OHMYHOST_ENVIRONMENT: "production" } },
  },
};

const DOC_ALIASES: Readonly<Record<string, string>> = {
  mcp: "agents/mcp",
  "agents/mcp": "agents/mcp",
  nextjs: "frameworks/nextjs",
  vite: "frameworks/vite",
  react: "frameworks/vite",
  tanstack: "frameworks/tanstack",
  postgres: "database",
  credits: "usage",
  "spend-cap": "budgets",
  "dev-and-prod": "environments",
};

export function documentationRedirect(path: string, markdown = false): string | null {
  if (path === "/llms-full.txt") return `${DOCS_ORIGIN}/llms-full.txt`;
  if (path === "/api" || path === "/api.md")
    return `${DOCS_ORIGIN}/api${markdown || path.endsWith(".md") ? ".md" : ""}`;
  if (path === "/docs/index.md") return `${DOCS_ORIGIN}/llms.txt`;
  if (path === "/docs" || path === "/docs/" || path === "/docs.md")
    return `${DOCS_ORIGIN}/${markdown || path.endsWith(".md") ? "index.md" : ""}`;
  if (!path.startsWith("/docs/")) return null;
  const raw = path.slice(6).replace(/\/$/u, "");
  const isMarkdown = markdown || raw.endsWith(".md");
  const slug = raw.endsWith(".md") ? raw.slice(0, -3) : raw;
  // Assign pathname on a fixed URL: a customer path never selects another origin.
  const target = new URL(DOCS_ORIGIN);
  target.pathname = `/${DOC_ALIASES[slug] ?? slug}${isMarkdown ? ".md" : ""}`;
  return target.href;
}

export const DOCUMENTATION: Record<string, string> = {
  ...LAUNCH_DOCUMENTS,
  ...LEGAL_DOCUMENTS,
  "/auth.md": `# Authenticate an ohmyho.st agent

Run ohmyhost login --json, open its sign-in link and use ohmyhost whoami --json to confirm the selected organization. The local MCP server uses that CLI login.

For an automation platform, create a user API token from Profile → API Tokens or the interactive CLI. New tokens do not expire and remain valid until revoked. The full token is shown once; keep it in a private environment file or the automation platform's secret field. Send it as a Bearer token to the API. Never put it in a URL, project notes or a prompt.

Existing tokens keep their original expiry. Browser and CLI login sessions have separate lifetimes. Use an interactive-login process without OHMYHOST_TOKEN for organization or token management; do not delete the saved token file.

[Get started](https://docs.ohmyho.st/quickstart.md) · [Login and tokens](https://docs.ohmyho.st/login-tokens.md) · [MCP](https://docs.ohmyho.st/agents/mcp.md)
`,
  "/login": `# Log in to ohmyho.st

[Continue to login](https://app.ohmyho.st/login), then connect your [CLI](https://docs.ohmyho.st/cli) or [MCP server](https://docs.ohmyho.st/agents/mcp).

Ask your agent for project status, usage and changes.
`,
};

export const AGENT_INDEX = `# ohmyho.st

> Hosting for agents. Deploy GitHub-connected Next.js, Vite/React and TanStack apps, then manage databases, domains, email, credits and SQL exports through the CLI, MCP or REST API.

## When to use ohmyho.st

- Deploy or update an app from a GitHub repository the customer authorizes.
- Resume a project: authenticate, identify its organization and read project context before acting.
- Connect a domain or sender, follow DNS/TLS/DKIM readiness, or diagnose a failed deployment.
- Check measured consumption, change a monthly project budget, or request an encrypted SQL export.
- Keep the app's existing authentication provider; enable only the hosting capabilities it needs.

## Get started

- [Agent setup playbook](https://ohmyho.st/skills/ohmyhost-get-started/SKILL.md): Install clients, connect MCP, sign in and reuse the customer's workspace.
- [Quickstart](https://docs.ohmyho.st/quickstart.md): Deploy the selected GitHub app.
- [Authentication](https://ohmyho.st/auth.md): Browser login, local CLI sessions and user-owned API tokens.
- [Account portal](https://app.ohmyho.st/login): Projects, profile, credits and billing after sign-in.

## CLI, MCP and REST

- [CLI installation and commands](https://docs.ohmyho.st/cli.md): Install the published npm archive and run ohmyhost login.
- [MCP setup](https://docs.ohmyho.st/agents/mcp.md): Connect the local stdio npm server to your harness.
- [MCP tool reference](https://docs.ohmyho.st/mcp-tools.md): Actual tool names and input schemas.
- [MCP client configuration](https://ohmyho.st/mcp.json): Token-free local server settings to merge into your harness.
- [MCP machine-readable catalog](https://ohmyho.st/mcp-tools.json): Discover the current tools; this is not an authenticated remote endpoint.
- [OpenAPI JSON](https://ohmyho.st/api/openapi.json): Canonical REST /v1 schemas; production API base https://app.ohmyho.st.
- [OpenAPI YAML](https://ohmyho.st/api/openapi.yaml): The same contract in YAML.
- [API errors and limits](https://docs.ohmyho.st/limits.md): Typed errors, authorization and polling.
- [Current release](https://ohmyho.st/client-release.json): Current version and immutable manifest URL.
- [Release manifest](https://ohmyho.st${RELEASE_PATH}/manifest.json): Exact CLI, MCP and SDK archives with integrity hashes.

New user API tokens have no expiry and remain valid until revoked; existing keys retain their recorded expiry. Browser and CLI sessions are separate. Use Bearer authentication for private REST requests. Public discovery and project/user IDs grant no authority. Product access is checked for the current user, organization, project and action. Read the operation's returned polling guidance and reuse mutation idempotency keys after uncertainty.

## Task Skills

- [Skill catalog](https://ohmyho.st/.well-known/agent-skills/index.json): Installable Skills and their descriptions.
${skills
  .filter((skill) => skill.relativePath === "SKILL.md")
  .map((skill) => `- [${skill.skillName}](https://ohmyho.st/skills/${skill.skillName}/SKILL.md)`)
  .join("\n")}

## Documentation by task

- [Documentation index](https://docs.ohmyho.st/llms.txt): All product guides with titles.
- [Full product documentation](https://docs.ohmyho.st/llms-full.txt): Complete published guides and API reference.
- [Frameworks and GitHub](https://docs.ohmyho.st/github.md): Repository consent and deployment.
- [Databases and compute](https://docs.ohmyho.st/database.md): Profiles, Dev/Prod choices and migrations.
- [Domains and mail](https://docs.ohmyho.st/domains.md): Setup and follow-up checks.
- [Usage and budgets](https://docs.ohmyho.st/usage.md): Shared credits, measured costs and project limits.
- [Billing](https://docs.ohmyho.st/billing.md): Plan access, monthly and non-expiring credits, Stripe when enabled.
- [SQL exports](https://docs.ohmyho.st/backups.md): Asynchronous password-encrypted ZIP exports and downloads.
- [Troubleshooting](https://docs.ohmyho.st/troubleshooting.md): Actionable errors and customer-agent feedback.

## Product and legal

- [Pricing](https://ohmyho.st/pricing.md)
- [Brand](https://ohmyho.st/brand.md)
- [Privacy](https://ohmyho.st/privacy.md)
- [DPA](https://ohmyho.st/dpa.md)
- [Contact](https://ohmyho.st/contact)
`;

export function customerDocument(path: string): { text: string; type: string } | null {
  if (path === "/mcp.json") return { text: JSON.stringify(MCP_CONFIG), type: "application/json" };
  if (path === "/client-release.json")
    return {
      text: JSON.stringify({
        version: CLIENT_RELEASE,
        manifest_url: `https://ohmyho.st${RELEASE_PATH}/manifest.json`,
      }),
      type: "application/json",
    };
  if (path === "/mcp-tools.json")
    return { text: JSON.stringify(MCP_REFERENCE), type: "application/json" };
  if (path === "/.well-known/agent-skills/index.json") path = "/.well-known/skills/index.json";
  if (path === "/llms.txt") return { text: AGENT_INDEX, type: "text/plain; charset=utf-8" };
  const documentPath = path === "/auth.md" ? path : path.endsWith(".md") ? path.slice(0, -3) : path;
  const markdown = DOCUMENTATION[documentPath];
  if (markdown) {
    if (path.endsWith(".md")) return { text: markdown, type: "text/markdown; charset=utf-8" };
    return {
      type: "text/html; charset=utf-8",
      text: `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="https://ohmyho.st/favicon.svg" type="image/svg+xml"><link rel="alternate icon" href="https://ohmyho.st/favicon.ico"><link rel="apple-touch-icon" href="https://ohmyho.st/apple-touch-icon.png"><title>${markdown.split("\n")[0]?.replace(/^# /u, "")} — ohmyho.st</title><meta name="description" content="${
        markdown
          .split("\n")
          .find((line) => line.trim() && !line.startsWith("#"))
          ?.replaceAll('"', "&quot;") ?? "Hosting for agents"
      }"><link rel="canonical" href="https://ohmyho.st${documentPath}"><link rel="alternate" type="text/markdown" href="${documentPath}.md"><style>${SITE_CSS}
.docs-content{max-width:76ch;margin:64px auto 90px}.docs-content h1{font-size:clamp(36px,6vw,58px);margin-bottom:28px}.docs-content h2{font-size:26px;text-align:left;margin:36px 0 14px}.docs-content p,.docs-content li{color:var(--muted-foreground);line-height:1.75;margin:14px 0}.docs-content ul,.docs-content ol{padding-left:24px}.docs-content a{text-decoration:underline;text-underline-offset:4px;color:var(--foreground)}.docs-content pre{padding:20px;background:var(--muted);border:1px solid var(--border);border-radius:12px;overflow:auto;line-height:1.7}.docs-content code{font:13px var(--mono)}.docs-content table{display:block;overflow:auto;width:100%;border-collapse:collapse;font-size:14px;margin:24px 0}.docs-content th,.docs-content td{padding:12px;text-align:left;border-bottom:1px solid var(--border)}.docs-content blockquote{border-left:2px solid var(--border-strong);padding-left:20px}.docs-content strong{color:var(--foreground)}nav{gap:18px}@media(max-width:760px){nav a.secondary{display:none}.docs-content{margin-top:38px}}</style></head><body><div class="wrap"><nav><a class="mark" href="/" style="display:flex;align-items:center;gap:9px"><img src="/brand/assets/omega-light.svg" width="23" height="23" alt="">ohmyho.st</a><a href="https://docs.ohmyho.st/">Docs</a><a class="secondary" href="https://docs.ohmyho.st/skills">Skills</a><a class="secondary" href="/api">API</a><a class="secondary" href="${documentPath}.md">Markdown</a><div class="r"><a href="/login">Log in</a><button class="btn nochev" data-beta-access><span>Copy prompt</span></button></div></nav><main class="docs-content">${marked.parse(markdown, { async: false })}</main><footer><a href="/">ohmyho.st</a> · <a href="/privacy">Privacy</a> · <a href="/cookies">Cookies</a> · <a href="/dpa">DPA</a> · <a href="/dpa/toms">TOMs</a> · <a href="/contact">Contact</a> · <a href="/terms">Terms</a> · <a href="https://docs.ohmyho.st/">Docs</a></footer></div><script>${BETA_SCRIPT}</script>${PRIVACY_UI}</body></html>`,
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
