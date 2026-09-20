import { marked, type Token } from "marked";

import { FOUNDER, SITE_ORIGIN, crumbLabel, pageMeta, type PageMeta } from "./page-meta.js";
import { OG_IMAGES } from "./generated-site-frame.js";
import { BLOG_POSTS } from "./pages/index.js";

/** The page's rendered social card when one exists, else the declared or site-wide image. */
export function ogImagePath(path: string, meta: PageMeta): string {
  const slug = path.slice(1).replaceAll("/", "-");
  return OG_IMAGES.includes(slug) ? `/og/${slug}.png` : (meta.ogImage ?? "/og.png");
}

const ORGANIZATION_ID = `${SITE_ORIGIN}/#org`;
const FOUNDER_ID = `${SITE_ORIGIN}${FOUNDER.path}#founder`;

/** Escapes text for an HTML attribute value. */
export function attribute(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function plain(text: string): string {
  return text
    .replaceAll(/\[([^\]]+)\]\([^)]*\)/gu, "$1")
    .replaceAll(/[*_`]/gu, "")
    .replaceAll(/\s+/gu, " ")
    .trim();
}

function heading(token: Token, depth: number): string | null {
  return token.type === "heading" && token.depth === depth ? String(token.text) : null;
}

/** The `### Question?` + paragraph pairs under `## FAQ`; the visible text is the schema text. */
export function faqEntries(markdown: string): Array<{ question: string; answer: string }> {
  const entries: Array<{ question: string; answer: string }> = [];
  let inFaq = false;
  let question: string | null = null;
  for (const token of marked.lexer(markdown)) {
    const section = heading(token, 2);
    if (section !== null) {
      inFaq = section.trim() === "FAQ";
      question = null;
      continue;
    }
    if (!inFaq) continue;
    const next = heading(token, 3);
    if (next !== null) {
      question = plain(next);
      continue;
    }
    if (question !== null && token.type === "paragraph") {
      entries.push({ question, answer: plain(String(token.text)) });
      question = null;
    }
  }
  return entries;
}

/** The ordered list under the first `## How to …` heading. */
export function howToSteps(markdown: string): Array<{ name: string; text: string }> {
  let inHowTo = false;
  for (const token of marked.lexer(markdown)) {
    const section = heading(token, 2);
    if (section !== null) {
      if (inHowTo) break;
      inHowTo = section.trim().startsWith("How to");
      continue;
    }
    if (inHowTo && token.type === "list" && token.ordered)
      return (token.items as Array<{ text: string }>).map((item) => {
        const text = plain(item.text);
        const [name] = text.split(/:\s/u, 1);
        return { name: name ?? text, text };
      });
  }
  return [];
}

function breadcrumbItems(path: string, meta: PageMeta): Array<{ name: string; path: string }> {
  const items = [{ name: "Home", path: "/" }];
  if (meta.parent) items.push({ name: crumbLabel(pageMeta(meta.parent)), path: meta.parent });
  items.push({ name: crumbLabel(meta), path });
  return items;
}

/** The schema.org graph for one page: organization, page node, breadcrumb and the kind's nodes. */
export function jsonLdGraph(path: string, meta: PageMeta, markdown: string): object[] {
  const url = `${SITE_ORIGIN}${path}`;
  const image = `${SITE_ORIGIN}${ogImagePath(path, meta)}`;
  const pageType =
    meta.kind === "about" ? "AboutPage" : meta.kind === "collection" ? "CollectionPage" : "WebPage";
  const graph: object[] = [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "ohmyho.st",
      url: `${SITE_ORIGIN}/`,
      logo: `${SITE_ORIGIN}/logo.png`,
    },
    {
      "@type": pageType,
      "@id": url,
      url,
      name: meta.title,
      description: meta.description,
      dateModified: meta.modified,
      isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
      breadcrumb: { "@id": `${url}#breadcrumb` },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: breadcrumbItems(path, meta).map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: `${SITE_ORIGIN}${item.path}`,
      })),
    },
  ];
  const person = {
    "@type": "Person",
    "@id": FOUNDER_ID,
    name: FOUNDER.name,
    url: `${SITE_ORIGIN}${FOUNDER.path}`,
    image: `${SITE_ORIGIN}${FOUNDER.image}`,
    jobTitle: "Founder",
    worksFor: { "@id": ORGANIZATION_ID },
  };
  if (meta.kind === "about") graph.push(person);
  if (meta.kind === "article")
    graph.push(
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        headline: meta.title,
        description: meta.description,
        datePublished: meta.published ?? meta.modified,
        dateModified: meta.modified,
        author: { "@id": FOUNDER_ID },
        publisher: { "@id": ORGANIZATION_ID },
        image,
        mainEntityOfPage: { "@id": url },
      },
      person,
    );
  if (meta.kind === "howto")
    graph.push({
      "@type": "HowTo",
      "@id": `${url}#howto`,
      name: meta.title,
      description: meta.description,
      step: howToSteps(markdown).map((step, index) => ({
        "@type": "HowToStep",
        position: index + 1,
        name: step.name,
        text: step.text,
      })),
    });
  if (meta.kind === "collection")
    graph.push({
      "@type": "Blog",
      "@id": `${url}#blog`,
      name: meta.title,
      publisher: { "@id": ORGANIZATION_ID },
      blogPost: BLOG_POSTS.map((post) => ({
        "@type": "BlogPosting",
        "@id": `${SITE_ORIGIN}${post.path}#article`,
        headline: post.title,
        datePublished: post.published ?? post.modified,
        url: `${SITE_ORIGIN}${post.path}`,
      })),
    });
  const faq = faqEntries(markdown);
  if (faq.length)
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faq.map((entry) => ({
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: { "@type": "Answer", text: entry.answer },
      })),
    });
  return graph;
}

/** Title, description, canonical, social tags and JSON-LD for one page's `<head>`. */
export function headTags(path: string, meta: PageMeta, markdown: string): string {
  const url = `${SITE_ORIGIN}${path}`;
  const image = `${SITE_ORIGIN}${ogImagePath(path, meta)}`;
  const title = attribute(meta.title);
  const description = attribute(meta.description);
  const tags = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<link rel="canonical" href="${url}">`,
    `<link rel="alternate" type="text/markdown" href="${path}.md">`,
    `<meta property="og:type" content="${meta.kind === "article" ? "article" : "website"}">`,
    `<meta property="og:url" content="${url}">`,
    `<meta property="og:site_name" content="ohmyho.st">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:image" content="${image}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:locale" content="en_US">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${image}">`,
  ];
  if (meta.kind === "article")
    tags.push(
      `<meta property="article:published_time" content="${meta.published ?? meta.modified}">`,
      `<meta property="article:modified_time" content="${meta.modified}">`,
      `<meta property="article:author" content="${SITE_ORIGIN}${FOUNDER.path}">`,
    );
  const graph = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": jsonLdGraph(path, meta, markdown),
  }).replaceAll("<", "\\u003c");
  tags.push(`<script type="application/ld+json">${graph}</script>`);
  return tags.join("");
}

/** The visible breadcrumb trail above the page content. */
export function breadcrumbHtml(path: string, meta: PageMeta): string {
  const items = breadcrumbItems(path, meta);
  return `<nav class="crumbs" aria-label="Breadcrumb">${items
    .map((item, index) =>
      index === items.length - 1
        ? `<span aria-current="page">${attribute(item.name)}</span>`
        : `<a href="${item.path}">${attribute(item.name)}</a>`,
    )
    .join('<span aria-hidden="true"> › </span>')}</nav>`;
}
