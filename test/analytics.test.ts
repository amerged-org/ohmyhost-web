import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { expect, it } from "vitest";

function browser(host = "ohmyho.st", initialCookie = "") {
  const nodes = new Map<string, Element>();
  const cookies = new Map(
    initialCookie ? [["omh_analytics", initialCookie]] : [],
  );
  const listeners = new Map<string, (() => void)[]>();
  const scripts: Element[] = [];
  class Element {
    id = "";
    hidden = false;
    textContent = "";
    innerHTML = "";
    src = "";
    callbacks = new Map<string, () => void>();
    appendChild(node: Element) {
      if (node.id) nodes.set(node.id, node);
      if (node.src) scripts.push(node);
      return node;
    }
    setAttribute() {}
    addEventListener(name: string, fn: () => void) {
      this.callbacks.set(name, fn);
    }
    focus() {}
    remove() {}
  }
  const document = {
    readyState: "complete",
    title: "ohmyho.st",
    referrer: "https://example.com/?email=private",
    head: new Element(),
    body: new Element(),
    createElement: () => new Element(),
    getElementById: (id: string) => nodes.get(id),
    addEventListener: (name: string, fn: () => void) =>
      listeners.set(name, [...(listeners.get(name) ?? []), fn]),
    get cookie() {
      return [...cookies].map(([key, val]) => `${key}=${val}`).join("; ");
    },
    set cookie(value: string) {
      const [pair = ""] = value.split(";");
      const [key = "", val = ""] = pair.split("=");
      if (value.includes("Max-Age=0")) cookies.delete(key);
      else cookies.set(key, val);
    },
  };
  let reloads = 0;
  const location = {
    hostname: host,
    pathname: "/",
    origin: `https://${host}`,
    href: `https://${host}/?token=private`,
    reload: () => {
      reloads++;
    },
  };
  const history = {
    pushState: (_state: unknown, _unused: string, path: string) => {
      location.pathname = path;
    },
    replaceState: (_state: unknown, _unused: string, path: string) => {
      location.pathname = path;
    },
  };
  const timers: (() => void)[] = [];
  const context = {
    document,
    location,
    history,
    URL,
    Date,
    dataLayer: [] as unknown[][],
    addEventListener: document.addEventListener,
    setTimeout: (fn: () => void) => {
      timers.push(fn);
    },
    setInterval: () => 0,
  };
  const run = () =>
    runInNewContext(
      readFileSync(new URL("../site/analytics.js", import.meta.url), "utf8"),
      context,
    );
  const click = (id: string) => {
    const node = nodes.get(id);
    expect(node, id).toBeDefined();
    node?.callbacks.get("click")?.();
  };
  const flush = () => {
    while (timers.length) timers.shift()?.();
  };
  return {
    run,
    context,
    nodes,
    cookies,
    scripts,
    click,
    flush,
    location,
    history,
    reloads: () => reloads,
  };
}

it("loads no Google code until explicit consent and stops after withdrawal", () => {
  const b = browser();
  b.run();
  expect(b.scripts).toHaveLength(0);
  b.click("omh-analytics-reject");
  expect(b.scripts).toHaveLength(0);
  expect(b.cookies.get("omh_analytics")).toBe("v1.denied");
  b.click("omh-analytics-settings");
  b.click("omh-analytics-accept");
  expect(b.scripts).toHaveLength(1);
  expect(b.scripts[0]?.src).toContain("G-C1PWJM238R");
  const events = () => b.context.dataLayer.filter((row) => row[0] === "event");
  expect(events()).toHaveLength(1);
  expect(JSON.stringify(b.context.dataLayer)).not.toContain("private");
  b.cookies.set("_ga", "old");
  b.click("omh-analytics-settings");
  b.click("omh-analytics-reject");
  expect(b.cookies.has("_ga")).toBe(false);
  expect(b.reloads()).toBe(1);
  b.history.pushState(null, "", "/pricing");
  b.flush();
  expect(events()).toHaveLength(1);
});

it("uses shared consent on Docs and counts each route once including browser back", () => {
  const b = browser("docs.ohmyho.st", "v1.granted");
  b.run();
  b.run();
  const views = () =>
    b.context.dataLayer.filter(
      (row) => row[0] === "event" && row[1] === "page_view",
    );
  expect(b.scripts).toHaveLength(1);
  expect(views()).toHaveLength(1);
  b.history.pushState(null, "", "/quickstart");
  b.history.replaceState(null, "", "/quickstart");
  b.flush();
  expect(views()).toHaveLength(2);
  b.history.pushState(null, "", "/");
  b.flush();
  expect(views()).toHaveLength(3);
  b.cookies.set("omh_analytics", "v1.denied");
  b.history.pushState(null, "", "/tokens");
  b.flush();
  expect(views()).toHaveLength(3);
});

it("never initializes on app, Dev, previews or with a legacy notice preference", () => {
  for (const host of [
    "app.ohmyho.st",
    "dev.app.ohmyho.st",
    "preview.example.com",
  ]) {
    const b = browser(host, "v1.granted");
    b.run();
    expect(b.scripts).toHaveLength(0);
    expect(b.nodes.size).toBe(0);
  }
  const b = browser("ohmyho.st", "invalid");
  b.run();
  expect(b.scripts).toHaveLength(0);
});
