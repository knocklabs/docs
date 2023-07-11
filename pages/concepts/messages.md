---
title: Messages
description: Learn how Knock models per-recipient notifications with Messages.
tags: ["messages", "workflows"]
section: Concepts
---

## An overview

A Message in Knock represents a notification delivered to a [User](/send-and-manage-data/users) or an [Object](/send-and-manage-data/objects) on a particular channel. This is the core Knock data entity that your recipients will interact with when receiving notifications.

Knock exposes a set of [Message APIs](/reference#messages) via which you can query for notifications and update messages individually or in batches. The Knock [Feeds API](/reference#feeds) is a specialized view of messages delivered to an in-app feed channel.

The Knock dashboard makes available various message metadata to help you debug your notifications. This includes:

- Information about the request that triggered the delivery of the message.
- A preview of the message content as displayed for the recipient.
- Logs of requests between Knock and your channel provider as Knock works to deliver the message to the recipient.
- A timeline of message lifecycle events.

## Statuses

Messages have two types of statuses. These are:

- **Delivery statuses** — The delivery state of a message as reported by your channel provider. Delivery statuses are mutually exclusive and implicitly managed by Knock as part of notification delivery.
- **Engagement statuses** — The way in which the recipient has interacted with the notification. A message can have multiple engagment statuses, and you can manage them yourself via the Knock API.

Knock captures changes in message status as events that can be sent to [outbound webhooks](/send-and-manage-data/outbound-webhooks).

To learn more, see our [message statuses guide](/send-notifications/message-statuses).

## Link and open tracking

Knock provides opt-in, provider agnostic tracking capabilities for your notifications. With link tracking, Knock will capture link-click actions by your recipients as a message event. With open tracking, Knock will embed tracking pixels in email channel messages to help gauge when recipients are opening and reading your email notifications.

To learn more, see the [Knock tracking guide](/send-notifications/tracking).
