---
title: Delivering notifications
description: Learn how Knock sends in-app and out-of-app notifications to email, SMS, push, and chat channels like Slack.
tags: ["delivery", "channels", "delivery status", "retry logic", "resilience"]
section: Send notifications
---

## Overview

When a workflow is executed any [channel steps](/designing-workflows/channel-step) may produce zero or more messages for the recipient to be sent to the selected channel. The message(s) are then sent to the provider via the configuration set on the channel using Knock's resilient sending pipeline which handles any retry logic for you.

## Send retry logic

Our sending pipeline will handle retrying sending notifications to the underlying provider in the following cases:

- There was an error contacting the provider (e.g. a network connection issue)
- The provider responded indicating there was retryable error (e.g. server overloaded, rate limit exceeded)
- There was an error in our sending pipeline

We will retry delivery up to **8 times over a 30-minute window**, utilizing an exponential back-off strategy with jitter.

In the event that a message-sending attempt is retried you will see the [message delivery status](/send-notifications/message-statuses#delivery-status) go from `undelivered` to `queued`.

## Delivery status retry logic

For certain channel types and where it is supported by the provider, we also implement [delivery status checks](/send-notifications/message-statuses#delivery-status). We will retry a delivery status check in the following cases:

- The provider indicated the request is retryable (e.g. there's no delivery status being presented yet)
- There was an error contacting the provider (e.g. a network connection issue)
- There was an error in our delivery status check pipeline

We will retry delivery status checks up to **10 times over a 30-minute window,** utilizing an exponential back-off strategy with jitter.

## Sending logs and debugging

For all out-of-app providers you can find logs of the requests we make and the responses we receive under the "Logs" tab of an individual message in the dashboard. You can use these logs to understand any errors coming from the provider while we were executing your requests.

If you find an error that you cannot fix yourself, please contact [our support team](mailto:support@knock.app) for help.
