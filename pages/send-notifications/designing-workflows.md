---
title: Designing workflows
---

The Knock workflow builder allows you to design workflows that can deliver a
notification across multiple channels for your users, all in a visual interface with a minimal amount
of coding required.

## Cross-channel notifications

You can use the Knock workflow builder to orchestrate the delivery of messages across multiple channels, including
in-app and out-of-app channels.

### Picking a channel

You can select any channel that you've already configured inside of Knock, including in-app channels such as feeds
or out-of-app channels such as email.

### Trigger conditions

You can use trigger conditions to control whether a given channel will be executed for the recipient.

Some examples of triggers you can employ are:

- Only send a push notification if the user has a registered push token
- Only send an email if the in-app notification has not been opened or read
- Only send an email if the event payload indicates it should be sent via email

### Designing messages

You can use the Knock template designer to build the messages that will be sent per
channel. The template designer includes support for variable injection so you customize your messages with data from your product.

In addition to injecting custom variables, you'll also have access to data properties about the `recipient` (the user who
is receiving the message) as well as the `actor` (the user who performed the action that generated
the message.)

The custom variables will be passed to the template via the `notify` call when triggering the workflow.

## Logic functions

Logic functions can be used in workflows to execute a set of logic before a channel is called.

We currently support the following logic functions:

- Batch (aggregate)
- Delay

## Up next

Once you've created a workflow, the next step is to trigger that workflow from your backend with a `notify` call, usually
once a specific action has occurred.
