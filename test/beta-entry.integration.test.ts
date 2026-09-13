import { readFile } from "node:fs/promises";
import { expect, it } from "vitest";
import { createControlApiTestHarness } from "../../control-api/test/harness.js";
import { createPostgresPublicEntry } from "../../control-api/src/public-entry.js";
import worker from "../src/worker-main.js";
import { siteBetaResponse } from "../src/beta-entry.js";

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
    for (const query of ["?r=hostmebaby", "?r=unknown", "?r=hostmebaby&r=unknown", ""]) {
      const response = await worker.fetch(new Request("https://ohmyho.st/" + query), {
        ASSETS,
        CONTROL_API: binding,
      });
      expect(response.status).toBe(200);
      const html = await response.text();
      expect(html.includes('<meta name="ohmyhost-signup-source" content="hostmebaby">')).toBe(
        query === "?r=hostmebaby",
      );
      expect(response.headers.get("content-security-policy")).toContain("sha256-");
    }
    for (const path of ["/docs", "/for/codex"]) {
      const page = await worker.fetch(new Request(`https://ohmyho.st${path}?r=hostmebaby`), {
        ASSETS,
        CONTROL_API: binding,
      });
      expect(await page.text()).toContain(
        '<meta name="ohmyhost-signup-source" content="hostmebaby">',
      );
    }
    for (const path of ["/status.json", "/stats.json"]) {
      const response = await siteBetaResponse(
        new Request(`https://ohmyho.st${path}`, {
          method: "POST",
          headers: { origin: "https://ohmyho.st", "content-type": "application/json" },
          body: JSON.stringify({
            email: "should-not-save@example.com",
            consent: true,
            consent_version: "beta-interest-2026-09-13",
          }),
        }),
        binding,
      );
      expect(response?.status).toBe(405);
    }
    const malformed = new UnexpectedApiResponse();
    expect(
      (await siteBetaResponse(new Request("https://ohmyho.st/stats.json"), malformed))?.status,
    ).toBe(503);
    const body = {
      email: "site-test@example.com",
      consent: true,
      consent_version: "beta-interest-2026-09-13",
    };
    for (let n = 0; n < 2; n++) {
      const result = await worker.fetch(
        new Request("https://ohmyho.st/v1/beta/interests", {
          method: "POST",
          headers: { origin: "https://ohmyho.st", "content-type": "application/json" },
          body: JSON.stringify(body),
        }),
        { ASSETS, CONTROL_API: binding },
      );
      expect(result.status).toBe(202);
      expect(await result.json()).toEqual({ accepted: true });
    }
    const invalid = await siteBetaResponse(
      new Request("https://ohmyho.st/v1/beta/interests", {
        method: "POST",
        headers: { origin: "https://ohmyho.st", "content-type": "application/json" },
        body: JSON.stringify({ ...body, consent: false }),
      }),
      binding,
    );
    const direct = await h.request("/v1/beta/interests", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://ohmyho.st" },
      body: JSON.stringify({ ...body, consent: false }),
    });
    expect(invalid?.status, await direct.text()).toBe(400);
    const status = await siteBetaResponse(new Request("https://ohmyho.st/status.json"), binding);
    expect(await status?.json()).toMatchObject({
      ok: false,
      components: expect.arrayContaining([{ name: "API and reporting", status: "operational" }]),
    });
    const vote = await siteBetaResponse(
      new Request("https://ohmyho.st/want", {
        method: "POST",
        headers: { origin: "https://ohmyho.st", "content-type": "application/json" },
        body: JSON.stringify({
          feature: "eu",
          idempotency_key: "00000000-0000-4000-8000-000000000010",
        }),
      }),
      binding,
    );
    expect(vote?.status).toBe(202);
    expect((await siteBetaResponse(new Request("https://ohmyho.st/stats.json")))?.status).toBe(503);
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
