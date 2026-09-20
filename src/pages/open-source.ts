import type { ContentPage } from "../content/types.js";

export const page: ContentPage = {
  path: "/open-source",
  title: "What is open at ohmyho.st: docs, Skills and API contract",
  description:
    "The docs are MIT-licensed on GitHub; the agent Skills, llms.txt, MCP tool catalog and OpenAPI contract are public. The platform and clients are not open source.",
  kind: "page",
  modified: "2026-09-20",
  crumb: "Open source",
  markdown: `# What is open at ohmyho.st

The documentation is open source, the agent-facing contracts are public, and the platform itself is not. This page lists exactly what you can read, fork or build against, so nobody has to guess.

## Open source: the documentation

[amerged-org/docs](https://github.com/amerged-org/docs) holds the source of [docs.ohmyho.st](https://docs.ohmyho.st/) under the MIT licence. Fix a typo, add a framework note or improve a guide with a pull request.

## Public: everything an agent reads

- [llms.txt](https://ohmyho.st/llms.txt) — the index an agent reads first.
- [Skills](https://docs.ohmyho.st/skills) — task Skills served at \`/skills/<name>/SKILL.md\` and listed at \`/.well-known/agent-skills/index.json\`.
- [MCP tool catalog](https://ohmyho.st/mcp-tools.json) — every tool with its description; \`/mcp.json\` holds the client configuration.
- [OpenAPI 3.1 contract](https://ohmyho.st/api/openapi.json) — the REST \`/v1\` API that the CLI, the MCP server and the SDK call.
- [auth.md](https://ohmyho.st/auth.md) — how an agent authenticates.

## Not open source

The platform that runs the Workers, provisions Postgres and sends mail is a private repository. The CLI and MCP client packages are published as pinned tarballs from this site without an open-source licence. If you need it otherwise, say so through the [contact form](/contact).

## How to contribute

Open a pull request on the docs repository, or send a bug or feature request through your agent's \`feedback_submit\` tool. Roadmap votes live on the [homepage](/).

[Docs](https://docs.ohmyho.st/) · [Philosophy](/philosophy) · [About](/about)`,
};
