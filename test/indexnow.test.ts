import { expect, it } from "vitest";

import {
  buildPayload,
  main,
  selectUrls,
  sitemapUrls,
} from "../scripts/indexnow-submit.mjs";
import { INDEXNOW_KEYS } from "../src/indexnow.js";
import worker from "../src/worker-main.js";

const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url><loc>https://ohmyho.st/</loc><lastmod>2026-10-22</lastmod></url>
<url><loc>https://ohmyho.st/pricing</loc><lastmod>2026-10-22</lastmod></url>
<url><loc>https://ohmyho.st/about</loc><lastmod>2026-09-20T08:00:00.000Z</lastmod></url>
<url><loc>https://elsewhere.example/page</loc><lastmod>2026-10-22</lastmod></url>
</urlset>`;

const KEY = INDEXNOW_KEYS["ohmyho.st"];
const NO_ASSETS = {
  ASSETS: { fetch: async () => new Response(null, { status: 404 }) },
};

function fakeNetwork(overrides: Record<string, Response> = {}) {
  const calls: Array<{ url: string; method: string; body: string | null }> = [];
  const fetchImpl = async (
    input: string | URL | Request,
    init?: RequestInit,
  ) => {
    const url = String(input);
    calls.push({
      url,
      method: init?.method ?? "GET",
      body: typeof init?.body === "string" ? init.body : null,
    });
    const known = overrides[`${init?.method ?? "GET"} ${url}`];
    if (known) return known;
    if (url === "https://ohmyho.st/sitemap.xml") return new Response(SITEMAP);
    if (url === `https://ohmyho.st/${KEY}.txt`) return new Response(KEY);
    if (url === "https://api.indexnow.org/IndexNow")
      return new Response("", { status: 200 });
    return new Response("not found", { status: 404 });
  };
  return { calls, fetchImpl };
}

it("serves each website key as a plain text file at the host root, and only its own key", async () => {
  const response = await worker.fetch(
    new Request(`https://ohmyho.st/${KEY}.txt`),
    NO_ASSETS,
  );
  expect(response.status).toBe(200);
  expect(response.headers.get("content-type")).toBe(
    "text/plain; charset=utf-8",
  );
  expect(await response.text()).toBe(KEY);
  const head = await worker.fetch(
    new Request(`https://ohmyho.st/${KEY}.txt`, { method: "HEAD" }),
    NO_ASSETS,
  );
  expect(head.status).toBe(200);
  expect(await head.text()).toBe("");
  const docsKey = await worker.fetch(
    new Request(`https://ohmyho.st/${INDEXNOW_KEYS["docs.ohmyho.st"]}.txt`),
    NO_ASSETS,
  );
  expect(docsKey.status).toBe(404);
});

it("keeps one distinct 32-character hexadecimal key per host", () => {
  const keys = Object.values(INDEXNOW_KEYS);
  expect(Object.keys(INDEXNOW_KEYS)).toEqual(["ohmyho.st", "docs.ohmyho.st"]);
  for (const key of keys) expect(key).toMatch(/^[0-9a-f]{32}$/u);
  expect(new Set(keys).size).toBe(keys.length);
});

it("selects the changed URLs of one host from a sitemap", () => {
  const entries = sitemapUrls(SITEMAP);
  expect(entries).toHaveLength(4);
  expect(selectUrls(entries, { host: "ohmyho.st", all: true })).toEqual([
    "https://ohmyho.st/",
    "https://ohmyho.st/pricing",
    "https://ohmyho.st/about",
  ]);
  expect(
    selectUrls(entries, { host: "ohmyho.st", since: "2026-10-01" }),
  ).toEqual(["https://ohmyho.st/", "https://ohmyho.st/pricing"]);
  expect(() => selectUrls(entries, { host: "ohmyho.st" })).toThrow(
    /--since YYYY-MM-DD or --all/u,
  );
  expect(buildPayload("ohmyho.st", ["https://ohmyho.st/"])).toEqual({
    host: "ohmyho.st",
    key: KEY,
    keyLocation: `https://ohmyho.st/${KEY}.txt`,
    urlList: ["https://ohmyho.st/"],
  });
});

it("verifies the live key file and only reports what it would send unless --submit is given", async () => {
  const { calls, fetchImpl } = fakeNetwork();
  const lines: string[] = [];
  const result = await main(["--host", "ohmyho.st", "--all"], {
    fetchImpl,
    log: (line: string) => lines.push(line),
  });
  expect(result).toEqual({ submitted: false, urls: 3 });
  expect(calls.map((call) => `${call.method} ${call.url}`)).toEqual([
    "GET https://ohmyho.st/sitemap.xml",
    `GET https://ohmyho.st/${KEY}.txt`,
  ]);
  expect(lines.join("\n")).toMatch(/dry run/iu);
});

it("posts one IndexNow request for the selected URLs when --submit is given", async () => {
  const { calls, fetchImpl } = fakeNetwork();
  const result = await main(
    ["--host", "ohmyho.st", "--since", "2026-10-01", "--submit"],
    { fetchImpl, log: () => undefined },
  );
  expect(result).toEqual({ submitted: true, urls: 2, status: 200 });
  const post = calls.filter((call) => call.method === "POST");
  expect(post).toHaveLength(1);
  expect(post[0]?.url).toBe("https://api.indexnow.org/IndexNow");
  expect(JSON.parse(post[0]?.body ?? "{}")).toEqual({
    host: "ohmyho.st",
    key: KEY,
    keyLocation: `https://ohmyho.st/${KEY}.txt`,
    urlList: ["https://ohmyho.st/", "https://ohmyho.st/pricing"],
  });
});

it("refuses an unknown host, a missing key file, a rejected submission and an oversized list", async () => {
  await expect(
    main(["--host", "example.com", "--all"], {
      fetchImpl: fakeNetwork().fetchImpl,
      log: () => undefined,
    }),
  ).rejects.toThrow(/No IndexNow key/u);

  const missing = fakeNetwork({
    [`GET https://ohmyho.st/${KEY}.txt`]: new Response("nope", { status: 404 }),
  });
  await expect(
    main(["--host", "ohmyho.st", "--all", "--submit"], {
      fetchImpl: missing.fetchImpl,
      log: () => undefined,
    }),
  ).rejects.toThrow(/key file/u);
  expect(missing.calls.some((call) => call.method === "POST")).toBe(false);

  const rejected = fakeNetwork({
    "POST https://api.indexnow.org/IndexNow": new Response("", { status: 403 }),
  });
  await expect(
    main(["--host", "ohmyho.st", "--all", "--submit"], {
      fetchImpl: rejected.fetchImpl,
      log: () => undefined,
    }),
  ).rejects.toThrow(/403/u);

  const many = `<urlset>${Array.from({ length: 10_001 }, (_, index) => `<url><loc>https://ohmyho.st/p${index}</loc></url>`).join("")}</urlset>`;
  await expect(
    main(["--host", "ohmyho.st", "--all", "--submit"], {
      fetchImpl: fakeNetwork({
        "GET https://ohmyho.st/sitemap.xml": new Response(many),
      }).fetchImpl,
      log: () => undefined,
    }),
  ).rejects.toThrow(/10,000/u);
});
