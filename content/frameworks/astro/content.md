# Astro hosting for the way you build

Host a static Astro site or an Astro application that renders on the server. Your coding agent inspects the repository, prepares a deployment, opens a Dev preview and publishes the verified version to Prod. Keep your content and framework code in your existing project, with hosting managed through the same agent workflow.

## Static pages, request-time rendering, or both

A portfolio, publication or documentation site can render its pages during the build. Visitors receive the resulting HTML and assets; interactive islands load browser code only where the page needs it. Content changes become a new deployment, with the previous version retained for rollback.

An application that depends on the current request can use Astro SSR. The official Cloudflare adapter produces a Worker for dynamic pages, middleware and API endpoints. Pages marked for prerendering remain static. These modes have different runtime needs, and the deployment inspection reports which mode your repository selects.

Start with the architecture the application actually needs. A static publication does not need a database because its host offers one. A private account page cannot be made static merely to pass a build. Your agent should keep that distinction visible while preparing the application.

## Seb Builds as a production migration case

[Seb Builds](https://sebmer.com) is our production migration case: an existing publication with project pages, essays, build logs, public JSON, discovery files, images and RSS. Its Astro migration keeps the existing editorial design and public URLs.

The static publication and our separate SSR acceptance application exercise different paths. The SSR case checks request-dependent output, middleware, an API endpoint, a prerendered page and a React island. We distinguish a successful framework build from a working hosted application and verify both before calling the integration ready.

## How to deploy Astro with your coding agent

1. Inspect the existing repository, rendering mode and source connection.
2. Prepare a plan for the exact source commit and resolve any reported blockers.
3. Build Dev and verify pages, endpoints, assets and browser interactions.
4. Promote the verified artifact to Prod and check the public routes.

Use your existing supported source connection. Ask the agent to inspect the repository before creating another project or replacing a configuration file:

```text
Read https://ohmyho.st/llms.txt and the get-started Skill. Deploy this Astro application on ohmyho.st using its existing project and source connection where present. Keep its rendering mode, content and integrations. Run the repository inspection, resolve its concrete blockers, verify Dev, then publish the verified artifact to Prod.
```

For a local checkout, the first inspection is:

```sh
ohmyhost init --dry-run --json
```

The agent reads the pinned package manager and lockfile, Astro configuration and required runtime capabilities. A deployment plan then names the exact source version and its effects. After the build, open Dev and test the paths your visitors use. Promotion publishes that verified artifact without changing its application bytes.

## What the first integration supports

Use normal Astro static output or the official Cloudflare adapter for Workers SSR. Keep the standard source and output directories. For SSR, disable native KV sessions and select image passthrough; customer-defined Cloudflare resources, provider cache and Cloudflare Images are outside this initial integration.

The application can keep its chosen authentication provider. Any declared private database, file or mail integration must follow its own supported runtime contract and pass a real application check. SSR runs in Workers, so a Node package must be compatible with that runtime. Your agent should report an incompatible dependency instead of removing a required feature silently.

The [Astro guide](https://docs.ohmyho.st/frameworks/astro) contains the exact configuration and current boundaries. The [hosting comparison](/blog/best-astro-hosting-2027) explains when another deployment workflow may suit you better.

## One balance for the capabilities you use

Hosting, builds and any enabled services use the existing credit model. Read the current [pricing](/pricing) and [worked cost breakdown](/pricing/breakdown) for the meters and assumptions. The relevant cost is the application's workload, including dynamic requests where used, rather than its framework name.

[Connect your agent](https://docs.ohmyho.st/quickstart) · [Read the Astro setup](https://docs.ohmyho.st/frameworks/astro) · [See Seb Builds](https://sebmer.com)
