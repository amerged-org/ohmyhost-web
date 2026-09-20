import { DATABASE_PROFILES, SCENARIOS, VENDORS, WORKLOADS } from "./content/sources.js";
import { credits, number, priceLine, priceWorkload, scenarioUsd, usd } from "./content/format.js";
import type { Scenario, Vendor } from "./content/types.js";
import mcpTools from "./generated-mcp-tools.json" with { type: "json" };

const MONO = 'font-family="JetBrains Mono, ui-monospace, monospace"';
const SANS = 'font-family="Space Grotesk, system-ui, sans-serif"';
const OMEGA = "M30 87 H14 L27 63 A31 31 0 1 1 73 63 L86 87 H70";
const MICROCREDITS = 1_000_000;

function figure(label: string, svg: string, caption: string): string {
  return `<figure class="fig" aria-label="${label}">${svg}<figcaption>${caption}</figcaption></figure>`;
}

function longDate(iso: string): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [year, month, day] = iso.split("-").map(Number);
  return `${months[(month ?? 1) - 1]} ${day}, ${year}`;
}

function sourceLinks(vendors: readonly Vendor[]): string {
  return vendors
    .map((vendor) => `<a href="${vendor.sourceUrl}" rel="noopener">${vendor.name} pricing</a>`)
    .join(" · ");
}

function value(amount: number, text: string, x: number, y: number, extra = ""): string {
  return `<text x="${x}" y="${y}" text-anchor="end" ${SANS} font-size="17" font-weight="600" fill="var(--foreground)" data-value="${amount}"${extra}>${text}</text>`;
}

/** Three subscriptions stacked as receipts against one ohmyho.st balance. */
export type BillsCompetitor = "vercel" | "supabase" | "resend" | "railway";

export function billsScenario(competitor: BillsCompetitor): Scenario {
  return competitor === "railway" ? SCENARIOS.railwayStack : SCENARIOS.threeSubscriptions;
}

export function figureBills(competitor: BillsCompetitor): string {
  const scenario = billsScenario(competitor);
  const named = VENDORS[competitor];
  const total = scenarioUsd(scenario);
  const receipts = scenario.parts
    .map((part, index) => {
      const y = 36 + index * 74;
      const highlighted = part.vendor.name === named.name;
      return `<rect x="40" y="${y}" width="380" height="58" rx="12" fill="none" stroke="${highlighted ? "var(--foreground)" : "var(--border-strong)"}"/><text x="60" y="${y + 34}" ${MONO} font-size="12" fill="${highlighted ? "var(--foreground)" : "var(--muted-foreground)"}">${part.label.toLowerCase()}</text>${value(part.fact.usd * (part.times ?? 1), `${usd(part.fact.usd * (part.times ?? 1))} /mo`, 400, y + 36)}`;
    })
    .join("");
  const extraProject =
    competitor === "railway"
      ? `usage above ${usd(VENDORS.railway.facts.pro.usd)} is billed per second`
      : `+${usd(VENDORS.supabase.facts.microProject.usd)} each extra project`;
  const rows = [
    ["hosting", "uses credits"],
    ["postgres", "uses credits"],
    ["email", "uses credits"],
    ["link a domain", "uses credits"],
    ["each extra project", "no base fee"],
  ]
    .map(
      ([label, right], index) =>
        `<text x="560" y="${112 + index * 30}" ${MONO} font-size="12" fill="var(--muted-foreground)">${label}</text><text x="900" y="${112 + index * 30}" text-anchor="end" ${MONO} font-size="12" fill="var(--subtle)">${right}</text>`,
    )
    .join("");
  const left = scenario.parts.length * 74 + 30;
  const svg = `<svg viewBox="0 0 960 340" role="img" aria-label="${scenario.parts.length} subscriptions at ${usd(total)} a month versus one ohmyho.st balance at ${usd(10)} a month for every project" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="bills-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="currentColor" stop-opacity=".08"/><stop offset="100%" stop-color="currentColor" stop-opacity="0"/></radialGradient></defs>${receipts}<text x="40" y="${left}" ${MONO} font-size="12" fill="var(--subtle)">${scenario.parts.length} accounts · 1 project · ${extraProject}</text>${value(total, `${usd(total)} /mo`, 420, left)}<line x1="480" y1="36" x2="480" y2="300" stroke="var(--border)"/><ellipse cx="730" cy="160" rx="230" ry="120" fill="url(#bills-glow)"/><rect x="540" y="36" width="380" height="216" rx="12" fill="none" stroke="var(--foreground)"/><path d="${OMEGA}" transform="translate(556 44) scale(.32)" fill="none" stroke="var(--foreground)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><text x="600" y="66" ${SANS} font-size="15" font-weight="600" fill="var(--foreground)">ohmyho.st · every project</text>${rows}<text x="540" y="${left}" ${MONO} font-size="12" fill="var(--subtle)">1 balance · ${number(1000)} credits a month</text>${value(10, `${usd(10)} /mo`, 920, left)}</svg>`;
  return figure(
    `${scenario.name}: ${usd(total)} a month, against one ohmyho.st balance from ${usd(10)} a month.`,
    svg,
    `List prices checked on ${longDate(named.checkedOn)} · ${sourceLinks([...new Set(scenario.parts.map((part) => part.vendor))])}. ohmyho.st: ${usd(10)} a month buys ${number(1000)} credits shared by every project; hosting, Postgres, mail and a linked domain are metered from that balance.`,
  );
}

/** The rows of the credit bar chart: unit prices and the example workload, all computed. */
export function creditBarRows(): Array<{ label: string; microcredits: number }> {
  const example = priceWorkload(WORKLOADS.smallApp);
  return [
    { label: "1M requests", microcredits: priceLine("wfp.requests", 1_000_000) },
    {
      label: "1,000 mail recipients",
      microcredits: priceLine("ses.{region}.recipients (Essentials)", 1000),
    },
    {
      label: "1 active database hour, Paid standard (0.5 CU)",
      microcredits: priceLine("neon.compute.scale", DATABASE_PROFILES.standard.cu),
    },
    { label: "1 database GB-month", microcredits: priceLine("neon.storage.root", 1) },
    { label: "1 custom hostname, per month", microcredits: priceLine("domain.custom_hostname", 1) },
    { label: "1 mail sender zone, per month", microcredits: priceLine("route53.zone", 1) },
    { label: "20 build minutes", microcredits: priceLine("build.sandbox.standard-3", 1200) },
    { label: example.name.toLowerCase(), microcredits: example.microcredits },
  ];
}

/** Monochrome horizontal bars: where the credits go, with the numbers counting up on scroll. */
export function figureCreditBars(): string {
  const rows = creditBarRows();
  const max = Math.max(...rows.map((row) => row.microcredits));
  const height = rows.length * 46 + 24;
  const bars = rows
    .map((row, index) => {
      const y = 20 + index * 46;
      const width = Math.max(4, Math.round((row.microcredits / max) * 560));
      const display = number(row.microcredits / MICROCREDITS, 2);
      return `<text x="0" y="${y + 13}" ${MONO} font-size="12" fill="var(--muted-foreground)">${row.label}</text><rect x="0" y="${y + 22}" width="560" height="6" rx="3" fill="var(--border)"/><rect x="0" y="${y + 22}" width="${width}" height="6" rx="3" fill="var(--foreground)"/><text class="count" x="640" y="${y + 29}" ${SANS} font-size="15" font-weight="600" fill="var(--foreground)" data-value="${display}" data-count-to="${display}" data-suffix=" credits">${display} credits</text>`;
    })
    .join("");
  return figure(
    "Credits per measured unit and for the example workload",
    `<svg viewBox="0 0 960 ${height}" role="img" aria-label="Credits per unit: ${rows.map((row) => `${row.label} ${number(row.microcredits / MICROCREDITS, 2)}`).join("; ")}" xmlns="http://www.w3.org/2000/svg">${bars}<line x1="0" y1="${height - 4}" x2="560" y2="${height - 4}" stroke="var(--border-strong)"/></svg>`,
    `Every value comes from the published rate card in PRICING.md; ${number(100)} credits represent ${usd(1)} of credit value. The example workload is itemised below.`,
  );
}

const FLOW_TOOLS = [
  "project_create",
  "source_link",
  "deployment_plan",
  "deployment_create",
] as const;

/** The real tool names the flow figure prints, all present in the served MCP catalog. */
export function flowToolNames(): readonly string[] {
  return FLOW_TOOLS;
}

export type FlowAgent = "Claude Code" | "Cursor" | "Codex" | "Lovable export" | "Bolt export";

/** One prompt into the agent, MCP tools into ohmyho.st, hosting fanning out on the right. */
export function figureFlow(agent: FlowAgent): string {
  const source = agent.endsWith("export")
    ? `${agent.toLowerCase()} · github repo`
    : "you · one prompt";
  const harness = agent.endsWith("export") ? "your agent" : agent.toLowerCase();
  const outputs = ["hosting", "postgres", "link a domain", "email", "live url"];
  const outputMarks = outputs
    .map((label, index) => {
      const y = 40 + index * 42;
      return `<path d="M628 125 C700 125,705 ${y},772 ${y}" fill="none" stroke="var(--border-strong)"/><circle cx="776" cy="${y}" r="2.5" fill="var(--subtle)"/><text x="792" y="${y + 4}" ${MONO} font-size="11.5" fill="var(--muted-foreground)">${label}</text>`;
    })
    .join("");
  const tools = FLOW_TOOLS.map(
    (tool, index) =>
      `<text x="510" y="${196 + index * 16}" text-anchor="middle" ${MONO} font-size="10.5" fill="var(--subtle)">${tool}</text>`,
  ).join("");
  const svg = `<svg viewBox="-6 0 924 270" role="img" aria-label="${source} flows through ${harness} and the MCP tools into ohmyho.st, which fans out to ${outputs.join(", ")}" xmlns="http://www.w3.org/2000/svg"><style>@media (prefers-reduced-motion:reduce){.particle{display:none}}</style><defs><radialGradient id="flow-glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="currentColor" stop-opacity=".08"/><stop offset="100%" stop-color="currentColor" stop-opacity="0"/></radialGradient><path id="flow-in" d="M120 125 L236 125"/><path id="flow-mcp" d="M348 125 L392 125"/><path id="flow-hub" d="M438 125 L452 125"/></defs><ellipse cx="510" cy="125" rx="170" ry="80" fill="url(#flow-glow)"/><g fill="none" stroke="var(--border-strong)"><use href="#flow-in"/><use href="#flow-mcp"/><use href="#flow-hub"/></g><circle cx="116" cy="125" r="2.5" fill="var(--subtle)"/><text x="104" y="129" text-anchor="end" ${MONO} font-size="11.5" fill="var(--muted-foreground)">${source}</text><rect x="236" y="111" width="112" height="28" rx="8" fill="var(--card)" stroke="var(--border-strong)"/><text x="292" y="129" text-anchor="middle" ${MONO} font-size="11.5" fill="var(--muted-foreground)">${harness}</text><rect x="392" y="111" width="46" height="28" rx="8" fill="var(--card)" stroke="var(--border-strong)"/><text x="415" y="129" text-anchor="middle" ${MONO} font-size="11.5" fill="var(--muted-foreground)">mcp</text><rect x="452" y="104" width="176" height="42" rx="10" fill="var(--card)" stroke="var(--border-strong)"/><path d="${OMEGA}" transform="translate(462 111) scale(.28)" fill="none" stroke="var(--foreground)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><text x="548" y="130" text-anchor="middle" ${MONO} font-size="13" fill="var(--foreground)">ohmyho.st</text>${tools}${outputMarks}<g class="particle" fill="var(--muted-foreground)"><circle r="2.4"><animateMotion dur="3s" repeatCount="indefinite"><mpath href="#flow-in"/></animateMotion></circle><circle r="2.4"><animateMotion dur="2.2s" begin="1s" repeatCount="indefinite"><mpath href="#flow-mcp"/></animateMotion></circle></g></svg>`;
  return figure(
    `How a ${agent} deployment reaches ohmyho.st`,
    svg,
    `The agent reads llms.txt, calls the MCP tools (${FLOW_TOOLS.join(", ")} and the rest of the ${mcpTools.tools.length}-tool catalog) and returns the live URL. Every mutation is a plan you confirm before it executes.`,
  );
}

/** The homepage's two comparison cards, rebuilt from the same scenario the bills figure draws. */
export function comparisonColumns(competitor: BillsCompetitor): string {
  const scenario = billsScenario(competitor);
  const total = scenarioUsd(scenario);
  const vendors = [...new Set(scenario.parts.map((part) => part.vendor))];
  const small = priceWorkload(WORKLOADS.smallApp);
  const lines = scenario.parts
    .map(
      (part) =>
        `<div class="li"><b>${part.label}</b><span data-value="${part.fact.usd * (part.times ?? 1)}">${usd(part.fact.usd * (part.times ?? 1))}</span></div>`,
    )
    .join("");
  const extra =
    competitor === "railway"
      ? `<div class="li"><b>Usage above the plan</b><span>per second</span></div>`
      : `<div class="li"><b>Each extra project</b><span data-value="${VENDORS.supabase.facts.microProject.usd}">+${usd(VENDORS.supabase.facts.microProject.usd)}</span></div>`;
  return `<div class="vs"><div class="card"><h3>Bought separately</h3><p class="scen">${scenario.name}</p>${lines}${extra}<div class="tot"><em>${scenario.parts.length} accounts, 1 project</em><strong><span data-value="${total}">${usd(total)}</span><u>/mo</u></strong></div><p class="src">List prices checked on ${longDate(vendors[0]?.checkedOn ?? "")}: ${vendors.map((vendor) => `<a href="${vendor.sourceUrl}" rel="noopener">${vendor.name}</a>`).join(", ")}.</p></div><div class="card on"><h3>ohmyho.st</h3><p class="scen">one balance, every project</p><div class="li"><b>Hosting</b><span>uses credits</span></div><div class="li"><b>Postgres</b><span>uses credits</span></div><div class="li"><b>Email</b><span>uses credits</span></div><div class="li"><b>Link a domain</b><span>uses credits</span></div><div class="li"><b>Each extra project</b><span>no base fee</span></div><div class="tot"><em>1 balance, every project</em><strong><span data-value="10">${usd(10)}</span><u>/mo</u></strong></div><p class="src">${usd(10)} a month buys ${number(1000)} credits. ${small.name} costs about <span data-value="${number(small.microcredits / MICROCREDITS, 2)}">${credits(small.microcredits)}</span>; a quiet project keeps only its stored data and deployed script.</p></div></div>`;
}
