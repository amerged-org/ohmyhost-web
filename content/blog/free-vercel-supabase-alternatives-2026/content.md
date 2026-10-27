# Free alternatives to Vercel and Supabase in 2026: the free plans compared

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published September 28, 2026 · Updated October 27, 2026

A free plan is useful only if your app fits its limits and terms. Ask your Agent to check both before deploying. Vercel Hobby and Supabase Free cover different jobs, and the alternatives do too. This guide compares ohmyho.st, Appwrite, Netlify, InsForge, Cloudflare, Render, Railway, Neon and Fly.io so you can decide what to try and what happens when the allowance runs out.

<figure class="fig"><img src="/images/free-alternatives-two-accounts.png" alt="Free Vercel and Supabase alternative: Vercel Hobby plus Supabase Free means two accounts and two sets of limits, one free plan for app and database means one account" width="1200" height="675" fetchpriority="high" decoding="async"><figcaption>The usual free stack is two products. Every alternative below answers the same question: how much of the pair does one free plan replace?</figcaption></figure>

We make ohmyho.st. The Supabase and Vercel answers below were re-read on October 27, 2026; the other providers carry the date of their own source (September 28 or October 22, 2026). Every row links to its source and has a dated screenshot. Those dates matter: ask your Agent to check the current terms before you create an account. We include the limits of our own Free plan too.

## Supabase Free vs Vercel Hobby: the short answer

Read on October 27, 2026 from each vendor's own pages. Use it as a first filter, then follow the source for the exact wording.

| Question | Supabase Free | Vercel Hobby |
| --- | --- | --- |
| How many projects? | {{ text vendor.supabaseFree.projects.includes }} | {{ text vendor.vercelHobby.projects.includes }} |
| What database do you get? | {{ text vendor.supabaseFree.database.includes }} | {{ text vendor.vercelHobby.database.includes }} |
| Does it pause or stop? | {{ text vendor.supabaseFree.pausing.includes }} | {{ text vendor.vercelHobby.atLimit.includes }} |
| Can you use it commercially? | No rule against it on the pricing and pausing pages. We did not read the full terms. | {{ text vendor.vercelHobby.commercial.includes }} |
| Source | [Supabase pricing](https://supabase.com/pricing), [project pausing](https://supabase.com/docs/guides/platform/free-project-pausing) | [Vercel Hobby plan](https://vercel.com/docs/plans/hobby), [fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) |

Supabase Free is a backend, not an app host, and Vercel Hobby is an app host without its own database. Pairing them means two accounts, each with its own limits. The sections below explain each rule and compare the other free plans.

{{ checked supabaseFree }}

{{ checked vercelHobby }}

If you are still deciding what each half of that stack does, [Supabase vs Vercel: do you need both?](/blog/supabase-vs-vercel-do-you-need-both) explains the division between app hosting and backend services, and when combining them makes sense.

## Start with your app

Open the repository with your Agent and explain who the app is for. A personal experiment, a client project and an app with paying users can need different plans even if their traffic is similar. Check these things before comparing allowances:

1. **The app itself.** Does it need server code, or only static files? Decide whether waiting for a sleeping service to wake is acceptable.
2. **A Postgres database that keeps its data.** Pausing after inactivity is an inconvenience; a database that expires is a migration you did not plan.
3. **Permission to use it for business.** A side project that starts earning money should not break the plan's rules on the day it does.
4. **What happens at the limit.** Decide whether you can accept a paused app, and check whether the chosen setup can incur charges.
5. **Your own domain.** Decide whether a provider address is enough or whether your domain must work from the start.

To build that inventory, start with this prompt:

```text
Inspect this app and list the hosting, database, login, files and mail it needs. Ask me whether it is personal or commercial and whether it needs a custom domain. Separate required services from optional ones before comparing free plans.
```

Your Agent should name the actual database engine and external services it finds. “Uses a database” is not enough to compare Postgres with SQLite. Keep that inventory handy as you read the table.

## Compare the limits

| Free plan | App hosting | Postgres | Business use | At the limit | Own domain |
| --- | --- | --- | --- | --- | --- |
| Vercel Hobby | Yes | From a Marketplace partner | Not allowed | Waits for the next 30 days | Yes |
| Supabase Free | No, backend only | Yes, pauses after a quiet week | No restriction found | Restricted, not billed | No |
| ohmyho.st Free | Yes, does not sleep | Yes, idles and wakes on the next query | No restriction | Stops after a grace period | With the Powered by flag |
| Cloudflare Workers Free | Yes | No, D1 is SQLite | Plans page says not business-critical | Requests fail with an error | Yes, with the domain on Cloudflare |
| Render Hobby | Yes, sleeps after 15 idle minutes | Yes, deleted after 30 days | Docs say not for production | Services disabled | Yes |
| Railway Free | Yes, on $1 a month | Yes, on a 0.5 GB volume | Pro recommended for commercial apps | Services stop | No, after the trial |
| Neon Free | No | Yes, scales to zero | No restriction found | Compute suspended, data kept | Not applicable |
| Fly.io | Trial only | Not free | Not applicable | Apps stop until billing is set up | Not applicable |
| Appwrite Free | Yes, with Sites | No, Free uses TablesDB; PostgreSQL is a dedicated database | Not checked | Project freezes at a limit and pauses after a quiet week | Not checked |
| Netlify Free | Yes | Yes, Netlify Database | Not checked | Projects pause until the next billing cycle | Yes, with SSL |
| InsForge Free | Yes, built on Vercel | Yes, the project pauses after 1 week of inactivity | Not checked | Not checked | Not checked |

Each row has sources below. “No restriction found” means we did not find a rule against business use in the pages we read; it is not written permission from the provider. “Not checked” means we did not read that provider's terms or limit page for the column, so ask your Agent to check it. Keep in mind: a no-cost allowance and a recommendation for production use are different things. Your Agent should show you the applicable terms, and you decide whether the plan suits the app.

<figure class="fig"><img src="/images/free-alternatives-catches.png" alt="Four free-plan catches: Render web services sleep after 15 idle minutes, Supabase Free projects pause after a quiet week, Render free Postgres is deleted after 30 days, Vercel Hobby forbids business use" width="1200" height="675" loading="lazy" decoding="async"><figcaption>The four catches that matter most for a small real app. Read on each vendor's documentation, September 28, 2026.</figcaption></figure>

## Vercel Hobby limits and commercial use

For a personal frontend, Vercel Hobby offers {{ text vendor.vercel.hobby.includes }}. Before comparing traffic allowances, check the use restriction in its fair use guidelines: "Hobby teams are restricted to non-commercial personal use only. All commercial usage of the platform requires either a Pro or Enterprise plan" ([Vercel fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines), read 2026-10-27).

There is no database of its own: Vercel says it lets you "connect external Postgres databases through the Marketplace", so the database comes from a provider such as Neon or Supabase on that provider's own plan ([Postgres on Vercel](https://vercel.com/docs/postgres), read 2026-10-27). At the limit Vercel stops rather than bills: "if you exceed your usage limits on the Hobby plan, you will have to wait until 30 days have passed before you can use the feature again" ([Vercel Hobby plan](https://vercel.com/docs/plans/hobby), read 2026-10-27).

{{ checked vercel }}

## Supabase Free plan limits and pausing

If your app already uses Supabase login, files or realtime features, count those when comparing databases. Its Free plan gives you Postgres plus auth, storage and realtime: {{ text vendor.supabase.free.includes }}. Supabase states the pause rule plainly: it "pauses Free Plan projects that show low activity over a 7-day period", and a paused project can be restored "for up to 1 year" ([Supabase free project pausing](https://supabase.com/docs/guides/platform/free-project-pausing), read 2026-10-27).

Keep a separate app host in the plan. Supabase Free provides the backend, while Edge Functions run server code, but "Serving of HTML content is only supported with custom domains (Otherwise GET requests that return text/html will be rewritten to text/plain)" ([Supabase function limits](https://supabase.com/docs/guides/functions/limits), read 2026-10-27), and custom domains are a paid add-on that the pricing page lists as not included on Free. Your Agent should price the frontend host as well. Also decide who will restore a paused project if you leave the app unused for a while.

{{ checked supabase }}

## ohmyho.st Free: estimate the usage

Free starts every UTC month with {{ number plan.freeCredits }} credits and no card. The app runs on an edge runtime that does not sleep, the managed Postgres database uses the Free profile of {{ number profile.free dp=2 }} CU and suspends after one idle minute, and it wakes on the next query with its data intact. Every project gets a Dev and a Prod address. Your Agent operates the platform through the CLI or MCP; you check the app at the address it returns.

The allowance is shared across metered services, so ask your Agent which ones your app will use. The example below is a quiet app with a small database, deployed twice a month. Use it as a starting point for your own estimate:

{{ table workload.freePlanApp }}

Keep in mind: database compute is the largest line here. An app that keeps its database busy can outgrow Free quickly: the small app from our pricing pages uses about {{ credits workload.smallApp }} a month, which needs Paid at {{ usd plan.paidUsd }} for {{ number plan.paidCredits }} credits. Stored data is metered too; keeping 1 GB for a month uses about {{ credits workload.idleDatabase }}. Your own domain works on Free only while the project shows the small Powered by ohmyho.st flag, and transactional mail needs Paid. At a zero balance a {{ number plan.graceDays }}-day grace period starts, after which unfunded execution stops; Free cannot buy top-ups, so it cannot produce a bill.

## Cloudflare: check the database

Cloudflare Workers Free offers {{ text vendor.cloudflare.free.includes }}. D1, Cloudflare's database, adds {{ text vendor.cloudflareD1.free.includes }}.

Ask your Agent whether the app can use SQLite before choosing D1. It is "Cloudflare's managed, serverless database with SQLite's SQL semantics" ([Cloudflare D1](https://developers.cloudflare.com/d1/), read 2026-09-28), so an app written against Postgres needs changes, or an external Postgres behind Hyperdrive. Cloudflare's plans page describes its Free plan as "For personal or hobby projects that aren't business-critical" ([Cloudflare plans](https://www.cloudflare.com/plans/), read 2026-09-28). At the daily limit, "Cloudflare returns Error 1027" ([Workers limits](https://developers.cloudflare.com/workers/platform/limits/), read 2026-09-28), and a Worker custom domain needs "An active Cloudflare zone", which means the domain's DNS lives at Cloudflare ([Workers custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), read 2026-09-28).

{{ checked cloudflare }}

{{ checked cloudflareD1 }}

## Render: plan for expiry

Render separates the workspace plan from the resources you run. The Hobby workspace costs nothing plus compute and includes {{ text vendor.render.hobby.includes }}. Its free instance types are {{ text vendor.render.freeWebService.includes }} and {{ text vendor.render.freePostgres.includes }}.

Render's own free-tier page is direct about the limits: it "spins down a Free web service that goes 15 minutes without receiving any inbound traffic", grants "750 Free instance hours to each workspace per calendar month", and "Free Render Postgres databases expire 30 days after creation", followed by a 14-day grace period after which Render deletes the database and its data. The same page says: "Do not use them for production applications" ([Render free instances](https://render.com/docs/free), read 2026-09-28). For a temporary demo, those limits may be fine. Give your Agent the demo end date and ask it to show when the database expires. If the records need to survive, choose an ongoing database plan or arrange an export before the deadline.

{{ checked render }}

## Railway: separate trial and plan

Railway's Free plan is {{ text vendor.railway.free.includes }}. After the trial, "the free trial reverts to the Free plan, which provides $1 of free credit per month" ([Railway free trial](https://docs.railway.com/pricing/free-trial), read 2026-09-28).

Ask your Agent to estimate the service after the trial ends. The ongoing credit is a small budget: memory alone lists at {{ usdPerMonth vendor.railway.memoryGbSecond }} per GB for a full month, so a service that runs around the clock does not fit, while one that sleeps most of the time can. The pricing table shows custom domains as "1 trial, then 0", and the free trial page warns that "Railway deletes stateful volumes created by Trial accounts 30 days after the expiration of your credits". And for business use: "If you are supporting a commercial application, we highly recommend you to upgrade to the Pro plan" ([Railway pricing FAQ](https://docs.railway.com/pricing/faqs), read 2026-09-28).

{{ checked railway }}

## Neon: keep an app host

Look at Neon when you need PostgreSQL itself. Compare the other Supabase services separately if your app uses them. Neon Free provides {{ text vendor.neon.free.includes }}, with no credit card. The free plan has clear edges and keeps your data at every one of them: "when you run out of CU-hours or public network transfer, your compute is suspended until the next billing period", storage-increasing writes fail at the storage cap, and "None of these limits delete your data" ([Neon plans](https://neon.com/docs/introduction/plans), read 2026-09-28).

This database plan still needs an app host from elsewhere in the comparison. Ask your Agent to name both parts of the proposed setup so the deployment plan is complete. Vercel moved its former Postgres databases to Neon, and ohmyho.st runs its managed Postgres on Neon as well.

{{ checked neon }}

## Appwrite Free: check the pause

Appwrite hosts frontends with Sites and adds login, storage and functions. Its pricing page lists {{ text vendor.appwrite.free.includes }}. The changelog is explicit about the pause: a Free project with no development activity for 7 consecutive days is paused, and one that stays paused for 90 days is deleted after email alerts ([pause policy](https://appwrite.io/changelog/entry/2026-02-20-1), [deletion notice](https://appwrite.io/changelog/entry/2026-06-29), read 2026-10-22). Free projects use TablesDB; native PostgreSQL is a dedicated database that starts at {{ usd vendor.appwrite.dedicatedDatabase.usd }} a month. The [all-in-one comparison](/blog/all-in-one-vercel-supabase-alternatives) covers Sites, login and storage in more detail.

{{ checked appwrite }}

## Netlify Free: one credit pool

Netlify's Free card lists {{ text vendor.netlify.free.includes }}. Netlify Database is a managed Postgres database, and Netlify Identity covers login on every credit-based plan. Deploys, compute, bandwidth and requests share the same credits, and Netlify's own Personal comparison states the limit: "When you reach that limit, projects pause until the next billing cycle." ([Personal vs Free](https://www.netlify.com/pricing/personal-vs-free), read 2026-10-22). Custom domains with SSL are on the Free card, while ohmyho.st Free needs the Powered by flag for yours. See the [all-in-one comparison](/blog/all-in-one-vercel-supabase-alternatives) for what else it covers.

{{ checked netlify }}

## InsForge Free: check the pause and the host

InsForge's free plan lists {{ text vendor.insforge.free.includes }}. Frontend hosting runs through Vercel: the CLI uploads your source and InsForge creates a Vercel production deployment ([InsForge Sites](https://docs.insforge.dev/core-concepts/deployments/overview), read 2026-10-22). One account therefore does not remove the Vercel dependency. Ask your Agent to read InsForge's terms and its behaviour at the limit before you rely on the free plan.

{{ checked insforge }}

## Fly.io: budget after the trial

Fly.io still lists usage prices such as {{ usd vendor.fly.sharedCpu1x }} a month for a shared-cpu-1x machine, but new organizations get a trial: "2 hours of machine runtime or 7 days of access, whichever comes first". When it ends, apps "stop running" and you cannot deploy "until billing is set up" ([Fly.io free trial](https://docs.fly.io/about/free-trial/), read 2026-09-28). Use the trial to test a deployment, then make a separate decision about ongoing usage. Your Agent should not count the trial as a recurring allowance.

For workloads that need a paid plan, the [Railway, Render, Fly.io and ohmyho.st comparison](/blog/railway-vs-render-vs-fly-vs-ohmyho-st-for-solo-developers-2026) sets out their billing models and prices the same small-app assumptions.

{{ checked fly }}

## Choose what to try

Pick the options that support the app you actually have. Then give your Agent a usage estimate: expected visitors, database activity, stored files and mail. If you do not know, ask it to show a quiet case and a busier case with the assumptions written out.

With the inventory and estimate ready, ask your Agent to check the shortlist:

```text
Compare the shortlisted free plans against this app and my usage estimate. Check current official terms for commercial use, inactivity, data expiry, custom domains and charges at the limit. Show which services remain external and explain what would stop working if an allowance runs out.
```

You are choosing an acceptable set of limits. A generous request allowance does not help if the app needs an unsupported database, and a working demo does not prove its data will remain available next month.

- **A personal project already on Vercel.** Stay on Hobby and add Neon or Supabase for data. Move the day it turns into a business, because Hobby forbids that.
- **An app that also needs hosted login on a free account.** Netlify with Identity or Appwrite include it; accept Netlify's credit pool or Appwrite's quiet-week pause. ohmyho.st leaves login to Better Auth or WorkOS AuthKit.
- **A business app that needs Postgres, on one free account.** ohmyho.st hosts the app and the database under one balance and lets your coding agent run it; use the flag if you want your domain on Free.
- **An edge app that works with SQLite.** Compare Cloudflare Workers and D1, and account for the Cloudflare DNS requirement for a Worker custom domain.
- **Only a database.** Neon if you want plain Postgres that never pauses into a manual restore; Supabase if you want its auth and storage and can live with the weekly pause.
- **A throwaway demo.** Render's free web service and free Postgres, knowing the database is gone after 30 days plus grace.

<figure class="fig"><img src="/images/free-alternatives-pick.png" alt="Pick a free Vercel and Supabase alternative by need: app plus Postgres on one account, ohmyho.st; edge app with SQLite, Cloudflare; only a database, Neon or Supabase; personal project, Vercel Hobby with Neon" width="1200" height="675" loading="lazy" decoding="async"><figcaption>Pick by what the project needs, not by a score.</figcaption></figure>

## Check the test deployment

Once you have chosen a plan, let your Agent prepare the app. It should explain the services it will create and any account steps you need to complete. You do not need to copy a set of terminal commands to prove the app works; use the test address and exercise its real features.

To prepare the test deployment, use:

```text
Prepare this app on the free plan I selected. Confirm the connected database and use test data. Give me the test URL and a short checklist for login, saving records, file access and page reloads where those features exist. Explain the plan limits I need to remember after the test.
```

Try the app as a visitor would. Sign in, save a record, reload the page and check that the record remains. If the plan sleeps, understand the first-visit experience. If the database expires, decide where the data will go before that happens. Keep the source and your chosen export route accessible so you can move when the project grows.

## FAQ

### Can I use Vercel's free plan for a commercial project?

No. Vercel's fair use guidelines restrict Hobby to non-commercial personal use and require Pro or Enterprise for all commercial usage. A free alternative that allows business use has to come from another platform.

### Does Supabase pause free projects?

Yes. Supabase pauses Free projects that show low activity over a 7-day period. A paused project can be restored for up to one year, but until someone restores it, the app that depends on it is down.

### Does Render delete free Postgres databases?

Yes. Free Render Postgres databases expire 30 days after creation, and after a 14-day grace period Render deletes the database along with its data. Upgrade or export before that date.

### Does Fly.io still have a free tier?

Not for new organizations. Fly.io offers a trial of 2 hours of machine runtime or 7 days, whichever comes first, and apps stop when it ends until billing is set up.

### Which free plans include hosting, Postgres and login?

Netlify's Free card lists hosting, Netlify Database and, through Identity, login with no cap on active users. Appwrite offers Sites and login, but its Free database is TablesDB rather than PostgreSQL. InsForge combines a Postgres backend and login with frontend hosting that runs on Vercel. ohmyho.st Free has hosting and Postgres, and your app brings its own login. The [all-in-one comparison](/blog/all-in-one-vercel-supabase-alternatives) shows what each one covers.

### Which free plans need no credit card?

Railway's and Neon's pricing pages both say no credit card is required, and ohmyho.st Free needs none either. Fly.io requires billing after its trial.

{{ sources supabaseFree vercelHobby vercel supabase cloudflare cloudflareD1 render railway neon fly appwrite netlify insforge }}

[ohmyho.st vs Vercel](/vs/vercel) · [ohmyho.st vs Supabase](/vs/supabase) · [Railway vs Render vs Fly.io](/blog/railway-vs-render-vs-fly-vs-ohmyho-st-for-solo-developers-2026) · [Pricing](/pricing)
