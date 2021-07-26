---
title: Customizing the feed UI
---

While we provide a pre-built set of React components, you may wish to use your own styles
to better match your product's design system. In this guide we'll show you how to customize
Knock components.

**Note:** our feed components are currently only available for React.js. Read about bringing your own
UI or contact us if you want to discuss how to build components for other platforms.

## Adding an onclick handler

You can customize the click handler for the notification cell as follows:

```jsx
import { NotificationFeed } from "@knocklabs/react-notification-feed";

<NotificationFeed onNotificationClick={(item) => onClose()} />;
```

Both the `NotificationFeed` and the `NotificationFeedPopover` take a `onNotificationClick` prop.

## Rendering a different notification cell in the feed

You can customize the rendering of a notification cell in the feed by overriding the `renderItem` prop.

```jsx
import { NotificationFeed } from "@knocklabs/react-notification-feed";

const MyNotificationCell = ({ item, onItemClick }) => <Outer>...</Outer>;

<NotificationFeed renderItem={(props) => <MyNotificationCell {...props} />} />;
```

## Customizing the theme

There is currently no support for changing the theme within the component, but this feature will
be coming soon. In the meantime, should you wish to customize the feed UI we suggest using the
JS client SDK to build your own set of components.

<!-- You can optionally pass a different theme to the `KnockFeedProvider` to customize the styles
associated with the notification feed:

```jsx
import {
  KnockFeedProvider,
  NotificationFeedTheme,
  theme,
} from "@knocklabs/react-notification-feed";

const myCustomTheme = {
  ...theme,
  colors: {
    ...theme.colors,
    brand: {
      ...theme.colors.brand,
      500: "hotpink",
    },
  },
};

const YourAppLayout = () => (
  <Header>
    <KnockFeedProvider theme={myCustomTheme}>
      {
        // Ommitted for brevity
      }
    </KnockFeedProvider>
  </Header>
);
``` -->
