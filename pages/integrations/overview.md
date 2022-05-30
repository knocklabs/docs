---
title: Overview
Section: Integrations
---

You can use Knock to power sophisticated cross-channel notification workflow for your end users.

We support the following out-of-app channel types today:
- Email
- Push
- SMS
- Chat apps (such as Slack, Microsoft Teams, and Discord)

In the pages that follow, we provide in-depth guides for a few of our most popular integrations.

Below you'll find a complete list of the integrations we support, as well as a few general tips about channel integrations to keep in mind as you dig into powering your cross-channel notifications with Knock.

## Per environment channel configurations

Unlike most parts of the Knock model, your channels live at the account-level. This means that when you create a new channel in Knock (say, SendGrid), you only have to create it once.

Once a channel is created, you can then configure it for each of your environments. There are a couple reasons we enable per-environment configuration for each channel.

- If you use different instances of a service for each of your environments, you can use the respective API key of each within your different Knock environments.
- You can provide environment-level config details to your channels. A common example is to add the suffix "(dev)" to the "From name" on all emails sent in your development environment.

If you want to use the exact same configuration for a given channel across all environments, you can use the "Copy from" button to duplicate your configuration across environments.

## Sandbox mode

Sometimes you don't want a message to be sent in a local or testing environment, but you _do_ want the ability to debug your messages and see what might have gone out.

Sandbox mode enables you to generate and preview messages for a given channel, without sending them to your downstream provider for delivery. Sandbox mode is great for when you want to test a channel's output, but want your messages to end up at `/dev/null` instead of sending live notifications.

Sandbox mode is supported across all channel types and can be enabled from the environment configuration view of a channel.

## Channel groups

You may encounter a use case where you consistently want to send the same template to two providers across all of your workflows. Push is a good example. If you're sending notifications directly to iOS and Android devices (through APNS and Firebase, respectively), you don't want to have to replicate templates across channel steps for each of those providers in all of your workflows.

Channel groups solve this problem. With a channel group, you can combine multiple providers into a single channel that you can use to send the a single notification template across multiple providers. As an example, I could have a "Push" channel group that hosts my connections for APNS and FCM, then use that single "Push" step for any workflows where I want to notify users across my mobile apps.

**Note:** Channel groups is currently in beta. If you'd like access, please reach out via the feedback button at the top of this page and we'll enable it for you.

## Supported channel providers

Here are the providers we currently support across each channel type within Knock. We're adding more each week. If you want us to add a new provider to this list, please let us know through the feedback button at the top of this page.

### Email

- Postmark
- [Sendgrid](/integrations/sendgrid)
- Mailgun
- [AWS SES](/integrations/aws-ses)

### Push

- Apple Push Notification service
- Firebase Cloud Messaging
- Expo

### SMS

- [Twilio](/integrations/twilio-sms)
- Telnyx

### Chat apps

- [Slack](/integrations/slack)
