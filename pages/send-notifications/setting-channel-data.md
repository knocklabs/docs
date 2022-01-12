---
title: Setting channel data
---

Some channel integrations require user and channel specific data in order to send notifications. Push channels like APNS (Apple Push Notification Service) and FCM (Firebase Cloud Messaging) are good examples, where both require that there are device-specific tokens that target the user in a push notification. Slack is another good example, where the channel data from a Slack integration in your product is stored on a Knock [object](/send-and-manage-data/objects).

At Knock we call this concept `ChannelData`. `ChannelData` lives under a [user](/send-and-manage-data/users) or an [object](/send-and-manage-data/objects) and stores channel-specific data to be used when that user or object is included as a recipient on a [triggered workflow](/send-notifications/triggering-workflows).

## Things to know about channel data

- For channel types that require channel data (such as push and Slack,) the channel step will be skipped in a workflow run if the required channel data is not stored on the recipient.
- Knock stores channel data for you but makes no assumptions about whether the stored channel data is valid. That means that if a push token expires, it's your responsibility to omit/update that token for the future notifications.

## Setting channel data

Before getting or setting channel data, you must first configure that channel in your environments. You can do this inside the Knock dashboard under "Channels". Once the channel for which you want to store channel data has been created, you're ready to `setChannelData` for your users and objects.

### For users

You can set channel data for a given user using the `users.setChannelData` method. Please note that the channel data will always be overwritten with each `set` call.

In the example below, we're setting a user's device token when they download our mobile app so we can send them push notifications. If this token wasn't set for the user, they wouldn't receive push notifications from our notification workflows.

```javascript Set channel data for a user
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

// Get this value in your Knock dashboard
const APNS_CHANNEL_ID = "some-channel-id-from-knock";

await knockClient.users.setChannelData("jhammond", APNS_CHANNEL_ID, {
  // Tokens are always stored in a list, to represent a user having one or more devices
  tokens: [userDeviceToken],
});
```

### For objects

You can set channel data for a given object using the `objects.setChannelData` method. Please note that the channel data will always be overwritten with each `set` call.

In the example below, we're setting an object's Slack channel ID and access token, presumably after a user in our product has decided to connect the object to their Slack workspace. This enables us to send Slack notifications to the connected Slack channel when an event is triggered within the scope of the object.

```javascript Set channel data for an object
// Connect Slack data to an object we've added to Knock so that we can
// send notifications about this object to our customer's Slack channel
await knock.objects.setChannelData(
  "projects",
  project.id,
  process.env.KNOCK_SLACK_CHANNEL_ID,
  {
    connections: [
      {
        // The Slack channel id
        channel_id: slackConnection.channel_id,
        // The Slack access token
        access_token: slackConnection.access_token,
      },
    ],
  },
);
```

You can learn more about objects in our [concept guide](/send-and-manage-data/objects) and [API reference](/reference#objects).

## Getting channel data

To retrieve the currently set channel data you can use the `getChannelData` method on `users` and `objects`. Note: if
the channel data is not set for the user/object you'll receive a 404.

**User usage**

```javascript Get channel data for a user
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

// Get this value in your Knock dashboard
const APNS_CHANNEL_ID = "some-channel-id-from-knock";

const channelData = await knockClient.users.getChannelData(
  "jhammond",
  APNS_CHANNEL_ID,
);
```

**Object usage**

```javascript Get channel data for an object
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

// Get this value in your Knock dashboard
const APNS_CHANNEL_ID = "some-channel-id-from-knock";

const channelData = await knockClient.objects.getChannelData(
  "projects",
  project.id,
  APNS_CHANNEL_ID,
);
```

## Provider data requirements

### Push channels

Channel data requirements for each push provider are listed below. Typically this means setting
one or more `tokens` to uniquely identify a users device.

#### APNS (Apple Push Notification Service)

| Property | Type     | Description               |
| -------- | -------- | ------------------------- |
| tokens\* | string[] | One or more device tokens |

#### FCM (Firebase Cloud Messaging)

| Property | Type     | Description               |
| -------- | -------- | ------------------------- |
| tokens\* | string[] | One or more device tokens |

#### Expo

| Property | Type     | Description               |
| -------- | -------- | ------------------------- |
| tokens\* | string[] | One or more device tokens |

### Chat app channels

As of today, we only support Slack within our chat channel type. We have support for Discord and Microsoft Teams coming soon.

#### Slack

| Property    | Type              | Description                      |
| ----------- | ----------------- | -------------------------------- |
| connections | SlackConnection[] | One or more connections to Slack |

A `SlackConnection` has the following schema:

| Property             | Type   | Description                                                                 |
| -------------------- | ------ | --------------------------------------------------------------------------- |
| access_token         | string | A bot access token                                                          |
| channel_id           | string | A Slack channel ID                                                          |
| user_id              | string | A Slack user ID                                                             |
| incoming_webhook.url | string | The Slack incoming webhook URL (to be used instead of the properties above) |
