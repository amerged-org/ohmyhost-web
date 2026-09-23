import { readdir, readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";

import { describe, expect, it } from "vitest";

import { CLIENT_RELEASE } from "../src/customer-entry.js";
import worker from "../src/worker-main.js";

describe("public entry and unassigned Free-host fallback", () => {
  it("serves the public home and favicon without reflecting request data", async () => {
    const assetRules = await readFile(
      new URL("../public/.assetsignore", import.meta.url),
      "utf8",
    );
    expect(assetRules).toContain("!pages/**");
    expect(assetRules).toContain("!logos/**");
    const assets = new SiteAssetFixture();
    const home = await worker.fetch(
      new Request("https://ohmyho.st/?ticket=private-ticket"),
      {
        ASSETS: assets,
      },
    );
    expect(home.status).toBe(200);
    expect(home.headers.get("content-type")).toContain("text/html");
    const html = await home.text();
    expect(html).toContain('</a></div>\n  </div>\n  <div class="fbot">');
    expect(html).toContain("<span>© 2026 ohmyho.st — Made in Europe</span>");
    expect(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/u)?.[1]).toBe(
      '<span class="thin">Host your app.</span><br>All-in-one hosting from $10/month.',
    );
    for (const [attribute, name] of [
      ["property", "og:title"],
      ["name", "twitter:title"],
    ])
      expect(html).toContain(
        `<meta ${attribute}="${name}" content="ohmyho.st — An alternative to Vercel, Supabase &amp; Resend">`,
      );
    for (const [attribute, name] of [
      ["property", "og:description"],
      ["name", "twitter:description"],
    ])
      expect(html).toContain(
        `<meta ${attribute}="${name}" content="An alternative stack for app hosting, managed Postgres and transactional email. Deploy with your coding agent. One credit balance across projects.">`,
      );
    expect(html).toContain(
      "<title>ohmyho.st — An alternative to Vercel, Supabase &amp; Resend</title>",
    );
    expect(html).toContain(
      "Independent comparison; no affiliation or endorsement.",
    );
    expect(html).not.toContain("An alternative. Know the differences.");
    expect(html).toContain("200 credits, free. No card required.");
    const pricingSection = html.slice(
      html.indexOf('<section id="price">'),
      html.indexOf('<section id="from">'),
    );
    expect(pricingSection.match(/class="note"/gu)).toHaveLength(1);
    expect(pricingSection).toContain(
      'Free credits reset monthly. <b class="keepb">Purchased credits never expire.</b> Usage is metered.',
    );
    // The $10 card carries one small corner chip; the copy repeats it in bold.
    const paidCard = pricingSection.slice(
      pricingSection.indexOf('<div class="plan on">'),
    );
    expect(paidCard.match(/class="keep"/gu)).toHaveLength(1);
    expect(paidCard).toContain(
      '<span class="keep">Purchased credits don\'t expire</span>',
    );
    expect(paidCard).toContain(
      '<li>1000 credits a month, <b class="keepb">they stack</b></li>',
    );
    expect(pricingSection).toContain(
      'get 1000 more every month, top up whenever. <b class="keepb">Credits you buy never expire.</b>',
    );
    expect(pricingSection).not.toContain("fresh 1000");
    expect(html).not.toContain("skip Vercel");
    expect(html).toContain("about 30 seconds");
    expect(html).not.toContain("about two minutes");
    expect(html).not.toContain("No dashboard");
    expect(html).not.toContain("you don't get a dashboard");
    expect(html).not.toContain("No UI.");
    expect(html).not.toContain("no CLI to install");
    // The shared card carries that copy as text instead of the bare brand mark.
    expect(html).toContain(
      '<meta property="og:image" content="https://ohmyho.st/og/home.png">',
    );
    // The header offers signing in next to the prompt, and Docs sits with the section links.
    expect(html).toContain('href="/login" aria-label="Log in or sign up"');
    expect(html).toContain(
      '<a href="https://docs.ohmyho.st/" rel="noopener">Docs</a>',
    );
    expect(html).not.toContain('href="#stack"');
    expect(html).toContain("Copy prompt for your agent");
    expect(html).toContain("<span>Copy prompt</span>");
    expect(html).not.toContain("Get beta access");
    expect(html).not.toContain("Beta access");
    expect(html).not.toContain('id="beta-modal"');
    expect(html).not.toContain('id="beta-form"');
    // Cookie preferences use a dialog; the former signup modal stays removed.
    expect(html).toContain("dialog.id = 'omh-cookie-dialog'");
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
    expect(pricing).toContain(
      "More capacity when you need it <em>uses credits</em>",
    );
    expect(
      html.slice(html.indexOf("<nav>"), html.indexOf("</nav>")),
    ).not.toContain('href="#export"');
    expect(html).toContain(
      'powered by <a href="https://amerged.com" rel="noopener">amerged.com</a>',
    );
    expect(html).toContain(
      '<a class="sales" href="/contact">Bigger than this? Talk to us.</a>',
    );
    expect(html).toContain(
      'href="https://docs.ohmyho.st/pricing" rel="noopener">See all usage rates</a>',
    );
    const comparisonStart = html.indexOf('<div class="vs stag">');
    const comparison = html.slice(
      comparisonStart,
      html.indexOf("</section>", comparisonStart),
    );
    expect(
      comparison.match(/<details class="bill" open><summary>/gu),
    ).toHaveLength(2);
    expect(comparison.match(/class="li"/gu)).toHaveLength(13);
    expect(html).not.toMatch(/AI (models|credits)/u);
    expect(html).toContain(
      "<span><h3>1,000 emails</h3><u>53 credits</u></span>",
    );
    expect(comparison.match(/Functions &amp; cron/gu)).toHaveLength(2);
    for (const card of comparison.split('<div class="card').slice(1)) {
      const bill = card.indexOf('<details class="bill" open>');
      const billEnd = card.indexOf("</details>");
      expect(bill).toBeGreaterThan(card.indexOf('<p class="scen">'));
      expect(billEnd).toBeLessThan(card.indexOf('<div class="tot">'));
      expect(
        card.slice(bill, billEnd).match(/class="li"/gu)?.length,
      ).toBeGreaterThanOrEqual(6);
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
    const navigation = {
      "sec-fetch-mode": "navigate",
      "sec-fetch-dest": "document",
    };
    for (const [cf, requestHeaders, expectedRegion] of [
      [{ country: "NL", continent: "EU" }, navigation, "eu"],
      [{ country: "US", continent: "NA" }, navigation, "us"],
      [undefined, { ...navigation, "cf-ipcountry": "NL" }, ""],
      [{ country: "NL", continent: "EU" }, {}, ""],
    ] as const) {
      const request = new Request("https://ohmyho.st/", {
        headers: requestHeaders,
      });
      Object.defineProperty(request, "cf", { value: cf });
      const response = await worker.fetch(request, { ASSETS: assets });
      const page = await response.text();
      expect(page).toContain(
        `<meta name="ohmyhost-region-hint" content="${expectedRegion}">`,
      );
      expect(response.headers.get("cache-control")).toBe(
        "sec-fetch-mode" in requestHeaders
          ? "private, no-cache"
          : "public, max-age=0, s-maxage=300, must-revalidate",
      );
      const script = [...page.matchAll(/<script>([\s\S]*?)<\/script>/gu)]
        .map((match) => match[1] ?? "")
        .find((text) => text.includes('meta[name="ohmyhost-region-hint"]'));
      expect(script).toBeDefined();
      let copied = "";
      let click: ((event: unknown) => Promise<void>) | undefined;
      const label = { textContent: "" };
      const button = {
        querySelector: () => label,
        closest: () => null,
        classList: { add() {} },
      };
      runInNewContext(script ?? "", {
        document: {
          querySelector: (selector: string) =>
            selector.includes("ohmyhost-region-hint")
              ? { content: expectedRegion }
              : null,
          querySelectorAll: () => [],
          getElementById: () => null,
          addEventListener: (
            _name: string,
            handler: (event: unknown) => Promise<void>,
          ) => {
            click = handler;
          },
        },
        navigator: {
          clipboard: {
            writeText: async (text: string) => {
              copied = text;
            },
          },
        },
        setTimeout: () => undefined,
      });
      if (!click) throw Error("Homepage copy handler missing");
      await click({
        target: { closest: () => button },
        preventDefault() {},
        stopImmediatePropagation() {},
      });
      expect(copied).toContain(
        expectedRegion
          ? `use ${expectedRegion.toUpperCase()} based on this browser's region unless I specify another region`
          : "ask me once whether to use EU or US unless I already specified a region",
      );
      expect(copied).toContain(
        "Keep existing projects in their current region.",
      );
    }
    expect(html).not.toContain("logos/auth0.svg");
    expect(html).toContain(
      "Better Auth, WorkOS or anything else that speaks OAuth, OIDC or SAML",
    );
    expect(html).toContain(
      'id="auth-logos" style="grid-template-columns:repeat(3,1fr)"',
    );
    expect(
      (
        await worker.fetch(new Request("https://ohmyho.st/logos/auth0.svg"), {
          ASSETS: assets,
        })
      ).status,
    ).toBe(404);
    expect(
      (
        await worker.fetch(new Request("https://ohmyho.st/logos/workos.svg"), {
          ASSETS: assets,
        })
      ).status,
    ).toBe(200);
    const icon = await worker.fetch(
      new Request("https://ohmyho.st/favicon.svg"),
    );
    expect(await icon.text()).toContain("M30 86 H15 L27 63");
    for (const [path, mime] of [
      ["/favicon.ico", "image/x-icon"],
      ["/apple-touch-icon.png", "image/png"],
      ["/brand/assets/founder.png", "image/png"],
      ["/brand/assets/omega-light.svg", "image/svg+xml"],
    ]) {
      const response = await worker.fetch(
        new Request(`https://ohmyho.st${path}`),
        {
          ASSETS: assets,
        },
      );
      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe(mime);
    }
    expect(
      (
        await worker.fetch(
          new Request(
            "https://ohmyho.st/brand/reference/2026-09-14/manifest.json",
          ),
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
      await (
        await worker.fetch(new Request("https://omh.st/0.sh"), {
          ASSETS: assets,
        })
      ).text(),
    ).toContain("OHMYHOST_SIGNUP_SOURCE=''");
    expect(installerText).toContain(`omh_release='${CLIENT_RELEASE}'`);
    expect(installerText).toContain(
      "using only my explicitly authorized GitHub repository",
    );
    expect(installerText).not.toMatch(/upload source path|source uploads/u);
    expect(installerText).toContain(
      "Hermes 0.21 or newer is required for interactive onboarding.",
    );
    expect(installerText.indexOf("Hermes 0.21 or newer")).toBeLessThan(
      installerText.indexOf("npm install --global"),
    );
    expect(installerText).toContain(
      "Project directory (JSON string): $omh_project_json",
    );
    expect(installerText).toContain("do not deploy a different workspace");
    expect(installerText).not.toContain("private");
    expect(installerText).not.toContain("@CLIENT_RELEASE@");
    expect((await worker.fetch(new Request("http://omh.st/0.sh"))).status).toBe(
      308,
    );
    expect(html).toContain("ohmyhost-get-started");
    for (const image of ["/og.png", "/logo.png"]) {
      const response = await worker.fetch(
        new Request(`https://ohmyho.st${image}`),
        {
          ASSETS: assets,
        },
      );
      expect(response.headers.get("content-type")).toBe("image/png");
      expect(
        Array.from(new Uint8Array(await response.arrayBuffer()).slice(0, 4)),
      ).toEqual([137, 80, 78, 71]);
    }
    const brand = await worker.fetch(new Request("https://ohmyho.st/brand"), {
      ASSETS: assets,
    });
    expect(await brand.text()).toBe(
      await readFile(
        new URL("../public/pages/brand.html", import.meta.url),
        "utf8",
      ),
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
      const response = await worker.fetch(
        new Request(`https://ohmyho.st${path}`),
        {
          ASSETS: assets,
        },
      );
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
      expect(
        (await worker.fetch(new Request(`https://ohmyho.st${path}.md`))).status,
      ).toBe(308);
    }
    const login = await worker.fetch(
      new Request(
        "https://ohmyho.st/login?r=hostmebaby&next=https://foreign.example&token=secret",
      ),
    );
    expect(login.headers.get("location")).toBe(
      "https://app.ohmyho.st/login?r=hostmebaby",
    );
    expect(home.headers.get("link")).toContain("/index.md");
    expect(home.headers.get("content-security-policy")).toContain(
      "font-src 'self'",
    );
    expect(html).not.toMatch(/fonts\.googleapis|fonts\.gstatic/u);
    expect(html).toContain('id="cookie-notice"');
    const font = (
      await readdir(new URL("../public/fonts", import.meta.url))
    ).find((name) => name.endsWith(".ttf"));
    const fontResponse = await worker.fetch(
      new Request(`https://ohmyho.st/fonts/${font}`),
      {
        ASSETS: assets,
      },
    );
    expect(fontResponse.headers.get("content-type")).toBe("font/ttf");
    expect(
      Array.from(new Uint8Array(await fontResponse.arrayBuffer()).slice(0, 4)),
    ).toEqual([0, 1, 0, 0]);
    expect(html).toContain('href="https://docs.ohmyho.st/"');
    const docs = await worker.fetch(new Request("https://ohmyho.st/docs"));
    expect(docs.status).toBe(308);
    expect(docs.headers.get("location")).toBe("https://docs.ohmyho.st/");
    const llms = await worker.fetch(new Request("https://ohmyho.st/llms.txt"));
    expect(llms.status).toBe(200);
    expect(await llms.text()).toContain(
      "/skills/ohmyhost-build-portable-app/SKILL.md",
    );
    const skill = await worker.fetch(
      new Request(
        "https://ohmyho.st/skills/ohmyhost-build-portable-app/SKILL.md",
      ),
    );
    expect(skill.status).toBe(200);
    expect(await skill.text()).toContain("feedback");
    const terms = await (
      await worker.fetch(new Request("https://ohmyho.st/terms"))
    ).text();
    expect(terms).toContain(
      "A project chooses its hosting region when it is created: US by default, or EU.",
    );
    expect(terms).not.toContain("placements are in US East");
    expect(
      await (
        await worker.fetch(new Request("https://ohmyho.st/pricing"))
      ).text(),
    ).toContain("Prices are identical in the US and EU hosting regions.");
    const breakdown = await (
      await worker.fetch(new Request("https://ohmyho.st/pricing/breakdown.md"))
    ).text();
    expect(breakdown).toContain(
      "| `build.sandbox.standard-3` | 60 build seconds | 1.204938 |",
    );
    expect(breakdown).toContain("24.098743 credits");
    expect(breakdown).not.toContain("1.642857");
    const privacy = await (
      await worker.fetch(new Request("https://ohmyho.st/privacy"))
    ).text();
    expect(privacy).toContain("US East or the EU");
    expect(privacy).not.toContain(
      "New customer application/database placements are in US East.",
    );
    expect(html).not.toContain("private-ticket");
    expect(home.headers.get("content-security-policy")).toContain(
      "default-src 'none'",
    );
    expect(
      await (
        await worker.fetch(
          new Request("https://ohmyho.st/", { method: "HEAD" }),
        )
      ).text(),
    ).toBe("");
    expect(
      (
        await worker.fetch(new Request("https://ohmyho.st/favicon.svg"))
      ).headers.get("content-type"),
    ).toContain("image/svg+xml");
    expect(
      (await worker.fetch(new Request("https://ohmyho.st/missing"))).status,
    ).toBe(404);
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
          new Request(
            `https://ohmyho.st${path}?token=private&next=https://foreign.example`,
            {
              method,
            },
          ),
        );
        expect(response.status).toBe(308);
        expect(response.headers.get("location")).toBe(
          `https://docs.ohmyho.st${target}`,
        );
        expect(response.headers.get("vary")).toBe("Accept");
        expect(await response.text()).toBe("");
      }
    for (const path of ["/docs", "/docs/cli", "/api"]) {
      const response = await worker.fetch(
        new Request(`https://ohmyho.st${path}`, {
          headers: { accept: "text/markdown" },
        }),
      );
      expect(response.headers.get("location")).toBe(
        `https://docs.ohmyho.st${path === "/docs" ? "/index" : path.replace("/docs", "")}.md`,
      );
      expect(
        (
          await worker.fetch(
            new Request(`https://ohmyho.st${path}`, { method: "POST" }),
          )
        ).status,
      ).toBe(405);
    }
    const config = await worker.fetch(
      new Request("https://ohmyho.st/mcp.json"),
    );
    expect(await config.json()).toEqual({
      mcpServers: {
        ohmyho: {
          command: "ohmyhost-mcp",
          env: { OHMYHOST_ENVIRONMENT: "production" },
        },
      },
    });
    const release = await worker.fetch(
      new Request("https://ohmyho.st/client-release.json"),
    );
    expect(await release.json()).toEqual({
      version: CLIENT_RELEASE,
      manifest_url: `https://ohmyho.st/releases/${CLIENT_RELEASE}/manifest.json`,
    });
    const index = await worker.fetch(new Request("https://ohmyho.st/llms.txt"));
    const text = await index.text();
    expect(text).toContain("https://docs.ohmyho.st/quickstart.md");
    expect(text).not.toContain("https://ohmyho.st/docs/");
    expect(text).toContain("https://ohmyho.st/mcp.json");
    const sitemap = await worker.fetch(
      new Request("https://ohmyho.st/sitemap.xml"),
    );
    expect(await sitemap.text()).not.toContain("https://ohmyho.st/docs");
    const unsafe = await worker.fetch(
      new Request("https://ohmyho.st/docs//foreign.example/path.md"),
    );
    expect(new URL(unsafe.headers.get("location") ?? "").origin).toBe(
      "https://docs.ohmyho.st",
    );
  });

  it("redirects bare and unassigned Free hosts to the fixed home without ticket or query", async () => {
    for (const method of ["GET", "HEAD"]) {
      const response = await worker.fetch(
        new Request(
          "https://www.ohmyho.st/pricing?r=hostmebaby&token=private",
          { method },
        ),
      );
      expect(response.status).toBe(308);
      expect(response.headers.get("location")).toBe(
        "https://ohmyho.st/pricing?r=hostmebaby&token=private",
      );
      expect(await response.text()).toBe("");
      expect(
        (
          await worker.fetch(
            new Request("http://www.ohmyho.st/docs/mcp?r=one&r=two"),
          )
        ).headers.get("location"),
      ).toBe("https://ohmyho.st/docs/mcp?r=one&r=two");
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
    for (const host of [
      "ohmyho.st",
      "omh.st",
      "check.omh.st",
      "missing.check.omh.st",
    ]) {
      const response = await worker.fetch(
        new Request(`https://${host}/`, {
          method: "POST",
          body: "private-payload",
        }),
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
    new Request("https://ohmyho.st/releases/0.1.1/.env.local"),
    {
      ASSETS: fixture,
    },
  );
  expect(unknown.status).toBe(404);
  expect(fixture.requests).toHaveLength(1);
  expect(
    (
      await worker.fetch(
        new Request("https://ohmyho.st/.well-known/skills/index.json"),
      )
    ).headers.get("content-type"),
  ).toContain("application/json");
  const index = await (
    await worker.fetch(
      new Request("https://ohmyho.st/.well-known/skills/index.json"),
    )
  ).json();
  expect(index.skills).toHaveLength(9);
  for (const entry of index.skills) {
    const document = await worker.fetch(new Request(entry.url));
    expect(document.status).toBe(200);
    expect(await document.text()).toContain(`name: ${entry.name}`);
  }
  // Only the current release is downloadable; superseded versions never reach assets.
  const currentUrl = `https://ohmyho.st/releases/${CLIENT_RELEASE}/ohmyhost-product-cli-${CLIENT_RELEASE}.tgz`;
  expect(
    (await worker.fetch(new Request(currentUrl), { ASSETS: fixture })).status,
  ).toBe(200);
  expect(fixture.requests).toHaveLength(2);
  for (const retired of ["0.1.9", "0.1.8", "0.1.7", "0.1.6", "0.1.5"])
    expect(
      (
        await worker.fetch(
          new Request(
            `https://ohmyho.st/releases/${retired}/ohmyhost-customer-runtime-${retired}.tgz`,
          ),
          { ASSETS: fixture },
        )
      ).status,
    ).toBe(404);
  for (const invalid of [
    "https://ohmyho.st/releases/0.1.3/ohmyhost-product-cli-0.1.3.tgz",
    "https://ohmyho.st/releases/0.1.0/manifest.json",
    "https://ohmyho.st/releases/0.1.4/ohmyhost-product-cli-0.1.4.tgz",
    `https://ohmyho.st/releases/${CLIENT_RELEASE}/ohmyhost-product-cli-0.1.3.tgz`,
    "https://ohmyho.st/releases/0.1.9/manifest.json",
    `https://ohmyho.st/releases/${CLIENT_RELEASE}/.env.local`,
  ])
    expect(
      (await worker.fetch(new Request(invalid), { ASSETS: fixture })).status,
    ).toBe(404);
  expect(fixture.requests).toHaveLength(2);
});

class PublicAssetFixture {
  readonly requests: Request[] = [];
  async fetch(request: Request) {
    this.requests.push(request);
    return new Response("test-client-archive", {
      headers: { "content-type": "application/gzip" },
    });
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

describe("signup attribution", () => {
  it("carries a link's source into the page without letting it write markup", async () => {
    const assets = new SiteAssetFixture();
    const home = await worker.fetch(
      new Request('https://ohmyho.st/?r=launch"><script>alert(1)</script>'),
      { ASSETS: assets },
    );
    const html = await home.text();
    // The source reaches the page as an escaped attribute, never as markup.
    expect(html).toContain(
      '<meta name="ohmyhost-signup-source" content="launch',
    );
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&quot;");
    expect(home.headers.get("set-cookie")).toContain("omh_referral=");

    // A document page carries the same attribution, and takes it from the cookie too.
    const document = await worker.fetch(
      new Request("https://ohmyho.st/pricing", {
        headers: { cookie: "omh_referral=partner-a" },
      }),
      { ASSETS: assets },
    );
    expect(await document.text()).toContain(
      '<meta name="ohmyhost-signup-source" content="partner-a">',
    );
  });
});
