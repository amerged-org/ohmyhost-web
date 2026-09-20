/** Editorial page kinds; each kind selects the schema.org nodes the page emits. */
export type PageKind = "page" | "about" | "article" | "howto" | "collection";

/** One public editorial page: its route, head metadata and Markdown body. */
export interface ContentPage {
  readonly path: string;
  /** Full `<title>` text, 40–60 characters. */
  readonly title: string;
  /** The only `<meta name="description">`, 120–160 characters. */
  readonly description: string;
  readonly kind: PageKind;
  /** ISO date of the last content change: sitemap lastmod and dateModified. */
  readonly modified: string;
  /** ISO date; articles only. */
  readonly published?: string;
  /** Breadcrumb parent route. */
  readonly parent?: string;
  /** Absolute path of a 1200×630 PNG; the site image when absent. */
  readonly ogImage?: string;
  /** Short breadcrumb label; the title's first clause when absent. */
  readonly crumb?: string;
  readonly markdown: string;
}
