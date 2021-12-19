---
title: Batching & throttling
---

To prevent sending an excessive amount of messages to your end users, you can use batching
and throttling functions to control the flow of messages you send.

## Batching (queueing)

Batching notifications involves collapsing multiple messages of the same type for a user
into a single message within a given window of time. "Jane and 3 others" and "Jane left 5 comments" are both examples of batched messages.

Knock helps introduce batching into your notifications experience by allowing you to specify a batch
key and a batch window in your workflow. 

### Batching windows

A batching window determines the window of time in which the messages should be batched for
the recipient. The window will be reset if either the duration is exceeded, or the message batch
is read.

The batch window is specified when configuring a workflow. (Note: we recommend
keeping batch window to an hour or less as a best practice.)

### Picking a batch key

Batches are applied per recipient but you'll need to pick a batch key that allows you to logically
group messages together. Typically this means you'll want to pick a batch key
that relates to the subject of the notification.

Some example batch keys:

- In a document editing app, where comments are being left per document we'd want to use an identifier
  for the document so that comments within the same document are grouped together.
- In a file sharing app, we might want to collapse all new file upload notifications into a single
  folder, and so we'd use the folder identifier as the batch key.
  
You can learn more about using batch functions within the Knock dashboard in [our feature guide](https://knockapp.notion.site/Workflow-functions-batch-and-delay-0cb7cbca246f44deb922aaade07ae846). 

## Throttling

**Coming soon**

Sometimes you may wish to throttle the total amount of messages that are sent to a user
for a given subject. This allows you to ensure that a message for a specific topic is only
delivered once within the throttling window.

You may wish to throttle your messages in the case in which your users could generate many
messages for the same subject or action in a short space of time, such as requesting to join an account
or access something restricted.

In these cases you can apply a throttling window so that the users only receive a new message once
after the throttling window has elapsed. In addition to the throttling window, you must specify
a throttle key on your workflow so that we know how to throttle a particular message.

Typically the subject of the notification makes for a good throttle key.


