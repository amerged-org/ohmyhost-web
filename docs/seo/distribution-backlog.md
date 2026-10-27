# ohmyho.st distribution backlog

Owner: Sebastian Mertens / amerged.
Status: deferred. No listings, outreach, purchases or submissions are authorized by this backlog alone.

## Release history and prerequisites

The on-page SEO release was first interrupted on 2026-10-27 by an `insufficient credits` response. That was a Hermes authentication misclassification, not an account problem: the key's `sk-ant-usr-` prefix was treated as an OAuth token. A process-local correction fixed it, the work resumed, and no credits were needed. Nothing in this backlog depends on that incident any more.

The release, evidence and registry receipt are in `docs/seo/2026-10-27-onpage-release-plan.md`. Do not treat anything below as done because the release shipped.

Official MCP Registry update (requested work, not a later listing): `io.github.amerged-org/ohmyhost-mcp` version 0.1.39 was published on 2026-10-27 and read back with `isLatest: true`, matching npm `latest`. Receipt: https://registry.modelcontextprotocol.io/v0.1/servers/io.github.amerged-org%2Fohmyhost-mcp/versions/0.1.39

## Later tasks

### Free-for-dev

- [ ] Sebastian writes and submits a human-written PaaS entry after checking current contribution rules.
- URL: https://github.com/ripienaar/free-for-dev
- Fit: recurring free hosting tier, not merely a free trial.
- Requirements: accurately describe current free allowance, public pricing, contact and privacy information.
- Important: this project rejects AI-written submissions. Do not generate or submit the entry on Sebastian's behalf.
- Treat as relevant developer discovery, not a guaranteed followed link or ranking improvement.

### Awesome MCP servers

- [ ] Propose the public, installable MCP server in the appropriate Cloud Platforms section.
- URL: https://github.com/punkpeye/awesome-mcp-servers
- Rules: https://github.com/punkpeye/awesome-mcp-servers/blob/main/CONTRIBUTING.md
- Requirements: factual description, public server repository, current install path, maintainer approval.
- This list links to the server repository rather than necessarily to the product website.

### Official MCP Registry: existing identity maintenance

- [x] Version update under the existing identity: done 2026-10-27, `0.1.39` read back as latest (see above). Not a new listing.
- [ ] Later maintenance: after every npm release of `@amerged/ohmyhost-mcp`, publish the same version under the same identity so the registry never trails npm (it trailed by one version, 0.1.38 against 0.1.39, before this update). Keep `server.json` in the public repo aligned.
- Docs: https://github.com/modelcontextprotocol/registry/tree/main/docs
- Existing identity: `io.github.amerged-org/ohmyhost-mcp`.
- Package: `@amerged/ohmyhost-mcp`.
- Never downgrade or create a duplicate identity.
- Do not add a remote endpoint until its authentication flow has been verified and its publication is within scope.
- Registry metadata is distribution, not a conventional SEO backlink.

### Glama connectors

- [ ] Verify the remote MCP OAuth flow end to end, then consider a connector listing.
- URL: https://glama.ai/mcp/connectors
- Existing server page: https://glama.ai/mcp/servers/amerged-org/ohmyhost-mcp
- Prior research: server listing exists, remote connector not found. Recheck before adding anything.
- Existing server website links were `ugc nofollow`.
- Requirements: working supported endpoint, correct authentication and owner approval. Never expose tokens.

### AlternativeTo

- [ ] Submit or claim the product through the user menu's “Suggest new application”, after checking for an existing entry.
- URL: https://alternativeto.net/faq/
- Fit: genuinely relevant Vercel, Supabase or Railway alternative intent.
- Requirements: account, accurate licensing/pricing, product screenshots and truthful feature comparison.
- Free review queue may be slow; acceptance is editorial. Website links are normally nofollow. Paid priority review does not guarantee acceptance or a followed link.

### Product Hunt

- [ ] Prepare a founder-led launch with a clear working demonstration.
- URL: https://www.producthunt.com/launch
- Requirements: personal account with onboarding complete, screenshots/GIF, accurate tagline, pricing/free-tier explanation, maker availability to answer questions.
- Free submission. Treat as distribution and possible downstream coverage, not guaranteed ranking credit.

### Show HN

- [ ] Launch a genuinely tryable product experience when the founder can respond.
- Submit: https://news.ycombinator.com/submit
- Guidelines: https://news.ycombinator.com/showhn.html
- Requirements: useful low-friction demo, technical explanation, transparent limitations and founder availability.
- Do not submit only a marketing landing page, solicit votes, coordinate comments or spam discussions.

### Astro community resources

- [ ] Maintain a credible first-hand Astro deployment guide, then propose a relevant community-resource link or discussion.
- Our guide: https://ohmyho.st/frameworks/astro (live Astro site: https://sebmer.com, public source on the `ohmyhost-poc-astro` branch of `sebmer-com/sebbuilds`).
- Rules: https://contribute.docs.astro.build/guides/new-third-party-guide/
- Deployment docs: https://docs.astro.build/en/guides/deploy/
- Requirements: tested current Astro support, clear example, working live URL, technical accuracy and editorial acceptance.
- A dedicated official deploy guide is not guaranteed for a new host.

## Link policy

Prioritize useful first-hand guides, public examples and honest customer case studies that can earn voluntary editorial references. No purchased followed links, bulk directory packages, fake reviews or link-exchange schemes. Incentivized “Powered by” links must remain appropriately qualified, such as `rel="sponsored"`.

Google policy: https://developers.google.com/search/docs/essentials/spam-policies#link-spam
Outbound-link qualification: https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links

Supporting research: `/Users/sebastianmertens/.hermes/cache/scratch/omh-opus-seo-followup/opportunities.json`.
