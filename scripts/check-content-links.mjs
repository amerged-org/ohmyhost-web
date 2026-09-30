/** Read-only editorial link check: node scripts/check-content-links.mjs. */
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
/* global URL */

registerHooks({
  resolve(specifier, context, next) {
    if (
      specifier.startsWith(".") &&
      specifier.endsWith(".js") &&
      context.parentURL?.endsWith(".ts")
    )
      return next(`${specifier.slice(0, -3)}.ts`, context);
    return next(specifier, context);
  },
});

const root = fileURLToPath(new URL("../", import.meta.url));
const { auditContentLinks } = await import("../src/content/links.ts");
const { pageFolders, readPage } = await import("../src/content/tree.ts");
const { customerDocument } = await import("../src/customer-entry.ts");
const { BRAND_ASSET_FILES } = await import("../src/brand-assets.ts");
const { CONTENT_PAGE_LIST } = await import("../src/generated-content.ts");
const generatedContentPaths = new Set(
  CONTENT_PAGE_LIST.map((page) => page.path),
);

// These routes are served by the Worker or platform rather than customerDocument.
const workerTargets = new Set([
  "/",
  "/brand",
  "/api/openapi.json",
  "/api/openapi.yaml",
  "/robots.txt",
  "/sitemap.xml",
  "/0.sh",
]);
const brandTargets = new Set(
  BRAND_ASSET_FILES.map((file) => `/brand/assets/${file}`),
);
const report = auditContentLinks(
  pageFolders(join(root, "content")).map(({ directory, url }) =>
    readPage(directory, url),
  ),
  (path) =>
    workerTargets.has(path) ||
    brandTargets.has(path) ||
    (path.startsWith("/images/") && existsSync(join(root, "public", path))) ||
    (!generatedContentPaths.has(path.replace(/\.md$/u, "")) &&
      customerDocument(path) !== null),
);

for (const [article, sources] of report.incoming)
  process.stdout.write(
    `${article}: ${sources.length ? sources.join(", ") : "no incoming editorial link"}\n`,
  );
for (const { source, href, target, reason } of report.brokenLinks)
  process.stderr.write(
    `${source}: ${href} points to ${reason} target ${target}\n`,
  );
if (report.brokenLinks.length || report.unlinkedArticles.length)
  process.exitCode = 1;
