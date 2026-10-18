# Astro Hosting for Static Sites and Cloudflare SSR

Deploy Astro static sites and server-rendered applications on ohmyho.st. Your coding agent builds a Dev preview, checks the application and publishes the same tested version to Production. Astro SSR runs on Cloudflare Workers with the official Cloudflare adapter.

Start with {{ number plan.freeCredits }} Free credits. Paid costs {{ usd plan.paidUsd }} a month before tax and adds {{ number plan.paidCredits }} credits per paid period. Builds, hosting and any optional services consume credits; see [Astro hosting pricing](#astro-hosting-pricing).

[Deploy your Astro site](https://docs.ohmyho.st/quickstart) · [Read the Astro configuration guide](https://docs.ohmyho.st/frameworks/astro)

## A live Astro site: sebmer.com

[Seb Builds](https://sebmer.com) runs on our Astro hosting. We migrated the existing publication from Next.js while retaining its project pages, essays, build logs, feeds, public JSON and URLs. We checked the generated pages, metadata, images and browser theme controls before publishing the tested Dev build to Production.

The [Astro migration source](https://github.com/sebmer-com/sebbuilds/tree/ohmyhost-poc-astro) is public. It shows the content pipeline and static output behind the live site. A separate hosted SSR application verified request-dependent pages, middleware, an API endpoint, prerendered output and an interactive React island. Those checks cover both static delivery and server rendering.

## Static Astro hosting or server-side rendering?

| Rendering mode | Use it for | What ohmyho.st deploys |
| --- | --- | --- |
| Static Astro site | Blogs, documentation, portfolios and marketing pages updated when you publish | Generated HTML, CSS, images and browser scripts from the Astro build |
| Astro SSR | Pages or endpoints that read the current request | A Cloudflare Worker built with the official Astro adapter, plus public assets |
| SSR with prerendered pages | An application with public content and dynamic routes | Static output for prerendered routes and a Worker for request-time routes |

An interactive React component does not require the whole site to use SSR. Astro can render the page during the build and hydrate that component in the browser. Use server rendering when the response needs request-time information.

Keep your existing rendering mode when moving hosts. Deployment inspection checks your Astro configuration and lockfile before the build, then reports the supported runtime and any concrete blockers.

## How to host an Astro website

Use an existing GitHub connection or managed source project. Your agent can inspect a local checkout and continue the project already associated with that workspace.

1. **Inspect the application.** Check the Astro rendering mode, source connection, dependencies and required services.
2. **Build a Dev preview.** Prepare a deployment plan for the exact source version, then build it in Dev.
3. **Test the site.** Open nested pages, images, feeds and browser interactions. For SSR, exercise dynamic routes and API endpoints.
4. **Publish the tested version.** Promote the verified Dev artifact to Production without rebuilding, then connect or check your custom domain.

Paste this into the coding agent working on your repository:

```text
Read https://ohmyho.st/llms.txt and the get-started Skill. Deploy this Astro application using its existing project and source connection. Preserve its rendering mode and integrations. Inspect the repository, resolve deployment blockers, build and verify Dev, then publish the tested artifact to Production.
```

For a local inspection, your agent starts with:

```sh
ohmyhost init --dry-run --json
```

The deployment plan identifies the source and resource effects before execution. Hosting uses the standard supported Astro output, so you do not need to create a Dockerfile for the application.

## Astro hosting pricing

Free starts with {{ number plan.freeCredits }} credits and a project address. Paid costs {{ usd plan.paidUsd }} a month before tax and grants {{ number plan.paidCredits }} monthly credits shared across your projects. Usage above that allowance needs more credits. Monthly credits expire at the end of the paid period without rollover.

Builds, deployed scripts, requests and any database, file or mail service use the published usage rates. Your total depends on what the site consumes. A static publication and a busy SSR application can have different costs on the same plan.

Bring your own custom domain on Paid. Free can also use a customer-owned domain while the project's “Powered by ohmyho.st” flag remains enabled. Read the [current plans](/pricing) and [itemized hosting cost breakdown](/pricing/breakdown) before choosing an allowance.

## Astro SSR compatibility and limits

SSR uses the official Cloudflare adapter and requires Worker-compatible server dependencies. A package that runs in Node during a build may need a different implementation at request time.

Use standard Astro source and output directories. Disable native KV sessions and use image passthrough for SSR. Additional customer-defined Cloudflare bindings, provider cache and Cloudflare Images are outside this integration. The [Astro deployment guide](https://docs.ohmyho.st/frameworks/astro) lists the exact configuration.

Your application can keep its authentication provider. Optional database, file and mail integrations follow their own supported runtime contracts. Check the integration you actually use before publishing.

## Astro hosting questions

### Is Astro free to use?

Yes. The Astro framework is free and open source under the [MIT license](https://github.com/withastro/astro/blob/main/LICENSE). Hosting is a separate service: ohmyho.st starts with Free credits, and builds, hosting and optional services consume the allowance. The [pricing section](#astro-hosting-pricing) explains the hosting costs.

### Can I host a static Astro site without a database?

Yes. Publish the generated HTML and assets. Add a database only when the application needs one; a blog or portfolio can read its content entirely during the build.

### Is Astro only for static websites?

No. Astro supports static output and server-side rendering. On ohmyho.st, request-dependent pages, middleware and API endpoints run on Cloudflare Workers with the official Astro adapter. Prerendered routes remain static, and client islands can be interactive in either mode.

### Can I choose EU hosting for an Astro project?

Yes. Select the EU project region when creating the project. This places builds and any managed database and file storage in the EU; an existing project's region stays fixed. Static assets use Cloudflare's global delivery network, while transactional mail is processed in the US. The [hosting region guide](https://docs.ohmyho.st/environments#choose-a-hosting-region-once) explains the scope.

### Can I test an Astro deployment before publishing it?

Yes. Build and check Dev first, then promote that same artifact to Production. This keeps the application bytes you tested and the version your visitors receive aligned.

### Which Astro hosting provider should I choose?

Choose ohmyho.st if you want your coding agent to handle deployment and publication. For direct Cloudflare configuration or a different Git and dashboard workflow, compare the options in [Best Astro Hosting for 2027](/blog/best-astro-hosting-2027).

[Deploy Astro on ohmyho.st](https://docs.ohmyho.st/quickstart) · [Check the Astro setup](https://docs.ohmyho.st/frameworks/astro)
