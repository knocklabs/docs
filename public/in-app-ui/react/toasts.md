---
title: "Building notification toasts with React"
description: How to build notification toasts powered by Knock and React.
section: Building in-app UI
---

While there are no out-of-the-box toast components in the `@knocklabs/react` library, it's easy to build toasts on top of the primitives exposed. In this guide, we'll show you just how to do that using the `react-hot-toasts` library as our "toaster."

[See a live demo](https://in-app-demo.knock.app/)

## Getting started

To use this example, you'll need [an account on Knock](https://dashboard.knock.app), as well as an in-app feed channel with a workflow that produces in-app feed messages. You'll also need:

- A public API key for the Knock environment (set as `KNOCK_PUBLIC_API_KEY`)
- The channel ID for the in-app feed (set as `KNOCK_FEED_CHANNEL_ID`)

<Callout
  emoji="🌠"
  text={
    <>
      <span className="font-bold">Find your channel ID.</span> To find the
      channel ID for your in-app channel(s), go to{" "}
      <span className="font-bold">Integrations</span> {">"}{" "}
      <span className="font-bold">Channels</span> in the Knock dashboard,
      navigate to the channel page of your in-app channel, and copy the channel
      ID.
    </>
  }
/>

## Installing dependencies

```bash title="Installing dependencies"
npm install @knocklabs/react react-hot-toast
```

## Adding the Knock providers

We'll need to wrap our toast producing component in a `KnockProvider` and `KnockFeedProvider` to set up a connection to Knock and connect to the authenticated user's feed. You can read more about the available props for the providers in [the reference](/sdks/react/reference#knockprovider).

```jsx
import { KnockProvider, KnockFeedProvider } from "@knocklabs/react";

// We'll write this next
import NotificationToaster from "./NotificationToaster";

const NotificationToastProducer = () => {
  // An example of fetching the current authenticated user
  const { user } = useCurrentUser();

  return (
    <KnockProvider apiKey={process.env.KNOCK_PUBLIC_API_KEY} userId={user.id}>
      <KnockFeedProvider feedId={process.env.KNOCK_FEED_CHANNEL_ID}>
        <NotificationToaster />
      </KnockFeedProvider>
    </KnockProvider>
  );
};
```

## Rendering toasts when new notifications come in

Our `KnockFeedProvider` exposes a `useKnockFeed` hook, which will return a `feedClient` we can use to bind to and receive real-time notifications being received on our feed.

```jsx
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useKnockFeed } from "@knocklabs/react";

const NotificationToaster = () => {
  const { feedClient } = useKnockFeed();

  const onNotificationsReceived = ({ items }) => {
    // Whenever we receive a new notification from our real-time stream, show a toast
    // (note here that we can receive > 1 items in a batch)
    items.forEach((notification) => {
      //Use toast.custom to render the HTML content of the notification
      toast.custom(
        <div
          dangerouslySetInnerHTML={{ __html: notification.blocks[0].rendered }}
        ></div>,
        { id: notification.id },
      );
    });

    // Optionally, you may want to mark them as "seen" as well
    feedClient.markAsSeen(items);
  };

  useEffect(() => {
    // Receive all real-time notifications on our feed
    feedClient.on("items.received.realtime", onNotificationsReceived);

    // Cleanup
    return () =>
      feedClient.off("items.received.realtime", onNotificationsReceived);
  }, [feedClient]);

  return <Toaster />;
};

export default NotificationToaster;
```

## Wrapping up

We can then test our workflow using the built-in test runner in Knock to produce messages, which will be received and displayed as a toast in your application.
