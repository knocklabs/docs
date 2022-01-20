---
title: Users
---

A [User](/reference#users) represents a person who may need to be notified of some action occurring in your
product.

## The benefits of the Knock user model

If you're used to sending notifications via single-channel APIs, the idea of storing user data in a messaging platform such as Knock may sound odd to you.

Here are a few reasons why we store user data in Knock:

- **Multi-channel notifications.** When you're using a single-channel API, you can pass through the recipient's email address or phone number when you trigger a message. In a multi-channel platform like Knock, that would mean passing through _all_ of a user's channel information every time you trigger a notification. By keeping a user model in Knock, you can update a user's channel information once, then reference them via their user ID from that point on. We take care of the rest.
- **Stateful in-app notifications.** The Knock Feed API returns a stateful feed of the in-app notifications a given user has received from your product. The Knock user model is used to store a given user's notification feed and to give you a way to retrieve that feed via the user identifier you keep for them in your product.
- **Preferences model.** The Knock user model enables advanced functionality such as preferences support, where you store a given user's notification preferences in Knock and we reference that user's preferences during the run of a given notification workflow.
- **Leverage user traits in notification templates.** The Knock user model also enables you to store custom traits on a given user that you can reference in a notification template. This is helpful when you want to add conditional copy to a notification based on a user's role or plan.

We do not take storing your user data lightly. You can learn more about our security posture and best practices on [our security page](/security).

## Sending user data

If you've used a Customer Data Platform (CDP) like Segment before, sending data to Knock will be familiar to you.

```js Identify a user in Knock
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.users.identify(user.id, {
  name: user.name,
  email: user.email,
  avatar: user.avatar_url,
});
```

### The User identifier

The identifier for a user is important as it's the unique key that we will use to merge users and
determine recipients for a notification. Generally, the best practice here is to use your internal
identifier for your users as the `id`.

**Please note: you cannot change a user's id once it has been set, so we recommend you use an non-transient `id` like a primary key rather than a phone number or email address**.

### Required attributes

The following attributes are required for each user you identify with Knock.

| Property | Description                                                    |
| -------- | -------------------------------------------------------------- |
| id       | An identifier for this user from your system, should be unique |
| email    | The primary email address for this user                        |
| name     | The full name of this user                                     |

### Optional attributes

The following attributes are optional, depending on the channel types you decide to use with Knock.

| Property     | Description                                                                                                                                 |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| avatar       | A URL for the avatar of the user                                                                                                            |
| phone_number | The [E.164](https://www.twilio.com/docs/glossary/what-e164) phone number of the user. Knock needs this to send recipients SMS notifications |

### Storing user traits

In addition to the system attributes defined on the user schema above, Knock will keep track of any `properties` (key/value pairs) that you send to us. These _traits_ are always merged onto a user and returned to you.

Traits are useful for when you need to perform additional personalization on a user, like de-normalizing
the current plan they're on so you can use this to determine the portion of a notification they should receive.

You can nest the properties you send as deeply as you like, but please remember that
we will not deep merge these keys.

### The user object

Once sent to Knock, the user object returned to you in the Knock payload looks like this:

```json User object
{
  "id": "user_1234567890",
  "name": "Dummy User",
  "email": "dummy@example.com",
  "updated_at": "2021-03-07T12:00:00.000Z",
  "created_at": null,
  "__typename": "User"
}
```

| Property   | Description                                                        |
| ---------- | ------------------------------------------------------------------ |
| id         | The unique user identifier                                         |
| properties | Traits sent for the user are merged back onto the main user object |
| created_at | The created at time (provided by you)                              |
| updated_at | The last time we updated the user                                  |

## When to identify users in Knock

### Initial setup: bulk add users to Knock

When you're first getting started with Knock, you'll likely have a number of existing users that you want to migrate into Knock. The easiest way to do this is via our bulk endpoints, which allow 100 users at a time to be identified.

[API reference →](/reference/#bulk-identify-users)

```javascript Bulk add users
const { Knock } = require("@knocklabs/node");
const chunk = require("lodash.chunk");
const knock = new Knock(process.env.KNOCK_API_KEY);

const USERS_PER_CHUNK = 100;

Promise.all(
  chunk(users, USERS_PER_CHUNK).map(userBatch => {
    return knock.users.bulkIdentify(userBatch.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar_url,
    }))
  });
);
```

### Identifying users on an ongoing basis

Once you've migrated your current users into Knock, you'll want to continue to identify users in two main cases:

1. When new users sign up for your product.
2. When data about a user changes, like a name or an email address being updated.

```javascript Identify a user on sign up
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

app.post("/signup", async (req, res) => {
  const user = Users.signup_user(req.params);

  await knock.users.identify(user.id, {
    name: user.name,
    email: user.email,
    avatar: user.avatar_url,
  });

  res.json(user.serialize());
});
```

## Retrieving users

Users can be retrieved from Knock to see the current state of their properties using the `users.get` method.

```javascript Delete user
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

const user = await knock.users.get(user.id);
```

## Deleting users

Users can be deleted from Knock via the `users.delete` method. Deleting a user from Knock will have the following effect:

- The user will no longer be able to be a recipient or an actor in a workflow
- The user will no longer appear in the dashboard under the "Users" list
- Any in-app messages that reference the user will be replaced by a "missing user" marker

```javascript Delete user
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.users.delete(user.id);
```

## Merging users

You might run into the scenario where you've identified an invited user to send them a notification and then that user "graduates" to a fully fledged user after they sign up, leaving you with two users in Knock. That's where the merge users method comes in handy.

Merging two users will merge the `secondary` user (the invited user in our example) into the `primary` user (the signed up user), and the secondary user will be deleted in the process.

```javascript Merge users
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

// We want to merge the invited user onto the user, keeping only the user
await knock.users.merge(user.id, invitedUser.id);
```

**Please note that merging is a destructive operation and cannot be undone.**

### What's merged?

- **Properties**: Properties are deep merged, but if there are any conflicts between the secondary and primary user then the value is selected from the primary user.
- **Preferences**: Preference sets are shallow merged between the users. Any preference sets that don't exist on the primary from the secondary are added.
- **Channel data**: Channel data is shallow merged from the secondary to the primary. Any channel data that doesn't exist on the primary from the secondary is added, determined by the channel_id.
- **Message history**: The past 30 days of message history of the secondary user will now be owned by the primary recipient.
- **Activities**: Any activities from the past 30 days that the secondary user was an `actor` or `recipient` of will be transferred to the primary user.

If you need to retain more than 30 days worth of history, please contact us.
