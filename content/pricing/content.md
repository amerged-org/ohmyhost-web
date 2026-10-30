# One balance for your projects

Free gives {{ number plan.freeCredits }} credits every month, with no card. Paid starts at {{ usd plan.paidUsd }} for {{ number plan.paidCredits }} monthly credits. Projects use the same organization balance; there is no separate project base subscription.

Free credits expire at UTC month end. Paid monthly credits expire at billing-period end without rollover. Top-ups, automatic recharge, signup-bonus and referral credits never expire and are spent after the monthly credits. Only a Paid workspace can buy top-ups or turn on automatic recharge; credit you bought stays usable after a downgrade to Free. Connect your own domain; domain registration is not included. Usage is metered; additional credits cost extra. Applicable taxes are added.

An unpaid subscription renewal keeps Paid features for at most {{ number plan.renewalGraceDays }} days after the paid period ends. That window grants no new Free allowance or Paid monthly credits; payment is required for a new Paid allocation. Cancellation ends Paid at the stated period end. Previously expired monthly credits stay expired.

## What uses credits

Measured builds, Worker requests and CPU time, database RAM while active, customer file storage and operations, and enabled mail use their published rates.

{{ table databaseSizes }}

Active database time is prorated. Each size includes the total disk shown and seven-day backups, also while sleeping. Total disk includes PostgreSQL, WAL and filesystem overhead. There are no separate database CPU, network or connection charges. The database sleeps after five idle minutes and then has no active-RAM charge. Customer file storage and Worker usage retain their separate rates.

Prices are identical in US and EU. Shared Dev/Prod uses one physical database; isolated data uses two independently metered databases. New projects provision databases, new files and builds in their selected region. Existing projects moved to US with their owner's authorization use US databases; recorded R2 locations remain unchanged. An increase preserves data; in-place disk shrink requires a separate authorized data migration.

Data mode is optional and defaults to shared. An Owner can later keep an existing data area with Dev or Prod, return to shared data, or reset isolated Dev. No records or files are copied and no special data-change price applies. Returning to shared keeps Prod and permanently deletes the separate Dev data, files and deployment; resetting Dev deletes that Dev area. Review the plan and keep any copies you need before confirming.

## Show the ohmyho.st flag

Ask your agent to show a small “Powered by ohmyho.st” flag on the right edge of your production site. It loads nothing and sets no cookie; a visitor who clicks it lands on ohmyho.st. While it shows, a customer-owned domain uses no domain credits and also works on Free, and each paid Stripe billing period adds {{ number plan.flagPaidBonusCredits }} credits that expire with that period. A custom domain requires an active Prod deployment. On Free, keep the flag enabled while using that domain; remove the domain or upgrade before switching it off. You bring your own domain; we never buy one for you.

## Refer and earn

Copy your referral link with the Refer and earn button in your account menu, or ask your agent for it. A new user's first workspace created through your link or your flag starts with {{ number plan.flagReferralPaidDays }} days of Paid and {{ number plan.flagReferralCredits }} credits. When that workspace first pays, you receive {{ number plan.flagReferralCredits }} credits, plus {{ number plan.flagReferralPaidDays }} days of Paid unless an active Paid subscription or an indefinite Paid grant already covers you. Your existing Stripe billing period stays unchanged. Direct signup or an invalid referral value starts Free without a referral reward. Read the [affiliate guide](https://docs.ohmyho.st/affiliate) for both benefits and a prompt that gets your personal code and link. These promotional benefits may change or end; see the [Terms](/terms).

## Control your spending

Ask your agent for remaining credits, the billed usage of the last 14 days and optional project budgets. A top-up adds credits that never expire but does not extend a subscription. A top-up above $100 adds 125 credits per dollar for the part above $100; consumption prices stay the same. Automatic recharge stays off unless the Owner turns it on with a monthly spending limit.

[All usage rates](https://docs.ohmyho.st/pricing) · [Worked cost example](/pricing/breakdown) · [Usage guide](https://docs.ohmyho.st/usage) · [Compare Vercel](/vs/vercel) · [Free Vercel and Supabase alternatives](/blog/free-vercel-supabase-alternatives-2026) · [Vercel and Supabase in one platform](/blog/all-in-one-vercel-supabase-alternatives)
