import { PAGE_META, crumbLabel, type PageMeta } from "./page-meta.js";
import { attribute } from "./structured-data.js";

/** One 1200×630 social card, derived from the page's metadata so it cannot drift from the head. */
export interface OgCard {
  readonly slug: string;
  readonly path: string;
  readonly kicker: string;
  readonly headline: string;
  readonly subtitle: string;
}

const OMEGA = "M30 87 H14 L27 63 A31 31 0 1 1 73 63 L86 87 H70";

/** "/pricing/breakdown" → "pricing-breakdown". */
export function ogSlug(path: string): string {
  return path.slice(1).replaceAll("/", "-");
}

function kicker(path: string): string {
  if (path.startsWith("/vs/")) return "compare · list prices checked september 2026";
  if (path.startsWith("/for/")) return "deploy from your coding agent";
  if (path.startsWith("/from/")) return "bring your app · one prompt";
  if (path.startsWith("/blog")) return "from the build";
  if (path.startsWith("/pricing")) return "one balance · every project";
  if (path.startsWith("/dpa") || ["/terms", "/privacy", "/cookies"].includes(path))
    return "legal · amerged b.v.";
  return "hosting for vibe-coded apps";
}

function headline(meta: PageMeta): string {
  const first = meta.title.split(/ — |: | \| /u)[0] ?? meta.title;
  return first.length > 48 ? crumbLabel(meta) : first;
}

export function ogCards(): OgCard[] {
  return Object.entries(PAGE_META)
    .filter(([path]) => path !== "/login")
    .map(([path, meta]) => ({
      slug: ogSlug(path),
      path,
      kicker: kicker(path),
      headline: headline(meta),
      subtitle: meta.description,
    }));
}

/**
 * The card as a self-contained HTML document. `fontsBase` points at the self-hosted TTFs; the
 * default keeps the markup stable for hashing, the renderer passes a file URL.
 */
export function ogCardHtml(card: OgCard, fontsBase = "/fonts"): string {
  const size = card.headline.length > 34 ? 66 : card.headline.length > 22 ? 84 : 104;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
@font-face{font-family:'Space Grotesk';font-weight:500;src:url(${fontsBase}/3e699ead1876244f.ttf) format('truetype')}
@font-face{font-family:'Space Grotesk';font-weight:700;src:url(${fontsBase}/3e756954468ff1cb.ttf) format('truetype')}
@font-face{font-family:'JetBrains Mono';font-weight:400;src:url(${fontsBase}/44ce4a84f20d60f2.ttf) format('truetype')}
html,body{margin:0;background:#000}
.og{width:1200px;height:630px;position:relative;overflow:hidden;background:#000;color:#F0F1F2;font-family:'Space Grotesk',sans-serif;-webkit-font-smoothing:antialiased}
.glow{position:absolute;left:280px;top:-200px;width:900px;height:900px;border-radius:50%;background:radial-gradient(circle,rgba(240,241,242,.10),transparent 68%)}
.k{position:absolute;left:80px;top:74px;font-family:'JetBrains Mono',monospace;font-size:22px;color:#83878D;letter-spacing:.08em}
.h{position:absolute;left:80px;right:80px;top:150px;font-size:${size}px;font-weight:700;letter-spacing:-.045em;line-height:1;background:linear-gradient(180deg,#F0F1F2 42%,#83878D 100%);-webkit-background-clip:text;color:transparent;padding-bottom:.1em}
.s{position:absolute;left:80px;right:80px;top:392px;font-size:28px;line-height:1.35;color:#83878D;max-height:118px;overflow:hidden}
.wm{position:absolute;right:80px;bottom:64px;font-family:'JetBrains Mono',monospace;font-size:28px;letter-spacing:-.02em;color:#F0F1F2}
.wm i{font-style:normal;color:#3E4247}
.pill{position:absolute;left:80px;bottom:64px;display:inline-flex;align-items:center;gap:12px;border:1px solid #26282C;border-radius:999px;padding:14px 24px;font-family:'JetBrains Mono',monospace;font-size:22px;color:#F0F1F2}
.pill s{text-decoration:none;color:#3E4247}
.mark{position:absolute;right:80px;top:64px;width:56px;height:56px}
</style></head><body><div class="og"><div class="glow"></div><svg class="mark" viewBox="0 0 100 100" aria-hidden="true"><path d="${OMEGA}" fill="none" stroke="#F0F1F2" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="k">${attribute(card.kicker)}</div><div class="h">${attribute(card.headline)}</div><div class="s">${attribute(card.subtitle)}</div><div class="pill"><s>ohmyho.st</s>${attribute(card.path)}</div><div class="wm">ohmyho<i>.st</i></div></div></body></html>`;
}
