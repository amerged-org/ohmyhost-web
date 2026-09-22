# Resend alternative that sends from the same balance as your hosting

Most side projects send very little mail: a sign-up confirmation, a password reset, the occasional receipt. Paying a fixed monthly plan for that is paying for capacity you will never use, and it arrives as a third invoice next to your hosting and your database.

ohmyho.st meters mail per recipient — about {{ credits unit.thousandMailRecipients dp=0 }} per 1,000, plus about {{ credits unit.mailSenderZoneMonth dp=0 }} a month for the verified sender domain — from the same balance as your hosting and database. Resend charges per plan: {{ usd vendor.resend.free }} for {{ text vendor.resend.free.includes }}, {{ usd vendor.resend.pro }} for 50,000. The honest line is around 35,000 recipients a month: below it, metering wins; above it, Resend's plan is the better deal and you should stay.

{{ figure bills.resend }}

## What Resend charges

Resend sells transactional mail on its own, with its own dashboard, logs and deliverability tooling. The plans are volume tiers:

- Free: {{ usd vendor.resend.free }} {{ text vendor.resend.free.unit }}, with {{ text vendor.resend.free.includes }}. The daily cap matters more than the monthly one: a daily digest to 400 people fits the month and breaks the day.
- Pro: {{ usd vendor.resend.pro }} {{ text vendor.resend.pro.unit }}, with {{ text vendor.resend.pro.includes }}.
- Scale: {{ usd vendor.resend.scale }} {{ text vendor.resend.scale.unit }}, with {{ text vendor.resend.scale.includes }}.
- Beyond the plan: {{ usd vendor.resend.overageThousand }} {{ text vendor.resend.overageThousand.unit }}.
- Extra domains: {{ usd vendor.resend.domainsAddon }} {{ text vendor.resend.domainsAddon.unit }}.

The plan is per account, not per app, so one subscription covers every project you send from. That is the part worth keeping in mind when you compare: you are weighing one fixed fee against usage across all of your projects, not against a fee per project. {{ checked resend }}

## What ohmyho.st charges for mail

Mail here is a capability of the project, not a separate account. It needs Paid: {{ usd plan.paidUsd }} a month buys {{ number plan.paidCredits }} credits that every project shares. Two meters apply.

The first is the send itself: {{ rate ses.{region}.recipients (Essentials) }}. The meter counts **recipients**, not messages. One message to a customer with two people in CC is three recipients. A message to 400 subscribers is 400.

The second is the sender domain: {{ rate route53.zone }}. You delegate one subdomain, for example `notify.yourdomain.com`, and that zone holds the DKIM, SPF and DMARC records. It costs its credits every month the zone exists, whether you send one message or fifty thousand, and it is the reason very low volumes are not free here.

Everything else about a project stays on the same balance: hosting, Postgres, a linked domain. There is no second subscription and no per-project mail fee.

## Break-even by volume

The table prices a month of mail from your own sender domain on ohmyho.st against the cheapest Resend plan that covers the same volume. Credit values use the standard rate where {{ number 100 }} credits are {{ usd 1 }}.

| Recipients a month | On ohmyho.st, sender zone included | Cheapest Resend plan |
| --- | ---: | --- |
| 2,000 | {{ credits workload.senderTwoThousand }} ({{ usdValue workload.senderTwoThousand }}) | Free, {{ usd vendor.resend.free }} |
| 10,000 | {{ credits workload.senderTenThousand }} ({{ usdValue workload.senderTenThousand }}) | Pro, {{ usd vendor.resend.pro }} |
| 35,000 | {{ credits workload.senderThirtyFiveThousand }} ({{ usdValue workload.senderThirtyFiveThousand }}) | Pro, {{ usd vendor.resend.pro }} |
| 50,000 | {{ credits workload.senderFiftyThousand }} ({{ usdValue workload.senderFiftyThousand }}) | Pro, {{ usd vendor.resend.pro }} |

Read it in three bands. Under about 3,000 recipients a month, and under 100 on any day, Resend Free costs nothing and metering cannot beat that. Between there and about 35,000, metering wins: 10,000 recipients cost {{ usdValue workload.senderTenThousand }} of credit value against {{ usd vendor.resend.pro }}. At 35,000 the two are level. Above that Resend is cheaper and keeps getting cheaper, because its tier price is flat while credits keep counting: 50,000 recipients are {{ usdValue workload.senderFiftyThousand }} here against {{ usd vendor.resend.pro }} there. {{ checked resend }}

## What your agent sets up

Mail is a DNS job, and the agent does it as a plan you confirm.

1. You name the sender subdomain. `mail_domain_set` configures it as the project's canonical sender and returns the records to publish.
2. You add the returned records at your registrar. The delegated zone holds DKIM, SPF and the MAIL FROM record.
3. `mail_domain_status` reads verification back until DNS and DKIM are ready. Your agent can poll it and tell you what is still missing.
4. Your application sends through the project's mail credentials, which the agent stores as an environment secret through the stdin-only command from `secret_set_command`.

Sending is bounded the same way everything else is: each accepted recipient reserves credits at claim and settles at provider accept, and a send that the provider refuses is not charged.

## Side by side

{{ figure comparison.resend }}

The left card is a stack bought separately, with Resend Pro as its mail line. The right card is the same work on one balance. For mail alone the comparison is the table above; the reason the whole card still favours one balance at small scale is that hosting and Postgres are on it too, and a quiet project's database suspends while a mail plan does not. {{ checked resend }}

## When Resend is the better choice

Above roughly 35,000 recipients a month, Resend is simply cheaper, and the gap widens with volume. It is also the better choice when mail is the product rather than a feature: Resend gives you a dedicated dashboard, per-message logs you can search, webhooks for delivery events, suppression management and broadcast sending, and its team publishes deliverability guidance that a hosting product does not. If you already run Resend and it works, keeping it costs you nothing here: point your app at it, set the API key as a project secret, and use ohmyho.st for hosting and Postgres only. Mail on ohmyho.st is for the app that needs a password reset and a receipt, not for the app whose business is sending.

## When ohmyho.st is

When mail is a small, necessary part of an app you already host here. You get one bill to reason about instead of two, the sender domain is set up by the same agent that deploys, and a project that sends a few thousand transactional messages a month lands well under the {{ number plan.paidCredits }} credits the plan already includes. It also fits the freelancer case: every client project can have its own verified sender domain without every client project needing its own subscription.

## FAQ

### Does mail work on the free plan?

No. Sending needs Paid, because it provisions a real sender identity: a delegated DNS zone, DKIM keys and a verified domain. Free projects get hosting, a database and their Dev and Prod hosts, and they can use an external provider's API from application code like any other third-party service.

### Are CC and BCC counted separately?

Yes. The meter counts accepted recipients, so one message with a customer in To and two colleagues in CC is three recipients. This matters for digests and notifications that quietly copy a team inbox: the recipient count, not the message count, is what you should estimate.

### Can I keep Resend and still host here?

Yes, and for high volume you should. Store the Resend API key as a project secret, call their API from your server code, and skip the sender zone entirely. Nothing about hosting, Postgres or your domain changes, and no mail meters apply because the platform is not sending anything.

### What happens to mail when credits run out?

A zero balance starts a grace period of {{ number plan.graceDays }} days during which funded services keep running, and mail may still send while it lasts. Refilling clears it. After an unresolved grace period only unfunded services are suspended; your data, your exports and your ability to buy credits stay available.

### Why is there a monthly cost even at zero sends?

The sender zone. A verified domain has to exist before it can send, and that zone costs about {{ credits unit.mailSenderZoneMonth dp=0 }} a month whether it carries traffic or not. If a project should not pay that, remove the sender domain and the meter stops.

{{ sources resend }}

[Cost breakdown](/pricing/breakdown) · [ohmyho.st vs Vercel](/vs/vercel) · [Deploy from Claude Code](/for/claude-code) · [What five side projects cost](/blog/what-vercel-supabase-resend-cost-for-five-side-projects)

ohmyho.st is an independent service, not affiliated with or endorsed by Vercel, Supabase or Resend. All trademarks belong to their respective owners.
