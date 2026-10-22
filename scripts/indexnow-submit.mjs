#!/usr/bin/env node
/* global URL, fetch, console */
/**
 * Tells IndexNow search engines (Bing, Yandex, Naver, Seznam) which public URLs are new or changed.
 * Run it after the website or documentation release is live, never before: the engine fetches the
 * key file from the host to verify ownership.
 *
 *   node scripts/indexnow-submit.mjs --host ohmyho.st --all                 (dry run)
 *   node scripts/indexnow-submit.mjs --host ohmyho.st --since 2026-10-22 --submit
 *   node scripts/indexnow-submit.mjs --host docs.ohmyho.st --all --submit
 *
 * The URL list comes from the host's live sitemap. Without --submit the script only verifies the
 * key file and reports what it would send. Keys live in content/data/indexnow.json.
 */
import process from "node:process";
import { pathToFileURL } from "node:url";
import keys from "../content/data/indexnow.json" with { type: "json" };

export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";
/** IndexNow accepts at most 10,000 URLs per request. */
const MAX_URLS = 10_000;
/** Host to key, indexed by the host a caller names. */
const KEYS = /** @type {Record<string, string | undefined>} */ (keys);

/**
 * `{ loc, lastmod }` for every `<url>` of a sitemap.
 * @param {string} xml
 * @returns {Array<{ loc: string, lastmod?: string }>}
 */
export function sitemapUrls(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gu)].flatMap(
    ([, block = ""]) => {
      const loc = block.match(/<loc>\s*([^<\s]+)\s*<\/loc>/u)?.[1];
      if (!loc) return [];
      return [
        {
          loc,
          lastmod: block.match(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/u)?.[1],
        },
      ];
    },
  );
}

/**
 * URLs of one host: all of them, or those whose lastmod is on or after `since` (YYYY-MM-DD).
 * @param {Array<{ loc: string, lastmod?: string }>} entries
 * @param {{ host: string, since?: string, all?: boolean }} options
 * @returns {string[]}
 */
export function selectUrls(entries, { host, since, all }) {
  if (!all && !since) throw new Error("Choose --since YYYY-MM-DD or --all");
  return entries
    .filter(({ loc }) => new URL(loc).host === host)
    .filter(
      ({ lastmod }) =>
        all || (lastmod !== undefined && lastmod.slice(0, 10) >= (since ?? "")),
    )
    .map(({ loc }) => loc);
}

/**
 * @param {string} host
 * @param {string[]} urls
 */
export function buildPayload(host, urls) {
  const key = KEYS[host];
  if (!key) throw new Error(`No IndexNow key is recorded for ${host}`);
  return {
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList: urls,
  };
}

/**
 * @param {string[]} argv
 * @returns {{ host?: string, since?: string, all: boolean, submit: boolean }}
 */
function parseArguments(argv) {
  /** @type {{ host?: string, since?: string, all: boolean, submit: boolean }} */
  const options = { all: false, submit: false };
  for (let index = 0; index < argv.length; index += 1) {
    const flag = argv[index];
    if (flag === "--all") options.all = true;
    else if (flag === "--submit") options.submit = true;
    else if (flag === "--host" || flag === "--since") {
      index += 1;
      const value = argv[index];
      if (!value) throw new Error(`${flag} needs a value`);
      if (flag === "--host") options.host = value;
      else options.since = value;
    } else throw new Error(`Unknown option: ${flag}`);
  }
  return options;
}

/**
 * @param {string[]} argv
 * @param {{ fetchImpl?: typeof fetch, log?: (line: string) => void }} [options]
 */
export async function main(
  argv,
  { fetchImpl = fetch, log = (line) => console.log(line) } = {},
) {
  const { host, since, all, submit } = parseArguments(argv);
  if (!host) throw new Error("--host is required");
  const key = KEYS[host];
  if (!key) throw new Error(`No IndexNow key is recorded for ${host}`);

  const sitemap = await fetchImpl(`https://${host}/sitemap.xml`);
  if (!sitemap.ok)
    throw new Error(`Sitemap of ${host} answered ${sitemap.status}`);
  const urls = selectUrls(sitemapUrls(await sitemap.text()), {
    host,
    since,
    all,
  });
  if (urls.length === 0)
    throw new Error(`No URL of ${host} matches; nothing to submit`);
  if (urls.length > MAX_URLS)
    throw new Error(`${urls.length} URLs exceed the 10,000 per request limit`);

  // The engine verifies ownership by fetching this file, so a missing or wrong key fails here first.
  const keyFile = await fetchImpl(`https://${host}/${key}.txt`);
  if (!keyFile.ok || (await keyFile.text()).trim() !== key)
    throw new Error(
      `The key file https://${host}/${key}.txt is not live with the exact key; release ${host} first`,
    );

  const payload = buildPayload(host, urls);
  log(`${host}: ${urls.length} URLs selected, key file verified`);
  if (!submit) {
    log("Dry run: nothing was sent. Add --submit to notify IndexNow.");
    for (const url of urls.slice(0, 5)) log(`  ${url}`);
    return { submitted: false, urls: urls.length };
  }
  const response = await fetchImpl(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });
  // 200: accepted; 202: accepted, key validation pending.
  if (response.status !== 200 && response.status !== 202)
    throw new Error(`IndexNow answered ${response.status}`);
  log(
    `IndexNow accepted ${urls.length} URLs for ${host} (HTTP ${response.status}).`,
  );
  return { submitted: true, urls: urls.length, status: response.status };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main(process.argv.slice(2)).catch((error) => {
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`,
    );
    process.exit(1);
  });
