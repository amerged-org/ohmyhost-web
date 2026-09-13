import { eligibleSource, siteBetaResponse, type PublicControlBinding } from "./beta-entry.js";
import { customerDocument, isClientDownload, DOCUMENTATION } from "./customer-entry.js";
const HOME = "https://ohmyho.st/";
const ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#080808"/><text x="12" y="47" fill="#f5f5f5" font-family="sans-serif" font-size="48" font-weight="700">o</text></svg>';

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
    const source =
      sources.length === 1 && /^[a-z0-9][a-z0-9_-]{0,63}$/u.test(sources[0] ?? "")
        ? sources[0]
        : undefined;
    let invitation: string | undefined;
    if (
      source &&
      (["/", "/0.sh", "/login"].includes(url.pathname) ||
        customerDocument(url.pathname)?.type.startsWith("text/html"))
    ) {
      try {
        invitation = await eligibleSource(source, env?.CONTROL_API, request);
      } catch {
        return new Response(
          request.method === "HEAD" ? null : "Invitation check unavailable. Please retry.",
          { status: 503, headers },
        );
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
      const text = (await script.text()).replace(
        "set -euo pipefail",
        `set -euo pipefail\nOHMYHOST_SIGNUP_SOURCE='${invitation ?? ""}'`,
      );
      return new Response(request.method === "HEAD" ? null : text, { headers });
    }
    if (host !== "ohmyho.st" || url.protocol !== "https:") {
      const referralHost = host === "omh.st" || host === "check.omh.st";
      headers.set("location", referralHost && source !== undefined ? `${HOME}?r=${source}` : HOME);
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
        "/api",
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
      headers.set("location", `https://app.ohmyho.st/login${invitation ? `?r=${invitation}` : ""}`);
      return new Response(null, { status: 302, headers });
    }
    const wantsMarkdown = request.headers.get("accept")?.includes("text/markdown") === true;
    const documentPath =
      wantsMarkdown && url.pathname.startsWith("/docs") && !url.pathname.endsWith(".md")
        ? `${url.pathname}.md`
        : url.pathname;
    const document = customerDocument(documentPath);
    if (document) {
      let documentText = document.text;
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
      return new Response(request.method === "HEAD" ? null : ICON, { headers });
    }
    const pages: Record<string, string> = {
      "/": "home.html",
      "/og.png": "og.png",
      "/logo.png": "logo.png",
      "/index.md": "index.md",
      "/brand": "brand.html",
      "/brand.md": "brand.md",
      "/api": "api.html",
      "/api.md": "api.md",
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
    if (!page && !logo && !font) return new Response(null, { status: 404, headers });
    if (!env?.ASSETS)
      return new Response(request.method === "HEAD" ? null : "Page is unavailable.", {
        status: 503,
        headers,
      });
    const asset = await env.ASSETS.fetch(
      new Request(`${HOME.slice(0, -1)}${logo || font ? url.pathname : `/pages/${page}`}`),
    );
    if (!asset.ok) return new Response(null, { status: asset.status, headers });
    if (page?.endsWith(".png") || font) {
      headers.set("content-type", font ? "font/ttf" : "image/png");
      if (font) headers.set("access-control-allow-origin", "*");
      return new Response(request.method === "HEAD" ? null : asset.body, { headers });
    }
    let body = await asset.text();
    const type = logo
      ? "image/svg+xml"
      : page?.endsWith(".md")
        ? "text/markdown; charset=utf-8"
        : page?.endsWith(".yaml")
          ? "application/yaml; charset=utf-8"
          : page?.endsWith(".json")
            ? "application/json; charset=utf-8"
            : "text/html; charset=utf-8";
    if (type.startsWith("text/html")) {
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
