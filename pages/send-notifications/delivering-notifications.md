---
title: Delivering notifications
---

## In-app feed support

We currently support in-app feeds via our own hosted feed solution. This provides real-time behavior
as well as pre-built in-app components for you to use.

If you need to use a component library outside of React JS and are in the JS ecosystem,
you can leverage our JS SDK otherwise you can integrate with our API directly.

## Email provider support

We currently support the following email providers:

- SendGrid
- Postmark

If your provider is not listed above, please [get in touch](mailto:support@knock.app).

## Other channels

In the case in which there are other channels that you need to support within your product we
recommend the following strategy for the time being:

1. Connect a webhook to notify you whenever there are new notifications triggered for your
   users
2. Receive the webhook and use it to trigger the notification for the user from within your API

In the case where you have non user related channel needs, like Slack or Microsoft Teams, please
contact us and we can assist.
