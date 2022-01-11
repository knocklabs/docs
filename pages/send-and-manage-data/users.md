---
title: Users
---

A User represents a person who may need to be notified of some action occurring in your
product.

## Sending user data

If you've used a Customer Data Platform (CDP) like Segment before, sending data to Knock will be familiar to you.

```js
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

## The user object

Once sent to Knock, the user object returned to you in the Knock payload looks like this:

```json
{
  "id": "user_1234567890",
  "name": "Dummy User",
  "email": "dummy@example.com"
  "updated_at": "2021-03-07T12:00:00.000Z"
}
```

| Property   | Description                                                        |
| ---------- | ------------------------------------------------------------------ |
| id         | The unique user identifier                                         |
| properties | Traits sent for the user are merged back onto the main user object |
| updated_at | The last time in which we updated the user                         |

## Bulk sending user data

You can bulk send user objects, which is useful for when you're onboarding an existing set of data into Knock using the `users.bulkIdentify` method. We accept up to 100 users at a time.

```js
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
