---
title: Customizing the feed
---

While we provide a pre-built set of React components, you may wish to use your own styles
to better match your product's design system. In this guide we'll show you how to customize
Knock components.

**Note:** our feed components are currently only available for React.js. Read about bringing your own
UI or contact us if you want to discuss how to build components for other platforms.

## Adding an onclick handler to the notification cell

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

## Overriding the avatar

You can customize the `Avatar` component rendered within the `NotificationCell` by passing a different `avatar` component into the `NotificationCell` in the `renderItem` function passed to the feed:

```jsx
import {
  NotificationFeed,
  NotificationCell,
  Avatar,
} from "@knocklabs/react-notification-feed";

<NotificationFeed
  renderItem={({ item, ...props }) => (
    <NotificationCell
      {...props}
      item={item}
      // You can use any properties available on the `actor` for the name and avatar
      avatar={<Avatar name={item.actors[0].name} src={item.actors[0].avatar} />}
    />
  )}
/>;
```

## Using dark mode

The feed supports an optional `colorMode` prop, that defaults to `light` but can be set as `dark` for dark mode support:

```jsx
import { NotificationFeed } from "@knocklabs/react-notification-feed";

<NotificationFeed colorMode="dark" />;
```

## Customizing the theme

The complete theme that controls the look and feel of the feed components can be customized for theme in a few different ways:

1. **Customizing the CSS variables**. The feed is written using CSS variables, which you can override to better match the look and feel of your product. The best way to see the possible CSS variables in use is to look at the [theme.css source code](https://github.com/knocklabs/react-notification-feed/blob/main/src/theme.css).

2. **Bringing your own CSS**. It's possible to override the Knock CSS entirely to customize the look and feel of the feed. All of the feed classes are unique and start with `rnf-`. You can see the classes in use by looking at the [source code of the components](https://github.com/knocklabs/react-notification-feed/blob/main/src/).
