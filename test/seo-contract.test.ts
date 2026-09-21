import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

import { expect, it } from "vitest";
import { schemaDate } from "../src/site-identity.js";

import { DOCUMENTATION, customerDocument } from "../src/customer-entry.js";
import { PAGE_META, pageMeta } from "../src/page-meta.js";
import { footerColumnsHtml } from "../src/site-links.js";
import worker from "../src/worker-main.js";

const publicDir = new URL("../public/", import.meta.url);

function htmlPages(): string[] {
  return Object.keys(DOCUMENTATION).filter(
    (path) => !path.endsWith(".md") && path !== "/login",
  );
}

function jsonLd(html: string): Array<Record<string, unknown>> {
  const script = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/u,
  )?.[1];
  expect(script, "JSON-LD script").toBeDefined();
  const parsed = JSON.parse(script ?? "{}") as {
    "@graph"?: Array<Record<string, unknown>>;
  };
  return parsed["@graph"] ?? [];
}

function attribute(html: string, tag: string): string {
  const match = html.match(new RegExp(`<meta ${tag} content="([^"]*)"`, "u"));
  expect(match, tag).not.toBeNull();
  return match?.[1] ?? "";
}

it("publishes the SEO contract for every rendered page", async () => {
  const paths = htmlPages();
  expect([...Object.keys(PAGE_META)].sort()).toEqual(
    [...paths, "/login"].sort(),
  );
  for (const [path, meta] of Object.entries(PAGE_META))
    if (meta.parent)
      expect(Object.keys(PAGE_META), `${path} parent`).toContain(meta.parent);
  const served = new Set([
    ...Object.keys(DOCUMENTATION),
    ...Object.keys(DOCUMENTATION).map((path) => `${path}.md`),
    "/",
    "/brand",
    "/index.md",
    "/llms.txt",
    "/mcp.json",
    "/mcp-tools.json",
    "/api/openapi.json",
    "/api/openapi.yaml",
  ]);
  for (const path of paths) {
    const document = customerDocument(path);
    expect(document?.type, path).toContain("text/html");
    const html = document?.text ?? "";
    expect(html.match(/class="copy-code"/gu)?.length ?? 0).toBe(
      html.match(/<pre><code/gu)?.length ?? 0,
    );
    const meta = pageMeta(path);
    expect(
      html.match(/<meta name="description"/gu),
      `${path} description count`,
    ).toHaveLength(1);
    const description = attribute(html, 'name="description"');
    expect(
      description.length,
      `${path} description length`,
    ).toBeGreaterThanOrEqual(120);
    expect(
      description.length,
      `${path} description length`,
    ).toBeLessThanOrEqual(160);
    expect(description).toBe(meta.description);
    const title = html.match(/<title>([^<]*)<\/title>/u)?.[1] ?? "";
    expect(title.length, `${path} title length`).toBeGreaterThanOrEqual(40);
    expect(title.length, `${path} title length`).toBeLessThanOrEqual(60);
    expect(title).toBe(meta.title);
    expect(html).toContain(
      `<link rel="canonical" href="https://ohmyho.st${path}">`,
    );
    expect(html).toContain(
      `<link rel="alternate" type="text/markdown" href="${path}.md">`,
    );
    expect(attribute(html, 'property="og:title"')).toBe(
      meta.socialTitle ?? meta.title,
    );
    expect(attribute(html, 'property="og:description"')).toBe(
      meta.socialDescription ?? meta.description,
    );
    expect(attribute(html, 'property="og:url"')).toBe(
      `https://ohmyho.st${path}`,
    );
    expect(attribute(html, 'name="twitter:card"')).toBe("summary_large_image");
    const image = attribute(html, 'property="og:image"');
    expect(image.startsWith("https://ohmyho.st/"), `${path} og:image`).toBe(
      true,
    );
    const imagePath = image.slice("https://ohmyho.st".length);
    if (imagePath !== "/og.png")
      expect(
        existsSync(new URL(`.${imagePath}`, publicDir)),
        `${path} ${imagePath}`,
      ).toBe(true);
    const graph = jsonLd(html);
    const types = graph.map((node) => node["@type"]);
    expect(types, path).toContain("BreadcrumbList");
    expect(types, path).toContain("Organization");
    expect(
      types.some((type) =>
        ["WebPage", "AboutPage", "CollectionPage"].includes(String(type)),
      ),
      `${path} page node`,
    ).toBe(true);
    const crumbs = graph.find((node) => node["@type"] === "BreadcrumbList") as {
      itemListElement: Array<{ item: string }>;
    };
    expect(crumbs.itemListElement[0]?.item).toBe("https://ohmyho.st/");
    expect(crumbs.itemListElement.at(-1)?.item).toBe(
      `https://ohmyho.st${path}`,
    );
    const footer = html.slice(html.lastIndexOf("<footer>"));
    expect(footer, `${path} footer`).toContain(footerColumnsHtml());
    expect(
      footer.match(/href="\//gu)?.length ?? 0,
      `${path} footer links`,
    ).toBeGreaterThanOrEqual(15);
    for (const [, link] of html.matchAll(/href="(\/[^"#?]*)/gu)) {
      const href = link ?? "";
      expect(
        served.has(href) ||
          href.startsWith("/skills/") ||
          href.startsWith("/docs") ||
          href.startsWith("/brand/assets/") ||
          href.startsWith("/og/") ||
          href.startsWith("/shots/") ||
          href === "/api" ||
          href === "/favicon.svg" ||
          href === "/favicon.ico" ||
          href === "/apple-touch-icon.png",
        `${path} links to ${href}`,
      ).toBe(true);
    }
    const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
    for (const [anchor] of main.matchAll(
      /<a href="https?:\/\/(?!ohmyho\.st\/)[^>]*>/gu,
    ))
      expect(anchor, `${path} external link`).toContain('rel="noopener"');
    if (/^## FAQ$/mu.test(DOCUMENTATION[path] ?? "")) {
      const faq = graph.find((node) => node["@type"] === "FAQPage") as {
        mainEntity: unknown[];
      };
      const section =
        (DOCUMENTATION[path] ?? "")
          .split(/^## FAQ$/mu)[1]
          ?.split(/^## /mu)[0] ?? "";
      expect(faq.mainEntity, `${path} FAQ`).toHaveLength(
        section.match(/^### /gmu)?.length ?? 0,
      );
    }
    if (meta.kind === "howto") {
      const howTo = graph.find((node) => node["@type"] === "HowTo") as {
        step: unknown[];
      };
      expect(howTo.step.length, `${path} HowTo steps`).toBeGreaterThanOrEqual(
        3,
      );
    }
    if (meta.kind === "article") {
      const post = graph.find(
        (node) => node["@type"] === "BlogPosting",
      ) as Record<string, unknown>;
      expect(post["datePublished"]).toBe(
        schemaDate(meta.published ?? meta.modified),
      );
      expect(html).toContain(
        `<meta property="article:published_time" content="${schemaDate(meta.published ?? meta.modified)}">`,
      );
    }
    const mirror = customerDocument(`${path}.md`)?.text ?? "";
    expect(mirror.startsWith("# "), `${path} markdown mirror`).toBe(true);
    expect(mirror).not.toContain("<svg");
  }
  const about = jsonLd(customerDocument("/about")?.text ?? "");
  expect(about.map((node) => node["@type"])).toContain("AboutPage");
  expect(about.map((node) => node["@type"])).not.toContain("Person");
  const aboutHtml = customerDocument("/about")?.text ?? "";
  expect(aboutHtml).not.toMatch(
    /Sebastian Mertens|42154221|founder\.png|Not yet|What is not there yet/u,
  );
  expect(aboutHtml).toContain("Apache-2.0");
  const blog = jsonLd(customerDocument("/blog")?.text ?? "").find(
    (node) => node["@type"] === "Blog",
  ) as {
    blogPost: unknown[];
  };
  expect(blog.blogPost).toHaveLength(
    paths.filter((path) => path.startsWith("/blog/")).length,
  );
  for (const path of paths.filter((path) => path.startsWith("/blog/")))
    expect(DOCUMENTATION["/blog"]).toContain(`](${path})`);
});

it("serves crawler, cache and transport metadata", async () => {
  const assets = new PagesFixture();
  const robots = await worker.fetch(
    new Request("https://ohmyho.st/robots.txt"),
  );
  const rules = await robots.text();
  expect(rules).toContain(
    "User-agent: *\nAllow: /\nDisallow: /login\nDisallow: /*?r=\n",
  );
  for (const agent of [
    "GPTBot",
    "ClaudeBot",
    "anthropic-ai",
    "PerplexityBot",
    "OAI-SearchBot",
  ])
    expect(rules).toContain(`User-agent: ${agent}\n`);
  expect(rules).toContain("Sitemap: https://ohmyho.st/sitemap.xml\n");
  expect(robots.headers.get("cache-control")).toBe("public, max-age=3600");
  const sitemap = await worker.fetch(
    new Request("https://ohmyho.st/sitemap.xml"),
  );
  const xml = await sitemap.text();
  expect(sitemap.headers.get("cache-control")).toBe("public, max-age=3600");
  const urls = [
    ...xml.matchAll(
      /<url><loc>https:\/\/ohmyho\.st([^<]*)<\/loc><lastmod>(\d{4}-\d{2}-\d{2})<\/lastmod><\/url>/gu,
    ),
  ];
  expect(urls.length).toBe(xml.match(/<url>/gu)?.length);
  const listed = urls.map((entry) => entry[1] ?? "");
  for (const path of [
    "/",
    "/brand",
    "/philosophy",
    "/open-source",
    "/blog",
    ...htmlPages(),
  ])
    expect(listed, path).toContain(path);
  expect(listed).not.toContain("/login");
  expect(listed.some((path) => path.endsWith(".md"))).toBe(false);
  for (const [path, meta] of Object.entries(PAGE_META))
    if (path !== "/login")
      expect(urls.find((entry) => entry[1] === path)?.[2], path).toBe(
        meta.modified,
      );
  for (const url of [
    "https://ohmyho.st/",
    "https://ohmyho.st/about",
    "https://ohmyho.st/docs",
    "https://ohmyho.st/missing",
  ]) {
    const response = await worker.fetch(new Request(url), { ASSETS: assets });
    expect(response.headers.get("strict-transport-security"), url).toBe(
      "max-age=31536000; includeSubDomains",
    );
  }
  expect(
    (await worker.fetch(new Request("https://ohmyho.st/about"))).headers.get(
      "cache-control",
    ),
  ).toBe("public, max-age=0, s-maxage=300, must-revalidate");
  const font = await worker.fetch(
    new Request("https://ohmyho.st/fonts/3386a05f6ece969e.ttf"),
    {
      ASSETS: assets,
    },
  );
  expect(font.headers.get("cache-control")).toBe(
    "public, max-age=31536000, immutable",
  );
  const logo = await worker.fetch(
    new Request("https://ohmyho.st/logos/workos.svg"),
    {
      ASSETS: assets,
    },
  );
  expect(logo.headers.get("cache-control")).toBe("public, max-age=86400");
  const favicon = await worker.fetch(
    new Request("https://ohmyho.st/favicon.svg"),
  );
  expect(favicon.headers.get("cache-control")).toBe("public, max-age=86400");
});

it("hardens the approved homepage markup for search and social", async () => {
  const assets = new PagesFixture();
  const home = await (
    await worker.fetch(new Request("https://ohmyho.st/"), { ASSETS: assets })
  ).text();
  expect(home).toContain('<main class="wrap">');
  expect(home.match(/<meta name="description"/gu)).toHaveLength(1);
  expect(home).not.toContain('href="#"');
  const columns = home.slice(
    home.indexOf('<div class="fcol">'),
    home.indexOf('<div class="fbot">'),
  );
  expect(columns.trim()).toBe(`${footerColumnsHtml()}\n  </div>`);
  expect(home).toContain('href="/philosophy"');
  expect(home).toContain('href="/open-source"');
  expect(home).not.toContain("github.com/amerged/docs");
  for (const [img] of home.matchAll(/<img src="logos\/[^"]+"[^>]*>/gu))
    expect(img).toMatch(/width="\d+" height="\d+"/u);
  for (const [anchor] of home.matchAll(
    /<a [^>]*href="https:\/\/docs\.ohmyho\.st[^>]*>/gu,
  ))
    expect(anchor).toContain('rel="noopener"');
  // The owner's approved social copy is set in page preparation and may differ from the meta
  // description on purpose; the contract is that both exist and are not empty.
  expect(attribute(home, 'property="og:description"').length).toBeGreaterThan(
    20,
  );
  expect(attribute(home, 'name="twitter:description"').length).toBeGreaterThan(
    20,
  );
  const brand = await (
    await worker.fetch(new Request("https://ohmyho.st/brand"), {
      ASSETS: assets,
    })
  ).text();
  expect(brand.match(/<meta name="description"/gu)).toHaveLength(1);
  expect(brand).toContain(
    '<meta property="og:image" content="https://ohmyho.st/og.png">',
  );
});

class PagesFixture {
  async fetch(request: Request) {
    const path = new URL(request.url).pathname;
    if (
      !/^\/(?:pages\/[a-z0-9./-]+|logos\/[a-z0-9]+\.svg|fonts\/[a-f0-9]{16}\.ttf|og\/[a-z0-9-]+\.png|shots\/[a-z0-9-]+\.png)$/u.test(
        path,
      )
    )
      return new Response(null, { status: 404 });
    const file = new URL(`.${path}`, publicDir);
    if (!existsSync(file)) return new Response(null, { status: 404 });
    return new Response(new Uint8Array(await readFile(file)));
  }
}
