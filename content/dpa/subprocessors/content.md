# Provider register

Annex III to the ohmyho.st DPA. Version: September 24, 2026. The contracted entity and applicable service terms govern each engagement.

## Customer-workload subprocessors

| Provider | Role and data | Processing locations / applicable documents |
| --- | --- | --- |
| Cloudflare | Website/edge delivery and security, application builds and execution, storage (including build artifacts and SQL export archives) and relevant request/content data for the configured services | Global edge and support operations, including the US; storage placement follows the configured resource. [Cloudflare DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) and its subprocessor register |
| Amazon Web Services | Direct use is being retired. During that migration AWS still runs the SQL export job, which reads the project database to build a requested archive, and still holds mail resources (SES sender identities, Route 53 sender zones and related records) for sender domains set up before the move to Resend. Customer builds no longer run on AWS. This row is removed only once those resources are retired. | US East. Neon and Resend also run parts of their own services on AWS, as described in their rows. [AWS data-processing terms](https://aws.amazon.com/compliance/gdpr-center/) and relevant regional/service documentation |
| Neon | Managed Postgres and its associated storage/history, containing the database records submitted by Customer | A project's database runs on AWS US East by default, or AWS EU Central when EU is chosen at project creation; existing control databases have separate EU placement. [Neon terms](https://neon.com/platform-terms) and [published data-processing clauses](https://neon.com/pdf/DPA.pdf), subject to the agreement applicable to the account |
| Resend (Plus Five Five, Inc.) | Transactional mail for projects that configure a mail domain: outgoing messages with sender, recipient, subject and content; for domains with receiving turned on, incoming messages and attachments; delivery events, logs and mail-domain DNS records | United States. Resend states that it stores customer data, including message content, delivery logs and webhook payloads, in the US, and it publishes a 30-day retention of email and log data for the Scale plan that ohmyho.st uses. Resend uses its own subprocessors, including Amazon Web Services for hosting and sending. [Resend DPA](https://resend.com/legal/dpa) · [Resend subprocessors](https://resend.com/legal/subprocessors) · [Resend GDPR information](https://resend.com/security/gdpr) |

The selected capabilities determine which providers receive workload data. Provider data-centre, support and onward-processing arrangements are not established solely by selecting a region. Subprocessor changes follow the notice and objection procedure in the DPA.

Changes in this version (September 24, 2026): Resend is listed for the transactional mail it processes for projects that use managed mail; the AWS row describes the processing that remains while direct AWS use is retired; Cloudflare now also runs customer builds; Neon placement reflects the US or EU choice made at project creation.

## Account, business and customer-selected services

WorkOS supports ohmyho.st account identity and authorisation. Stripe handles enabled payments, subscriptions, invoices and tax calculation. GitHub supplies authorised source repositories. Mintlify delivers public documentation, search and the documentation assistant, including visitor requests and submitted search/assistant text; it does not receive application databases or runtime secrets as part of documentation hosting. They process relevant account/business data in the roles set out in their applicable terms and our Privacy notice; they are not automatically recipients of every customer's application database or files. [WorkOS DPA](https://workos.com/legal/data-processing-addendum) · [Stripe DPA](https://stripe.com/legal/dpa) · [Mintlify privacy](https://www.mintlify.com/legal/privacy).

A customer's own auth provider, coding agent, automation service or external integration is selected and contracted by that customer unless expressly included in an ohmyho.st order.

[Transfer safeguards](/dpa/transfers) · [Privacy notice](/privacy) · [Contact form](/contact)
