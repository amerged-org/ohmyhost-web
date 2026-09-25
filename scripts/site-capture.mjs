#!/usr/bin/env node
/* global URL, navigator, Buffer, document */
/**
 * Dated screenshot evidence for the public site and the competitor pricing pages it quotes.
 *
 *   node scripts/site-capture.mjs evidence --label before [--out <dir>] [--base <origin>]
 *   node scripts/site-capture.mjs og [--only <slug>]        (after pnpm build)
 *   node scripts/site-capture.mjs figures                   (article illustrations)
 *
 * Playwright is resolved from the npx cache and pinned to one version; nothing is installed.
 * Screenshots are evidence only (plan/evidence/P38) and are never served by the site.
 */
import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import process from "node:process";
import { pathToFileURL } from "node:url";

export const PLAYWRIGHT_VERSION = "1.62.1";
export const VIEWPORT = { width: 1440, height: 900 };
export const DEVICE_SCALE_FACTOR = 2;
const SIZE_LIMIT_BYTES = 25 * 1024 * 1024;
/** Pricing tables sit near the top; a crop never needs more than this many CSS pixels. */
const CROP_HEIGHT = 2400;

const COMPETITORS = [
  ["https://vercel.com/pricing", "vercel.com"],
  ["https://supabase.com/pricing", "supabase.com"],
  ["https://resend.com/pricing", "resend.com"],
  ["https://railway.com/pricing", "railway.com"],
  ["https://render.com/pricing", "render.com"],
  ["https://fly.io/pricing", "fly.io"],
];

export const OWN_PATHS = [
  "/",
  "/pricing",
  "/pricing/breakdown",
  "/vs/vercel",
  "/vs/supabase",
  "/vs/resend",
  "/vs/railway",
  "/for/claude-code",
  "/for/cursor",
  "/for/codex",
  "/from/lovable",
  "/from/bolt",
  "/about",
  "/philosophy",
  "/open-source",
  "/blog",
];

const CONSENT_SELECTORS =
  '[id*="cookie" i],[class*="cookie" i],[id*="consent" i],[class*="consent" i],[id*="onetrust" i]';

/** Every page the run captures: competitors get a pricing-table crop, own pages a full page only. */
export function evidenceTargets(
  base = "https://ohmyho.st",
  { competitors = true } = {},
) {
  const origin = base.replace(/\/$/u, "");
  return [
    ...(competitors
      ? COMPETITORS.map(([url, host]) => ({
          url,
          host,
          slug: "pricing",
          crop: true,
        }))
      : []),
    ...OWN_PATHS.map((path) => ({
      url: `${origin}${path}`,
      host: new URL(origin).host,
      slug: path === "/" ? "home" : path.slice(1).replaceAll("/", "-"),
      crop: false,
    })),
  ];
}

export function evidenceFileName(label, target, kind, extension) {
  const safe = (value) =>
    value.replaceAll(/[^a-z0-9.-]+/giu, "-").toLowerCase();
  return `${safe(label)}--${safe(target.host)}--${safe(target.slug)}--${VIEWPORT.width}x${VIEWPORT.height}@${DEVICE_SCALE_FACTOR}--${kind}.${extension}`;
}

/** The Playwright package directory from the npx cache, pinned to one version. */
export function resolvePlaywright({
  home = homedir(),
  version = PLAYWRIGHT_VERSION,
  override = process.env.PLAYWRIGHT_MODULE_DIR,
} = {}) {
  const candidates = [];
  const npx = join(home, ".npm", "_npx");
  if (override) candidates.push(override);
  else if (existsSync(npx))
    for (const entry of readdirSync(npx))
      candidates.push(join(npx, entry, "node_modules", "playwright"));
  for (const directory of candidates) {
    const manifest = join(directory, "package.json");
    if (!existsSync(manifest)) continue;
    if (JSON.parse(readFileSync(manifest, "utf8")).version === version)
      return directory;
  }
  throw new Error(
    `Playwright ${version} not found in the npx cache; run: npx -y playwright@${version} --version`,
  );
}

export function manifestEntry(bytes, meta) {
  return {
    ...meta,
    bytes: bytes.length,
    sha256: createHash("sha256").update(bytes).digest("hex"),
  };
}

async function dismissConsent(page) {
  try {
    const button = page.getByRole("button", {
      name: /^(accept|accept all|agree|got it|ok)$/iu,
    });
    if ((await button.count()) > 0) {
      const name = await button.first().textContent();
      await button.first().click({ timeout: 1500 });
      return `clicked:${(name ?? "").trim()}`;
    }
  } catch {
    // A consent control that cannot be clicked is hidden by style instead.
  }
  return "none";
}

export async function captureEvidence({
  label,
  out,
  base = "https://ohmyho.st",
  competitors = base === "https://ohmyho.st",
  playwrightDir = resolvePlaywright(),
  log = (line) => process.stderr.write(`${line}\n`),
}) {
  const { chromium } = await import(
    pathToFileURL(join(playwrightDir, "index.mjs")).href
  );
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DEVICE_SCALE_FACTOR,
    locale: "en-US",
    timezoneId: "America/New_York",
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  mkdirSync(out, { recursive: true });
  const manifest = {
    capturedAt: new Date().toISOString(),
    label,
    tool: {
      playwright: JSON.parse(
        readFileSync(join(playwrightDir, "package.json"), "utf8"),
      ).version,
      modulePath: playwrightDir,
      chromium: browser.version(),
      userAgent: await page.evaluate(() => navigator.userAgent),
    },
    context: {
      viewport: VIEWPORT,
      deviceScaleFactor: DEVICE_SCALE_FACTOR,
      locale: "en-US",
      timezoneId: "America/New_York",
    },
    entries: [],
  };
  let total = 0;
  const save = (file, bytes, meta) => {
    writeFileSync(join(out, file), bytes);
    total += bytes.length;
    manifest.entries.push(manifestEntry(bytes, { file, ...meta }));
    log(`${file} (${bytes.length} bytes)`);
  };
  for (const target of evidenceTargets(base, { competitors })) {
    let response = null;
    try {
      response = await page.goto(target.url, {
        waitUntil: "load",
        timeout: 45000,
      });
      await page.waitForTimeout(2000);
    } catch (error) {
      log(
        `${target.url}: ${error instanceof Error ? error.message : String(error)}`,
      );
      manifest.entries.push({
        url: target.url,
        error: error instanceof Error ? error.message : String(error),
        capturedAt: new Date().toISOString(),
      });
      continue;
    }
    const meta = {
      url: target.url,
      finalUrl: page.url(),
      httpStatus: response?.status() ?? null,
      capturedAt: new Date().toISOString(),
    };
    const consent = target.crop ? await dismissConsent(page) : "none";
    save(
      evidenceFileName(label, target, "full", "jpg"),
      await page.screenshot({
        fullPage: true,
        type: "jpeg",
        quality: 80,
        scale: "css",
      }),
      { ...meta, kind: "full", consent },
    );
    if (!target.crop) continue;
    await page.addStyleTag({
      content: `${CONSENT_SELECTORS}{display:none !important}`,
    });
    let selector = "body";
    for (const candidate of ["main table", "main"])
      if ((await page.locator(candidate).first().count()) > 0) {
        selector = candidate;
        break;
      }
    const box = await page.locator(selector).first().boundingBox();
    if (!box) continue;
    save(
      evidenceFileName(label, target, "table", "png"),
      await page.screenshot({
        type: "png",
        fullPage: true,
        clip: {
          x: box.x,
          y: box.y,
          width: box.width,
          height: Math.min(box.height, CROP_HEIGHT),
        },
      }),
      {
        ...meta,
        kind: "crop",
        selector,
        consent,
        hiddenSelectors: [CONSENT_SELECTORS],
      },
    );
  }
  await browser.close();
  writeFileSync(
    join(out, `manifest-${label}.json`),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  log(`total ${total} bytes in ${out}`);
  if (total > SIZE_LIMIT_BYTES)
    throw new Error(`Evidence run exceeds ${SIZE_LIMIT_BYTES} bytes`);
  return manifest;
}

/** PNG dimensions from the IHDR chunk. */
export function pngSize(bytes) {
  const header = Buffer.from(bytes.subarray(0, 8)).toString("hex");
  if (header !== "89504e470d0a1a0a") throw new Error("Not a PNG");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

/** Renders every social card from the compiled page metadata into public/og with a template-hash manifest. */
export async function renderSocialCards({
  only,
  root,
  playwrightDir = resolvePlaywright(),
  log = (line) => process.stderr.write(`${line}\n`),
}) {
  const site = root;
  const compiled = join(site, "dist", "og-pages.js");
  if (!existsSync(compiled))
    throw new Error("Build the site first: pnpm build");
  const { ogCards, ogCardHtml } = await import(pathToFileURL(compiled).href);
  const { chromium } = await import(
    pathToFileURL(join(playwrightDir, "index.mjs")).href
  );
  const out = join(site, "public", "og");
  mkdirSync(out, { recursive: true });
  const manifestPath = join(out, "manifest.json");
  const manifest = existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8"))
    : {};
  const fonts = pathToFileURL(join(site, "public", "fonts")).href;
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1,
  });
  for (const card of ogCards()) {
    if (only && card.slug !== only) continue;
    await page.setContent(ogCardHtml(card, fonts), { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const bytes = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    });
    const { width, height } = pngSize(bytes);
    if (width !== 1200 || height !== 630)
      throw new Error(`${card.slug}: ${width}×${height}`);
    writeFileSync(join(out, `${card.slug}.png`), bytes);
    manifest[card.slug] = {
      templateSha256: createHash("sha256")
        .update(ogCardHtml(card))
        .digest("hex"),
      renderedAt: new Date().toISOString(),
    };
    log(`og/${card.slug}.png (${bytes.length} bytes)`);
  }
  await browser.close();
  const sorted = Object.fromEntries(
    Object.keys(manifest)
      .sort()
      .map((slug) => [slug, manifest[slug]]),
  );
  writeFileSync(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`);
  return sorted;
}

/** Article illustrations are drawn at one size; the page declares it on every `<img>`. */
export const FIGURE_SIZE = { width: 1600, height: 900 };
const FIGURE_FONTS = [
  ["Space Grotesk", 500, "3e699ead1876244f.ttf"],
  ["Space Grotesk", 700, "3e756954468ff1cb.ttf"],
  ["JetBrains Mono", 400, "44ce4a84f20d60f2.ttf"],
  ["JetBrains Mono", 500, "3386a05f6ece969e.ttf"],
];

/** Every illustration source (a `figures/<name>.svg` below content/), keyed by its file name. */
export function figureSources(contentRoot) {
  const sources = new Map();
  for (const entry of readdirSync(contentRoot, { recursive: true }).sort()) {
    const match = String(entry).match(/(?:^|\/)figures\/([a-z0-9-]+)\.svg$/u);
    if (!match) continue;
    if (sources.has(match[1]))
      throw new Error(`Two illustrations are named ${match[1]}`);
    sources.set(match[1], join(contentRoot, String(entry)));
  }
  return sources;
}

/** Renders every article illustration into public/images with a source-hash manifest. */
export async function renderFigures({
  root,
  playwrightDir = resolvePlaywright(),
  log = (line) => process.stderr.write(`${line}\n`),
}) {
  const { chromium } = await import(
    pathToFileURL(join(playwrightDir, "index.mjs")).href
  );
  const out = join(root, "public", "images");
  mkdirSync(out, { recursive: true });
  // A page loaded with setContent may not read file:// fonts, so the faces travel inline.
  const faces = FIGURE_FONTS.map(
    ([family, weight, file]) =>
      `@font-face{font-family:'${family}';font-weight:${weight};src:url(data:font/ttf;base64,${readFileSync(join(root, "public", "fonts", file)).toString("base64")}) format('truetype')}`,
  ).join("");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: FIGURE_SIZE,
    deviceScaleFactor: 1,
  });
  const manifest = {};
  for (const [name, source] of figureSources(join(root, "content"))) {
    const svg = readFileSync(source, "utf8");
    await page.setContent(
      `<!doctype html><html><head><meta charset="utf-8"><style>${faces}html,body{margin:0;background:#000}svg{display:block}</style></head><body>${svg}</body></html>`,
      { waitUntil: "load" },
    );
    const missing = await page.evaluate(async () => {
      await Promise.allSettled([...document.fonts].map((face) => face.load()));
      return [...document.fonts]
        .filter((face) => face.status !== "loaded")
        .map((face) => `${face.family} ${face.weight}`);
    });
    if (missing.length)
      throw new Error(`${name}: fonts did not load: ${missing.join(", ")}`);
    const bytes = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, ...FIGURE_SIZE },
    });
    writeFileSync(join(out, `${name}.png`), bytes);
    manifest[name] = {
      sourceSha256: createHash("sha256").update(svg).digest("hex"),
      renderedAt: new Date().toISOString(),
    };
    log(`images/${name}.png (${bytes.length} bytes)`);
  }
  await browser.close();
  writeFileSync(
    join(out, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  return manifest;
}

export function parseArguments(argv) {
  const [command, ...rest] = argv;
  const options = {};
  for (let index = 0; index < rest.length; index += 2) {
    const flag = rest[index];
    const value = rest[index + 1];
    if (!flag?.startsWith("--") || value === undefined)
      throw new Error(`Invalid option: ${flag}`);
    options[flag.slice(2)] = value;
  }
  return { command, options };
}

export async function main(argv, { cwd = process.cwd() } = {}) {
  const { command, options } = parseArguments(argv);
  if (!["evidence", "og", "figures"].includes(command))
    throw new Error(`Unknown command: ${command ?? "(none)"}`);
  const playwrightDir = options.playwright
    ? resolvePlaywright({ override: options.playwright })
    : resolvePlaywright();
  if (command === "figures")
    return renderFigures({ root: resolve(cwd), playwrightDir });
  if (command === "og")
    return renderSocialCards({
      only: options.only,
      root: resolve(cwd),
      playwrightDir,
    });
  if (!options.label) throw new Error("--label is required");
  const date = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const out = resolve(
    cwd,
    options.out ?? `plan/evidence/P38/site-evidence-${date}`,
  );
  return captureEvidence({
    label: options.label,
    out,
    base: options.base,
    playwrightDir,
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exit(1);
  });
