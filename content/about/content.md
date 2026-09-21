# Hosting for the apps you build

ohmyho.st brings app hosting, managed Postgres, transactional email and custom domain connections into one platform. It is built for people who create software with Claude Code, Cursor, Codex or other coding agents and want to take a GitHub project through deployment without assembling a separate hosting workflow for every app.

## Why ohmyho.st exists

Building an app has become easier. Getting it into production still involves decisions about databases, environment variables, domains, authentication and billing. Those tasks repeat with each new project, even when most of the apps are small.

ohmyho.st brings that work into the conversation you already have with your coding agent. The agent can inspect the project, prepare its deployment and work with the services the app needs. You keep the source in GitHub and use the same workflow as the project grows.

## Built for more than one project

The platform is designed around solo builders, indie hackers and small teams shipping several apps. That includes side projects built with coding agents, client applications and projects exported from tools such as Lovable, Bolt or Replit.

The supported application frameworks are Next.js, Vite/React and TanStack Start. Migration starts with checking the actual project: its dependencies, authentication, data and external services. An exported repository can still need changes before it is ready to deploy. The [migration guides](/from/lovable) explain that process, including what to check after an app goes live.

## Deploy through your coding agent

Start with the prompt on the [homepage](/). Your agent reads the deployment instructions, connects to ohmyho.st and guides you through signing in. It then uses the project's GitHub source to prepare a deployment plan.

Dev and Prod give you separate deployment targets. Verify the application in Dev before promoting the tested artifact to Prod. Your agent can check deployment status, work with runtime secrets and help connect a custom domain. The portal provides a view of projects, credit usage and budgets alongside that agent workflow.

The [quickstart](https://docs.ohmyho.st/quickstart) covers the steps. Existing application decisions stay part of the deployment plan rather than being replaced by a preset stack.

## One balance across your projects

Every project draws from the same organization credit balance. There is no separate base subscription for each project; the services you use consume credits at published rates.

Free provides {{ number plan.freeCredits }} monthly credits. Paid is {{ usd plan.paidUsd }} per month with {{ number plan.paidCredits }} credits per billing period. Monthly credits expire at period end, while purchased top-ups do not expire. Retained resources can still use credits when an app is quiet.

See [pricing](/pricing) for the plans and the [cost breakdown](/pricing/breakdown) for a worked example with its usage assumptions.

## Keep your project portable

Your application source remains in your GitHub repository. Database exports provide portable SQL, and application authentication follows the choices made for your project.

The CLI, MCP server, TypeScript SDK, runtime clients and Better Auth integration are available under Apache-2.0. The website and documentation are MIT-licensed; the hosted platform is private. The [open-source page](/open-source) explains the boundaries and links to the packages.

## Learn more

Explore the [documentation](https://docs.ohmyho.st/), read the [changelog](/changelog), or use the [contact form](/contact) for questions. Operator information and legal terms are available in the [privacy notice](/privacy), [terms](/terms) and [data processing agreement](/dpa).
