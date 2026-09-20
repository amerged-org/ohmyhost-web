import { existsSync } from "node:fs";
import { format } from "prettier";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, URL } from "node:url";
import TurndownService from "turndown";
import {
  creditPricingRates,
  creditPricingTable,
} from "../../../scripts/credit-pricing-document.mjs";
import { externalLinkRel, footerColumnsHtml } from "../src/site-links.ts";

const directory = fileURLToPath(new URL("../", import.meta.url));
const root = fileURLToPath(new URL("../../", new URL("../", import.meta.url)));
const output = `${directory}public/pages`;
const brandAssets = `${root}brand/assets`;
await mkdir(output, { recursive: true });
await writeFile(
  `${directory}src/generated-pricing.ts`,
  await format(
    "// Generated from PRICING.md by pages:prepare.\n" +
      `export const CREDIT_PRICING_TABLE = ${JSON.stringify(await creditPricingTable(root))};\n` +
      `export const CREDIT_RATES = ${JSON.stringify(await creditPricingRates(root))} as const;\n`,
    { parser: "typescript", printWidth: 100 },
  ),
);
await Promise.all(["api.html", "api.md"].map((file) => rm(`${output}/${file}`, { force: true })));
const markdown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
markdown.remove(["script", "style", "svg", "head", "button", "input"]);
const templates = {
  home: "99c3d2701c82c3ae9936ffa6c142169fd6fc136caa5ae33fbdacf36f6d93a2ac",
  brand: "d2a49d8a4b9d979c72958eebb2f2db4b7637405ccacd27100ce77e405a01bebe",
};
const fontCss = await readFile(`${directory}site/fonts.css`, "utf8");
const privacyUi = `${await readFile(`${directory}site/privacy-ui.html`, "utf8")}<script>${await readFile(`${directory}site/privacy-ui.js`, "utf8")}</script>`;
const approvedHome = await readFile(`${directory}site/home.html`, "utf8");
const sharedCss = approvedHome.match(/<style>([\s\S]*?)<\/style>/u)?.[1];
const navigationCss =
  '@media(max-width:760px){nav{gap:10px}nav .r{gap:8px}nav .btn.nochev{min-width:0;padding:9px 10px;font-size:13px}}@media(max-width:360px){nav a[href="https://docs.ohmyho.st/"]{display:none}}';
if (!sharedCss) throw new Error("The approved design stylesheet is missing");
await writeFile(
  `${directory}src/generated-site-frame.ts`,
  await format(
    "// Generated from the approved template and beta entry assets.\n" +
      `export const SITE_CSS = ${JSON.stringify(fontCss + sharedCss + navigationCss)};\n` +
      `export const SITE_ICON = ${JSON.stringify(await readFile(`${brandAssets}/favicon.svg`, "utf8"))};\n` +
      `export const PRIVACY_UI = ${JSON.stringify(privacyUi)};\n` +
      `export const BETA_SCRIPT = ${JSON.stringify(await readFile(`${directory}site/beta-entry.js`, "utf8"))};\n` +
      `export const FIGURE_SCRIPT = ${JSON.stringify(await readFile(`${directory}site/figure-count.js`, "utf8"))};\n` +
      `export const OG_IMAGES: readonly string[] = ${JSON.stringify(await renderedOgSlugs())};\n`,
    { parser: "typescript", printWidth: 100 },
  ),
);
for (const [name, digest] of Object.entries(templates)) {
  const original = await readFile(`${directory}site/${name}.html`, "utf8");
  if (createHash("sha256").update(original).digest("hex") !== digest)
    throw new Error(`The supplied ${name} template was changed`);
  let html = original
    .replace(/<link[^>]+href="https:\/\/fonts\.(?:googleapis|gstatic)\.com[^>]*>/gu, "")
    .replace(/<link\b[^>]*\brel="(?:icon|alternate icon|apple-touch-icon)"[^>]*>/gu, "")
    .replace(
      "</head>",
      `<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="alternate icon" href="/favicon.ico"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><style>${fontCss}${navigationCss}</style></head>`,
    );
  if (name === "home") {
    html = applyApprovedHomepageChanges(html).replace(
      /(<button[^>]*id="navcopy"[^>]*>[\s\S]*?<span>)Start free/u,
      "$1Copy prompt",
    );
    html = hardenHomepageMarkup(html);
    html = html.replace(
      '<h2 class="up">Why one balance instead of five subscriptions.</h2>',
      '<h2 class="up" id="philosophy">Why one balance instead of five subscriptions.</h2>',
    );
    html = html
      .replace(
        "12 tools found",
        `${JSON.parse(await readFile(`${directory}src/generated-mcp-tools.json`, "utf8")).tools.length} tools found`,
      )
      .replaceAll("create_project", "project_create")
      .replaceAll("provision_postgres", "deployment_plan")
      .replaceAll("set_env", "secret_set_command")
      .replaceAll("verify_email_sender", "mail_domain_status")
      .replaceAll("add_domain", "domain_paid_apply")
      .replaceAll("https://lovable.ohm.st", "https://calm-river-builds.check.omh.st");
    html = html.replaceAll(
      "omh create lovable\\nomh db up\\nomh domain add lovable\\nomh deploy",
      'ohmyhost init --dry-run --json\\nohmyhost project context --project "$PROJECT_ID" --json',
    );
    html = html
      .replaceAll("omh create lovable", "ohmyhost init --dry-run --json")
      .replaceAll("omh db up", "ohmyhost plan --help")
      .replaceAll("omh domain add lovable", "ohmyhost deploy --help")
      .replaceAll("omh deploy", "ohmyhost project status --help");
    html = html.replaceAll(
      "Read https://ohmyho.st/llms.txt and set up hosting for this repo on ohmyho.st: create the project, provision Postgres, add the domain and deploy. Ask me only if you need a decision.",
      "Read https://ohmyho.st/llms.txt and https://ohmyho.st/skills/ohmyhost-get-started/SKILL.md. Connect this agent to ohmyho.st and deploy this GitHub project using only the capabilities it needs. Follow the deployment Skill, keep my existing project decisions and verify the app.",
    );
    html = html.replace(
      "</body>",
      `<script>${await readFile(`${directory}site/beta-entry.js`, "utf8")}</script></body>`,
    );
  }
  if (name === "brand") {
    html = html.replace(
      /<!-- ---------------- LOGO ---------------- -->[\s\S]*?(?=<!-- ---------------- COLOR ---------------- -->)/u,
      await readFile(`${directory}site/brand-logo-section.html`, "utf8"),
    );
    const mark = (await readFile(`${brandAssets}/omega-light.svg`, "utf8"))
      .replace("<svg ", '<svg width="24" height="24" aria-hidden="true" ')
      .replace('stroke="#F0F1F2"', 'stroke="currentColor"');
    html = html
      .replace(
        '<span class="mark">ohmyho<i>.st</i></span>',
        `<a class="mark" href="/" style="display:flex;align-items:center;gap:9px">${mark}<span>ohmyho<i>.st</i></span></a>`,
      )
      .replace(
        "<h5>foundations</h5>",
        '<nav class="brand-toc" aria-label="Design system sections"><h5>foundations</h5>',
      )
      .replace("</aside>", "</nav></aside>")
      .replace(
        "</head>",
        '<meta name="description" content="The ohmyho.st design system: colour tokens, type, the Ω mark, components and the drawing rules behind every page and figure."><meta property="og:title" content="ohmyho.st — Design System"><meta property="og:description" content="The ohmyho.st design system: colour tokens, type, the Ω mark, components and the drawing rules behind every page and figure."><meta property="og:image" content="https://ohmyho.st/og.png"><meta name="twitter:card" content="summary_large_image">' +
          "<style>.side,.main{min-width:0}.shell{grid-template-columns:236px minmax(0,1fr)}@media(max-width:900px){.shell{grid-template-columns:minmax(0,1fr)}.side{padding:20px}.side .tag{margin-bottom:14px}.brand-toc{display:flex;gap:18px;overflow-x:auto;white-space:nowrap;padding-bottom:8px}.brand-toc h5{display:none}.brand-toc a{flex:none}.side .mark{margin-right:48px}}</style></head>",
      );
  }
  html = html
    .replaceAll('href="/docs/mcp"', 'href="https://docs.ohmyho.st/agents/mcp"')
    .replaceAll('href="/docs/cli"', 'href="https://docs.ohmyho.st/cli"')
    .replaceAll('href="/docs"', 'href="https://docs.ohmyho.st/"');
  html = html.replace("</body>", `${privacyUi}</body>`);
  await writeFile(`${output}/${name}.html`, html);
  await writeFile(
    `${output}/${name === "home" ? "index" : name}.md`,
    `${markdown.turndown(html)}\n`,
  );
}

for (const [file, source] of Object.entries({ "og.png": "og.png", "logo.png": "omega-dark.png" }))
  await writeFile(`${output}/${file}`, await readFile(`${brandAssets}/${source}`));
await mkdir(`${output}/brand-assets`, { recursive: true });
for (const file of [
  "omega-light.svg",
  "omega-dark.svg",
  "omega-light.png",
  "omega-dark.png",
  "favicon.svg",
  "favicon.ico",
  "apple-touch-icon.png",
  "founder.png",
  "og.png",
])
  await writeFile(`${output}/brand-assets/${file}`, await readFile(`${brandAssets}/${file}`));

const entry = await readFile(`${directory}src/customer-entry.ts`, "utf8");
const version = entry.match(/export const CLIENT_RELEASE = "([^"]+)"/u)?.[1];
if (!version || !/^\d+\.\d+\.\d+(?:-beta\.\d+)?$/u.test(version))
  throw new Error("The public client release is invalid");
await writeFile(
  `${output}/0.sh`,
  (await readFile(`${directory}site/0.sh`, "utf8")).replace("@CLIENT_RELEASE@", version),
);
// The published release carries the same bundled contract the repository generates, so a
// checkout without the prepared release directory still builds an identical site.
const releaseContractPath = `${directory}public/releases/${version}/openapi.json`;
const contractPath = existsSync(releaseContractPath)
  ? releaseContractPath
  : `${root}packages/contracts/generated/openapi.json`;
const contract = JSON.parse(await readFile(contractPath, "utf8"));
execFileSync(
  "pnpm",
  [
    "exec",
    "redocly",
    "bundle",
    contractPath,
    "--output",
    `${output}/openapi.yaml`,
    "--ext",
    "yaml",
  ],
  { cwd: root, stdio: "inherit" },
);
await writeFile(`${output}/openapi.json`, `${JSON.stringify(contract, null, 2)}\n`);

/** P30: approved changes are applied without rewriting the supplied v97 source. */
function applyApprovedHomepageChanges(html) {
  const socialPreview = "Supabase Vercel Resend Alternative - all in one from 10$.";
  html = html.replace(
    /(<meta (?:property="og:(?:title|description)"|name="twitter:(?:title|description)") content=")[^"]*(">)/gu,
    `$1${socialPreview}$2`,
  );
  const exportAnswer =
    "Request a portable SQL dump in a password-encrypted ZIP through your agent, CLI or API. Exports run asynchronously, with one accepted request per project every 24 hours and a signed download link valid for 24 hours. Keep your password and restore on another Postgres host, or let your automation tool copy the encrypted file to your own storage.";
  const euAnswer =
    "Yes. Choose EU when you create the project; the default is US. An EU project keeps its Postgres database, its files and its builds in the EU, and the application runs next to its database. The region cannot be changed later, and prices are identical in both regions. Transactional mail is sent from the platform's mail region in either case.";
  for (const [before, after] of Object.entries({
    '<span class="thin">Ten dollars.</span><br>Host your vibe-coded apps.':
      '<span class="thin">Host your app.</span><br>Supabase Vercel Resend alternative',
    "<title>Hosting for vibe-coded apps — $10/mo for all your projects, not per project | ohmyho.st</title>":
      '<title>ohmyho.st — Hosting for agents, from $10/month</title><meta name="description" content="Deploy GitHub apps with your agent. Hosting, Postgres, domains, email and encrypted SQL exports, with one credit balance across projects.">',
    '"logo": "https://ohmyho.st/logo.png",':
      '"logo": "https://ohmyho.st/logo.png", "legalName": "Amerged B.V.", "identifier": {"@type":"PropertyValue","propertyID":"KVK","value":"42154221"}, "contactPoint": {"@type":"ContactPoint","contactType":"Customer support","url":"https://ohmyho.st/contact"},',
    "Hosting, Postgres, email, domain, AI models and backups behind one command. Built for AI coding agents via MCP.":
      "Hosting, Postgres, domains, email and encrypted SQL exports for GitHub apps, operated through an agent, CLI or API.",
    'class="cta hero-a" id="hero-cta" style="animation-delay:2.4s"': 'class="cta" id="hero-cta"',
    'class="under hero-a" style="animation-delay:2.55s" id="under"': 'class="under" id="under"',
    '  <p class="proof" id="proof" hidden></p>': "",
    "Export to GitHub, paste one prompt. The parts that break by hand come across with it.":
      "Export your Next.js or Vite app to GitHub, then deploy its hosting, database, domains and email with one agent prompt.",
    "Your database, exported. Nightly.": "Your database, exported &amp; connected.",
    "Plain Postgres dumps to Google Drive, Amazon S3 or Cloudflare R2 — sent through Zapier, Make, n8n or Composio. No lock-in, no export button to find.":
      "Request a portable SQL dump in a password-encrypted ZIP. Download it when ready, or use your automation tool to save it to Google Drive, Amazon S3 or Cloudflare R2.",
    "Postgres exports nightly through a connector to Google Drive, Amazon S3 or Cloudflare R2":
      "A customer automation tool transfers an encrypted Postgres export to Google Drive, Amazon S3 or Cloudflare R2",
    "Yes, any time. Your Postgres database is exported nightly as a plain dump to your own Google Drive, Amazon S3 or Cloudflare R2, sent through Zapier, Make, n8n or Composio. Restore it on any Postgres host. No export button to find, nothing to request.":
      exportAnswer,
    "Not yet. ohmyho.st is based in Palo Alto, CA, and an EU hosting region is the next thing on the roadmap — press + on the badge below to vote for it. Until then, we say so plainly rather than claim it.":
      euAnswer,
    // EU hosting is a per-project choice since 2026-09-18: a plain trust badge replaces the roadmap vote.
    '<span class="badge soon"><em>soon</em><b>Hosting in the EU</b><button class="want" data-f="eu" data-tip="Want this? Press +" aria-label="I want EU hosting">+</button></span>':
      '<span class="badge">Hosting in the <b>US</b> or <b>EU</b></span>',
    '"addressLocality": "Palo Alto"': '"addressLocality": "Venray"',
    '"addressRegion": "CA"': '"addressRegion": "Limburg"',
    '"addressCountry": "US"': '"addressCountry": "NL"',
    "From Amsterdam, Netherlands to Palo Alto, CA, US — deploy with ohmyho.st":
      'powered by <a href="https://amerged.com">amerged.com</a> · <a href="/open-source">Open source</a>',
    "<li>Scales up on its own</li>":
      "<li>More capacity when you need it <em>uses credits</em></li>",
    '<span class="sales">Bigger than this? Talk to us.</span>':
      '<a class="sales" href="/contact">Bigger than this? Talk to us.</a>',
    "Dev and prod, both included": "Dev and prod for every project",
    "Dev and prod environments are included for each project, not billed as two. Quiet projects use close to zero credits.":
      "Every project has Dev and Prod. Isolated data uses two independently metered databases; retained resources use credits even when traffic is quiet.",
    "Quiet projects burn almost nothing. Busy ones take credits as they go — top up any time.":
      "Idle database compute can suspend. Retained storage and deployed resources still use credits — top up any time.",
    "<span><h3>a quiet month</h3><u>≈ 0 credits</u></span>":
      "<span><h3>1 database GB-month</h3><u>115 credits</u></span>",
    "Off. If you run out, the site stays up and read-only.":
      "Off. A zero balance starts a seven-day grace period. Refill to keep funded services running.",
    "ohmyho.st bills nothing while a project is idle, and email and domain are in the $10 base price.":
      "Idle database compute can suspend on ohmyho.st, while retained resources still use credits. Paid access enables email and custom domains; their usage is metered.",
    'WorkOS, Better Auth, Auth0 or anything else that speaks OAuth or SAML — wire it in, we don\'t lock you into ours.</p>\n  <div class="cells logos stag" style="grid-template-columns:repeat(4,1fr)">':
      'Better Auth, WorkOS or anything else that speaks OAuth, OIDC or SAML — wire it in, we don\'t lock you into ours.</p>\n  <div class="cells logos stag" id="auth-logos" style="grid-template-columns:repeat(3,1fr)">',
    '<span class="avatar" aria-hidden="true"></span>':
      '<img src="/brand/assets/founder.png" width="96" height="96" loading="lazy" alt="Founder of ohmyho.st" style="border-radius:50%;flex:0 0 96px;object-fit:cover">',
    // PRICING.md is the only price source: no AI product, and every example equals the rate card.
    '<text x="748" y="234">ai models</text>': '<text x="748" y="234">functions &amp; cron</text>',
    "which runs hosting, domain, database, email, AI and backups":
      "which runs hosting, domain, database, email, functions and backups",
    '      <div class="li"><b>AI models</b><span>uses credits</span></div>\n': "",
    '        <li class="no">AI models</li>\n': "",
    '      <div class="li"><b>AI credits</b><span>≈ $5</span></div>\n': "",
    '<span class="count" data-to="70">$70</span>': '<span class="count" data-to="65">$65</span>',
    "Resend Pro $20 — around $70 for one project": "Resend Pro $20 — around $65 for one project",
    "        <li>AI models, any of them <em>uses credits</em></li>\n": "",
    "plus a linked domain, AI models and nightly exports":
      "plus a linked domain, functions and database exports",
    "Custom domains, email, AI models and backups come with the $10 plan.":
      "Custom domains, email and database exports come with the $10 plan.",
    "(2,000 emails ≈ $7 from your balance vs a $20 Resend Pro plan) and more expensive at high volume (50,000 emails ≈ $175 vs $20)":
      "(2,000 emails ≈ $1 from your balance vs a $20 Resend Pro plan) and more expensive at high volume (50,000 emails ≈ $26 vs $20)",
    "1,000 credits. 2,000 emails ≈ 700 credits, a small app's":
      "1,000 credits. 2,000 emails ≈ 105 credits, a small app's",
    "<span><h3>10,000 db reads</h3><u>8 credits</u></span>":
      "<span><h3>1 active database hour</h3><u>36 credits</u></span>",
    "<span><h3>1,000 emails</h3><u>350 credits</u></span>":
      "<span><h3>1,000 emails</h3><u>53 credits</u></span>",
    "<span><h3>1 GB served</h3><u>40 credits</u></span>":
      "<span><h3>1M requests</h3><u>99 credits</u></span>",
    // The slider states the purchase rule of PRICING.md: more credits above USD 100, never a cheaper consumption rate.
    ": '20% off above $100 — 125 credits per dollar';": ": '125 credits per dollar above $100';",
    "autotext.textContent='On. Every $10 of credits after this costs 10% less. Refills $'+f(v)+' when you drop below 10%.';":
      "autotext.textContent='On. Refills 1,000 credits for $9 when you drop below 100 credits.';",
    ": 'On. Every $10 of credits after this costs 10% less. Refills $'+f(steps[+dial.value])+' when you drop below 10%.';":
      ": 'On. Refills 1,000 credits for $9 when you drop below 100 credits.';",
  })) {
    if (!html.includes(before))
      throw new Error(`Approved homepage boundary missing: ${before.slice(0, 65)}`);
    html = html.replaceAll(before, after);
  }
  // Keep the export section and footer link; the top navigation stays compact.
  html = html.replace('        <a href="#export">Export</a>\n', "");
  const priceEnd = html.indexOf("</section>", html.indexOf('<section id="price">'));
  if (priceEnd < 0) throw new Error("Pricing section missing for usage-rate link");
  html =
    html.slice(0, priceEnd) +
    '<p class="note"><a href="https://docs.ohmyho.st/pricing">See all usage rates</a></p>\n' +
    html.slice(priceEnd);
  html = html.replace(
    / {2}\/\* proof: a real number or nothing \*\/[\s\S]*?\n {2}\}\)\.catch\(function\(\)\{\}\);/u,
    "",
  );
  const auth0Tile = / *<span class="logo">[^\n]*logos\/auth0\.svg[^\n]*<\/span>\n/gu;
  if (html.match(auth0Tile)?.length !== 1) throw new Error("Expected the single Auth0 logo tile");
  html = html.replace(auth0Tile, "");
  if (html.includes("fetch('/stats.json'")) throw new Error("Obsolete homepage statistics remain");
  html = html
    .replaceAll("Nightly export to your bucket", "Encrypted database exports")
    .replaceAll(
      "Nightly Postgres exports to your own bucket.",
      "Encrypted Postgres exports on request.",
    )
    .replaceAll("Nightly export", "Database export")
    .replaceAll("nightly exports", "on-demand database exports");
  const badgePattern = /<span class="badge soon">[^\n]*<button class="want"[^\n]*?<\/span>/gu;
  const badges = html.match(badgePattern);
  if (badges?.length !== 2) throw new Error("Expected the two remaining roadmap interest badges");
  html = html.replace(badgePattern, "");
  html = html.replace(
    /<script>\s*\(function\(\)\{\s*document\.querySelectorAll\('\.want'\)[\s\S]*?<\/script>/u,
    "",
  );
  if (html.includes("navigator.sendBeacon('/want'"))
    throw new Error("Obsolete optimistic feature handler remains");
  // EU hosting shipped as a per-project choice on 2026-09-18, so it is no longer a roadmap vote.
  const topics = [
    ["iso27001", "ISO 27001"],
    ["soc2", "SOC 2 Type II"],
  ];
  const roadmap = `<section id="roadmap" aria-labelledby="roadmap-title"><h2 id="roadmap-title">Vote on the roadmap</h2><p class="sub">Press thumbs up or down to vote.</p><div class="roadmap-topics">${topics.map(([feature, name]) => `<div class="roadmap-topic"><span class="badge soon"><em>planned</em><b>${name}</b></span><div role="group" aria-label="Vote for ${name}"><button type="button" class="roadmap-vote" data-f="${feature}" data-vote="up" aria-label="Vote for ${name}" aria-pressed="false" disabled>👍</button><button type="button" class="roadmap-vote" data-f="${feature}" data-vote="down" aria-label="Vote against ${name}" aria-pressed="false" disabled>👎</button></div></div>`).join("")}</div><p class="roadmap-message" role="status" aria-live="polite"></p><button type="button" class="btn g" data-vote-retry hidden>Retry</button><noscript><p class="sub">Enable JavaScript to save your vote.</p></noscript></section><style>.roadmap-topics{display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-top:30px}.roadmap-topic{display:flex;align-items:center;gap:10px;border:1px solid var(--border);border-radius:14px;padding:12px}.roadmap-topic .badge{border:0;padding:0;font-size:14px}.roadmap-topic .badge b{color:var(--foreground)}.roadmap-topic .badge em{font-size:12px;color:var(--muted-foreground);border-color:var(--border-strong)}.roadmap-vote{font:inherit;font-size:18px;min-width:44px;min-height:44px;border:1px solid var(--border);border-radius:10px;background:var(--card);cursor:pointer}.roadmap-vote[aria-pressed=true]{border-color:var(--ok);background:var(--accent-soft)}.roadmap-vote:disabled{cursor:wait;opacity:.5}.roadmap-message{text-align:center;min-height:1.6em;color:var(--muted-foreground);margin-top:16px}#roadmap>[data-vote-retry]{display:block;margin:8px auto}#roadmap>[data-vote-retry][hidden]{display:none}</style>`;
  const faqStart = html.indexOf('<section id="faq">');
  const faqEnd = html.indexOf("</section>", faqStart);
  if (faqStart < 0 || faqEnd < 0) throw new Error("FAQ boundary missing for roadmap");
  html = html.slice(0, faqEnd + 10) + roadmap + html.slice(faqEnd + 10);
  const vsStart = html.indexOf('<div class="vs stag">'),
    vsEnd = html.indexOf("</section>", vsStart);
  if (vsStart < 0 || vsEnd < 0) throw new Error("Pricing comparison cards missing");
  const comparison = html.slice(vsStart, vsEnd);
  const bill = /(<p class="scen">[^\n]*<\/p>\n)((?: {6}<div class="li">[^\n]*\n)+)/gu;
  if (comparison.match(bill)?.length !== 2)
    throw new Error("Expected the two itemized pricing bills");
  const billStyle =
    '<style>.bill{margin:0}.bill>summary{display:none;list-style:none;cursor:pointer}.bill>summary::-webkit-details-marker{display:none}.bill[open] .bill-show,.bill:not([open]) .bill-hide{display:none}@media(max-width:760px){.vs .card{display:flex;flex-direction:column}.vs .card h3{order:-3}.vs .card .scen{order:-2}.vs .card .tot{order:-1;margin-top:4px;padding-top:0;border-top:0}.vs .card .fill{order:-1}.vs .card .bill{margin-top:18px;border-top:1px solid var(--border)}.vs .card .bill>summary{display:flex;justify-content:space-between;align-items:center;min-height:44px;padding:6px 0;font-size:13.5px;color:var(--muted-foreground)}.vs .card .bill>summary::after{content:"+";font-family:var(--mono);font-size:16px}.vs .card .bill[open]>summary::after{content:"\\2212"}.vs .card .src{order:1}}</style>';
  const billScript =
    "<script>(()=>{const q=matchMedia('(max-width:760px)'),bills=document.querySelectorAll('details.bill'),sync=()=>bills.forEach(b=>{b.open=!q.matches;});sync();q.addEventListener('change',sync);})()</script>";
  html =
    html.slice(0, vsStart) +
    billStyle +
    comparison.replace(
      bill,
      '$1      <details class="bill" open><summary><span class="bill-show">Show the bill</span><span class="bill-hide">Hide the bill</span></summary>\n$2      </details>\n',
    ) +
    billScript +
    html.slice(vsEnd);
  const start = html.indexOf('<section id="price">'),
    end = html.indexOf('<div class="slid up">', start);
  if (start < 0 || end < 0) throw new Error("Pricing comparison missing");
  const pricing = html.slice(start, end);
  const buttons = pricing.match(
    /<button class="btn nochev startfree" data-copy>[\s\S]*?<\/button>/gu,
  );
  if (buttons?.length !== 2) throw new Error("Expected the two original pricing actions");
  html =
    html.slice(0, start) +
    pricing.replace(/<button class="btn nochev startfree" data-copy>[\s\S]*?<\/button>/gu, "") +
    '<div class="cta up" id="pricing-cta"><button class="btn nochev primary" data-copy><svg class="ohm" viewBox="0 0 100 100" aria-hidden="true"><path d="M30 87 H14 L27 63 A31 31 0 1 1 73 63 L86 87 H70"/></svg><span>Copy prompt for your agent</span></button></div>\n' +
    html.slice(end);
  const intro = `<style>header.intro-pending #hero-cta,header.intro-pending #under{visibility:hidden}</style><script>(()=>{const header=document.querySelector('header'),art=header?.querySelector('.art > svg');if(!header||!art?.getAnimations||matchMedia('(prefers-reduced-motion: reduce)').matches)return;header.classList.add('intro-pending');try{const animations=art.getAnimations({subtree:true}).filter(a=>a.effect&&Number.isFinite(a.effect.getComputedTiming().endTime));animations.forEach(a=>a.updatePlaybackRate(1.25));Promise.allSettled(animations.map(a=>a.finished)).finally(()=>header.classList.remove('intro-pending'));}catch{header.classList.remove('intro-pending');}})();</script>`;
  return html.replace(
    "</header>",
    '<noscript><p class="under"><a href="/docs/quickstart">Read the getting-started guide for your agent →</a></p></noscript></header>' +
      intro,
  );
}

/** Search and social hardening of the approved homepage: landmark, one description, shared footer, image sizes. */
function hardenHomepageMarkup(html) {
  // The owner's approved social copy is applied earlier in preparation; hardening leaves it alone.
  for (const [before, after] of Object.entries({
    '\n<div class="wrap">\n': '\n<main class="wrap">\n',
    '<meta name="description" content="Hosting, Postgres, email and a domain for every app you build with Claude Code, Cursor, Codex or Lovable. One prompt to deploy, one balance for the services you run here — no per-project base fee. One prepaid balance instead of Vercel, Supabase and Resend subscriptions. From $10/month.">\n':
      "",
    '<span class="ghi"><img src="logos/github.svg" alt="GitHub logo" loading="lazy"':
      '<span class="ghi"><img src="logos/github.svg" alt="GitHub logo" width="16" height="16" loading="lazy"',
    '<a href="#">Docs</a>': '<a href="https://docs.ohmyho.st/">Docs</a>',
    "It includes hosting, a Postgres database and a you.ohmyho.st subdomain. Custom domains, email and database exports come with the $10 plan.":
      "It includes hosting, a Postgres database and a Dev and a Prod host, each on a generated three-word address such as humble-kiwis-find.check.omh.st, or your own domain on the $10 plan. Encrypted SQL exports are on every plan; linking your own domain and sending mail use credits.",
    "<li>you.ohmyho.st</li>": "<li>A host like humble-kiwis-find.check.omh.st</li>",
    "Worked example: six quiet projects plus one with real users ≈ 600 credits a month. Ten dollars covers it.":
      "Worked example: a small app with a database, some traffic and 2,000 mail recipients ≈ 552 credits a month. Ten dollars covers it.",
    "When usage reaches it, ohmyho.st stops the project before it costs more; the site stays up and read-only.":
      "When usage reaches it, ohmyho.st stops new spending on the project before it costs more.",
    "There is no web console to learn.":
      "The portal shows your projects, credits, budgets and API tokens; there is no deploy console to learn.",
    '<a href="/docs/quickstart">Read the getting-started guide for your agent →</a>':
      '<a href="https://docs.ohmyho.st/quickstart">Read the getting-started guide for your agent →</a>',
    ".fcol h4{": ".fcol h4,.fcol .fh{",
  })) {
    if (!html.includes(before))
      throw new Error(`Homepage hardening boundary missing: ${before.slice(0, 65)}`);
    html = html.replaceAll(before, after);
  }
  const columnsStart = html.indexOf('    <div class="fcol">');
  const columnsEnd = html.indexOf('  <div class="fbot">');
  if (columnsStart < 0 || columnsEnd < columnsStart) throw new Error("Footer columns missing");
  html = html.slice(0, columnsStart) + `    ${footerColumnsHtml()}\n` + html.slice(columnsEnd);
  html = externalLinkRel(
    html.replaceAll(
      /<img src="logos\/([a-z0-9]+)\.svg" alt="([^"]+)" loading="lazy"/gu,
      '<img src="logos/$1.svg" alt="$2" width="18" height="18" loading="lazy"',
    ),
  );
  if (html.includes('href="#"')) throw new Error("Homepage placeholder link remains");
  return html;
}

/** Slugs of the committed 1200×630 social cards; a page without one falls back to the site image. */
async function renderedOgSlugs() {
  const manifest = `${directory}public/og/manifest.json`;
  if (!existsSync(manifest)) return [];
  return Object.keys(JSON.parse(await readFile(manifest, "utf8"))).sort();
}
