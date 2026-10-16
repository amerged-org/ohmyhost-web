import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { expect, it } from "vitest";
import { customerDocument } from "../src/customer-entry.js";
import worker from "../src/worker-main.js";

const controllerUrl = new URL("../site/affiliate-flag.js", import.meta.url);

function browser(script: string, mounted = true) {
  const events = new Map<string, (event: unknown) => void>();
  const attributes = new Map<string, string>();
  let focused = false;
  const summary = {
    setAttribute: (name: string, value: string) => attributes.set(name, value),
    focus: () => {
      focused = true;
    },
  };
  const details = {
    open: false,
    addEventListener: (name: string, callback: (event: unknown) => void) =>
      events.set(name, callback),
  };
  const host = {
    shadowRoot: {
      querySelector: (selector: string) =>
        selector === "details" ? details : summary,
    },
  };
  const document = {
    querySelector: () => (mounted ? host : null),
    addEventListener: (name: string, callback: (event: unknown) => void) =>
      events.set(name, callback),
  };
  runInNewContext(script, { document });
  return { events, attributes, details, host, focused: () => focused };
}

it("offers a native toggle and the affiliate guide on homepage and editorial pages", async () => {
  const home = await readFile(
    new URL("../public/pages/home.html", import.meta.url),
    "utf8",
  );
  for (const html of [home, customerDocument("/pricing")?.text ?? ""]) {
    const flag =
      html.match(/<ohmyhost-flag>[\s\S]*?<\/ohmyhost-flag>/u)?.[0] ?? "";
    expect(flag).toContain("<details>");
    expect(flag).toContain("<summary");
    expect(flag).toContain('href="https://docs.ohmyho.st/affiliate"');
    expect(flag).toContain("1000 credits for free - affiliate");
    expect(flag).toContain("&gt;");
    expect(flag).not.toContain('href="/pricing"');
    expect(flag).not.toContain("25% more");
    expect(flag).not.toContain("a:hover span");
    expect(flag).not.toContain("<details open");
  }
  const controller = await readFile(controllerUrl, "utf8");
  const response = await worker.fetch(new Request("https://ohmyho.st/"), {
    ASSETS: {
      fetch: async () =>
        new Response(home, { headers: { "content-type": "text/html" } }),
    },
  });
  const digest = createHash("sha256").update(controller).digest("base64");
  expect(response.headers.get("content-security-policy")).toContain(
    `'sha256-${digest}'`,
  );
});

it("keeps an opened flag stable until an outside pointer or explicit close", async () => {
  const script = await readFile(controllerUrl, "utf8");
  const b = browser(script);
  expect(b.attributes.get("aria-label")).toBe("Open affiliate information");
  b.details.open = true;
  b.events.get("toggle")?.({});
  expect(b.attributes.get("aria-label")).toBe("Close affiliate information");
  expect(b.events.has("mouseout")).toBe(false);
  expect(b.events.has("mouseleave")).toBe(false);
  b.events.get("pointerdown")?.({ composedPath: () => [{}, b.host] });
  expect(b.details.open).toBe(true);
  b.events.get("pointerdown")?.({ composedPath: () => [{}] });
  expect(b.details.open).toBe(false);
  b.events.get("toggle")?.({});
  expect(b.attributes.get("aria-label")).toBe("Open affiliate information");
  b.details.open = true;
  b.events.get("toggle")?.({});
  b.details.open = false;
  b.events.get("toggle")?.({});
  expect(b.attributes.get("aria-label")).toBe("Open affiliate information");
});

it("closes on Escape with focus restored and tolerates pages without a mounted flag", async () => {
  const script = await readFile(controllerUrl, "utf8");
  expect(() => browser(script, false)).not.toThrow();
  const b = browser(script);
  b.events.get("keydown")?.({ key: "Escape" });
  expect(b.focused()).toBe(false);
  b.details.open = true;
  b.events.get("keydown")?.({ key: "Enter" });
  expect(b.details.open).toBe(true);
  b.events.get("keydown")?.({ key: "Escape" });
  expect(b.details.open).toBe(false);
  expect(b.focused()).toBe(true);
});
