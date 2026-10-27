# Best Astro Hosting for 2027: Static and SSR Compared

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · October 17, 2026

The best Astro hosting depends on what your website does and how you want to publish it. A blog can serve pages built ahead of time. An account page may need to run code whenever someone opens it. Ask your Agent to check which of those your project needs before choosing a host.

ohmyho.st suits a workflow where your Agent handles deployments. Cloudflare Workers gives you direct control of its runtime and resources. Vercel and Netlify are worth considering if you already use their publishing tools or need their platform services. All support static Astro sites. Server rendering needs the right adapter and a compatible runtime.

We build ohmyho.st. We also moved our own publication, [Seb Builds](https://sebmer.com), from Next.js to Astro and run it in production on ohmyho.st. This comparison uses that migration and the providers' official documentation. It was published in October 2026 as a buying guide for 2027. We have not benchmarked the same application across these providers.

## Start with what your site needs

| Host | Static sites | Astro SSR runtime | Choose it when |
| --- | --- | --- | --- |
| [ohmyho.st](/frameworks/astro) | Static assets | Cloudflare Workers, using `@astrojs/cloudflare` | Your coding agent should deploy to Dev, inspect the result and publish the verified artifact to Prod |
| [Cloudflare Workers](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/) | Workers Static Assets | Cloudflare Workers, using `@astrojs/cloudflare` | You want to manage Wrangler configuration, bindings and Cloudflare resources directly |
| [Vercel](https://vercel.com/docs/frameworks/frontend/astro) | Static delivery | Vercel Functions, using `@astrojs/vercel` | Your team already publishes through Vercel and needs its deployment or image services |
| [Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/astro/) | Static delivery | Netlify Functions, using `@astrojs/netlify` | Your site needs Netlify's Astro integration, Image CDN or publishing workflow |

For a portfolio, you may care most about how easily you can review and publish an update. For an application with private accounts, check how its server code, login and database connection will work. A host supporting Astro does not tell you whether every dependency in your project will run there.

Give your Agent the repository and ask it to explain the choice using your actual pages.

To sort your routes into static and server-rendered pages, ask:

```text
Check my Astro project and explain which routes can be built as static pages and which need server rendering. Identify the adapter, server dependencies and external services each hosting option would need. Recommend a setup using examples from my project.
```

## Static pages or server rendering

**Static Astro hosting** serves HTML generated during `astro build`. This works well for a blog, documentation, portfolio or marketing site where public content changes when you publish. Astro's default build directory is `dist`. A React component can still be interactive in the browser on a static page. See [Astro's deployment guide](https://docs.astro.build/en/guides/deploy/) for the build setup.

**Astro SSR hosting** runs server code when a request arrives. You may need this when a page depends on the visitor, request parameters or data that must be fresh when someone opens it. An adapter prepares those routes for the host. Code working in a local Node build still needs checking in the deployed Workers runtime or function.

You can make this decision per route. A product catalog could build its public descriptions ahead of time and render its account page on demand. Ask your Agent which pages really need server code, how they access private data and what should be cached. Then open those pages yourself and check that the proposed behavior matches what you expect.

## ohmyho.st: deploy with your Agent

Choose ohmyho.st when Claude Code, Cursor or Codex already works on your repository and you want your Agent to handle hosting too. It can use the CLI or MCP tools to inspect the project, prepare a deployment plan and deploy the selected source version to Dev. You review that deployment before it publishes the verified artifact to Prod. The supported Astro configuration does not require a Dockerfile.

Both static output and Cloudflare Workers SSR are supported. SSR uses the official Cloudflare adapter. Check the integration's limits before choosing it: the current setup does not accept native KV sessions, provider cache, Cloudflare Images or additional customer-defined Cloudflare bindings. If your application relies on those resources, managing Workers directly may fit better.

Our production example, [sebmer.com](https://sebmer.com), has essays, project pages, feeds and machine-readable content. The migration kept its public URLs and editorial design. We also deployed a separate Astro SSR case with request-dependent pages, middleware, an API endpoint, a prerendered page and an interactive React island. Those examples show what we checked; your application still needs its own review.

Give your Agent the [Astro deployment guide](https://docs.ohmyho.st/frameworks/astro) to check the supported configuration. The [Astro hosting page](/frameworks/astro) explains how to start.

## Cloudflare Workers: manage the setup

Choose Cloudflare Workers when you want direct control of the provider configuration and Cloudflare resources. Its [Astro deployment guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/astro/) covers static output and on-demand rendering. Static sites can deploy their built assets; SSR uses `@astrojs/cloudflare` and a Worker.

You or your Agent will manage Wrangler, resource bindings and runtime configuration. This makes sense when those resources are part of your application and you want to maintain them directly. For a static blog, the setup can be small. An SSR application needs a closer check of its server dependencies and bindings.

The [Cloudflare adapter documentation](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) covers integrations such as KV-backed Astro sessions. Ask your Agent to check the configuration for each integration your project uses. A managed host may also run on Workers without exposing all the same resources, so check support at the host level too.

## Vercel: functions and image services

Choose Vercel when its deployment workflow already fits your team or your Astro application needs its services. Astro's [Vercel adapter](https://docs.astro.build/en/guides/integrations-guide/vercel/) prepares on-demand routes for Vercel and offers image optimization, caching and function settings. A purely static site does not need the adapter unless it uses additional Vercel services.

For SSR, ask your Agent to check server dependencies and explain how each route should cache. The adapter offers incremental static regeneration for eligible routes. A public article and a page showing someone's account details need different treatment. Review that choice before deployment, especially anywhere the response contains private information.

If your team already uses Vercel, keeping the Astro site alongside its other projects may be convenient. Include plan eligibility and collaboration costs when deciding. Vercel states that [Hobby is for personal, non-commercial use](https://vercel.com/docs/plans/hobby), so a commercial website needs a suitable plan. Check the services your site will use before estimating its production cost.

## Netlify: images and publishing

Choose Netlify when its site platform fits how you publish content or your project needs its Astro integrations. The official [Astro on Netlify guide](https://docs.netlify.com/build/frameworks/framework-setup-guides/astro/) explains how the adapter connects Astro to Netlify Image CDN and runs on-demand rendering on Netlify Functions. Static sites can deploy without the adapter when they do not need those services.

A publication with image-heavy articles may want the image integration even if its pages are built ahead of time. A site showing visitor-specific content also needs server rendering. Ask your Agent to name the feature that requires the adapter so you understand what you are adding.

Ask your Agent to check middleware too. Astro's [Netlify adapter guide](https://docs.astro.build/en/guides/integrations-guide/netlify/) explains the difference between middleware applied during prerendering and middleware run when a request arrives. Its edge mode matters when redirects, access control or headers must apply to prerendered pages on incoming requests. Your Agent should test those requests on the deployed site and explain any difference from the local preview. The review prompt below includes that check.

## Estimate the running cost

Start with how your site will be used. How often will you publish? How much content will visitors download? Which requests run server code? Include a database, file storage or mail service if the application needs one. Your Agent can turn those answers into a workload estimate and compare it with the providers' current plans.

| Host | Cost model to evaluate | Main question for an Astro site |
| --- | --- | --- |
| [ohmyho.st pricing](/pricing) | A workspace credit balance with measured builds and runtime usage; other enabled services have their own meters | How much will builds, dynamic requests and any additional services consume? |
| [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/) | Workers plans meter dynamic requests and CPU time; static asset delivery has separate treatment | Which routes invoke the Worker, and which are served as static assets? |
| [Vercel pricing](https://vercel.com/pricing) | Plan eligibility, collaboration and usage across the services you enable | Is this a commercial site, and will it use functions or image optimization? |
| [Netlify pricing](https://www.netlify.com/pricing/) | Current credit plans meter production deploys, compute, bandwidth and web requests | How do publishing frequency, asset delivery and dynamic routes contribute? |

For ohmyho.st, Free starts with {{ number plan.freeCredits }} credits and Paid costs {{ usd plan.paidUsd }} a month before tax and grants {{ number plan.paidCredits }} monthly credits. Usage consumes that balance; additional credits cost extra. The [itemized pricing breakdown](/pricing/breakdown) explains the calculation. Provider prices and plan rules can change before 2027, so check the linked rate cards when making a purchase.

Ask for the assumptions behind an estimate. A site published occasionally will have different build usage from a publication updated throughout the day. An account page that runs server code also uses different resources from an article served as a static asset. Keep those differences visible when comparing plans.

## Connect Sanity or Payload

An Astro frontend can read content from a headless CMS such as Sanity or Payload. It can fetch that content during the build, while rendering a server response or from a browser component. If content is fetched at build time, publishing a change in the CMS needs a new deployment before readers see it. Server-rendered content needs a compatible runtime and access to the CMS API.

Include the CMS backend, media storage and publishing triggers in your hosting decision. If you self-host Payload, its server runtime and database need their own setup alongside the Astro frontend. Keep private API credentials out of browser code. Astro's [Sanity guide](https://docs.astro.build/en/guides/cms/sanity/) and [Payload guide](https://docs.astro.build/en/guides/cms/payload/) explain the connections.

After your Agent connects the CMS, make a small content edit and follow it through to the preview site. Check the text, images and links yourself. This tells you whether the publishing workflow works as expected, including any deployment that needs to happen after the edit.

## Review a real deployment

A successful build is the start of your review. Ask your Agent to test the deployed site and give you links to named example pages from your project. It should check how server-rendered pages respond to different requests and whether middleware behaves as intended. You can then open an article, sign in to an account page and submit a test form where those features exist.

To get a preview you can review, use this prompt:

```text
Deploy this Astro project to preview or Dev. Test static pages, images and interactive components. Vary requests to server-rendered routes and check middleware redirects, access control and headers. Test existing login and form flows. Report failures and give me named example-page links with a short checklist: open the article, sign in and submit a test form.
```

Read the results and open the site yourself. Your Agent can check routes and report errors; you can judge whether the content, layout and interactions are what you intended. Keep a known working deployment available while changing the domain.

## Move an existing site to Astro

When moving from WordPress or Next.js, keep the public URLs, canonical tags, titles, descriptions, feeds and redirects that readers and search engines already use. Ask your Agent to export the old route list and compare it with the Astro deployment. Check that a missing page returns the expected error instead of quietly showing the home page.

Our Seb Builds migration used static output because the publication did not need request-time rendering. We checked content routes, feeds, metadata, assets and browser interactions before publishing the tested Dev artifact to Prod. An account portal or a live inventory page may need a different setup. Use your site's behavior to make that choice.

Before switching traffic, ask your Agent to compare the two versions:

```text
Compare the existing website with this Astro preview. Check public URLs, redirects, missing pages, canonical tags, titles, descriptions, feeds and assets. Report anything that changed unexpectedly. Give me representative pages to review and keep the current production deployment available until I approve the move.
```

## Common questions

### What is the best hosting for Astro?

Choose ohmyho.st for a static or supported Workers SSR site that your Agent should deploy and operate. Cloudflare Workers fits direct management of Cloudflare resources. Vercel may suit your team's Functions and deployment workflow, while Netlify may suit its publishing and image needs. Check rendering mode and required services first, then compare costs for that workload.

### Can I host an Astro site on Cloudflare?

Yes. Cloudflare Workers supports static Astro sites and SSR through the official Cloudflare adapter. You can manage the setup directly or use ohmyho.st's supported Astro deployment workflow on Workers. Check whether your application needs Cloudflare bindings outside the managed integration before choosing.

### Does Astro need SSR hosting for React components?

No. A React island can become interactive in the browser on a statically generated Astro page. SSR is needed when a route requires server behavior at request time. Test the component's actual interaction in the deployed preview.

### Can an Astro site use a custom domain?

Yes. For ohmyho.st, connect a customer-owned domain to an active Prod deployment. Free workspaces must keep the ohmyho.st flag enabled while using that domain, or upgrade before switching it off. Domain registration is separate. The [domain guide](https://docs.ohmyho.st/domains) explains the setup and the [pricing page](/pricing) explains the conditions.

### Which host should I try first?

For a publication or supported SSR site built with a coding agent, try [Astro hosting on ohmyho.st](/frameworks/astro). Ask your Agent to deploy to Dev, review the site and publish the verified version when you are ready. If the project depends on provider-specific resources outside that integration, use that provider's adapter and deployment guide to prepare your preview.
