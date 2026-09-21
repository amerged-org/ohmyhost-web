import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import worker from "../src/worker-main.js";
import { PAGE_META } from "../src/page-meta.js";
import { schemaDate, WEBSITE } from "../src/site-identity.js";
import { longDate } from "../src/pages/index.js";

const assets = {
  async fetch(request: Request) {
    return new Response(
      new Uint8Array(
        await readFile(
          new URL(`../public${new URL(request.url).pathname}`, import.meta.url),
        ),
      ),
    );
  },
};
const paths = Object.keys(PAGE_META).filter(
  (path) =>
    path === "/blog" || path.startsWith("/blog/") || path.startsWith("/vs/"),
);

it("permanently normalizes real editorial paths without losing queries or redirecting unknown pages", async () => {
  for (const path of paths)
    for (const method of ["GET", "HEAD"]) {
      const query = "?utm_source=partner&r=hello&next=%2Fblog";
      for (const url of [
        `http://ohmyho.st${path}${query}`,
        `https://ohmyho.st${path}/${query}`,
      ]) {
        const response = await worker.fetch(new Request(url, { method }));
        expect(response.status).toBe(308);
        expect(response.headers.get("location")).toBe(
          `https://ohmyho.st${path}${query}`,
        );
        expect(await response.text()).toBe("");
      }
    }
  expect(
    (await worker.fetch(new Request("https://ohmyho.st/blog/not-a-post/")))
      .status,
  ).toBe(404);
});

it("canonicalizes every Markdown mirror and negotiates it separately from HTML", async () => {
  for (const path of [...paths, "/", "/brand"]) {
    const mirror = path === "/" ? "/index.md" : `${path}.md`;
    const html = await worker.fetch(new Request(`https://ohmyho.st${path}`), {
      ASSETS: assets,
    });
    const htmlEtag = html.headers.get("etag");
    expect(htmlEtag).toMatch(/^W\/"[a-f0-9]{64}"$/u);
    expect(html.headers.get("link")).toBe(
      `<${mirror}>; rel="alternate"; type="text/markdown"`,
    );
    for (const method of ["GET", "HEAD"]) {
      for (const url of [mirror, path]) {
        const response = await worker.fetch(
          new Request(`https://ohmyho.st${url}`, {
            method,
            headers: {
              accept: "text/markdown",
              "if-none-match": htmlEtag ?? "",
            },
          }),
          { ASSETS: assets },
        );
        expect(response.status).toBe(200);
        expect(response.headers.get("content-type")).toContain("text/markdown");
        expect(response.headers.get("link")).toBe(
          `<https://ohmyho.st${path}>; rel="canonical"`,
        );
        expect(response.headers.get("etag")).not.toBe(htmlEtag);
        expect(response.headers.get("vary")).toContain("Accept");
        const body = await response.text();
        if (method === "HEAD") expect(body).toBe("");
        else {
          expect(body, url).toMatch(/^# /mu);
          expect(body).not.toContain("<!doctype html>");
        }
      }
    }
  }
});

it("revalidates anonymous documents but never reuses referral or authenticated responses", async () => {
  const url = "https://ohmyho.st/blog";
  const first = await worker.fetch(new Request(url));
  const etag = first.headers.get("etag") ?? "";
  for (const match of [etag, etag.slice(2), `"other", ${etag}`, "*"]) {
    const response = await worker.fetch(
      new Request(url, { headers: { "if-none-match": match } }),
    );
    expect(response.status).toBe(304);
    expect(await response.text()).toBe("");
    expect(response.headers.get("etag")).toBe(etag);
  }
  for (const [suffix, headers] of [
    ["?r=partner", {}],
    ["?r=", {}],
    ["", { cookie: "omh_referral=partner" }],
    ["", { cookie: "analytics=denied" }],
    ["", { authorization: "Bearer test-not-a-credential" }],
  ] as const) {
    const response = await worker.fetch(
      new Request(url + suffix, {
        headers: { ...headers, "if-none-match": etag },
      }),
    );
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(response.headers.has("etag")).toBe(false);
    expect(response.headers.get("vary")).toContain("Cookie");
    if (suffix === "?r=partner")
      expect(response.headers.get("set-cookie")).toContain(
        "omh_referral=partner",
      );
  }
  const stale = await worker.fetch(
    new Request(url, { headers: { "if-none-match": '"old-version"' } }),
  );
  expect(stale.status).toBe(200);
});

it("keeps region-specific navigation private and invalidates its validator when the region changes", async () => {
  let etag = "";
  for (const country of ["NL", "US"]) {
    const request = new Request("https://ohmyho.st/blog", {
      headers: {
        "sec-fetch-mode": "navigate",
        "sec-fetch-dest": "document",
        "if-none-match": etag,
      },
    });
    Object.defineProperty(request, "cf", {
      value: { country, continent: country === "NL" ? "EU" : "NA" },
    });
    const response = await worker.fetch(request);
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("private, no-cache");
    expect(response.headers.get("etag")).not.toBe(etag);
    etag = response.headers.get("etag") ?? "";
    expect(await response.text()).toContain(
      `name="ohmyhost-region-hint" content="${country === "NL" ? "eu" : "us"}"`,
    );
  }
});

it("defines the same website on the homepage and emits dated article metadata without changing the editorial day", async () => {
  const home = await worker.fetch(new Request("https://ohmyho.st/"), {
    ASSETS: assets,
  });
  expect(await home.text()).toContain(JSON.stringify(WEBSITE));
  for (const path of paths) {
    const response = await worker.fetch(
      new Request(`https://ohmyho.st${path}`),
    );
    const html = await response.text();
    const data = JSON.parse(
      html.match(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/u,
      )?.[1] ?? "{}",
    );
    expect(data["@graph"]).toContainEqual(WEBSITE);
    const article = data["@graph"].find(
      (node: Record<string, unknown>) => node["@type"] === "BlogPosting",
    );
    if (article) {
      for (const field of ["datePublished", "dateModified"])
        expect(article[field]).toMatch(
          /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/u,
        );
      expect(article.datePublished.slice(0, 10)).toBe(
        PAGE_META[path]?.published,
      );
    }
  }
  expect(schemaDate("2026-09-13")).toBe("2026-09-13T00:00:00Z");
  expect(schemaDate("2026-09-21T21:00:00+02:00")).toBe(
    "2026-09-21T21:00:00+02:00",
  );
  expect(longDate("2026-09-21T21:00:00+02:00")).toBe("September 21, 2026");
  for (const value of [
    "2026-02-30",
    "2026-13-01",
    "invalid",
    "2026-09-21T21:00:00",
  ])
    expect(() => schemaDate(value)).toThrow("Invalid editorial date");
});

it("honors Accept quality weights and explicit Markdown exclusions", async () => {
  for (const [accept, expected] of [
    ["text/html, text/markdown;q=0", "text/html"],
    ["text/html;q=1, text/markdown;q=0.1", "text/html"],
    ["text/markdown;q=0.9, text/html;q=0.5", "text/markdown"],
    ["TEXT/MARKDOWN", "text/markdown"],
    ["text/html, text/markdown", "text/html"],
    ["text/*;q=0.8, text/markdown;q=0", "text/html"],
    ["*/*", "text/html"],
    ["text/markdown;q=bad", "text/html"],
    ["text/markdown;q=0, text/markdown;q=0.5", "text/markdown"],
  ]) {
    const response = await worker.fetch(
      new Request("https://ohmyho.st/blog", {
        headers: { accept: accept ?? "" },
      }),
    );
    expect(response.headers.get("content-type"), accept).toContain(expected);
  }
});
