#!/usr/bin/env node
/**
 * Renders the downloadable brand kit into brand/assets: app icons, logos on white or black,
 * wordmarks and the social formats. Fonts are the site's own, so every file is reproducible.
 *
 *   node scripts/brand-assets.mjs
 *
 * Playwright is resolved from the npx cache like scripts/site-capture.mjs.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import process from "node:process";
import { fileURLToPath, pathToFileURL } from "node:url";

import { resolvePlaywright, templatePage } from "./site-capture.mjs";

const OMEGA = "M30 87 H14 L27 63 A31 31 0 1 1 73 63 L86 87 H70";
export const THEMES = {
  dark: { bg: "#000000", fg: "#F0F1F2", muted: "#83878D", word: "black" },
  light: { bg: "#FFFFFF", fg: "#09090B", muted: "#71717A", word: "white" },
};
/** Social formats: file stem → [width, height]. Each is rendered on black and on white. */
export const SOCIAL_FORMATS = {
  og: [1200, 630],
  "x-card": [1200, 675],
  linkedin: [1200, 627],
  square: [1080, 1080],
  github: [1280, 640],
  "x-header": [1500, 500],
};
export const TAGLINE = "All your projects. One balance.";

const FONTS = [
  ["Space Grotesk", 700, "3e756954468ff1cb.ttf"],
  ["JetBrains Mono", 400, "44ce4a84f20d60f2.ttf"],
]
  .map(
    ([family, weight, file]) =>
      `@font-face{font-family:'${family}';font-weight:${weight};src:url(/fonts/${file}) format('truetype')}`,
  )
  .join("");

const mark = (color, size, width = 12.5) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"><path d="${OMEGA}"/></svg>`;
const wordmark = (theme, size) =>
  `<span style="font:400 ${size}px 'JetBrains Mono',monospace;letter-spacing:-.02em;color:${theme.fg}">ohmyho<span style="color:${theme.muted}">.st</span></span>`;
const page = (body, background) =>
  `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS}html,body{margin:0;background:${background}}*{box-sizing:border-box}</style></head><body>${body}</body></html>`;
const frame = (width, height, theme, content, extra = "") =>
  `<div style="width:${width}px;height:${height}px;display:flex;align-items:center;justify-content:center;${extra}background:${theme.bg}">${content}</div>`;

/** The vector icons: the mark on a rounded black or white tile. */
export function iconSvg(themeName) {
  const theme = THEMES[themeName];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="${theme.bg}"/><path d="M30 86 H15 L27 63 A31 31 0 1 1 73 63 L85 86 H70" fill="none" stroke="${theme.fg}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" transform="translate(12 10) scale(.76)"/></svg>\n`;
}

function socialHtml(theme, width, height) {
  const unit = Math.min(width / 1200, height / 630);
  return page(
    frame(
      width,
      height,
      theme,
      `<div style="display:flex;flex-direction:column;align-items:center;gap:${28 * unit}px;color:${theme.fg};font-family:'Space Grotesk',sans-serif;text-align:center">${mark(theme.fg, 132 * unit, 9)}${wordmark(theme, 84 * unit)}<div style="font-weight:700;font-size:${44 * unit}px;letter-spacing:-.03em;color:${theme.muted}">${TAGLINE}</div></div>`,
    ),
    theme.bg,
  );
}

/** Every rendered PNG: file name, size and the page that draws it. */
export function pngSpecs() {
  const specs = [];
  for (const [name, theme] of Object.entries(THEMES)) {
    const other = name === "dark" ? THEMES.light : THEMES.dark;
    const lockup = (t) =>
      `<div style="display:flex;align-items:center;gap:48px">${mark(t.fg, 200)}${wordmark(t, 176)}</div>`;
    specs.push(
      {
        file: `logo-on-${theme.word}.png`,
        width: 1024,
        height: 1024,
        html: page(frame(1024, 1024, theme, mark(theme.fg, 640)), theme.bg),
      },
      {
        file: `icon-${name}-512.png`,
        width: 512,
        height: 512,
        transparent: true,
        html: page(
          `<div style="width:512px;height:512px;border-radius:112px;overflow:hidden;background:${theme.bg};position:relative"><div style="position:absolute;left:106px;top:92px">${mark(theme.fg, 300, 15)}</div></div>`,
          "transparent",
        ),
      },
      {
        file: `wordmark-on-${theme.word}.png`,
        width: 1600,
        height: 400,
        html: page(frame(1600, 400, theme, lockup(theme)), theme.bg),
      },
      {
        file: `wordmark-${other.word === "white" ? "black" : "white"}-transparent.png`,
        width: 1600,
        height: 400,
        transparent: true,
        html: page(
          `<div style="width:1600px;height:400px;display:flex;align-items:center;justify-content:center">${lockup(other)}</div>`,
          "transparent",
        ),
      },
    );
    for (const [format, [width, height]] of Object.entries(SOCIAL_FORMATS))
      specs.push({
        file: `social-${format}-${name}.png`,
        width,
        height,
        html: socialHtml(theme, width, height),
      });
  }
  return specs;
}

export async function renderBrandAssets({
  root = resolve(dirname(fileURLToPath(import.meta.url)), ".."),
  playwrightDir = resolvePlaywright(),
  log = (line) => process.stderr.write(`${line}\n`),
} = {}) {
  const out = join(root, "brand", "assets");
  mkdirSync(out, { recursive: true });
  for (const name of Object.keys(THEMES))
    writeFileSync(join(out, `icon-${name}.svg`), iconSvg(name));
  const { chromium } = await import(
    pathToFileURL(join(playwrightDir, "index.mjs")).href
  );
  const browser = await chromium.launch({ headless: true });
  try {
    for (const spec of pngSpecs()) {
      const show = await templatePage(browser, root, {
        width: spec.width,
        height: spec.height,
      });
      const shown = await show(spec.html);
      const bytes = await shown.screenshot({
        type: "png",
        omitBackground: spec.transparent === true,
        clip: { x: 0, y: 0, width: spec.width, height: spec.height },
      });
      writeFileSync(join(out, spec.file), bytes);
      log(`${spec.file} (${bytes.length} bytes)`);
    }
  } finally {
    await browser.close();
  }
}

if (
  process.argv[1] &&
  pathToFileURL(resolve(process.argv[1])).href === import.meta.url
)
  await renderBrandAssets();
