---
title: Delivering notifications
description: Learn how Knock sends in-app and out-of-app notifications to email, SMS, push, and chat channels (such as Slack).
tags: ["delivery", "channels", "delivery status", "retry logic", "resilience"]
section: Send notifications
---

## Overview

When a workflow is executed, its [channel steps](/designing-workflows/channel-step) may produce zero or more messages for the workflow run's recipient. Each message is then sent to its channel's provider using Knock's resilient sending pipeline which handles retries and logging for you.

## Retry logic

### Send retries

We will retry sending notifications to the underlying provider when:

- There is an error contacting the provider (e.g. a network connection issue).
- The provider responds with a retryable error (e.g. server overloaded, rate limit exceeded).
- There is a transient error in our sending pipeline.

We will retry delivery up to **8 times over a 30-minute window**, utilizing an exponential back-off strategy with jitter.

We will also change the [message delivery status](/send-notifications/message-statuses#delivery-status) and emit corresponding [message events](/send-notifications/message-statuses#message-events) during this delivery lifecycle. You can expect to see:

- A `queued` status when the message has been enqueued for a delivery attempt.
- A `delivery_attempted` status when Knock has attempted delivery but the attempt has failed. The delivery may or may not be retried.
- A `bounced` status when the provider indicates a message has been bounced and Knock will not retry.
- An `undelivered` status when Knock has failed to deliver the message and will not retry (either retries have been exhausted or an unretryable error was encountered).

### Delivery status retries

For certain channel types where it is supported by the provider, we run [delivery status](/send-notifications/message-statuses#delivery-status) checks. In these cases, we poll the provider's API to try to confirm delivery.

On success, we update the message delivery status to `delivered`. We retry a delivery status check when:

- There is an error contacting the provider (e.g. a network connection issue).
- The provider indicates the request is retryable (e.g. there's no delivery status being presented yet).
- There is a transient error in the delivery status check pipeline.

For specific providers, on failure we will update the delivery status to `undelivered` or `bounced` depending on the error status. We will not retry a delivery status check in these cases.

We will retry delivery status checks up to **10 times over a 30-minute window,** utilizing an exponential back-off strategy with jitter.

## Sending logs and debugging

For all out-of-app providers you can find logs of the requests we make and the responses we receive under the "Logs" tab of an individual message in the dashboard. You can use these logs to understand any errors coming from the provider while we were executing your requests.

If you find an error that you cannot fix yourself, please contact [our support team](mailto:support@knock.app) for help.
