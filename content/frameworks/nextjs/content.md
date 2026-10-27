# Next.js Hosting on Cloudflare Workers

ohmyho.st runs ordinary Next.js routes on Cloudflare Workers. Your coding agent inspects the repository, builds a Dev preview, and publishes the same tested version to Production. The service adds its own OpenNext adapter at build time, so you do not add a Wrangler project or an OpenNext config to your repository.

Start with {{ number plan.freeCredits }} Free credits. Paid costs {{ usd plan.paidUsd }} a month before tax and adds {{ number plan.paidCredits }} credits per paid period. Builds and requests consume credits; see [pricing](/pricing).

[Read the Next.js guide in the docs](https://docs.ohmyho.st/frameworks/nextjs) · [Open the example repository](https://github.com/amerged-org/ohmyhost-framework-examples/tree/main/nextjs)

## What we checked, and what we did not

We keep a minimal Next.js app in a [public repository](https://github.com/amerged-org/ohmyhost-framework-examples/tree/main/nextjs). It has one server-rendered page that reads the request, and one route handler at `/api/hello`.

| Check | Result | Where to see it |
| --- | --- | --- |
| Local production build with Next.js 16.4.3 | Built; `/` and `/api/hello` are listed as dynamic | `pnpm run build` in the folder |
| `ohmyhost init --root nextjs --dry-run --json` | Status `analyzed`, framework `nextjs`, version admitted, no blockers, requirement `nextjs-adapter` | Same command, offline, no sign-in |
| A hosted build and live URL | **Not done for this example.** The inspection itself says the real build runs only on ohmyho.st | No live URL is claimed |

So this page shows that the example meets the documented rules. It does not show a hosted deployment of the example.

## How to host a Next.js app

1. **Inspect it.** In the project, run `ohmyhost init --dry-run --json`. It reads your `package.json` and lockfile and lists blockers before anything is uploaded.
2. **Pin the basics.** Use an exact `packageManager` version and one matching lockfile. Pin exact `react` and `react-dom` versions.
3. **Keep the build script `next build`.** `next build --webpack` is also accepted. The service supplies OpenNext and the Webpack flag.
4. **Build in Dev.** Plan the exact saved commit, build it, and open the Dev preview.
5. **Test it.** Load nested routes, reload them directly, call your route handlers, and check the browser console.
6. **Publish.** Promote the tested Dev version to Production, then connect your domain.

Paste this into the coding agent working on your repository:

```text
Read https://ohmyho.st/llms.txt and the get-started Skill. Deploy this Next.js application using its existing project and source connection. Preserve its routes and authentication. Inspect the repository, resolve deployment blockers, build and verify Dev, then publish the tested artifact to Production.
```

## Limits on Workers

These come from the [Next.js documentation](https://docs.ohmyho.st/frameworks/nextjs), read on October 27, 2026. Check the page for the current rules.

- **Version floor.** Next.js 16.4.1 or later. Every Next.js 15 release and older 16.x releases are refused.
- **No time-based revalidation.** Pages built ahead of time are cached with the deployment. Incremental static regeneration and on-demand revalidation are unsupported; a new deployment refreshes them.
- **No `output: standalone` or `output: export`**, and no non-root `basePath` or `assetPrefix`.
- **Tailwind with Turbopack.** A project that loads Tailwind only through `@tailwindcss/turbopack` is refused until it has a PostCSS configuration that Webpack reads.
- **No runtime code generation.** Workers cannot run `eval` or `new Function`, so MDX that is compiled at request time fails even if it works under Node. Compile MDX during the build.
- **No persistent local files.** Writes to the filesystem do not survive. Use the database or file services.
- **Strict content security policy.** Inline scripts need the per-request nonce.

A successful build does not prove every Next.js feature. The inspection result separates verified, experimental and unsupported capabilities.

## Next.js hosting questions

### Do I need to change my Next.js code?

Often not. Keep ordinary routes and configuration. Run the inspection first: it names the specific setting or dependency that needs a change.

### Can I use server actions and route handlers?

Route handlers are part of the example above. Check any other server feature you rely on with the inspection and a Dev test before you publish.

### Does the example run live somewhere?

No. We have not deployed it to a hosted project, so this page links no live URL for it. The repository shows the source and how it was checked.

### Is Next.js free to use?

Yes. Next.js is open source under the [MIT license](https://github.com/vercel/next.js/blob/canary/license.md). Hosting is a separate service: ohmyho.st starts with Free credits and builds and requests consume the allowance.

### How does this compare with Vercel?

Read [ohmyho.st vs Vercel](/vs/vercel) for a dated, sourced comparison.

[Deploy Next.js on ohmyho.st](https://docs.ohmyho.st/quickstart) · Other frameworks: [Astro](/frameworks/astro) · [Vite and React](/frameworks/vite) · [TanStack Start](/frameworks/tanstack)
