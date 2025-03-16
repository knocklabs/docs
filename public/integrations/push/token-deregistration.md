---
title: Token deregistration
description: How to use Knock token deregistration to manage recipient tokens by removing invalid tokens.
tags: ["token deregistration", "channel data", "bounced"]
section: Integrations > Push
layout: integrations
---

For push providers only, Knock provides an opt-in, provider-agnostic token management capability known as token deregistration. Knock removes invalid tokens from a recipient's corresponding channel data if that token results in a `bounced` message on send.

This feature is available for all push providers, except OneSignal when the recipient mode is set to `external_id`. In this case, Knock only has access to the user's ID and therefore cannot deregister the associated external token.

Workflow overrides are **not** available for token deregistration. This capability can only be configured at the provider level.

## Availability

<table>
  <thead>
    <tr>
      <th>Provider</th>
      <th>Token deregistration available?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>APNs</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>FCM</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Expo</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>OneSignal (`player_id`)</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>OneSignal (`external_id`)</td>
      <td>❌</td>
    </tr>
  </tbody>
</table>

## Configuring Knock token deregistration

You can configure Knock tracking on a per-environment basis using your channel's [per-environment configurations](/integrations/overview#per-environment-configurations). Token deregistration will default to `ON` when you first create a channel.

<Image
  src="/images/integrations/push/knock-token-deregistration-channel-config.png"
  alt="An image of a preference set"
  width={1356}
  height={1452}
  className="rounded-md mx-auto border border-gray-200"
/>

## How it works

When Knock attempts to deliver a message through a supported push provider, any errors caused by invalid or expired tokens result in a bounce. This generates a `message.bounced` event containing the invalid token.

Knock will remove the invalid token from the list of tokens present in the recipient's channel data. This allows for an automated audit of the tokens present for recipients.

## Working with Knock token deregistration

### Outbound webhooks

If you use Knock's outbound webhooks, you can view the invalid token in the `message.bounced` events captured. If token deregistration is `ON`, no further intervention is needed for token removal. See the [outbound webhooks guide](/developer-tools/outbound-webhooks/overview) for more details.
