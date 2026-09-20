import { existsSync } from "node:fs";

import { listOhmyhostSkillResources } from "@ohmyhost/agent-skills";
import { expect, it } from "vitest";

import {
  CTA_PROMPT,
  checkedLine,
  perSecondMonthly,
  priceLine,
  priceWorkload,
  scenarioUsd,
} from "../src/content/format.js";
import { DATABASE_PROFILES, PLANS, SCENARIOS, VENDORS, WORKLOADS } from "../src/content/sources.js";
import { DOCUMENTATION, customerDocument } from "../src/customer-entry.js";
import { CREDIT_RATES } from "../src/generated-pricing.js";
import { PAGE_META } from "../src/page-meta.js";
import { CONTENT_PAGE_LIST } from "../src/pages/index.js";

const root = new URL("../../../", import.meta.url);
const MICROCREDITS = 1_000_000;
/** Bump on the monthly price re-check; every vendor's checkedOn must be within 45 days of it. */
const CONTENT_REVIEW_DATE = "2026-09-20";
const DOCS_SLUGS = new Set([
  "",
  "index",
  "quickstart",
  "cli",
  "agents/mcp",
  "mcp-tools",
  "skills",
  "login-tokens",
  "sdk",
  "github",
  "frameworks/nextjs",
  "frameworks/vite",
  "frameworks/tanstack",
  "functions",
  "application-auth",
  "secrets",
  "environments",
  "migrations",
  "database",
  "files",
  "domains",
  "email",
  "status",
  "troubleshooting",
  "usage",
  "pricing",
  "budgets",
  "billing",
  "backups",
  "project-context",
  "feedback",
  "limits",
  "changelog",
  "api",
  "legal/privacy",
  "legal/cookies",
  "legal/dpa",
  "legal/dpa/toms",
  "legal/dpa/subprocessors",
  "legal/dpa/transfers",
]);
const FORBIDDEN = [
  /\bflat[- ]rate\b/iu,
  /\bagent hosting\b/iu,
  /\bfree hosting\b/iu,
  /\b(?:domain|email|database|postgres|backups?) included\b/iu,
  /\bunlimited\b(?! (?:workspace )?seats)/iu,
  /\bone bill for everything\b/iu,
  /\bnightly\b/iu,
  /\bAuth0\b/u,
  /\bAI (?:models|credits)\b/u,
  /\bISO 27001\b/u,
  /\bSOC 2\b/u,
  /\bcertified\b/iu,
  /smertens@/u,
  /@amerged\.com/u,
  /\boh my host\b/iu,
  /\boh,myho\.st\b/iu,
  /\bohmyoh\.st\b/iu,
  /\b(?:Vercel|Resend) charges per project\b/iu,
  /\bseamlessly\b/iu,
  /\bempower/iu,
  /\bbest-in-class\b/iu,
];
const FLOORS: Array<[RegExp, number]> = [
  [/^\/vs\//u, 1100],
  [/^\/from\/(?:lovable|bolt)$/u, 900],
  [/^\/for\//u, 700],
  [/^\/pricing\/breakdown$/u, 600],
  [/^\/blog\/.+/u, 1200],
  [/^\/(?:about|philosophy)$/u, 500],
];
const CONTENT_PATHS = new Set(CONTENT_PAGE_LIST.map((page) => page.path));
/** Machine-readable endpoints the worker serves outside DOCUMENTATION. */
const MACHINE_PATHS = new Set([
  "/llms.txt",
  "/AGENTS.md",
  "/auth.md",
  "/mcp.json",
  "/mcp-tools.json",
  "/client-release.json",
  "/api/openapi.json",
  "/api/openapi.yaml",
  "/.well-known/agent-skills/index.json",
  "/brand",
]);
/** A dated announcement is not a search-targeted deep dive, so the post floor does not apply. */
const ANNOUNCEMENTS = new Set(["/blog/introducing-ohmyho-st"]);
/** Legal documents use their own vocabulary and are outside the editorial contract. */
const LEGAL = /^\/(?:terms|privacy|cookies|dpa|contact)/u;

function knownNumbers(): number[] {
  const known = new Set<number>([...Object.values(PLANS), 1, 100, 1000]);
  for (const vendor of Object.values(VENDORS))
    for (const fact of Object.values(vendor.facts)) {
      known.add(fact.usd);
      if (fact.unit.includes("second")) known.add(perSecondMonthly(fact.usd));
      for (const [, digits] of `${fact.includes ?? ""} ${fact.unit}`.matchAll(
        /\$?([\d,]+(?:\.\d+)?)/gu,
      ))
        known.add(Number((digits ?? "0").replaceAll(",", "")));
    }
  for (const row of Object.values(CREDIT_RATES)) {
    known.add(Number(row.credits));
    known.add(row.quantity);
  }
  const addCredits = (micros: number) => {
    known.add(micros / MICROCREDITS);
    known.add(Math.round(micros / MICROCREDITS));
    known.add(Number((micros / MICROCREDITS).toFixed(2)));
    known.add(Number((micros / MICROCREDITS / 100).toFixed(2)));
  };
  for (const workload of Object.values(WORKLOADS)) {
    const priced = priceWorkload(workload);
    addCredits(priced.microcredits);
    for (const line of priced.lines) {
      addCredits(line.microcredits);
      known.add(line.quantity);
      for (const [, digits] of line.label.matchAll(/([\d,]+(?:\.\d+)?)/gu))
        known.add(Number((digits ?? "0").replaceAll(",", "")));
    }
  }
  for (const scenario of Object.values(SCENARIOS)) known.add(scenarioUsd(scenario));
  for (const profile of Object.values(DATABASE_PROFILES)) {
    known.add(profile.cu);
    addCredits(priceLine(profile.meter, profile.cu));
  }
  for (const meter of Object.keys(CREDIT_RATES) as Array<keyof typeof CREDIT_RATES>)
    for (const quantity of [
      1, 2, 4, 10, 20, 100, 120, 600, 840, 1000, 1200, 2000, 3000, 10_000, 20_000, 35_000, 50_000,
      100_000, 1_000_000,
    ])
      addCredits(priceLine(meter, quantity));
  return [...known];
}

const NUMBER_PATTERN =
  /\$\s?(\d[\d,]*(?:\.\d+)?)|(\d[\d,]*(?:\.\d+)?)\s*(?:credits?\b|cr\b|\/mo\b|per (?:month|seat|GB|project|1,?000|1M)\b)/giu;

function words(markdown: string): number {
  return markdown
    .replaceAll(
      /<figure[\s\S]*?<\/figure>|<div class="vs">[\s\S]*?<\/div><\/div><\/div>/gu,
      " figure ",
    )
    .split(/\s+/u)
    .filter(Boolean).length;
}

it("keeps every editorial page inside the words, numbers and sources contract", () => {
  const known = knownNumbers();
  const matches = (value: number) =>
    known.some(
      (k) =>
        Math.abs(k - value) < 0.0051 || value === Math.round(k) || value === Number(k.toFixed(2)),
    );
  const skills = new Set(
    listOhmyhostSkillResources().map((skill) => `/skills/${skill.skillName}/${skill.relativePath}`),
  );
  for (const [path, markdown] of Object.entries(DOCUMENTATION)) {
    if (path.endsWith(".md") || path === "/login") continue;
    const html = customerDocument(path)?.text ?? "";
    if (LEGAL.test(path)) continue;
    for (const pattern of FORBIDDEN) {
      expect(markdown, `${path} forbidden ${pattern}`).not.toMatch(pattern);
      expect(html, `${path} forbidden ${pattern} (html)`).not.toMatch(pattern);
    }
    expect(markdown, `${path} exclamation`).not.toMatch(/!(?![[\]])/u);
    if (!CONTENT_PATHS.has(path)) continue;
    const meta = PAGE_META[path];
    expect(meta, path).toBeDefined();
    // Numbers: every price or credit figure on the page comes from the data module or the rate card.
    const body = markdown.replaceAll(
      /<figure[\s\S]*?<\/figure>|<div class="vs">[\s\S]*?<\/div><\/div><\/div>/gu,
      " ",
    );
    for (const match of body.matchAll(NUMBER_PATTERN)) {
      const value = Number((match[1] ?? match[2] ?? "0").replaceAll(",", ""));
      expect(matches(value), `${path}: ${match[0]} is not in the data module`).toBe(true);
    }
    // Structure per page type.
    expect(markdown.match(/^# /gmu), `${path} H1`).toHaveLength(1);
    const answer =
      markdown
        .split(/\n\s*\n/u)
        .find(
          (block, index) =>
            index > 0 &&
            !block.startsWith("#") &&
            !block.startsWith("By ") &&
            !block.startsWith("<") &&
            !block.startsWith("!"),
        ) ?? "";
    const answerWords = answer.split(/\s+/u).filter(Boolean).length;
    expect(answerWords, `${path} answer block: ${answerWords} words`).toBeGreaterThanOrEqual(35);
    expect(answerWords, `${path} answer block: ${answerWords} words`).toBeLessThanOrEqual(75);
    if (path.startsWith("/vs/")) {
      const vendorName = Object.values(VENDORS).find((vendor) =>
        path.endsWith(vendor.name.toLowerCase().replace(".io", "")),
      )?.name;
      // Either phrasing is fine; the section must name the competitor and say where it wins.
      const honest =
        markdown
          .split(/^## /mu)
          .find(
            (section) =>
              /^(?:When .* is the better choice|Where .* wins)/u.test(section) &&
              section.includes(vendorName ?? ""),
          ) ?? "";
      expect(honest.split(/\s+/u).length, `${path} honest section`).toBeGreaterThanOrEqual(60);
    }
    if (/^\/(?:for|from)\//u.test(path)) {
      expect(markdown.match(/^## How to /gmu), `${path} How to`).toHaveLength(1);
      const steps = (markdown.split(/^## How to /mu)[1] ?? "").split(/^## /mu)[0] ?? "";
      expect(steps.match(/^\d+\. /gmu)?.length ?? 0, `${path} steps`).toBeGreaterThanOrEqual(4);
      expect(markdown.match(/^```text\n[^\n]*\n```$/gmu), `${path} prompt block`).toHaveLength(1);
    }
    expect(
      (markdown.match(/```text\n([^\n]*)\n```/gu) ?? []).length,
      `${path} prompt blocks`,
    ).toBeLessThanOrEqual(1);
    for (const [, prompt] of markdown.matchAll(/```text\n([^\n]*)\n```/gu))
      expect(prompt).toBe(CTA_PROMPT);
    if (/^## FAQ$/mu.test(markdown)) {
      const faq = markdown.split(/^## FAQ$/mu)[1]?.split(/^## /mu)[0] ?? "";
      const questions = faq.match(/^### .+\?$/gmu) ?? [];
      expect(questions.length, `${path} FAQ count`).toBeGreaterThanOrEqual(3);
      expect(questions.length, `${path} FAQ count`).toBeLessThanOrEqual(6);
    }
    if (meta?.kind === "article")
      expect(markdown, `${path} byline`).toMatch(
        /^By Sebastian Mertens · (?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}$/mu,
      );
    const floor = ANNOUNCEMENTS.has(path)
      ? 150
      : (FLOORS.find(([pattern]) => pattern.test(path))?.[1] ?? 0);
    expect(words(markdown), `${path} words`).toBeGreaterThanOrEqual(floor);
    // A section carries a vendor's date line when it quotes that vendor's price — through a
    // VENDORS.<key>.facts expression or a SCENARIO that sums them — not when it merely names it.
    for (const section of markdown.split(/^## /mu).slice(1)) {
      if (section.startsWith("Sources") || section.startsWith("FAQ")) continue;
      const priced = new Set<keyof typeof VENDORS>();
      for (const key of Object.keys(VENDORS) as Array<keyof typeof VENDORS>) {
        if (section.includes(`VENDORS.${key}.facts`)) priced.add(key);
        for (const [name, scenario] of Object.entries(SCENARIOS))
          if (
            section.includes(`SCENARIOS.${name}`) &&
            scenario.parts.some((part) => part.vendor.name === VENDORS[key].name)
          )
            priced.add(key);
      }
      for (const key of priced)
        expect(
          section,
          `${path} section "${section.split("\n")[0]}" quotes ${VENDORS[key].name} prices without its date line`,
        ).toContain(checkedLine(VENDORS[key]));
    }
    for (const vendor of Object.values(VENDORS))
      if (markdown.includes(`checked on ${vendor.checkedOn} — [${vendor.name} pricing]`))
        expect(markdown, `${path} sources for ${vendor.name}`).toContain(
          `- ${checkedLine(vendor)}`,
        );
    // Links.
    expect(markdown, `${path} /docs link`).not.toMatch(/\]\(\/(?:docs|api)\b/u);
    for (const [, slug] of markdown.matchAll(/https:\/\/docs\.ohmyho\.st\/([a-z0-9/-]*)/gu))
      expect(
        DOCS_SLUGS.has((slug ?? "").replace(/\.md$/u, "").replace(/\/$/u, "")),
        `${path} docs slug ${slug}`,
      ).toBe(true);
    for (const [, link] of markdown.matchAll(/\]\((\/[^)#?\s]*)/gu)) {
      const target = link ?? "";
      expect(
        target === "/" ||
          target in DOCUMENTATION ||
          skills.has(target) ||
          MACHINE_PATHS.has(target),
        `${path} links to ${target}`,
      ).toBe(true);
    }
  }
  for (const vendor of Object.values(VENDORS)) {
    expect(existsSync(new URL(vendor.evidence, root)), vendor.evidence).toBe(true);
    const age = (Date.parse(CONTENT_REVIEW_DATE) - Date.parse(vendor.checkedOn)) / 86_400_000;
    expect(age, `${vendor.name} checked ${vendor.checkedOn}`).toBeLessThanOrEqual(45);
    expect(age).toBeGreaterThanOrEqual(0);
  }
});
