/** Published legal documents for the current service; updates are versioned with the release. */
export const LEGAL_DOCUMENTS: Record<string, string> = {
  "/privacy": `# Privacy notice

Effective date: September 14, 2026.

## 1. Responsibility and contact

Amerged B.V., KVK 42154221, Venray, Limburg, NL, operates ohmyho.st. We are the controller for personal data used to operate our website, manage accounts, answer enquiries, administer billing and protect the service. Use our [contact form](/contact) for all privacy questions and requests to exercise your rights.

When a customer uses ohmyho.st to process personal data in an application, the customer determines its purposes and lawful basis. We process that customer data on documented instructions under our [Data Processing Agreement](/dpa). If your question concerns an application hosted by a customer, contact that application's operator; we assist our customer with requests concerning data processed for them.

## 2. What we process and why

| Activity | Data | Purpose and legal basis |
| --- | --- | --- |
| Website delivery and security | Network address, request time, requested resource, browser/protocol information and necessary security events | Deliver pages, prevent abuse and diagnose faults; our legitimate interests in a secure, available service, Article 6(1)(f) GDPR |
| Earlier beta-interest registrations (closed) | Email address, submission time and the consent version accepted at the time | Registration closed when public signup opened: we collect no new registrations and only keep existing records until they expire; consent, Article 6(1)(a) |
| Referral and signup source | The entry link’s r value, aggregate campaign observations, and the source associated with a verified signup | Remember the selected entry and administer configured referral eligibility; Article 6(1)(b) for requested benefits, and Article 6(1)(f) for proportionate acquisition analysis |
| Roadmap votes | Selected topic and positive, negative or removed choice, hashed random browser identifier, request identifier and submission time | Save and restore your requested vote and prevent duplicate retries; legitimate interests, Article 6(1)(f); this is not proof of a unique person |
| Contact and privacy requests | Name, email, optional company, message, request identifier and timestamps | Answer your request; Article 6(1)(b) for contract-related enquiries, Article 6(1)(f) for other correspondence, and Article 6(1)(c) for statutory requests |
| Accounts and access | Name, email and verification status, account/organisation identifiers, login and membership information, authorisations, token metadata and security records | Provide and secure the account; Article 6(1)(b), or Article 6(1)(f) when you represent a business customer |
| Hosting operations | Authorised repository/commit metadata, project configuration, deployment events, diagnostics and measured consumption | Deliver, support and account for requested services; contract performance or our legitimate interests in administering a business customer relationship |
| Billing | Billing address and optional business tax ID, customer/invoice/payment references, credits, subscriptions, refunds, recharge settings and recorded payment consent | When billing is enabled for your account, calculate applicable tax, administer authorised purchases and fulfil accounting obligations; Articles 6(1)(b) and 6(1)(c) |

We receive these data from you and your authorised agents, your requests to the service, and the identity, repository, infrastructure or payment provider involved in your selected workflow. Project and user identifiers in a prompt do not themselves authorise access.

Providing contact details is necessary for us to respond. Company is optional for individuals. Do not include passwords, access tokens or unnecessary sensitive information in a message. We do not use the contact form to create a hosting account or enrol you in a marketing newsletter.

## 3. Customer applications and agents

Customers control the personal data their applications collect, including their own authentication, application content and uploaded files. The DPA describes our processing of that data. Customers must provide their own notices and obtain any permissions required for their applications.

You choose the agent or harness used with the CLI, API or MCP. Data you provide to that agent, and data you authorise it to retrieve, is also handled under your arrangements with its provider. A hosting login is separate from an application's end-user login. We do not use customer application content to train a general-purpose AI model.

## 4. Recipients

We limit access to authorised personnel and service providers whose access is needed for their role. Cloudflare provides website/edge delivery, security, application execution and storage; AWS provides build, execution, export and enabled mail infrastructure; Neon provides managed Postgres. WorkOS provides our account authentication and authorisation services. GitHub supplies repository access authorised by the customer. Mintlify hosts our public documentation and its search functionality; documentation visits, searches and messages submitted to its assistant are processed for that purpose, so do not submit credentials or private customer records there. When payments are enabled, Stripe handles payments, subscriptions, invoices and tax calculation; payment credentials entered in Stripe’s checkout are handled by Stripe, not stored as full card details in the hosting account.

The [provider register](/dpa/subprocessors) distinguishes workload subprocessors from providers used for our own account and business administration. Customer-selected authentication, agent and integration providers are governed by the customer's own arrangements. We do not sell personal data, and we do not use advertising pixels or cross-site marketing trackers on ohmyho.st or app.ohmyho.st. Documentation at docs.ohmyho.st is hosted by Mintlify; its own cookies and service telemetry are governed by its applicable privacy terms.

We disclose data where required by applicable law or a binding request, and assess the validity, scope and available means of challenge before disclosure where permitted. We may disclose relevant records to professional advisers bound by confidentiality when necessary for a legal claim or obligation.

## 5. International processing

Amerged B.V. is established in the Netherlands. Customer projects choose US East or the EU when they are created, with US East as the default. This choice places the project's database, files and builds; the application runs next to its database. The separate control databases currently have EU placement, while transactional mail, edge delivery, provider support and some operational processing have their own locations. This workload placement does not localise every provider’s processing. We therefore do not describe the service as EU-only storage. Access and processing outside the EEA can occur through the providers used for the selected services.

Restricted transfers require an applicable adequacy decision or another valid Chapter V safeguard, including the European Commission's Standard Contractual Clauses where needed. An adequacy mechanism, such as the EU–US Data Privacy Framework, is relied on only when the recipient's current certification and the particular transfer are covered. Our [transfer annex](/dpa/transfers) explains the applicable roles and safeguards. You can request information about the safeguards through the contact form.

## 6. Retention

Roadmap vote changes and request identifiers are deleted twelve months after each submission; repeating a request does not extend its retention. Removed choices are retained for that period only to prevent an earlier retry from restoring them. The browser cookie lasts up to twelve months after use. Earlier feature-interest records are retained only until their own twelve-month expiry and are not assigned an invented browser identity.

Aggregate referral counts expire after thirty days without a new observation. At successful signup, the selected entry source is also associated with the authenticated user for acquisition analysis and eligibility for configured referral credits; later sign-ins do not overwrite that attribution. This account attribution is retained with the account and necessary grant records. Beta-interest records from the closed registration are deleted twelve months after their submission, or earlier on withdrawal; registration closed when public signup opened, so no new record is collected and none can extend that period. Contact-form records are retained for no longer than twelve months from submission as contact-request records and may be deleted earlier when no longer needed. Records separately required to fulfil a statutory obligation or establish, exercise or defend a claim are limited to that purpose and the applicable period.

New API keys have no scheduled expiry: they remain usable until revoked, while access always depends on current membership and permissions. This is separate from the seven-day browser-session lifetime. Key identifiers, masked values, creation/last-use information and revocation/security records are retained as needed to administer access; the full issued token is shown once and is not retrievable from the portal.

Account and operational records are retained while needed to provide and secure the account, reconcile usage and resolve outstanding matters. Billing records are retained for the applicable statutory accounting period. Retention of customer application data follows documented customer instructions and the DPA. On-demand encrypted SQL export archives have a seven-day retention period; issued download links are valid for 24 hours. A downloaded customer copy is under the customer's control. Deletion from active resources and expiry of restricted backup copies are distinct steps; backup copies expire under the retention lifecycle of the provider holding them.

## 7. Cookies and similar technologies

The main website and account portal use the technical cookies and storage listed in our [cookie notice](/cookies) for access, security, referral handling and requested functions. They are not used for advertising or cross-site profiling. The main website and portal serve their fonts from ohmyho.st. Documentation on docs.ohmyho.st is delivered by Mintlify, which may use its own cookies and service telemetry under its privacy notice; the cookie table in our cookie notice covers the main website and portal, not docs.ohmyho.st. Independently visited identity/payment services and customer applications have their own notices.

## 8. Your rights

Subject to the applicable conditions, you may request access, correction, erasure, restriction, portability, or object to processing based on legitimate interests. You may withdraw consent at any time without affecting processing lawfully carried out before withdrawal. You may complain to the [Autoriteit Persoonsgegevens](https://autoriteitpersoonsgegevens.nl/en) or another competent supervisory authority.

Use the contact form to identify your request. We may request proportionate information to verify identity or authority; do not submit an identity-document copy unless we specifically explain why it is needed. We respond within the applicable statutory period, ordinarily one month, and explain any permitted extension. We do not make decisions producing legal or similarly significant effects about individuals solely by automated means through the website or contact form.

Where an applicable US state privacy law grants rights, you may also use the contact form to request access, correction, deletion, a portable copy, or an appeal of a denied request, and may use an authorised representative as that law permits. We verify requests proportionately, explain denials and follow the applicable response period. We do not discriminate for exercising protected privacy rights. We do not sell personal information, share it for cross-context behavioural advertising, or process it for targeted advertising; a browser opt-out signal does not prevent ordinary login, security or requested service processing.

## 9. Changes

We publish the current version and effective date here and communicate material changes through an appropriate service channel where required. [Contact us](/contact) · [Cookie notice](/cookies) · [DPA](/dpa)`,
  "/cookies": `# Cookie notice

Effective date: September 14, 2026.

## Only technical cookies

The main website at ohmyho.st and account portal at app.ohmyho.st use technical cookies and similar storage for login, security, referral handling and functions you request, including saving roadmap votes. We do not use these identifiers for advertising, behavioural analytics or cross-site profiling. The small notice is informational: its OK button dismisses the notice and does not authorise marketing or a purchase. A referral label is retained for acquisition analysis as explained in the Privacy notice; it is not a cross-site visitor identifier.

| Technology | Purpose | Duration / scope |
| --- | --- | --- |
| omh_referral | Remember the entry link’s r value and pass it to the login link and install command as signup attribution; no unique visitor identifier | Up to 30 days; first-party, Secure, HttpOnly, SameSite=Lax |
| omh_cookie_notice | Remember that you dismissed the technical-cookie notice | Up to 180 days; first-party website preference, no unique visitor identifier |
| __Host-omh-session | Keep the authenticated account portal session, protect form actions and renew WorkOS access server-side | Up to seven days; encrypted and authenticated, host-only, Secure, HttpOnly, SameSite=Lax; cleared on logout or invalidation |
| __Host-omh-login | Protect the browser login handoff using state and PKCE | Up to ten minutes; Secure, HttpOnly, SameSite=Lax; cleared after the handoff |
| __Host-ohmyhost_dev_access | Authorise access to a private customer Dev environment after a single-use link is redeemed | Up to twelve hours; host-only, Secure, HttpOnly, SameSite=Lax |
| Authentication and security cookies used by WorkOS and the identity provider you sign in through it | Maintain the requested login and protect authentication | The login service's session/security expiry; only when that service is used |
| Cloudflare security cookies, where its protection requires them | Detect abusive traffic or remember a successfully completed security challenge | Expiry follows the enabled mechanism, described in [Cloudflare’s cookie documentation](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/) |
| __Host-omh_voter | Restore your roadmap votes for this browser; the server stores only a hash of the random identifier, not a verified personal identity | Up to twelve months after use; host-only, Secure, HttpOnly, SameSite=Lax; not used for analytics, advertising or account access |

## Documentation and separate provider pages

Our documentation at docs.ohmyho.st is hosted by Mintlify, which may use its own cookies and service telemetry for that service. Its delivery, search and assistant receive the requests you submit and use their own service infrastructure. The cookie table above describes the main website and portal; it does not classify every cookie used by a separately hosted provider as technical. See [Mintlify’s privacy notice](https://www.mintlify.com/legal/privacy) for its processing. Optional analytics, advertising or tracking integrations require an appropriate notice and consent where required before they are enabled.

The hosting CLI's locally stored credentials are not website cookies. Application-auth cookies in a customer's own application are controlled by that customer. Likewise, a separately opened GitHub, identity-provider or payment-provider page operates under that provider's own cookie notice; this notice does not classify those independent sites' cookies.

## Your controls

You can remove or block cookies in your browser and clear site storage. Blocking a login, security or private-access cookie can prevent the function you requested from working. Removing the notice preference displays the notice again. Blocking the roadmap cookie prevents votes from being saved; deleting it disconnects this browser from its earlier votes until those records expire. There are no optional tracking categories to enable or reject on ohmyho.st or app.ohmyho.st; this statement does not cover docs.ohmyho.st or independently visited providers’ pages.

[Privacy notice](/privacy) · [Contact form](/contact)`,
  "/dpa": `# Data Processing Agreement

Version: September 14, 2026.

## 1. Parties, scope and order of precedence

This Data Processing Agreement (DPA), including Annex I (Description of processing) below, [Annex II — TOMs](/dpa/toms), [Annex III — Providers](/dpa/subprocessors) and [Annex IV — Transfers](/dpa/transfers), is incorporated into the [ohmyho.st Terms of Service / Master Services Agreement (MSA)](/terms). The parties are the customer accepting those terms for the identified account or organisation (Customer) and Amerged B.V., KVK 42154221, Venray, Limburg, NL (Processor). It applies to personal data processed by Processor on Customer’s behalf to provide the service. Acceptance of the Terms includes this DPA and its annexes; a visit to the website alone does not establish a processing agreement.

Customer acts as controller, or as a processor authorised by its controller to appoint Processor as a subprocessor. Each party fulfils the obligations applicable to its role. This DPA prevails over conflicting service terms on the processing it covers; applicable Standard Contractual Clauses prevail over conflicting terms of either document.

Account administration, billing, service security and correspondence for which Amerged B.V. determines its own purposes are covered by the Privacy notice rather than treated automatically as processing on Customer's instructions.

## 2. Documented instructions

Processor processes Customer Personal Data only to provide the agreed services and on documented instructions, including the service agreement, this DPA, the selected configuration and actions submitted by Customer's authorised users or agents. Customer is responsible for its agents' authority and for the lawfulness of its instructions, notices and collection of data. A configuration or agent instruction does not waive this DPA or applicable data protection law.

Processor does not sell Customer Personal Data, use it for its own advertising, or use customer application content to train a general-purpose AI model. If Union or Member State law to which Processor is subject requires processing outside Customer's instructions, Processor informs Customer before processing unless that law prohibits notification. Processor promptly informs Customer if, in its opinion, an instruction infringes applicable data protection law and may suspend the affected instruction while the issue is resolved.

## 3. Confidentiality and security

Access is limited to authorised persons with a need to access the data and an appropriate confidentiality obligation. Processor applies technical and organisational measures appropriate to the risk, taking account of the nature, scope, context and purposes of processing. The current baseline is set out in [Annex II — Technical and organisational measures](/dpa/toms).

Processor may update measures to respond to technical change and risk without materially reducing the overall protection of Customer Personal Data. Customer remains responsible for the security and lawful design of its application, its users and agents, the credentials it controls and the choices it makes between shared and isolated environments.

## 4. Subprocessors

Customer gives general written authorisation to engage the workload subprocessors identified in [Annex III — Provider register](/dpa/subprocessors). Processor imposes written obligations on each subprocessor providing at least the protection required by Article 28 GDPR for its processing and remains responsible to Customer for the subprocessor's performance of those obligations.

Processor gives at least 30 days' prior notice of a new or replacement workload subprocessor through the registered customer contact, together with the relevant service and processing location. Customer may object on reasonable data-protection grounds within that period. The parties work in good faith on an alternative; if no reasonable solution is available, Customer may end the affected service before the change takes effect. An urgent security or legal replacement is communicated as soon as practicable with the reason and available alternatives. This does not remove mandatory rights under applicable SCCs.

## 5. Assistance and individual rights

Taking account of the processing and information available, Processor assists Customer with requests for access, correction, deletion, restriction and portability, and with obligations under Articles 32–36 GDPR, including security assessments, breach notifications, impact assessments and consultation with supervisory authorities.

If Processor receives a request concerning data it processes for Customer, it forwards the request to Customer without undue delay and does not respond on Customer's behalf unless instructed or legally required. Requests concerning Processor’s independent-controller activities follow the Privacy notice. The [contact form](/contact) is the public channel for submitting requests and obtaining the appropriate secure follow-up.

## 6. Personal data breaches

Processor notifies Customer without undue delay after becoming aware of a personal data breach affecting Customer Personal Data. The notification includes, as information becomes available, the nature of the breach; affected data and persons; likely consequences; containment and remediation; and a contact route for follow-up. Information may be provided in phases where it cannot reasonably be supplied at once.

Processor takes reasonable steps to contain, investigate and mitigate the breach, preserves relevant evidence and cooperates with Customer. Customer decides on notifications to individuals and authorities in its controller role, without prejudice to Processor's own legal obligations.

## 7. International transfers

Processor makes restricted international transfers only on documented instructions and with a valid Chapter V GDPR mechanism. Selected US infrastructure and access from outside the EEA are addressed in [Annex IV — International transfers](/dpa/transfers). Where SCCs are required, the applicable unmodified Commission clauses, module and completed annexes govern that particular transfer. A customer-to-amerged transfer within the EEA does not become a restricted transfer merely because an onward subprocessor is in the US.

## 8. Information and audits

Processor makes available information reasonably needed to demonstrate compliance with this DPA and allows and contributes to audits, including inspections, by Customer or an independent auditor bound by confidentiality. The parties agree a proportionate scope, timing and safeguards for other customers' data and system security. Existing documentation may be used where it adequately answers the issue, but does not eliminate an audit required by law or justified by a breach or substantiated compliance concern. Reasonable notice applies except where the circumstances require urgency. These arrangements do not restrict a supervisory authority's powers.

## 9. Return and deletion

At the end of the affected services, or on Customer's documented instruction, Processor returns or deletes Customer Personal Data, at Customer's choice, and deletes remaining copies unless applicable law requires their retention. Return is through the supported export mechanisms or an agreed secure handover; the SQL ZIP export is not represented as an export of every file or category of service data.

Customer chooses and retains its SQL-export password. Downloads made by Customer are under Customer's control. Active-resource deletion and expiry of backup copies are distinct. Restricted backup copies remain protected, are not used for another purpose, and expire under the applicable retention lifecycle; deletion instructions must be reapplied if such a copy is restored. Processor supplies confirmation of the completed deletion process on request. Data retained by law is isolated from ordinary use and retained only for the required purpose and period.

## 10. Applicable US processor obligations

Where Customer Personal Data is subject to a US state privacy law requiring a processor, service-provider or contractor agreement, Processor acts in that capacity for the specified services and purposes in Annex I. Processor does not sell or share that information for cross-context behavioural advertising, use it for targeted advertising, or retain, use or disclose it outside those purposes or the direct service relationship except as the applicable law permits. Processor does not combine it with personal information from other customers or its own consumer interactions except as permitted to provide the contracted service under that law.

Processor applies the required level of privacy protection, helps Customer meet applicable consumer-request obligations, and notifies Customer if it determines that it can no longer meet those obligations. Customer may take reasonable steps to verify compliance and, following notice, stop and remediate unauthorised processing; the information and audit arrangements above support that right. Further processors receive appropriate written restrictions, and changes follow section 4. These provisions apply only to the extent that the relevant law applies; they do not reclassify independent account/billing processing as Customer instructions.

## 11. Duration and responsibility

This DPA continues while Processor holds Customer Personal Data under the agreement, including protected retention copies. Mandatory data-subject rights, regulatory powers and applicable SCC rights are unaffected by the agreement's allocation of responsibility. Customer can request a copy of the operative documents or submit an instruction through the contact form and a secure channel agreed with Customer.

## Annex I — Description of processing

| Item | Description |
| --- | --- |
| Subject matter | Provision of the hosting capabilities ordered and configured by Customer |
| Nature and operations | Receipt, transmission, organisation, storage, retrieval, execution of application requests, authorised access, export and deletion; build/deployment, database, file, runtime and enabled transactional-mail processing as applicable |
| Purpose | Host and operate Customer's application and perform its authorised service instructions |
| Duration and frequency | Continuous or request-driven during the service, followed by the documented return/deletion and protected-retention lifecycle |
| Data subjects | Customer's authorised personnel, application users, visitors, contacts and other persons whose data Customer lawfully submits |
| Data categories | Application-defined identifiers, contact details, account/content records, uploaded files, transaction or communication records, network/request metadata and diagnostic data, only to the extent present in the selected workload |
| Sensitive data | Special-category data under Article 9 and criminal-offence data under Article 10 require a separate written arrangement establishing appropriate safeguards before being intentionally submitted |
| Customer details and instructions | The customer identity and authorised contact recorded in the service agreement/account, together with its selected projects, environments and configuration |
| Processor contact | Amerged B.V., KVK 42154221, Venray, Limburg, NL; public requests through the contact form, followed by an appropriate secure channel |

[Annex II: TOMs](/dpa/toms) · [Annex III: Providers](/dpa/subprocessors) · [Annex IV: Transfers](/dpa/transfers)`,
  "/dpa/toms": `# Technical and organisational measures

Annex II to the ohmyho.st DPA. Version: September 14, 2026.

Statements about authentication, encryption, scoping, validation and export limits describe the current technical controls; personnel, review, notification and incident-response procedures are Processor’s organisational commitments under this annex.

## Governance and authorised access

Access to production management systems is restricted to authorised personnel and service identities. Interactive access uses the relevant provider's authentication and available multifactor protection; automation uses scoped credentials. Access is assigned for the required role, reviewed when responsibilities change and removed when no longer required. Persons permitted to process Customer Personal Data are subject to confidentiality obligations.

## Tenant and environment separation

Product requests are authenticated and authorised against the relevant organisation, project, environment and action. Data access and resource changes use the authorised scope. Platform Dev and Prod use separate resource/binding and credential configurations. Customers explicitly select shared or isolated application Dev/Prod data; isolated mode scopes database, runtime and file references to the chosen environment. A shared-data selection intentionally shares those resources and does not represent isolation between Dev and Prod.

## Credentials and encryption

Public service endpoints use HTTPS. Database connections use encrypted transport with server validation in the supported connection paths. Infrastructure storage uses the storage provider's encryption controls. Application runtime secrets are encrypted separately in the control system and delivered only to the intended runtime environment; secret listing exposes metadata rather than plaintext. Management credentials are separated from customer source, untrusted builds and public client responses.

API-token creation exposes the new value once through the supported flow; full-token retrieval and a reversible user-token vault are not provided. New keys have no scheduled expiry and remain subject to revocation, current membership and permissions. Browser sessions and short-lived handoffs expire separately. Deliberate local credential persistence applies owner-only file controls. Short-lived handoffs and download capabilities have bounded lifetimes and remain subject to their scope. These controls do not make service execution end-to-end encrypted against every infrastructure operator.

## Application and build isolation

Source is acquired from an explicitly authorised GitHub repository and tied to the selected commit. Build and runtime contracts validate supported capabilities and declared configuration. Customer execution does not receive platform-management credentials. Runtime secrets are delivered separately from the source/build transfer. Changes are scoped, versioned and recorded; promotion of isolated environments applies versioned schema changes without copying Dev records over Prod.

## Data minimisation and safe interfaces

Requests and external responses are validated at the service boundary. Inputs are bounded, database statements are parameterised, public registration responses do not echo submitted personal data, and anonymous entry routes have separate request limits. Operational reporting uses appropriate organisation/project scope. Public deployment statistics, where requested, expose aggregate counts rather than customer or repository identifiers; the homepage does not display a customer deployment counter. Roadmap votes use a hashed browser identifier without publicly exposing a person or their account.

## Logging and accountability

Relevant operations, authorisations, usage and cleanup outcomes are recorded with identifiers and timestamps. Long-running operations have observable states and idempotency controls. Diagnostic paths use bounded records and safe error fields. Credentials, raw secret values and contact-form messages are excluded from ordinary application error output; access to retained operational records is restricted. Customer agents should submit redacted reproductions rather than credentials or raw personal records in feedback.

## Recovery and deletion

Recovery procedures use the selected database and storage capabilities. On-demand SQL exports are asynchronous password-encrypted ZIP archives, limited to one accepted request per project per rolling 24 hours. The customer controls the password; it is not kept as a recoverable customer password vault. The archive lifecycle is seven days and authorised download links last 24 hours. Export/restore procedures have been exercised through the supported workflow. Recovery capability does not establish a guaranteed recovery point or recovery time for every workload.

Deletion follows scoped operation records and provider observations. Retained backups are restricted and expire under their applicable lifecycle. Website beta-interest, contact and roadmap-vote records have explicit expiry timestamps and are purged through the existing maintenance process. Legal or data-subject requests are handled through the contact channel and recorded with access limited to responsible personnel.

## Change and vulnerability management

Source changes undergo review and relevant automated checks, including type, contract, regression and build checks. Release artifacts identify their source and integrity metadata. Provider bindings are checked during release to avoid unintended configuration changes. Reported defects and dependency/security findings are assessed and corrected according to their impact. Infrastructure providers maintain the physical security of their own facilities; this document does not represent a separate amerged certification of those facilities.

## Incident handling

Suspected incidents are assessed, contained and investigated using available logs and provider information. Access can be restricted and affected processing isolated. Customer notifications and follow-up information follow the DPA's breach provisions. Measures evolve with the service and risks without materially reducing the agreed overall protection.

[Data Processing Agreement](/dpa) · [Contact form](/contact)`,
  "/dpa/subprocessors": `# Provider register

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

[Transfer safeguards](/dpa/transfers) · [Privacy notice](/privacy) · [Contact form](/contact)`,
  "/dpa/transfers": `# International transfers and SCCs

Annex IV to the ohmyho.st DPA. Version: September 14, 2026.

## When SCCs are needed

Amerged B.V. is established in the Netherlands. An EEA customer's appointment of Amerged B.V. as processor is governed by Article 28 GDPR and our DPA; it does not, by itself, require international-transfer SCCs between that customer and Amerged B.V.

The service also uses US and global infrastructure. Transfers to, or access by, a separate recipient outside the EEA require a valid Chapter V GDPR basis where that chapter applies. An applicable adequacy decision can provide that basis. Reliance on the EU–US Data Privacy Framework requires a current, in-scope certification of the recipient; US location alone is not evidence of certification. Where adequacy does not cover the transfer, appropriate safeguards, ordinarily the applicable SCCs, are required before the transfer proceeds.

## Applicable clauses and roles

The relevant EU international-transfer clauses are those in the Annex to [Commission Implementing Decision (EU) 2021/914](https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj/eng). Their operative text is used without rewriting it. A summary page or a provider's compliance badge does not replace the clauses or a completed transfer assessment.

For customer workload data, amerged generally acts as processor and the infrastructure recipient as subprocessor: Module Three applies where SCCs are the required mechanism. For account or business data for which amerged is controller and a non-EEA recipient is processor, Module Two applies where appropriate. The applicable provider agreement supplies the contracting importer, selected options and completed annexes for that engagement. AWS, Cloudflare and WorkOS publish contractual SCC arrangements in their data-processing terms; Neon’s [published DPA](https://neon.com/pdf/DPA.pdf) also provides transfer clauses, whose applicability and module depend on the signed account agreement. These provider instruments govern the onward transfer rather than incorrectly identifying an EU customer as a direct exporter to every infrastructure supplier.

Stripe, GitHub and Mintlify receive payment, repository-authorisation or documentation-visitor data in the roles described in the Privacy notice and provider register. Any restricted transfer to these recipients must be covered by an appropriate mechanism under the applicable engagement, with the recipient’s actual role and instrument recorded. A payment provider’s independent-controller activity is not automatically a Module Two relationship; the service name alone does not determine the transfer module.

## Transfer record and supplementary measures

For each restricted transfer, the operative record must identify the exporter/importer, subject matter, categories of data and people, purposes, frequency, retention, competent supervisory authority, applicable module/options and technical and organisational measures. Annex I of our DPA describes the workload, and Annex II describes our measures; supplier-specific annexes must also describe the recipient's actual processing.

The assessment must consider the destination's relevant laws and practices, the data, access needs and supplementary measures. Measures can include encrypted transit and storage, restricted credentials and access, data minimisation, separation of management credentials and handling of government requests. Encryption is not treated as preventing access by a recipient that needs plaintext to provide the service.

If the required level of protection cannot be maintained, the affected transfer must be suspended or an effective alternative put in place. Copies or information about applicable safeguards can be requested through the contact form, with necessary protections for confidential information. UK or Swiss data requires the applicable local transfer instrument where relevant, rather than assuming the EU text alone covers every jurisdiction.

[Official SCC text](https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj/eng) · [DPA](/dpa) · [TOMs](/dpa/toms) · [Contact form](/contact)`,
  "/contact": `# Contact us

Use this form for questions about ohmyho.st, privacy, your rights or the Data Processing Agreement. Company is optional for individuals. Please do not include passwords, access tokens or unnecessary sensitive data.

<form id="contact-form" class="contact-form" method="post" action="/v1/contact-requests">
<label for="contact-name">Name</label><input id="contact-name" name="name" autocomplete="name" maxlength="120" required>
<label for="contact-email">Email</label><input id="contact-email" name="email" type="email" autocomplete="email" maxlength="254" required>
<label for="contact-company">Company (optional)</label><input id="contact-company" name="company" autocomplete="organization" maxlength="200">
<label for="contact-message">Your question or request</label><textarea id="contact-message" name="message" maxlength="8000" rows="7" required></textarea>
<p>We use these details to handle your request as described in our <a href="/privacy">Privacy notice</a>.</p>
<button id="contact-submit" class="btn nochev" type="submit">Send request</button>
</form>
<p id="contact-result" role="status" aria-live="polite"></p>

[Privacy](/privacy) · [Cookies](/cookies) · [DPA](/dpa)`,
};
