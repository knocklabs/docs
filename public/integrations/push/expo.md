---
title: How to send push notifications using Expo
description: How to send mobile push notifications with Expo and Knock.
tags: ["react native", "ios", "android", "push"]
section: Integrations
layout: integrations
---

In this guide we'll walk through how to configure an Expo provider in Knock to send push notifications. This guide assumes that you've already created an Expo channel in the Knock dashboard and that your React Native application is already setup to support Push notifications.

If you're new to setting up push in your Expo enabled React Native project, you can follow the <a href="https://docs.expo.dev/push-notifications/overview/" target="_blank">excellent setup guide in the Expo documentation</a>.

## How to configure Expo with Knock

To configure Expo with Knock, you'll need your Expo project name (sometimes referred to as an `experience_id`) and if you've enabled enhanced push security, you'll also need an auth token. You can read more about <a href="https://docs.expo.dev/push-notifications/sending-notifications/#additional-security" target="_blank">Enhanced Push Security in the Expo docs</a>.

You can get both of these by logging into the <a href="https://expo.dev/" target="_blank">Expo console</a>. Once you have them, go back to the environment configuration for your Expo channel, complete the configuration, and you're good to go.

## Using Expo with Knock

In order to use Expo with Knock you'll need to synchronize your users device tokens retrieved from the Expo SDK in either Android, iOS, or on the Web to Knock by [setting channel data](/managing-recipients/setting-channel-data) for your recipient.

You can follow the appropriate <a href="https://docs.expo.dev/push-notifications/overview/" target="_blank">quickstart guide for your platform</a> on Expo to see how to get the device token.

<MultiLangCodeBlock
  snippet="users.setChannelData-push"
  title="Set Expo channel data for a user"
/>

## Managing tokens

By default, Knock makes no assumptions about managing your device tokens. This means you are responsible for removing tokens when a recipient opts out of notifications on a device or when their token expires.

However, Knock does provide an opt-in token deregistration feature that automatically removes invalid tokens from a recipient's channel data when a message bounces. When enabled, Knock will automatically remove invalid or expired tokens upon receiving a bounce event from the provider.

You can configure token deregistration on a per-environment basis in your channel's environment configurations. See our [token deregistration guide](/integrations/push/token-deregistration) for more details on enabling and working with this feature.

## Data passed to Expo

When sending a notification to Expo, we also pass through the following attributes:

| Property           | Type   | Description                                            |
| ------------------ | ------ | ------------------------------------------------------ |
| knock_message_id\* | string | The message ID of the corresponding Knock message      |
| data \*            | string | Any key/value data passed through in your trigger call |

## Silent/background notifications

We support sending Expo notifications as "silent," data-only notifications within Knock. You can enable this per push notification template by clicking "Template settings" in the header of the template editor.

When silent push is enabled, we'll no longer pass through the content payload and your message will be sent with the `content-available: true` flag as expected by Expo. All properties in the data payload described above will be sent with your notification.

## Using overrides to customize notifications

We have full support for overriding the payload sent to Expo for adding things like badge counts, extra data properties, and sound files. You can set push overrides on the template settings modal, which is accessed by clicking on the "Template settings" button when viewing a push notification template within the workflow editor. Push overrides support Liquid for injecting `data` properties and referencing attributes on your recipients.

Overrides are merged into the notification payload sent to Expo. See the <a href="https://docs.expo.dev/push-notifications/sending-notifications/#message-request-format" target="_blank">Expo documentation for more details</a>.

## Channel data requirements

In order to use a configured Expo channel you must store a list of one or more device tokens for the user or the object that you wish to deliver a notification to. You can retrieve a device token by following the guide on the <a href="https://docs.expo.dev/push-notifications/push-notifications-setup/" target="_blank">Expo developer documentation</a>.

| Property | Type     | Description               |
| -------- | -------- | ------------------------- |
| tokens\* | string[] | One or more device tokens |
