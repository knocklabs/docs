---
title: Batching & throttling
---

To prevent sending an excessive amount of notifications to your customers, you can use batching
and throttling of your messages.

## Batching (queueing)

Batching notifications involves collapsing multiple notifications of the same type for a user
into a single message within a given window of time. You might have seen this on other applications
as showing "Jane and 3 others" or "Jane left 5 comments" in the notifications.

Knock helps with introducing batching into your notifications by allowing you to specify a batch
key and a window in which to apply the batch to in your notifications flow.

### Batching windows

A batching window determines the window of time in which the notifications should be batched for
the recipient. The window will be reset if either the duration is exceeded, or the notification batch
is read.

The batch window can be specified when creating the notification flow but please note, we don't recommend
setting a batch window of a few hours as a best practice.

### Picking a batch key

Batches are applied per recipient but you'll need to pick a batch key that allows you to logically
group notifications together for the recipient. Typically this means you'll want to pick a batch key
that relates to the subject of the notification.

Some example batch keys:

- In a document editing app, where comments are being left per document we'd want to use an identifier
  for the document so that comments within the same document are grouped together.
- In a file sharing app, we might want to collapse all new file upload notifications into a single
  folder, and so we'd use the folder identifier as the batch key.

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.notify("new-comment", {
  actor: comment.user_id,
  recipients: [`project.${project}.followers`],
  batchKey: comment.document_id,
  data: {
    comment_text: comment.text,
  },
});
```

## Throttling

Sometimes you may wish to throttle the total amount of notifications that are sent to a user
for a given subject. This allows you to ensure that a notification for a specific topic is only
delivered at most once in the throttling window.

You may wish to throttle your notifications in the case in which your users could generate many
notifications for the same subject in a short space of time, like requesting to join an account
or access something restricted.

In these cases you can apply a throttling window so that the users would only receive a new notification
after the first once the window of time is up. In addition to the throttling window, you must specify
a throttle key on your notification so that we know how to throttle a particular notification.

Typically the subject of the notification makes for a good throttle key.
