import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { expect, it } from "vitest";

it("defers initial scroll measurement and updates progress without layout writes", () => {
  const home = readFileSync(
    new URL("../public/pages/home.html", import.meta.url),
    "utf8",
  );
  const script = home.match(
    /\/\* sticky header \+ scroll progress \*\/([\s\S]*?)\/\* every Start free/u,
  )?.[1];
  expect(script).toBeDefined();
  let scrollTop = 0;
  let scrollHeight = 2000;
  const reads: string[] = [];
  const styles: Record<string, string> = {};
  const frames: Array<() => void> = [];
  const listeners = new Map<string, () => void>();
  let stuck = false;
  runInNewContext(script ?? "", {
    document: {
      createElement: () => ({ className: "", style: styles }),
      body: { appendChild() {}, scrollTop: 0 },
      documentElement: {
        get scrollTop() {
          reads.push("scrollTop");
          return scrollTop;
        },
        get scrollHeight() {
          reads.push("scrollHeight");
          return scrollHeight;
        },
        get clientHeight() {
          reads.push("clientHeight");
          return 1000;
        },
      },
      getElementById: () => ({
        classList: {
          toggle(_name: string, active: boolean) {
            stuck = active;
          },
        },
      }),
    },
    requestAnimationFrame: (frame: () => void) => frames.push(frame),
    addEventListener: (name: string, callback: () => void) =>
      listeners.set(name, callback),
  });
  expect(reads).toEqual([]);
  frames.shift()?.();
  expect(reads).toEqual([]);
  frames.shift()?.();
  expect(styles["transform"]).toBe("scaleX(0)");
  for (const [position, progress] of [
    [500, "scaleX(0.5)"],
    [1000, "scaleX(1)"],
  ] as const) {
    scrollTop = position;
    listeners.get("scroll")?.();
    frames.shift()?.();
    expect(styles["transform"]).toBe(progress);
    expect(stuck).toBe(true);
  }
  scrollHeight = 1000;
  listeners.get("scroll")?.();
  frames.shift()?.();
  expect(styles["transform"]).toBe("scaleX(0)");
  expect(styles["width"]).toBeUndefined();
});

it("defers sticky-card geometry until after first paint and schedules resize measurements", () => {
  const home = readFileSync(
    new URL("../public/pages/home.html", import.meta.url),
    "utf8",
  );
  const script = home.match(
    /<script>\s*(\(\(\) => \{\s*const cards =[^]*?)<\/script>/u,
  )?.[1];
  expect(script).toBeDefined();
  const frames: Array<() => void> = [];
  const events = new Map<string, () => void>();
  const measured: string[] = [];
  const cards = [0, 300].map((top) => ({
    style: { transform: "" },
    get offsetTop() {
      measured.push("offsetTop");
      return top;
    },
    get offsetHeight() {
      measured.push("offsetHeight");
      return 300;
    },
    classList: { add() {}, remove() {} },
    addEventListener() {},
  }));
  runInNewContext(script ?? "", {
    document: { querySelectorAll: () => cards },
    matchMedia: () => ({ matches: false }),
    requestAnimationFrame: (callback: () => void) => frames.push(callback),
    addEventListener: (name: string, callback: () => void) =>
      events.set(name, callback),
    getComputedStyle: () => {
      measured.push("computedStyle");
      return { top: "100px" };
    },
    scrollY: 400,
    setTimeout: (callback: () => void) => callback(),
    IntersectionObserver: class {
      observe() {}
    },
  });
  expect(measured).toEqual([]);
  frames.shift()?.();
  expect(measured).toEqual([]);
  frames.shift()?.();
  expect(measured).toContain("computedStyle");
  expect(cards[0]?.style.transform).toBe("scale(0.9600)");
  measured.length = 0;
  events.get("resize")?.();
  expect(measured).toEqual([]);
  frames.shift()?.();
  expect(measured).toContain("computedStyle");
});
