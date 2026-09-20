import type { Scenario, Vendor, Workload } from "./types.js";

/** Competitor list prices were read on this date; every quoted price carries it. */
export const LIST_PRICES_CHECKED_ON = "2026-09-19";
const EVIDENCE_DIRECTORY = "plan/evidence/P38/site-evidence-20260919";
const evidence = (host: string) =>
  `${EVIDENCE_DIRECTORY}/before--${host}--pricing--1440x900@2--table.png`;

/** The only competitor numbers a page may quote. */
export const VENDORS = {
  vercel: {
    name: "Vercel",
    checkedOn: LIST_PRICES_CHECKED_ON,
    sourceUrl: "https://vercel.com/pricing",
    evidence: evidence("vercel.com"),
    facts: {
      pro: {
        usd: 20,
        unit: "per month",
        includes: "one seat, 1 TB fast data transfer, 10M edge requests, 1M function invocations",
      },
      proSeat: { usd: 20, unit: "per additional seat per month" },
      transferGb: { usd: 0.15, unit: "per GB of fast data transfer beyond the allowance" },
      edgeRequests: { usd: 2, unit: "per 1M edge requests beyond the allowance" },
    },
  },
  supabase: {
    name: "Supabase",
    checkedOn: LIST_PRICES_CHECKED_ON,
    sourceUrl: "https://supabase.com/pricing",
    evidence: evidence("supabase.com"),
    facts: {
      pro: {
        usd: 25,
        unit: "per organization per month",
        includes: "$10 of compute credit, one Micro instance",
      },
      microProject: { usd: 10, unit: "per additional Micro project per month" },
      smallProject: { usd: 15, unit: "per additional Small project per month" },
      diskGb: { usd: 0.125, unit: "per GB of disk beyond 8 GB per project" },
      egressGb: { usd: 0.09, unit: "per GB of egress beyond 250 GB" },
    },
  },
  resend: {
    name: "Resend",
    checkedOn: LIST_PRICES_CHECKED_ON,
    sourceUrl: "https://resend.com/pricing",
    evidence: evidence("resend.com"),
    facts: {
      free: { usd: 0, unit: "per month", includes: "3,000 emails a month, at most 100 a day" },
      pro: { usd: 20, unit: "per month", includes: "50,000 emails" },
      proLarge: { usd: 35, unit: "per month", includes: "100,000 emails" },
      overageThousand: { usd: 0.9, unit: "per 1,000 emails beyond the plan" },
      domainsAddon: { usd: 20, unit: "per month for 100 additional domains" },
    },
  },
  railway: {
    name: "Railway",
    checkedOn: LIST_PRICES_CHECKED_ON,
    sourceUrl: "https://railway.com/pricing",
    evidence: evidence("railway.com"),
    facts: {
      free: { usd: 0, unit: "per month", includes: "$1 of usage a month" },
      hobby: { usd: 5, unit: "per month", includes: "$5 of usage" },
      pro: { usd: 20, unit: "per workspace per month", includes: "$20 of usage" },
      vcpuMonth: { usd: 20, unit: "per vCPU-month" },
      memoryGbMonth: { usd: 10, unit: "per GB of memory per month" },
      volumeGbMonth: { usd: 0.15, unit: "per GB of volume per month" },
      egressGb: { usd: 0.05, unit: "per GB of egress" },
    },
  },
  fly: {
    name: "Fly.io",
    checkedOn: LIST_PRICES_CHECKED_ON,
    sourceUrl: "https://fly.io/pricing",
    evidence: evidence("fly.io"),
    facts: {
      sharedCpu1x: { usd: 1.94, unit: "per month for a shared-cpu-1x machine with 256 MB" },
      sharedCpu4x: { usd: 7.78, unit: "per month for a shared-cpu-4x machine with 1 GB" },
      postgresBasic: { usd: 38, unit: "per month for the Basic managed Postgres cluster" },
      egressGb: { usd: 0.02, unit: "per GB of egress in North America and Europe" },
      volumeGbMonth: { usd: 0.15, unit: "per GB of volume per month" },
    },
  },
} as const satisfies Record<string, Vendor>;

/** Plans and purchase rules from PRICING.md; the rate card itself is generated. */
export const PLANS = {
  freeCredits: 200,
  paidUsd: 10,
  paidCredits: 1000,
  topUpPerUsd: 100,
  topUpPerUsdAbove100: 125,
  usdPerCredit: 0.01,
  graceDays: 7,
} as const;

/** Database compute profiles in CU; an active hour costs profile × the CU-hour rate. */
export const DATABASE_PROFILES = {
  free: { cu: 0.25, meter: "neon.compute.scale" },
  standard: { cu: 0.5, meter: "neon.compute.scale" },
  performance: { cu: 1, meter: "neon.compute.performance" },
} as const;

export const WORKLOADS = {
  smallApp: {
    name: "A small app for one month",
    lines: [
      { meter: "build.sandbox.standard-3", quantity: 1200, label: "20 build minutes" },
      { meter: "wfp.requests", quantity: 100_000, label: "100,000 requests" },
      { meter: "wfp.cpu", quantity: 1_000_000, label: "1M CPU-ms" },
      {
        meter: "neon.compute.scale",
        quantity: 4,
        label: "4 database CU-hours (8 active hours on the Paid standard 0.5 CU profile)",
      },
      { meter: "neon.storage.root", quantity: 1, label: "1 database GB-month" },
      {
        meter: "ses.{region}.recipients (Essentials)",
        quantity: 2000,
        label: "2,000 mail recipients",
      },
    ],
  },
  quietProject: {
    name: "A quiet side project for one month",
    lines: [
      { meter: "build.sandbox.standard-3", quantity: 120, label: "2 build minutes" },
      { meter: "wfp.requests", quantity: 5000, label: "5,000 requests" },
      { meter: "wfp.cpu", quantity: 50_000, label: "50,000 CPU-ms" },
      {
        meter: "neon.compute.scale",
        quantity: 0.5,
        label: "1 active database hour on the Paid standard 0.5 CU profile",
      },
      { meter: "neon.storage.root", quantity: 0.2, label: "0.2 database GB-month" },
      { meter: "wfp.script", quantity: 1, label: "1 deployed script" },
    ],
  },
  clientSite: {
    name: "A client site with its own domain and sender mail for one month",
    lines: [
      { meter: "build.sandbox.standard-3", quantity: 600, label: "10 build minutes" },
      { meter: "wfp.requests", quantity: 50_000, label: "50,000 requests" },
      { meter: "wfp.cpu", quantity: 500_000, label: "500,000 CPU-ms" },
      {
        meter: "neon.compute.scale",
        quantity: 2,
        label: "2 database CU-hours (4 active hours on the Paid standard profile)",
      },
      { meter: "neon.storage.root", quantity: 1, label: "1 database GB-month" },
      {
        meter: "ses.{region}.recipients (Essentials)",
        quantity: 1000,
        label: "1,000 mail recipients",
      },
      { meter: "wfp.script", quantity: 1, label: "1 deployed script" },
      { meter: "domain.custom_hostname", quantity: 1, label: "1 custom hostname" },
      { meter: "route53.zone", quantity: 1, label: "1 mail sender zone" },
    ],
  },
  busyApp: {
    name: "One busy production app for one month",
    lines: [
      { meter: "build.sandbox.standard-3", quantity: 3600, label: "60 build minutes" },
      { meter: "wfp.requests", quantity: 5_000_000, label: "5M requests" },
      { meter: "wfp.cpu", quantity: 50_000_000, label: "50M CPU-ms" },
      {
        meter: "neon.compute.scale",
        quantity: 100,
        label: "100 database CU-hours (200 active hours on the Paid standard profile)",
      },
      { meter: "neon.storage.root", quantity: 10, label: "10 database GB-months" },
      {
        meter: "ses.{region}.recipients (Essentials)",
        quantity: 20_000,
        label: "20,000 mail recipients",
      },
      { meter: "wfp.script", quantity: 1, label: "1 deployed script" },
      { meter: "domain.custom_hostname", quantity: 1, label: "1 custom hostname" },
      { meter: "route53.zone", quantity: 1, label: "1 mail sender zone" },
    ],
  },
} as const satisfies Record<string, Workload>;

export const SCENARIOS = {
  threeSubscriptions: {
    name: "Vercel Pro, Supabase Pro and Resend Pro for one developer and one project",
    parts: [
      { vendor: VENDORS.vercel, fact: VENDORS.vercel.facts.pro, label: "Vercel Pro, 1 seat" },
      {
        vendor: VENDORS.supabase,
        fact: VENDORS.supabase.facts.pro,
        label: "Supabase Pro, 1 project",
      },
      { vendor: VENDORS.resend, fact: VENDORS.resend.facts.pro, label: "Resend Pro" },
    ],
  },
  fiveProjects: {
    name: "The same three subscriptions for five projects",
    parts: [
      { vendor: VENDORS.vercel, fact: VENDORS.vercel.facts.pro, label: "Vercel Pro, 1 seat" },
      {
        vendor: VENDORS.supabase,
        fact: VENDORS.supabase.facts.pro,
        label: "Supabase Pro, 1 project",
      },
      {
        vendor: VENDORS.supabase,
        fact: VENDORS.supabase.facts.microProject,
        label: "4 more Supabase Micro projects",
        times: 4,
      },
      { vendor: VENDORS.resend, fact: VENDORS.resend.facts.pro, label: "Resend Pro" },
    ],
  },
  railwayStack: {
    name: "Railway Pro and Resend Pro for one developer, before usage",
    parts: [
      {
        vendor: VENDORS.railway,
        fact: VENDORS.railway.facts.pro,
        label: "Railway Pro, 1 workspace",
      },
      { vendor: VENDORS.resend, fact: VENDORS.resend.facts.pro, label: "Resend Pro" },
    ],
  },
} as const satisfies Record<string, Scenario>;
