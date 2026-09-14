import { readdir, readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import worker from "../src/worker-main.js";

describe("public entry and unassigned Free-host fallback", () => {
  it("serves the public home and favicon without reflecting request data", async () => {
    const assetRules = await readFile(new URL("../public/.assetsignore", import.meta.url), "utf8");
    expect(assetRules).toContain("!pages/**");
    expect(assetRules).toContain("!logos/**");
    const assets = new SiteAssetFixture();
    const home = await worker.fetch(new Request("https://ohmyho.st/?ticket=private-ticket"), {
      ASSETS: assets,
    });
    expect(home.status).toBe(200);
    expect(home.headers.get("content-type")).toContain("text/html");
    const html = await home.text();
    expect(html).toContain(
      "<title>Hosting for vibe-coded apps — $10/mo for all your projects, not per project | ohmyho.st</title>",
    );
    expect(html).toContain("Copy prompt for your agent");
    expect(html).toContain("Get beta access");
    const installer = await worker.fetch(
      new Request("https://omh.st/0.sh?r=hostmebaby&token=private"),
      { ASSETS: assets },
    );
    expect(installer.status).toBe(200);
    const installerText = await installer.text();
    expect(installerText).toContain("OHMYHOST_SIGNUP_SOURCE=''");
    expect(installerText).toContain("0.1.0-beta.28");
    expect(installerText).toContain("using only my explicitly authorized GitHub repository");
    expect(installerText).not.toMatch(/upload source path|source uploads/u);
    expect(installerText).toContain("Hermes 0.21 or newer is required for interactive onboarding.");
    expect(installerText.indexOf("Hermes 0.21 or newer")).toBeLessThan(
      installerText.indexOf("npm install --global"),
    );
    expect(installerText).toContain("Project directory (JSON string): $omh_project_json");
    expect(installerText).toContain("do not deploy a different workspace");
    expect(installerText).not.toContain("private");
    expect(installerText).not.toContain("@CLIENT_RELEASE@");
    expect((await worker.fetch(new Request("http://omh.st/0.sh"))).status).toBe(308);
    expect(html).toContain("ohmyhost-get-started");
    for (const image of ["/og.png", "/logo.png"]) {
      const response = await worker.fetch(new Request(`https://ohmyho.st${image}`), {
        ASSETS: assets,
      });
      expect(response.headers.get("content-type")).toBe("image/png");
      expect(Array.from(new Uint8Array(await response.arrayBuffer()).slice(0, 4))).toEqual([
        137, 80, 78, 71,
      ]);
    }
    const brand = await worker.fetch(new Request("https://ohmyho.st/brand"), { ASSETS: assets });
    expect(await brand.text()).toBe(
      await readFile(new URL("../public/pages/brand.html", import.meta.url), "utf8"),
    );
    for (const path of [
      "/index.md",
      "/brand.md",
      "/api",
      "/api.md",
      "/api/openapi.yaml",
      "/robots.txt",
      "/sitemap.xml",
      "/mcp-tools.json",
      "/llms-full.txt",
      "/docs/index.md",
      "/.well-known/agent-skills/index.json",
    ]) {
      const response = await worker.fetch(new Request(`https://ohmyho.st${path}`), {
        ASSETS: assets,
      });
      expect(response.status).toBe(200);
      expect((await response.text()).length).toBeGreaterThan(30);
    }
    for (const path of [
      "/docs",
      "/docs/cli",
      "/docs/mcp",
      "/docs/skills",
      "/docs/domains",
      "/docs/usage",
      "/docs/backups",
    ]) {
      expect((await worker.fetch(new Request(`https://ohmyho.st${path}.md`))).status).toBe(200);
    }
    const login = await worker.fetch(
      new Request("https://ohmyho.st/login?r=hostmebaby&next=https://foreign.example&token=secret"),
    );
    expect(login.headers.get("location")).toBe("https://app.ohmyho.st/login?r=hostmebaby");
    expect(home.headers.get("link")).toContain("/index.md");
    expect(home.headers.get("content-security-policy")).toContain("font-src 'self'");
    expect(html).not.toMatch(/fonts\.googleapis|fonts\.gstatic/u);
    expect(html).toContain('id="cookie-notice"');
    const font = (await readdir(new URL("../public/fonts", import.meta.url))).find((name) =>
      name.endsWith(".ttf"),
    );
    const fontResponse = await worker.fetch(new Request(`https://ohmyho.st/fonts/${font}`), {
      ASSETS: assets,
    });
    expect(fontResponse.headers.get("content-type")).toBe("font/ttf");
    expect(Array.from(new Uint8Array(await fontResponse.arrayBuffer()).slice(0, 4))).toEqual([
      0, 1, 0, 0,
    ]);
    expect(html).toContain('href="/docs"');
    const docs = await worker.fetch(new Request("https://ohmyho.st/docs"));
    expect(docs.status).toBe(200);
    const documentation = await docs.text();
    expect(documentation).toContain("OHMYHOST_ENVIRONMENT=production");
    expect(documentation).toContain("npm install");
    expect(documentation).toContain("/releases/");
    const llms = await worker.fetch(new Request("https://ohmyho.st/llms.txt"));
    expect(llms.status).toBe(200);
    expect(await llms.text()).toContain("/skills/ohmyhost-build-portable-app/SKILL.md");
    const skill = await worker.fetch(
      new Request("https://ohmyho.st/skills/ohmyhost-build-portable-app/SKILL.md"),
    );
    expect(skill.status).toBe(200);
    expect(await skill.text()).toContain("feedback");
    expect(html).not.toContain("private-ticket");
    expect(home.headers.get("content-security-policy")).toContain("default-src 'none'");
    expect(
      await (await worker.fetch(new Request("https://ohmyho.st/", { method: "HEAD" }))).text(),
    ).toBe("");
    expect(
      (await worker.fetch(new Request("https://ohmyho.st/favicon.svg"))).headers.get(
        "content-type",
      ),
    ).toContain("image/svg+xml");
    expect((await worker.fetch(new Request("https://ohmyho.st/missing"))).status).toBe(404);
  });

  it("redirects bare and unassigned Free hosts to the fixed home without ticket or query", async () => {
    for (const host of [
      "omh.st",
      "check.omh.st",
      "dev.check.omh.st",
      "calm-river-builds.check.omh.st",
      "dev-calm-river-builds.dev.check.omh.st",
    ]) {
      for (const method of ["GET", "HEAD"]) {
        const response = await worker.fetch(
          new Request(
            `https://${host}/private?ticket=private-ticket&next=https://foreign.example`,
            { method },
          ),
        );
        expect(response.status).toBe(302);
        expect(response.headers.get("location")).toBe("https://ohmyho.st/");
        expect(response.headers.get("cache-control")).toBe("no-store");
        expect(response.headers.get("referrer-policy")).toBe("no-referrer");
        expect(await response.text()).toBe("");
        const referred = await worker.fetch(
          new Request(
            `https://${host}/private?r=hostmebaby&ticket=private-ticket&next=https://foreign.example`,
            { method },
          ),
        );
        expect(referred.headers.get("location")).toBe(
          host === "omh.st" || host === "check.omh.st"
            ? "https://ohmyho.st/?r=hostmebaby"
            : "https://ohmyho.st/",
        );
        const ambiguous = await worker.fetch(
          new Request(`https://${host}/?r=one&r=two`, { method }),
        );
        expect(ambiguous.headers.get("location")).toBe("https://ohmyho.st/");
      }
    }
  });

  it("does not redirect writes, protected API hosts or foreign domains", async () => {
    for (const host of ["ohmyho.st", "omh.st", "check.omh.st", "missing.check.omh.st"]) {
      const response = await worker.fetch(
        new Request(`https://${host}/`, { method: "POST", body: "private-payload" }),
      );
      expect(response.status).toBe(405);
      expect(response.headers.has("location")).toBe(false);
      expect(await response.text()).not.toContain("private-payload");
    }
    for (const host of [
      "app.ohmyho.st",
      "dev.app.ohmyho.st",
      "poc.waitrez.com",
      "foreigncheck.omh.st",
      "check.omh.st.foreign.example",
      "ohm.st",
    ]) {
      const response = await worker.fetch(
        new Request(`https://${host}/`, { headers: { host: "ohmyho.st" } }),
      );
      expect(response.status).toBe(404);
      expect(response.headers.has("location")).toBe(false);
    }
  });
});

it("serves only pinned public client assets and strips credentials before the asset binding", async () => {
  const fixture = new PublicAssetFixture();
  const url = "https://ohmyho.st/releases/0.1.0-beta.1/ohmyhost-product-cli-0.1.0-beta.1.tgz";
  const response = await worker.fetch(
    new Request(url + "?token=private", {
      headers: { authorization: "Bearer private", cookie: "private" },
    }),
    { ASSETS: fixture },
  );
  expect(response.status).toBe(200);
  expect(await response.text()).toBe("test-client-archive");
  expect(response.headers.get("cache-control")).toContain("immutable");
  expect(fixture.requests).toHaveLength(1);
  expect(fixture.requests[0]?.url).toBe(url);
  expect(fixture.requests[0]?.headers.has("authorization")).toBe(false);
  expect(fixture.requests[0]?.headers.has("cookie")).toBe(false);
  expect((await worker.fetch(new Request(url))).status).toBe(503);
  const unknown = await worker.fetch(
    new Request("https://ohmyho.st/releases/0.1.0-beta.1/.env.local"),
    { ASSETS: fixture },
  );
  expect(unknown.status).toBe(404);
  expect(fixture.requests).toHaveLength(1);
  expect(
    (
      await worker.fetch(new Request("https://ohmyho.st/.well-known/skills/index.json"))
    ).headers.get("content-type"),
  ).toContain("application/json");
  const index = await (
    await worker.fetch(new Request("https://ohmyho.st/.well-known/skills/index.json"))
  ).json();
  expect(index.skills).toHaveLength(9);
  for (const entry of index.skills) {
    const document = await worker.fetch(new Request(entry.url));
    expect(document.status).toBe(200);
    expect(await document.text()).toContain(`name: ${entry.name}`);
  }
  const currentUrl =
    "https://ohmyho.st/releases/0.1.0-beta.7/ohmyhost-product-cli-0.1.0-beta.7.tgz";
  expect((await worker.fetch(new Request(currentUrl), { ASSETS: fixture })).status).toBe(200);
  expect(fixture.requests).toHaveLength(2);
  expect(
    (
      await worker.fetch(
        new Request(
          "https://ohmyho.st/releases/0.1.0-beta.11/ohmyhost-product-cli-0.1.0-beta.11.tgz",
        ),
        { ASSETS: fixture },
      )
    ).status,
  ).toBe(200);
  for (const invalid of [
    "https://ohmyho.st/releases/0.1.0-beta.7/ohmyhost-product-cli-0.1.0-beta.1.tgz",
    "https://ohmyho.st/releases/0.1.0-beta.119/manifest.json",
    "https://ohmyho.st/releases/0.1.0-beta.7/.env.local",
  ])
    expect((await worker.fetch(new Request(invalid), { ASSETS: fixture })).status).toBe(404);
  expect(fixture.requests).toHaveLength(3);
  const retained = (await readdir(new URL("../public/releases/", import.meta.url))).filter((name) =>
    /^0\.1\.0-beta\.[1-9][0-9]*$/u.test(name),
  );
  for (const version of retained)
    expect(
      (
        await worker.fetch(new Request(`https://ohmyho.st/releases/${version}/manifest.json`), {
          ASSETS: fixture,
        })
      ).status,
    ).toBe(200);
  expect(fixture.requests).toHaveLength(3 + retained.length);
});

class PublicAssetFixture {
  readonly requests: Request[] = [];
  async fetch(request: Request) {
    this.requests.push(request);
    return new Response("test-client-archive", { headers: { "content-type": "application/gzip" } });
  }
}

class SiteAssetFixture {
  async fetch(request: Request) {
    const path = new URL(request.url).pathname;
    if (
      ![
        "/pages/home.html",
        "/pages/og.png",
        "/pages/logo.png",
        "/pages/brand.html",
        "/pages/index.md",
        "/pages/brand.md",
        "/pages/api.html",
        "/pages/api.md",
        "/pages/openapi.yaml",
        "/pages/0.sh",
      ].includes(path) &&
      !/^\/fonts\/[a-f0-9]{16}\.ttf$/u.test(path)
    )
      return new Response(null, { status: 404 });
    const text = await readFile(new URL(`../public${path}`, import.meta.url));
    return new Response(new Uint8Array(text));
  }
}
