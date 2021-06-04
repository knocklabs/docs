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

const data = await feedClient.fetch({
  // Fetch a particular status only (defaults to all)
  status: "all" | "unread" | "unseen",
  // Pagination options
  after: lastItem.__cursor,
  before: firstItem.__cursor,
  // Defaults to 50
  page_size: 10,
  // Filter by a specific source
  source: "workflow-key",
});
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
