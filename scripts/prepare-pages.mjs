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
  home: "c6056fe92026043e3a6b982fc0220612b92be91c17cdcc1ea26699b3516894bf",
  brand: "d2a49d8a4b9d979c72958eebb2f2db4b7637405ccacd27100ce77e405a01bebe",
};
for (const [name, digest] of Object.entries(templates)) {
  const original = await readFile(`${directory}site/${name}.html`, "utf8");
  if (createHash("sha256").update(original).digest("hex") !== digest)
    throw new Error(`The supplied ${name} template was changed`);
  let html = original;
  if (name === "home") {
    html = html
      .replaceAll('<a href="#">Docs</a>', '<a href="/docs">Docs</a>')
      .replaceAll('<a class="btn g" href="#">Docs</a>', '<a class="btn g" href="/docs">Docs</a>')
      .replaceAll('href="#">Start free</a>', 'href="/login">Start free</a>')
      .replaceAll('href="#">Get credits</a>', 'href="/login">Get credits</a>')
      .replace('<a href="#">MCP server</a>', '<a href="/docs/mcp">MCP server</a>')
      .replace('<a href="#">CLI</a>', '<a href="/docs/cli">CLI</a>')
      .replace('<a href="#">Status</a>', '<a href="/docs/usage">Status</a>')
      .replace(
        "<h4>developers</h4>",
        '<h4>developers</h4>\n      <a href="/api">API reference</a>\n      <a href="/brand">Brand</a>\n      <a href="/llms.txt">For agents</a>',
      );
    html = html.replace(
      '<div class="slid up">',
      '<p class="note">Database compute: Free 0.25 CU / 1 GB, sleep after 1 idle minute. Paid 0.5 CU / 2 GB, sleep after 2 idle minutes. Storage and retained history are metered separately. Ask your agent for current settings and measured credits.</p>\n  <div class="slid up">',
    );
    const tools = original.match(/<div class="cells logos stag">[\s\S]*?<\/div>/u)?.[0];
    if (!tools) throw new Error("The supplied automation tools are missing");
    html = html.replace(
      "<footer>\n",
      `<footer>\n  <p class="free">Export to Google Drive, Amazon S3 or Cloudflare R2<br><b>via your favorite automation tool</b></p>\n  ${tools}\n  <div style="height:48px" aria-hidden="true"></div>\n`,
    );
  }
  if (name === "home")
    html = html
      .replace("cmd='curl omh.st/0.sh | bash'", "cmd='curl -fsSL https://omh.st/0.sh | bash'")
      .replace(
        "copy('curl omh.st/0.sh | bash', b)",
        "copy('curl -fsSL https://omh.st/0.sh | bash', b)",
      );
  await writeFile(`${output}/${name}.html`, html);
  await writeFile(
    `${output}/${name === "home" ? "index" : name}.md`,
    `${markdown.turndown(html)}\n`,
  );
}

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
