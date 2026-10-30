# Provider register

Annex III to the ohmyho.st DPA. Version: October 30, 2026. The contracted entity and applicable service terms govern each engagement.

## Customer-workload subprocessors

| Provider | Role and data | Processing locations / applicable documents |
| --- | --- | --- |
| Cloudflare | Website/edge delivery and security, application builds and execution, SQL export jobs, storage (including build artifacts and SQL export archives), the platform control database (Cloudflare D1, EU jurisdiction) and relevant request/content data for the configured services | Global edge and support operations, including the US; storage placement follows the configured resource. [Cloudflare DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) and its subprocessor register |
| Contabo GmbH, Germany | Hosts the PGCF infrastructure for active managed PostgreSQL databases | US or EU for new projects according to their selected region. Existing application databases migrated with their owner's authorization use US infrastructure; recorded R2 object locations remain unchanged. [Legal notice](https://contabo.com/en-us/legal/impressum/) · [DPA documentation](https://docs.contabo.com/docs/dpa/dpa/) |
| Neon | Retained application databases and associated records from before migration. Neon no longer hosts platform control databases | Retained application databases keep their original recorded US or EU location; migration does not itself delete retained Neon data. [Neon terms](https://neon.com/platform-terms) and [published data-processing clauses](https://neon.com/pdf/DPA.pdf), subject to the agreement applicable to the account |
| Resend (Plus Five Five, Inc.) | Transactional mail for projects that configure a mail domain: outgoing messages with sender, recipient, subject and content; for domains with receiving turned on, incoming messages and attachments; delivery events, logs and mail-domain DNS records | United States. Resend states that it stores customer data, including message content, delivery logs and webhook payloads, in the US, and it publishes a 30-day retention of email and log data for the Scale plan that ohmyho.st uses. Resend uses its own subprocessors, including Amazon Web Services for hosting and sending. [Resend DPA](https://resend.com/legal/dpa) · [Resend subprocessors](https://resend.com/legal/subprocessors) · [Resend GDPR information](https://resend.com/security/gdpr) |

The selected capabilities determine which providers receive workload data. Provider data-centre, support and onward-processing arrangements are not established solely by selecting a region. Subprocessor changes follow the notice and objection procedure in the DPA.

Changes in this version (October 30, 2026): The platform control databases for account, project, deployment and usage records moved from Neon to Cloudflare D1 (EU jurisdiction) and the Neon control databases were deleted; Neon is listed only for retained pre-migration application databases until they are separately deleted. Contabo GmbH remains listed for active PGCF database infrastructure. New projects retain their US or EU database choice. Existing application databases migrated with their owner’s authorization use US infrastructure; retained R2 objects remain at their recorded locations. Cloudflare stores database backups and SQL export archives in R2. Earlier project SES, Route 53 and AWS export resources remain retired; Neon and Resend can use their own AWS infrastructure.

## Account, business and customer-selected services

WorkOS supports ohmyho.st account identity and authorisation. Stripe handles enabled payments, subscriptions, invoices and tax calculation. GitHub supplies authorised source repositories. Mintlify delivers public documentation, search and the documentation assistant, including visitor requests and submitted search/assistant text; it does not receive application databases or runtime secrets as part of documentation hosting. They process relevant account/business data in the roles set out in their applicable terms and our Privacy notice; they are not automatically recipients of every customer's application database or files. [WorkOS DPA](https://workos.com/legal/data-processing-addendum) · [Stripe DPA](https://stripe.com/legal/dpa) · [Mintlify privacy](https://www.mintlify.com/legal/privacy).

A customer's own auth provider, coding agent, automation service or external integration is selected and contracted by that customer unless expressly included in an ohmyho.st order.

[Transfer safeguards](/dpa/transfers) · [Privacy notice](/privacy) · [Contact form](/contact)
