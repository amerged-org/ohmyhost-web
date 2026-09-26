import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

import { expect, it } from "vitest";

import { OG_IMAGES } from "../src/generated-site-frame.js";
import { ogCardHtml, ogCards, ogSlug } from "../src/og-pages.js";
import { PAGE_META, pageMeta } from "../src/page-meta.js";
import { ogImagePath } from "../src/structured-data.js";
import worker from "../src/worker-main.js";

const publicDir = new URL("../public/", import.meta.url);

it("derives one social card per page and keeps the rendered PNGs in step with the template", async () => {
  const cards = ogCards();
  expect(new Set(cards.map((card) => card.slug)).size).toBe(cards.length);
  expect(cards.map((card) => card.path).sort()).toEqual(
    ["/", ...Object.keys(PAGE_META).filter((path) => path !== "/login")].sort(),
  );
  // The homepage card carries the social copy as text, so a shared link never shows a bare mark.
  const home = cards.find((card) => card.path === "/");
  if (!home) throw new Error("homepage card missing");
  expect(home.slug).toBe("home");
  expect(ogCardHtml(home)).toContain(
    "Move from Vercel, Supabase and Resend to one balance",
  );
  expect(ogSlug("/pricing/breakdown")).toBe("pricing-breakdown");
  const vercel = cards.find((card) => card.path === "/vs/vercel");
  expect(vercel?.headline).toBe(
    pageMeta("/vs/vercel").socialTitle?.replace(/^ohmyho\.st — /u, ""),
  );
  expect(vercel?.kicker).toContain("compare");
  if (!vercel) throw new Error("/vs/vercel card missing");
  const html = ogCardHtml(vercel);
  expect(html).toContain("url(/fonts/3e756954468ff1cb.ttf)");
  expect(html).toContain('<div class="pill"><s>ohmyho.st</s>/vs/vercel</div>');
  const manifestFile = new URL("og/manifest.json", publicDir);
  const manifest = existsSync(manifestFile)
    ? (JSON.parse(await readFile(manifestFile, "utf8")) as Record<
        string,
        { templateSha256: string }
      >)
    : {};
  expect(Object.keys(manifest).sort()).toEqual([...OG_IMAGES].sort());
  for (const card of cards) {
    const rendered = manifest[card.slug];
    const expected = createHash("sha256")
      .update(ogCardHtml(card))
      .digest("hex");
    if (rendered) {
      expect(
        rendered.templateSha256,
        `${card.slug} is stale: rerun node scripts/site-capture.mjs og`,
      ).toBe(expected);
      const png = await readFile(new URL(`og/${card.slug}.png`, publicDir));
      expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1200, 630]);
      // The homepage keeps its approved template, so its card is referenced from there.
      if (card.path !== "/")
        expect(ogImagePath(card.path, pageMeta(card.path))).toBe(
          `/og/${card.slug}.png`,
        );
    } else if (card.path !== "/")
      expect(ogImagePath(card.path, pageMeta(card.path))).toBe(
        PAGE_META[card.path]?.ogImage ?? "/og.png",
      );
  }
  if (OG_IMAGES.length) {
    const assets = {
      async fetch(request: Request) {
        const path = new URL(request.url).pathname;
        const file = new URL(`.${path}`, publicDir);
        return /^\/og\/[a-z0-9-]+\.png$/u.test(path) && existsSync(file)
          ? new Response(new Uint8Array(await readFile(file)))
          : new Response(null, { status: 404 });
      },
    };
    const first = OG_IMAGES[0] ?? "";
    const response = await worker.fetch(
      new Request(`https://ohmyho.st/og/${first}.png`),
      {
        ASSETS: assets,
      },
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe("image/png");
    expect(response.headers.get("cache-control")).toBe("public, max-age=86400");
    expect(
      (
        await worker.fetch(
          new Request("https://ohmyho.st/og/../pages/home.html"),
          {
            ASSETS: assets,
          },
        )
      ).status,
    ).toBe(404);
    expect(
      (
        await worker.fetch(new Request("https://ohmyho.st/og/missing.png"), {
          ASSETS: assets,
        })
      ).status,
    ).toBe(404);
  }
});
