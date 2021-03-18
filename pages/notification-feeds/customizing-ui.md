---
title: Customizing the feed UI
---

While we give a prebuilt set of React components, you may wish to provide a custom set of styles
to better match your products design system. In this guide we'll show you how to customize the
Knock components.

**Note: our feed components are currently only available for React.js. Read about bringing your own
UI or contact us if you want to discuss how to build components for other platforms.**

## Rendering a different notification cell in the feed

You can customize the rendering of a notification cell in the feed by overriding the `renderItem` prop.

```jsx
import {
  FeedProvider,
  NotificationBadge,
  NotificationFeed,
} from "@knocklabs/react";

const MyNotificationCell = ({ notification, onClick }) => <Outer>...</Outer>;

<NotificationFeed
  renderItem={(props) => <MyNotificationCell {...props} />}
  onNotificationClick={() => onClose()}
/>;
```

## Customizing the `NotificationFeed` styles

You can optionally pass a styles override to the feed components in order to adjust the styles of the
feed itself, and for the notification cell.

```jsx
import {
  FeedProvider,
  NotificationBadge,
  NotificationFeed,
} from "@knocklabs/react";

const styles = {
  base: {
    // base styles
    fontFamily: "Comic Sans",
  },
  container: {
    // style the outer container
  },
  cell: {
    // style the individual notification cell
  },
  cellAvatar: {
    // style the avatar
  },
  cellContent: {
    // style the cell container
  },
};

const YourAppLayout = () => (
  <Header>
    <FeedProvider feedId={process.env.KNOCK_FEED_ID}>
      <NotificationBadge>
        {({ onClose }) => (
          <NotificationFeed
            styles={styles}
            onNotificationClick={() => onClose()}
          />
        )}
      </NotificationBadge>
    </FeedProvider>
  </Header>
);
```

## Customizing the `NotificationBadge`
