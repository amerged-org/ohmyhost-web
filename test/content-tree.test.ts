import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { expect, it } from "vitest";

import { pageFolders, readPage, resolveTokens } from "../src/content/tree.js";
import { DOCUMENTATION } from "../src/customer-entry.js";
import { CONTENT_PAGE_LIST } from "../src/pages/index.js";

const contentRoot = new URL("../content/", import.meta.url).pathname;

it("keeps the content tree, its page records and the served pages in step", async () => {
  const folders = pageFolders(contentRoot);
  expect(folders.length).toBeGreaterThanOrEqual(30);
  const published = [];
  for (const { url, directory } of folders) {
    const page = readPage(directory, url);
    // The folder path is the URL: nothing stores it, so the two cannot disagree.
    expect(page.path).toBe(url);
    expect(url.startsWith("/")).toBe(true);
    expect(url).not.toMatch(/[A-Z_\s]/u);
    if (page.status === "published") published.push(page);
    if (page.social?.image)
      expect(
        existsSync(new URL(`../public${page.social.image}`, import.meta.url)),
        page.social.image,
      ).toBe(true);
  }
  expect(published.map((page) => page.path).sort()).toEqual(
    CONTENT_PAGE_LIST.map((page) => page.path).sort(),
  );
  for (const page of published)
    expect(DOCUMENTATION[page.path], `${page.path} is served`).toBeDefined();
  // Every page the site serves as an editorial page comes from the tree; nothing is left in code.
  const launch = await readFile(
    new URL("../src/launch-pages.ts", import.meta.url),
    "utf8",
  );
  const legal = await readFile(
    new URL("../src/legal-documents.ts", import.meta.url),
    "utf8",
  );
  expect(launch).not.toMatch(/": `#/u);
  expect(legal).not.toMatch(/": `#/u);
});

it("resolves only known tokens and fails loudly on anything else", () => {
  const seen = new Set<string>();
  const render = (kind: string, args: string[]) => {
    seen.add(kind);
    return `<${kind}:${args.join(",")}>`;
  };
  expect(resolveTokens("a {{ usd plan.paidUsd }} b", "/x", render)).toBe(
    "a <usd:plan.paidUsd> b",
  );
  expect(resolveTokens("{{ credits unit.x dp=0 }}", "/x", render)).toBe(
    "<credits:unit.x>",
  );
  // A meter name carries braces and spaces; the token must survive both.
  expect(
    resolveTokens(
      "{{ rate ses.{region}.recipients (Essentials) }}",
      "/x",
      render,
    ),
  ).toBe("<rate:ses.{region}.recipients,(Essentials)>");
  expect(seen.has("usd") && seen.has("credits") && seen.has("rate")).toBe(true);
  expect(() =>
    resolveTokens("{{ nonsense x }}", "/page", () => {
      throw new Error("unknown token kind: nonsense");
    }),
  ).toThrow(/content\/page: \{\{ nonsense x \}\} — unknown token kind/u);
  // No page may ship an unresolved token.
  for (const page of CONTENT_PAGE_LIST)
    expect(page.markdown, page.path).not.toMatch(/\{\{\s*\w+\s/u);
});

it("refuses page metadata that would ship a broken page", async () => {
  const root = await mkdtemp(join(tmpdir(), "content-tree-"));
  const write = async (meta: Record<string, unknown>) => {
    await writeFile(join(root, "page.json"), JSON.stringify(meta), "utf8");
    await writeFile(join(root, "content.md"), "# Title\n", "utf8");
    return () => readPage(root, "/example");
  };
  const good = {
    title: "A page title",
    description: "d".repeat(140),
    kind: "page",
    status: "published",
    modified: "2026-09-20",
  };

  expect((await write(good))()).toMatchObject({
    path: "/example",
    kind: "page",
  });
  for (const [reason, meta] of [
    ["title is required", { ...good, title: 7 }],
    ["kind must be one of", { ...good, kind: "landing" }],
    ["status must be published or draft", { ...good, status: "live" }],
    ["title is 61 characters, at most 60", { ...good, title: "t".repeat(61) }],
    [
      "description is 60 characters, needs 120 to 160",
      { ...good, description: "d".repeat(60) },
    ],
    ["an article needs author and published", { ...good, kind: "article" }],
    [
      "author and published belong to articles only",
      { ...good, author: "Someone" },
    ],
  ] as Array<[string, Record<string, unknown>]>)
    expect(await write(meta), reason).toThrow(reason);

  await rm(root, { recursive: true, force: true });
});
