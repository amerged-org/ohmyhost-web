# Provider register

Annex III to the ohmyho.st DPA. Version: September 14, 2026. The contracted entity and applicable service terms govern each engagement.

## Customer-workload subprocessors

| Provider | Role and data | Processing locations / applicable documents |
| --- | --- | --- |
| Cloudflare | Website/edge delivery and security, application execution, storage and relevant request/content data for the configured services | Global edge and support operations, including the US; storage placement follows the configured resource. [Cloudflare DPA](https://www.cloudflare.com/cloudflare-customer-dpa/) and its subprocessor register |
| Amazon Web Services | Source/build artifacts, execution/export infrastructure and enabled transactional-mail processing, including content needed for those tasks | New customer build/execution resources use US East; mail and control/recovery resources can have separately configured regions. [AWS data-processing terms](https://aws.amazon.com/compliance/gdpr-center/) and relevant regional/service documentation |
| Neon | Managed Postgres and its associated storage/history, containing the database records submitted by Customer | New customer databases are in AWS US East; existing control databases have separate EU placement. [Neon terms](https://neon.com/platform-terms) and [published data-processing clauses](https://neon.com/pdf/DPA.pdf), subject to the agreement applicable to the account |

The selected capabilities determine which providers receive workload data. Provider data-centre, support and onward-processing arrangements are not established solely by selecting a region. Subprocessor changes follow the notice and objection procedure in the DPA.

## Account, business and customer-selected services

WorkOS supports ohmyho.st account identity and authorisation. Stripe handles enabled payments, subscriptions, invoices and tax calculation. GitHub supplies authorised source repositories. Mintlify delivers public documentation, search and the documentation assistant, including visitor requests and submitted search/assistant text; it does not receive application databases or runtime secrets as part of documentation hosting. They process relevant account/business data in the roles set out in their applicable terms and our Privacy notice; they are not automatically recipients of every customer's application database or files. [WorkOS DPA](https://workos.com/legal/data-processing-addendum) · [Stripe DPA](https://stripe.com/legal/dpa) · [Mintlify privacy](https://www.mintlify.com/legal/privacy).

A customer's own auth provider, coding agent, automation service or external integration is selected and contracted by that customer unless expressly included in an ohmyho.st order.

[Transfer safeguards](/dpa/transfers) · [Privacy notice](/privacy) · [Contact form](/contact)
