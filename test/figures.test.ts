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
    priceLine("mail.sent", 1000),
    priceLine("neon.compute.scale", DATABASE_PROFILES.standard.cu),
    priceLine("neon.storage.root", 1),
    priceLine("domain.custom_hostname", 1),
    priceLine("build.sandbox.standard-3", 1200),
    priceWorkload(WORKLOADS.smallApp).microcredits,
  ]);
  expect(figureCreditBars()).toContain(
    'data-count-to="813.87" data-suffix=" credits"',
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
    `<h3>1,000 emails</h3><u>${round(priceLine("mail.sent", 1000))}</u>`,
  );
  expect(home).toContain(
    `<h3>1M requests</h3><u>${round(priceLine("wfp.requests", 1_000_000))}</u>`,
  );
  expect(home).toContain(
    `<h3>1 database GB-month</h3><u>${round(priceLine("neon.storage.root", 1))}</u>`,
  );
  expect(credits(priceLine("mail.sent", 2000), 0)).toBe("360 credits");
  expect(home).toContain("2,000 emails ≈ 360 credits");
  expect(home).toContain("including the deployed script and mail");
  expect(home).toContain("mail_status");
  expect(home).not.toContain("mail_domain_status");
  expect(home).toContain(
    '<a href="/pricing/breakdown">full cost breakdown</a>',
  );
  expect(home).not.toContain("≈ 552 credits");
  expect(home).not.toContain("you.ohmyho.st");
  expect(home).not.toContain("stays up and read-only");
  expect(home).not.toContain("no web console");
});

it("keeps every figure's text inside its frame, whatever the scenario contains", () => {
  const monoWidth = 6.9;
  for (const competitor of [
    "vercel",
    "supabase",
    "resend",
    "railway",
  ] as const) {
    const svg = figureBills(competitor);
    const height = Number(/viewBox="0 0 960 (\d+)"/u.exec(svg)?.[1]);
    const receipts = billsScenario(competitor).parts.length;
    const lines = [...svg.matchAll(/<text x="\d+" y="(\d+)"/gu)].map((match) =>
      Number(match[1]),
    );
    // Nothing is drawn below the frame, and the summary clears both the receipts and the card.
    expect(Math.max(...lines)).toBeLessThan(height);
    const summary = Math.max(36 + receipts * 74 - 16, 252) + 32;
    expect(svg).toContain(`y="${summary}"`);
    expect(svg).toContain(`y="${summary + 22}"`);
  }
  for (const agent of [
    "Claude Code",
    "Lovable export",
    "Bolt export",
  ] as const) {
    const svg = figureFlow(agent);
    const frame = /viewBox="(-?\d+) 0 (\d+) 270"/u.exec(svg);
    const label =
      /text-anchor="end"[^>]*>([^<]+)<\/text>/u.exec(svg)?.[1] ?? "";
    // The source label is right-anchored at x=104 and grows leftwards; the frame has to hold it.
    expect(Number(frame?.[1])).toBeLessThan(104 - label.length * monoWidth);
    expect(Number(frame?.[1]) + Number(frame?.[2])).toBeGreaterThan(900);
  }
});
