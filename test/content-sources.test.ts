import { readFile } from "node:fs/promises";

import { expect, it } from "vitest";

import { creditPricingRates } from "../../../scripts/credit-pricing-document.mjs";
import {
  CTA_PROMPT,
  checkedLine,
  creditMicros,
  creditValueUsd,
  credits,
  number,
  priceLine,
  priceWorkload,
  rate,
  scenarioUsd,
  sourcesSection,
  usd,
  workloadTable,
} from "../src/content/format.js";
import { PLANS, SCENARIOS, VENDORS, WORKLOADS } from "../src/content/sources.js";
import { CREDIT_RATES } from "../src/generated-pricing.js";

const root = new URL("../../../", import.meta.url);

it("generates the typed rate card from PRICING.md and prices workloads by its rules", async () => {
  const rates = (await creditPricingRates(root.pathname.replace(/\/$/u, ""))) as Record<
    string,
    { quantity: number; unit: string; credits: string }
  >;
  expect(rates).toEqual(CREDIT_RATES);
  expect(Object.keys(rates).length).toBeGreaterThanOrEqual(20);
  expect(rates["wfp.requests"]).toEqual({
    quantity: 1_000_000,
    unit: "requests",
    credits: "98.571429",
  });
  expect(creditMicros("98.571429")).toBe(98_571_429);
  expect(creditMicros("115")).toBe(115_000_000);
  expect(priceLine("build.sandbox.standard-3", 1200)).toBe(24_098_743);
  expect(priceLine("wfp.requests", 100_000)).toBe(9_857_143);
  expect(priceLine("neon.compute.scale", 0.5)).toBe(36_471_429);
  const small = priceWorkload(WORKLOADS.smallApp);
  expect(small.microcredits).toBe(552_441_601);
  expect(small.lines.map((line) => line.microcredits)).toEqual([
    24_098_743, 9_857_143, 6_571_429, 291_771_428, 115_000_000, 105_142_858,
  ]);
  expect(scenarioUsd(SCENARIOS.threeSubscriptions)).toBe(65);
  expect(scenarioUsd(SCENARIOS.fiveProjects)).toBe(105);
  expect(scenarioUsd(SCENARIOS.railwayStack)).toBe(40);
});

it("formats prices, credits, rates and source lines the way pages quote them", () => {
  expect(usd(20)).toBe("$20");
  expect(usd(0.15)).toBe("$0.15");
  expect(usd(0.125)).toBe("$0.125");
  expect(usd(1234.5)).toBe("$1,234.50");
  expect(number(1_000_000)).toBe("1,000,000");
  expect(credits(552_441_601)).toBe("552.44 credits");
  expect(credits(36_471_429, 0)).toBe("36 credits");
  expect(creditValueUsd(552_441_601)).toBe("$5.52");
  expect(rate("wfp.requests")).toBe("98.571429 credits per 1,000,000 requests");
  expect(checkedLine(VENDORS.vercel)).toBe(
    "List prices checked on 2026-09-19 — [Vercel pricing](https://vercel.com/pricing).",
  );
  expect(sourcesSection(VENDORS.vercel, VENDORS.resend)).toContain(
    "- List prices checked on 2026-09-19 — [Resend pricing]",
  );
  const table = workloadTable(WORKLOADS.smallApp);
  expect(table).toContain("| 20 build minutes | 24.10 |");
  expect(table).toContain("| **Total: A small app for one month** | **about 552.44** |");
  expect(table).toContain("About $5.52 of credit value");
});

it("keeps the plan constants and the agent prompt equal to their sources", async () => {
  const pricing = await readFile(new URL("PRICING.md", root), "utf8");
  expect(pricing).toContain(
    `| Free                       | USD 0                       | ${PLANS.freeCredits} per UTC month`,
  );
  expect(pricing).toContain(
    `| Paid                       | USD ${PLANS.paidUsd} per month before tax | ${number(PLANS.paidCredits)} per paid period`,
  );
  expect(pricing).toContain(
    `${PLANS.topUpPerUsd} per dollar up to USD 100, ${PLANS.topUpPerUsdAbove100} per dollar for the part above`,
  );
  expect(pricing).toContain(`one durable ${["seven"][PLANS.graceDays - 7]}-day grace period`);
  const prepare = await readFile(
    new URL("apps/public-site/scripts/prepare-pages.mjs", root),
    "utf8",
  );
  expect(prepare).toContain(`"${CTA_PROMPT}"`);
  for (const vendor of Object.values(VENDORS)) {
    expect(vendor.checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/u);
    expect(vendor.sourceUrl.startsWith("https://")).toBe(true);
    expect(vendor.evidence.startsWith("plan/evidence/P38/")).toBe(true);
  }
});
