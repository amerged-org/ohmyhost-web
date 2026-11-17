# Connect Your ohmyhost App to Zapier and Make

By [Sebastian Mertens](https://www.linkedin.com/in/auto-mate/) · Published November 16, 2026 · Updated November 17, 2026

A customer submits a form in your app. You want your workflow to notice the new record, send the right information to another tool, and update the record when the next step is complete. The ohmyhost integrations for Zapier and Make connect those workflows to your hosted application's database and project operations.

The Zapier integration is available in public beta. [Open ohmyhost in the Zapier directory](https://zapier.com/apps/ohmyhost/integrations) to see the available actions and start a Zap. The Make app is private to our organization. [Contact us](/contact) to ask about Make access.

## Choose what should start the workflow

A database webhook lets your workflow react when a row is inserted, updated, or deleted. For example, a booking app can send a new booking to an operations workflow, while a change to the booking status can trigger a follow-up. Choose the events and table that matter to the workflow rather than watching every change in the project.

On ohmyhost, database change delivery uses a watch and a webhook. The watch identifies the database changes; the webhook delivers the event to the workflow's endpoint. Our end-to-end tests covered insert, update, and delete events in both platforms. The Make test used the native ohmyhost webhook module. The Zapier test received database events through a Catch Hook step.

Before using a production table, test with a table and records created for the purpose. Check the actual payload in the workflow run: the trigger is only useful if the event contains the information the next step needs.

Ask your coding agent to plan the setup:

```text
Inspect my ohmyhost project and identify the database and environment
used by [APP]. I want a workflow to react when [TABLE] changes. Explain
which events and fields it needs, how to set up the watch and webhook, and
how to verify delivery with test records. Do not expose credentials or change
production data while planning.
```

## Read and change application data

A workflow can query project data and use the result in a later step. It can also execute SQL writes, such as inserting a new task, updating a status, or deleting a test record. Table creation is available through the API as well. Your agent can help design a small, focused operation and check which database it affects.

For example, a new form submission could create a row in a task table. A separate workflow could read an existing record and update its status after a human has reviewed it. Keep the conditions explicit: an update or delete without the intended filter can affect more rows than planned.

```text
Help me prepare a workflow for [PROJECT] that reads [TABLE] and updates
only the record identified by [IDENTIFIER]. Confirm the environment, check
the intended SQL and permissions, and test with a disposable record. Show me
the result before suggesting any production changes.
```

Use only the data the workflow needs. Avoid putting private customer information in labels, sample payloads, public documentation, or agent prompts. Store credentials in the platform's connection settings, and give each automation only the access it needs. If an event itself triggers a workflow that writes back to the same table, plan for repeat events so the automation does not run in a loop.

## Design a workflow you can safely repeat

Start with a single outcome and map the data that travels between steps. For a booking app, the outcome might be to notify the team when a new booking arrives. Identify the booking table and the insert event, then decide which fields the notification actually needs. A record identifier and the relevant booking details may be enough; sending an entire customer record to every destination makes the workflow harder to review.

Set up the trigger against a disposable table first. In Make, the tested path uses the ohmyhost webhook module. In Zapier, the tested path uses a Catch Hook URL as the database webhook destination. In both cases, configure the associated database watch and inspect a real event before mapping fields. If the destination field names differ from the example you expected, use the payload you actually received and consult the API reference.

Next, add the destination step and send a test record. Check the destination as well as the platform's run history: a successful trigger alone does not establish that the downstream step produced the right result. Try an update and a delete if your workflow depends on them. An automation that changes the same table it watches can trigger itself, so choose filters and conditions deliberately and verify that a write does not cause an unintended loop.

Finally, consider what happens when a destination is unavailable or the workflow is retried. Use the destination's own history and a stable record identifier to identify repeated deliveries, and design downstream actions so a repeated event does not create an unwanted duplicate. Keep the workflow disabled for live data until its owner understands the failure path and has checked the connection's permissions.

## Connect the right project

An ohmyhost API key identifies the account and workspace available to the integration. Create and manage keys in [API tokens](https://app.ohmyho.st/tokens), then use the connection setup in the automation platform. Keep the key private; do not paste it into a chat or commit it to your repository. Check which project and environment the workflow will use before testing a write.

The integrations also include project operations, including requesting project creation and checking the operation's status. Project creation is asynchronous: an accepted request is not the same as a ready project. Wait for the reported result before relying on the new project in a later workflow step.

For the underlying operations and response fields, use the [ohmyhost API reference](https://docs.ohmyho.st/api). If a field or available action differs from the example here, check the integration version and the API reference before changing a live workflow.

## Test the complete path

A saved configuration is not proof of delivery. Start the Zap or scenario in its test mode, make a change to a disposable row, and inspect the run history. Repeat the check for each event type your workflow uses: insert, update, and delete. Confirm the expected project, table, event type, and record in the received data.

Then check what the following step actually did. Did the destination receive the intended fields? Did an update touch the intended row? Did a deletion leave unrelated data alone? If a trigger receives nothing, inspect the watch, webhook destination, permissions, and the selected environment before repeating the test.

You can hand this verification to your agent:

```text
Test my [ZAPIER OR MAKE] workflow against disposable data in [PROJECT].
Verify that the configured database watch and webhook deliver the events
used by the workflow. For each event, show the test action, received event,
workflow run and downstream result. Investigate failures, preserve unrelated
data and report what remains unverified. Do not print credentials.
```

When the test succeeds, remove any temporary records and unused test watches or webhooks. Review the final trigger filters, connection permissions, error handling, and destination before enabling a workflow against live data.

## Getting access

To get started in Zapier, open the [ohmyhost public beta listing](https://zapier.com/apps/ohmyhost/integrations) and connect your account. For Make access, [contact us](/contact) and tell us which workflow you have in mind. You can also explore the [API reference](https://docs.ohmyho.st/api) and learn [how ohmyhost works](/blog/introducing-ohmyho-st).
