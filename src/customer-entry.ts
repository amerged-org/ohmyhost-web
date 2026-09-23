import { LEGAL_DOCUMENTS } from "./legal-documents.js";
import MCP_REFERENCE from "./generated-mcp-tools.json" with { type: "json" };
import {
  SITE_CSS,
  SITE_SCRIPT,
  PRIVACY_UI,
  FIGURE_SCRIPT,
} from "./generated-site-frame.js";
import { LAUNCH_DOCUMENTS } from "./launch-pages.js";
import { pageMeta } from "./page-meta.js";
import { CONTENT_PAGES } from "./pages/index.js";
import { externalLinkRel, footerColumnsHtml } from "./site-links.js";
import { breadcrumbHtml, headTags } from "./structured-data.js";
import { marked } from "marked";
import { SKILL_RESOURCES } from "./generated-skills.js";

import { CLIENT_RELEASE } from "./generated-release.js";

export { CLIENT_RELEASE };
export const RELEASE_PATH = `/releases/${CLIENT_RELEASE}`;
const CLIENT_PACKAGES = [
  "product-cli",
  "mcp",
  "sdk-ts",
  "customer-runtime",
  "customer-auth-better-auth",
];

const skills = SKILL_RESOURCES;
export const DOCS_ORIGIN = "https://docs.ohmyho.st";
export const MCP_CONFIG = {
  mcpServers: {
    ohmyho: {
      command: "ohmyhost-mcp",
      env: { OHMYHOST_ENVIRONMENT: "production" },
    },
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

export function documentationRedirect(
  path: string,
  markdown = false,
): string | null {
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
  ...CONTENT_PAGES,
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

/** Instructions for a coding agent that meets ohmyho.st in a repository or a prompt. */
export const PUBLIC_AGENTS = `# AGENTS.md — working with ohmyho.st

ohmyho.st hosts Next.js, Vite/React and TanStack apps from a GitHub repository the customer authorizes, with Postgres, domains, transactional mail and credits on one organization balance. You operate it through the ohmyhost CLI, the local MCP server or the REST /v1 API.

1. Read https://ohmyho.st/llms.txt first, then the get-started Skill at https://ohmyho.st/skills/ohmyhost-get-started/SKILL.md.
2. Install the published clients and register the MCP server in your harness; sign in through the link and confirmation code returned by \`ohmyhost login --json\`. Never paste credentials into chat.
3. Read the project's context before acting, plan before you deploy (deployment_plan, then deployment_create), and verify the live application before reporting a URL.
4. Keep the customer's decisions: their authentication provider, their region choice, their data. Set secrets only through the stdin-only command from secret_set_command.
5. Read the tool catalog at https://ohmyho.st/mcp-tools.json and the API errors at https://docs.ohmyho.st/limits.md; reuse idempotency keys after an uncertain outcome.

Pricing and limits: https://ohmyho.st/pricing.md · https://docs.ohmyho.st/limits.md · Report a defect: the feedback_submit tool.
`;

export const AGENT_INDEX = `# ohmyho.st

> Hosting for agents. Deploy GitHub-connected Next.js, Vite/React and TanStack apps, then manage databases, domains, email, credits and SQL exports through the CLI, MCP or REST API.

## When to use ohmyho.st

- Deploy or update an app from a GitHub repository the customer authorizes.
- Resume a project: authenticate, identify its organization and read project context before acting.
- Connect a domain or sender, follow DNS/TLS/DKIM readiness, or diagnose a failed deployment.
- Check measured consumption, change a monthly project budget, or request an encrypted SQL export.
- Keep the app's existing authentication provider; enable only the hosting capabilities it needs.

## Get started

- [AGENTS.md](https://ohmyho.st/AGENTS.md): Five rules for a coding agent that operates ohmyho.st.
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
  .map(
    (skill) =>
      `- [${skill.skillName}](https://ohmyho.st/skills/${skill.skillName}/SKILL.md)`,
  )
  .join("\n")}

## Documentation by task

- [Documentation index](https://docs.ohmyho.st/llms.txt): All product guides with titles.
- [Full product documentation](https://docs.ohmyho.st/llms-full.txt): Complete published guides and API reference.
- [Frameworks and GitHub](https://docs.ohmyho.st/github.md): Repository consent and deployment.
- [Databases and compute](https://docs.ohmyho.st/database.md): Profiles, Dev/Prod choices and migrations.
- [Domains and mail](https://docs.ohmyho.st/domains.md): Setup and follow-up checks.
- [Usage and budgets](https://docs.ohmyho.st/usage.md): Shared credits, measured costs and project limits.
- [Billing](https://docs.ohmyho.st/billing.md): Plan access, expiring Free credits and purchased credits that never expire, Stripe when enabled.
- [SQL exports](https://docs.ohmyho.st/backups.md): Asynchronous password-encrypted ZIP exports and downloads.
- [Troubleshooting](https://docs.ohmyho.st/troubleshooting.md): Actionable errors and customer-agent feedback.

## Pricing and comparisons

- [Pricing](https://ohmyho.st/pricing.md): Free 200 credits a month; Paid $10 for 1,000 credits a month that never expire and stack; one balance for every project.
- [Cost breakdown](https://ohmyho.st/pricing/breakdown.md): Every published rate, worked workloads in credits and the same workloads as separate subscriptions.
- [ohmyho.st vs Vercel](https://ohmyho.st/vs/vercel.md): Dated list prices, the same small app priced both ways, where Vercel is the better choice.
- [ohmyho.st vs Supabase](https://ohmyho.st/vs/supabase.md): Postgres compute and storage by usage against Supabase Pro and per-project compute.
- [ohmyho.st vs Resend](https://ohmyho.st/vs/resend.md): Mail per recipient plus a sender zone against Resend plans; break-even by volume.
- [ohmyho.st vs Railway](https://ohmyho.st/vs/railway.md): Requests, CPU time and database credits against per-second vCPU, memory and volumes.

## Deploy from your agent

- [Claude Code](https://ohmyho.st/for/claude-code.md): One prompt, the MCP tool sequence, what Claude Code asks, Dev and Prod, costs.
- [Cursor](https://ohmyho.st/for/cursor.md): Cursor MCP settings and the same deployment path.
- [Codex](https://ohmyho.st/for/codex.md): Codex MCP registration, tokens and budgets for agents that run unattended.
- [From Lovable](https://ohmyho.st/from/lovable.md): Export to GitHub, what breaks by hand, keep or migrate Supabase, verify the login.
- [From Bolt](https://ohmyho.st/from/bolt.md): Export from Bolt.new and deploy with secrets, callback URLs and a domain.
- [From Replit](https://ohmyho.st/from/replit.md): Move a Replit app to Dev and Prod hosting with Postgres.
- [From Vercel and Supabase](https://ohmyho.st/from/vercel-supabase.md): Two bills become one balance; keep Supabase or import a dump.

## Company and legal

- [About](https://ohmyho.st/about.md): Amerged B.V., Venray, Netherlands; founder Sebastian Mertens; how the service runs.
- [Philosophy](https://ohmyho.st/philosophy.md): Buy in bulk, add a small margin, one balance for every project, take your database and go.
- [Open source](https://ohmyho.st/open-source.md): The MIT-licensed docs, the public Skills, llms.txt, MCP catalog and OpenAPI contract; the platform is private.
- [Blog](https://ohmyho.st/blog.md): Notes from the build with dated, priced comparisons and migration guides.
- [Brand](https://ohmyho.st/brand.md)
- [Privacy](https://ohmyho.st/privacy.md)
- [DPA](https://ohmyho.st/dpa.md)
- [Contact](https://ohmyho.st/contact)
`;

export function customerDocument(
  path: string,
): { text: string; type: string } | null {
  if (path === "/mcp.json")
    return { text: JSON.stringify(MCP_CONFIG), type: "application/json" };
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
  if (path === "/.well-known/agent-skills/index.json")
    path = "/.well-known/skills/index.json";
  if (path === "/llms.txt")
    return { text: AGENT_INDEX, type: "text/plain; charset=utf-8" };
  if (path === "/AGENTS.md")
    return { text: PUBLIC_AGENTS, type: "text/markdown; charset=utf-8" };
  const documentPath =
    path === "/auth.md"
      ? path
      : path.endsWith(".md")
        ? path.slice(0, -3)
        : path;
  const markdown = DOCUMENTATION[documentPath];
  if (markdown) {
    if (path.endsWith(".md"))
      return {
        text: markdown.replaceAll(/<svg[\s\S]*?<\/svg>/gu, ""),
        type: "text/markdown; charset=utf-8",
      };
    const meta = pageMeta(documentPath);
    return {
      type: "text/html; charset=utf-8",
      text: `<!doctype html><html lang="en" data-theme="dark"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="https://ohmyho.st/favicon.svg" type="image/svg+xml"><link rel="alternate icon" href="https://ohmyho.st/favicon.ico"><link rel="apple-touch-icon" href="https://ohmyho.st/apple-touch-icon.png">${headTags(documentPath, meta, markdown)}<style>${SITE_CSS}
.docs-content{max-width:76ch;margin:64px auto 90px}.docs-content h1{font-size:clamp(36px,6vw,58px);margin-bottom:28px}.docs-content h2{font-size:26px;text-align:left;margin:36px 0 14px}.docs-content p,.docs-content li{color:var(--muted-foreground);line-height:1.75;margin:14px 0}.docs-content ul,.docs-content ol{padding-left:24px}.docs-content a{text-decoration:underline;text-underline-offset:4px;color:var(--foreground)}.docs-content pre{padding:20px;background:var(--muted);border:1px solid var(--border);border-radius:12px;overflow:auto;line-height:1.7}.copy-block{position:relative;margin:20px 0}.copy-block pre{margin:0;padding-top:52px}.copy-block code.language-text{display:block;white-space:pre-wrap;overflow-wrap:anywhere}.copy-code{position:absolute;right:4px;top:4px;width:44px;height:44px;display:flex;align-items:center;justify-content:center;border:0;border-radius:8px;background:transparent;color:var(--muted-foreground);cursor:pointer}.copy-code:hover,.copy-code:focus-visible{background:var(--border);color:var(--foreground)}.copy-code .copy-check,.copy-code.done .copy-icon{display:none}.copy-code.done .copy-check{display:block}.copy-code.copy-error{color:#e85d5d}.copy-feedback{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}.docs-content code{font:13px var(--mono)}.docs-content table{display:block;overflow:auto;width:100%;border-collapse:collapse;font-size:14px;margin:24px 0}.docs-content th,.docs-content td{padding:12px;text-align:left;border-bottom:1px solid var(--border)}.docs-content blockquote{border-left:2px solid var(--border-strong);padding-left:20px}.docs-content strong{color:var(--foreground)}.fcol .fh{font-family:var(--mono);font-size:12px;font-weight:500;color:var(--subtle);margin:0 0 14px}.docs-content .crumbs{font:12.5px var(--mono);color:var(--muted-foreground);margin:0 0 20px;display:flex;flex-wrap:wrap;gap:6px}.docs-content .crumbs a{color:var(--muted-foreground);text-decoration:none}.docs-content .crumbs a:hover{color:var(--foreground)}.docs-content img{max-width:100%;height:auto}.docs-content .fig{margin:36px 0}.docs-content .fig svg{width:100%;height:auto;display:block}.docs-content figcaption{font:11.5px var(--mono);color:var(--subtle);margin-top:10px;line-height:1.6}.docs-content figcaption a{color:var(--muted-foreground)}nav{gap:18px}@media(max-width:760px){nav a.secondary{display:none}.docs-content{margin-top:38px}}</style></head><body><div class="wrap"><nav><a class="mark" href="/" style="display:flex;align-items:center;gap:9px"><img src="/brand/assets/omega-light.svg" width="23" height="23" alt="ohmyho.st mark">ohmyho.st</a><a href="https://docs.ohmyho.st/">Docs</a><a class="secondary" href="https://docs.ohmyho.st/skills">Skills</a><a class="secondary" href="https://docs.ohmyho.st/api">API</a><a class="secondary" href="${documentPath}.md">Markdown</a><div class="r"><a href="/login">Log in</a><button class="btn nochev" data-copy-prompt><span>Copy prompt</span></button></div></nav><main class="docs-content">${breadcrumbHtml(documentPath, meta)}${externalLinkRel(marked.parse(markdown, { async: false }).replaceAll(/(<pre><code[\s\S]*?<\/code><\/pre>)/gu, '<div class="copy-block"><button type="button" class="copy-code" data-copy-code aria-label="Copy text" title="Copy text"><svg class="copy-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/></svg><svg class="copy-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg><span class="copy-feedback" role="status" aria-live="polite"></span></button>$1</div>'))}</main>${documentFooter()}</div><script>${SITE_SCRIPT}</script>${markdown.includes('class="fig"') ? `<script>${FIGURE_SCRIPT}</script>` : ""}${PRIVACY_UI}</body></html>`,
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
  const skill = skills.find(
    (item) => path === `/skills/${item.skillName}/${item.relativePath}`,
  );
  return skill
    ? { text: skill.text, type: "text/markdown; charset=utf-8" }
    : null;
}

/** The homepage footer on every document page: brand block, the shared columns and the legal line. */
function documentFooter(): string {
  return `<footer><div class="fgrid"><div class="fbrand"><div class="fbrandrow"><svg class="ohm" viewBox="0 0 100 100" aria-hidden="true"><path d="M30 87 H14 L27 63 A31 31 0 1 1 73 63 L86 87 H70"/></svg><span class="mark">ohmyho<i>.st</i></span></div><p class="fslogan">Hosting for vibe-coded apps.</p><a class="status" href="/status">Status</a></div>${footerColumnsHtml()}</div><div class="fbot"><span>© 2026 ohmyho.st — Made in Europe</span></div></footer>`;
}

export function isClientDownload(path: string): boolean {
  const parts = path.split("/");
  const version = parts[2] ?? "";
  const file = parts[3] ?? "";
  // Early releases have no backwards-support window: serve the current version only.
  if (
    parts.length !== 4 ||
    parts[0] !== "" ||
    parts[1] !== "releases" ||
    version !== CLIENT_RELEASE
  )
    return false;
  return (
    ["manifest.json", "SHA256SUMS", "openapi.json"].includes(file) ||
    CLIENT_PACKAGES.some((name) => file === `ohmyhost-${name}-${version}.tgz`)
  );
}
