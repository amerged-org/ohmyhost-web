# Open source at ohmyho.st

Every client you run is open source. The command-line client, the MCP server, the TypeScript SDK, the application runtime and the Better Auth integration are published on npm under Apache-2.0, with their source and third-party notices inside the package. The documentation is MIT. The hosted platform that runs your projects is private, and this page says exactly which part is which.

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
npm install @amerged/ohmyhost-sdk @amerged/ohmyhost-runtime @amerged/ohmyhost-auth
```

The runtime and auth packages matter most for portability: they are the code your application imports, so the parts of your app that touch our platform are readable, forkable and licensed to you.

## MIT: the documentation

[amerged-org/docs](https://github.com/amerged-org/docs) holds the source of [docs.ohmyho.st](https://docs.ohmyho.st/) under the MIT licence. Fix a typo, add a framework note or improve a guide with a pull request.

## Public: everything an agent reads

- [llms.txt](https://ohmyho.st/llms.txt) — the index an agent reads first.
- [AGENTS.md](https://ohmyho.st/AGENTS.md) — the five rules for an agent that operates ohmyho.st.
- [Skills](https://docs.ohmyho.st/skills) — task Skills served at `/skills/<name>/SKILL.md` and listed at `/.well-known/agent-skills/index.json`.
- [MCP tool catalog](https://ohmyho.st/mcp-tools.json) — every tool with its description; `/mcp.json` holds the client configuration.
- [OpenAPI 3.1 contract](https://ohmyho.st/api/openapi.json) — the REST `/v1` API the CLI, the MCP server and the SDK all call.
- [auth.md](https://ohmyho.st/auth.md) — how an agent authenticates.

## Private: the platform

The service that provisions Postgres, runs your Workers, sends your mail and keeps the credit ledger is a private repository. It holds provider credentials and the isolation between tenants, and it is a small team's product rather than a community project. Saying that plainly is better than a half-open repository nobody can run.

## Why the split is here and not elsewhere

An agent cannot work against a product it has to guess at, so the interface is published: the index, the Skills, the tool catalog and the contract are served from this site and versioned with the clients. The code that runs inside your application is licensed to you, because you should not need our permission to keep your app working. What stays private is the part that holds other people's data.

## How to contribute

Open a pull request on the docs repository, or send a bug or feature request through your agent's `feedback_submit` tool. Both reach the same place. Roadmap votes live on the [homepage](/).

[Documentation](https://docs.ohmyho.st/) · [Philosophy](/philosophy) · [About](/about) · [Contact](/contact)
