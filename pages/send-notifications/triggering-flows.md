---
title: Triggering flows
---

Notifications flows that you design within Knock are triggered from within your codebase by calling the notify API and telling Knock _who_ should be a potential recipient.

It's important to realize that calling notify in Knock may yield no notifications to be sent. This
is because calling `notify` will trigger a notification workflow to be executed, but your end users
may have indicated through their `preferences` that they don't wish to receive notifications of that type. The good news is that Knock handles all preference-based opt-outs for you automatically. 

## Triggering notification flows

Notification flows are triggered via a call to the `notify` endpoint, which tells Knock to send a specified `Notification` to the specificed `recipients` passed into the call.

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.notify("new-user-invited", {
  // The user who performed the action
  actor: "user_3",
  // The list of recipients
  recipients: ["user_1", "user_2"],
  // Data to be passed to the template
  data: {
    invitee_name: "Jane Doe",
    invitee_email: "jane.doe@example.com",
    invitee_role: "member",
  },
});
```

### Schema

| Property       | Type     | Description                                                                      |
| -------------- | -------- | -------------------------------------------------------------------------------- |
| actor          | string   | The user id of the user who performed the action (when relevant)                 |
| name\*         | string   | The human readable name of the notification flow                                 |
| data\*         | map      | A map of properties that are required in the templates in this notification flow |
| recipients     | string[] | A list of user ids for users that are associated with this notification flow     |
| lists          | string[] | A list of names for the lists that should receive this notification flow         |
| idempotencyKey | string   | A key to be used to ensure that this request is idempotent                       |

## Defining recipients

You can define the recipients of your notification workflow by either (i) specifying an array of of users
or (ii) by specifying an array of one or more `lists`. If you fail to provide either of these with your
notify call your message will be rejected and an error will be returned.

### Sending to users

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.notify("welcome-to-knock", {
  recipients: [user.id],
  data: {},
});
```

### Sending to lists

```js
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.notify("new-comment", {
  actor: comment.user_id,
  lists: [`project.${project.id}.followers`, `team.${project.team_id}.members`],
  data: {
    comment_id: comment.id,
    project_id: project.id,
    comment_text: comment.text,
    project_name: project.name,
  },
});
```

### Advanced list targeting

If you have more advanced list targeting needs please contact support@knock.app as we're currently
thinking through this API design.

## Passing data

You can also pass the schema data required by the notification workflow into the `notify` call. The
payload must be a valid JSON object, with nested objects and lists supported.

The data requirements for the payload are determined in the notification flow builder, including
indicating which keys are required. In the case where you try and trigger a notification workflow
without a required key, the notify call will fail (this behavior is configurable as it may not be the desired behavior in your
production environment).

## Preventing duplicates

No one likes duplicate notifications. 

To guard against sending duplicates you can implement idempotency into your notify calls such that subsequent
calls with the same `idempotencyKey` will fail if any of the previous calls have succeeded. We
recommend using an idempotency key with enough entropy, like a uuid v4.

We'll keep idempotency keys in our system for at least 7 days before they are purged.

```js
const Knock = require("@knocklabs/node");
const uuid = require("uuid4");
const knock = new Knock(process.env.KNOCK_API_KEY);

const idempotencyKey = uuid();

await knock.notify("new-user-invited", {
  actor: "user_3",
  recipients: ["user_1", "user_2"],
  data: {
    invitee_name: "Jane Doe",
    invitee_email: "jane.doe@example.com",
    invitee_role: "member",
  },
  idempotencyKey,
});
```
