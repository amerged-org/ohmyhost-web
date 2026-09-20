import type { ContentPage } from "../content/types.js";

export const page: ContentPage = {
  path: "/philosophy",
  title: "Why one balance instead of five subscriptions — ohmyho.st",
  description:
    "Buy the good services in bulk, add a small margin, meter usage in one prepaid balance for every project, and let you take your database and leave.",
  kind: "page",
  modified: "2026-09-20",
  crumb: "Philosophy",
  markdown: `# Why one balance instead of five subscriptions

Short version: the founder got tired of paying five bills. ohmyho.st buys hosting, Postgres, domains and transactional mail from the providers underneath, adds a small margin, and meters what your projects actually use from one prepaid balance. No per-project base fee, no deploy dashboard to babysit, and an export path that works without asking.

## Buy in bulk, sell at cost plus a little

Every credit you spend is priced by one formula: the provider's list cost times 1.15, divided by 0.0035. That is the whole business model, published in the rate card your agent can read. A credit has a nominal value of one cent; $10 buys 1,000 credits a month, and a quiet project only pays for what it keeps: stored data, a deployed script, a linked domain.

## No per-project fee

Hosting is usually priced per project or per seat. That punishes the person with nine side projects and two alive ones. Here every project draws from the organization's one balance. A project can carry a monthly budget if you want a ceiling, and a zero balance starts a seven-day grace period instead of a surprise invoice.

## No dashboard runs your deploys

Your coding agent deploys through MCP tools: it plans, you confirm, it executes. The portal shows your projects, credits, budgets and API tokens; it does not replace the agent. Every tool call is a discrete, readable step, and the expensive ones come as plan-then-execute pairs.

## Unhappy? Take your database and go

Ask for an export and you get a password-encrypted ZIP with a portable SQL dump, once per project per 24 hours, with a signed link valid for 24 hours. Restore it on any Postgres host. Your auth provider stays yours: Better Auth, WorkOS AuthKit or any OAuth, OIDC or SAML provider.

## Honest about where others win

A single busy production app with serious scale may still belong on Vercel and Supabase. Railway runs any container; ohmyho.st runs Next.js, Vite and TanStack on Workers. Resend is cheaper above roughly 35,000 mail recipients a month. Every comparison page says so, with list prices checked on a named date.

— Sebastian Mertens, founder

[Cost breakdown](/pricing/breakdown) · [Compare Vercel](/vs/vercel) · [About](/about)`,
};
