# One balance for your projects

Free starts with 200 credits. Paid starts at $10 for 1,000 monthly credits. Projects use the same organization balance; there is no separate project base subscription.

Free credits expire at UTC month end. Paid monthly credits expire at billing-period end without rollover. Only Paid users can buy top-ups; they carry over during uninterrupted Paid membership and expire on downgrade to Free. Connect your own domain; domain registration is not included. Usage is metered; additional credits cost extra. Applicable taxes are added.

An unpaid subscription renewal keeps Paid features and usable top-ups for at most {{ number plan.renewalGraceDays }} days after the paid period ends. That window grants no new Free allowance or Paid monthly credits; payment is required for a new Paid allocation. Cancellation ends Paid at the stated period end. Previously expired credits stay expired.

## What uses credits

Measured builds, worker requests and CPU time, database compute and storage, file storage and operations, and enabled mail use their published rates. An idle database can suspend its compute; retained storage still uses credits.

| Database profile | Size | Sleep after idle |
| --- | --- | --- |
| Free | 0.25 CU / 1 GB | 1 minute |
| Paid standard | 0.5 CU / 2 GB | 1 minute |
| Paid performance | 1 CU / 4 GB | 5 minutes |

Performance uses 2.5 times standard database-compute credits for equal active time. Shared Dev/Prod uses one database; isolated data uses two independently metered databases. Prices are identical in the US and EU hosting regions.

Data mode is optional and defaults to shared. An Owner can later keep an existing data area with Dev or Prod, return to shared data, or reset isolated Dev. No records or files are copied and no special data-change price applies. Returning to shared keeps Prod and permanently deletes the separate Dev data, files and deployment; resetting Dev deletes that Dev area. Review the plan and keep any copies you need before confirming.

## Show the ohmyho.st flag

Ask your agent to show a small “Powered by ohmyho.st” flag on the right edge of your production site. It loads nothing and sets no cookie; a visitor who clicks it lands on ohmyho.st. While it shows, a customer-owned domain uses no domain credits and also works on Free, and each paid Stripe billing period adds {{ number plan.flagPaidBonusCredits }} credits that expire with that period. A custom domain requires an active Prod deployment. On Free, keep the flag enabled while using that domain; remove the domain or upgrade before switching it off. You bring your own domain; we never buy one for you.

## Refer and earn

Copy your referral link with the Refer and earn button in your account menu, or ask your agent for it. A new user's first workspace created through your link or your flag starts with {{ number plan.flagReferralPaidDays }} days of Paid and {{ number plan.flagReferralCredits }} credits. When that workspace first pays, you receive {{ number plan.flagReferralCredits }} credits, plus {{ number plan.flagReferralPaidDays }} days of Paid unless an active Paid subscription or an indefinite Paid grant already covers you. Your existing Stripe billing period stays unchanged. Direct signup or an invalid referral value starts Free without a referral reward. These promotional benefits may change or end; see the [Terms](/terms).

## Control your spending

Ask your agent for remaining credits, measured usage and optional project budgets. A top-up adds credits but does not extend a subscription. A top-up above $100 adds 125 credits per dollar for the part above $100; consumption prices stay the same. Automatic recharge stays off unless the Owner turns it on with a monthly spending limit.

[All usage rates](https://docs.ohmyho.st/pricing) · [Worked cost example](/pricing/breakdown) · [Usage guide](https://docs.ohmyho.st/usage) · [Compare Vercel](/vs/vercel)
