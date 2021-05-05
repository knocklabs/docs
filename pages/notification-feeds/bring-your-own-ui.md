---
title: Bring your own feed UI
---

If you're unable to leverage Knock's pre-built feed components, or you'd prefer to build your own feed components, you can use the Knock SDK or API to power your own bespoke feed.

**Note:** this guide is currently written for a JS based environment. If you'd like to use the feed
elsewhere please contact us and we'd be happy to support you.

## Fetching feed items

```js
import Knock from "@knocklabs/client";

const knockClient = new Knock(process.env.KNOCK_PUBLIC_API_KEY);

// Authenticate the current user in your app lifecycle
knockClient.authenticate(currentCustomer.knockApiToken);

// Setup the feed
const notificationFeed = knockClient.feeds.initialize(
  process.env.KNOCK_FEED_ID
);

// Fetch the first page of the feed
await notificationFeed.fetch({ cursor: null });

// See the contents of the notification feed
console.log(notificationFeed.items);
```

## Listening to real-time updates

```js
import Knock from "@knocklabs/client";

const knockClient = new Knock(process.env.KNOCK_PUBLIC_API_KEY);

// Authenticate the current user in your app lifecycle
knockClient.authenticate(currentCustomer.knockApiToken);

// Setup the feed
const notificationFeed = knockClient.feeds.initialize(
  process.env.KNOCK_FEED_ID
);

// Initialize the real-time handler
const teardown = notificationFeed.listenForUpdates();

// Listen for incoming events
notificationFeed.on("notifications.new", (notifications) => {
  console.log(notifications);
});

// Cleanup handler
teardown();
```

## Low-level usage

Optionally, you can work down to the lower-level feed APIs for when you need complete control.

```js
import Knock from "@knocklabs/client";

const knockClient = new Knock(process.env.KNOCK_PUBLIC_API_KEY);

// Authenticate the current user in your app lifecycle
knockClient.authenticateUser(currentCustomer.knockApiToken);

// Fetch feed items
const { data } = await knockClient.feeds.fetch(
  process.env.KNOCK_PUBLIC_API_KEY,
  {
    perPage: 50,
    after: null,
  }
);

// Listen for updates
const [socket, dispose] = knockClient.feeds.connectToSocket(
  process.env.KNOCK_PUBLIC_API_KEY
);

socket.on("notifications.new", (notification) => {
  console.log(notification);
});

dispose();
```
