---
title: Designing notification flows
---

The Knock notification designer allows you to design notification flows that can deliver a
notification across multiple channels for your users, all in a visual interface with a minimal amount
of coding required.

## Cross-channel notifications

You can use the Knock designer to orchestrate sending notifications to multiple channels, including
in-app and out of app channels.

### Picking a channel

You can select any channel that you've already configured inside of Knock, which can be in-app (via a feed)
or an out-of-app channel like email.

### Trigger conditions

Using trigger conditions you can control whether or not the channel will be executed for the recipient.
Some examples of triggers you can employ are:

- Only send a push notification if the user has a registered push token
- Only send an email if the in-app notification has not been opened or read
- Only send an email if the event payload indicates it should be sent via email

### Designing messages

You can use the Knock template designer in-order to create the notifications that will be sent per
channel. The template designer allows you to inject variables into the template as well so that you can
customize the messages.

In addition to injecting custom variables, you'll also have access to the `recipient` (the user who
is being sent the notification) as well as the `actor` (the user who performed the action that generated)
the notification.

The custom variables will be passed to the template via the `notify` call when triggering the notification flow.

## Logic functions

When designing your notifications you can also use pre-defined logic functions in your notification
flows. Logic functions allow you to execute a set of logic before a channel is called.

We currently support the following logic functions:

- Batch (aggregate)
- Throttle
- Delay

## Up next

Once you've created a notification flow, the next step is to trigger that flow from your backend, usually
once a specific action has occurred.
