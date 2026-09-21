import { SITE_ORIGIN } from "./site-identity.js";

/** Cache only anonymous editorial representations; a region hint stays in the browser cache. */
export async function editorialResponse(
  request: Request,
  body: string,
  headers: Headers,
  canonicalPath: string,
): Promise<Response> {
  const markdown = headers.get("content-type")?.startsWith("text/markdown");
  if (markdown)
    headers.set("link", `<${SITE_ORIGIN}${canonicalPath}>; rel="canonical"`);
  headers.set(
    "vary",
    "Accept, Cookie, Authorization, Sec-Fetch-Mode, Sec-Fetch-Dest",
  );
  const personalized =
    new URL(request.url).searchParams.has("r") ||
    request.headers.has("cookie") ||
    request.headers.has("authorization") ||
    headers.has("set-cookie");
  if (!personalized) {
    const navigation = request.headers.get("sec-fetch-mode") === "navigate";
    headers.set(
      "cache-control",
      navigation && !markdown
        ? "private, no-cache"
        : "public, max-age=0, s-maxage=300, must-revalidate",
    );
    const digest = new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(body)),
    );
    const etag = `W/"${Array.from(digest, (byte) => byte.toString(16).padStart(2, "0")).join("")}"`;
    headers.set("etag", etag);
    const matches = request.headers
      .get("if-none-match")
      ?.split(",")
      .some(
        (tag) =>
          tag.trim() === "*" ||
          tag.trim().replace(/^W\//u, "") === etag.slice(2),
      );
    if (matches) return new Response(null, { status: 304, headers });
  }
  return new Response(request.method === "HEAD" ? null : body, { headers });
}

/** Honor explicit exclusions and quality weights; HTML wins ties, including browser wildcards. */
export function prefersMarkdown(accept: string | null): boolean {
  const ranges = (accept ?? "text/html")
    .toLowerCase()
    .split(",")
    .map((part) => {
      const [type, ...parameters] = part.trim().split(";");
      const quality =
        parameters
          .map((parameter) => parameter.trim())
          .find((parameter) => parameter.startsWith("q="))
          ?.slice(2) ?? "1";
      return {
        type,
        q: /^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/u.test(quality)
          ? Number(quality)
          : 0,
      };
    });
  const quality = (type: string): number => {
    for (const candidate of [type, "text/*", "*/*"]) {
      const matches = ranges.filter((range) => range.type === candidate);
      if (matches.length) return Math.max(...matches.map((range) => range.q));
    }
    return 0;
  };
  return quality("text/markdown") > quality("text/html");
}
