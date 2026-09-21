/** Shared identity for the homepage and every editorial page. */
export const SITE_ORIGIN = "https://ohmyho.st";
export const WEBSITE = {
  "@type": "WebSite",
  "@id": `${SITE_ORIGIN}/#website`,
  name: "ohmyho.st",
  url: `${SITE_ORIGIN}/`,
  publisher: { "@id": `${SITE_ORIGIN}/#org` },
} as const;

/** Editorial dates have day precision; serialize their UTC day boundary without changing the day.
 * Explicit timestamps retain their original clock time and timezone. Never use the build time.
 */
export function schemaDate(value: string): string {
  if (
    !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/u.test(
      value,
    ) ||
    !Number.isFinite(Date.parse(value)) ||
    new Date(`${value.slice(0, 10)}T00:00:00Z`).toISOString().slice(0, 10) !==
      value.slice(0, 10)
  )
    throw new Error(`Invalid editorial date: ${value}`);
  return value.length === 10 ? `${value}T00:00:00Z` : value;
}
