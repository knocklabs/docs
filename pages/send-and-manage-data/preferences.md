---
title: Modeling preferences
---

A preference determines whether or not a user should receive a particular notification
(or groups of notifications) on a particular channel. Knock manages the preferences associated
with your notifications and stores the state for each user, removing a common part of your
notifications stack.

**Please note: preferences are an active WIP area of our product. This section will be updated as
soon as we have more to share**.

<!-- ## Updating a user preferences

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.users.updatePreferences(user.id, {});
```

## Common preference settings

## Configuring default preferences

## Multi-tenant preferences

In a multi-tenant environment your users might need to have _different preference settings per
tenant_ they are associated with. As a result your preferences would now be a key of
`(user_id, tenant_id)` -- the good news is Knock is designed with this use-case in mind! -->
