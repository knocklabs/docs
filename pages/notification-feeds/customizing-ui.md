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

## Adding inline actions

For more advanced use cases, you may need to provide inline actions on your notifications. The `NotificationCell` component accepts a `children` prop in order for you to render actions, which you can pass a custom `renderItem` to `NotificationFeed` or `NotificationFeedPopover` to render.

### Using action buttons

The feed comes with `Button` and `ButtonGroup` components, which have a complimentary set of styling for the rest of the feed. You can render the buttons in a button group so that they'll be grouped together, or can render them individually:

```jsx
import {
  ButtonGroup,
  Button,
  NotificationFeed,
  NotificationCell,
} from "@knocklabs/react-notification-feed";

<NotificationFeed
  renderItem={({ item, ...props }) => (
    <NotificationCell {...props} item={item}>
      <ButtonGroup>
        <Button variant="primary" onClick={myAcceptHandler}>
          Accept
        </Button>
        <Button variant="secondary" onClick={myRejectHandler}>
          Reject
        </Button>
      </ButtonGroup>
    </NotificationCell>
  )}
/>;
```

**Note: remember to call `event.stopPropagation` in your `onClick` handler to stop the notification `onClick` handler from being invoked**.

### Targeting a specific workflow to have buttons

A common use case is to only show action buttons for certain workflows. You can achieve this via the `item.source` property, which exposes a `WorkflowSource`.

```jsx
import {
  ButtonGroup,
  Button,
  NotificationFeed,
  NotificationCell,
} from "@knocklabs/react-notification-feed";

<NotificationFeed
  renderItem={({ item, ...props }) => (
    <NotificationCell {...props} item={item}>
      {item.source.key === "approval-workflow" && (
        <ButtonGroup>
          <Button variant="primary">Accept</Button>
          <Button variant="secondary">Reject</Button>
        </ButtonGroup>
      )}
    </NotificationCell>
  )}
/>;
```

### Button Props

The `Button` exposes the following props.

| Prop        | Description                                                                        |
| ----------- | ---------------------------------------------------------------------------------- |
| variant     | `primary` or `secondary` (defaults to `primary`)                                   |
| onClick     | An event handler to be invoked on click                                            |
| loadingText | Text to display when isLoading is true                                             |
| isLoading   | When true, will show a spinner (defaults to `false`)                               |
| isDisabled  | When true, will disable the button (defaults to `false`)                           |
| isFullWidth | When true, make the button occupy the width of the container (defaults to `false`) |

### Adding other inline actions

If you have a more advanced usecase, you can render whatever inline component you wish using the same technique as above.

```jsx
import {
  NotificationFeed,
  NotificationCell,
} from "@knocklabs/react-notification-feed";

<NotificationFeed
  renderItem={({ item, ...props }) => (
    <NotificationCell {...props} item={item}>
      {item.source.key === "new-comment" && (
        <InlineCommentingWidget item={item} />
      )}
    </NotificationCell>
  )}
/>;
```

## Customizing the theme

The complete theme that controls the look and feel of the feed components can be customized for theme in a few different ways:

1. **Customizing the CSS variables**. The feed is written using CSS variables, which you can override to better match the look and feel of your product. The best way to see the possible CSS variables in use is to look at the [theme.css source code](https://github.com/knocklabs/react-notification-feed/blob/main/src/theme.css).

2. **Bringing your own CSS**. It's possible to override the Knock CSS entirely to customize the look and feel of the feed. All of the feed classes are unique and start with `rnf-`. You can see the classes in use by looking at the [source code of the components](https://github.com/knocklabs/react-notification-feed/blob/main/src/).
