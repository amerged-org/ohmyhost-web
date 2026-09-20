import checkedOn from "../../../../content/data/checked-on.json" with { type: "json" };
import databaseProfiles from "../../../../content/data/database-profiles.json" with { type: "json" };
import plans from "../../../../content/data/plans.json" with { type: "json" };
import scenarioData from "../../../../content/data/scenarios.json" with { type: "json" };
import vendors from "../../../../content/data/vendors.json" with { type: "json" };
import workloads from "../../../../content/data/workloads.json" with { type: "json" };
import type { PriceFact, Scenario, Vendor, Workload } from "./types.js";

/** Keeps each vendor's own fact keys after the JSON import, so a typo cannot reach a page. */
type TypedVendors = {
  [Name in keyof typeof vendors]: Omit<Vendor, "facts"> & {
    facts: { [Fact in keyof (typeof vendors)[Name]["facts"]]: PriceFact };
  };
};

/**
 * The published website data lives in `content/data`, so a price can be reviewed without reading
 * code. Each competitor fact names the dated screenshot it was read from; a fact a screenshot does
 * not show is not recorded, even when the live page states it.
 */
export const VENDORS = vendors as unknown as TypedVendors;

/** Competitor list prices were read on this date; every quoted price carries it. */
export const LIST_PRICES_CHECKED_ON = checkedOn.listPricesCheckedOn;

/** Plans and purchase rules from PRICING.md; the rate card itself is generated. */
export const PLANS = plans;

/** Database compute profiles in CU; an active hour costs profile × the CU-hour rate. */
export const DATABASE_PROFILES = databaseProfiles;

export const WORKLOADS = workloads as unknown as { [Name in keyof typeof workloads]: Workload };

/** Scenario parts reference vendor facts by key in JSON; they are resolved to the facts here. */
export const SCENARIOS = Object.fromEntries(
  Object.entries(scenarioData).map(([name, scenario]) => [
    name,
    {
      name: scenario.name,
      parts: scenario.parts.map((part) => {
        const vendor = VENDORS[part.vendor as keyof typeof vendors] as Vendor | undefined;
        const fact = vendor?.facts[part.fact];
        if (!vendor || !fact)
          throw new Error(
            `Scenario ${name} names an unknown vendor fact: ${part.vendor}.${part.fact}`,
          );
        return {
          vendor,
          fact,
          label: part.label,
          ...("times" in part ? { times: part.times } : {}),
        };
      }),
    },
  ]),
) as unknown as { [Name in keyof typeof scenarioData]: Scenario };
