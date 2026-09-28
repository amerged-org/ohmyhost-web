# Changelog

## September 28, 2026

Release 0.1.24 adds Owner-confirmed Dev/Prod data changes. Data mode stays optional and shared by default. Keep existing data with Prod or Dev, return to shared, or reset isolated Dev; the platform copies no records or files and applies ordinary usage rates. Returning to shared preserves Prod and permanently removes the separate Dev data, files and deployment. A reset removes the isolated Dev area and deployment. Review the concrete plan before confirming; changing back does not restore deleted data.

An unpaid subscription renewal keeps Paid features and usable top-ups for at most {{ number plan.renewalGraceDays }} days after the paid period ends, without new Paid monthly credits or a Free allowance. Cancellation still ends Paid at the stated period end. Earlier expired credits stay expired, and payment history is retained. The [Terms](/terms) are MSA revision 4.

The runtime adds streamed bulk file reads and idempotent bulk deletion. Hosting uses one admission contract for init, plan and build, supports HTTP-only Vite edge companions, and packages Workers-compatible JavaScript, MJS and WASM modules across its adapters. Applications can declare exact external browser origins and resource capabilities while retaining restrictive defaults. Check the current framework and capability guides and verify the application on Dev before promotion.

Update the CLI and MCP server together before using the new operations. The [current client release](https://ohmyho.st/client-release.json) names the published version and manifest; older client download URLs return 404.

## September 27, 2026

Monthly Free and Paid credits expire at their period end without rollover. Only Paid workspaces can buy top-ups; those credits carry over while Paid access continues and expire when it effectively ends. Paused automatic recharge is visible in Billing. These credit rules were introduced with clients 0.1.23; the renewal window is extended by the release above.

## September 26, 2026

A project Owner can show a small “Powered by ohmyho.st” flag on its production site. While it shows, the project's customer-owned domain uses no domain credits and also works on Free, and each paid Stripe billing period adds {{ number plan.flagPaidBonusCredits }} credits. A new user's first workspace created through a referral link starts with {{ number plan.flagReferralCredits }} credits and {{ number plan.flagReferralPaidDays }} days of Paid. Its first payment gives the referring workspace {{ number plan.flagReferralCredits }} credits and, unless a Paid subscription or an indefinite grant already covers it, {{ number plan.flagReferralPaidDays }} days of Paid; its existing Stripe billing period stays unchanged. Direct signup starts Free.

Failed deployments name their deployment ID, and deployment logs include the route and status of a failed health check. Support runs through your agent: report bugs or feature requests with `feedback_submit` and read replies with `feedback_status`. The MCP server's source is public at [amerged-org/ohmyhost-mcp](https://github.com/amerged-org/ohmyhost-mcp).

## September 25, 2026

One computer can keep the logins of several ohmyho.st accounts. Each `ohmyhost login` saves one user in one workspace, and every command or MCP call runs as one of them (`--profile-name`, MCP `profile_name` or `OHMYHOST_PROFILE`). A saved login no longer switches workspaces: add a login for each workspace.

## September 21, 2026

The public website now has its own repository and release pipeline. Prompt and command blocks have copy controls, the footer keeps cookie settings accessible, and the About page focuses on the product. Social previews and comparison copy have been refreshed.

## September 20, 2026

The five client packages are published on npm under Apache-2.0. Organization-wide GitHub connections and the project usage and budget controls in the portal were verified. See [open source](/open-source) for package links and the [current client release](https://ohmyho.st/client-release.json).

## September 16, 2026

Signup is open to everyone: there is no invitation, waitlist or access code. Every visitor gets the agent prompt and the login link, and a link's r value is kept only as signup attribution that may carry its configured promotional credit.

## September 13, 2026

The website then distinguished invited signup from registering interest. Task Skills cover initial connection, GitHub deployment, database sizing, DNS and email, usage and budgets, troubleshooting and encrypted SQL export.

Public CLI/MCP releases provide project context, operation diagnostics, usage reports and user-owned deployment tokens. See the current [release manifest](https://docs.ohmyho.st/cli) for the exact published version.

[Documentation](https://docs.ohmyho.st/) · [Skills](https://docs.ohmyho.st/skills) · [Introduction](/blog/introducing-ohmyho-st)
