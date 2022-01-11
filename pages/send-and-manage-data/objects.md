---
title: Objects
---

An [Object](/reference#objects) represents a resource in your system that you want to map into Knock. 

In this guide we'll walk through how to use objects for a few different use cases in Knock. 

We'll start with an overview of objects and how to use them, then we'll walk through two common use cases for objects: Slack channel notifications and handling mutable data on long-running notifications (such as digests.)

**Note:** Objects are an advanced feature within Knock. You can send multi-channel notifications across all channel types (except Slack) without touching the Objects API. If you're just getting started, we'd recommend coming back to objects when you've already started to leverage a few channels using Knock. 

## An overview of objects

Objects are a powerful and flexible way to ensure Knock always has the most up-to-date information required to send your notifications. They also enable you to send notifications to non-user recipients.

You can use objects to:
- send out-of-app notifications to non-user recipients (such as a Slack channels)
- send in-app notifications to non-user resources in your product (the activity feed you see on a Notion page is a good example)
- reference mutable data in your notification templates (such as when a user edits a comment before a notification is sent)

**Note:** As of today, our objects API support for in-app notifications and mutable data referencing is in beta. If you're interested in using this functionality, please reach out and let us know via the feedback button at the top of this page. 

<!-- 
<div style="display: flex; width: 100%; border-radius: 3px; border-width: 1px; border-style: solid; border-color: transparent; background: rgba(235, 236, 237, 0.3); padding: 16px 16px 16px 12px; margin-bottom: 24px;">
  <div>
    <div style="display: flex; align-items: center; justify-content: center; height: 24px; width: 24px; border-radius: 3px; flex-shrink: 0;">
      <div>
        <div style="width: 100%; height: 100%;">
          <img src="/assets/emoji/jedi.gif" style="margin-bottom:0px">
        </div>
      </div>
    </div>
  </div>
  <div style="display: flex; flex-direction: column; min-width: 0px; margin-left: 8px; width: 100%;">
    <p style="margin-bottom: 0px;"><b>Before reading further.</b> Knock objects are advanced functionality. You can send multi-channel notifications across all channel types (except Slack) without touching the Objects API. If you're just looking to stand up email and in-app notifications, we'd recommend coming back to objects when you've started sending across a few channels.</p>
  </div>
</div> -->

## The Knock objects API
All objects belong to `collections`, which group objects of the same type together. An object should be unique within a collection, identified by the `id` given. We use the `{collection, id}` pair to know when to create or update an object.

Objects follow the same rules as all other items in Knock in that they are unique and logically separated per Knock environment.

```javascript Set an object in Knock
import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.KNOCK_API_KEY);

knockClient.objects.set({
	id: "my-id",
	collection: "projects",
	properties: {
		// Associated attributes
	}
});
```

Here are a few guidelines when setting objects in Knock:
- The `collection` should always be a plural form of a *type* of object within your system. 
- The `id` should be a unique string identifier within the collection.
- `properties` accepts a dictionary of key-value pairs that can be referenced in your templates. Properties will always be shallowly merged between set calls, meaning that existing properties will be overwritten.


## Examples

### Slack channel notifications

A common notification use case we see in SaaS applications is the ability for users to connect a object in the product they're using to a channel in their own Slack workspace. That way when something happens in that object (e.g. a comment is left,) they receive a notification about it in their connected Slack channel. 

Let's take a fictional example here where we have an audio collaboration service that allows its customers to connect a Project object to a Slack channel. Once the Project and Slack channel are connected, all Comments left within the Project will result in notifications sent to the customer's Slack channel.

Here's how we'd use Knock objects to solve this.

1. **Register our Project object to Knock**

Typically whenever the project is created or updated we'll want to send it through to Knock.

```javascript Send object to Knock
await knock.objects.set({
	id: project.id,
	collection: "projects",
	properties: {
		name: project.name,
	}
});
```

2. **Store the Slack connection information for the Project**

Once our customer chooses to connect their Slack channel to the Project, we have a callback that then adds the Slack information as Channel Data.

```javascript Store Slack connection on object
// Connect Slack data to our Project object in Knock so that we can
// send notifications about this project to our customer's Slack channel
await knock.objects.setChannelData(
	{ id: project.id, collection: "projects" },
	process.env.KNOCK_SLACK_CHANNEL_ID,
	{ 
		connections: [{
			// The Slack channel id
			channel_id: slackConnection.channel_id,
			// The Slack access token
			access_token: slackConnection.access_token
		}]
	},  
);
```

3. **Add Slack as a step to our workflow**

Inside of the Knock dashboard, we're going to add a new Slack step to our `new-comment` workflow that will send a notification displaying the comment that was left in our product. 


4. **Send the Project as a recipient in your workflow trigger**

Now when we trigger our `new-comment` workflow, we also want to add our Project object as a recipient so that the newly added Slack step will be triggered.

```javascript Workflow trigger with an object
await knock.workflows.trigger("new-comment", {
	actor: comment.authorId,
	recipients: [
		...projectUserIds,
		{ id: project.id, collection: "projects" },
	],
	data: { comment },
});
```

Knock then executes the workflow for this Project object as it would for any user recipients sent in the workflow trigger, skipping over any steps that aren't relevant. (In this case, the Project object only has one piece of channel data mapped to it—the Slack channel—so it won't trigger notifications for any other channel steps in our `new-comment` workflow.) When the Slack step is reached, the connection information we stored earlier will be used as a means to know which channel to send a message to and how to authenticate to that channel.


<!-- ### Handle mutable data on long-lived notifications
When you're utilizing more advanced notification techniques such as long-term batching and digesting, it's common to encounter data growing stale within notifications.

For instance, in an audio collaboration product where we send daily email digests of the comments left for a given user, the comment content could either a) change or b) be deleted entirely between when it was left and when we send the notification.

Objects help keep Knock in sync with your system to ensure the data sent out to your customers is fresh. Here's an example.

1. **Send the comment object to Knock**

```javascript Send object to Knock
await knock.objects.set({
	id: comment.id,
	collection: "comments",
	properties: {
		text: comment.text,
		timestamp: comment.timestamp,
	}
});
```

2. **Tell Knock to reference the comment in the workflow**

Typically you'd send a data payload through to Knock with the comment's content, but since we have that data available in our comment object, we can just reference that in our workflow trigger.

```javascript Reference object in workflow trigger
knock.workflows.trigger("new-comment", {
	actor: comment.authorId,
	recipients: projectUserIds,
	// old with data: 
	// data: { comment },
	// new with reference:
	references: {
		comment: { id: comment.id, collection: "comments" },
	}
});
```

This exposes the comment object above in our workflow under the `comment` template key so that the properties on the comment (`text` and `timestamp`) are available to our template. 

3. **Once the comment changes, we can update it:**

We only need to send over the properties that have changed, which in this example is the `text`.

```javascript Update object
await knock.objects.set({
	id: comment.id,
	collection: "comments",
	properties: {
		text: comment.text,
	}
});
```

Within Knock, any notifications that are yet to be sent that reference this comment will have the latest version of the comment when they are executed. 🎉 -->


<br />


