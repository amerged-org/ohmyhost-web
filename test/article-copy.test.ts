import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

import { expect, it } from "vitest";

import { customerDocument, DOCUMENTATION } from "../src/customer-entry.js";
import { PAGE_META } from "../src/page-meta.js";

const script = readFileSync(
  new URL("../site/site-requests.js", import.meta.url),
  "utf8",
);

function payload(html: string): string | undefined {
  return html.match(
    /<script type="application\/json" data-article-markdown>([\s\S]*?)<\/script>/u,
  )?.[1];
}

it("offers the complete Markdown mirror only on articles, before their body", () => {
  for (const [path, meta] of Object.entries(PAGE_META)) {
    const html = customerDocument(path)?.text ?? "";
    if (meta.kind !== "article") {
      expect(payload(html), path).toBeUndefined();
      expect(html, path).not.toMatch(/<aside\b[^>]*\bdata-article-tools/u);
      continue;
    }
    expect(JSON.parse(payload(html) ?? "null"), path).toBe(
      customerDocument(`${path}.md`)?.text,
    );
    expect(html, path).toContain(
      "Tell your Agent to move to ohmyho.st or locally",
    );
    expect(html, path).toContain(`href="${path}.md">Open .md</a>`);
    expect(html.indexOf("data-article-tools"), path).toBeLessThan(
      html.indexOf("<h1>"),
    );
  }
});

it("preserves injected draft Markdown exactly and prevents a payload script from closing early", () => {
  const path = "/blog/article-copy-draft";
  const markdown =
    '# Draft\n\nMy exact wording — café & <example>.\n\n```text\nKeep </script><script>alert("test")</script> as text.\nUnicode: 😀\n```\n\n<svg><path d="M0 0"/></svg>\n';
  DOCUMENTATION[path] = markdown;
  PAGE_META[path] = {
    kind: "article",
    title: "Draft article for checking complete Markdown copy",
    description:
      "A temporary draft article to verify the exact Markdown copy payload, including Unicode, fenced prompts, HTML characters and SVG handling.",
    modified: "2026-10-21",
    published: "2026-10-21",
    parent: "/blog",
  };
  try {
    const html = customerDocument(path)?.text ?? "";
    const embedded = payload(html);
    expect(embedded).toBeDefined();
    expect(embedded).not.toContain("<");
    expect(JSON.parse(embedded ?? "null")).toBe(
      customerDocument(`${path}.md`)?.text,
    );
    expect(JSON.parse(embedded ?? "null")).toContain(
      'Keep </script><script>alert("test")</script> as text.',
    );
    expect(JSON.parse(embedded ?? "null")).not.toContain("<svg");
  } finally {
    Reflect.deleteProperty(DOCUMENTATION, path);
    Reflect.deleteProperty(PAGE_META, path);
  }
});

function browser(
  value: string,
  writeText: (value: string) => Promise<void>,
  fallback = false,
) {
  let click: ((event: unknown) => Promise<void>) | undefined;
  const label = { textContent: "Copy .md for agent" };
  const feedback = { textContent: "" };
  const timers: Array<() => void> = [];
  const classes = new Set<string>();
  const fallbackCopies: string[] = [];
  let removed = false;
  let focused = false;
  const field = {
    value: "",
    readOnly: false,
    style: { cssText: "" },
    setAttribute() {},
    select() {},
    remove() {
      removed = true;
    },
  };
  const toolbar = {
    classList: {
      add(name: string) {
        classes.add(name);
      },
      remove(name: string) {
        classes.delete(name);
      },
    },
    querySelector: (selector: string) =>
      selector === "[data-article-copy-status]"
        ? feedback
        : { textContent: JSON.stringify(value) },
  };
  const button = {
    attributes: new Map<string, string>(),
    dataset: { copyArticle: "" },
    closest: () => toolbar,
    querySelector: () => label,
    setAttribute(name: string, value: string) {
      this.attributes.set(name, value);
    },
    removeAttribute(name: string) {
      this.attributes.delete(name);
    },
  };
  runInNewContext(script, {
    document: {
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,
      addEventListener: (
        _name: string,
        handler: (event: unknown) => Promise<void>,
      ) => {
        click = handler;
      },
      activeElement: {
        focus() {
          focused = true;
        },
      },
      createElement: () => field,
      body: { append() {} },
      execCommand: () => {
        fallbackCopies.push(field.value);
        return fallback;
      },
    },
    navigator: { clipboard: { writeText } },
    setTimeout: (callback: () => void) => {
      timers.push(callback);
    },
    fetch: () => {
      throw Error("Copy must not fetch a published or stale article");
    },
  });
  return {
    label,
    feedback,
    button,
    timers,
    classes,
    fallbackCopies,
    get removed() {
      return removed;
    },
    get focused() {
      return focused;
    },
    async click() {
      if (!click) throw Error("Missing copy handler");
      await click({
        target: { closest: () => button },
        preventDefault() {},
        stopImmediatePropagation() {},
      });
    },
  };
}

it("copies exact article text once per pending action and ignores older feedback timers", async () => {
  const value = "# My article\n\n```text\nCopy this exact prompt.\n```\n";
  const copies: string[] = [];
  const completions: Array<() => void> = [];
  const page = browser(value, (text) => {
    copies.push(text);
    return new Promise<void>((resolve) => {
      completions.push(resolve);
    });
  });
  const first = page.click();
  expect(page.button.attributes.get("aria-disabled")).toBe("true");
  expect(page.label.textContent).toBe("Copying…");
  await page.click();
  expect(copies).toEqual([value]);
  completions[0]?.();
  await first;
  expect(page.feedback.textContent).toContain("Article Markdown copied.");
  expect(page.button.attributes.has("aria-disabled")).toBe(false);
  const second = page.click();
  page.timers[0]?.();
  expect(page.label.textContent).toBe("Copying…");
  completions[1]?.();
  await second;
  expect(copies).toEqual([value, value]);
  page.timers[1]?.();
  expect(page.label.textContent).toBe("Copy .md for agent");
});

it.each([true, false])(
  "uses clipboard fallback and reports its actual result (%s)",
  async (copied) => {
    const value = "# Article\n\nMy wording & prompt 😀\n";
    const page = browser(
      value,
      async () => {
        throw Error("Permission denied");
      },
      copied,
    );
    await page.click();
    expect(page.fallbackCopies).toEqual([value]);
    expect(page.removed).toBe(true);
    expect(page.focused).toBe(true);
    expect(page.button.attributes.has("aria-disabled")).toBe(false);
    expect(page.feedback.textContent).toContain(
      copied ? "Article Markdown copied." : "Copy failed. Open .md",
    );
    expect(page.classes.has("copy-error")).toBe(!copied);
  },
);
