/**
 * Compiles the website content tree into a module the Worker can serve.
 *
 *   node scripts/prepare-content.mjs
 *
 * The folder path under `content/` is the URL. Each page carries `page.json` (title, description,
 * kind, status, social card, and author and dates for articles) and `content.md` (the prose, with
 * `{{ … }}` tokens for every published number). Tokens resolve here, so a price on a page always
 * comes from PRICING.md or the dated competitor data and never from typing.
 */
import { registerHooks } from "node:module";
import { writeFileSync } from "node:fs";
import prettier from "prettier";
import { join } from "node:path";
import process from "node:process";
/* global URL */
import { fileURLToPath, pathToFileURL } from "node:url";

import { mcpTools } from "./platform-inputs.mjs";

// The site's TypeScript imports name the compiled `.js` file, as TypeScript requires. Node strips
// types on import, so the tree compiles once with the Worker bundle instead of twice: resolve those
// specifiers back to the source next to them.
registerHooks({
  resolve(specifier, context, next) {
    if (
      specifier.startsWith(".") &&
      specifier.endsWith(".js") &&
      context.parentURL?.endsWith(".ts")
    )
      return next(`${specifier.slice(0, -3)}.ts`, context);
    return next(specifier, context);
  },
});

const root = fileURLToPath(new URL("../", import.meta.url));
const contentRoot = join(root, "content");
const site = root;

async function main() {
  const { pageFolders, readPage, resolveTokens } = await import(
    pathToFileURL(join(site, "src/content/tree.ts")).href
  );

  const { CREDIT_RATES } = await import(
    pathToFileURL(join(site, "src/generated-pricing.ts")).href
  );
  const format = await import(
    pathToFileURL(join(site, "src/content/format.ts")).href
  );
  const data = await import(
    pathToFileURL(join(site, "src/content/sources.ts")).href
  );
  const figures = await import(
    pathToFileURL(join(site, "src/figures.ts")).href
  );

  const lookup = (map, name, what) => {
    const value = map[name];
    if (value === undefined) throw new Error(`unknown ${what}: ${name}`);
    return value;
  };
  const vendorFact = (reference) => {
    const [vendorName, factName, field] = reference.split(".").slice(1);
    const vendor = lookup(data.VENDORS, vendorName, "vendor");
    if (factName === undefined) return { vendor };
    const fact = lookup(vendor.facts, factName, `fact on vendor ${vendorName}`);
    return { vendor, fact, field };
  };
  const unitCredits = (reference) => {
    const unit = lookup(data.UNITS, reference.split(".")[1], "unit");
    return format.priceLine(unit.meter, unit.quantity);
  };
  const workloadCredits = (reference) =>
    format.priceWorkload(
      lookup(data.WORKLOADS, reference.split(".")[1], "workload"),
    ).microcredits;

  const render = (kind, args, options) => {
    const [first] = args;
    const decimals = options.dp === undefined ? undefined : Number(options.dp);
    switch (kind) {
      case "prompt":
        return format.CTA_PROMPT;
      case "rate": {
        // A meter name can contain spaces, so it is the whole argument list.
        const meter = args.join(" ");
        if (!(meter in CREDIT_RATES))
          throw new Error(`unknown meter: ${meter}`);
        return format.rate(meter);
      }
      case "checked":
        return format.checkedLine(lookup(data.VENDORS, first, "vendor"));
      case "sources":
        return format.sourcesSection(
          ...args.map((name) => lookup(data.VENDORS, name, "vendor")),
        );
      case "tools":
        return String(mcpTools().tools.length);
      case "price":
        return format.price(vendorFact(first).fact);
      case "usd":
        if (/^[\d.]+$/u.test(first)) return format.usd(Number(first));
        if (first.startsWith("vendor."))
          return format.usd(vendorFact(first).fact.usd);
        if (first.startsWith("scenario."))
          return format.usd(
            format.scenarioUsd(
              lookup(data.SCENARIOS, first.split(".")[1], "scenario"),
            ),
          );
        if (first.startsWith("plan."))
          return format.usd(
            lookup(data.PLANS, first.split(".")[1], "plan value"),
          );
        throw new Error(`usd cannot read ${first}`);
      case "usdPerMonth":
        return format.usd(format.perSecondMonthly(vendorFact(first).fact.usd));
      case "usdValue":
        return format.creditValueUsd(
          first.startsWith("unit.")
            ? unitCredits(first)
            : workloadCredits(first),
        );
      case "credits":
        return format.credits(
          first.startsWith("unit.")
            ? unitCredits(first)
            : workloadCredits(first),
          decimals,
        );
      case "number":
        if (/^[\d.]+$/u.test(first))
          return format.number(Number(first), decimals);
        if (first.startsWith("plan."))
          return format.number(
            lookup(data.PLANS, first.split(".")[1], "plan value"),
            decimals,
          );
        if (first.startsWith("profile."))
          return format.number(
            lookup(data.DATABASE_PROFILES, first.split(".")[1], "profile").cu,
            decimals,
          );
        if (first.startsWith("unit."))
          return format.number(unitCredits(first) / 1_000_000, decimals);
        throw new Error(`number cannot read ${first}`);
      case "value": {
        if (first.startsWith("plan."))
          return String(lookup(data.PLANS, first.split(".")[1], "plan value"));
        if (first.startsWith("profile."))
          return String(
            lookup(data.DATABASE_PROFILES, first.split(".")[1], "profile").cu,
          );
        const { fact, field } = vendorFact(first);
        return String(fact[field ?? "usd"]);
      }
      case "text": {
        if (first.startsWith("workload."))
          return lookup(data.WORKLOADS, first.split(".")[1], "workload").name;
        if (first.startsWith("scenario."))
          return lookup(data.SCENARIOS, first.split(".")[1], "scenario").name;
        // vendor.<name>.<property> reads the vendor itself; vendor.<name>.<fact>.<field> reads a fact.
        const [, vendorName, second, third] = first.split(".");
        const vendor = lookup(data.VENDORS, vendorName, "vendor");
        if (third === undefined) {
          if (!(second in vendor))
            throw new Error(
              `unknown property on vendor ${vendorName}: ${second}`,
            );
          return String(vendor[second]);
        }
        const fact = lookup(
          vendor.facts,
          second,
          `fact on vendor ${vendorName}`,
        );
        if (!(third in fact))
          throw new Error(`unknown field on ${vendorName}.${second}: ${third}`);
        return String(fact[third]);
      }
      case "table":
        if (first === "rates") return CREDIT_PRICING_TABLE_TEXT;
        return format.workloadTable(
          lookup(data.WORKLOADS, first.split(".")[1], "workload"),
        );
      case "figure": {
        const [family, name] = first.split(".");
        if (family === "creditBars") return figures.figureCreditBars();
        if (family === "bills") return figures.figureBills(name);
        if (family === "comparison") return figures.comparisonColumns(name);
        if (family === "flow")
          return figures.figureFlow(FLOW_AGENTS[name] ?? name);
        throw new Error(`unknown figure: ${first}`);
      }
      default:
        throw new Error(`unknown token kind: ${kind}`);
    }
  };

  const { CREDIT_PRICING_TABLE } = await import(
    pathToFileURL(join(site, "src/generated-pricing.ts")).href
  );
  CREDIT_PRICING_TABLE_TEXT = CREDIT_PRICING_TABLE;

  const pages = [];
  for (const { url, directory } of pageFolders(contentRoot)) {
    const page = readPage(directory, url);
    if (page.status === "draft") continue;
    pages.push({
      ...page,
      markdown: resolveTokens(page.markdown, url, render),
    });
  }
  pages.sort((a, b) => a.path.localeCompare(b.path));
  const module = `// Generated from content/ by content:prepare. Edit the content tree, not this file.
import type { ContentPage } from "./content/types.js";

export const CONTENT_PAGE_LIST: readonly ContentPage[] = ${JSON.stringify(
    pages.map(
      ({
        path,
        title,
        description,
        kind,
        crumb,
        parent,
        author,
        published,
        modified,
        social,
        markdown,
      }) => ({
        path,
        title,
        description,
        kind,
        ...(crumb ? { crumb } : {}),
        ...(parent ? { parent } : {}),
        ...(author ? { author } : {}),
        ...(published ? { published } : {}),
        modified,
        ...(social?.image
          ? { ogImage: social.image, ogImageAlt: social.alt ?? undefined }
          : {}),
        markdown,
      }),
    ),
    null,
    2,
  )};
`;
  writeFileSync(
    join(site, "src/generated-content.ts"),
    await prettier.format(module, { parser: "typescript", printWidth: 100 }),
  );
  process.stderr.write(`content: ${pages.length} pages compiled\n`);
}

let CREDIT_PRICING_TABLE_TEXT = "";
const FLOW_AGENTS = {
  "claude-code": "Claude Code",
  cursor: "Cursor",
  codex: "Codex",
  "lovable-export": "Lovable export",
  "bolt-export": "Bolt export",
};

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exit(1);
  });
}
