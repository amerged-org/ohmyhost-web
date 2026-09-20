import { CREDIT_RATES } from "../generated-pricing.js";
import type { MeterId, PricedWorkload, Scenario, Vendor, Workload } from "./types.js";

/** The prompt the homepage copies; every /for and /from page quotes it unchanged. */
export const CTA_PROMPT =
  "Read https://ohmyho.st/llms.txt and https://ohmyho.st/skills/ohmyhost-get-started/SKILL.md. Connect this agent to ohmyho.st and deploy this GitHub project using only the capabilities it needs. Follow the deployment Skill, keep my existing project decisions and verify the app.";

const MICROCREDITS = 1_000_000;

/** Thousands separators without locale data: 1234567.5 → "1,234,567.5". */
export function number(value: number, decimals?: number): string {
  const text = decimals === undefined ? String(value) : value.toFixed(decimals);
  const [whole = "", fraction] = text.split(".");
  const grouped = whole.replaceAll(/\B(?=(\d{3})+(?!\d))/gu, ",");
  return fraction === undefined ? grouped : `${grouped}.${fraction}`;
}

/** "98.571429" → 98571429, by string arithmetic so no float rounding leaks in. */
export function creditMicros(credits: string): number {
  const [whole = "0", fraction = ""] = credits.split(".");
  return Number(whole) * MICROCREDITS + Number(`${fraction}000000`.slice(0, 6));
}

/** Microcredits for a measured quantity, rounded up like the platform does. Build seconds use the exact sandbox rational of PRICING.md (3.5144 credits per 175 s). */
export function priceLine(meter: MeterId, quantity: number): number {
  if (meter === "build.sandbox.standard-3") return Math.ceil((3_514_400 * quantity) / 175);
  const rate = CREDIT_RATES[meter];
  return Math.ceil((creditMicros(rate.credits) * quantity) / rate.quantity);
}

export function priceWorkload(workload: Workload): PricedWorkload {
  const lines = workload.lines.map((line) => ({
    ...line,
    microcredits: priceLine(line.meter, line.quantity),
  }));
  return {
    name: workload.name,
    lines,
    microcredits: lines.reduce((sum, line) => sum + line.microcredits, 0),
  };
}

/** "$20", "$0.15", "$0.125", "$1,234.50". */
export function usd(amount: number): string {
  if (Number.isInteger(amount)) return `$${number(amount)}`;
  const cents = amount.toFixed(2);
  return `$${Number(cents) === amount ? number(amount, 2) : number(amount, 3)}`;
}

/** "36.47 credits". */
export function credits(microcredits: number, decimals = 2): string {
  return `${number(microcredits / MICROCREDITS, decimals)} credits`;
}

/** The nominal USD value of microcredits at 100 credits per dollar: "$5.52". */
export function creditValueUsd(microcredits: number): string {
  return `$${number(microcredits / MICROCREDITS / 100, 2)}`;
}

/** The published rate, verbatim: "98.571429 credits per 1,000,000 requests". */
export function rate(meter: MeterId): string {
  const row = CREDIT_RATES[meter];
  return `${row.credits} credits per ${number(row.quantity)} ${row.unit}`;
}

export function scenarioUsd(scenario: Scenario): number {
  return scenario.parts.reduce((sum, part) => sum + part.fact.usd * (part.times ?? 1), 0);
}

/** "List prices checked on 2026-09-19 — [Vercel pricing](https://vercel.com/pricing)." */
export function checkedLine(vendor: Vendor): string {
  return `List prices checked on ${vendor.checkedOn} — [${vendor.name} pricing](${vendor.sourceUrl}).`;
}

export function sourcesSection(...vendors: Vendor[]): string {
  return ["## Sources", "", ...vendors.map((vendor) => `- ${checkedLine(vendor)}`)].join("\n");
}

/** A Markdown table of one workload's lines and total. */
export function workloadTable(workload: Workload): string {
  const priced = priceWorkload(workload);
  return [
    "| Item | Credits |",
    "| --- | ---: |",
    ...priced.lines.map(
      (line) => `| ${line.label} | ${number(line.microcredits / MICROCREDITS, 2)} |`,
    ),
    `| **Total: ${workload.name}** | **about ${number(priced.microcredits / MICROCREDITS, 2)}** |`,
    "",
    `About ${creditValueUsd(priced.microcredits)} of credit value at the standard rate.`,
  ].join("\n");
}
