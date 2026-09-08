const HOME = "https://ohmyho.st/";
const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="ohmyho.st — hosting for applications and agents.">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<title>ohmyho.st</title>
<style>
:root{color-scheme:dark;font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#080808;color:#f5f5f5}
*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;padding:32px}
main{width:min(100%,760px)}.label{font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#a3a3a3}
h1{font-size:clamp(56px,12vw,112px);line-height:1;letter-spacing:-.075em;font-weight:650;margin:24px 0 32px}
.intro{font-size:clamp(20px,3vw,28px);line-height:1.5;max-width:520px;color:#d4d4d4}
footer{margin-top:72px;border-top:1px solid #262626;padding-top:24px;font-size:14px;line-height:1.6;color:#a3a3a3}
</style>
</head>
<body><main>
<p class="label">Your code. Your agent. Your host.</p>
<h1>ohmyho.st</h1>
<p class="intro">Hosting for applications and agents.</p>
<footer>Currently in private testing.</footer>
</main></body>
</html>`;
const ICON =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#080808"/><text x="12" y="47" fill="#f5f5f5" font-family="sans-serif" font-size="48" font-weight="700">o</text></svg>';

export default {
  fetch(request: Request): Response {
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
    if (request.method !== "GET" && request.method !== "HEAD") {
      headers.set("allow", "GET, HEAD");
      return new Response(null, { status: 405, headers });
    }
    const sources = url.searchParams.getAll("r");
    const source =
      sources.length === 1 && /^[a-z0-9][a-z0-9_-]{0,63}$/u.test(sources[0] ?? "")
        ? sources[0]
        : undefined;
    if (host !== "ohmyho.st" || url.protocol !== "https:") {
      const referralHost = host === "omh.st" || host === "check.omh.st";
      headers.set("location", referralHost && source !== undefined ? `${HOME}?r=${source}` : HOME);
      return new Response(null, { status: 302, headers });
    }
    if (url.pathname !== "/" && url.pathname !== "/favicon.svg")
      return new Response(null, { status: 404, headers });
    const icon = url.pathname === "/favicon.svg";
    const page =
      source === undefined || icon
        ? PAGE
        : PAGE.replace(
            "</head>",
            `<meta name="ohmyhost-signup-source" content="${source}">\n</head>`,
          );
    headers.set("content-type", icon ? "image/svg+xml" : "text/html; charset=utf-8");
    return new Response(request.method === "HEAD" ? null : icon ? ICON : page, {
      status: 200,
      headers,
    });
  },
};
