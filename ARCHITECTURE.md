# Architecture

## What this repository is

The website of ohmyho.st: a Cloudflare Worker that renders a tree of markdown pages, plus the agent
surface those pages index. It is deployed independently of the platform and holds no customer data,
no credential and no backend logic.

## Boundaries

| Owner           | Surface                                                                                                                                                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| This repository | `https://ohmyho.st/*` — pages, `/brand`, `llms.txt`, `AGENTS.md`, `mcp.json`, `mcp-tools.json`, `/skills/*`, `/.well-known/*`, the sitemap, robots and the social cards          |
| The platform    | `https://ohmyho.st/releases/*` and `/client-release.json` (client downloads), `omh.st`, `check.omh.st` and `*.check.omh.st` (project addresses), the REST API at `app.ohmyho.st` |

Cloudflare resolves the most specific route first, so the platform's path routes win over this
Worker's host route on the same hostname.

## Content

`content/<path>/` is a page, and the folder path is its URL. Each page carries `page.json` (title,
description, kind, status, social card and, for an article, author and dates) and `content.md`
(prose only). The build compiles the tree into the Worker bundle: a Worker has no filesystem.

Published numbers are resolved at build time from `platform-inputs.json` and `content/data/*.json`
through a closed token vocabulary (`{{ usd … }}`, `{{ credits … }}`, `{{ rate … }}`, `{{ table … }}`,
`{{ figure … }}`). An unknown token, or one naming a vendor, workload or unit that does not exist,
fails the build. That is what keeps a published price traceable to a source.

## Platform inputs

`platform-inputs.json` is written by the platform's `prepare-web-inputs.mjs` and reviewed here as an
ordinary pull request. It carries the credit rate card, the Skill catalog, the MCP tool catalog and
the current client release, together with the platform commit it was generated from. The build reads
only that committed file, so a build is deterministic and offline.

## Decisions

| ID   | State       | Decision                                                                                                                                           |
| ---- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| W001 | Implemented | The website is its own public MIT repository; the platform stays private.                                                                          |
| W002 | Implemented | The folder path under `content/` is the URL, and every page carries `page.json` and `content.md`.                                                  |
| W003 | Implemented | Published numbers reach a page only through build-time tokens resolved from the rate card and dated competitor data.                               |
| W004 | Implemented | The agent surface (`llms.txt`, `AGENTS.md`, the Skill pages and the MCP catalog) is served by this repository, generated from the platform inputs. |
| W005 | Implemented | Client downloads, the project-address hostnames and the REST API stay with the platform.                                                           |
