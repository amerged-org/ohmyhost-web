/* global process, console */
/**
 * The brand lives here, with the pages it styles: the approved homepage carries the design tokens
 * and the mark, and `site/fonts.css` the self-hosted faces. The platform's signed-in portal needs
 * the same look, so this writes one reviewed bundle into the platform checkout instead of the
 * platform reading this repository's files.
 *
 *   node scripts/prepare-brand-bundle.mjs <path-to-ohmyho>
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const destination = resolve(process.argv[2] ?? "");
if (!process.argv[2])
  throw new Error("usage: prepare-brand-bundle.mjs <path-to-ohmyho>");

const home = readFileSync(join(root, "site/home.html"), "utf8");
const css = /<style>([\s\S]*?)<\/style>/u.exec(home)?.[1];
const mark = /<div class="art">\s*(<svg[\s\S]*?<\/svg>)/u.exec(home)?.[1];
if (!css || !mark)
  throw new Error("The approved homepage no longer carries the design assets");

// The portal is served from another origin, so the faces are referenced absolutely.
const fonts = readFileSync(join(root, "site/fonts.css"), "utf8").replaceAll(
  "url(/fonts/",
  "url(https://ohmyho.st/fonts/",
);

const bundle = {
  source: "amerged-org/ohmyhost-web",
  generatedAt: new Date().toISOString(),
  homeSha256: createHash("sha256").update(home).digest("hex"),
  fonts,
  css,
  mark,
};
const target = join(destination, "brand/brand-bundle.json");
writeFileSync(target, `${JSON.stringify(bundle, null, 2)}\n`);
console.log(
  `brand-bundle.json: ${css.length} bytes of CSS, ${mark.length} bytes of mark`,
);
