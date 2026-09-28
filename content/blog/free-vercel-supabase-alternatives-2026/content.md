# Free alternatives to Vercel and Supabase in 2026: the free plans compared

By Sebastian Mertens · September 28, 2026

Vercel Hobby plus Supabase Free costs nothing, but it means two accounts, a Vercel plan that forbids business use and a database that pauses after a quiet week. This comparison puts the free plans of ohmyho.st, Cloudflare, Render, Railway, Neon and Fly.io next to them: what each one hosts, where it stops, and the catch you usually find later.

<figure class="fig"><img src="/images/free-alternatives-two-accounts.png" alt="Free Vercel and Supabase alternative: Vercel Hobby plus Supabase Free means two accounts and two sets of limits, one free plan for app and database means one account" width="1200" height="675" fetchpriority="high" decoding="async"><figcaption>The usual free stack is two products. Every alternative below answers the same question: how much of the pair does one free plan replace?</figcaption></figure>

We make ohmyho.st, so read this with that in mind. Everything about the other platforms was read on their own pricing and documentation pages on September 28, 2026; each claim links its page, and we keep dated screenshots of every one. Our own plan gets the same treatment, catches included.

## What a free plan has to cover

A small app that real people use needs five things before it can run for $0 month after month:

1. **The app itself.** A frontend plus server code, without a server that falls asleep and makes the first visitor wait.
2. **A Postgres database that keeps its data.** Pausing after inactivity is an inconvenience; a database that expires is a migration you did not plan.
3. **Permission to use it for business.** A side project that starts earning money should not break the plan's rules on the day it does.
4. **A limit that stops rather than bills.** On a free plan, the worst case should be a paused app, not an invoice.
5. **Your own domain.** Not every project needs one on day one, but most need one eventually.

## The free plans side by side

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

Each row is explained below with its sources. "No restriction found" means we read the plan pages and terms and found no rule against business use; it is not a written permission.

<figure class="fig"><img src="/images/free-alternatives-catches.png" alt="Four free-plan catches: Render web services sleep after 15 idle minutes, Supabase Free projects pause after a quiet week, Render free Postgres is deleted after 30 days, Vercel Hobby forbids business use" width="1200" height="675" loading="lazy" decoding="async"><figcaption>The four catches that matter most for a small real app. Read on each vendor's documentation, September 28, 2026.</figcaption></figure>

## Vercel Hobby: free, but only for personal projects

Vercel's free plan is generous for a frontend: {{ text vendor.vercel.hobby.includes }}. The rule that decides it for most people is in the fair use guidelines: "Hobby teams are restricted to non-commercial personal use only. All commercial usage of the platform requires either a Pro or Enterprise plan" ([Vercel fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines), read 2026-09-28).

There is no database of its own any more: "Vercel Postgres is no longer available", and Postgres now comes from a Marketplace integration such as Neon or Supabase, each on that provider's own free plan ([Vercel Postgres docs](https://vercel.com/docs/postgres), read 2026-09-28). At the limit Vercel stops rather than bills: "if you exceed your usage limits on the Hobby plan, you will have to wait until 30 days have passed before you can use the feature again" ([Vercel Hobby plan](https://vercel.com/docs/plans/hobby), read 2026-09-28).

{{ checked vercel }}

## Supabase Free: a full backend that naps

Supabase Free gives you Postgres plus auth, storage and realtime: {{ text vendor.supabase.free.includes }}. Supabase states the pause rule plainly: it "pauses Free Plan projects that show low activity over a 7-day period", and a paused project can be restored "for up to 1 year" ([Supabase free project pausing](https://supabase.com/docs/guides/platform/free-project-pausing), read 2026-09-28).

It does not host your web app. Edge Functions run server code, but "Serving of HTML content is only supported with custom domains (Otherwise GET requests that return text/html will be rewritten to text/plain)" ([Supabase function limits](https://supabase.com/docs/guides/functions/limits), read 2026-09-28), and custom domains are a paid add-on that the pricing page lists as not included on Free. So Supabase Free replaces the database half of the pair, not the Vercel half.

{{ checked supabase }}

## ohmyho.st Free: app and Postgres on one balance

Free starts every UTC month with {{ number plan.freeCredits }} credits and no card. The app runs on an edge runtime that does not sleep, the managed Postgres database uses the Free profile of {{ number profile.free dp=2 }} CU and suspends after one idle minute, and it wakes on the next query with its data intact. Every project gets a Dev and a Prod address, and a coding agent operates all of it through the CLI or MCP.

Credits are metered, so the honest question is what fits. A quiet app with a small database, deployed twice a month:

{{ table workload.freePlanApp }}

The catches are real. Database compute is the largest line, so an app whose database stays busy outgrows Free quickly: the small app from our pricing pages uses about {{ credits workload.smallApp }} a month, which needs Paid at {{ usd plan.paidUsd }} for {{ number plan.paidCredits }} credits. Stored data is metered too; keeping 1 GB for a month uses about {{ credits workload.idleDatabase }}. Your own domain works on Free only while the project shows the small Powered by ohmyho.st flag, and transactional mail needs Paid. At a zero balance a {{ number plan.graceDays }}-day grace period starts, after which unfunded execution stops; Free cannot buy top-ups, so it cannot produce a bill.

## Cloudflare Workers Free: always on, but SQLite

The free allowance is large: {{ text vendor.cloudflare.free.includes }}. D1, Cloudflare's database, adds {{ text vendor.cloudflareD1.free.includes }}.

The catch is the engine. D1 is "Cloudflare's managed, serverless database with SQLite's SQL semantics" ([Cloudflare D1](https://developers.cloudflare.com/d1/), read 2026-09-28), so an app written against Postgres needs changes, or an external Postgres behind Hyperdrive. Cloudflare's plans page describes its Free plan as "For personal or hobby projects that aren't business-critical" ([Cloudflare plans](https://www.cloudflare.com/plans/), read 2026-09-28). At the daily limit, "Cloudflare returns Error 1027" ([Workers limits](https://developers.cloudflare.com/workers/platform/limits/), read 2026-09-28), and a Worker custom domain needs "An active Cloudflare zone", which means the domain's DNS lives at Cloudflare ([Workers custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/), read 2026-09-28).

{{ checked cloudflare }}

{{ checked cloudflareD1 }}

## Render: free until the database expires

Render's Hobby workspace costs nothing plus compute and includes {{ text vendor.render.hobby.includes }}. Its free instance types are {{ text vendor.render.freeWebService.includes }} and {{ text vendor.render.freePostgres.includes }}.

Render's own free-tier page is direct about the limits: it "spins down a Free web service that goes 15 minutes without receiving any inbound traffic", grants "750 Free instance hours to each workspace per calendar month", and "Free Render Postgres databases expire 30 days after creation", followed by a 14-day grace period after which Render deletes the database and its data. The same page says: "Do not use them for production applications" ([Render free instances](https://render.com/docs/free), read 2026-09-28). Render is a good free place for a demo; it is not a free home for data.

{{ checked render }}

## Railway: a trial, then a dollar a month

Railway's Free plan is {{ text vendor.railway.free.includes }}. After the trial, "the free trial reverts to the Free plan, which provides $1 of free credit per month" ([Railway free trial](https://docs.railway.com/pricing/free-trial), read 2026-09-28).

A dollar is a small budget: memory alone lists at {{ usdPerMonth vendor.railway.memoryGbSecond }} per GB for a full month, so a service that runs around the clock does not fit, while one that sleeps most of the time can. The pricing table shows custom domains as "1 trial, then 0", and the free trial page warns that "Railway deletes stateful volumes created by Trial accounts 30 days after the expiration of your credits". And for business use: "If you are supporting a commercial application, we highly recommend you to upgrade to the Pro plan" ([Railway pricing FAQ](https://docs.railway.com/pricing/faqs), read 2026-09-28).

{{ checked railway }}

## Neon: the free Postgres without the app

Neon is the closest like-for-like replacement for Supabase's database: {{ text vendor.neon.free.includes }}, with no credit card. The free plan has clear edges and keeps your data at every one of them: "when you run out of CU-hours or public network transfer, your compute is suspended until the next billing period", storage-increasing writes fail at the storage cap, and "None of these limits delete your data" ([Neon plans](https://neon.com/docs/introduction/plans), read 2026-09-28).

Neon does not host your app, so it pairs with one of the app hosts above. Vercel moved its former Postgres databases to Neon, and ohmyho.st runs its managed Postgres on Neon as well.

{{ checked neon }}

## Fly.io: a trial, not a free plan

Fly.io still lists usage prices such as {{ usd vendor.fly.sharedCpu1x }} a month for a shared-cpu-1x machine, but new organizations get a trial: "2 hours of machine runtime or 7 days of access, whichever comes first". When it ends, apps "stop running" and you cannot deploy "until billing is set up" ([Fly.io free trial](https://docs.fly.io/about/free-trial/), read 2026-09-28). If you are searching for a Fly.io free tier alternative, every other plan on this page is one.

{{ checked fly }}

## Which free plan fits which project

There is no single winner here, only a fit for what you are building.

- **A personal project already on Vercel.** Stay on Hobby and add Neon or Supabase for data. Move the day it turns into a business, because Hobby forbids that.
- **A business app that needs Postgres, on one free account.** ohmyho.st hosts the app and the database under one balance and lets your coding agent run it; use the flag if you want your domain on Free.
- **An edge app that is happy with SQLite.** Cloudflare Workers and D1 give the largest request allowance, with DNS at Cloudflare.
- **Only a database.** Neon if you want plain Postgres that never pauses into a manual restore; Supabase if you want its auth and storage and can live with the weekly pause.
- **A throwaway demo.** Render's free web service and free Postgres, knowing the database is gone after 30 days plus grace.

<figure class="fig"><img src="/images/free-alternatives-pick.png" alt="Pick a free Vercel and Supabase alternative by need: app plus Postgres on one account, ohmyho.st; edge app with SQLite, Cloudflare; only a database, Neon or Supabase; personal project, Vercel Hobby with Neon" width="1200" height="675" loading="lazy" decoding="async"><figcaption>Pick by what the project needs, not by a score.</figcaption></figure>

## FAQ

### Can I use Vercel's free plan for a commercial project?

No. Vercel's fair use guidelines restrict Hobby to non-commercial personal use and require Pro or Enterprise for all commercial usage. A free alternative that allows business use has to come from another platform.

### Does Supabase pause free projects?

Yes. Supabase pauses Free projects that show low activity over a 7-day period. A paused project can be restored for up to one year, but until someone restores it, the app that depends on it is down.

### Does Render delete free Postgres databases?

Yes. Free Render Postgres databases expire 30 days after creation, and after a 14-day grace period Render deletes the database along with its data. Upgrade or export before that date.

### Does Fly.io still have a free tier?

Not for new organizations. Fly.io offers a trial of 2 hours of machine runtime or 7 days, whichever comes first, and apps stop when it ends until billing is set up.

### Which free plans need no credit card?

Railway's and Neon's pricing pages both say no credit card is required, and ohmyho.st Free needs none either. Fly.io requires billing after its trial.

{{ sources vercel supabase cloudflare cloudflareD1 render railway neon fly }}

[ohmyho.st vs Vercel](/vs/vercel) · [ohmyho.st vs Supabase](/vs/supabase) · [Railway vs Render vs Fly.io](/blog/railway-vs-render-vs-fly-vs-ohmyho-st-for-solo-developers-2026) · [Pricing](/pricing)
