---
title: Setting channel specific data
---

Some channel integrations require user and channel specific data in order to send notifications. Push channels like APNS (Apple Push Notification Service) and FCM (Firebase Cloud Messaging) are good examples, where both require that there are device specific tokens that target the user in a push notification.

At Knock we call this concept `ChannelData`, which lives under a user and stores channel-specific data for that user to then be used when sending a notification.

## Things to know about channel data

- Some channel types, like push, will automatically be skipped if the user does not have the appropriate channel data stored (e.g. we don't know how to deliver a notification unless there are `tokens` set for the recipient)
- Knock will store the channel data for you, but will make no assumptions about whether the data being store is valid. That means that if a push token expires, it's your responsibility to omit that token from the channel data for the future.

## Setting channel data

Before getting or setting channel data, the channel must first be created and configured for yours environments. You can do this inside the Knock dashboard.

You can set channel data for a given channel using the `users.setChannelData` method in the SDK. Please note that the channel data will always be overwritten with each `set` call.

```javascript Setting channel data
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

// Get this value in your Knock dashboard
const APNS_CHANNEL_ID = "some-channel-id-from-knock";

await knockClient.users.setChannelData("jhammond", APNS_CHANNEL_ID, {
  // Tokens are always stored in a list, to represent a user having one or more devices
  tokens: [userDeviceToken],
});
```

## Getting channel data

To retrieve the currently set channel data you can use the `users.getChannelData` method. Note, that if
the channel data is not set for this user that this will return a 404.

```javascript Getting channel data
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

// Get this value in your Knock dashboard
const APNS_CHANNEL_ID = "some-channel-id-from-knock";

const channelData = await knockClient.users.getChannelData(
  "jhammond",
  APNS_CHANNEL_ID,
);
```

## Provider data requirements

### Push channels

Channel data requirements for each push provider are listed below. Typically this means setting
one or more `tokens` to uniquely identify a users device.

#### APNS (Apple Push Notification Service)

| Property | Type     | Description                             |
| -------- | -------- | --------------------------------------- |
| tokens\* | string[] | One or more device tokens for this user |

#### FCM (Firebase Cloud Messaging)

| Property | Type     | Description                             |
| -------- | -------- | --------------------------------------- |
| tokens\* | string[] | One or more device tokens for this user |

_\* = a required property_
