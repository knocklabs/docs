---
title: Integrations overview
description: Learn more about the integrations that Knock supports to send notifications and receive events. Send notifications to Email, SMS, Push, and Chat apps like Slack with a single API call and trigger them via events from your customer data platforms.
tags: ["sandbox mode", "sandbox", "channel conditions", "channel groups"]
layout: integrations
Section: Integrations
---

You can use Knock to power sophisticated cross-channel notification workflows for your end users, triggered by your application or by events sent to Knock from various customer data platforms (CDPs) like [Segment](https://segment.com) and [Rudderstack](https://rudderstack.com).

## Destination channels

We support the following channel types today:

- [Email](/integrations/email/overview) (such as Sendgrid, Postmark)
- [In-app](/integrations/in-app/overview) (such as feeds, toasts, banners)
- [Push](/integrations/push/overview) (such as APNS, FCM)
- [SMS](/integrations/sms/overview) (such as Twilio, Telnyx)
- [Chat](/integrations/chat/overview) (such as Slack, Microsoft Teams, and Discord)
- [Webhook](/integrations/webhook/overview) (send webhooks to custom channels or enable your own customers to configure webhooks in your product)

[Full list of supported channel providers](https://knock.app/integrations?type=channel)

## Source integrations

We support receiving events from customer data platforms which can be configured to trigger notification workflows and populate [Audiences](/concepts/audiences) in Knock.

- [Segment](/integrations/sources/segment)
- [Rudderstack](/integrations/sources/rudderstack)
- [Jitsu](/integrations/sources/jitsu)
- [Freshpaint](/integrations/sources/freshpaint)
- [Hightouch](/integrations/sources/hightouch)
- [Census](/integrations/sources/census)
- [Polytomic](/integrations/sources/polytomic)
- [HTTP](/integrations/sources/http) (a generic HTTP endpoint for accepting events)

## Platform extensions

Knock can also integrate with other tools for debugging, monitoring, and more, including the following:

- [Datadog](/integrations/extensions/datadog)/[New Relic](/integrations/extensions/new-relic). Receive Knock platform metrics for workflow & channel successes and errors.
- [Segment](/integrations/extensions/segment)/[Heap](/integrations/extensions/heap). Send Knock notification events to downstream analytics tools.
- [Vercel](/integrations/extensions/vercel). Synchronize your Knock API keys to one or more Vercel projects.

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

Sandbox mode is supported across all channel types (except for in-app) and can be enabled from the environment configuration view of a channel.

### Channel conditions

You can use channel conditions to place a [condition](/send-and-manage-data/conditions) on all instances of a channel within a given environment. As an example, if you want to ensure that your email channel only sends to recipients from your domain when it's executing in your staging environment, a channel-level condition would be great way to do that.

To add a condition to a channel's environment configuration, navigate to **Integrations** > **Channels** in your dashboard, click on the channel you'd like to update, then click "Manage configuration" next to the relevant environment. Select "Conditions" in the modal that is opened.

![Managing channel conditions in Knock.](/images/integrations/channel-conditions-editor.png)

<figcaption>Managing channel conditions in Knock.</figcaption>

Knock will execute your channel conditions for every step using the given channel across all your workflow runs. Knock will join these channel conditions with any [step conditions](/designing-workflows/step-conditions) via an `AND`, meaning both channel and step conditions will need to pass evaluation for the step to execute. You can then use Knock's [conditions debugger](/send-and-manage-data/conditions#debugging-conditions) to examine the evaluations of your channel conditions.

### Channel groups

You may encounter a use case where you consistently want to send the same template to two providers across all of your workflows. Push is a good example. If you're sending notifications directly to iOS and Android devices (through APNS and Firebase, respectively), you don't want to have to replicate templates across channel steps for each of those providers in all of your workflows.

Channel groups solve this problem. With a channel group, you can combine multiple providers into a single channel that you can use to send the a single notification template across multiple providers. As an example, I could have a "Push" channel group that hosts my connections for APNS and FCM, then use that single "Push" step for any workflows where I want to notify users across my mobile apps.

**Note:** Channel groups is currently in beta. If you'd like access, please reach out via the feedback button at the top of this page and we'll enable it for you.

## Supported integration providers

Here are the providers we currently support within Knock. We're adding more each week. If you want us to add a new provider to this list, please let us know through the feedback button at the top of this page.

### Email

- [AWS SES](/integrations/email/aws-ses)
- [Mailersend](/integrations/email/mailersend)
- [Mailgun](/integrations/email/mailgun)
- [Mailjet](/integrations/email/mailjet)
- [Mailtrap](/integrations/email/mailtrap)
- [Mandrill](/integrations/email/mandrill)
- [Postmark](/integrations/email/postmark)
- [Resend](/integrations/email/resend)
- [Sendgrid](/integrations/email/sendgrid)
- [SMTP](/integrations/email/smtp)
- [Sparkpost](/integrations/email/sparkpost)

### Chat apps

- [Slack](/integrations/chat/slack/overview)
- [Microsoft Teams](/integrations/chat/microsoft-teams/overview)
- [Discord](/integrations/chat/discord)
- [WhatsApp](/integrations/chat/whatsapp)

### In-app

- [Knock in-app](/integrations/in-app/knock)

### Push

- [Apple Push Notification Service](/integrations/push/apns)
- [Firebase Cloud Messaging](/integrations/push/firebase)
- [Expo](/integrations/push/expo)
- [OneSignal](/integrations/push/one-signal)

### SMS

- [Africa's Talking](/integrations/sms/africas-talking)
- [AWS SNS](/integrations/sms/aws-sns)
- [Mailersend](/integrations/sms/mailersend)
- [MessageBird](/integrations/sms/messagebird)
- [Plivo](/integrations/sms/plivo)
- [Sinch](/integrations/sms/sinch)
- [Sinch MessageMedia](/integrations/sms/sinch-message-media)
- [Telnyx](/integrations/sms/telnyx)
- [Twilio](/integrations/sms/twilio)
- [Vonage](/integrations/sms/vonage)

<!-- adding this for a test! -->