---
title: Events
---

Events are the triggers that generate notifications for your users. Events represent actions
that have occurred in your product that may need to generate a notification for your users.

## Sending events

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

knock.track({
  event: "New Comment",
  user_id: user.id,
  properties: {
    document_id: comment.document.id,
    document_name: comment.document.name,
    comment_id: comment.id,
    comment_text: comment.text,
  },
});
```

### Schema

| Property        | Type      | Description                                                                              |
| --------------- | --------- | ---------------------------------------------------------------------------------------- |
| event\*         | string    | The human readable name of the event                                                     |
| user_id\*       | string    | The id of the user who performed the event                                               |
| properties\*    | map       | A map of properties to be persisted with this event                                      |
| recipients      | string[]  | A list of user_ids for users that are associated with this event (optional)              |
| recipient_lists | string[]  | A list of names for the lists that should receive this notification (optional)           |
| timestamp       | timestamp | An optional timestamp representing the time in which the event occurred. Defaults to now |

## Event properties

Event properties

## Event schemas

When you start sending events to Knock we'll dynamically build a schema for the event that we'll
use within the dasboard and elsewhere. You can inspect the schema we created for the event in
the developers section of the dashboard, including seeing which properties are used in your
notification flows.

## Recipients

## De-duplicating events

In a notification system it's critical that we don't send multiple notifications for a single event.

## Best practices

### Adding and removing properties

If you have existing notifications being driven by events, we'd recommend taking an additive approach
to changing fields. For instance, it's better to add a new field than to change the behavior of an
existing one.

It's easy to then go back and remove a field being sent at a later point using our schema debugger
to see when fields are no longer used in each environment.

### Migrating properties

Currently it is not possible to migrate existing properties. If this is a use-case you have, please
contact us and we can discuss other approaches.

### Working in multi-tenant environments

When you're dealing with multi-tenant environments where your users can belong to multiple "workspaces"
or "accounts" it's best to always send over an identifier on the event that indicates the ancestor it
belongs to. This then allows you to easily have preferences that map to each workspace, and have
a user, workspace pair as a key for a preference.

### Backfilling old events

We're able to backfill old events from other systems or providers if needed. We ask that you speak
to us before ingesting extremely large amounts of data so that we can up your accounts rate limit.
