/**
 * The platform publishes what this website quotes: the credit rate card, the Skill pages, the MCP
 * tool catalog and the current client release. It arrives as one reviewed file, so a build is
 * deterministic and offline and a price change is visible as a diff.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const inputs = JSON.parse(
  readFileSync(fileURLToPath(new URL("../platform-inputs.json", import.meta.url)), "utf8"),
);

for (const field of [
  "creditPricingTable",
  "creditRates",
  "skills",
  "mcpTools",
  "clientRelease",
  "openapiJson",
  "openapiYaml",
])
  if (inputs[field] === undefined) throw new Error(`platform-inputs.json is missing ${field}`);

/** The published rate card as markdown, exactly as the platform generated it from PRICING.md. */
export const creditPricingTable = () => inputs.creditPricingTable;

/** Every meter and its price, used to resolve `{{ credits … }}` and `{{ rate … }}` tokens. */
export const creditPricingRates = () => inputs.creditRates;

/** The installable Skills this site serves under /skills. */
export const skillResources = () => inputs.skills;

/** The MCP tool catalog this site serves as /mcp-tools.json. */
export const mcpTools = () => inputs.mcpTools;

/** The current client release the site links to. */
export const clientRelease = () => inputs.clientRelease;

/** The platform commit the inputs were generated from; shown in the sync commit message. */
export const platformCommit = () => inputs.platformCommit;

/** The published API contract, bundled by the platform. */
export const openapiJson = () => inputs.openapiJson;

/** The same contract as YAML, served next to it. */
export const openapiYaml = () => inputs.openapiYaml;
