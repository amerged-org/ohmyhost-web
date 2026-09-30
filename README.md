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

## Editorial publication workflow

Publish at most one new blog article per day. This is an editorial limit, not a daily quota or a
search-engine requirement. Keep existing publication dates when revising articles; update only the
modification date for substantive changes. Existing articles may be improved together.

1. Write a draft with `status: "draft"` in its `page.json`.
2. Review the article's usefulness, source accuracy, pricing evidence and linked author byline before
   changing its status to `published`.
3. Run a separate internal-link pass after writing or updating the content: connect relevant guides,
   comparisons and articles, then revisit older pages to add useful links back to the new article.
   Use descriptive link text. Every published article needs an incoming link in another published
   page's body; its own links, the blog index, shared navigation and footer do not count.
4. Run `pnpm content:links` for a read-only check of the authored tree and `pnpm test` for the full
   content and rendering checks. Both reject broken internal destinations, draft destinations and
   articles without incoming editorial links. Complete the normal lint, typecheck and build checks
   before release.
5. After publication, verify the live article and the revised older pages, including their links,
   author byline and Markdown representation.

The link pass is part of each publication or meaningful update; it is independent of content
generation and does not automatically rewrite prose or create links.

## License

MIT — see [LICENSE](LICENSE).
