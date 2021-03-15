---
title: Lists
---

A list is a collection of users who are logically grouped together. Lists are useful abstractions
for when you need to notify multiple recipients in a single batch.

## Where to use lists

Lists are a useful abstraction to reduce the coupling from event calls to recipients. They also stop
you needing to enumerate user recipients in your event calls, which is useful when dealing with unbounded
numbers of potential recipients.

**Although implementing lists comes with some additional book keeping from your system to Knock, lists
are the preferred way to manage multiple recipients for notifications.**

## Targeting lists

List targeting conditions can be selected when creating notifications in the notification flow
builder.

You can use the properties in the event payload in order to target a particular recipient list, which
means that you can target lists like `project.{{ properties.project_id }}.followers` where `properties.project_id`
is coming from the event payload and dynamically selecting the list.

Examples of complex list targeting:

- **All followers and team admins**: members of `project.project_123.followers` and members of `team.team_123.members`
- **All followers who are admins**: member of `project.project_123.followers` where `member.properties.role = 'admin'`
- **All followers who are not workspace admins**: members of `project.project_123.followers` and not a member of `workspace.workspace_123.admins`

## Creating lists

A list is uniquely identified via its name and can have an unbounded number of users attached to
it. The name of the list can be any string identifier, however we suggest using a naming format like
`project.project_123.followers`.

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

// Sending only user ids
await knock.lists.create({
  name: `project.${project.id}.followers`,
  users: project.followers.map((follower) => folower.user_id),
});

// Sending membership objects
await knock.lists.create({
  name: `project.${project.id}.followers`,
  users: project.followers.map((follower) => ({
    user_id: folower.user.id,
    properties: { role: follower.role },
  })),
});
```

### Properties

| Property   | Description                                            |
| ---------- | ------------------------------------------------------ |
| name       | A unique name for this list                            |
| users      | A list of user_ids or list membership objects to store |
| properties | Any additional metadata to store on this list          |

## List members

List members are objects that represent a single users membership on a list. They can also contain
unstructured metadata that you can use to further target recipients of notifications.

```json
{
  "user_id": "user_123",
  "properties": {
    "role": "admin"
  },
  "inserted_at": "2021-03-05T12:00:00.000Z",
  "updated_at": "2021-03-05T12:00:00.000Z"
}
```

## Addings users to a list

Users can be added to a list at any time. If the user is already present on the list, only the metadata
for the user will be merged (if provided).

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

// Users can be added in batches of 100 at a time
await knock.lists.addUsers(`project.${project.id}.followers`, [user.id]);

// Or alternatively adding as a membership object
await knock.lists.addUsers(`project.${project.id}.followers`, [
  { user_id: user.id, properties: { role: follower.role } },
]);
```

## Removing users from a list

When users are no longer required to be part of a list (e.g. they unfollowed a project) they
can be removed using the SDK:

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

// Users can be removed in batches of 100 at a time
await knock.lists.removeUsers(`project.${project.id}.followers`, [user.id]);
```

## Retrieving a list

You can get a list as well as a paginated set of its members (in ascending order).

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

const { pageInfo, list } = await knock.lists.get(
  `project.${project.id}.followers`
);
```

## Deleting a list

If a list is no longer needed, the entire list can be deleted and will subsequently not be
available for use:

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

// Users can be removed in batches of 100 at a time
await knock.lists.remove(`project.${project.id}.followers`);
```
