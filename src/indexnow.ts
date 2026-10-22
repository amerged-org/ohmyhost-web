import keys from "../content/data/indexnow.json" with { type: "json" };

/**
 * IndexNow ownership keys, one per public host. A key is public by design: the search engine
 * fetches it from the host that submits URLs, so each host serves its own key as a text file at its
 * root. The website Worker serves the first key; the documentation repository serves the second at
 * `docs.ohmyho.st` (Mintlify publishes the file committed at the repository root).
 */
export const INDEXNOW_KEYS: Readonly<Record<string, string>> = keys;

/** The website key when `pathname` is the website's key file, otherwise undefined. */
export function websiteIndexNowKey(pathname: string): string | undefined {
  const key = INDEXNOW_KEYS["ohmyho.st"];
  return pathname === `/${key}.txt` ? key : undefined;
}
