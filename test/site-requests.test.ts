import { expect, it } from "vitest";

import { signupSource, siteRequestResponse } from "../src/site-requests.js";

const VOTES = {
  votes: [
    { feature: "eu", choice: null },
    { feature: "iso27001", choice: "up" },
    { feature: "soc2", choice: null },
  ],
};
const STATS = { deploys_7d: 12, observed_at: "2026-09-21T06:00:00.000Z" };

/** Answers like the platform's public endpoints, and records which paths were asked for. */
function controlApi(overrides: Record<string, () => Response> = {}) {
  const paths: string[] = [];
  return {
    paths,
    fetch: async (request: Request) => {
      const path = new URL(request.url).pathname;
      paths.push(path);
      const override = overrides[path];
      if (override) return override();
      if (path === "/v1/site/stats") return Response.json(STATS);
      if (path === "/v1/site/feature-interests")
        return request.method === "GET"
          ? Response.json(VOTES)
          : Response.json(
              { accepted: true, votes: VOTES.votes },
              { status: 202 },
            );
      if (path === "/v1/contact-requests")
        return Response.json({ accepted: true }, { status: 202 });
      return new Response(null, { status: 404 });
    },
  };
}

const site = (path: string, init: RequestInit = {}) =>
  new Request(`https://ohmyho.st${path}`, init);
const posted = (path: string, body: unknown, cookie?: string) =>
  site(path, {
    method: "POST",
    headers: {
      origin: "https://ohmyho.st",
      "content-type": "application/json",
      ...(cookie ? { cookie } : {}),
    },
    body: JSON.stringify(body),
  });

it("answers only the site's own paths and needs the control API for them", async () => {
  expect(await siteRequestResponse(site("/pricing"))).toBeNull();
  const wrongMethod = await siteRequestResponse(
    site("/stats.json", { method: "DELETE" }),
  );
  expect(wrongMethod?.status).toBe(405);
  const unavailable = await siteRequestResponse(site("/stats.json"));
  expect(unavailable?.status).toBe(503);
  expect(await unavailable?.json()).toEqual({ code: "service_unavailable" });
});

it("reads roadmap votes and public statistics through the site endpoints", async () => {
  const api = controlApi();

  const votes = await siteRequestResponse(site("/want"), api);
  expect(votes?.status).toBe(200);
  expect(await votes?.json()).toEqual(VOTES);
  expect(votes?.headers.get("set-cookie")).toContain("omh_voter=");

  const stats = await siteRequestResponse(site("/stats.json"), api);
  expect(await stats?.json()).toEqual(STATS);

  const status = await siteRequestResponse(site("/status.json"), api);
  const body = (await status?.json()) as {
    ok: boolean;
    components: { name: string }[];
  };
  expect(body.ok).toBe(false);
  expect(body.components).toHaveLength(6);

  // The website talks to /v1/site, never to a path named after a phase of the product.
  expect(api.paths.every((path) => !path.includes("beta"))).toBe(true);
  expect(api.paths).toContain("/v1/site/feature-interests");
  expect(api.paths).toContain("/v1/site/stats");
});

it("refuses a foreign origin, a wrong content type and an oversized or malformed body", async () => {
  const api = controlApi();
  const foreign = await siteRequestResponse(
    site("/want", {
      method: "POST",
      headers: { origin: "https://evil.example" },
    }),
    api,
  );
  expect(foreign?.status).toBe(403);

  const wrongType = await siteRequestResponse(
    site("/want", { method: "POST", headers: { origin: "https://ohmyho.st" } }),
    api,
  );
  expect(wrongType?.status).toBe(400);

  const tooLarge = await siteRequestResponse(
    posted("/want", {
      feature: "eu",
      choice: "up",
      idempotency_key: "x".repeat(4096),
    }),
    api,
  );
  expect(tooLarge?.status).toBe(413);

  const malformed = await siteRequestResponse(
    site("/want", {
      method: "POST",
      headers: {
        origin: "https://ohmyho.st",
        "content-type": "application/json",
      },
      body: "{",
    }),
    api,
  );
  expect(malformed?.status).toBe(400);

  const unexpectedField = await siteRequestResponse(
    posted(
      "/want",
      { feature: "eu", choice: "up", idempotency_key: "k", extra: 1 },
      "omh_voter=v",
    ),
    api,
  );
  expect(unexpectedField?.status).toBe(400);
});

it("requires a voter cookie before a vote and accepts a complete contact request", async () => {
  const api = controlApi();
  const withoutCookie = await siteRequestResponse(
    posted("/want", { feature: "eu", choice: "up", idempotency_key: "k" }),
    api,
  );
  expect(withoutCookie?.status).toBe(409);

  const vote = await siteRequestResponse(
    posted(
      "/want",
      { feature: "eu", choice: "up", idempotency_key: "k" },
      "omh_voter=11111111-2222-4333-8444-555555555555",
    ),
    api,
  );
  expect(vote?.status).toBe(202);
  expect(await vote?.json()).toEqual({ accepted: true, ...VOTES });

  const contact = await siteRequestResponse(
    posted("/v1/contact-requests", {
      name: "A",
      email: "a@example.com",
      company: "C",
      message: "Hello",
      idempotency_key: "k",
    }),
    api,
  );
  expect(contact?.status).toBe(202);
  expect(await contact?.json()).toEqual({ accepted: true });
});

it("maps an upstream refusal to the customer's answer without leaking its detail", async () => {
  const limited = controlApi({
    "/v1/site/stats": () =>
      Response.json(
        { code: "rate_limited", detail: "internal quota" },
        {
          status: 429,
          headers: { "retry-after": "30" },
        },
      ),
  });
  const response = await siteRequestResponse(site("/stats.json"), limited);
  expect(response?.status).toBe(429);
  expect(await response?.json()).toEqual({ code: "rate_limited" });
  expect(response?.headers.get("retry-after")).toBe("30");

  const broken = controlApi({
    "/v1/site/stats": () =>
      Response.json({ deploys_7d: -1, observed_at: "nope" }),
  });
  const refused = await siteRequestResponse(site("/stats.json"), broken);
  expect(refused?.status).toBe(503);
  expect(await refused?.json()).toEqual({ code: "service_unavailable" });
});

it("keeps only a safe attribution source", () => {
  expect(signupSource("launch-week")).toBe("launch-week");
  expect(signupSource("a".repeat(200))).toBeUndefined();
  expect(signupSource(undefined)).toBeUndefined();
});
