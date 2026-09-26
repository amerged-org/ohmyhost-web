import { createHash } from "node:crypto";
import { existsSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";

import { expect, it } from "vitest";

import { CONTENT_PAGE_LIST } from "../src/pages/index.js";
import worker from "../src/worker-main.js";

const contentDir = new URL("../content/", import.meta.url);
const imagesDir = new URL("../public/images/", import.meta.url);

it("serves every article illustration as a PNG rendered from its current SVG source", async () => {
  const sources = new Map(
    readdirSync(contentDir, { recursive: true })
      .map(String)
      .flatMap((entry) => {
        const name = entry.match(/(?:^|\/)figures\/([a-z0-9-]+)\.svg$/u)?.[1];
        return name ? [[name, new URL(entry, contentDir)] as const] : [];
      }),
  );
  const manifestFile = new URL("manifest.json", imagesDir);
  const manifest = existsSync(manifestFile)
    ? (JSON.parse(await readFile(manifestFile, "utf8")) as Record<
        string,
        { sourceSha256: string }
      >)
    : {};
  expect(Object.keys(manifest).sort()).toEqual([...sources.keys()].sort());
  for (const [name, source] of sources) {
    expect(
      manifest[name]?.sourceSha256,
      `${name} is stale: rerun node scripts/site-capture.mjs figures`,
    ).toBe(
      createHash("sha256")
        .update(await readFile(source, "utf8"))
        .digest("hex"),
    );
    const png = await readFile(new URL(`${name}.png`, imagesDir));
    expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([2400, 1350]);
  }

  // Every illustration a page shows exists, says what it shows and reserves its space.
  for (const page of CONTENT_PAGE_LIST)
    for (const [tag, name] of page.markdown.matchAll(
      /<img src="\/images\/([^"]+)\.png"[^>]*>/gu,
    )) {
      expect(sources.has(name ?? ""), `${page.path} shows ${name}`).toBe(true);
      expect(tag, `${page.path} ${name} alt`).toMatch(/ alt="[^"]{40,}"/u);
      expect(tag, `${page.path} ${name} size`).toContain(
        'width="1200" height="675"',
      );
    }

  const assets = {
    async fetch(request: Request) {
      const path = new URL(request.url).pathname;
      const file = new URL(`..${path}`, imagesDir);
      return /^\/images\/[a-z0-9-]+\.png$/u.test(path) && existsSync(file)
        ? new Response(new Uint8Array(await readFile(file)))
        : new Response(null, { status: 404 });
    },
  };
  const [first] = sources.keys();
  const response = await worker.fetch(
    new Request(`https://ohmyho.st/images/${first}.png`),
    { ASSETS: assets },
  );
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe("image/png");
  expect(response.headers.get("cache-control")).toBe("public, max-age=86400");
  for (const path of [
    "/images/missing.png",
    "/images/../pages/home.html",
    "/images/manifest.json",
  ])
    expect(
      (
        await worker.fetch(new Request(`https://ohmyho.st${path}`), {
          ASSETS: assets,
        })
      ).status,
      path,
    ).toBe(404);
});
