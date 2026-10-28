import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

import { expect, it } from "vitest";

import { AGENT_INDEX, DOCUMENTATION } from "../src/customer-entry.js";
import worker from "../src/worker-main.js";

const publicDir = new URL("../public/", import.meta.url);
const FREE_ARTICLE = "/blog/free-vercel-supabase-alternatives-2026";
const ALL_IN_ONE_ARTICLE = "/blog/all-in-one-vercel-supabase-alternatives";

class PagesFixture {
  async fetch(request: Request) {
    const path = new URL(request.url).pathname;
    const file = new URL(`.${path}`, publicDir);
    if (!path.startsWith("/pages/") || !existsSync(file))
      return new Response(null, { status: 404 });
    return new Response(new Uint8Array(await readFile(file)));
  }
}

async function homepage(): Promise<string> {
  return (
    await worker.fetch(new Request("https://ohmyho.st/"), {
      ASSETS: new PagesFixture(),
    })
  ).text();
}

it("opens the homepage with a link to the Free plan card that says the plan is always free and needs no card", async () => {
  const home = await homepage();
  const body = home.slice(home.indexOf("<body"));
  const bar = body.match(
    /<a class="freebar" href="#free-plan"[^>]*>([\s\S]*?)<\/a>/u,
  );
  expect(bar, "free plan banner").not.toBeNull();
  expect(bar?.[1]).toMatch(/Always Free/u);
  expect(bar?.[1]).toMatch(/no credit card/u);
  // The banner is the first thing in the body, above the sticky navigation.
  expect(body.indexOf('class="freebar"')).toBeLessThan(
    body.indexOf('id="top"'),
  );
  // It points at the Free plan card itself, not only at the pricing section.
  expect(body).toMatch(/<div class="plan" id="free-plan">/u);
  expect(body.indexOf('id="free-plan"')).toBeGreaterThan(
    body.indexOf('<section id="price">'),
  );
});

it("states that the Free allowance renews every month wherever the homepage describes it", async () => {
  const home = await homepage();
  expect(home).toContain("200 <u>credits every month</u>");
  expect(home).toContain("200 credits every month, hosting and a database");
  expect(home).not.toContain("Free to try.");
  expect(home).toContain("Yes: 200 credits every month, no card.");
  // A customer-owned domain also works on Free with the Powered by flag; the FAQ and the card agree.
  expect(home).toMatch(/Your own domain <em>with the Powered by flag<\/em>/u);
  expect(home).not.toContain("or your own domain on the $10 plan");
  const offers = [
    ...home.matchAll(/"@type":"Offer","name":"Free"[^}]*\}/gu),
  ].map((match) => match[0]);
  expect(offers).toHaveLength(1);
  expect(offers[0]).toContain("200 credits every UTC month");
  // The Free card links to the free-plan comparison and its quiet-app example.
  expect(home).toContain(`href="${FREE_ARTICLE}"`);
  expect(home).toContain(`href="${ALL_IN_ONE_ARTICLE}"`);
});

it("puts the free plan in the homepage title and description without dropping the Resend comparison", async () => {
  const home = await homepage();
  const title = home.match(/<title>([^<]*)<\/title>/u)?.[1] ?? "";
  expect(title).toMatch(/Vercel, Supabase &amp; Resend/u);
  expect(title).toMatch(/free plan/u);
  const description =
    home.match(/<meta name="description" content="([^"]*)"/u)?.[1] ?? "";
  expect(description).toMatch(/free with 200 credits a month/iu);
  expect(description.length).toBeLessThanOrEqual(180);
});

it("says every month on the pricing page and links both comparisons from the pages people compare on", () => {
  expect(DOCUMENTATION["/pricing"]).toMatch(
    /^Free gives 200 credits every month, with no card\./mu,
  );
  for (const path of ["/pricing", "/vs/supabase", "/vs/vercel"]) {
    expect(DOCUMENTATION[path], path).toContain(`](${FREE_ARTICLE})`);
    expect(DOCUMENTATION[path], path).toContain(`](${ALL_IN_ONE_ARTICLE})`);
  }
});

it("tells agents what the product is and where the two comparisons are", () => {
  const summary = AGENT_INDEX.split("\n## ")[0] ?? "";
  expect(summary).toMatch(/Free: 200 credits every month, no card/u);
  expect(summary).toMatch(/Vercel, Supabase and Resend/u);
  const comparisons = AGENT_INDEX.split("## Pricing and comparisons")[1] ?? "";
  expect(comparisons).toContain(`https://ohmyho.st${FREE_ARTICLE}.md`);
  expect(comparisons).toContain(`https://ohmyho.st${ALL_IN_ONE_ARTICLE}.md`);
});

it("compares the integrated platforms by capability and dated free-plan limits instead of founder scores", () => {
  const article = DOCUMENTATION[ALL_IN_ONE_ARTICLE] ?? "";
  for (const name of [
    "Appwrite",
    "Netlify",
    "InsForge",
    "Firebase",
    "Nhost",
    "ohmyho.st",
  ])
    expect(article, name).toContain(name);
  expect(article).not.toMatch(
    /\d(?:\.\d)?\s*\/\s*10|our pick|our winner|top pick|rating out of|scorecard|Best Vercel/iu,
  );
  for (const label of ["Included", "Integration", "Paid only", "Not provided"])
    expect(article, label).toContain(label);
  // Every competitor figure carries its dated source line.
  for (const vendor of ["Appwrite", "Netlify", "InsForge"])
    expect(article).toMatch(
      new RegExp(`checked on 2026-10-22 — \\[${vendor} pricing\\]`, "u"),
    );
  // The close competitors' own catches are named, not only ours.
  expect(article).toMatch(/paused after 1 week of inactivity/u);
  expect(article).toMatch(/deleted/u);
  expect(article).toMatch(/Vercel/u);
});
