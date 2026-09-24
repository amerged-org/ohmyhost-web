// Generated from PRICING.md by pages:prepare.
export const CREDIT_PRICING_TABLE =
  "| Service meter | Measured quantity | Credits |\n| --- | --- | ---: |\n| `build.sandbox.standard-3` | 60 build seconds | 1.204938 |\n| `wfp.requests` | 1,000,000 requests | 98.571429 |\n| `wfp.cpu` | 1,000,000 CPU-ms | 6.571429 |\n| `neon.compute.scale` | 1 CU-hour | 72.942857 |\n| `neon.compute.performance` | 1 CU-hour | 91.178571 |\n| `neon.storage.root` | 1 GB-month | 115 |\n| `neon.storage.child` | 1 GB-month | 115 |\n| `neon.history` | 1 GB-month | 65.714286 |\n| `neon.snapshot` | 1 GB-month | 29.571429 |\n| `neon.transfer.public` | 1 GB | 32.857143 |\n| `neon.transfer.private` | 1 GB | 3.285714 |\n| `neon.branches` | 1 branch-month (744 h) | 492.857143 |\n| `r2.storage.standard` | 1 GB for 30 days (daily peak) | 4.928571 |\n| `r2.class_a` | 1,000,000 operations | 1478.571429 |\n| `r2.class_b` | 1,000,000 operations | 118.285714 |\n| `mail.sent` | 1 sent recipient | 0.18 |\n| `mail.received` | 1 received message | 0.18 |\n| `wfp.script` | 1 deployed script for a 744-hour month | 6.571429 |\n| `domain.custom_hostname` | 1 paid custom hostname for a 744-hour month | 32.857143 |";
export const CREDIT_RATES = {
  "build.sandbox.standard-3": { quantity: 60, unit: "build seconds", credits: "1.204938" },
  "wfp.requests": { quantity: 1000000, unit: "requests", credits: "98.571429" },
  "wfp.cpu": { quantity: 1000000, unit: "CPU-ms", credits: "6.571429" },
  "neon.compute.scale": { quantity: 1, unit: "CU-hour", credits: "72.942857" },
  "neon.compute.performance": { quantity: 1, unit: "CU-hour", credits: "91.178571" },
  "neon.storage.root": { quantity: 1, unit: "GB-month", credits: "115" },
  "neon.storage.child": { quantity: 1, unit: "GB-month", credits: "115" },
  "neon.history": { quantity: 1, unit: "GB-month", credits: "65.714286" },
  "neon.snapshot": { quantity: 1, unit: "GB-month", credits: "29.571429" },
  "neon.transfer.public": { quantity: 1, unit: "GB", credits: "32.857143" },
  "neon.transfer.private": { quantity: 1, unit: "GB", credits: "3.285714" },
  "neon.branches": { quantity: 1, unit: "branch-month (744 h)", credits: "492.857143" },
  "r2.storage.standard": { quantity: 1, unit: "GB for 30 days (daily peak)", credits: "4.928571" },
  "r2.class_a": { quantity: 1000000, unit: "operations", credits: "1478.571429" },
  "r2.class_b": { quantity: 1000000, unit: "operations", credits: "118.285714" },
  "mail.sent": { quantity: 1, unit: "sent recipient", credits: "0.18" },
  "mail.received": { quantity: 1, unit: "received message", credits: "0.18" },
  "wfp.script": { quantity: 1, unit: "deployed script for a 744-hour month", credits: "6.571429" },
  "domain.custom_hostname": {
    quantity: 1,
    unit: "paid custom hostname for a 744-hour month",
    credits: "32.857143",
  },
} as const;
