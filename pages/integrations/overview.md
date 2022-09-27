---
title: Integrations overview
description: Learn more about the integrations that Knock supports to send notifications and receive events. Send notifications to Email, SMS, Push, and Chat apps like Slack with a single API call and trigger them via events from your customer data platforms.
layout: integrations
Section: Integrations
---

You can use Knock to power sophisticated cross-channel notification workflows for your end users, triggered by your application or by events sent to Knock from various customer data platforms (CDPs) like [Segment](https://segment.com) and [Rudderstack](https://rudderstack.com).

## Destination channels

We support the following channel types today:

- [Email](/integrations/email/overview) (such as Sendgrid, Postmark)
- [Push](/integrations/push/overview) (such as APNS, FCM)
- [SMS](/integrations/sms/overview) (such as Twilio, Telnyx)
- [Chat](/integrations/chat/overview) (such as Slack, Microsoft Teams, and Discord)
- [In-app](/integrations/in-app/overview) (such as feeds, toasts, banners)

[Full list of supported channel providers](https://knock.app/integrations?type=channel)

## Source integrations

We support receiving events from customer data platforms which can be configured to trigger notification workflows in Knock.

- [Segment](/integrations/sources/segment)
- [Rudderstack](/integrations/sources/rudderstack)

## Per environment configurations

Unlike most parts of the Knock model, your integrations live at the account-level. This means that when you create a new integration in Knock (say, SendGrid), you only have to create it once.

Once an integration is created, you can then configure it for each of your environments. There are a couple reasons we enable per-environment configuration for each.

- If you use different instances of a service for each of your environments, you can use the respective API key or destination webhook URL of each within your different Knock environments.
- You can provide environment-level config details to your channels. A common example is to add the suffix "(dev)" to the "From name" on all emails sent in your development environment.

If you want to use the exact same configuration for a given channel across all environments, you can use the "Copy from" button to duplicate your configuration across environments.

## Channel specific features

### Sandbox mode

Sometimes you don't want a message to be sent in a local or testing environment, but you _do_ want the ability to debug your messages and see what might have gone out.

Sandbox mode enables you to generate and preview messages for a given channel, without sending them to your downstream provider for delivery. Sandbox mode is great for when you want to test a channel's output, but want your messages to end up at `/dev/null` instead of sending live notifications.

Sandbox mode is supported across all channel types and can be enabled from the environment configuration view of a channel.

### Channel groups

You may encounter a use case where you consistently want to send the same template to two providers across all of your workflows. Push is a good example. If you're sending notifications directly to iOS and Android devices (through APNS and Firebase, respectively), you don't want to have to replicate templates across channel steps for each of those providers in all of your workflows.

Channel groups solve this problem. With a channel group, you can combine multiple providers into a single channel that you can use to send the a single notification template across multiple providers. As an example, I could have a "Push" channel group that hosts my connections for APNS and FCM, then use that single "Push" step for any workflows where I want to notify users across my mobile apps.

**Note:** Channel groups is currently in beta. If you'd like access, please reach out via the feedback button at the top of this page and we'll enable it for you.

## Supported integration providers

Here are the providers we currently support within Knock. We're adding more each week. If you want us to add a new provider to this list, please let us know through the feedback button at the top of this page.

### Customer data platforms
_For receiving events in Knock, currently in beta. If you'd like access, please reach out via the feedback button at the top of this page._

- [Segment](/integrations/sources/segment)
- [Rudderstack](/integrations/sources/rudderstack)

### Email

- [AWS SES](/integrations/email/aws-ses)
- [Mailgun](/integrations/email/mailgun)
- [Mailjet](/integrations/email/mailjet)
- [Postmark](/integrations/email/postmark)
- [Sendgrid](/integrations/email/sendgrid)

### Push

- [Apple Push Notification Service](/integrations/push/apns)
- [Expo](/integrations/push/expo)
- [Firebase Cloud Messaging](/integrations/push/firebase)

### SMS

- [Telnyx](/integrations/sms/telnyx)
- [Twilio](/integrations/sms/twilio)

### Chat apps

- [Slack](/integrations/chat/slack)
- [Discord](/integrations/chat/discord)
- [Microsoft Teams](/integrations/chat/microsoft-teams)

### In-app

- [Knock in-app](/integrations/in-app/knock-feed)
