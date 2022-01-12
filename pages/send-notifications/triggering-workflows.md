---
title: Triggering workflows
---

Workflows that you design within Knock are triggered from within your codebase by calling the `notify` endpoint and telling Knock _who_ should be a potential recipient.

It's important to realize that calling `notify` in Knock may result in no messages being sent to your users. This is because calling `notify` will trigger a workflow, but your end users may have indicated through their `preferences` that they don't wish to be notified by workflows of that type. The good news is that Knock handles all preference-based opt-outs for you automatically.

## Triggering workflows

Workflows are triggered via a call to the `notify` endpoint, which tells Knock to run a specified payload of `recipients` and `data` through the workflow specified by the call.

```js Trigger a Knock workflow
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.notify("new-user-invited", {
  // The user who performed the action
  actor: "user_3",
  // The list of recipients
  recipients: ["user_1", "user_2"],
  // Data to be passed to the template
  data: {
    invitee_name: "Jane Doe",
    invitee_email: "jane.doe@example.com",
    invitee_role: "member",
  },
});
```

Learn more about triggering workflows in [our API reference](/reference#workflows).

### Schema

| Property         | Type     | Description                                                                                                 |
| ---------------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| key\*            | string   | The human readable key of the workflow from the Knock dashboard                                             |
| actor\*          | string   | The user id of the user who performed the action                                                            |
| recipients\*     | string[] | A list of user ids for users that are associated with this workflow                                         |
| data             | map      | A map of properties that are required in the templates in this workflow                                     |
| cancellation_key | string   | A unique identifier to reference the workflow when canceling                                                |
| tenant           | string   | An optional identifier of the owning tenant object for the notifications generated during this workflow run |

### Response

Triggering a workflow will always return a unique UUID v4 representing the workflow run.

```json Trigger workflow response
{
  "workflow_run_id": "05f8a70d-e42a-46dc-86fa-aada5752f6cf"
}
```

## Passing data

You can also pass the schema data required by the workflow into the `notify` call. The
payload must be a valid JSON object, with nested objects and arrays supported.

The data requirements for the payload are determined in the workflow builder, including
indicating which keys are required.

<!-- ## Preventing duplicates

No one likes duplicate notifications.

To guard against sending duplicates you can implement idempotency into your notify calls such that subsequent
calls with the same `idempotencyKey` will fail if any of the previous calls have succeeded. We
recommend using an idempotency key with enough entropy, like a uuid v4.

We'll keep idempotency keys in our system for at least 7 days before they are purged.

```js
const { Knock } = require("@knocklabs/node");
const uuid = require("uuid4");
const knock = new Knock(process.env.KNOCK_API_KEY);

const idempotencyKey = uuid();

await knock.notify("new-user-invited", {
  actor: "user_3",
  recipients: ["user_1", "user_2"],
  data: {
    invitee_name: "Jane Doe",
    invitee_email: "jane.doe@example.com",
    invitee_role: "member",
  },
  idempotencyKey,
});
``` -->

## Generating a cancellation key

Each `notify` call can optionally include a `cancellation_key` that allows you to uniquely identify
it when canceling. Providing your own cancellation key means that you don't need to keep track of
the Knock internal identifiers generated when calling `notify`.

You can read more about canceling workflows [in our guide](/send-notifications/canceling-workflows).

**Keep the following in mind when generating a cancellation key:**

1. Provide a value that allows you to uniquely identify the notify run for the batch of recipients.
   A good example in an invite notification is the `id` of a user invite so that we can easily stop reminders
   for that invite once a user has accepted it.

2. The cancellation key represents the workflow _run_, not the notifications generated per recipient, so
   you usually don't need to include a recipient identifier within the `cancellation_key`.

3. The cancellation key is _scoped per workflow_ so you don't need to include the workflow key
   in the cancellation key.

## Multi-tenancy in notifications

You can optionally pass a `tenant` to your `notify` call. If you are a product that allows users to belong to multiple tenants,
you'll want to pass a `tenant` to Knock in your notify calls so that you can make sure a given user's in-app feed is scoped to the
tenants to which they belong in your product.

You can read more about [supporting multi-tenancy in our guide](/send-and-manage-data/multi-tenancy).
