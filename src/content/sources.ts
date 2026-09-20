import type { Scenario, Vendor, Workload } from "./types.js";

/** Competitor list prices were read on this date; every quoted price carries it. */
export const LIST_PRICES_CHECKED_ON = "2026-09-19";
const EVIDENCE_DIRECTORY = "plan/evidence/P38/site-evidence-20260919";
const evidence = (host: string, kind: "full.jpg" | "table.png") =>
  `${EVIDENCE_DIRECTORY}/before--${host}--pricing--1440x900@2--${kind}`;

/**
 * The only competitor numbers a page may quote. Each fact was read from the dated screenshot
 * named in `evidence` (verified 2026-09-20 by one skeptic per vendor); facts a screenshot does not
 * show are not recorded, even when the live page states them.
 */
export const VENDORS = {
  vercel: {
    name: "Vercel",
    checkedOn: LIST_PRICES_CHECKED_ON,
    sourceUrl: "https://vercel.com/pricing",
    evidence: evidence("vercel.com", "full.jpg"),
    facts: {
      hobby: {
        usd: 0,
        unit: "per month",
        includes:
          "one developer seat, 100 GB fast data transfer, 1M edge requests and 1M function invocations a month",
      },
      pro: {
        usd: 20,
        unit: "per month",
        includes:
          "$20 of included usage credit each month, Flat Rate CDN with no overages for CDN requests and fast data transfer, free viewer seats",
      },
      developerSeat: { usd: 20, unit: "per developer seat per month" },
      functionInvocations: {
        usd: 0.6,
        unit: "per 1M function invocations beyond the included credit",
      },
    },
  },
  supabase: {
    name: "Supabase",
    checkedOn: LIST_PRICES_CHECKED_ON,
    sourceUrl: "https://supabase.com/pricing",
    evidence: evidence("supabase.com", "full.jpg"),
    facts: {
      pro: {
        usd: 25,
        unit: "per month, from",
        includes:
          "the first project's Micro instance through $10 of compute credits, 8 GB disk per project, 250 GB egress a month, 100,000 monthly active users",
      },
      microProject: { usd: 10, unit: "per month for each additional project's Micro instance" },
      smallProject: { usd: 15, unit: "per month for a Small compute instance" },
      diskGb: { usd: 0.125, unit: "per GB of disk per month beyond 8 GB per project" },
      egressGb: { usd: 0.09, unit: "per GB of egress per month beyond 250 GB" },
      cachedEgressGb: { usd: 0.03, unit: "per GB of cached egress per month beyond 250 GB" },
    },
  },
  resend: {
    name: "Resend",
    checkedOn: LIST_PRICES_CHECKED_ON,
    sourceUrl: "https://resend.com/pricing",
    evidence: evidence("resend.com", "table.png"),
    facts: {
      free: { usd: 0, unit: "per month", includes: "3,000 emails a month, at most 100 a day" },
      pro: {
        usd: 20,
        unit: "per month",
        includes: "50,000 emails a month; pay-as-you-go overage is opt-in",
      },
      scale: { usd: 90, unit: "per month", includes: "100,000 emails a month" },
      overageThousand: {
        usd: 0.9,
        unit: "per 1,000 emails beyond the plan when pay-as-you-go is enabled",
      },
      domainsAddon: { usd: 20, unit: "per month for 100 additional domains" },
    },
  },
  railway: {
    name: "Railway",
    checkedOn: LIST_PRICES_CHECKED_ON,
    sourceUrl: "https://railway.com/pricing",
    evidence: evidence("railway.com", "table.png"),
    facts: {
      free: {
        usd: 0,
        unit: "per month",
        includes: "a 30-day trial with $5 of credits, then $1 per month; one project member",
      },
      hobby: {
        usd: 5,
        unit: "per month minimum usage",
        includes: "$5 of monthly usage credits, a single developer workspace",
      },
      pro: {
        usd: 20,
        unit: "per month minimum usage",
        includes: "$20 of monthly usage credits, unlimited workspace seats",
      },
      vcpuSecond: { usd: 0.00000772, unit: "per vCPU per second" },
      memoryGbSecond: { usd: 0.00000386, unit: "per GB of memory per second" },
      volumeGbSecond: { usd: 0.00000006, unit: "per GB of volume per second" },
      egressGb: { usd: 0.05, unit: "per GB of service egress; bucket egress is free" },
      objectStorageGbMonth: { usd: 0.015, unit: "per GB-month of object storage" },
    },
  },
  fly: {
    name: "Fly.io",
    checkedOn: LIST_PRICES_CHECKED_ON,
    sourceUrl: "https://fly.io/pricing",
    evidence: evidence("fly.io", "full.jpg"),
    facts: {
      sharedCpu1x: {
        usd: 1.94,
        unit: "per month for a shared-cpu-1x machine with 256 MB in Ashburn, billed by the second while it runs",
      },
      performance1x: {
        usd: 31,
        unit: "per month for a performance-1x machine with 2 GB in Ashburn",
      },
      stoppedMachineGb: {
        usd: 0.15,
        unit: "per GB of root filesystem per month while a machine is stopped",
      },
      additionalRamGb: { usd: 5, unit: "per GB of additional RAM per month" },
      volumeGbMonth: { usd: 0.15, unit: "per GB of provisioned volume per month" },
      snapshotGbMonth: {
        usd: 0.08,
        unit: "per GB of snapshots per month; the first 10 GB are free",
      },
      egressGb: { usd: 0.02, unit: "per GB of egress in North America and Europe" },
    },
  },
  render: {
    name: "Render",
    checkedOn: LIST_PRICES_CHECKED_ON,
    sourceUrl: "https://render.com/pricing",
    evidence: evidence("render.com", "full.jpg"),
    facts: {
      hobby: {
        usd: 0,
        unit: "per month plus compute",
        includes:
          "one seat, up to 25 services, 5 GB bandwidth, 2 custom domains, 500 build minutes a month; free compute rows carry usage limits",
      },
      pro: {
        usd: 25,
        unit: "per month plus compute",
        includes:
          "unlimited seats, 25 GB bandwidth, 15 custom domains, 1,000 build minutes a month",
      },
      webService512: { usd: 7, unit: "per month for a 0.5 CPU, 512 MB web service (0.5c-512mb)" },
      webService2g: { usd: 25, unit: "per month for a 1 CPU, 2 GB web service (1c-2g)" },
      postgres256: {
        usd: 6,
        unit: "per month for a 0.1 CPU, 256 MB Postgres instance (0.1c-256mb)",
      },
      postgres1g: { usd: 19, unit: "per month for a 0.5 CPU, 1 GB Postgres instance (0.5c-1g)" },
      postgresStorageGb: {
        usd: 0.3,
        unit: "per GB of expandable Postgres storage; 1 GB SSD is included per instance",
      },
      diskGbMonth: { usd: 0.25, unit: "per GB of persistent disk per month" },
      bandwidthGb: { usd: 0.15, unit: "per GB of bandwidth beyond the plan" },
      domainOverage: { usd: 0.25, unit: "per custom domain per month beyond the plan" },
      buildMinutes: { usd: 5, unit: "per 1,000 build minutes beyond the plan" },
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
  idleDatabase: {
    name: "One idle project for one month",
    lines: [
      { meter: "neon.storage.root", quantity: 1, label: "1 database GB-month" },
      { meter: "wfp.script", quantity: 1, label: "1 deployed script" },
    ],
  },
  alwaysOnDatabase: {
    name: "A database that never suspends for one month",
    lines: [
      {
        meter: "neon.compute.scale",
        quantity: 372,
        label: "372 database CU-hours (744 active hours on the Paid standard 0.5 CU profile)",
      },
      { meter: "neon.storage.root", quantity: 8, label: "8 database GB-months" },
    ],
  },
  fiveQuietProjects: {
    name: "Five quiet side projects for one month",
    lines: [
      {
        meter: "build.sandbox.standard-3",
        quantity: 600,
        label: "10 build minutes across five projects",
      },
      { meter: "wfp.requests", quantity: 25_000, label: "25,000 requests" },
      { meter: "wfp.cpu", quantity: 250_000, label: "250,000 CPU-ms" },
      {
        meter: "neon.compute.scale",
        quantity: 2.5,
        label: "5 active database hours on the Paid standard 0.5 CU profile (2.5 CU-hours)",
      },
      {
        meter: "neon.storage.root",
        quantity: 1,
        label: "1 database GB-month (0.2 GB each)",
      },
      { meter: "wfp.script", quantity: 5, label: "5 deployed scripts" },
    ],
  },
  threeStaticSites: {
    name: "Three static portfolio sites for one month",
    lines: [
      {
        meter: "build.sandbox.standard-3",
        quantity: 360,
        label: "6 build minutes (three deploys of 2 minutes)",
      },
      { meter: "wfp.requests", quantity: 15_000, label: "15,000 requests" },
      { meter: "wfp.cpu", quantity: 150_000, label: "150,000 CPU-ms" },
      {
        meter: "wfp.script",
        quantity: 6,
        label: "6 deployed scripts (Dev and Prod for each site)",
      },
    ],
  },
  portfolio: {
    name: "A portfolio of five side projects for one month",
    lines: [
      { meter: "build.sandbox.standard-3", quantity: 1680, label: "28 build minutes" },
      { meter: "wfp.requests", quantity: 120_000, label: "120,000 requests" },
      { meter: "wfp.cpu", quantity: 1_200_000, label: "1.2M CPU-ms" },
      {
        meter: "neon.compute.scale",
        quantity: 6,
        label:
          "6 database CU-hours (12 active hours on the Paid standard 0.5 CU profile across five databases)",
      },
      { meter: "neon.storage.root", quantity: 1.8, label: "1.8 database GB-months" },
      {
        meter: "ses.{region}.recipients (Essentials)",
        quantity: 500,
        label: "500 mail recipients",
      },
      {
        meter: "route53.zone",
        quantity: 1,
        label: "1 mail sender zone (one project sends mail)",
      },
      { meter: "wfp.script", quantity: 5, label: "5 deployed scripts" },
    ],
  },
  fiveSideProjects: {
    name: "Four quiet side projects and one small app for one month",
    lines: [
      {
        meter: "build.sandbox.standard-3",
        quantity: 1680,
        label: "28 build minutes (2 for each quiet project, 20 for the small app)",
      },
      { meter: "wfp.requests", quantity: 120_000, label: "120,000 requests" },
      { meter: "wfp.cpu", quantity: 1_200_000, label: "1.2M CPU-ms" },
      {
        meter: "neon.compute.scale",
        quantity: 6,
        label:
          "6 database CU-hours (12 active hours on the Paid standard 0.5 CU profile across five databases)",
      },
      { meter: "neon.storage.root", quantity: 1.8, label: "1.8 database GB-months" },
      {
        meter: "ses.{region}.recipients (Essentials)",
        quantity: 2000,
        label: "2,000 mail recipients",
      },
      {
        meter: "wfp.script",
        quantity: 4,
        label: "4 deployed scripts (one for each quiet project)",
      },
    ],
  },
  fiveSideProjectsWithSender: {
    name: "The same five projects with the small app's deployed script and its mail sender zone",
    lines: [
      { meter: "build.sandbox.standard-3", quantity: 1680, label: "28 build minutes" },
      { meter: "wfp.requests", quantity: 120_000, label: "120,000 requests" },
      { meter: "wfp.cpu", quantity: 1_200_000, label: "1.2M CPU-ms" },
      {
        meter: "neon.compute.scale",
        quantity: 6,
        label:
          "6 database CU-hours (12 active hours on the Paid standard 0.5 CU profile across five databases)",
      },
      { meter: "neon.storage.root", quantity: 1.8, label: "1.8 database GB-months" },
      {
        meter: "ses.{region}.recipients (Essentials)",
        quantity: 2000,
        label: "2,000 mail recipients",
      },
      { meter: "wfp.script", quantity: 5, label: "5 deployed scripts" },
      { meter: "route53.zone", quantity: 1, label: "1 mail sender zone" },
    ],
  },
  fiftyThousandRecipients: {
    name: "50,000 mail recipients in one month",
    lines: [
      {
        meter: "ses.{region}.recipients (Essentials)",
        quantity: 50_000,
        label: "50,000 mail recipients",
      },
    ],
  },
  agentLoop: {
    name: "An agent that redeploys ten times in one month",
    lines: [
      {
        meter: "build.sandbox.standard-3",
        quantity: 3000,
        label: "50 build minutes (ten deployments of 5 minutes)",
      },
      { meter: "wfp.requests", quantity: 20_000, label: "20,000 requests" },
      { meter: "wfp.cpu", quantity: 200_000, label: "200,000 CPU-ms" },
      {
        meter: "neon.compute.scale",
        quantity: 1,
        label: "1 database CU-hour (2 active hours on the Paid standard 0.5 CU profile)",
      },
      { meter: "neon.storage.root", quantity: 0.5, label: "0.5 database GB-month" },
      {
        // Every deployment stages an immutable script that stays for rollback until it is cleaned
        // up, so ten deployments spread across a month bill about 5.5 script-months, not one.
        meter: "wfp.script",
        quantity: 5.5,
        label:
          "ten staged scripts kept for rollback, about 5.5 script-months when the deployments are spread across the month",
      },
    ],
  },
  lovableFrontend: {
    name: "A Lovable frontend that keeps Supabase, with its own domain, for one month",
    lines: [
      { meter: "build.sandbox.standard-3", quantity: 600, label: "10 build minutes" },
      { meter: "wfp.requests", quantity: 100_000, label: "100,000 requests" },
      { meter: "wfp.cpu", quantity: 1_000_000, label: "1M CPU-ms" },
      { meter: "wfp.script", quantity: 1, label: "1 deployed script" },
      { meter: "domain.custom_hostname", quantity: 1, label: "1 custom hostname" },
    ],
  },
  lovableFirstMonth: {
    name: "A Lovable export with managed mail in its first month",
    lines: [
      {
        meter: "build.sandbox.standard-3",
        quantity: 900,
        label: "15 build minutes (three deployments)",
      },
      { meter: "wfp.requests", quantity: 20_000, label: "20,000 requests" },
      { meter: "wfp.cpu", quantity: 200_000, label: "200,000 CPU-ms" },
      {
        meter: "neon.compute.scale",
        quantity: 2,
        label: "2 database CU-hours (4 active hours on the Paid standard profile)",
      },
      { meter: "neon.storage.root", quantity: 0.5, label: "0.5 database GB-month" },
      {
        meter: "ses.{region}.recipients (Essentials)",
        quantity: 500,
        label: "500 mail recipients",
      },
      { meter: "wfp.script", quantity: 1, label: "1 deployed script" },
      { meter: "route53.zone", quantity: 1, label: "1 mail sender zone" },
    ],
  },
  boltKeepSupabase: {
    name: "A Bolt export that keeps Supabase, on the platform host, for one month",
    lines: [
      { meter: "build.sandbox.standard-3", quantity: 300, label: "5 build minutes" },
      { meter: "wfp.requests", quantity: 20_000, label: "20,000 requests" },
      { meter: "wfp.cpu", quantity: 200_000, label: "200,000 CPU-ms" },
      { meter: "wfp.script", quantity: 1, label: "1 deployed script" },
    ],
  },
  boltOwnDomain: {
    name: "A Bolt export with managed Postgres on its own domain for one month",
    lines: [
      { meter: "build.sandbox.standard-3", quantity: 300, label: "5 build minutes" },
      { meter: "wfp.requests", quantity: 20_000, label: "20,000 requests" },
      { meter: "wfp.cpu", quantity: 200_000, label: "200,000 CPU-ms" },
      {
        meter: "neon.compute.scale",
        quantity: 1,
        label: "1 database CU-hour (2 active hours on the Paid standard 0.5 CU profile)",
      },
      { meter: "neon.storage.root", quantity: 0.5, label: "0.5 database GB-month" },
      { meter: "wfp.script", quantity: 1, label: "1 deployed script" },
      { meter: "domain.custom_hostname", quantity: 1, label: "1 custom hostname" },
    ],
  },
  senderTwoThousand: {
    name: "2,000 mail recipients a month from your own sender domain",
    lines: [
      {
        meter: "ses.{region}.recipients (Essentials)",
        quantity: 2_000,
        label: "2,000 mail recipients",
      },
      { meter: "route53.zone", quantity: 1, label: "1 mail sender zone" },
    ],
  },
  senderTenThousand: {
    name: "10,000 mail recipients a month from your own sender domain",
    lines: [
      {
        meter: "ses.{region}.recipients (Essentials)",
        quantity: 10_000,
        label: "10,000 mail recipients",
      },
      { meter: "route53.zone", quantity: 1, label: "1 mail sender zone" },
    ],
  },
  senderThirtyFiveThousand: {
    name: "35,000 mail recipients a month from your own sender domain",
    lines: [
      {
        meter: "ses.{region}.recipients (Essentials)",
        quantity: 35_000,
        label: "35,000 mail recipients",
      },
      { meter: "route53.zone", quantity: 1, label: "1 mail sender zone" },
    ],
  },
  senderFiftyThousand: {
    name: "50,000 mail recipients a month from your own sender domain",
    lines: [
      {
        meter: "ses.{region}.recipients (Essentials)",
        quantity: 50_000,
        label: "50,000 mail recipients",
      },
      { meter: "route53.zone", quantity: 1, label: "1 mail sender zone" },
    ],
  },
} as const satisfies Record<string, Workload>;

export const SCENARIOS = {
  threeSubscriptions: {
    name: "Vercel Pro, Supabase Pro and Resend Pro for one developer and one project",
    parts: [
      { vendor: VENDORS.vercel, fact: VENDORS.vercel.facts.pro, label: "Vercel Pro" },
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
      { vendor: VENDORS.vercel, fact: VENDORS.vercel.facts.pro, label: "Vercel Pro" },
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
    name: "Railway Pro and Resend Pro for one developer, before usage above the credits",
    parts: [
      { vendor: VENDORS.railway, fact: VENDORS.railway.facts.pro, label: "Railway Pro" },
      { vendor: VENDORS.resend, fact: VENDORS.resend.facts.pro, label: "Resend Pro" },
    ],
  },
  vercelProTwoSeats: {
    name: "Vercel Pro with one extra developer seat",
    parts: [
      { vendor: VENDORS.vercel, fact: VENDORS.vercel.facts.pro, label: "Vercel Pro" },
      {
        vendor: VENDORS.vercel,
        fact: VENDORS.vercel.facts.developerSeat,
        label: "1 extra developer seat",
      },
    ],
  },
  vercelSupabase: {
    name: "Vercel Pro and Supabase Pro for one developer and one project",
    parts: [
      { vendor: VENDORS.vercel, fact: VENDORS.vercel.facts.pro, label: "Vercel Pro" },
      {
        vendor: VENDORS.supabase,
        fact: VENDORS.supabase.facts.pro,
        label: "Supabase Pro, 1 project",
      },
    ],
  },
  vercelSupabaseFiveProjects: {
    name: "Vercel Pro and Supabase Pro with five Supabase projects",
    parts: [
      { vendor: VENDORS.vercel, fact: VENDORS.vercel.facts.pro, label: "Vercel Pro" },
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
    ],
  },
  supabaseFiveProjects: {
    name: "Supabase Pro with five projects",
    parts: [
      {
        vendor: VENDORS.supabase,
        fact: VENDORS.supabase.facts.pro,
        label: "Supabase Pro, first project",
      },
      {
        vendor: VENDORS.supabase,
        fact: VENDORS.supabase.facts.microProject,
        label: "4 more Supabase Micro projects",
        times: 4,
      },
    ],
  },
  fiveProjectsFreeTiers: {
    name: "Vercel Hobby, Supabase Pro with five projects and Resend Free",
    parts: [
      { vendor: VENDORS.vercel, fact: VENDORS.vercel.facts.hobby, label: "Vercel Hobby" },
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
      { vendor: VENDORS.resend, fact: VENDORS.resend.facts.free, label: "Resend Free" },
    ],
  },
  renderSmallApp: {
    name: "Render Hobby with one 0.5 CPU web service and one 0.1 CPU Postgres instance",
    parts: [
      { vendor: VENDORS.render, fact: VENDORS.render.facts.hobby, label: "Render Hobby" },
      {
        vendor: VENDORS.render,
        fact: VENDORS.render.facts.webService512,
        label: "One 0.5 CPU / 512 MB web service",
      },
      {
        vendor: VENDORS.render,
        fact: VENDORS.render.facts.postgres256,
        label: "One 0.1 CPU / 256 MB Postgres",
      },
    ],
  },
} as const satisfies Record<string, Scenario>;
