import { readFile } from "node:fs/promises";

import { marked } from "marked";
import { expect, it } from "vitest";

import {
  credits,
  number,
  priceLine,
  priceWorkload,
  scenarioUsd,
} from "../src/content/format.js";
import {
  DATABASE_PROFILES,
  SCENARIOS,
  WORKLOADS,
} from "../src/content/sources.js";
import {
  billsScenario,
  comparisonColumns,
  creditBarRows,
  figureBills,
  figureCreditBars,
  figureFlow,
  flowToolNames,
} from "../src/figures.js";
import mcpTools from "../src/generated-mcp-tools.json" with { type: "json" };

const MICROCREDITS = 1_000_000;

function values(html: string): string[] {
  return [...html.matchAll(/data-value="([^"]+)"/gu)].map(
    (match) => match[1] ?? "",
  );
}

it("renders every figure as one Markdown-safe block whose numbers come from the data module", () => {
  for (const html of [
    figureBills("vercel"),
    figureBills("railway"),
    figureCreditBars(),
    figureFlow("Claude Code"),
    figureFlow("Lovable export"),
  ]) {
    expect(html.startsWith('<figure class="fig" aria-label="')).toBe(true);
    expect(html.endsWith("</figure>")).toBe(true);
    expect(html).not.toContain("\n");
    expect(html.match(/<svg /gu)).toHaveLength(1);
    expect(html).toContain('role="img" aria-label="');
    expect(html).toContain("<figcaption>");
    expect(html).not.toMatch(
      /<script|<image|<foreignObject|href="http[^"]*"[^>]*>(?![^<]*<\/a>)/u,
    );
    const rendered = marked.parse(`${html}\n`, { async: false });
    expect(rendered.trim()).toBe(html);
    expect(rendered).not.toContain("<p>");
  }
  for (const competitor of [
    "vercel",
    "supabase",
    "resend",
    "railway",
  ] as const) {
    const scenario = billsScenario(competitor);
    const expected = [
      ...scenario.parts.map((part) =>
        String(part.fact.usd * (part.times ?? 1)),
      ),
      String(scenarioUsd(scenario)),
      "10",
    ];
    expect(values(figureBills(competitor))).toEqual(expected);
    expect(figureBills(competitor)).toContain(
      "List prices checked on September 19, 2026",
    );
    for (const vendor of new Set(scenario.parts.map((part) => part.vendor)))
      expect(figureBills(competitor)).toContain(
        `href="${vendor.sourceUrl}" rel="noopener"`,
      );
    expect(values(comparisonColumns(competitor))).toEqual([
      ...scenario.parts.map((part) =>
        String(part.fact.usd * (part.times ?? 1)),
      ),
      ...(competitor === "railway" ? [] : ["10"]),
      String(scenarioUsd(scenario)),
      "10",
      number(priceWorkload(WORKLOADS.smallApp).microcredits / MICROCREDITS, 2),
    ]);
  }
  expect(values(figureCreditBars())).toEqual(
    creditBarRows().map((row) => number(row.microcredits / MICROCREDITS, 2)),
  );
  expect(creditBarRows().map((row) => row.microcredits)).toEqual([
    priceLine("wfp.requests", 1_000_000),
    priceLine("ses.{region}.recipients (Essentials)", 1000),
    priceLine("neon.compute.scale", DATABASE_PROFILES.standard.cu),
    priceLine("neon.storage.root", 1),
    priceLine("domain.custom_hostname", 1),
    priceLine("route53.zone", 1),
    priceLine("build.sandbox.standard-3", 1200),
    priceWorkload(WORKLOADS.smallApp).microcredits,
  ]);
  expect(figureCreditBars()).toContain(
    'data-count-to="552.44" data-suffix=" credits"',
  );
  const catalog = new Set(
    mcpTools.tools.map((tool: { name: string }) => tool.name),
  );
  for (const tool of flowToolNames())
    expect(catalog.has(tool), tool).toBe(true);
  expect(figureFlow("Codex")).toContain(
    `${mcpTools.tools.length}-tool catalog`,
  );
  expect(figureFlow("Bolt export")).toContain("bolt export · github repo");
});

it("keeps the pinned homepage's bill and credit examples equal to the data module", async () => {
  const home = await readFile(
    new URL("../public/pages/home.html", import.meta.url),
    "utf8",
  );
  expect(home).toContain(
    `data-to="${scenarioUsd(SCENARIOS.threeSubscriptions)}"`,
  );
  expect(home).toContain(
    `Resend Pro $20 — around $${scenarioUsd(SCENARIOS.threeSubscriptions)} for one project`,
  );
  const round = (microcredits: number) =>
    `${Math.round(microcredits / MICROCREDITS)} credits`;
  expect(home).toContain(
    `<h3>1 active database hour</h3><u>${round(priceLine("neon.compute.scale", DATABASE_PROFILES.standard.cu))}</u>`,
  );
  expect(home).toContain(
    `<h3>1,000 emails</h3><u>${round(priceLine("ses.{region}.recipients (Essentials)", 1000))}</u>`,
  );
  expect(home).toContain(
    `<h3>1M requests</h3><u>${round(priceLine("wfp.requests", 1_000_000))}</u>`,
  );
  expect(home).toContain(
    `<h3>1 database GB-month</h3><u>${round(priceLine("neon.storage.root", 1))}</u>`,
  );
  expect(
    credits(priceLine("ses.{region}.recipients (Essentials)", 2000), 0),
  ).toBe("105 credits");
  expect(home).toContain("2,000 emails ≈ 105 credits");
  const example = Math.round(
    priceWorkload(WORKLOADS.smallApp).microcredits / MICROCREDITS,
  );
  expect(home).toContain(`≈ ${example} credits a month`);
  expect(home).not.toContain("you.ohmyho.st");
  expect(home).not.toContain("stays up and read-only");
  expect(home).not.toContain("no web console");
});
