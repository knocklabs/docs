---
title: Users
---

A user in Knock represents a person who may need to be notified of some action occurring in your
product.

## Sending user data

If you've used a CDP like Segment before, sending data to Knock will be familiar to you.

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.identify(user.id, {
  name: user.name,
  email: user.email,
  avatar: user.avatar_url,
});
```

### The user identifier

The identifier for a user is important as it's the unique key that we will use to merge users and
determine recipients for a notification. Generally, the best practice here is to use your internal
identifier for your users as the `id`.

### Required attributes

| Property   | Description                                                    |
| ---------- | -------------------------------------------------------------- |
| id         | An identifier for this user from your system, should be unique |
| email      | The primary email address for this user                        |
| name       | The full name of this user                                     |
| first_name | Required if `name` is not given                                |
| last_name  | Required if `name` is not given                                |

### Storing user traits

Knock will keep track of any `properties` (key/value pairs) that you send to us as _traits_
that are always merged onto a user and returned to you.

Traits are useful for when you need to perform additional personalization on a user, like denormalizing
the current plan they're on so you can use this to determine the portion of a notification they should receive.

You can nest the properties you send as deeply as you like, but please remember that
we will not deep merge these keys.

## The user object

Once sent to Knock, the user object returned to you in the Knock payload looks like this:

```json
{
  "id": "user_1234567890",
  "properties": {
    "name": "Dummy User",
    "email": "dummy@example.com"
  },
  "preferences": {
    ...preferences
  },
  "updated_at": "2021-03-07T12:00:00.000Z"
}
```

| Property    | Description                                     |
| ----------- | ----------------------------------------------- |
| id          | The unique user identifier                      |
| properties  | A map containing the traits sent for this user  |
| preferences | The preference object associated with this user |
| updated_at  | The last time in which we updated the user      |

## Batch sending user data

You can batch send user objects, which is useful for when you're onboarding onto Knock.

```js
const Knock = require("@knocklabs/node");
const chunk = require("lodash.chunk");
const knock = new Knock(process.env.KNOCK_API_KEY);

const USERS_PER_CHUNK = 100;

Promise.all(
  chunk(users, USERS_PER_CHUNK).map(userBatch => {
    return knock.users.batch(userBatch.map(user => ({
      id: user.id,
      properties: {
        name: user.name,
        email: user.email,
        avatar: user.avatar_url,
      },
    }))
  });
);
```
