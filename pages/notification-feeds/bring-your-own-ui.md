---
title: Bring your own feed UI
---

If you're unable to leverage the pre-built feed components, or you'd rather provide a totally
custom experience, you can use the Knock SDK or API to build a completely bespoke feed.

Note: this guide is currently written for a JS based environment. If you'd like to use the feed
elsewhere please contact us and we'd be happy to support you.

## Fetching feed items

```js
import Knock from "@knocklabs/web";

const knockClient = new Knock(process.env.KNOCK_PUBLIC_API_KEY);

// Authenticate the current user in your app lifecycle
knockClient.authenticateUser(currentCustomer.knockApiToken);

// Fetch the data
const [{ data, loading, fetchMore }] = knockClient.useFeedQuery(
  process.env.KNOCK_FEED_ID
);
```

## Listening to real-time updates

```js
import Knock from "@knocklabs/web";

const knockClient = new Knock(process.env.KNOCK_PUBLIC_API_KEY);

const [{ events }, teardown] = knockClient.useFeedQuery(
  process.env.KNOCK_FEED_ID
);

events.on("notifications.new", (notifications) => {
  console.log(notifications);
  rerender();
});

// Cleanup feed handler
teardown();
```
