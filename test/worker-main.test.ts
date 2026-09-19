import { readdir, readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import { CLIENT_RELEASE } from "../src/customer-entry.js";
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
    expect(html).toContain("<title>ohmyho.st — Hosting for agents, from $10/month</title>");
    expect(html).toContain("Copy prompt for your agent");
    expect(html).toContain("<span>Copy prompt</span>");
    expect(html).not.toContain("Get beta access");
    expect(html).not.toContain("Beta access");
    expect(html).not.toContain('id="beta-modal"');
    expect(html).not.toContain('id="beta-form"');
    expect(html).not.toContain("showModal");
    expect(html.match(/rel="icon"/gu)).toHaveLength(1);
    expect(html).not.toContain("fetch('/stats.json'");
    expect(html).not.toContain('id="proof"');
    expect(html).toContain("updatePlaybackRate(1.25)");
    expect(html).toContain("Your database, exported &amp; connected.");
    expect(html).toContain('width="96" height="96" loading="lazy"');
    const pricing = html.slice(
      html.indexOf('<section id="price">'),
      html.indexOf('<div class="slid up">'),
    );
    expect(pricing.match(/data-copy/gu)).toHaveLength(1);
    expect(pricing).toContain("More capacity when you need it <em>uses credits</em>");
    expect(html.slice(html.indexOf("<nav>"), html.indexOf("</nav>"))).not.toContain(
      'href="#export"',
    );
    expect(html).toContain('powered by <a href="https://amerged.com">amerged.com</a>');
    expect(html).toContain('<a class="sales" href="/contact">Bigger than this? Talk to us.</a>');
    expect(html).toContain('href="https://docs.ohmyho.st/pricing">See all usage rates</a>');
    const comparisonStart = html.indexOf('<div class="vs stag">');
    const comparison = html.slice(comparisonStart, html.indexOf("</section>", comparisonStart));
    expect(comparison.match(/<details class="bill" open><summary>/gu)).toHaveLength(2);
    expect(comparison.match(/class="li"/gu)).toHaveLength(13);
    expect(html).not.toMatch(/AI (models|credits)/u);
    expect(html).toContain("<span><h3>1,000 emails</h3><u>53 credits</u></span>");
    expect(comparison.match(/Functions &amp; cron/gu)).toHaveLength(2);
    for (const card of comparison.split('<div class="card').slice(1)) {
      const bill = card.indexOf('<details class="bill" open>');
      const billEnd = card.indexOf("</details>");
      expect(bill).toBeGreaterThan(card.indexOf('<p class="scen">'));
      expect(billEnd).toBeLessThan(card.indexOf('<div class="tot">'));
      expect(card.slice(bill, billEnd).match(/class="li"/gu)?.length).toBeGreaterThanOrEqual(6);
      expect(card.slice(billEnd)).not.toContain('class="li"');
    }
    const comparisonEnd = html.indexOf("</section>", comparisonStart);
    expect(html.indexOf("details.bill")).toBeGreaterThan(
      html.lastIndexOf("</details>", comparisonEnd),
    );
    expect(html.indexOf("details.bill")).toBeLessThan(comparisonEnd);
    expect(html).toContain(".vs .card .tot{order:-1");
    expect(html).toContain("details.bill");
    expect(html).not.toContain("Auth0");
    expect(html).not.toContain("logos/auth0.svg");
    expect(html).toContain("Better Auth, WorkOS or anything else that speaks OAuth, OIDC or SAML");
    expect(html).toContain('id="auth-logos" style="grid-template-columns:repeat(3,1fr)"');
    expect(
      (await worker.fetch(new Request("https://ohmyho.st/logos/auth0.svg"), { ASSETS: assets }))
        .status,
    ).toBe(404);
    expect(
      (await worker.fetch(new Request("https://ohmyho.st/logos/workos.svg"), { ASSETS: assets }))
        .status,
    ).toBe(200);
    const icon = await worker.fetch(new Request("https://ohmyho.st/favicon.svg"));
    expect(await icon.text()).toContain("M30 86 H15 L27 63");
    for (const [path, mime] of [
      ["/favicon.ico", "image/x-icon"],
      ["/apple-touch-icon.png", "image/png"],
      ["/brand/assets/founder.png", "image/png"],
      ["/brand/assets/omega-light.svg", "image/svg+xml"],
    ]) {
      const response = await worker.fetch(new Request(`https://ohmyho.st${path}`), {
        ASSETS: assets,
      });
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe(mime);
    }
    expect(
      (
        await worker.fetch(
          new Request("https://ohmyho.st/brand/reference/2026-09-14/manifest.json"),
          { ASSETS: assets },
        )
      ).status,
    ).toBe(404);
    const installer = await worker.fetch(
      new Request("https://omh.st/0.sh?r=hostmebaby&token=private"),
      { ASSETS: assets },
    );
    expect(installer.status).toBe(200);
    const installerText = await installer.text();
    expect(installerText).toContain("OHMYHOST_SIGNUP_SOURCE='hostmebaby'");
    expect(
      await (await worker.fetch(new Request("https://omh.st/0.sh"), { ASSETS: assets })).text(),
    ).toContain("OHMYHOST_SIGNUP_SOURCE=''");
    expect(installerText).toContain("0.1.6");
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
      "/api/openapi.yaml",
      "/robots.txt",
      "/sitemap.xml",
      "/mcp-tools.json",
      "/mcp.json",
      "/client-release.json",
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
      expect((await worker.fetch(new Request(`https://ohmyho.st${path}.md`))).status).toBe(308);
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
    expect(html).toContain('href="https://docs.ohmyho.st/"');
    const docs = await worker.fetch(new Request("https://ohmyho.st/docs"));
    expect(docs.status).toBe(308);
    expect(docs.headers.get("location")).toBe("https://docs.ohmyho.st/");
    const llms = await worker.fetch(new Request("https://ohmyho.st/llms.txt"));
    expect(llms.status).toBe(200);
    expect(await llms.text()).toContain("/skills/ohmyhost-build-portable-app/SKILL.md");
    const skill = await worker.fetch(
      new Request("https://ohmyho.st/skills/ohmyhost-build-portable-app/SKILL.md"),
    );
    expect(skill.status).toBe(200);
    expect(await skill.text()).toContain("feedback");
    const terms = await (await worker.fetch(new Request("https://ohmyho.st/terms"))).text();
    expect(terms).toContain(
      "A project chooses its hosting region when it is created: US by default, or EU.",
    );
    expect(terms).not.toContain("placements are in US East");
    expect(await (await worker.fetch(new Request("https://ohmyho.st/pricing"))).text()).toContain(
      "Prices are identical in the US and EU hosting regions.",
    );
    const breakdown = await (
      await worker.fetch(new Request("https://ohmyho.st/pricing/breakdown.md"))
    ).text();
    expect(breakdown).toContain("| `build.sandbox.standard-3` | 60 build seconds | 1.204938 |");
    expect(breakdown).toContain("24.098743 credits");
    expect(breakdown).not.toContain("1.642857");
    const privacy = await (await worker.fetch(new Request("https://ohmyho.st/privacy"))).text();
    expect(privacy).toContain("US East or the EU");
    expect(privacy).not.toContain("New customer application/database placements are in US East.");
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

  it("moves legacy documentation directly to its canonical HTML or Markdown page", async () => {
    const routes: Record<string, string> = {
      "/docs": "/",
      "/docs/": "/",
      "/docs.md": "/index.md",
      "/docs/index.md": "/llms.txt",
      "/docs/mcp": "/agents/mcp",
      "/docs/agents/mcp.md": "/agents/mcp.md",
      "/docs/mcp.md": "/agents/mcp.md",
      "/docs/nextjs": "/frameworks/nextjs",
      "/docs/vite": "/frameworks/vite",
      "/docs/react.md": "/frameworks/vite.md",
      "/docs/tanstack": "/frameworks/tanstack",
      "/docs/postgres": "/database",
      "/docs/credits": "/usage",
      "/docs/spend-cap": "/budgets",
      "/docs/dev-and-prod": "/environments",
      "/docs/changelog": "/changelog",
      "/docs/cli/": "/cli",
      "/docs/missing.md": "/missing.md",
      "/api": "/api",
      "/api.md": "/api.md",
      "/llms-full.txt": "/llms-full.txt",
    };
    for (const [path, target] of Object.entries(routes))
      for (const method of ["GET", "HEAD"]) {
        const response = await worker.fetch(
          new Request(`https://ohmyho.st${path}?token=private&next=https://foreign.example`, {
            method,
          }),
        );
        expect(response.status).toBe(308);
        expect(response.headers.get("location")).toBe(`https://docs.ohmyho.st${target}`);
        expect(response.headers.get("vary")).toBe("Accept");
        expect(await response.text()).toBe("");
      }
    for (const path of ["/docs", "/docs/cli", "/api"]) {
      const response = await worker.fetch(
        new Request(`https://ohmyho.st${path}`, { headers: { accept: "text/markdown" } }),
      );
      expect(response.headers.get("location")).toBe(
        `https://docs.ohmyho.st${path === "/docs" ? "/index" : path.replace("/docs", "")}.md`,
      );
      expect(
        (await worker.fetch(new Request(`https://ohmyho.st${path}`, { method: "POST" }))).status,
      ).toBe(405);
    }
    const config = await worker.fetch(new Request("https://ohmyho.st/mcp.json"));
    expect(await config.json()).toEqual({
      mcpServers: {
        ohmyho: { command: "ohmyhost-mcp", env: { OHMYHOST_ENVIRONMENT: "production" } },
      },
    });
    const release = await worker.fetch(new Request("https://ohmyho.st/client-release.json"));
    expect(await release.json()).toEqual({
      version: "0.1.6",
      manifest_url: "https://ohmyho.st/releases/0.1.6/manifest.json",
    });
    const index = await worker.fetch(new Request("https://ohmyho.st/llms.txt"));
    const text = await index.text();
    expect(text).toContain("https://docs.ohmyho.st/quickstart.md");
    expect(text).not.toContain("https://ohmyho.st/docs/");
    expect(text).toContain("https://ohmyho.st/mcp.json");
    const sitemap = await worker.fetch(new Request("https://ohmyho.st/sitemap.xml"));
    expect(await sitemap.text()).not.toContain("https://ohmyho.st/docs");
    const unsafe = await worker.fetch(
      new Request("https://ohmyho.st/docs//foreign.example/path.md"),
    );
    expect(new URL(unsafe.headers.get("location") ?? "").origin).toBe("https://docs.ohmyho.st");
  });

  it("redirects bare and unassigned Free hosts to the fixed home without ticket or query", async () => {
    for (const method of ["GET", "HEAD"]) {
      const response = await worker.fetch(
        new Request("https://www.ohmyho.st/pricing?r=hostmebaby&token=private", { method }),
      );
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe("https://ohmyho.st/pricing?r=hostmebaby");
      expect(await response.text()).toBe("");
      expect(
        (await worker.fetch(new Request("http://www.ohmyho.st/docs/mcp?r=one&r=two"))).headers.get(
          "location",
        ),
      ).toBe("https://ohmyho.st/docs/mcp");
    }
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
  const url = `https://ohmyho.st/releases/${CLIENT_RELEASE}/ohmyhost-product-cli-${CLIENT_RELEASE}.tgz`;
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
  // Both current and retained pinned downloads stay available during the migration.
  const currentUrl = `https://ohmyho.st/releases/${CLIENT_RELEASE}/ohmyhost-product-cli-${CLIENT_RELEASE}.tgz`;
  expect((await worker.fetch(new Request(currentUrl), { ASSETS: fixture })).status).toBe(200);
  expect(fixture.requests).toHaveLength(2);
  expect(
    (
      await worker.fetch(
        new Request("https://ohmyho.st/releases/0.1.5/ohmyhost-customer-runtime-0.1.5.tgz"),
        { ASSETS: fixture },
      )
    ).status,
  ).toBe(200);
  for (const invalid of [
    "https://ohmyho.st/releases/0.1.3/ohmyhost-product-cli-0.1.3.tgz",
    "https://ohmyho.st/releases/0.1.0/manifest.json",
    "https://ohmyho.st/releases/0.1.0-beta.40/ohmyhost-product-cli-0.1.0-beta.40.tgz",
    `https://ohmyho.st/releases/${CLIENT_RELEASE}/ohmyhost-product-cli-0.1.3.tgz`,
    "https://ohmyho.st/releases/0.1.0-beta.119/manifest.json",
    `https://ohmyho.st/releases/${CLIENT_RELEASE}/.env.local`,
  ])
    expect((await worker.fetch(new Request(invalid), { ASSETS: fixture })).status).toBe(404);
  expect(fixture.requests).toHaveLength(3);
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
        "/pages/openapi.yaml",
        "/pages/0.sh",
        "/logos/workos.svg",
      ].includes(path) &&
      !/^\/pages\/brand-assets\/(?:omega-(?:light|dark)\.(?:svg|png)|favicon\.(?:svg|ico)|apple-touch-icon\.png|founder\.png|og\.png)$/u.test(
        path,
      ) &&
      !/^\/fonts\/[a-f0-9]{16}\.ttf$/u.test(path)
    )
      return new Response(null, { status: 404 });
    const text = await readFile(new URL(`../public${path}`, import.meta.url));
    return new Response(new Uint8Array(text));
  }
}
