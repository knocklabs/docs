---
title: Getting started
---

This guide is designed to help get you setup with Knock inside of your application.

## Introduction

The Knock Notifications API enables you to introduce notifications into your application with ease, allowing you to build complex, customized notification workflows for your customers easily and without needing any code.

In this guide we'll take you from understanding the primitives in Knock, all the way through to sending your first notifications to your customers using the Knock.

## Integrate with your app

### 1. Add the Knock SDK to your backend

We have SDKs available in NodeJS, Ruby, and Python. Don't see your language listed here? Let us know!

```bash
npm install @knocklabs/node
```

### 2. Setup environment variables

In the Knock dashboard you can find your API key under the 'Developers' section. We suggest setting it as an environment variable in your application and to avoid checking secrets into source control.

```bash
KNOCK_API_KEY='sk_example_123456789'
```

### 3. Tell Knock about your users

Knock needs to know some minimal information about your users so that we can send notifications to them. At a minimum we need the users name, email address and a unique id to identify them by.

We suggest letting Knock know whenever a new user is created, and when any of their properties change too (you'll need to keep Knock in sync):

```javascript
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

app.post("/signup", async (req, res) => {
  const user = Users.signup_user(req.params);

  await knock.identify(user.id, {
    name: user.name,
    email: user.email,
    avatar: user.avatar_url,
  });

  res.json(user.serialize());
});
```

_Note: if you have existing users in your application, you can either bulk send over users in a migration or deliver users just-in-time. See here for more details on migrating an existing system._

### 4. Notify Knock of the events happening

All notifications in Knock are driven (for now) by triggers that occur in your product. As such, we need to know about the events that are caused by user actions so that we can use those to trigger notifications.

You should note a few important things here:

1. The `user_id` is the user who _performed_ the action (where relevant).
2. The payload that we send to Knock is important. We'll user these properties in our notification templates.
3. The recipients are a list of user ids who may _potentially_ need to receive a notification from this event.

```javascript
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

// In our hypothetical document collaboration app
// we want to let Knock know about comments being created
// which we send after the comment has been saved in a database
knock.track({
  event: "New Comment",
  user_id: user.id,
  properties: {
    document_id: comment.document.id,
    document_name: comment.document.name,
    comment_id: comment.id,
    comment_text: comment.text,
  },
  recipients: document.followers.map((f) => f.user_id),
});
```

## Create your notification flows

You can use the Knock dashboard in order to setup a new notification that's triggered from the events you're sending to Knock. Your notifications can be in-app (in a notification feed), or sent via email. We'll be adding more channel support soon.

The Knock dashboard gives you the power to create advanced notification flows and logic to handle batching/collapsing of these notifications, as well as more complex orchestration logic for delays and cross-channel delivery.
