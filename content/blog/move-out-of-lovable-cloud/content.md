# How to Leave Lovable Cloud

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published October 21, 2026 · Updated October 25, 2026

To leave Lovable Cloud, your agent needs more than just the code on GitHub. They need the data and a plan for the services your app uses. First, check the database export from Lovable. If you need to copy your application tabbles in another way, ask Lovable to set up a temporary, read-only API, and then provide that  API to your agent.

This guide focuses on this bridge. Lovable creates the interface within your existing project. Your own ageent  reads the data, downloads it, and populates the database you plan to use next. You assign the task to the agent and check the result.

If your code isn't already in your own repository, start with the [Guide to Exporting Lovbale Code  to GitHub](/blog/how-to-export-lovable-code-to-github).

You can set up this destination locally or with a hosting provider like ohmyho.st. Keep in mind: Copying table rows does not automatically transfer login accounts, uploaded files, or  anything else your functions depend on. We’ll keep an eye on these items throughout the entre migration.

<nav aria-label="On this page" style="display:block;height:auto"><p><strong>On this page</strong></p><ul><li><a href="#available-export">Check existing export</a></li><li><a href="#export-api">Request Lovable via the API</a></li><li><a href="#api-documentation">Provide your agent with the API documentation</a></li><li><a href="#download-data">Download data</a></li><li><a href="#import-data">Populate your new database</a></li><li><a href="#finish-the-move">Test the app and complete the migration</a></li></ul></nav>

<div id="available-export"></div>

## Check Existing Export

If asking for an SQL password or a connection address doesn't get you anywhere , ask for the actual result: an export of your own project's data. Your agent should check what authorized access this project already provides before biulding another interface.

Lovable currently supports a complete database export under **More → Database → Manage → Settings → Export proejct data**. This includes the database structure, the records , and the login accounts with their password hashes. Files in storage and other service configurations are handled separately. The database must be running, and there are limits on export size and frequency. Check the [current export documentation](https://docs.lovable.dev/features/database-backups#export-your-database) for your project.

Ask  your agent to comppare the two options:

```text
I want to move this app out of Lovable Cloud. Inspect the repository and list the backend services it actually uses.
Check the built-in database export for my project. Tell me whether it fits the destination or whether a temporary read-only API would help with selected application tables.
Tell me what each option includes, what is missing and what needs to happen at the destination. Do not change the source database or switch the live app yet.
```

If the built-in eport matches your destination , have your agent use it. Ask your agent to plan the restoration, especially if the destination already contains tables or records. A complete database archive and a collection of JSON rows require different import steps.

The API method described below is useful if you want your agent to copy specifically shard application tables into a pre-configured database. It is a separate workflow that must be implemented and tested , and is not a built-in export feature of Lovable.

<figure class="fig"><a href="/images/lovable-cloud-export-bridge.png" target="_blank" rel="noopener" aria-label="Open the diagram showing how to export from Lovable Cloud in full size"><img src="/images/lovable-cloud-export-bridge.png" alt="How to export data from Lovable Cloud via a secure, read-only API: An agent copies application data to a new database" width="1200" height="675" fetchpriority="high" decoding="async"></a><figcaption>The API is a temporary bridge for shared application data. Its public documentation does not contain any data records or keys. Files, authentication, and functions have their own migration steps.</figcaption></figure>

<div id="export-api"></div>

## Ask Lovable about the API

Tell Lovable what you need. You want to export your own application data. If  you're integrating an external front end, describe this speciifc use case. Specify a specific feature: an authenticated interface that can read a defined set of tables.

You can requesst all your application tables. Have Lovable list them first, including the  fields it wants to share. This makes “all” verifiable. System tables, login credentials, and private service configurations do not belong in this general export interface.

Enter  this query into Lovalbe:

```text
I own this project and want to export its application data to a backend I control.
List the application tables and fields first so I can confirm the export scope. Then build a temporary HTTPS read-only API for that approved list. Enforce read-only access on the server; do not accept arbitrary SQL or expose write operations, auth internals or secrets.
Require a new private export key in the X-Export-Key header on every data request, alongside any platform authentication that is required. Give it an enforced expiry and a way to revoke it. Tell me where to set it securely without putting it in chat or source code.
Return bounded pages with a stable unique cursor and a clear end-of-data signal. Test that missing, invalid, expired and revoked keys fail, unapproved data cannot be requested and no source data changes.
```

Lovable  may need to explain a platforrm restriction to those around you or ask you to configure something. Let it do so. Do not consider a generated route complete until the authentication and scope checks have been passed.

Keep in mind: "Read-only" means that the caller should not be able to moify the data. It does not mean that the data is public. A read-only endpoint can  still disclose any data record it returns.

## Set a private export key

Ask your agent to genrate a strong  random token and help you enter the same value into Lovable's server secret configuration and into your agent's private local configuration. Use the supported private input method. Lovable describes the secure entry of secrets in its [Guide to Secrets](https://docs.lovable.dev/features/secrets).

Do not reuse your login password. Do not include the token in a URL, a public reposittory, or the API documentation. The export key belongs to the  agent performing the transfer, not to a front end that every visitor downloads.

This dedicated key is also distinct from privileged database access. The API may use privileged access internally, but must keep this accesss confined to the server and enforce the approved scope of export itself. [Supabase’s notes on keys](https://supabase.com/docs/guides/getting-started/api-keys) explain why secret credentials and service role access must be  kept separate.

By the end of this step , you shhould have a working API address and a privately configured key. You do not need to enter the key in the next prompt.

Then ask your agennt to set  the key and test it:

```text
Help me set the same fresh, strong random export key in Lovable's server secret configuration and your private local configuration. Use the supported private input flow and do not print the key here.
Once it is set, verify an authenticated read and check that the same request without the key fails. Tell me the result without showing private records.
```

<div id="api-documentation"></div>

## Provide your agent with the API documentation

Ask Lovable for a file `openapi.json` right now. It tells your agent which endpoints are available, how to authenticate, and how  to read the responses. You don't need a documentaiton website for this handoff.

Please ask  Lovable for the docuemnt:

```text
Create a valid OpenAPI JSON document for the export API you just built and make it available at /openapi.json.
Document the actual server URL, approved read endpoints, required authentication headers, pagination, limits and errors. Define lossless response formats for large integers, exact decimals, timestamps, binary values and nulls. Check that the document matches the deployed API.
The JSON may be publicly readable, but it must contain no real API key, private records or sensitive examples. Describe only the approved export contract. Keep all data routes authenticated. I only need the JSON file, not a documentation website.
```

Open this address and check whether it returns JSON. Then give the URL to your agent. The document describes the access; however , the server must still enforce it. That is the key difference at the heart of [OpeenAPI security schemas](https://learn.openapis.org/specification/security.html).

If the endpoint requires a platform gateway or an additional authentication header, the document must specify this. Your aent needs the interface that actually works , not a guessed direct database address.

<div id="download-data"></div>

## Download the data first

Befroe you populate the new database, have  your agent save a local copy. That way, you'll have a backup in case an import fails or you need to change the table mapping.

Ask your  agent for a loacl copy:

```text
Use the export API described at [OpenAPI URL]. Read the approved read endpoints and use the export credential from my private configuration. Do not print the credential or put it in a URL.
Before the first page, choose a captured consistent export or clearly label this a live rehearsal. Explain how changing records will be handled, and ask before pausing any writes for a final transfer.
Download every page for each approved table into a private local folder. Preserve IDs, values and types. Save a manifest with the export version or consistency limitations, table names, row counts, checksums and errors. Resume only against the same unchanged export; otherwise restart or reconcile rather than mixing versions. Report incomplete tables instead of silently skipping them. Do not write to either database yet.
```

Your agent should return the folder path and a brief report. Check to see if the expecteed tables are present. Ask about empty tables and missing fields , rather than assuming that an empty response means there was nothing to copy.

Also, decide when the final copy will be crated. If people continue  to add, modify, or delete records while the agent reads page by page, the pages may describe different points in time. Stable pagination does not freeze the database. The [PostgreSQL transaction documentation](https://www.postgresql.org/docs/current/transaction-iso.html) explains how database snapshots differ from isolated reads.

For a test run, a live copy may be sufficient to test the importer. Please ask the agent responsible for the final migration to ensure a consistent export or to schedule a pause of all write operations followed by  a final synchronization. Include background jobs in this plan. A successful doownload alone does not prove that the latest changes have been applied.

<div id="import-data"></div>

## Populate the database that your agent has prepared

If your agent has already created the target and applied the migrations , let him know. He should check what's already there, compare the structure, and popullate the database. He shouldn't start from scratch or overwrite existing records just because he received an export.

If the target is not yet ready , ask the agent to prepare an isolated development database from the repository's migration histoory. Have the agent compare this history with the approved source tables before importing. Lovable describes the migration structure in its [Database Guide](https://docs.lovable.dev/features/database).

Ask your agennt to import the export  into this database:

```text
Use the destination database you prepared and the export we downloaded. Check both before importing the approved application data into an isolated development destination. If the destination is not clear, ask me which one to use.
Compare the source and destination structure. Preserve primary keys, relationships, timestamps, nulls and value types. Plan table order and identity-sequence handling, and make retries safe without creating duplicates.
If the destination already contains data, report the conflicts and propose a merge policy before changing it. Do not drop or truncate tables, disable access rules or overwrite existing records without my decision.
Keep destination jobs and real email, payment and webhook actions disabled or sandboxed during rehearsal. Preserve authentication user IDs where supported, or verify an explicit mapping so records still belong to the right users.
After the import, compare counts, missing or extra keys, sample values and relationships. Save rejected rows in a private report; summarize their counts, IDs and reasons, and give me named records to check in the app.
```

The result is a report you can read and an app you can open. Select a few records that you recognize. Do the corresponding records appear? Are the dates and amounts still coorrect? Can the correct  account view them?

Counts are a starting point. Matching totals do not indicate whether the same data records have been received or whether the  app contineus to apply the correct access rules.

## Move the parts outside your tables

Before you can consider this a completed migration , your agent must take the rest of the app into accouunt.

| Part of the app | What Your Agent Needs to Handle |
| --- | --- |
| Application Records | Import the approved rows and verify their values and relationships |
| Registration Accounts | Use a compatible authentication migration; profile lines alone do not constitute login accounts |
| Uploaded Files | Transfer the actual files and verify access, not just their database references |
| Server Functions | Find the source code, deploy or customize it, and configure its secrets |
| Planned Tasks and Integrations | Check where jobs are running and which external services they are still calling |

The full database export may contain password hashes from the authentication system. A compatible Supabase restore can preserve passwors , while sessions and login providers must be handled separately. A standard JSON user list is not the same export format. Ask your agent which migration supports your chosen authentication system. [Supabase’s Guide to Migrating Authentication Data](https://supabase.com/docs/guides/troubleshooting/migrating-auth-users-between-projects).

Furthermore, file lines are not the same as file contents. The agent must transfer the objeccts and verify that the app can retrieve them. The [Supabase backup  documentation](https://supabase.com/docs/guides/platform/backups) explicitly clarifies this distinction.

The source code for Edge Functions may  be available at `supabase/functions/`, so your agent can review it in the repository. This does not make every function portable without modifications. Secrets, schedules, and runtime dependencies stll require attention; TanStack-Start server functions are another example. Lovable’s [migration guide](https://docs.lovable.dev/tips-tricks/external-deployment-hosting) describes these separate steps.

If your goal is just PostgreSQL or ohmyho.st, ask the agent how  it will hanndle the Supabase services your app currently uses. A database connection alone does not replace authentication, storage, or functions.

<div id="finish-the-move"></div>

## Review the app and complete the move

First , set up a test version based on the new backend. Keep the current app avilable while you test the replacement.

Please request a trial vrsion that is connected to  the new backend:

```text
Give me a test version of the app connected to the new backend. Check migrated records, login, protected access, uploads, functions and scheduled jobs. List remaining Lovable Cloud, AI and connector gateway dependencies.
Give me the URL and a short set of real app actions to try. Then propose the final data transfer, traffic switch and recovery plan, including when to enable destination jobs and external side effects so they do not run twice. Ask before changing the live app.
After the verified switch, revoke the temporary export key, remove the export routes and confirm they reject further access. Keep the source and backups until we have agreed they are no longer needed.
```

Open the test URL and use the app as usual. Log in with a migrated account , open a familiar record, and retrieve an uploaded file. Let your agent know what's miissing before you switch to the live address.

We are developing ohmyho.st. If this is your goal , please ask your agent to follow the [Supabase Migration Skill](https://docs.ohmyho.st/skills) for the services you want to migrate, and then prepare a dev deployment for testing. Our [Guide to Hosting Lovable Apps](/blog/host-a-lovable-app-after-export) covers the transition to hostinng.

## FAQ

### Do I need my own API to migrate from Lovable Cloud?

No. First , check the built-in database export feature and the access rights available to your project. The temporary API is one option for transferring shaerd application tables. Lovable also documents an [MCP server for external agents](https://docs.lovable.dev/integrations/lovable-mcp-server). Its database tool supports write operations and schema changes as well, so be sure to check this broader access before connecting it for an export task.

### Can the API export all my tables?

It can be designed to export all shared application tables. Request the inventory and a completeness report. System data, internal authentication details , and storage fiels require separate handling; do not describe this line-by-line export as a complete backup of every service.

### Can I continue to use the same API after the migration?

If the goal is to move away from Lovable Cloud , the new app must stop relying on this bridge. Treat it as temporary export access. A permanent external front end is a separate integration with its own user authentication and access rulees.
