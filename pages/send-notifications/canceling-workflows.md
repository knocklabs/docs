---
title: Canceling workflows
---

Canceling a workflow allows you to stop the sending of messages within a specified workflow for
one or more recipients. This can be useful in settings like reminders where a notification needs
to be canceled once a user has performed the intended action.

It's important to understand that only workflows that include a delay function can be canceled within Knock, as without the delay Knock will _immediately_ send a notification to your
recipients.

## Canceling a triggered workflow

To perform a cancellation, you first need to give Knock a pointer to understand how to uniquely
identify the triggered workflow by providing a `cancellation_key` on the `notify` call.

You can read about generating workflow cancellation keys and some best practices in the
[triggering workflows guide](/send-notifications/triggering-workflows#generating-a-cancellation-key).

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

// Some invite approval code to reference a previously created invite
const userInvite = await invites.approve(inviteToken);

// Tell knock to cancel the running workflow for all recipients
await knock.cancelNotify("new-user-invited", userInvite.id);
```

### Schema

| Property        | Type     | Description                                                           |
| --------------- | -------- | --------------------------------------------------------------------- |
| key\*           | string   | The human readable key of the workflow from the Knock dashboard   |
| cancellation_key | string   | A unique identifier for the workflow run                          |
| recipients      | string[] | A list of specific user ids to cancel the workflow for (optional) |

## Canceling for subsets of recipients

In some cases you may need to cancel a workflow for a subset of recipients only. You can do this
by specifying the recipients list on the cancellation:

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.cancelNotify("new-user-invited", userInvite.id, {
  recipients: ["user_1", "user_2"],
});
```

## Cancellation gotchas

There are a few things to watch out for when using cancellations:

1. A cancellation cannot be performed on a specific channel step, it can only be performed against
   the _entire_ workflow.

2. You cannot cancel a given workflow run after it has finished ; if you need to revoke messages for
   persistent channels like the in-app feed, then you can `archive` a message instead.
