# ohmyhost-web

The website of **[ohmyho.st](https://ohmyho.st)** — hosting that a coding agent operates through
MCP: one prepaid credit balance for the app, its Postgres database, transactional mail and its
domains.

This repository holds the pages and the Worker that serves them. The platform itself (API, CLI, MCP
server, build and runtime) is a separate, private repository.

- Live site: <https://ohmyho.st>
- Documentation: <https://docs.ohmyho.st>
- Agent entry point: <https://ohmyho.st/llms.txt>

## What is here

| Path                   | Contents                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `content/`             | Every page. The folder path is the URL; each page carries `page.json` and `content.md`.     |
| `content/data/`        | The dated competitor prices, plans, workloads and units the pages quote.                    |
| `src/`                 | The Worker: page metadata, structured data, figures, the content tree and token resolution. |
| `site/`                | The approved homepage and brand templates, verified by SHA-256 during preparation.          |
| `platform-inputs.json` | Pricing, Skills and the MCP tool catalog, published by the platform.                        |

## Working on a page

```sh
pnpm install
pnpm build      # resolves content tokens and bundles the Worker
pnpm test       # rendering, structured data and the content truth gate
```

Prose lives in `content/**/content.md` and never repeats metadata. Numbers are never typed: a page
writes `{{ usd vendor.vercel.pro }}` or `{{ credits unit.activeDatabaseHour }}`, and the build
resolves it from the published rate card and the dated competitor data. An unknown token fails the
build.

## License

MIT — see [LICENSE](LICENSE).
