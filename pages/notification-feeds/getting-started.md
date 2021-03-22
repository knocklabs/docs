---
title: Getting started
---

This guide will show you how to get up-and-running with our in-app feed in your application.

## Integrating the feed

This guide assumes you have already setup your client application with authentication against
the Knock API. Please read [that guide](/client-integration/authentication) first if you haven't already.

### 1. Add the in-app feed as a channel

Within the Knock dashboard you will need to enable the in-app notification feed as a channel. Once
created, make note of the `channelId` for the channel as you'll need to set this.

In your client application it's best to set the feed id as an environment variable to be used
later.

```shell
export KNOCK_FEED_ID=channel_id_123
```

### 2. Setup your notification flows

In the Knock dashboard you will need to ensure that at least one notification is routing to your in-app
feed channel in order to continue with this guide. We typically suggest that the in-app channel is the first
channel that your notifications should be sent to, so go ahead and add that on one of your notifications.

Once you're done, save your flow and we can start testing. 💪

### 3. Integrating the in-app feed

The next step is to integrate the in-app feed into your product. In this guide we're going to be
using our React-based library to do that.

```shell
yarn add @knocklabs/react
```

### 4. Adding the components

Add the components to your application, ideally wherever you render your header in your layout file.

```jsx
import {
  FeedProvider,
  NotificationBadge,
  NotificationFeed,
} from "@knocklabs/react";

const YourAppLayout = () => (
  <Header>
    <FeedProvider feedId={process.env.KNOCK_FEED_ID}>
      <NotificationBadge>
        {({ onClose }) => (
          <NotificationFeed onNotificationClick={() => onClose()} />
        )}
      </NotificationBadge>
    </FeedProvider>
  </Header>
);
```

## Next steps

Once you have your feed up and running you might wish to read about some other topics before
pushing it to production:

- [Customizing the UI in your feed](/notification-feeds/customizing-ui)
- [Bringing your own UI](/notification-feeds/bring-your-own-ui)
- [Batching notifications](/sending-notifications/batching-and-throttling)
