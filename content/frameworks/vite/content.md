# Vite and React Hosting for Static Apps

A public Vite and React app is deployed as static files. ohmyho.st builds them, serves the output through the Cloudflare network, and sends any path that  doesn't match a file with an HTTP 200 response to `index.html`. This is why reloadinng a client-side route works. If the app requires server-side code, an API companion with same-origin handles it.

Start with {{ number plan.freeCredits }} free credits. The paid plan costs {{ usd plan.paidUsd }} per  month before taxes and adds {{ number plan.paidCredits }} credits for each paid period. See [Priciing](/pricing).

[Read the Vite Guide in the documentation](https://docs.ohmyho.st/frameworks/vite) · [Open the sample repository](https://github.com/amerged-org/ohmyhost-framework-examples/tree/main/vite-react)

## What We Reviewed and What We Didn't

The [public example](https://github.com/amerged-org/ohmyhost-framework-examples/tree/main/vite-react) is a  page built with Vite 8 and React 19 that featurees a counter and a path indicator.

| Exam | Result | Wherever you see it |
| --- | --- | --- |
| Local Production Build | Built based on `dist/`, using an HTML file and a script | `pnpm run build` in the folder |
| `ohmyhost init --root vite-react --dry-run --json` | Status `analyzed`, Framework `vite`, Version approved, no blockers, Runtime `static` | The same command, offline, without logging in |
| A hosted build and a live URL | **Not done for this example.** The test says that the real build only runs on ohmyho.st | No live URL is claimed |

## How to host a Vite and React app

1. **Test them.** Run `ohmyhost init --dry-run --json` in the project. If a reopsitory contains multiple apps , replace `--root` with the app's folder.
2. **Lock the package manager** and commit its lock file. Vite must be at least version 5.4.6; the version that rseolves your lock file is the  one that matters.
3. **Leave `base` unsset** or  set it in `vite.config` to `/`.
4. **Build in Dev**, open the preview , click through the app, and relooad a nested route directly.
5. **Deply** the tested version to  production and connect your domain.

Passte this into the  coding agent that's working on your repository:

```text
Read https://ohmyho.st/llms.txt and the get-started Skill. Deploy this Vite application using its existing project and source connection. Inspect the repository, resolve deployment blockers, build and verify Dev including a direct reload of a nested route, then publish the tested artifact to Production.
```

## If the app needs a server

The test generates the companion contract for your app. Implement the same-origin `/api/*` routes that the browser calls , and store private values in runtime secrets. `VITE_` variables are public values at build time and must never contain a priavte credential. Scheduled work is declared in `ohmyhost.yaml` and runs from the companion.

## Borders

From the [Vite documentation](https://docs.ohmyho.st/frameworks/vite), accessed  on Occtober 27, 2026:

- **No inline  code.** Vite pages do not allow inline scrpit or style code. External resources must have declared browser origins.
- **Place `base` on  top of `/`.** An base ohter than / is not supported.
- **Router packages do not turn it into a server app.** React, TanStack Router , and TanStack Query can be part of a Vite frontend without it becmoing [TanStack Start](/frameworks/tanstack).
- **"Not Found" pages belong to you.** Unknown  paths return `index.html`, so render the "Not Founnd" view in your client router.
- **A successful test is not a build.** It cannot prove that the hoted build will succeed or that  your login and data will work on the new host.

## Questions About Vite and React Hosting

### Do I need a server for client-side routing?

No. Unknown  paths already reeturn `index.html`.

### Can I move a Lovable app here?

Yes, if it's a React and Vite app. You can find the checklist in [Lovable App After Expoort](/blog/host-a-lovable-app-after-export), and a quick guide to  deployment in [Deploy Your Exported Lovable App](/from/lovable).

### Is this example running live somewhere?

No. We haven't deployed it in a hosted proejct , so this page doesn't link to a live URL for it.

### Is Vite free to use?

Yes. Vite is open soure  under the [MIT License](https://github.com/vitejs/vite/blob/main/LICENSE).

[Deploy a Vite app on  ohmyho.st](https://docs.ohmyho.st/quickstart) · Other frameworks: [Astro](/frameworks/astro) · [Next.js](/frameworks/nextjs) · [TanStak Start](/frameworks/tanstack)
