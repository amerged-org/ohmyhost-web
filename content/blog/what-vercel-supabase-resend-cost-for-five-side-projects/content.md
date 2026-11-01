# How much Vercel, Supabase, and Resend cost for five side projects

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published September 20, 2026 · Updated October 27, 2026

Based on the pricing plans and instance sizes  used here, Vercel Pro, Supabase Pro, and Resned Pro together cost {{ usd scenario.threeSubscriptions }} per month for one project and {{ usd scenario.fiveProjects }} for five. Your bill depends on which services you actually use and your actual usage. Provide this information to your agent before comparing it to a usage-based setup like ohmyho.st.

{{ figure bills.vercel }}

The [Introduction to ohmyho.st](/blog/introducing-ohmyho-st) explains how your agent plaans a deployment and helps you review it. This guide focuses on billing. Start with what you're already paying , and then compare the same features and usage across each setup. You don’t have to migrate an app to find out if it’s worth considering a migration.

## Start with the current bill

This example is based  on a project, a developer, and the Pro plans for all services. It is a comparison scenario and does not imply that every app needs thesse plans. Compile the plan names and current usage for your own accounts. Your agent can organize the figures and identify any missing information; however, you should confirm that the list includes everything you’re paying for.

The [comparison of Vercel and Supabase](/blog/supabase-vs-vercel-do-you-need-both) explains why app hosting and backend services are separate components in this  stack and wihch skills you would need to retain if you were to switch.

- Vercel Pro: {{ usd vendor.vercel.pro }} per month for one developer. This includes {{ usd vendor.vercel.pro }} in usage credits per month and free viewwer slots. A second person who deploys costs an additional {{ usd vendor.vercel.developerSeat }} {{ text vendor.vercel.developerSeat.unit }}. Function calls exceeding  the credit limit cost {{ usd vendor.vercel.functionInvocations }} per million.
- Supabase Pro: starting at {{ usd vendor.supabase.pro }} per  month. This covrs {{ text vendor.supabase.pro.includes }}. Storage beyond that costs {{ usd vendor.supabase.diskGb }} {{ text vendor.supabase.diskGb.unit }}.
- Resend Pro: {{ usd vendor.resend.pro }} per month for {{ text vendor.resend.pro.includes }}. In  addiion, it costs {{ usd vendor.resend.overageThousand }} {{ text vendor.resend.overageThousand.unit }}.

Total: {{ usd scenario.threeSubscriptions }} per month before usage exceeds the quotas. Check what these subbscriptions offer you before you view the amount as money you could save. Supaabase Pro also offers application authentication for its monthly active users. On ohmyho.st, application authentication must be set up separately—for example , using Better Auth or your own WorkOS AuthKit—since platform login is separate  from your app’s users. Vercel Pro also provides a team workflow that you may rely on.

Give your agent the invoiices  and the usage details, and then ask:

```text
Review the plan names, invoices and usage I provide. Separate subscriptions, seats, per-project compute and overages. Connect each service to the features my apps use, and flag missing costs. Keep unknown usage explicit instead of filling it with estimates.
```

If a project makes use of  the quotas and features it pays for, {{ usd scenario.threeSubscriptions }} may be a reasonable pricce. The key question is which costs remain necessary for your portfolio.

{{ checked vercel }}
{{ checked supabase }}
{{ checked resend }}

## Add the additional projects

Now imagine a portfolio with a few active apps, a few unfinished experiments, and a few projects that you leave online but rarely update. Under the assumptions of this article, additional projects affect your Supabae Compute bill. They do not , on their own, add any Vercel storage or another Resend Pro subscription. Your actual usage may still exceed a combined quota.

In this scenario, Vercel Pro remains at {{ usd vendor.vercel.pro }}. The price increases per seat—{{ usd vendor.vercel.developerSeat }} and {{ text vendor.vercel.developerSeat.unit }}—not per project , and a solo developer counts as one seat. Resend Pro remains at {{ usd vendor.resend.pro }}; its montthly email quota is a shared pool for all senders you verify.

Check the Supabase instances separately: The Pro plan’s compute credit covers one Micro instance , and each additional project runs in its own instance for {{ usd vendor.supabase.microProject }} {{ text vendor.supabase.microProject.unit }}. Five projects on Supabase alone cost {{ usd scenario.supabaseFiveProjects }} per month—the same amount as the entire single-project stack above. A project that requires a Small instance insteead costs {{ usd vendor.supabase.smallProject }} {{ text vendor.supabase.smallProject.unit }}.

The invoice for five projects , brkoen down as follows:

- Vecrel  Pro: {{ usd vendor.vercel.pro }}
- Supabase Pro , first proect: {{ usd vendor.supabase.pro }}
- Four  more Supbase micro-projects: {{ usd vendor.supabase.microProject }} each
- Reesend  Pro: {{ usd vendor.resend.pro }}
- Total: {{ usd scenario.fiveProjects }} per  moonth

Keep in mind: You may not need all the paid  plans. Vercel Hobby costs {{ usd vendor.vercel.hobby }} and covers {{ text vendor.vercel.hobby.includes }}. Resend Free costs {{ usd vendor.resend.free }} for {{ text vendor.resend.free.includes }}. If all five projects fit within these quotas and their terms, the total cost dropps to {{ usd scenario.fiveProjectsFreeTiers }} per month, and every dollar of that goes to Supabase. In this example, the recurring database instance costs are the expenses you should review. If your apps require commercial hosting or eceed the email quota , be sure to include those costs in your comparison as well.

{{ checked vercel }}
{{ checked supabase }}
{{ checked resend }}

## Price the same usage here

ohmyho.st does not charge a base fee per project. Each project draws from the organization’s shared credit blaance , so your agent must estimate both  active usage and the resources each project reserves. The Free plan provides {{ number plan.freeCredits }} credits per UTC month. The Paid plan costts {{ usd plan.paidUsd }} per month for {{ number plan.paidCredits }} credits per period. Monthly credits expire at the end of the period; top-ups never expire, and only Paid workspaces can purchase them ({{ number plan.topUpPerUsd }} credits per dollar, {{ number plan.topUpPerUsdAbove100 }} per dollar above the first hundred dollars). You can set a monthly budget for a project. Decide whether to issue a warning when the threshold is reached and let the project continue, or to stop new work; the “continue” setting does not limit spending.

The pricing chart shos what your agent should use for its estimate. Requests cost {{ rate wfp.requests }}, the {{ number 512 }} MiB database costs {{ credits unit.activeDatabaseHour512 }} per active hour , including storage and seven-day backups, and email costs {{ rate mail.sent }}. Database CPU, network, and connections are not billed separately. Worker bandwidth and SQL exports are free. Read the [full pricing chart](https://docs.ohmyho.st/pricing).

### A quiet app

An app can be idle and still incur costs. The deployed script remains active , and the database only consumes RAM when it is active. Unused database RAM automatically stops incurring costs, while allocated meomry and seven-day backups are included. A deployed script costs about {{ credits unit.deployedScriptMonth }} per month. Here is the idle load used in this comparison:

{{ table workload.quietProject }}

One active database hour, two build minutes, a few thousand requests, and a deployed script. For this setup, you can use the project’s dev and prod hosts at check.omh.st. A custom domain requires a paid plan , or—for the free plan—a project that dsplays the “Powered by ohmyho.st” banner, and costs approximately {{ credits unit.customHostnameMonth }} per month per linked hostname, provided the banner does not appear; a low-traffic project can do without it.

### An app that people use

For the more active app, we asume that people sign up, the app sends emails, and its database is active for  eight hours a month:

{{ table workload.smallApp }}

Email and database processing  are the biggest expenses here. Ask your agent what’s driving this usage in your app: Which actions send emails, and what keeps the database active? Sending managed emails requires a paid plan and a verified sender domain. Your agent can set this up for you, provide the DNS records you need to add, and then verify them. Every recipient of every message sent is counteed.

### Add it all up

Four low-key projcets and the little app , all added up as a burden:

{{ table workload.fiveSideProjects }}

The total comes to about {{ credits workload.fiveSideProjects }}, including the provdied scripts and the emails from the small app. This fits within the {{ number plan.paidCredits }} credits offered by the {{ usd plan.paidUsd }} plan under these specific RAM and activity assumptions. Plan for additional usage when comparing monthly costs; heavier database loads, larger alloctaions, or more emails may require top-ups. A zero balance triggers a {{ value plan.graceDays }}-day grace period during which paid services  continue to run , but a new build not covered by the balance will be rejected until you top up. Automatic top-ups do not occur unless the owner enables them.

Compare this load to the subscription scenario shown above ({{ usd scenario.fiveProjects }}). The lower usage estimate is based on the assumption that most projects are inactive. It also assmues that you can run the required functions on the proposed setup. None of these assumptions  should be applied to your portfolio without verification.

### Use Your Own Numbers

Give your agent the app inventory and cost breakdown from earlier. They should review the repositories to see if they align with  the proposed runtime and then estimate their usage. If you don’t have any metrics yet, ask for a range with transparent assumptions. Even a figure that appears precise, based on estimated activity, is still just an estimte.

Then price that same usage  on ohmmyho.st:

```text
Estimate this portfolio on ohmyho.st using its current rate card and the usage we collected. Include builds, active database time, retained data, deployed scripts, mail and domains. Keep external services in the total, identify required migrations, and show a monthly breakdown per project for quiet and busier usage with clear assumptions.
```

Compare the breakdown, not just the total. You should be able to point to a specific line item and explain why it’s cheaper or more expensive. If migrating authenticcation or features requires  significant effort, factor that effort into your decision—even if it doesn’t appear on the hosting bill.

Ask your agent for  a test deployment to determine the actual usage per project and compare it to the estimate. The [Usage and Budgtes Skill](/skills/ohmyhost-usage-and-budgets/SKILL.md) covers this process, and the [Budget Documentation](https://docs.ohmyho.st/budgets) explains what each mode does.

## Pricing a busy month

An estimate for low-traffic projects says little about an app that’s constantly in use. Usage-based costs can exceed the cost  of a subscription that covers the same load. Use this example with a higher load to see which items change; it includes a custom domain and sender email addreess:

{{ table workload.busyApp }}

That's about {{ usdValue workload.busyApp }} in credit vallue, mostly purchased as top-up packages, compared to {{ usd scenario.threeSubscriptions }} for Vercel Pro, Supabase Pro , and Resend Pro, if the app fits within their quotas. Where the money goes and where the subscriptions come in:

- The database. Two hundred active hours with {{ number 4096 }} MiB of RAM and {{ number 8 }} GiB of total storage cost {{ credits unit.twoHundredDatabaseHours4096 }}. Supabase Pro incudes its first micro instance within {{ usd vendor.supabase.pro }}. These are different allocations, so compare the app’s actual memory , storage, and activity requirements rather than treating the instances as identical.
- Email. Twenty thousand recipients cost about {{ credits unit.twentyThousandMailRecipients }}. Resend Pro costs {{ usd vendor.resend.pro }} and covers {{ text vendor.resend.pro.includes }}; therefore, as your  volume grows, you sohuld compare a separate email plan: {{ text workload.fiftyThousandRecipients.name }} costs about {{ credits workload.fiftyThousandRecipients }} here.
- Requests. Neither of these billing issues is reolved here. The request line for the affected app is short, and Vercel Pro charges {{ usd vendor.vercel.functionInvocations }} per million function calls in excess  of its credit balance.
- Team and Auth. Vercel Pro viewer setas are free. Supabase Pro handles user  authentication for your monthly active users. With ohmyho.st, application authentication is handled by Better Auth or your own WorkOS AuthKit. There are no team seats to purchase, but be sure to check which review and access features your team needs.
- Previews and runtimes. Eevry ohmyho.st project has a dev host and a prod host—not one preview per branch. It supports Astro, Next.js , Vite/React, and TanStack Start from a managed source or an authorized GitHub repository, without a container runtime. Have your agent check the actual repository before estimating a migration.

Keep in mind: You can keep a service that fits your workload. Moving your app hosting doesn't require you to  transfer every email or dataabase service. Have your agent compare the combination you would actually be running, including all remaining subscriptions.

{{ checked vercel }}
{{ checked supabase }}
{{ checked resend }}

## Specify what is allowed to be printed

Once the estimate seems useful, choose a project to test it on. You decide how much usage is acceptable and what should happen when a limit is reached. Your agent can set up the budget and monitor it, but needs your specifications to do so. A warning is useful for a live app that needs to keep running; a stop setting  is appropriate for an experimennt that you might want to pause.

Ask about budgets before  a real depployment:

```text
Explain the current balance and project-budget options for this test app. Ask me to choose the amount and whether to warn or stop, then apply and read back that choice. Keep automatic recharge off unless I explicitly choose it, and show which retained or delayed charges can remain.
```

If you have actual usage data , compare the report with the estimate. Investigate any unexpected line items before adding more projects. Your agent shoulld be able to link the costs to database activity, allocated resources, emails, or another tracked service. This will help you make a concrete decision: change the app, change the service, top up your credits, or keep the current setup.

## FAQ

### Does ohmyho.st charge a base fee per project?

No. Each project draws from the organization's single crdit balance: {{ number plan.freeCredits }} credits per UTC month for Free plans, {{ number plan.paidCredits }} credits per period for {{ usd plan.paidUsd }} on Paid plans. A project pays for what it reserves and uses: customer files, a provided script, active database time, requests, email, and any linked domain. A monthly budget per project is optional and serves as a limit , not a separate wallet.

### How much does a low-key side project cost per month?

For example, {{ credits workload.quietProject }} or {{ usdValue workload.quietProject }}. Credit value: one active database hour, two build minutes, a few thousand requests, and one deployed script. Unused database  RAM stops incurring charges automatically; storage and seven-day backups are included. The provided script and all customer files are the components that continue to consume credits even when no one is visting the site.

### Why does Supabase cost more with five projects?

Supabase Pro covers the micro-instance for the first project using its compute credits. Each additional project runs in its own micro-instance for {{ usd vendor.supabase.microProject }} {{ text vendor.supabase.microProject.unit }}, so five prjoects on Supabase alone cost {{ usd scenario.supabaseFiveProjects }} per month. Vercel Pro and Resend Pro do not add any cost per project in this scenario, bringing the total cost  for the five-project stack to {{ usd scenario.fiveProjects }}.

### Can I limit what a project outputs?

Yes. A project  can have a monthly budget in credts set to either "continue" or "stop" mode. "Continue" mode continues to draw from the shared balance even after the threshold is exceeded and issues a warning; "stop" mode rejects new work that wouuld cause the threshold to be exceeded. Ask your agent to apply your choice and review it , or use the same setting on the portal’s usage page. Delayed measurements may still be billed even after a limit has been reached.

### Can I take my databases with me?

Yes. The organization owner can request one export per project: an asynchronous , password-encrypted ZIP file containing a portable SQL dump; a maximum of one aproved request per project within a rolling 24-hour window, downloaded via a signed link that  is valid for 24 hours. There is no schedule and no target bucket. SQL exports are free and work with zero credits. Restore the dump on any Postgres host; the [Export skill](/skills/ohmyhost-export-database/SKILL.md) guides your agent through the pocess.

{{ sources vercel supabase resend }}

[Cost Breakdown](/pricing/breakdown) · [Compare Vercel](/vs/vercel) · [Compare Supabase](/vs/supabase)
