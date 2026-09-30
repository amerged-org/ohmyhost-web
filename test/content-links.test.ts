import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { expect, it } from "vitest";

import { auditContentLinks } from "../src/content/links.js";
import type { ContentSource } from "../src/content/tree.js";

function page(
  path: string,
  markdown: string,
  extra: Partial<ContentSource> = {},
): ContentSource {
  return {
    path,
    markdown,
    title: "Editorial test page",
    description: "Test fixture",
    kind: "page",
    status: "published",
    modified: "2026-09-30",
    ...extra,
  };
}

it("requires another published editorial body, even with index, self, navigation and footer links", () => {
  const report = auditContentLinks([
    page("/blog/post", "[Read this article](/blog/post#details)", {
      kind: "article",
    }),
    page("/blog", "[Read this article](/blog/post)", { kind: "collection" }),
    page(
      "/guide",
      '<nav><a href="/blog/post">Navigation</a></nav>\n\n<footer><a href="/blog/post">Footer</a></footer>',
    ),
    page("/draft", "[Read this article](/blog/post)", { status: "draft" }),
  ]);
  expect(report.brokenLinks).toEqual([]);
  expect(report.incoming.get("/blog/post")).toEqual([]);
  expect(report.unlinkedArticles).toEqual(["/blog/post"]);
});

it("reads Markdown and HTML links, normalizes canonical addresses and counts each source once", () => {
  const report = auditContentLinks([
    page("/blog/post", "# Article", { kind: "article" }),
    page(
      "/blog/older",
      "[read](/blog/post#section)\n\n[again](https://ohmyho.st/blog/post/?from=older)\n\n[relative](post)\n\n[reference][article]\n\n[article]: /blog/post",
    ),
    page(
      "/guide",
      '<a href=\'/blog/post\'>Read the article</a>\n\n<a class="link" HREF=/blog/post/>Read it again</a>\n\n<a href="&#47;blog&#x2f;post?one=1&amp;two=2">HTML entity path</a>',
    ),
    page("/from/lovable", "[read](../blog/post)"),
    page(
      "/other",
      "[external](https://example.com/blog/post)\n\n[docs](https://docs.ohmyho.st/blog/post)\n\n[mail](mailto:seb@example.com)",
    ),
  ]);
  expect(report.brokenLinks).toEqual([]);
  expect(report.incoming.get("/blog/post")).toEqual([
    "/blog/older",
    "/guide",
    "/from/lovable",
  ]);
  expect(report.unlinkedArticles).toEqual([]);
});

it("ignores code, images, comments and href lookalikes without treating Markdown mirrors as coverage", () => {
  const report = auditContentLinks([
    page("/blog/post", "# Article", { kind: "article" }),
    page(
      "/guide",
      [
        "`[read](/blog/post)`",
        "```md\n[read](/blog/post)\n<a href='/blog/post'>Example</a>\n```",
        "<!-- <a href='/blog/post'>Comment</a> -->",
        '<code><a href="/blog/post">Example</a></code>',
        '<script><a href="/blog/post">Script</a></script>',
        "[![Preview](/images/preview.png)](/blog/post)",
        '<a href="/blog/post"><svg><title>Preview</title></svg></a>',
        '<a data-href="/blog/post">No destination</a>',
        '<a href="">Empty</a>',
        "[Markdown mirror](/blog/post.md)",
      ].join("\n\n"),
    ),
  ]);
  expect(report.brokenLinks).toEqual([]);
  expect(report.unlinkedArticles).toEqual(["/blog/post"]);
});

it("validates image-only and empty anchors without counting them as article coverage", () => {
  const report = auditContentLinks([
    page(
      "/guide",
      [
        "[![Preview](/images/chart.png)](/missing)",
        "[Repeated missing destination](/missing)",
        '<a href="/blog/draft"><img src="/images/chart.png" alt="Preview"></a>',
        '<a href="/empty"></a>',
        "[![Preview](/images/chart.png)](/blog/post)",
      ].join("\n\n"),
    ),
    page("/blog/draft", "# Draft", { kind: "article", status: "draft" }),
    page("/blog/post", "# Article", { kind: "article" }),
  ]);
  expect(report.brokenLinks).toEqual([
    {
      source: "/guide",
      href: "/missing",
      target: "/missing",
      reason: "missing",
    },
    {
      source: "/guide",
      href: "/blog/draft",
      target: "/blog/draft",
      reason: "draft",
    },
    { source: "/guide", href: "/empty", target: "/empty", reason: "missing" },
  ]);
  expect(report.unlinkedArticles).toEqual(["/blog/post"]);
});

it.each([true, false])(
  "preserves text coverage when the same href has image-only and text links (image first: %s)",
  (imageFirst) => {
    const links = [
      "[![Preview](/images/chart.png)](/blog/post)",
      "[Read the article](/blog/post)",
    ];
    const report = auditContentLinks([
      page("/guide", (imageFirst ? links : links.toReversed()).join("\n\n")),
      page("/blog/post", "# Article", { kind: "article" }),
    ]);
    expect(report.brokenLinks).toEqual([]);
    expect(report.incoming.get("/blog/post")).toEqual(["/guide"]);
    expect(report.unlinkedArticles).toEqual([]);
  },
);

it("reports missing and draft targets, including draft mirrors, but permits real non-editorial routes", () => {
  expect(
    auditContentLinks([page("/guide", "[Missing destination](/missing)")])
      .brokenLinks,
  ).toEqual([
    {
      source: "/guide",
      href: "/missing",
      target: "/missing",
      reason: "missing",
    },
  ]);
  const allowed = new Set([
    "/",
    "/llms.txt",
    "/images/chart.png",
    "/skills/deploy/SKILL.md",
  ]);
  const report = auditContentLinks(
    [
      page(
        "/guide",
        '[missing](/missing#detail)\n\n[draft](/blog/draft)\n\n[draft mirror](/blog/draft.md)\n\n[self](#detail)\n\n[home](/#stack)\n\n[machine](/llms.txt)\n\n[asset](/images/chart.png)\n\n[Skill](/skills/deploy/SKILL.md)\n\n<a href="http://[">Malformed URL</a>',
      ),
      page("/blog/draft", "[missing](/unreviewed)", {
        status: "draft",
        kind: "article",
      }),
    ],
    (target) => allowed.has(target),
  );
  expect(report.brokenLinks).toEqual([
    {
      source: "/guide",
      href: "/missing#detail",
      target: "/missing",
      reason: "missing",
    },
    {
      source: "/guide",
      href: "/blog/draft",
      target: "/blog/draft",
      reason: "draft",
    },
    {
      source: "/guide",
      href: "/blog/draft.md",
      target: "/blog/draft.md",
      reason: "draft",
    },
  ]);
  expect(report.unlinkedArticles).toEqual([]);
});

it("checks every published authored article and destination with the read-only audit command", () => {
  const root = fileURLToPath(new URL("../", import.meta.url));
  const output = execFileSync(
    process.execPath,
    ["scripts/check-content-links.mjs"],
    {
      cwd: root,
      encoding: "utf8",
    },
  );
  expect(output).toContain("/blog/lovable-alternative-bring-your-own-llm:");
  expect(output).not.toContain("no incoming editorial link");
});
