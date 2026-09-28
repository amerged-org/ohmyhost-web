import { readdir, readFile } from "node:fs/promises";

import { expect, it } from "vitest";

import { BRAND_ASSET_FILES } from "../src/brand-assets.js";
import worker from "../src/worker-main.js";

const assets = new URL("../brand/assets/", import.meta.url);
const FORMATS: Record<string, [number, number]> = {
  og: [1200, 630],
  "x-card": [1200, 675],
  linkedin: [1200, 627],
  square: [1080, 1080],
  github: [1280, 640],
  "x-header": [1500, 500],
};

async function pngSize(file: string): Promise<[number, number]> {
  const bytes = await readFile(new URL(file, assets));
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
}

it("offers every brand file, at its stated size, on the brand page and from the site", async () => {
  expect([...(await readdir(assets))].sort()).toEqual(
    [...BRAND_ASSET_FILES].sort(),
  );
  for (const [format, size] of Object.entries(FORMATS))
    for (const theme of ["dark", "light"])
      expect(await pngSize(`social-${format}-${theme}.png`)).toEqual(size);
  expect(await pngSize("logo-on-white.png")).toEqual([1024, 1024]);
  expect(await pngSize("logo-on-black.png")).toEqual([1024, 1024]);
  expect(await pngSize("wordmark-on-white.png")).toEqual([1600, 400]);
  expect(await pngSize("icon-dark-512.png")).toEqual([512, 512]);
  const page = await (
    await worker.fetch(new Request("https://ohmyho.st/brand"), {
      ASSETS: {
        fetch: async (request: Request) => {
          const path = new URL(request.url).pathname;
          return new Response(
            new Uint8Array(
              await readFile(new URL(`../public${path}`, import.meta.url)),
            ),
          );
        },
      },
    } as never)
  ).text();
  for (const file of BRAND_ASSET_FILES.filter(
    (name) =>
      !/^(?:founder|og|omega-.*png)/u.test(name) || name === "omega-light.png",
  ))
    if (!file.startsWith("apple-") && !file.startsWith("favicon"))
      expect(page, file).toContain(`/brand/assets/${file}`);
});
