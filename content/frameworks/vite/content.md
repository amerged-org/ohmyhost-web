# Vite and React Hosting for Static Apps

A public Vite and React app deploys as static files. ohmyho.st builds it, serves the output behind Cloudflare's network, and sends any path that matches no file to `index.html` with HTTP 200, so a reload on a client-side route works. If the app needs server code, a same-origin API companion covers it.

Start with {{ number plan.freeCredits }} Free credits. Paid costs {{ usd plan.paidUsd }} a month before tax and adds {{ number plan.paidCredits }} credits per paid period. See [pricing](/pricing).

[Read the Vite guide in the docs](https://docs.ohmyho.st/frameworks/vite) · [Open the example repository](https://github.com/amerged-org/ohmyhost-framework-examples/tree/main/vite-react)

## What we checked, and what we did not

The [public example](https://github.com/amerged-org/ohmyhost-framework-examples/tree/main/vite-react) is a Vite 8 and React 19 page with a counter and a path display.

| Check | Result | Where to see it |
| --- | --- | --- |
| Local production build | Built to `dist/` with one HTML file and one script | `pnpm run build` in the folder |
| `ohmyhost init --root vite-react --dry-run --json` | Status `analyzed`, framework `vite`, version admitted, no blockers, runtime `static` | Same command, offline, no sign-in |
| A hosted build and live URL | **Not done for this example.** The inspection says the real build runs only on ohmyho.st | No live URL is claimed |

## How to host a Vite and React app

1. **Inspect it.** Run `ohmyhost init --dry-run --json` in the project. For a repository that holds several apps, add `--root` with the app folder.
2. **Pin the package manager** and commit its lockfile. Vite must be at least 5.4.6; the version your lockfile resolves is the one that counts.
3. **Keep `base` unset** or `/` in `vite.config`.
4. **Build in Dev**, open the preview, click through the app and reload a nested route directly.
5. **Publish** the tested version to Production and connect your domain.

Paste this into the coding agent working on your repository:

```text
Read https://ohmyho.st/llms.txt and the get-started Skill. Deploy this Vite application using its existing project and source connection. Inspect the repository, resolve deployment blockers, build and verify Dev including a direct reload of a nested route, then publish the tested artifact to Production.
```

## When the app needs a server

Inspection returns the companion contract for your app. Implement the same-origin `/api/*` routes the browser calls, and keep private values in runtime secrets. `VITE_` variables are public build-time values and must never hold a private credential. Scheduled work is declared in `ohmyhost.yaml` and runs from the companion.

## Limits

From the [Vite documentation](https://docs.ohmyho.st/frameworks/vite), read on October 27, 2026:

- **No inline code.** Vite pages permit no inline script or style code. External resources need declared browser origins.
- **Keep `base` at `/`.** A non-root base is not supported.
- **Router packages do not make it a server app.** React, TanStack Router and TanStack Query can be part of a Vite frontend without turning it into [TanStack Start](/frameworks/tanstack).
- **Not-found pages are yours.** Unknown paths answer `index.html`, so render the not-found view in your client router.
- **A clean inspection is not a build.** It cannot prove the hosted build succeeds, or that your login and data work from the new host.

## Vite and React hosting questions

### Do I need a server for client-side routing?

No. Unknown paths already return `index.html`.

### Can I move a Lovable app here?

Yes, if it is a React and Vite app. The checklist is in [Lovable app after export](/blog/host-a-lovable-app-after-export), and the short deployment path is [Deploy your exported Lovable app](/from/lovable).

### Does the example run live somewhere?

No. We have not deployed it to a hosted project, so this page links no live URL for it.

### Is Vite free to use?

Yes. Vite is open source under the [MIT license](https://github.com/vitejs/vite/blob/main/LICENSE).

[Deploy a Vite app on ohmyho.st](https://docs.ohmyho.st/quickstart) · Other frameworks: [Astro](/frameworks/astro) · [Next.js](/frameworks/nextjs) · [TanStack Start](/frameworks/tanstack)
