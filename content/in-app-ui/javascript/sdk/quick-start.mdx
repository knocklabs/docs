---
title: "Getting started with the Javascript SDK"
description: Get started with our Javascript SDK to build notification feed, toasts, and inbox experiences.
section: SDKs
---

The `@knocklabs/client` library is a low-level JavaScript SDK for interacting with Knock from the client side of your JS application. In this guide we'll show some of the main ways you can interact with the SDK:

**Quick links**

- [`@knocklabs/client` on npm](https://www.npmjs.com/package/@knocklabs/client)
- [Package on GitHub](https://github.com/knocklabs/javascript/tree/main/packages/client)
- [Full reference guide](/sdks/javascript/reference)

## Getting started

To use this example, you'll need [an account on Knock](https://dashboard.knock.app), as well as an in-app feed channel, with a workflow that produces in-app feed messages. You'll also need:

- A public API key for the Knock environment (set as `KNOCK_PUBLIC_API_KEY`)
- The channel ID for the in-app feed (set as `KNOCK_FEED_CHANNEL_ID`)

## Installing dependencies

```bash title="Installing the package"
npm install @knocklabs/client
```

## Authenticating the current user

```javascript title="Authenticating the current user"
import Knock from "@knocklabs/client";

const knockClient = new Knock(process.env.KNOCK_PUBLIC_API_KEY);

// Tell Knock to use the users id
knockClient.authenticate(currentUser.id);
```

## Initialize a feed connection for the user

The `Knock` class exposes a `Feed` via the `initialize` method that can be used to connect the authenticated user to a Knock Feed Channel. Additionally, the `Feed` exposes a stateful store to build client-side feeds and other notification experiences.

```javascript title="Working with the Knock feed"
const knockFeed = knockClient.feeds.initialize(
  process.env.KNOCK_FEED_CHANNEL_ID,
);

// Setup a real-time connection
knockFeed.listenForUpdates();

// Fetch items for the feed
knockFeed.fetch();
```

## Marking feed item statuses

A feed instance supports marking items as seen, unseen, read, unread, archived, and unarchived:

```javascript title="Handling feed item statuses"
// Initialize the feed as in above examples
const knockFeed = knockClient.feeds.initialize(
  process.env.KNOCK_FEED_CHANNEL_ID,
);

// Mark one or more items as read
knockFeed.markAsRead(feedItemOrItems);
// Mark one or more items as seen
knockFeed.markAsSeen(feedItemOrItems);
// Mark one or more items as archived
knockFeed.markAsArchived(feedItemOrItems);

// Mark one or more items as unread
knockFeed.markAsUnread(feedItemOrItems);
// Mark one or more items as unseen
knockFeed.markAsUnseen(feedItemOrItems);
// Mark one or more items as unarchived
knockFeed.markAsUnarchived(feedItemOrItems);
```

## Retrieving preferences for the user

You can use the JS SDK to retrieve the preferences for the authenticated user, which is useful to build in-app preference UIs.

```javascript title="Getting user preferences"
const preferences = await knockClient.preferences.get();
```

## Setting preferences for the user

Similar to retrieving preferences, the `Knock` class also allows you to set preferences directly in the client for the authenticated user.

```javascript title="Setting user preferences"
await knockClient.preferences.set({
  channel_types: { email: true, sms: false },
  workflows: {
    "dinosaurs-loose": {
      channel_types: { email: false, in_app_feed: true },
    },
  },
});
```

## Automatically disconnecting sockets from inactive tabs

Optionally, you can configure the client to disconnect socket connections with inactive tabs after a brief delay. If the tab becomes active again, the socket will reconnect to continue receiving real-time updates.

```javascript title="Automatically manage socket connections"
// Initialize the feed and configure the automatic disconnect settings
const feedClient = knockClient.feeds.initialize(
  process.env.KNOCK_FEED_CHANNEL_ID,
  {
    // Turn on the automatic connection manager
    auto_manage_socket_connection: true,
    // Optionally, customize the delay amount in milliseconds. Defaults to 2000ms or 2s
    auto_manage_socket_connection_delay: 2500,
  },
);
```
