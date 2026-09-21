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
    checked = false;
    open = false;
    parentElement: Element | null = null;
    attributes = new Map<string, string>();
    callbacks = new Map<string, () => void>();
    appendChild(node: Element) {
      node.parentElement = this;
      if (node.id) nodes.set(node.id, node);
      if (node.src) scripts.push(node);
      return node;
    }
    setAttribute(name: string, value: string) {
      this.attributes.set(name, value);
    }
    showModal() {
      this.open = true;
    }
    close() {
      this.open = false;
    }
    addEventListener(name: string, fn: () => void) {
      this.callbacks.set(name, fn);
    }
    focus() {}
    remove() {}
  }
  let footer = new Element();
  const themeControl = new Element();
  themeControl.parentElement = footer;
  const document = {
    readyState: "complete",
    title: "ohmyho.st",
    referrer: "https://example.com/?email=private",
    head: new Element(),
    body: new Element(),
    createElement: () => new Element(),
    querySelector: (selector: string) => {
      if (host === "docs.ohmyho.st")
        return selector.includes("Switch to system theme")
          ? themeControl
          : null;
      return selector === "footer .fbot" ? footer : null;
    },
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
  let tick = () => {};
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
    setInterval: (fn: () => void) => {
      tick = fn;
      return 0;
    },
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
    footer: () => footer,
    replaceFooter: () => {
      footer = new Element();
      themeControl.parentElement = footer;
      tick();
    },
  };
}

it("loads no Google code until explicit consent and stops after withdrawal", () => {
  const b = browser();
  b.run();
  expect(b.scripts).toHaveLength(0);
  expect(b.nodes.get("omh-analytics-accept")?.textContent).toBe("Accept");
  expect(b.nodes.get("omh-analytics-edit")?.textContent).toBe("Edit");
  expect(b.nodes.get("omh-analytics-settings")?.parentElement).toBe(b.footer());
  expect(b.nodes.get("omh-analytics-settings")?.textContent).toBe("");
  b.click("omh-analytics-edit");
  expect(b.nodes.get("omh-cookie-dialog")?.open).toBe(true);
  expect(b.nodes.get("omh-analytics-toggle")?.checked).toBe(false);
  b.click("omh-analytics-save");
  expect(b.scripts).toHaveLength(0);
  expect(b.cookies.get("omh_analytics")).toBe("v1.denied");
  b.click("omh-analytics-settings");
  const analyticsToggle = b.nodes.get("omh-analytics-toggle");
  if (!analyticsToggle) throw new Error("Analytics toggle missing");
  analyticsToggle.checked = true;
  b.click("omh-analytics-save");
  expect(b.scripts).toHaveLength(1);
  expect(b.scripts[0]?.src).toContain("G-C1PWJM238R");
  const events = () => b.context.dataLayer.filter((row) => row[0] === "event");
  expect(events()).toHaveLength(1);
  expect(JSON.stringify(b.context.dataLayer)).not.toContain("private");
  b.cookies.set("_ga", "old");
  b.click("omh-analytics-settings");
  b.click("omh-analytics-off");
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

it("dismisses settings without consent and keeps the icon in a replaced Docs footer", () => {
  const b = browser("docs.ohmyho.st");
  b.run();
  b.click("omh-analytics-edit");
  b.click("omh-cookie-close");
  expect(b.cookies.get("omh_analytics")).toBe("v1.denied");
  expect(b.nodes.get("cookie-notice")?.hidden).toBe(true);
  expect(b.nodes.get("omh-cookie-dialog")?.open).toBe(false);
  expect(b.scripts).toHaveLength(0);
  b.replaceFooter();
  expect(b.nodes.get("omh-analytics-settings")?.parentElement).toBe(b.footer());
  b.click("omh-analytics-settings");
  expect(b.nodes.get("omh-cookie-dialog")?.open).toBe(true);
  b.click("omh-cookie-close");
  b.click("omh-analytics-accept");
  expect(b.scripts).toHaveLength(1);
});
