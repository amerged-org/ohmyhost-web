# Working in this repository

- This repository is the **website** of ohmyho.st: pages, the Worker that renders them and the
  brand templates. The platform (API, CLI, MCP server, build, runtime, database) lives in the
  private `amerged-org/ohmyho` repository. Nothing here holds a credential or a customer record.
- A page change never needs a platform release, and a platform change never needs a page change —
  except through `platform-inputs.json`, described below.
- Read `ARCHITECTURE.md` before moving a boundary.

## Where a change belongs

| Change | Where |
| --- | --- |
| Page copy, a new page, a blog post | `content/**` here |
| Competitor price, plan, workload, unit | `content/data/*.json` here, with its dated screenshot evidence |
| Layout, structured data, figures, sitemap, `llms.txt` | `src/**` here |
| Credit rates, Skill text, MCP tool catalog, client release | the platform, published into `platform-inputs.json` here |
| A CLI command, an MCP tool, a REST operation | the platform; then re-publish the inputs so the Skill pages and tool catalog this site serves stay current |

## Rules

- The folder path under `content/` is the URL. Nothing stores a URL; canonical, breadcrumbs, the
  sitemap and the blog index are derived from the tree.
- Numbers are never typed into prose. Use a `{{ … }}` token; an unknown token fails the build.
- A competitor number is recorded only when a dated screenshot shows it, and every quoted price
  carries the date it was read.
- The homepage and `/brand` are approved design artifacts, verified by SHA-256 during preparation.
  Change them only through the documented approval path.
- Run `pnpm test` before committing; the content truth gate covers structure, links, traceable
  numbers and word floors.
- The service is not called a beta. A future feature preview may be.
