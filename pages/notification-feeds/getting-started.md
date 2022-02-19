---
title: Getting started
---

This guide will show you how to get up-and-running with our [in-app feed component](https://github.com/knocklabs/react-notification-feed) in your application. 

## Integrating the feed

This guide assumes you have already setup your client application with authentication against
the Knock API. Please read [that guide](/client-integration/authenticating-users) first if you haven't already.

### 1. Add the in-app feed as a channel

Within the Knock dashboard you will need to enable the in-app notification feed as a channel. Once
created, make note of the `id` for the channel as you'll need to set this (as the `feedId`).

In your client application it's best to set the feed id as an environment variable to be used
later.

```shell
export KNOCK_FEED_ID=channel_id_123
```

### 2. Set up your workflows

In the Knock dashboard you will need to ensure that at least one workflow is routing to your in-app
feed channel in order to continue with this guide. We typically suggest that the in-app channel is the first
channel that your messages should be sent to, so go ahead and add that on one of your workflows.

Once you're done, save your workflow and we can start testing. 💪

### 3. Integrating the in-app feed

The next step is to integrate the in-app feed into your product. In this guide we're going to be
using our [React-based library](https://github.com/knocklabs/react-notification-feed) to do that.

```shell
yarn add @knocklabs/react-notification-feed
```

### 4. Adding the components

Add the components to your application, ideally wherever you render your header in your layout file.

```jsx
import {
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react-notification-feed";

// Required CSS import, unless you're overriding the styling
import "@knocklabs/react-notification-feed/dist/index.css";

const YourAppLayout = () => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);

  return (
    <KnockFeedProvider
      apiKey={process.env.KNOCK_PUBLIC_API_KEY}
      feedId={process.env.KNOCK_FEED_ID}
      userId={currentUser.id}
      // Optional in non production environments
      userToken={currentUser.knockUserToken}
      // Optionally you can scope the feed in a particular manner
      // tenant={currentWorkspace.id}
    >
      <NotificationIconButton
        ref={notifButtonRef}
        onClick={(e) => setIsVisible(!isVisible)}
      />
      <NotificationFeedPopover
        buttonRef={notifButtonRef}
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </KnockFeedProvider>
  );
};
```

## Next steps

Once you have your feed up and running you might wish to read about some other topics before
pushing it to production:

- [Customizing the UI in your feed](/notification-feeds/customizing-ui)
- [Bringing your own UI](/notification-feeds/bring-your-own-ui)
- [Batching notifications](/send-notifications/batching-and-throttling)
