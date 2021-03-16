---
title: Getting started
---

This guide is designed to help get you setup with Knock inside of your application and start
sending notifications.

## Introduction

The Knock Notifications API enables you to introduce notifications into your application with ease, allowing you to build complex, customized notification workflows for your customers easily.

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

We suggest letting Knock know whenever a new user is created, and when any of their properties change too (you'll need to keep Knock in-sync):

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

### 4. Create your notification flows

You can use the Knock dashboard in order to setup new notification flows, which determine the routing logic for the notification as well as the design of the messages themselves.

The Knock dashboard gives you the power to create advanced notification flows and logic to handle
batching/collapsing of these notifications, as well as more complex orchestration logic for delays
and cross-channel delivery.

### 5. Trigger your notifications

Whenever you want to trigger a notification flow for a set of users, you simple call the `notify` function to trigger the flow for the recipients you define, and pass through the data required when
the notification was designed.

```javascript
const Knock = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

// In our hypothetical document collaboration app
// we want to let Knock know about comments being created
// which we send after the comment has been saved in a database
await knock.notify("new-comment", {
  data: {
    document_id: comment.document.id,
    document_name: comment.document.name,
    comment_id: comment.id,
    comment_text: comment.text,
  },
  recipients: document.followers.map((f) => f.user_id),
});
```

## Go deeper

This was a very simple overview to start using Knock to send your notifications. Keep reading to see how Knock can drive your notification needs, no matter how complex they might be.

- [Sending & managing data concepts](/send-and-manage-data/concepts)
- [Notification feeds](/notification-feeds/overview)
- [Managing users with lists](/send-and-manage-data/lists)

<br />
