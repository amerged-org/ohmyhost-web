import { eligibleSource, siteBetaResponse, type PublicControlBinding } from "./beta-entry.js";
import {
  customerDocument,
  isClientDownload,
  DOCUMENTATION,
  documentationRedirect,
} from "./customer-entry.js";
import { SITE_ICON } from "./generated-site-frame.js";
const HOME = "https://ohmyho.st/";

export default {
  async fetch(
    request: Request,
    env?: {
      ASSETS: { fetch(request: Request): Promise<Response> };
      CONTROL_API?: PublicControlBinding;
    },
  ): Promise<Response> {
    const url = new URL(request.url);
    const host = url.hostname;
    const ownHost =
      host === "ohmyho.st" ||
      host === "www.ohmyho.st" ||
      host === "omh.st" ||
      host === "check.omh.st" ||
      host.endsWith(".check.omh.st");
    const headers = new Headers({
      "cache-control": "no-store",
      "referrer-policy": "no-referrer",
      "x-content-type-options": "nosniff",
      "content-security-policy":
        "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    });
    if (!ownHost || !["https:", "http:"].includes(url.protocol))
      return new Response(null, { status: 404, headers });
    if (url.origin === "https://ohmyho.st") {
      const beta = await siteBetaResponse(request, env?.CONTROL_API);
      if (beta) {
        for (const [key, value] of headers)
          if (key !== "content-security-policy") beta.headers.set(key, value);
        return request.method === "HEAD" ? new Response(null, beta) : beta;
      }
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      headers.set("allow", "GET, HEAD");
      return new Response(null, { status: 405, headers });
    }
    const sources = url.searchParams.getAll("r");
    const querySource =
      sources.length === 1 && /^[^\p{Cc}]{1,64}$/u.test(sources[0] ?? "") ? sources[0] : undefined;
    if (host === "www.ohmyho.st") {
      const target = new URL(HOME);
      target.pathname = url.pathname;
      if (querySource) target.searchParams.set("r", querySource);
      headers.set("location", target.href);
      return new Response(null, { status: 308, headers });
    }
    let cookieSource: string | undefined;
    try {
      const value = request.headers
        .get("cookie")
        ?.split(";")
        .map((item) => item.trim())
        .find((item) => item.startsWith("omh_referral="));
      if (value) {
        const decoded = decodeURIComponent(value.slice("omh_referral=".length));
        if (/^[^\p{Cc}]{1,64}$/u.test(decoded)) cookieSource = decoded;
      }
    } catch {
      /* Ignore malformed optional attribution cookies. */
    }
    const source = sources.length ? querySource : cookieSource;
    const invitation = source === "hostmebaby" ? source : undefined;
    const contentPage =
      ["/", "/brand", "/api", "/login"].includes(url.pathname) ||
      url.pathname === "/docs.md" ||
      url.pathname === "/docs" ||
      url.pathname.startsWith("/docs/") ||
      customerDocument(url.pathname)?.type.startsWith("text/html");
    if (host === "ohmyho.st" && url.protocol === "https:" && contentPage && querySource) {
      headers.set(
        "set-cookie",
        `omh_referral=${encodeURIComponent(querySource)}; Path=/; Secure; HttpOnly; SameSite=Lax; Max-Age=2592000`,
      );
      try {
        await eligibleSource(querySource, env?.CONTROL_API, request);
      } catch {
        /* Attribution availability does not block public pages. */
      }
    }
    if (url.pathname === "/0.sh" && (host === "omh.st" || host === "ohmyho.st")) {
      if (url.protocol !== "https:") {
        headers.set("location", "https://omh.st/0.sh");
        return new Response(null, { status: 308, headers });
      }
      headers.set("content-type", "text/x-shellscript; charset=utf-8");
      if (!env?.ASSETS)
        return new Response(request.method === "HEAD" ? null : "Installer unavailable.", {
          status: 503,
          headers,
        });
      const script = await env.ASSETS.fetch(new Request(`${HOME}pages/0.sh`));
      if (!script.ok) return new Response(null, { status: script.status, headers });
      const installerSource = invitation
        ? await eligibleSource(invitation, env.CONTROL_API, request)
        : undefined;
      const text = (await script.text()).replace(
        "set -euo pipefail",
        `set -euo pipefail\nOHMYHOST_SIGNUP_SOURCE='${installerSource ?? ""}'`,
      );
      return new Response(request.method === "HEAD" ? null : text, { headers });
    }
    if (host !== "ohmyho.st" || url.protocol !== "https:") {
      const referralHost = host === "omh.st" || host === "check.omh.st";
      headers.set(
        "location",
        referralHost && source !== undefined ? `${HOME}?r=${encodeURIComponent(source)}` : HOME,
      );
      return new Response(null, { status: 302, headers });
    }
    if (url.pathname === "/robots.txt") {
      headers.set("content-type", "text/plain; charset=utf-8");
      return new Response(
        request.method === "HEAD"
          ? null
          : "User-agent: *\nAllow: /\nDisallow: /login\nDisallow: /*?r=\nSitemap: https://ohmyho.st/sitemap.xml\n",
        { headers },
      );
    }
    if (url.pathname === "/sitemap.xml") {
      headers.set("content-type", "application/xml; charset=utf-8");
      const paths = [
        "/",
        "/brand",
        ...Object.keys(DOCUMENTATION).filter((path) => path !== "/login" && !path.endsWith(".md")),
      ];
      return new Response(
        request.method === "HEAD"
          ? null
          : `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...new Set(paths)].map((path) => `<url><loc>https://ohmyho.st${path}</loc></url>`).join("")}</urlset>`,
        { headers },
      );
    }
    if (url.pathname === "/login") {
      headers.set(
        "location",
        `https://app.ohmyho.st/login${source ? `?r=${encodeURIComponent(source)}` : ""}`,
      );
      return new Response(null, { status: 302, headers });
    }
    const wantsMarkdown = request.headers.get("accept")?.includes("text/markdown") === true;
    const redirect = documentationRedirect(url.pathname, wantsMarkdown);
    if (redirect) {
      headers.set("location", redirect);
      headers.set("vary", "Accept");
      return new Response(null, { status: 308, headers });
    }
    const documentPath = url.pathname;
    const document = customerDocument(documentPath);
    if (document) {
      let documentText = document.text;
      if (!invitation && document.type.startsWith("text/html"))
        documentText = documentText.replace(
          /<a\b[^>]*href="(?:https:\/\/ohmyho\.st)?\/login(?:\?[^" ]*)?"[^>]*>[\s\S]*?<\/a>/gu,
          "",
        );
      if (invitation)
        documentText = documentText.replaceAll('href="/login"', 'href="/login?r=hostmebaby"');
      if (document.type.startsWith("text/html")) {
        const hashes = [];
        for (const script of documentText.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gu)) {
          const hash = new Uint8Array(
            await crypto.subtle.digest("SHA-256", new TextEncoder().encode(script[1] ?? "")),
          );
          hashes.push(`'sha256-${btoa(String.fromCharCode(...hash))}'`);
        }
        headers.set(
          "content-security-policy",
          `default-src 'none'; script-src 'self' ${hashes.join(" ")}; style-src 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'`,
        );
        if (invitation)
          documentText = documentText.replace(
            "</head>",
            `<meta name="ohmyhost-signup-source" content="${invitation}"></head>`,
          );
      }
      headers.set("content-type", document.type);
      headers.set("vary", "Accept");
      if (document.type.startsWith("text/html"))
        headers.set("link", `<${url.pathname}.md>; rel="alternate"; type="text/markdown"`);
      return new Response(request.method === "HEAD" ? null : documentText, {
        status: 200,
        headers,
      });
    }
    if (isClientDownload(url.pathname)) {
      if (!env?.ASSETS)
        return new Response("Client release is unavailable.", { status: 503, headers });
      const asset = await env.ASSETS.fetch(
        new Request(`${HOME.slice(0, -1)}${url.pathname}`, { method: request.method }),
      );
      const response = new Response(asset.body, asset);
      for (const [name, value] of headers) response.headers.set(name, value);
      if (response.ok) response.headers.set("cache-control", "public, max-age=31536000, immutable");
      return response;
    }
    if (url.pathname === "/favicon.svg") {
      headers.set("content-type", "image/svg+xml");
      return new Response(request.method === "HEAD" ? null : SITE_ICON, { headers });
    }
    const pages: Record<string, string> = {
      "/": "home.html",
      "/og.png": "og.png",
      "/logo.png": "logo.png",
      "/favicon.ico": "brand-assets/favicon.ico",
      "/apple-touch-icon.png": "brand-assets/apple-touch-icon.png",
      ...Object.fromEntries(
        [
          "omega-light.svg",
          "omega-dark.svg",
          "omega-light.png",
          "omega-dark.png",
          "favicon.svg",
          "favicon.ico",
          "apple-touch-icon.png",
          "founder.png",
          "og.png",
        ].map((file) => [`/brand/assets/${file}`, `brand-assets/${file}`]),
      ),
      "/index.md": "index.md",
      "/brand": "brand.html",
      "/brand.md": "brand.md",
      "/api/openapi.yaml": "openapi.yaml",
      "/api/openapi.json": "openapi.json",
    };
    const markdownPath = url.pathname === "/" ? "/index.md" : `${url.pathname}.md`;
    const selected = wantsMarkdown && pages[markdownPath] ? markdownPath : url.pathname;
    const page = pages[selected];
    const logo =
      /^\/logos\/(?:composio|github|make|n8n|nextjs|postgres|react|tanstack|vite|zapier|auth0|betterauth|workos|gdrive|s3|r2)\.svg$/u.test(
        url.pathname,
      );
    const font = /^\/fonts\/[a-f0-9]{16}\.ttf$/u.test(url.pathname);
    if (!page && !logo && !font) {
      const apiRequest = url.pathname.startsWith("/v1/");
      headers.set(
        "content-type",
        apiRequest ? "application/problem+json" : "text/markdown; charset=utf-8",
      );
      const body = apiRequest
        ? JSON.stringify({
            type: "https://ohmyho.st/api/errors/resource-not-found",
            title: "Resource not found",
            status: 404,
            code: "resource_not_found",
            detail:
              "The product API base is https://app.ohmyho.st/v1. Read https://ohmyho.st/api/openapi.json.",
          })
        : "# Page not found\n\nRead [llms.txt](https://ohmyho.st/llms.txt), the [documentation index](https://docs.ohmyho.st/llms.txt), or [OpenAPI](https://ohmyho.st/api/openapi.json).\n";
      return new Response(request.method === "HEAD" ? null : body, { status: 404, headers });
    }
    if (!env?.ASSETS)
      return new Response(request.method === "HEAD" ? null : "Page is unavailable.", {
        status: 503,
        headers,
      });
    const asset = await env.ASSETS.fetch(
      new Request(`${HOME.slice(0, -1)}${logo || font ? url.pathname : `/pages/${page}`}`),
    );
    if (!asset.ok) return new Response(null, { status: asset.status, headers });
    if (page?.endsWith(".png") || page?.endsWith(".ico") || font) {
      headers.set(
        "content-type",
        font ? "font/ttf" : page?.endsWith(".ico") ? "image/x-icon" : "image/png",
      );
      if (font) headers.set("access-control-allow-origin", "*");
      return new Response(request.method === "HEAD" ? null : asset.body, { headers });
    }
    let body = await asset.text();
    const type =
      logo || page?.endsWith(".svg")
        ? "image/svg+xml"
        : page?.endsWith(".md")
          ? "text/markdown; charset=utf-8"
          : page?.endsWith(".yaml")
            ? "application/yaml; charset=utf-8"
            : page?.endsWith(".json")
              ? "application/json; charset=utf-8"
              : "text/html; charset=utf-8";
    if (type.startsWith("text/html")) {
      if (!invitation)
        body = body.replace(
          /<a\b[^>]*href="(?:https:\/\/ohmyho\.st)?\/login(?:\?[^" ]*)?"[^>]*>[\s\S]*?<\/a>/gu,
          "",
        );
      else
        body = body.replaceAll(
          'href="https://ohmyho.st/login"',
          'href="https://ohmyho.st/login?r=hostmebaby"',
        );
      const hashes: string[] = [];
      for (const script of body.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gu)) {
        const hash = new Uint8Array(
          await crypto.subtle.digest("SHA-256", new TextEncoder().encode(script[1] ?? "")),
        );
        hashes.push(`'sha256-${btoa(String.fromCharCode(...hash))}'`);
      }
      headers.set(
        "content-security-policy",
        `default-src 'none'; script-src 'self' ${hashes.join(" ")}; style-src 'unsafe-inline'; font-src 'self'; img-src 'self' data:; connect-src 'self'; worker-src blob:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'`,
      );
      headers.set("link", `<${markdownPath}>; rel="alternate"; type="text/markdown"`);
      if (page === "home.html" && invitation)
        body = body.replace(
          "</head>",
          `<meta name="ohmyhost-signup-source" content="${invitation}"></head>`,
        );
    }
    headers.set("content-type", type);
    headers.set("vary", "Accept");
    return new Response(request.method === "HEAD" ? null : body, { headers });
  },
};
