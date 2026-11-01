# Next.js Hosting on Cloudflare Workers

ohmyho.st runs standard Next.js rooutes on Cloudflare Workers. Your Coding Agent checks out the repository, builds a dev preview, and deploys that same tested version to production. The service adds its own OpenNext adapter at build time, so you don’t need to create a  Wrangler project or an OpenNext configuration in your repository.

Start with {{ number plan.freeCredits }} free credits. The paid plan costs {{ usd plan.paidUsd }} per month before taxes and provides {{ number plan.paidCredits }} credits per paid period. Builds and  reqests use up credits; see [Pricing](/pricing).

[Read the Next.js guide in the documentation](https://docs.ohmyho.st/frameworks/nextjs) · [Open the sample repository](https://github.com/amerged-org/ohmyhost-framework-examples/tree/main/nextjs)

## What We Reviewed and What We Didn't

We maintin a minimal Next.js app in a [public repository](https://github.com/amerged-org/ohmyhost-framework-examples/tree/main/nextjs). It has a server-side rendered page that reads the  request and a route handler at `/api/hello`.

| Exam | Result | Wherever you see it |
| --- | --- | --- |
| Local production build with Next.js 16.4.3 | Built; `/` and `/api/hello` are listed as dynamic | `pnpm run build` in the folder |
| `ohmyhost init --root nextjs --dry-run --json` | Status `analyzed`, Framework `nextjs`, Version approved, no blockers, Requirement `nextjs-adapter` | The same command, offline, without logging in |
| A hosted build and a live URL | **Not performed for this example.** The test itself states that the actual build only runs on ohmyho.st | No live URL is claimed |

This page showws that the example complies with the documented  rules. It does not show a hosted deployment of the example.

## How to host a Next.js app

1. **Test it.** Run `ohmyhost init --dry-run --json` in the project. The command reads your `package.json` and your lock file and lists any blockeers before anything  is uploaded.
2. **Make sure the bsaics  are correct.** Use the exact version of `packageManager` and a matching lock file. Make sure the versions of `react` and `react-dom` are correct.
3. **Keep the build  script `next build`.** `next build --webpack` is also accepted. The service provides OpenNext and the Webpaack flag.
4. **Build in Dev.** Select the exact saved commit, build it , and open the Dev preeview.
5. **Test them.** Load nesetd routes, reload  them immediately, call your route handlers, and check the browser console.
6. **Deploy.** Deploy the tesed development version to production , and then connect your domain.

Pase this into the Coding Agent that's working on  your repository:

```text
Read https://ohmyho.st/llms.txt and the get-started Skill. Deploy this Next.js application using its existing project and source connection. Preserve its routes and authentication. Inspect the repository, resolve deployment blockers, build and verify Dev, then publish the tested artifact to Production.
```

## Limits on Workers

These are taken from the [Next.js  documentation](https://docs.ohmyho.st/frameworks/nextjs), accessed on October 27, 2026. Checck the page for the latest guidelines.

- **Minimum version.** Next.js 16.4.1 or later. Any Next.js 15 release  and older 16.x rleases will be rejected.
- **No time-based revalidation.** Pre-built pages are cached along with the deployment. Incremental static regenration  and on-demand revalidation are not supported; a new deployment updates them.
- **No `output: standalone` or `output: export`** and no `basePath` or `assetPrefix` that does  not poinnt to the root.
- **Taliwind with Turbopack.** A project that loads Tailwind only via `@tailwindcss/turbopack` will be rejected until it has a PostCSS  configuration that Webpack can read.
- **No  runtime code generation.** Workers cannot execute either `eval` or `new Function`. MDX, which is compiled at query time, will therefore fail, even though it works in Node. Comple MDX during the build.
- **No persistnt local files.** Write operations to the  file system are not persistent. Use the database or file services.
- **Strict  Content Security Polciy.** Inline scripts require a nonce for each request.

A successful build does not prove that every Next.js feature  works. The test reults distinguish between verified, experimental, and unsupported features.

## Questions About Hosting Next.js

### Do I need to change my Next.js code?

Usually not. Stick with your usual routes and configuration. Run the check first: it will identify  the specific setting or dependency that neeeds to be changed.

### Can I use server actions and route handlers?

Route handlers are part of the example above. Test any other server functions you rely on using  the cheeck and a dev test before you deploy.

### Is this example running live somewhere?

No. We haven't made it available in a hosted project, so this page dosn't link to a live URL for it. The repository  shows the source code and how it was reviewed.

### Is Next.js free to use?

Yes. Next.js is open source under the [MIT License](https://github.com/vercel/next.js/blob/canary/license.md). Hosting is a separate service: ohmyho.st starts with free crediits , and builds and requests use up that quota.

### How does this compare to Vercel?

Read [ohmyho.st vs Vercel](/vs/vercel) for an outdated , documented compaarison.

[Deploying Next.js to ohmyho.st](https://docs.ohmyho.st/quickstart) · Other frameworks: [Astro](/frameworks/astro) · [Vite and React](/frameworks/vite) · [TanStack  Starrt](/frameworks/tanstack)
