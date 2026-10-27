# TanStack Start Hosting: Static and Edge Modes

ohmyho.st hosts TanStack Start apps in two modes. Static mode prerenders your routes at build time and needs no server. Edge mode runs your server routes, loaders and server functions on Cloudflare Workers. Your coding agent builds a Dev preview and, once you approve it, publishes the same version to Production.

Start with {{ number plan.freeCredits }} Free credits. Paid costs {{ usd plan.paidUsd }} a month before tax and adds {{ number plan.paidCredits }} credits per paid period. See [pricing](/pricing).

[Read the TanStack guide in the docs](https://docs.ohmyho.st/frameworks/tanstack) · [Open the example repository](https://github.com/amerged-org/ohmyhost-framework-examples/tree/main/tanstack-start)

## What we checked, and what we did not

The [public example](https://github.com/amerged-org/ohmyhost-framework-examples/tree/main/tanstack-start) is a two-route TanStack Start 1.169 app in static mode.

| Check | Result | Where to see it |
| --- | --- | --- |
| Local production build | Prerendered `/` and `/about` | `pnpm run build` in the folder |
| `ohmyhost init --root tanstack-start --dry-run --json` | Status `analyzed`, framework `tanstack-start`, version admitted, no blockers, runtime `static`, output `dist/client` | Same command, offline, no sign-in |
| Edge mode | **Not exercised.** The example uses static mode only | The guide describes the edge setup |
| A hosted build and live URL | **Not done for this example.** The inspection says the real build runs only on ohmyho.st | No live URL is claimed |

## Static mode or edge mode

| Mode | Use it for | Vite config |
| --- | --- | --- |
| Static | Pages that can be built ahead of time | `tanstackStart({ prerender: { enabled: true } })` and no Cloudflare plugin |
| Edge | Server routes, loaders and server functions that run per request | `cloudflare({ viteEnvironment: { name: "ssr" } })` before `tanstackStart()` |

Import `tanstackStart` from `@tanstack/react-start/plugin/vite`. The example's config is short enough to read in full:

```js
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tanstackStart({ prerender: { enabled: true } }), react()],
});
```

## How to host a TanStack Start app

1. **Inspect it.** Run `ohmyhost init --dry-run --json`. It reports the framework, runtime and any blocker.
2. **Check the versions.** TanStack Start must be at least 1.168.60 and Vite at least 5.4.6, as your lockfile resolves them.
3. **Use `vite build`**, optionally with one `tsc` step before or after it.
4. **Build in Dev**, then open the preview and test direct loads, client navigation, loaders and server functions.
5. **Publish** the tested version to Production.

Paste this into the coding agent working on your repository:

```text
Read https://ohmyho.st/llms.txt and the get-started Skill. Deploy this TanStack Start application using its existing project and source connection. Preserve its server routes and authentication. Inspect the repository, resolve deployment blockers, build and verify Dev, then publish the tested artifact to Production.
```

## Limits

From the [TanStack documentation](https://docs.ohmyho.st/frameworks/tanstack), read on October 27, 2026:

- **Unknown paths return 404** in TanStack Start, unlike a plain [Vite app](/frameworks/vite), which answers `index.html`.
- **Router and Query alone are not Start.** A Vite frontend that only uses TanStack Router or Query follows the Vite guide.
- **Strict content security policy.** Scripts and styles that the framework renders receive the request nonce; attributes, event handlers and tags created later without it stay blocked.
- **Scheduled work** runs from `src/ohmyhost/worker.ts`, which the platform bundles outside the framework build.
- **A clean inspection is not a build.** Test loaders, server functions and data writes on Dev.

## TanStack Start hosting questions

### Is my Lovable app TanStack Start?

Lovable apps created from May 13, 2026 can be. Open `package.json`: a TanStack Start project lists `@tanstack/react-start`. [The migration checklist](/blog/host-a-lovable-app-after-export) covers both Lovable stacks.

### Which mode should I pick?

Static mode when every page can be built ahead of time. Edge mode when a route needs the request, a loader that reads private data, or a server function.

### Does the example run live somewhere?

No. We have not deployed it, so this page links no live URL for it.

### Is TanStack Start free to use?

Yes. TanStack Start is open source under the MIT license. Hosting is separate and uses credits.

[Deploy TanStack Start on ohmyho.st](https://docs.ohmyho.st/quickstart) · Other frameworks: [Astro](/frameworks/astro) · [Next.js](/frameworks/nextjs) · [Vite and React](/frameworks/vite)
