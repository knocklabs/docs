---
title: Canceling notifications
---

Canceling a notification allows you to stop the sending of messages within a notification flow for
one or more recipients. This can be useful in settings like reminders where a reminder needs
to be canceled once a user has performed the intended action.

It's important to understand that only notifications with a delay can be canceled within Knock, this
is because without the delay Knock will automatically send a notification _immediately_ to your
recipients.

## Canceling a triggered notification

To perform a cancelation, you first need to give Knock a pointer to understand how to uniquely
identify the triggered notification by providing an `cancelation_key` on the `notify` call.

You can read about generating notification cancelation keys and some best practices in the
[triggering notifications guide](/send-notifications/triggering-flows#generating-a-cancelation-key).

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

// Some invite approval code to reference a previously created invite
const userInvite = await invites.approve(inviteToken);

// Tell knock to cancel the running notification workflow for all recipients
await knock.cancelNotify("new-user-invited", userInvite.id);
```

### Schema

| Property        | Type     | Description                                                           |
| --------------- | -------- | --------------------------------------------------------------------- |
| key\*           | string   | The human readable key of the notification from the Knock dashboard   |
| cancelation_key | string   | A unique identifier for the notification run                          |
| recipients      | string[] | A list of specific user ids to cancel the notification for (optional) |

## Canceling for subsets of recipients

In some cases you may need to cancel a notification for a subset of recipients only. You can do this
by specifying the recipients list on the cancelation:

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.cancelNotify("new-user-invited", userInvite.id, {
  recipients: ["user_1", "user_2"],
});
```

## Cancelation gotchas

There are a few things to watch out for when using cancelations:

1. A cancelation cannot be performed on a specific channel step, it can only be performed against
   the _entire_ workflow.

2. You cannot cancel a notification after it has been sent; if you need to revoke messages for
   persistent channels like the in-app feed, then you can `archive` a message instead.
