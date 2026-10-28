// Generated from PRICING.md by pages:prepare.
export const CREDIT_PRICING_TABLE =
  "| Service meter | Measured quantity | Credits |\n| --- | --- | ---: |\n| `pgcf.memory.active` | 256 MiB for one awake hour | 10 |\n| `build.sandbox.standard-3` | 60 build seconds | 1.204938 |\n| `wfp.requests` | 1,000,000 requests | 98.571429 |\n| `wfp.cpu` | 1,000,000 CPU-ms | 6.571429 |\n| `r2.storage.standard` | 1 GB for 30 days (daily peak) | 4.928571 |\n| `r2.class_a` | 1,000,000 operations | 1478.571429 |\n| `r2.class_b` | 1,000,000 operations | 118.285714 |\n| `mail.sent` | 1 sent recipient | 0.18 |\n| `mail.received` | 1 received message | 0.18 |\n| `wfp.script` | 1 deployed script for a 744-hour month | 6.571429 |\n| `domain.custom_hostname` | 1 paid custom hostname for a 744-hour month | 32.857143 |";
export const CREDIT_RATES = {
  "pgcf.memory.active": { quantity: 256, unit: "MiB for one awake hour", credits: "10" },
  "build.sandbox.standard-3": { quantity: 60, unit: "build seconds", credits: "1.204938" },
  "wfp.requests": { quantity: 1000000, unit: "requests", credits: "98.571429" },
  "wfp.cpu": { quantity: 1000000, unit: "CPU-ms", credits: "6.571429" },
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
export const DATABASE_SIZES = [
  {
    memoryMiB: 256,
    storageMiB: 500,
    cpuMillicores: 250,
    maxConnections: 20,
    sizeClassId: "r256-s500m",
    creditsPerAwakeHour: 10,
    paidRequired: false,
  },
  {
    memoryMiB: 512,
    storageMiB: 1024,
    cpuMillicores: 250,
    maxConnections: 40,
    sizeClassId: "r512-s1g",
    creditsPerAwakeHour: 20,
    paidRequired: true,
  },
  {
    memoryMiB: 1024,
    storageMiB: 2048,
    cpuMillicores: 500,
    maxConnections: 80,
    sizeClassId: "r1024-s2g",
    creditsPerAwakeHour: 40,
    paidRequired: true,
  },
  {
    memoryMiB: 2048,
    storageMiB: 4096,
    cpuMillicores: 1000,
    maxConnections: 160,
    sizeClassId: "r2048-s4g",
    creditsPerAwakeHour: 80,
    paidRequired: true,
  },
  {
    memoryMiB: 4096,
    storageMiB: 8192,
    cpuMillicores: 2000,
    maxConnections: 200,
    sizeClassId: "r4096-s8g",
    creditsPerAwakeHour: 160,
    paidRequired: true,
  },
] as const;
