/** Footer link groups shared by the homepage and every document page. Leaf module: no imports. */
export type SiteLinkGroup = {
  readonly heading: string;
  readonly links: ReadonlyArray<readonly [label: string, href: string]>;
};

export const SITE_LINKS: readonly SiteLinkGroup[] = [
  {
    heading: "product",
    links: [
      ["Log in", "/login"],
      ["Pricing", "/pricing"],
      ["Stack", "/#stack"],
      ["Export", "/#export"],
      ["Changelog", "/changelog"],
      ["Status", "/status"],
    ],
  },
  {
    heading: "compare",
    links: [
      ["vs Vercel", "/vs/vercel"],
      ["vs Supabase", "/vs/supabase"],
      ["vs Resend", "/vs/resend"],
      ["vs Railway", "/vs/railway"],
      ["Cost breakdown", "/pricing/breakdown"],
    ],
  },
  {
    heading: "deploy from",
    links: [
      ["Claude Code", "/for/claude-code"],
      ["Cursor", "/for/cursor"],
      ["Codex", "/for/codex"],
      ["Lovable", "/from/lovable"],
      ["Bolt", "/from/bolt"],
      ["Replit", "/from/replit"],
      ["Vercel and Supabase", "/from/vercel-supabase"],
    ],
  },
  {
    heading: "developers",
    links: [
      ["Docs", "https://docs.ohmyho.st/"],
      ["MCP server", "https://docs.ohmyho.st/agents/mcp"],
      ["CLI", "https://docs.ohmyho.st/cli"],
      ["API", "https://docs.ohmyho.st/api"],
      ["Skills", "https://docs.ohmyho.st/skills"],
    ],
  },
  {
    heading: "company",
    links: [
      ["About", "/about"],
      ["Philosophy", "/philosophy"],
      ["Blog", "/blog"],
      ["Open source", "/open-source"],
    ],
  },
  {
    heading: "legal",
    links: [
      ["Privacy", "/privacy"],
      ["Cookies", "/cookies"],
      ["Terms", "/terms"],
      ["DPA", "/dpa"],
      ["Contact", "/contact"],
    ],
  },
];

/** The six footer columns, identical on the homepage and on every document page. */
export function footerColumnsHtml(): string {
  return SITE_LINKS.map(
    ({ heading, links }) =>
      `<div class="fcol"><h4>${heading}</h4>${links
        .map(
          ([label, href]) =>
            `<a href="${href}"${href.startsWith("https://") ? ' rel="noopener"' : ""}>${label}</a>`,
        )
        .join("")}</div>`,
  ).join("");
}

/** Marks every anchor that leaves ohmyho.st so a new tab cannot reach the opener. */
export function externalLinkRel(html: string): string {
  return html.replaceAll(
    /<a href="(https?:\/\/(?!ohmyho\.st\/)[^"]*)"(?![^>]*\brel=)/gu,
    '<a href="$1" rel="noopener"',
  );
}
