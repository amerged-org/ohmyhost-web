import { format } from "prettier";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, URL } from "node:url";
import TurndownService from "turndown";

const directory = fileURLToPath(new URL("../", import.meta.url));
const root = fileURLToPath(new URL("../../", new URL("../", import.meta.url)));
const output = `${directory}public/pages`;
await mkdir(output, { recursive: true });
const markdown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
markdown.remove(["script", "style", "svg", "head", "button", "input"]);
const templates = {
  home: "39e356828872241b0eb53293b8b1d1a19c82a7a9200d4ee195bf6f81a72bb9ca",
  brand: "d2a49d8a4b9d979c72958eebb2f2db4b7637405ccacd27100ce77e405a01bebe",
};
const approvedHome = await readFile(`${directory}site/home.html`, "utf8");
const sharedCss = approvedHome.match(/<style>([\s\S]*?)<\/style>/u)?.[1];
if (!sharedCss) throw new Error("The approved design stylesheet is missing");
await writeFile(
  `${directory}src/generated-site-frame.ts`,
  await format(
    "// Generated from the approved template and beta entry assets.\n" +
      `export const SITE_CSS = ${JSON.stringify(sharedCss)};\n` +
      `export const BETA_MODAL = ${JSON.stringify(await readFile(`${directory}site/beta-modal.html`, "utf8"))};\n` +
      `export const BETA_SCRIPT = ${JSON.stringify(await readFile(`${directory}site/beta-entry.js`, "utf8"))};\n`,
    { parser: "typescript", printWidth: 100 },
  ),
);
for (const [name, digest] of Object.entries(templates)) {
  const original = await readFile(`${directory}site/${name}.html`, "utf8");
  if (createHash("sha256").update(original).digest("hex") !== digest)
    throw new Error(`The supplied ${name} template was changed`);
  let html = original;
  if (name === "home") {
    const destinations = {
      Docs: "/docs",
      "MCP server": "/docs/mcp",
      CLI: "/docs/cli",
      Status: "/status",
      Changelog: "/changelog",
      About: "/about",
      Philosophy: "/#philosophy",
      Blog: "/blog",
      "Open source": "https://github.com/amerged/docs",
      Privacy: "/privacy",
      Terms: "/terms",
      GDPR: "/privacy",
      Imprint: "/privacy",
    };
    for (const [label, href] of Object.entries(destinations))
      html = html.replaceAll(
        `<a href="#">${label}</a>`,
        label === "Imprint" ? "" : `<a href="${href}">${label}</a>`,
      );
    html = html.replace(
      '<h2 class="up">Why one balance instead of five subscriptions.</h2>',
      '<h2 class="up" id="philosophy">Why one balance instead of five subscriptions.</h2>',
    );
    html = html
      .replace(
        "12 tools found",
        `${JSON.parse(await readFile(`${directory}src/generated-mcp-tools.json`, "utf8")).tools.length} tools found`,
      )
      .replaceAll("create_project", "project_create")
      .replaceAll("provision_postgres", "deployment_plan")
      .replaceAll("set_env", "secret_set_command")
      .replaceAll("verify_email_sender", "mail_domain_status")
      .replaceAll("add_domain", "domain_paid_apply")
      .replaceAll("https://lovable.ohm.st", "https://calm-river-builds.check.omh.st");
    html = html.replaceAll(
      "omh create lovable\\nomh db up\\nomh domain add lovable\\nomh deploy",
      'ohmyhost init --dry-run --json\\nohmyhost project context --project "$PROJECT_ID" --json',
    );
    html = html
      .replaceAll("omh create lovable", "ohmyhost init --dry-run --json")
      .replaceAll("omh db up", "ohmyhost plan --help")
      .replaceAll("omh domain add lovable", "ohmyhost deploy --help")
      .replaceAll("omh deploy", "ohmyhost project status --help");
    html = html.replaceAll(
      "Read https://ohmyho.st/llms.txt and set up hosting for this repo on ohmyho.st: create the project, provision Postgres, add the domain and deploy. Ask me only if you need a decision.",
      "Read https://ohmyho.st/llms.txt and the ohmyhost-get-started Skill. Connect this agent, sign in with my invitation and deploy this GitHub project using only the capabilities it needs. Follow the deployment Skill and verify the app.",
    );
    html = html.replace(
      "</body>",
      `${await readFile(`${directory}site/beta-modal.html`, "utf8")}<script>${await readFile(`${directory}site/beta-entry.js`, "utf8")}</script></body>`,
    );
  }
  await writeFile(`${output}/${name}.html`, html);
  await writeFile(
    `${output}/${name === "home" ? "index" : name}.md`,
    `${markdown.turndown(html)}\n`,
  );
}

for (const image of ["og", "logo"])
  await writeFile(`${output}/${image}.png`, await readFile(`${directory}site/${image}.png`));

const entry = await readFile(`${directory}src/customer-entry.ts`, "utf8");
const version = entry.match(/export const CLIENT_RELEASE = "([^"]+)"/u)?.[1];
if (!version || !/^\d+\.\d+\.\d+-beta\.\d+$/u.test(version))
  throw new Error("The public client release is invalid");
await writeFile(
  `${output}/0.sh`,
  (await readFile(`${directory}site/0.sh`, "utf8")).replace("@CLIENT_RELEASE@", version),
);
const contractPath = `${directory}public/releases/${version}/openapi.json`;
const contract = JSON.parse(await readFile(contractPath, "utf8"));
execFileSync(
  "pnpm",
  [
    "exec",
    "redocly",
    "bundle",
    contractPath,
    "--output",
    `${output}/openapi.yaml`,
    "--ext",
    "yaml",
  ],
  { cwd: root, stdio: "inherit" },
);
execFileSync(
  "pnpm",
  [
    "exec",
    "redocly",
    "build-docs",
    `${output}/openapi.yaml`,
    "--output",
    `${output}/api.html`,
    "--title",
    "ohmyho.st API",
    "--disableGoogleFont",
  ],
  { cwd: root, stdio: "inherit" },
);
const renderedApi = await readFile(`${output}/api.html`, "utf8");
await writeFile(
  `${output}/api.html`,
  renderedApi.replace(
    "<body>",
    '<body><nav style="padding:16px 24px;background:#000;color:#F0F1F2;font:14px system-ui;display:flex;gap:24px;flex-wrap:wrap"><a style="color:inherit" href="/">ohmyho.st</a><a style="color:inherit" href="/docs">Docs</a><a style="color:inherit" href="/api/openapi.yaml">OpenAPI YAML</a><a style="color:inherit" href="/api/openapi.json">JSON</a><a style="color:inherit" href="/api.md">Markdown</a></nav>',
  ),
);
await writeFile(`${output}/openapi.json`, `${JSON.stringify(contract, null, 2)}\n`);
const api = [
  "# ohmyho.st API",
  "",
  `Published client release: ${version}.`,
  "",
  "Base URL: https://app.ohmyho.st",
  "",
  "- [OpenAPI YAML](https://ohmyho.st/api/openapi.yaml)",
  "- [OpenAPI JSON](https://ohmyho.st/api/openapi.json)",
  "- [CLI](https://ohmyho.st/docs/cli.md)",
  "- [MCP](https://ohmyho.st/docs/mcp.md)",
  "",
];
for (const [path, item] of Object.entries(contract.paths)) {
  for (const [method, operation] of Object.entries(item)) {
    if (!["get", "post", "put", "patch", "delete", "head", "options"].includes(method)) continue;
    api.push(
      `## ${method.toUpperCase()} ${path}`,
      "",
      operation.summary ?? operation.operationId ?? "",
      "",
      operation.description ?? "",
      "",
      `Operation: ${operation.operationId ?? method}`,
      "",
    );
  }
}
await writeFile(`${output}/api.md`, `${api.join("\n")}\n`);
