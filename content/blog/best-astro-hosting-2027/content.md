# Best Astro Hosting for 2027: Static and SSR Compared

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · October 17, 2026

The best Astro hosting depends on your rendering mode and deployment workflow. Choose ohmyho.st for deployments operated by your coding agent, Cloudflare Workers for direct control of the Workers runtime, Vercel for a Git-connected workflow with Vercel Functions, or Netlify for its site platform and Astro integration. All belong on a shortlist for static sites; SSR requires a compatible adapter and runtime.

We build ohmyho.st. We also migrated our own publication, [Seb Builds](https://sebmer.com), from Next.js to Astro and run it in production on ohmyho.st. This comparison draws on that migration and the providers' official documentation. It was published in October 2026 and updated on October 18, 2026, as a buying guide for 2027. We have not benchmarked the same application across these providers.

## Best Astro hosting: recommendations at a glance

| Host | Static sites | Astro SSR runtime | Choose it when |
| --- | --- | --- | --- |
| [ohmyho.st](/frameworks/astro) | Static assets | Cloudflare Workers, using `@astrojs/cloudflare` | Your coding agent should deploy to Dev, inspect the result and publish the verified artifact to Prod |
| [Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/) | Workers Static Assets | Cloudflare Workers, using `@astrojs/cloudflare` | You want to manage Wrangler configuration, bindings and Cloudflare resources directly |
| [Vercel](https://vercel.com/docs/frameworks/frontend/astro) | Static delivery | Vercel Functions, using `@astrojs/vercel` | Your team already publishes through Vercel and needs its deployment or image services |
| [Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/astro/) | Static delivery | Netlify Functions, using `@astrojs/netlify` | Your site needs Netlify's Astro integration, Image CDN or publishing workflow |

The table compares deployment choices, rather than awarding an overall speed score. For a portfolio, the editing and publication workflow may decide the winner. For a personalized application, runtime compatibility and data access matter more.

## Static Astro hosting vs Astro SSR hosting

**Static Astro hosting** serves HTML generated during `astro build`. It suits a blog, documentation, portfolio or marketing site whose public content changes when you publish. Astro's default build directory is `dist`. A React component can still become interactive in the browser without making the whole page server-rendered. See [Astro's deployment guide](https://docs.astro.build/en/guides/deploy/) for the standard build setup.

**Astro SSR hosting** runs server code when a request arrives. Use it for pages that depend on the visitor, request parameters or data that must be fresh at request time. An adapter prepares those server routes for the host. A dependency working in your local Node build does not prove it will work in a Workers runtime or a deployed function.

Choose the mode per route, rather than turning a publication into a dynamic application unnecessarily. A product catalog could prerender its public descriptions while rendering an account page on demand. Your shortlist should support the dynamic routes you actually need, with a clear approach to authentication, caching and private data.

## ohmyho.st: Astro hosting operated by your coding agent

Choose ohmyho.st when Claude Code, Cursor or Codex already works on your repository and should also operate its hosting. The agent uses the CLI or MCP tools to inspect the project, prepare a deployment plan and deploy the selected source version to Dev. After you review the result, it publishes that verified artifact to Prod. No Dockerfile is required for the supported Astro configuration.

Static output and Cloudflare Workers SSR are supported. SSR uses the official Cloudflare adapter; this is a managed deployment workflow on Workers. The current integration does not accept native KV sessions, provider cache, Cloudflare Images or additional customer-defined Cloudflare bindings. A project that needs those Cloudflare resources directly is a stronger candidate for managing Workers itself.

Our production example, [sebmer.com](https://sebmer.com), is a content site with essays, project pages, feeds and machine-readable content. Its migration preserved the existing public URL structure and editorial design. We also deployed a separate Astro SSR case with request-dependent pages, middleware, an API endpoint, a prerendered page and an interactive React island. These are concrete compatibility examples, rather than a claim that every Astro application has been tested.

Use the [Astro deployment guide](https://docs.ohmyho.st/frameworks/astro) for the supported configuration and the [Astro hosting page](/frameworks/astro) to start a deployment.

## Cloudflare Workers: direct control of Astro at the edge

Choose Cloudflare Workers when you want to own the provider configuration and use Cloudflare resources directly. Its [Astro deployment guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/) covers both static output and on-demand rendering. Static sites can deploy their built assets; SSR uses `@astrojs/cloudflare` and a Worker.

The useful difference from ohmyho.st is direct control of the surrounding Cloudflare setup. Your team manages Wrangler, resource bindings and runtime configuration. That is a good fit if those resources are part of the application's architecture and you are comfortable maintaining them.

The [Cloudflare adapter documentation](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) describes integrations such as KV-backed Astro sessions. Those capabilities have their own configuration and behavior. They are not automatically interchangeable with the integrations of a managed host that also runs on Workers.

For a static blog, direct Workers deployment can be a small operational setup. For SSR, include the server dependencies and required bindings in your deployment decision. Choose direct Cloudflare hosting for the control it gives you, and account for the configuration work that comes with it.

## Vercel: Astro with Vercel Functions and image services

Choose Vercel when its deployment workflow already fits your team or your Astro application needs its platform services. Astro's [Vercel adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/) prepares on-demand routes for Vercel and provides options for image optimization, caching and function behavior. A purely static site does not need the adapter unless it uses additional Vercel services.

For SSR, the relevant questions are which server dependencies you use and how your routes should cache. The adapter offers incremental static regeneration for eligible routes. A personalized response and a public cached page need different treatment; choose caching behavior deliberately rather than enabling it across the application.

Existing Vercel teams may prefer keeping their Astro site beside their other projects. A new team should include plan eligibility and collaboration costs in the decision. Vercel states that [Hobby is for personal, non-commercial use](https://vercel.com/docs/plans/hobby), so a commercial website needs a suitable plan. The availability of a starter plan alone does not establish the production cost of your site.

## Netlify: Astro with integrated images and publishing

Choose Netlify when its site platform fits your content workflow or your project needs its Astro integrations. The official [Astro on Netlify guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/astro/) explains how the adapter connects Astro to Netlify Image CDN and how on-demand rendering runs on Netlify Functions. Static sites can deploy without the adapter when they do not need those services.

That makes the adapter decision more specific than “does Netlify support Astro?” A publication with image-heavy articles may want the image integration even when its pages are prerendered. An application rendering visitor-specific content needs the server path as well.

Middleware placement also matters. Astro's [Netlify adapter guide](https://docs.astro.build/en/guides/integrations-guide/netlify/) distinguishes middleware applied while prerendering from middleware that runs at request time. Its edge mode is relevant when redirects, access control or headers must apply to prerendered pages on incoming requests. Match that behavior to the application before choosing a deployment configuration.

## Compare Astro hosting costs by workload

A static publication and an SSR application use different resources. Estimate how often you publish, how much content visitors download and how many requests run server code. Add the database, storage or mail service only when your application needs it. Then compare the resulting workload against each provider's current plan.

| Host | Cost model to evaluate | Main question for an Astro site |
| --- | --- | --- |
| [ohmyho.st pricing](/pricing) | A workspace credit balance with measured builds and runtime usage; other enabled services have their own meters | How much will builds, dynamic requests and any additional services consume? |
| [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) | Workers plans meter dynamic requests and CPU time; static asset delivery has separate treatment | Which routes invoke the Worker, and which are served as static assets? |
| [Vercel pricing](https://vercel.com/pricing) | Plan eligibility, collaboration and usage across the services you enable | Is this a commercial site, and will it use functions or image optimization? |
| [Netlify pricing](https://www.netlify.com/pricing/) | Current credit plans meter production deploys, compute, bandwidth and web requests | How do publishing frequency, asset delivery and dynamic routes contribute? |

For ohmyho.st, Free starts with {{ number plan.freeCredits }} credits and Paid costs {{ usd plan.paidUsd }} a month before tax and grants {{ number plan.paidCredits }} monthly credits. Usage consumes that balance; additional credits cost extra. The [itemized pricing breakdown](/pricing/breakdown) explains the calculation. Provider prices and plan rules can change before 2027, so use the linked rate cards when making a purchase.

## Moving an existing website to Astro

Preserve what search engines and readers already use: public URLs, canonical tags, titles, descriptions, feeds and redirects. Export the route list from the existing site and compare it with the Astro deployment. A framework migration should not silently change the address of a successful article or return a home page for an unknown URL.

Our Seb Builds migration used static output because the publication did not need request-time rendering. We checked its content routes, feeds, metadata, assets and browser interactions before publishing the tested Dev artifact to Prod. That experience supports our recommendation for this kind of publication; it does not make static output the right choice for an account portal or live inventory page.

For an SSR migration, exercise a route with different request inputs and confirm that the response changes. Test an actual login or form flow where your application has one. Keep a known working deployment available while changing the domain. The host should make this review and publication process clear to the person or agent operating it.

## FAQ

### What is the best hosting for Astro?

Choose ohmyho.st for a static or supported Workers SSR site that your coding agent should deploy and operate. Choose Cloudflare Workers when you need direct management of Cloudflare resources, Vercel when its Functions and team workflow fit, or Netlify when its publishing and image integrations fit. Start with the rendering mode and required services, then compare costs for that workload.

### Can I host an Astro site on Cloudflare?

Yes. Cloudflare Workers supports static Astro sites and SSR through the official Cloudflare adapter. You can manage that setup directly with Cloudflare's tooling, or use ohmyho.st's supported Astro deployment workflow on Workers. The managed integration has an explicit configuration boundary; needing arbitrary Cloudflare bindings changes which option is appropriate.

### Does Astro need SSR hosting for React components?

No. A React island can hydrate in the browser on a statically generated Astro page. Choose SSR because a route needs request-time server behavior, rather than because the page contains an interactive component. Include the island's actual browser interaction in the deployment review.

### Can an Astro site use a custom domain?

Yes. For ohmyho.st, connect a customer-owned domain to an active Prod deployment. Free workspaces must keep the ohmyho.st flag enabled while using that domain, or upgrade before switching it off. Domain registration is separate. The [domain guide](https://docs.ohmyho.st/domains) explains the setup and the [pricing page](/pricing) explains the conditions.

### Which host should I try first?

For a publication or supported SSR site built with a coding agent, start with [Astro hosting on ohmyho.st](/frameworks/astro). Deploy to Dev, review the real site and publish the verified version. If your application requires provider-specific resources outside that integration, start with the corresponding provider's adapter and deployment guide instead.
