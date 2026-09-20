import type { ContentPage } from "../content/types.js";
import {
  checkedLine,
  creditValueUsd,
  credits,
  number,
  priceLine,
  priceWorkload,
  rate,
  sourcesSection,
  usd,
} from "../content/format.js";
import { PLANS, VENDORS, WORKLOADS } from "../content/sources.js";
import { comparisonColumns, figureBills } from "../figures.js";

export const page: ContentPage = {
  path: "/vs/resend",
  title: `Resend alternative: transactional mail by usage — ohmyho.st`,
  description: `Resend Pro is ${usd(VENDORS.resend.facts.pro.usd)} a month for 50,000 emails. ohmyho.st meters mail per recipient plus one sender zone, from the same balance as your hosting.`,
  kind: "page",
  modified: "2026-09-20",
  crumb: "vs Resend",
  markdown: `# Resend alternative that sends from the same balance as your hosting

ohmyho.st meters transactional mail per recipient, about ${credits(priceLine("ses.{region}.recipients (Essentials)", 1000), 0)} per 1,000, plus about ${credits(priceLine("route53.zone", 1), 0)} a month for the sender domain. Resend charges by plan: ${usd(VENDORS.resend.facts.free.usd)} for ${VENDORS.resend.facts.free.includes}, ${usd(VENDORS.resend.facts.pro.usd)} for 50,000. Below roughly 35,000 recipients metering is cheaper; above it Resend is.

${figureBills("resend")}

## What Resend charges

Resend sells transactional mail on its own, with its own dashboard, logs and deliverability tooling. The plans are volume tiers:

- Free: ${usd(VENDORS.resend.facts.free.usd)} ${VENDORS.resend.facts.free.unit}, with ${VENDORS.resend.facts.free.includes}. The daily cap matters more than the monthly one: a daily digest to 400 people fits the month and breaks the day.
- Pro: ${usd(VENDORS.resend.facts.pro.usd)} ${VENDORS.resend.facts.pro.unit}, with ${VENDORS.resend.facts.pro.includes}.
- Scale: ${usd(VENDORS.resend.facts.scale.usd)} ${VENDORS.resend.facts.scale.unit}, with ${VENDORS.resend.facts.scale.includes}.
- Beyond the plan: ${usd(VENDORS.resend.facts.overageThousand.usd)} ${VENDORS.resend.facts.overageThousand.unit}.
- Extra domains: ${usd(VENDORS.resend.facts.domainsAddon.usd)} ${VENDORS.resend.facts.domainsAddon.unit}.

The plan is per account, not per app, so one subscription covers every project you send from. That is the part worth keeping in mind when you compare: you are weighing one fixed fee against usage across all of your projects, not against a fee per project. ${checkedLine(VENDORS.resend)}

## What ohmyho.st charges for mail

Mail here is a capability of the project, not a separate account. It needs Paid: ${usd(PLANS.paidUsd)} a month buys ${number(PLANS.paidCredits)} credits that every project shares. Two meters apply.

The first is the send itself: ${rate("ses.{region}.recipients (Essentials)")}. The meter counts **recipients**, not messages. One message to a customer with two people in CC is three recipients. A message to 400 subscribers is 400.

The second is the sender domain: ${rate("route53.zone")}. You delegate one subdomain, for example \`notify.yourdomain.com\`, and that zone holds the DKIM, SPF and DMARC records. It costs its credits every month the zone exists, whether you send one message or fifty thousand, and it is the reason very low volumes are not free here.

Everything else about a project stays on the same balance: hosting, Postgres, a linked domain. There is no second subscription and no per-project mail fee.

## Break-even by volume

The table prices a month of mail from your own sender domain on ohmyho.st against the cheapest Resend plan that covers the same volume. Credit values use the standard rate where ${number(100)} credits are ${usd(1)}.

| Recipients a month | On ohmyho.st, sender zone included | Cheapest Resend plan |
| --- | ---: | --- |
| 2,000 | ${credits(priceWorkload(WORKLOADS.senderTwoThousand).microcredits)} (${creditValueUsd(priceWorkload(WORKLOADS.senderTwoThousand).microcredits)}) | Free, ${usd(VENDORS.resend.facts.free.usd)} |
| 10,000 | ${credits(priceWorkload(WORKLOADS.senderTenThousand).microcredits)} (${creditValueUsd(priceWorkload(WORKLOADS.senderTenThousand).microcredits)}) | Pro, ${usd(VENDORS.resend.facts.pro.usd)} |
| 35,000 | ${credits(priceWorkload(WORKLOADS.senderThirtyFiveThousand).microcredits)} (${creditValueUsd(priceWorkload(WORKLOADS.senderThirtyFiveThousand).microcredits)}) | Pro, ${usd(VENDORS.resend.facts.pro.usd)} |
| 50,000 | ${credits(priceWorkload(WORKLOADS.senderFiftyThousand).microcredits)} (${creditValueUsd(priceWorkload(WORKLOADS.senderFiftyThousand).microcredits)}) | Pro, ${usd(VENDORS.resend.facts.pro.usd)} |

Read it in three bands. Under about 3,000 recipients a month, and under 100 on any day, Resend Free costs nothing and metering cannot beat that. Between there and about 35,000, metering wins: 10,000 recipients cost ${creditValueUsd(priceWorkload(WORKLOADS.senderTenThousand).microcredits)} of credit value against ${usd(VENDORS.resend.facts.pro.usd)}. At 35,000 the two are level. Above that Resend is cheaper and keeps getting cheaper, because its tier price is flat while credits keep counting: 50,000 recipients are ${creditValueUsd(priceWorkload(WORKLOADS.senderFiftyThousand).microcredits)} here against ${usd(VENDORS.resend.facts.pro.usd)} there. ${checkedLine(VENDORS.resend)}

## What your agent sets up

Mail is a DNS job, and the agent does it as a plan you confirm.

1. You name the sender subdomain. \`mail_domain_set\` configures it as the project's canonical sender and returns the records to publish.
2. You add the returned records at your registrar. The delegated zone holds DKIM, SPF and the MAIL FROM record.
3. \`mail_domain_status\` reads verification back until DNS and DKIM are ready. Your agent can poll it and tell you what is still missing.
4. Your application sends through the project's mail credentials, which the agent stores as an environment secret through the stdin-only command from \`secret_set_command\`.

Sending is bounded the same way everything else is: each accepted recipient reserves credits at claim and settles at provider accept, and a send that the provider refuses is not charged.

## Side by side

${comparisonColumns("resend")}

The left card is a stack bought separately, with Resend Pro as its mail line. The right card is the same work on one balance. For mail alone the comparison is the table above; the reason the whole card still favours one balance at small scale is that hosting and Postgres are on it too, and a quiet project's database suspends while a mail plan does not. ${checkedLine(VENDORS.resend)}

## When Resend is the better choice

Above roughly 35,000 recipients a month, Resend is simply cheaper, and the gap widens with volume. It is also the better choice when mail is the product rather than a feature: Resend gives you a dedicated dashboard, per-message logs you can search, webhooks for delivery events, suppression management and broadcast sending, and its team publishes deliverability guidance that a hosting product does not. If you already run Resend and it works, keeping it costs you nothing here: point your app at it, set the API key as a project secret, and use ohmyho.st for hosting and Postgres only. Mail on ohmyho.st is for the app that needs a password reset and a receipt, not for the app whose business is sending.

## When ohmyho.st is

When mail is a small, necessary part of an app you already host here. You get one bill to reason about instead of two, the sender domain is set up by the same agent that deploys, and a project that sends a few thousand transactional messages a month lands well under the ${number(PLANS.paidCredits)} credits the plan already includes. It also fits the freelancer case: every client project can have its own verified sender domain without every client project needing its own subscription.

## FAQ

### Does mail work on the free plan?

No. Sending needs Paid, because it provisions a real sender identity: a delegated DNS zone, DKIM keys and a verified domain. Free projects get hosting, a database and their Dev and Prod hosts, and they can use an external provider's API from application code like any other third-party service.

### Are CC and BCC counted separately?

Yes. The meter counts accepted recipients, so one message with a customer in To and two colleagues in CC is three recipients. This matters for digests and notifications that quietly copy a team inbox: the recipient count, not the message count, is what you should estimate.

### Can I keep Resend and still host here?

Yes, and for high volume you should. Store the Resend API key as a project secret, call their API from your server code, and skip the sender zone entirely. Nothing about hosting, Postgres or your domain changes, and no mail meters apply because the platform is not sending anything.

### What happens to mail when credits run out?

A zero balance starts a grace period of ${number(PLANS.graceDays)} days during which funded services keep running, and mail may still send while it lasts. Refilling clears it. After an unresolved grace period only unfunded services are suspended; your data, your exports and your ability to buy credits stay available.

### Why is there a monthly cost even at zero sends?

The sender zone. A verified domain has to exist before it can send, and that zone costs about ${credits(priceLine("route53.zone", 1), 0)} a month whether it carries traffic or not. If a project should not pay that, remove the sender domain and the meter stops.

${sourcesSection(VENDORS.resend)}

[Cost breakdown](/pricing/breakdown) · [ohmyho.st vs Vercel](/vs/vercel) · [Deploy from Claude Code](/for/claude-code) · [What five side projects cost](/blog/what-vercel-supabase-resend-cost-for-five-side-projects)`,
};
