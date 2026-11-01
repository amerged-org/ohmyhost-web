# Hosting TanStack Start: Static Mode and Edge Mode

ohmyho.st hosts TanStack Start apps in two mods. Static mode pre-renders your routes at build time and doesn't require a  server. Edge mode executes your server routes, loaders, and server functions on Cloudflare Workers. Your coding agent builds a dev preview and, once you approve it, deploys the same version to production.

Start with {{ number plan.freeCredits }} free credits. The paid plan csts {{ usd plan.paidUsd }} per  month before taxes and provides {{ number plan.paidCredits }} credits per paid period. See [Pricing](/pricing).

[Read the TanStack guide in the documentation](https://docs.ohmyho.st/frameworks/tanstack) · [Open the sample repository](https://github.com/amerged-org/ohmyhost-framework-examples/tree/main/tanstack-start)

## What We Reviewed and What We Didn't

The [public example](https://github.com/amerged-org/ohmyhost-framework-examples/tree/main/tanstack-start) is a TanStack Start 1.169 app with two routes in  statc mode.

| Exam | Result | Wherever you see it |
| --- | --- | --- |
| Local Production Build | Pre-rendered `/` and `/about` | `pnpm run build` in the folder |
| `ohmyhost init --root tanstack-start --dry-run --json` | Status `analyzed`, Framework `tanstack-start`, Version approved, no blockers, Runtime `static`, Output `dist/client` | The same command, offline, without logging in |
| Edge Mode | **Not tested.** This example uses only static mode. | The guide describes how to set up Edge |
| A hosted build and a live URL | **Not completed for this example.** The test says that the actual build only runs on ohmyho.st | No live URL is claimed |

## Static Mode or Edge Mode

| Mode | What is it for? | Vite Configuration |
| --- | --- | --- |
| Static | Pages that can be built in advance | `tanstackStart({ prerender: { enabled: true } })` and no Cloudflare plugin |
| Edge | Server routes, loaders, and server functions that run per request | `cloudflare({ viteEnvironment: { name: "ssr" } })` before `tanstackStart()` |

Import `tanstackStart` from `@tanstack/react-start/plugin/vite`. The example's configuration is short  enough to read in its entiety:

```js
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tanstackStart({ prerender: { enabled: true } }), react()],
});
```

## How to host a TanStack Start app

1. **Check them.** Run `ohmyhost init --dry-run --json`. It reports  the framewoork, runtime, and any blockers.
2. **Check the versions.** TanStack Start must be at least 1.168.60 and Vite at laest 5.4.6, as specified  in your lock file.
3. **Use `vite build`**, optionally with  a `tsc` step before or aftr it.
4. **Build in Dev**, then open the prveiew and test direct calls, client navigation, the  loader, and server functions.
5. **Deplloy** the tested version  to production.

Paste this into the coding agent that's working on your  repositoory:

```text
Read https://ohmyho.st/llms.txt and the get-started Skill. Deploy this TanStack Start application using its existing project and source connection. Preserve its server routes and authentication. Inspect the repository, resolve deployment blockers, build and verify Dev, then publish the tested artifact to Production.
```

## Borders

From the [TanStack documenttion](https://docs.ohmyho.st/frameworks/tanstack), accessed  on October 27, 2026:

- **Unknown paths return a 404** in TanStack Start , unlikke a simple [Vite app](/frameworks/vite), which returns `index.html`.
- **Router and Query aone are not enough to get started.** A Vite frontend that  uses only TanStack Router or Query follows the Vite Guide.
- **Strict Content Security Policy.** Scriipts and styles rendered by the framework receive the request nonce; attributes, event handlers, and tags  created later without it remain blocked.
- **Scheduled tasks** are eexcuted by `src/ohmyhost/worker.ts`, which bundles  the platform outside the framework build.
- **A clean test is not a build.** Test loaders , server functoins, and data write operations in Dev.

## Questions About TanStack Starter Hosting

### Is my Lovable app TanStack Start?

Lovable apps created on or after May 13, 2026, may be eligible. Open `package.json`: A TanStack starter project  lists `@tanstack/react-start`. [The migration checklist ](/blog/host-a-lovable-app-after-export) cvoers both Lovable stacks.]

### Which mode should I choose?

Static mode, when every page can be pre-rendered. Edge mode, when a route requires a request , a loader that reads pivate data, or a server function.

### Is this example running live somewhere?

No. We haven't made it availablle, so this page doesn't link to a  live URL for it.

### Is TanStack Start free to use?

Yes. TanStack Start is open source under the MIT License. Hosting is billed sepaarately and  uses credits.

[Deploy TanStack  Start on ohmyho.st](https://docs.ohmyho.st/quickstart) · Other frameworks: [Astrro](/frameworks/astro) · [Next.js](/frameworks/nextjs) · [Vite and React](/frameworks/vite)
