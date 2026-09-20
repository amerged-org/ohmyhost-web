import type { CREDIT_RATES } from "../generated-pricing.js";

/** Editorial page kinds; each kind selects the schema.org nodes the page emits. */
export type PageKind = "page" | "about" | "article" | "howto" | "collection";

/** One public editorial page: its route, head metadata and Markdown body. */
export interface ContentPage {
  readonly path: string;
  /** Full `<title>` text, 40–60 characters. */
  readonly title: string;
  /** The only `<meta name="description">`, 120–160 characters. */
  readonly description: string;
  readonly kind: PageKind;
  /** ISO date of the last content change: sitemap lastmod and dateModified. */
  readonly modified: string;
  /** ISO date; articles only. */
  readonly published?: string;
  /** Breadcrumb parent route. */
  readonly parent?: string;
  /** Absolute path of a 1200×630 PNG; the site image when absent. */
  readonly ogImage?: string;
  /** Short breadcrumb label; the title's first clause when absent. */
  readonly crumb?: string;
  readonly markdown: string;
}

/** A meter of the published rate card in PRICING.md. */
export type MeterId = keyof typeof CREDIT_RATES;

/** One list price of a competitor, as shown on its pricing page on `checkedOn`. */
export interface PriceFact {
  readonly usd: number;
  readonly unit: string;
  readonly includes?: string;
}

export interface Vendor {
  /** The only spelling pages may use. */
  readonly name: string;
  /** ISO date the pricing page was read. */
  readonly checkedOn: string;
  readonly sourceUrl: string;
  /** Repository path of the dated screenshot. */
  readonly evidence: string;
  readonly facts: Readonly<Record<string, PriceFact>>;
}

export interface WorkloadLine {
  readonly meter: MeterId;
  /** Measured quantity in the meter's unit (build: seconds). */
  readonly quantity: number;
  readonly label: string;
}

export interface Workload {
  readonly name: string;
  readonly lines: readonly WorkloadLine[];
}

export interface PricedLine extends WorkloadLine {
  readonly microcredits: number;
}

export interface PricedWorkload {
  readonly name: string;
  readonly lines: readonly PricedLine[];
  readonly microcredits: number;
}

export interface ScenarioPart {
  readonly vendor: Vendor;
  readonly fact: PriceFact;
  readonly label: string;
  readonly times?: number;
}

/** Subscriptions bought separately; the USD total is computed, never typed. */
export interface Scenario {
  readonly name: string;
  readonly parts: readonly ScenarioPart[];
}
