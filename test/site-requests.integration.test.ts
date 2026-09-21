import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import { createControlApiTestHarness } from "../../control-api/test/harness.js";
import { createPostgresPublicEntry } from "../../control-api/src/public-entry.js";
import worker from "../src/worker-main.js";
import { siteRequestResponse } from "../src/site-requests.js";

it("connects the public page and consent form through the generated SDK to real API persistence", async () => {
  const h = await createControlApiTestHarness({
    publicEntryFactory: (pool) =>
      createPostgresPublicEntry(pool, { now: () => new Date("2026-09-13T12:00:00.000Z") }),
  });
  try {
    const binding = {
      fetch: async (request: Request) =>
        h.request(new URL(request.url).pathname + new URL(request.url).search, {
          method: request.method,
          headers: request.headers,
          ...(request.body ? { body: await request.text() } : {}),
        }),
    };
    const ASSETS = {
      fetch: async (request: Request) =>
        new Response(
          await readFile(
            new URL(`../public${new URL(request.url).pathname}`, import.meta.url),
            "utf8",
          ),
        ),
    };
    for (const [query, expected] of [
      ["?r=hostmebaby", "hostmebaby"],
      ["?r=unknown", "unknown"],
      ["?r=Summer%20Launch", "Summer Launch"],
      ["?r=hostmebaby&r=unknown", undefined],
      ["", undefined],
    ] as const) {
      const response = await worker.fetch(new Request("https://ohmyho.st/" + query), {
        ASSETS,
        CONTROL_API: binding,
      });
      expect(response.status).toBe(200);
      const html = await response.text();
      expect(html.includes('<meta name="ohmyhost-signup-source"')).toBe(expected !== undefined);
      if (expected !== undefined)
        expect(html).toContain(`<meta name="ohmyhost-signup-source" content="${expected}">`);
      expect(response.headers.get("content-security-policy")).toContain("sha256-");
    }
    const injected = await worker.fetch(
      new Request(`https://ohmyho.st/?r=${encodeURIComponent('"><script>alert(1)</script>&')}`),
      { ASSETS, CONTROL_API: binding },
    );
    const injectedHtml = await injected.text();
    expect(injectedHtml).toContain(
      '<meta name="ohmyhost-signup-source" content="&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;&amp;">',
    );
    expect(injectedHtml).not.toContain("<script>alert(1)</script>");
    const remembered = await worker.fetch(
      new Request("https://ohmyho.st/about", { headers: { cookie: "omh_referral=hostmebaby" } }),
      { ASSETS, CONTROL_API: binding },
    );
    expect(await remembered.text()).toContain('href="/login?r=hostmebaby"');
    const directLogin = await worker.fetch(new Request("https://ohmyho.st/login"), {
      ASSETS,
      CONTROL_API: binding,
    });
    expect(directLogin.status).toBe(302);
    expect(directLogin.headers.get("location")).toBe("https://app.ohmyho.st/login");
    const overridden = await worker.fetch(
      new Request("https://ohmyho.st/about?r=other", {
        headers: { cookie: "omh_referral=hostmebaby" },
      }),
      { ASSETS, CONTROL_API: binding },
    );
    // An unknown source is attribution only; the login link stays reachable for everyone.
    expect(await overridden.text()).toContain('href="/login?r=other"');
    const docsReferral = await worker.fetch(new Request("https://ohmyho.st/docs/cli?r=other"), {
      ASSETS,
      CONTROL_API: binding,
    });
    expect(docsReferral.status).toBe(308);
    expect(docsReferral.headers.get("set-cookie")).toContain("omh_referral=other;");
    expect(docsReferral.headers.get("location")).toBe("https://docs.ohmyho.st/cli");
    const campaign = await worker.fetch(new Request("https://ohmyho.st/?r=Summer%20Launch"), {
      ASSETS,
      CONTROL_API: binding,
    });
    expect(campaign.headers.get("set-cookie")).toContain("omh_referral=Summer%20Launch;");
    // A source that cannot be carried into the installer shell falls back to the plain link.
    expect(await campaign.text()).toMatch(/<a[^>]+href="(?:https:\/\/ohmyho.st)?\/login"[^>]*>/u);
    const anonymous = await worker.fetch(new Request("https://ohmyho.st/about"), {
      ASSETS,
      CONTROL_API: binding,
    });
    expect(await anonymous.text()).toContain('href="/login"');
    for (const path of ["/about", "/for/codex"])
      for (const value of ["hostmebaby", "Summer Launch"]) {
        const page = await worker.fetch(
          new Request(`https://ohmyho.st${path}?r=${encodeURIComponent(value)}`),
          { ASSETS, CONTROL_API: binding },
        );
        expect(await page.text()).toContain(
          `<meta name="ohmyhost-signup-source" content="${value}">`,
        );
      }
    for (const path of ["/status.json", "/stats.json"]) {
      const response = await siteRequestResponse(
        new Request(`https://ohmyho.st${path}`, {
          method: "POST",
          headers: { origin: "https://ohmyho.st", "content-type": "application/json" },
          body: JSON.stringify({ feature: "eu", choice: "up" }),
        }),
        binding,
      );
      expect(response?.status).toBe(405);
    }
    const malformed = new UnexpectedApiResponse();
    expect(
      (await siteRequestResponse(new Request("https://ohmyho.st/stats.json"), malformed))?.status,
    ).toBe(503);
    const interest = {
      email: "site-test@example.com",
      consent: true,
      consent_version: "beta-interest-2026-09-13",
    };
    const retired = await worker.fetch(
      new Request("https://ohmyho.st/v1/site/interests", {
        method: "POST",
        headers: { origin: "https://ohmyho.st", "content-type": "application/json" },
        body: JSON.stringify(interest),
      }),
      { ASSETS, CONTROL_API: binding },
    );
    expect(retired.status).toBe(405);
    expect(
      await siteRequestResponse(
        new Request("https://ohmyho.st/v1/site/interests", {
          method: "POST",
          headers: { origin: "https://ohmyho.st", "content-type": "application/json" },
          body: JSON.stringify(interest),
        }),
        binding,
      ),
    ).toBeNull();
    for (const path of ["/v1/site/interests", "/v1/site/eligibility?r=hostmebaby"]) {
      const direct = await h.request(path, {
        method: path.startsWith("/v1/site/interests") ? "POST" : "GET",
        headers: { "content-type": "application/json", origin: "https://ohmyho.st" },
        ...(path.startsWith("/v1/site/interests") ? { body: JSON.stringify(interest) } : {}),
      });
      expect(direct.status).toBe(404);
    }
    const status = await siteRequestResponse(new Request("https://ohmyho.st/status.json"), binding);
    expect(await status?.json()).toMatchObject({
      ok: false,
      components: expect.arrayContaining([{ name: "API and reporting", status: "operational" }]),
    });
    const initialVotes = await siteRequestResponse(new Request("https://ohmyho.st/want"), binding);
    expect(initialVotes?.status).toBe(200);
    expect(initialVotes?.headers.get("set-cookie")).toMatch(
      /^__Host-omh_voter=[0-9a-f-]+; Path=\/; Secure; HttpOnly; SameSite=Lax; Max-Age=31536000$/u,
    );
    const voterCookie = initialVotes?.headers.get("set-cookie")?.split(";", 1)[0] ?? "";
    const voteBody = {
      feature: "eu",
      choice: "up",
      idempotency_key: "00000000-0000-4000-8000-000000000010",
    };
    const voteRequest = (
      body: unknown = voteBody,
      cookie = voterCookie,
      origin = "https://ohmyho.st",
    ) =>
      new Request("https://ohmyho.st/want", {
        method: "POST",
        headers: {
          origin,
          "content-type": "application/json",
          cookie,
          "x-ohmyho-voter": "ffffffff-ffff-4fff-8fff-ffffffffffff",
        },
        body: JSON.stringify(body),
      });
    const vote = await siteRequestResponse(voteRequest(), binding);
    expect(vote?.status).toBe(202);
    const expectedVotes = {
      votes: [
        { feature: "eu", choice: "up" },
        { feature: "iso27001", choice: null },
        { feature: "soc2", choice: null },
      ],
    };
    expect(await vote?.json()).toEqual({ accepted: true, ...expectedVotes });
    const restored = await siteRequestResponse(
      new Request("https://ohmyho.st/want", { headers: { cookie: voterCookie } }),
      binding,
    );
    expect(await restored?.json()).toEqual(expectedVotes);
    const another = await siteRequestResponse(new Request("https://ohmyho.st/want"), binding);
    expect(await another?.json()).toEqual({
      votes: expectedVotes.votes.map((item) => ({ ...item, choice: null })),
    });
    for (const cookie of ["", "__Host-omh_voter=bad", voterCookie + "; " + voterCookie]) {
      const denied = await siteRequestResponse(voteRequest(voteBody, cookie), binding);
      expect(denied?.status).toBe(409);
      expect(await denied?.json()).toEqual({ code: "voter_cookie_required" });
    }
    expect(
      (await siteRequestResponse(voteRequest({ ...voteBody, voter_id: "forged" }), binding))
        ?.status,
    ).toBe(400);
    expect(
      (
        await siteRequestResponse(
          voteRequest(voteBody, voterCookie, "https://foreign.example"),
          binding,
        )
      )?.status,
    ).toBe(403);
    expect(
      (await siteRequestResponse(voteRequest({ ...voteBody, choice: "invalid" }), binding))?.status,
    ).toBe(400);
    expect(
      (await siteRequestResponse(voteRequest({ ...voteBody, feature: "x".repeat(2100) }), binding))
        ?.status,
    ).toBe(413);
    const limited = await siteRequestResponse(voteRequest(), new LimitedPublicApi());
    expect(limited?.status).toBe(429);
    expect(limited?.headers.get("retry-after")).toBe("37");
    const unavailableVote = await siteRequestResponse(voteRequest(), new UnexpectedApiResponse());
    expect(unavailableVote?.status).toBe(503);
    expect(await unavailableVote?.json()).toEqual({ code: "service_unavailable" });
    const finalRestored = await siteRequestResponse(
      new Request("https://ohmyho.st/want", { headers: { cookie: voterCookie } }),
      binding,
    );
    expect(await finalRestored?.json()).toEqual(expectedVotes);
    const roadmapHtml = await (
      await worker.fetch(new Request("https://ohmyho.st/"), { ASSETS, CONTROL_API: binding })
    ).text();
    expect(roadmapHtml.match(/class="roadmap-vote"/gu)).toHaveLength(4);
    expect(roadmapHtml).not.toContain('data-f="eu"');
    expect(roadmapHtml).not.toContain("Vote for Hosting in the EU");
    expect(roadmapHtml).toContain(
      '<span class="badge">Hosting in the <b>US</b> or <b>EU</b></span>',
    );
    expect(roadmapHtml).toContain("Yes. Choose EU when you create the project; the default is US.");
    expect(roadmapHtml).not.toContain("An EU hosting option is on the roadmap");
    expect(roadmapHtml.indexOf('id="roadmap"')).toBeGreaterThan(roadmapHtml.indexOf('id="faq"'));
    expect(roadmapHtml.indexOf('id="roadmap"')).toBeLessThan(
      roadmapHtml.indexOf('<div class="end">'),
    );
    expect(roadmapHtml).not.toContain("navigator.sendBeacon('/want'");
    expect(roadmapHtml).not.toContain('class="want"');
    expect(roadmapHtml).not.toContain('id="beta-modal"');
    expect(roadmapHtml).not.toContain('id="beta-form"');
    expect(roadmapHtml).not.toContain("/v1/site/interests");
    expect(roadmapHtml).not.toContain("My invitation is");
    expect(roadmapHtml).toContain(
      '"I came from https://ohmyho.st/?r=" + encodeURIComponent(source)',
    );
    expect((await siteRequestResponse(new Request("https://ohmyho.st/stats.json")))?.status).toBe(
      503,
    );
    const contact = {
      name: "Website visitor",
      email: "visitor@example.invalid",
      company: "",
      message: "Please explain data retention.",
      idempotency_key: "00000000-0000-4000-8000-000000000020",
    };
    for (const [payload, expected] of [
      [contact, 202],
      [contact, 202],
      [{ ...contact, message: "changed" }, 409],
      [{ ...contact, name: "" }, 400],
      [{ ...contact, message: "invalid\0message" }, 400],
    ] as const) {
      const response = await worker.fetch(
        new Request("https://ohmyho.st/v1/contact-requests", {
          method: "POST",
          headers: { origin: "https://ohmyho.st", "content-type": "application/json" },
          body: JSON.stringify(payload),
        }),
        { ASSETS, CONTROL_API: binding },
      );
      expect(response.status).toBe(expected);
      expect(await response.text()).not.toContain(contact.email);
    }
    for (const path of [
      "/privacy",
      "/cookies",
      "/dpa",
      "/dpa/toms",
      "/dpa/subprocessors",
      "/dpa/transfers",
      "/contact",
    ]) {
      const page = await worker.fetch(new Request(`https://ohmyho.st${path}`), {
        ASSETS,
        CONTROL_API: binding,
      });
      expect(page.status).toBe(200);
      const html = await page.text();
      expect(html).toContain('id="cookie-notice"');
      expect(html).not.toContain('id="beta-modal"');
      expect(html).not.toContain("Get beta access");
      expect(html).not.toMatch(/fonts\.googleapis|fonts\.gstatic|mailto:|smertens@/u);
      expect(page.headers.get("content-security-policy")).toContain("font-src 'self'");
      const md = await worker.fetch(new Request(`https://ohmyho.st${path}.md`), {
        ASSETS,
        CONTROL_API: binding,
      });
      expect(md.status).toBe(200);
      expect(md.headers.get("content-type")).toContain("text/markdown");
    }
    const snapshot = await h.snapshot();
    expect(snapshot.projects).toEqual([]);
    expect(snapshot.operations).toEqual([]);
  } finally {
    await h.close();
  }
});

class UnexpectedApiResponse {
  async fetch(): Promise<Response> {
    return Response.json({ deploys_7d: "invalid", observed_at: "invalid", extra: "unexpected" });
  }
}

class LimitedPublicApi {
  async fetch(): Promise<Response> {
    return Response.json(
      { status: 429, code: "rate_limited" },
      { status: 429, headers: { "retry-after": "37" } },
    );
  }
}
