# Open source at ohmyhost

Every client you run is open source. The command-line client, the MCP server, the TypeScript SDK, the application runtime and the Better Auth integration are published on npm under Apache-2.0, with their source and third-party notices inside the package. The website and documentation are MIT. The PostgreSQL platform under every database, PGCF, is Apache-2.0 too. The hosted platform source is available under the Elastic License 2.0.

## Apache-2.0: the client packages

Published by Amerged under the [Apache-2.0 licence](https://www.apache.org/licenses/LICENSE-2.0). The CLI and MCP server need Node.js 22 or newer.

| Package | Purpose |
| --- | --- |
| [@amerged/ohmyhost-cli](https://www.npmjs.com/package/@amerged/ohmyhost-cli) | Command-line client |
| [@amerged/ohmyhost-mcp](https://www.npmjs.com/package/@amerged/ohmyhost-mcp) | Local MCP server |
| [@amerged/ohmyhost-sdk](https://www.npmjs.com/package/@amerged/ohmyhost-sdk) | TypeScript API client |
| [@amerged/ohmyhost-runtime](https://www.npmjs.com/package/@amerged/ohmyhost-runtime) | Database, mail and storage clients for applications |
| [@amerged/ohmyhost-auth](https://www.npmjs.com/package/@amerged/ohmyhost-auth) | Better Auth integration |

```sh
npm install --global @amerged/ohmyhost-cli @amerged/ohmyhost-mcp
npm install @amerged/ohmyhost-sdk
npm install "@ohmyhost/customer-runtime@npm:@amerged/ohmyhost-runtime@<version>"
```

Upgrade the CLI and MCP server first. Your application imports the runtime as `@ohmyhost/customer-runtime`, so install it under that name as the exact npm alias `ohmyhost init` reports, with `<version>` taken from that report, and commit the updated lockfile. Every `@ohmyhost/customer-runtime/*` import stays unchanged. The website also offers the current release as archives, but only the current one: older archive URLs return 404, so do not pin an application to an `ohmyho.st/releases/` URL, and older runtime versions carry no compatibility promise.

The MCP server's source is also on GitHub: with every release, [amerged-org/ohmyhost-mcp](https://github.com/amerged-org/ohmyhost-mcp) receives every file of the published `@amerged/ohmyhost-mcp` package except the built `dist/` bundle and its README, byte for byte. Its `release.json` records the npm integrity of the full package and the SHA-256 of each omitted file.

The runtime and auth packages matter most for portability: they are the code your application imports, so the parts of your app that touch our platform are readable, forkable and licensed to you.

## Apache-2.0: the PostgreSQL platform

[amerged-org/cloudflare-postgres](https://github.com/amerged-org/cloudflare-postgres) (PGCF) is the open-source serverless PostgreSQL platform every ohmyhost database runs on: real PostgreSQL on Contabo servers, reachable only through Cloudflare, backed up to R2 with point-in-time recovery. Its own code is Apache-2.0; the upstream components it runs keep their own licences.

## MIT: the documentation

[amerged-org/ohmyhost-docs](https://github.com/amerged-org/ohmyhost-docs) holds the source of [docs.ohmyho.st](https://docs.ohmyho.st/) under the MIT licence. Fix a typo, add a framework note or improve a guide with a pull request.

## MIT: the website

[amerged-org/ohmyhost-web](https://github.com/amerged-org/ohmyhost-web) holds the public website, page content and design assets under MIT. Website changes have their own review and release process. Contributions to page content or the website belong in this repository.

## Public: everything an agent reads

- [llms.txt](https://ohmyho.st/llms.txt) — the index an agent reads first.
- [AGENTS.md](https://ohmyho.st/AGENTS.md) — the five rules for an agent that operates ohmyhost.
- [Skills](https://docs.ohmyho.st/skills) — task Skills served at `/skills/<name>/SKILL.md` and listed at `/.well-known/agent-skills/index.json`.
- [MCP tool catalog](https://ohmyho.st/mcp-tools.json) — every tool with its description; `/mcp.json` holds the client configuration.
- [OpenAPI 3.1 contract](https://ohmyho.st/api/openapi.json) — the REST `/v1` API the CLI, the MCP server and the SDK all call.
- [auth.md](https://ohmyho.st/auth.md) — how an agent authenticates.

## The hosting platform under Elastic License 2.0

The [ohmyho.st platform repository](https://github.com/amerged-org/ohmyhost) contains the code for application deployment, database provisioning, mail and the credit ledger. Read its [license](https://github.com/amerged-org/ohmyhost/blob/main/LICENSE) for the terms that cover the platform source. Customer data and deployment credentials stay in the managed installation.

## How agents discover the code

The index, Skills, tool catalog and API contract describe the supported interfaces.

Anyone can read the [ohmyho.st platform source](https://github.com/amerged-org/ohmyhost) to trace a build or deployment, and the [managed PostgreSQL source](https://github.com/amerged-org/cloudflare-postgres) to trace a database change. Your app’s code stays in your project.

## How to contribute

Use the [platform contribution guide](https://github.com/amerged-org/ohmyhost/blob/main/CONTRIBUTING.md) to propose a platform change. Open a pull request on the [website repository](https://github.com/amerged-org/ohmyhost-web) for website changes or the [docs repository](https://github.com/amerged-org/ohmyhost-docs) for documentation. Send product bugs and feature requests through your agent's `feedback_submit` tool, and read ohmyhost's replies to your own report with `feedback_status`. Reports stay private; they are not published. Roadmap votes live on the [homepage](/).

[Documentation](https://docs.ohmyho.st/) · [Philosophy](/philosophy) · [About](/about) · [Contact](/contact)
