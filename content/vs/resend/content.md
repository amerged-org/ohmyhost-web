# A resend option that uses the same credit balance as your hosting

Most side projects send very few emails: a sign-up confirmation, a password reset, and occasionally a receipt. Paying a fixed monthly subscription fee for this means payinng for capacity you’ll never  use, and it shows up as a third bill alongside your hosting and database fees.

ohmyho.st charges for email based on the number of recipients, for example, {{ credits unit.thousandMailRecipients dp=0 }} per 1,000, using the same credit blance as your hosting and database. The email domain itself has no monthly fee. Resend charges per plan: {{ usd vendor.resend.free }} for {{ text vendor.resend.free.includes }}, {{ usd vendor.resend.pro }} for 50,000. The realistic limit  is just over 10,000 recipients per month: below that , pay-as-you-go billing is more cost-effective; above that, the Resend plan is the bteter deal, and you should stick with Resend.

{{ figure bills.resend }}

## What Resend Charges

Resend sells transactional email as a standalone service, with its own dashboard, logs, and deliverability tools. Pricing is  baseed on volume tiers:

- Free: {{ usd vendor.resend.free }} {{ text vendor.resend.free.unit }}, with {{ text vendor.resend.free.includes }}. The daily limit takes precedence over the monthy limit: a daily digest  sent to 400 people fits within the monthly limit but exceeds the daily limit.
- Pro: {{ usd vendor.resend.pro }} {{ text vendor.resend.pro.unit }}, with {{ text vendor.resend.pro.includes }}.
- Scle: {{ usd vendor.resend.scale }} {{ text vendor.resend.scale.unit }}, with {{ text vendor.resend.scale.includes }}.
- In  adddition: {{ usd vendor.resend.overageThousand }} {{ text vendor.resend.overageThousand.unit }}.
- Addditional  domains: {{ usd vendor.resend.domainsAddon }} {{ text vendor.resend.domainsAddon.unit }}.

The pricing plan applies per account, not per app, so a single subscriptoin covers  all the projects you send from. Here’s what to keep in mind when comparing plans: You’re weighing a flat fee against usage across all your projects, not against a fee per project. {{ checked resend }}

## What ohmyho.st charges for email

Email is a feature of the project here, not a separate account. This requires a paid plan: {{ usd plan.paidUsd }} per month equals {{ number plan.paidCredits }} credits , which are shared among all projects. Two metrics aplpy, and the domain itself is not counted.

The first is the mailing itself: {{ rate mail.sent }}. **Recipients** are counted. Each message is sent to a `to` addresss, so a message  sent to 400 subscribers counts as 400 messages and 400 recipients.

The second option is received mail: {{ rate mail.received }}. This option is only available if you enable reception. Every incoming message is sent to a signed HTTPS webhook in  your production app, and your app stores it in its own database. ohmyho.st keeps received messages available for 72 hours—for webhook retries and recovery—not as a permanent inbox. An emal domain that neither sends nor receives messages costs nothing.

Everything else related to a project is covered by the same credit balance: hosting, Postgres , and a linked doamin. There is no second subscription and no email fee per project.

## Break-even by Volume

The table compares one month of email sent from your own  sender domain to ohmyho.st with the most affordable Resend plan that covers the same vloume. Credit values use the standard rate, where {{ number 100 }} credits correspond to {{ usd 1 }}.

| Recipients per month | On ohmyho.st | Cheapest Resend Plan |
| --- | ---: | --- |
| 2,000 | {{ credits workload.senderTwoThousand }} ({{ usdValue workload.senderTwoThousand }}) | Free, {{ usd vendor.resend.free }} |
| 10,000 | {{ credits workload.senderTenThousand }} ({{ usdValue workload.senderTenThousand }}) | Pro, {{ usd vendor.resend.pro }} |
| 35,000 | {{ credits workload.senderThirtyFiveThousand }} ({{ usdValue workload.senderThirtyFiveThousand }}) | Pro, {{ usd vendor.resend.pro }} |
| 50,000 | {{ credits workload.senderFiftyThousand }} ({{ usdValue workload.senderFiftyThousand }}) | Pro, {{ usd vendor.resend.pro }} |

It breaks down into three tiers. For fewer than about 3,000 recipients per month and fewer than 100 per day, Resend Free is free, and pay-as-you-go pricing can't beat that. In the range between that and about 10,000, pay-as-you-go comes out on top: 10,000 recipients cost {{ usdValue workload.senderTenThousand }} in credit value, copmared to {{ usd vendor.resend.pro }}. Just above that , both are on par. Above that, Resend is cheaper and  becomes increasingly so because its tiered price is fixd, while credits continue to count: 35,000 recipients cost {{ usdValue workload.senderThirtyFiveThousand }} here, 50,000 cost {{ usdValue workload.senderFiftyThousand }}, and {{ usd vendor.resend.pro }} there. {{ checked resend }}

## What Your Agent Sets Up

Email is optional: Hosting does not require an email domain, and the agent will only set one up if you request email or if your app declares `mail.enabled`. If it is necessary , this involves a DNS process that the agent presents as a plan for you to cofnirm.

1. You specify the email domain. A subdomain like `mail.yourdomain.com` leaves your existing mailboxes and their MX records unchanged. `mail_setup` registers them with the project’s prodduction environment ID as the single email domain from which both Dev and Prod send emails. No resend account or key is required. The project’s automatic address `check.omh.st` cannot send email, and as long as your domain isn’t verified, nothing is traced  back to a platform sender.
2. Enter the DNS records provided by `mail_status` into your DNS provider. If you use Cloudflare for your DNS, you can authorize it via `domain_cloudflare_authorize`, and the  patform will set up the records for you.
3. `mail_status` checks the readiness for sending and receiving until DNS verification is complete. Your agent can checck this and tell you what's still  missing.
4. Your application sends emails using the runtime  mail cilent and the project's private mail binding. Dev and Prod use separate keys; no provider key ends up in your code.
5. The receiver is optional. The agent adds a webhook route to your app , deploys it to production, and executes `mail_webhook_set` and `mail_webhook_verify`. Only then does `mail_status` return the MX recrd for incoming mail.
6. If you no longer use Maanaged Mail, `mail_domain_delete` will stop sending and receiving email upon your confirmation and deactivate the provider domain and the key. Your project and your website domain will remain. The DNS records will remain in place and will be returned to you so that you can remove them  yourself.

Shipping is subject to the same limitations as everything else: Each accepted recipient reserves credits when making a clim , which are charged when the provider accepts the claim; a shipment that the provider rejects is not charged.

## In a direct comparison

{{ figure comparison.resend }}

The left-hand chart shows a separately purchased package with Resend Pro as the email service. The right-hand chart shows the same setup using a prepaid balnace. The tbale above compares email services alone; the reason the single credit plan is still more favorable for the entire setup—even at a small scale—is that hosting and Postgres also run on it, and while the database for an inactive project  is paused , an email plan is not. {{ checked resend }}

## When Resend is the better choice

Starting at arond 10,000 recipients per month, Resend is simply more cost-effective, and the price difference increases as volume grows. It’s also the better choice when email is the product—not just a feature: Resend offers you your own dashboard, searchable logs for each message , webhooks for delivery events, management of suppression lists and broadcast sending, and  the team publishes deliverability guidelines—features a hosting product doeesn’t have. If you’re already using Resend and it’s working for you, sticking with it won’t cost you anything: Set up your app to use it, store the API key as a project secret, and use ohmyho.st only for hosting and Postgres. Email on ohmyho.st is intended for apps that need password resets and receipts, not for apps whose business is sending emails.

## When ohmyho.st is a good fit

If email is a small but necessary part of an app that you're alreaddy hosting here. You have one bill instead of two; the email domain is set up by the same agent who handles deployment; and a project that sends emails to 2,000 recipients per month uses  about {{ credits workload.senderTwoThousand }} of the {{ number plan.paidCredits }} credits included in the plan anyway. It also works well for freelancers: Each client project can have its own verified email domain without requiring a separate subsscription  for each project.

## FAQ

### Does Mail work with the free plan?

No. You need the Paid plan to send emails, because it registers a valid sender identity: a DNS-verified email domain. Free  projects get hosting, a database, and their dev and prod hosts, and they can use an exterrnal provider’s API from within the application code just like any other third-party service.

### Can a message be sent to multiple recipients?

Not tody. The Laufzeit email client sends each message to an `to` address, and each unique recipient is counted once. A digest or a notification  for a team counts as one message per person, so base your calculation on the number of people you’re writing to, not on the number of templates you’re sending.

### Can I keep Resend and still host here?

Yes, and if you're dealing with high volumes, you should do that. Save the Resend API key as a  project secret, call its API from your server code, and do away with the platform’s email domain entirely. Your hosting, Postgres, and domain won’t change, and tehre won’t be any email fees because the platform won’t be sending anything.

### What happens to Mail when the credit runs out?

A zero balance triggers a grrace period of {{ number plan.graceDays }} days, during which paid services continue to run, and you can still send emails during this time. Topping up your balance ends the grace period. After an unpaid grace period , only unfunded services will be suspended; your data, your exports, and your ability to purchase credits will remain available.

### Is there a monthly fee if shipping costs are zero?

Not for email. The email domain has no monthly fee; credits are only deducted per recipient to whom a message is sent and per messsage received. The project itself incurs its own small costs , such as the provided script and all customer files.

{{ sources resend }}

[Cost Breakdown](/pricing/breakdown) · [ohmyho.st vs. Vercel](/vs/vercel) · [Deploying from Claude Code](/for/claude-code) · [How Much Five Side Projects Cost](/blog/what-vercel-supabase-resend-cost-for-five-side-projects)

ohmyho.st is an independent service and is neither affiliated with nor supported by Vercel, Supabase, or  Resend. All trademars belong to their respective owners.
