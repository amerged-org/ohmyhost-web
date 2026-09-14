import { format } from "prettier";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath, URL } from "node:url";
import TurndownService from "turndown";

const directory = fileURLToPath(new URL("../", import.meta.url));
const root = fileURLToPath(new URL("../../", new URL("../", import.meta.url)));
const output = `${directory}public/pages`;
const brandAssets = `${root}brand/assets`;
await mkdir(output, { recursive: true });
await Promise.all(["api.html", "api.md"].map((file) => rm(`${output}/${file}`, { force: true })));
const markdown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
markdown.remove(["script", "style", "svg", "head", "button", "input"]);
const templates = {
  home: "39e356828872241b0eb53293b8b1d1a19c82a7a9200d4ee195bf6f81a72bb9ca",
  brand: "d2a49d8a4b9d979c72958eebb2f2db4b7637405ccacd27100ce77e405a01bebe",
};
const fontCss = await readFile(`${directory}site/fonts.css`, "utf8");
const privacyUi = `${await readFile(`${directory}site/privacy-ui.html`, "utf8")}<script>${await readFile(`${directory}site/privacy-ui.js`, "utf8")}</script>`;
const approvedHome = await readFile(`${directory}site/home.html`, "utf8");
const sharedCss = approvedHome.match(/<style>([\s\S]*?)<\/style>/u)?.[1];
if (!sharedCss) throw new Error("The approved design stylesheet is missing");
await writeFile(
  `${directory}src/generated-site-frame.ts`,
  await format(
    "// Generated from the approved template and beta entry assets.\n" +
      `export const SITE_CSS = ${JSON.stringify(fontCss + sharedCss)};\n` +
      `export const SITE_ICON = ${JSON.stringify(await readFile(`${brandAssets}/favicon.svg`, "utf8"))};\n` +
      `export const PRIVACY_UI = ${JSON.stringify(privacyUi)};\n` +
      `export const BETA_MODAL = ${JSON.stringify(await readFile(`${directory}site/beta-modal.html`, "utf8"))};\n` +
      `export const BETA_SCRIPT = ${JSON.stringify(await readFile(`${directory}site/beta-entry.js`, "utf8"))};\n`,
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
      `<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="alternate icon" href="/favicon.ico"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><style>${fontCss}</style></head>`,
    );
  if (name === "home") {
    html = applyApprovedHomepageChanges(html);
    const destinations = {
      Docs: "https://docs.ohmyho.st/",
      "MCP server": "https://docs.ohmyho.st/agents/mcp",
      CLI: "https://docs.ohmyho.st/cli",
      Status: "/status",
      Changelog: "/changelog",
      About: "/about",
      Philosophy: "/#philosophy",
      Blog: "/blog",
      "Open source": "https://github.com/amerged/docs",
      Privacy: "/privacy",
      Terms: "/terms",
      GDPR: "/privacy",
      Imprint: "/privacy",
    };
    for (const [label, href] of Object.entries(destinations))
      html = html.replaceAll(
        `<a href="#">${label}</a>`,
        label === "Imprint" ? "" : `<a href="${href}">${label}</a>`,
      );
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
      "Read https://ohmyho.st/llms.txt and the ohmyhost-get-started Skill. Connect this agent, sign in with my invitation and deploy this GitHub project using only the capabilities it needs. Follow the deployment Skill and verify the app.",
    );
    html = html.replace(
      "</body>",
      `${await readFile(`${directory}site/beta-modal.html`, "utf8")}<script>${await readFile(`${directory}site/beta-entry.js`, "utf8")}</script></body>`,
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
        "<style>.side,.main{min-width:0}.shell{grid-template-columns:236px minmax(0,1fr)}@media(max-width:900px){.shell{grid-template-columns:minmax(0,1fr)}.side{padding:20px}.side .tag{margin-bottom:14px}.brand-toc{display:flex;gap:18px;overflow-x:auto;white-space:nowrap;padding-bottom:8px}.brand-toc h5{display:none}.brand-toc a{flex:none}.side .mark{margin-right:48px}}</style></head>",
      );
  }
  html = html
    .replaceAll('href="/docs/mcp"', 'href="https://docs.ohmyho.st/agents/mcp"')
    .replaceAll('href="/docs/cli"', 'href="https://docs.ohmyho.st/cli"')
    .replaceAll('href="/docs"', 'href="https://docs.ohmyho.st/"');
  html = html.replace("</body>", `${privacyUi}</body>`);
  if (name === "home")
    html = html.replace(
      '<a href="/privacy">Privacy</a>',
      '<a href="/privacy">Privacy</a><a href="/cookies">Cookies</a><a href="/dpa">DPA</a><a href="/dpa/toms">TOMs</a><a href="/contact">Contact</a>',
    );
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
if (!version || !/^\d+\.\d+\.\d+-beta\.\d+$/u.test(version))
  throw new Error("The public client release is invalid");
await writeFile(
  `${output}/0.sh`,
  (await readFile(`${directory}site/0.sh`, "utf8")).replace("@CLIENT_RELEASE@", version),
);
const contractPath = `${directory}public/releases/${version}/openapi.json`;
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
  const exportAnswer =
    "Request a portable SQL dump in a password-encrypted ZIP through your agent, CLI or API. Exports run asynchronously, with one accepted request per project every 24 hours and a signed download link valid for 24 hours. Keep your password and restore on another Postgres host, or let your automation tool copy the encrypted file to your own storage.";
  const euAnswer =
    "Not yet. New projects use US hosting, with application compute and Postgres placed together. An EU hosting option is on the roadmap. Vote below to help us prioritize it.";
  for (const [before, after] of Object.entries({
    'class="cta hero-a" id="hero-cta" style="animation-delay:2.4s"': 'class="cta" id="hero-cta"',
    'class="under hero-a" style="animation-delay:2.55s" id="under"': 'class="under" id="under"',
    '  <p class="proof" id="proof" hidden></p>': "",
    "Hosting, Postgres, email, a domain, AI and backups in one command. An alternative to Vercel, Supabase and Resend — $10 a month for every project you build, not per project.":
      "Hosting, Postgres, domains, email and encrypted SQL exports. Deploy GitHub apps with your agent and share credits across projects.",
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
    '"addressLocality": "Palo Alto"': '"addressLocality": "Venray"',
    '"addressRegion": "CA"': '"addressRegion": "Limburg"',
    '"addressCountry": "US"': '"addressCountry": "NL"',
    "From Amsterdam, Netherlands to Palo Alto, CA, US — deploy with ohmyho.st":
      "Amerged B.V. · Venray, Limburg, NL",
    '<span class="avatar" aria-hidden="true"></span>':
      '<img src="/brand/assets/founder.png" width="96" height="96" loading="lazy" alt="Founder of ohmyho.st" style="border-radius:50%;flex:0 0 96px;object-fit:cover">',
  })) {
    if (!html.includes(before))
      throw new Error(`Approved homepage boundary missing: ${before.slice(0, 65)}`);
    html = html.replaceAll(before, after);
  }
  html = html.replace(
    / {2}\/\* proof: a real number or nothing \*\/[\s\S]*?\n {2}\}\)\.catch\(function\(\)\{\}\);/u,
    "",
  );
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
  if (badges?.length !== 3) throw new Error("Expected the three roadmap interest badges");
  html = html.replace(badgePattern, "");
  html = html.replace(
    /<script>\s*\(function\(\)\{\s*document\.querySelectorAll\('\.want'\)[\s\S]*?<\/script>/u,
    "",
  );
  if (html.includes("navigator.sendBeacon('/want'"))
    throw new Error("Obsolete optimistic feature handler remains");
  const topics = [
    ["eu", "Hosting in the EU"],
    ["iso27001", "ISO 27001"],
    ["soc2", "SOC 2 Type II"],
  ];
  const roadmap = `<section id="roadmap" aria-labelledby="roadmap-title"><h2 id="roadmap-title">Vote on the roadmap</h2><p class="sub">Press thumbs up or down to vote.</p><div class="roadmap-topics">${topics.map(([feature, name]) => `<div class="roadmap-topic"><span class="badge soon"><em>planned</em><b>${name}</b></span><div role="group" aria-label="Vote for ${name}"><button type="button" class="roadmap-vote" data-f="${feature}" data-vote="up" aria-label="Vote for ${name}" aria-pressed="false" disabled>👍</button><button type="button" class="roadmap-vote" data-f="${feature}" data-vote="down" aria-label="Vote against ${name}" aria-pressed="false" disabled>👎</button></div></div>`).join("")}</div><p class="roadmap-message" role="status" aria-live="polite"></p><button type="button" class="btn g" data-vote-retry hidden>Retry</button><noscript><p class="sub">Enable JavaScript to save your vote.</p></noscript></section><style>.roadmap-topics{display:flex;justify-content:center;gap:16px;flex-wrap:wrap;margin-top:30px}.roadmap-topic{display:flex;align-items:center;gap:10px;border:1px solid var(--border);border-radius:14px;padding:12px}.roadmap-topic .badge{border:0;padding:0}.roadmap-vote{font:inherit;font-size:18px;min-width:44px;min-height:44px;border:1px solid var(--border);border-radius:10px;background:var(--card);cursor:pointer}.roadmap-vote[aria-pressed=true]{border-color:var(--ok);background:var(--accent-soft)}.roadmap-vote:disabled{cursor:wait;opacity:.5}.roadmap-message{text-align:center;min-height:1.6em;color:var(--muted-foreground);margin-top:16px}#roadmap>[data-vote-retry]{display:block;margin:8px auto}#roadmap>[data-vote-retry][hidden]{display:none}</style>`;
  const faqStart = html.indexOf('<section id="faq">');
  const faqEnd = html.indexOf("</section>", faqStart);
  if (faqStart < 0 || faqEnd < 0) throw new Error("FAQ boundary missing for roadmap");
  html = html.slice(0, faqEnd + 10) + roadmap + html.slice(faqEnd + 10);
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
