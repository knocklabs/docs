---
title: Knock example apps
tags: ["nodejs", "using knock", "getting started", "react"]
section: Getting started
---

Below you'll find a number of Knock example apps to learn from or incorporate into your project.

## React in-app notifications example app

Learn more about integrating Knock into your web application to power in-app notification feed and toast experiences using our [React example app](https://github.com/knocklabs/in-app-notifications-example-nextjs), written in Next.js.

[See a live demo](http://knock-in-app-notifications-react.vercel.app/)

## Node.js example app

Learn more about how Knock works and get up and running quickly using our [Node.js example app](https://github.com/knocklabs/knock-node-example-app/).

### Introduction

The Knock example app is a simple collaboration product where users can create assets and collaborate on them with comments. It includes a number of common notification use cases such as batching high-frequency notifications, managing notification preferences on behalf of users, and mapping a resource to a Slack channel.

Here's a brief overview of the model of the Knock example app.

- The app has Users which belong to Workspaces.
- Each workspace has a number of Projects, which contain Assets.
- Users upload assets to projects, and then leave Comments on those assets to collaborate with their workspace members.

The example app uses Knock to power its notifications 😁.
As you explore the app, you'll find it using Knock to support the following features:

1. Send a welcome email when a user signs up (includes how to identify users on Knock)
2. Display notifications to users in the app with Knock's real-time feed
3. Send email notifications when new comments and assets are added to projects
4. Connect a project to a Slack channel so that all project activity sends notifications to the connected channel
5. Enable a user to mute notifications for a specific project
6. Enable users to manage their notification preferences across all notification types for each channel (email, in-app feed, or both)

At the bottom of this page you'll find a number of example app guides for using Knock to power advanced notification functionality.

### How to run the example app locally

Follow the app's [README file](https://github.com/knocklabs/knock-node-example-app/blob/main/README.md) to configure and run the app locally.

Before you run the example app locally, you'll need to create a Knock account to configure channels and workflows for the app to work as expected.

Once you've create your Knock account you will need to create:

1. Email and in-app feed channels
2. A workflow in Knock with the key `welcome`. It should include an email step for your welcome email template.
3. A workflow in Knock with the key `new-comment`. It should include: an in-app feed step and an email step. On these steps templates you can use the following variables which will sent as arguments on the trigger call:
   1. `comment_content`: The content of the created comment.
   2. `asset_name`: The name of the commented asset.
   3. `asset_url`: The url of the commented asset.
   4. `project_name`: The name of the project that the comment asset belongs to.
4. A workflow in Knock with the key `new-asset`. It should include: an in-app feed step and an email step. On these steps templates you can use the following variables which will sent as arguments on the trigger call:
   1. `asset_url`: The url of the commented asset.
   2. `project_name`: The name of the project that the comment asset belongs to.

The README also covers initial data setup, such as syncing your local users to your Knock account.
Once this seed data is present and the workflows are created on Knock, you can use the app locally and see
trigger Knock workflows to send notifications from the example app.

### Guides

#### Muting notifications about a resource

Sometimes your users may want to mute notifications about a given resource in your product that's getting noisy. For example, a specific file or project.

The example app enables resource muting with two Knock features.

The first is [preference conditions](send-notifications/setting-preferences#setting-preferences-with-conditions). Knock allows you to set conditions for a given user that define they should be notified. When a user signs up on the example application, we use the preferences API to store conditions for the workflows that the app supports (`new-comment` and `new-asset`). You can see this API call in action [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/auth/mutations/signup.ts#L46).

```javascript
await knockClient.users.setWorkflowsPreferences(`${user.id}`, {
  "new-comment": {
    conditions: [
      {
        variable: "recipient.muted_projects",
        operator: "not_contains",
        argument: "data.projectId",
      },
    ],
  },
  "new-asset": {
    conditions: [
      {
        variable: "recipient.muted_projects",
        operator: "not_contains",
        argument: "data.projectId",
      },
    ],
  },
});
```

These preference conditions state that the user will be notified only if the `muted_projects` list does not contain the `projectId` received in the workflow trigger data.

The other half of this feature is making sure that the `muted_projects` list gets updated every time a user mutes a project, which you can see [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/projects/mutations/toggleMuted.ts).

```javascript
// get all project memberships that are muted
const mutedProjectIds = user.projectMemberships
  .filter((pm) => pm.muted)
  .map((pm) => pm.projectId);

// store the muted projects as a variable within Knock's user
await knockClient.users.identify(`${userId}`, {
  muted_projects: mutedProjectIds,
});
```

Every time the user mutes a project we sync that information to Knock using the `identify` API endpoint.

The last step is to send `projectId` as part of the workflow trigger payload, which you can see in the example app [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/comments/mutations/createComment.ts#L92). This ensures that the workflow trigger payload includes a `projectId` for the recipient's preference condition to reference to determine whether the recipient has muted notifications about that project.

#### Sending Slack notifications

A great way to keep your customers in the loop is to enable them to connect a resource from your product to a Slack channel in their workspace. This way any events that take place in that resource get routed to that Slack channel as notifications.

The example app uses the [Objects API](/send-and-manage-data/objects) to create references to its projects in Knock, and then [sets channel data on those objects](/send-notifications/setting-channel-data) when a customer OAuths into Slack and connects a channel to a project in the example app.

First, we add a [connect to Slack button](https://api.slack.com/docs/slack-button) which will trigger the OAuth flow that will enable the user to select a channel on their organization. You can see how the example application implements the button on the project page [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/projects/components/AddSlackBtn.tsx#L4). After the user selects a channel, Slack will call the callback URI used on the button with the provided state. The state that is sent is the project id that will be used in the callback to connect the selected channel with the proper project on the app.

The callback implementation in the example application can be found [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/api/slack-cb.ts#L1). The callback then does an authenticated call to Slack to fetch an incoming wehbook URL, which we will use on Knock's side to power our Slack integration.

First, we need to create a representation of the project on Knock. You can find this implementation in the example app [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/api/slack-cb.ts#L50).

```javascript
await knockClient.objects.set("projects", `${project.id}`, {
  name: project.name,
});
```

This call adds the project to the `projects` collection in Knock so we can use it as a recipient in our workflows.

Now that the project is a Knock object, we can set channel data on it. In this case, we will set the incoming webhook URL that was returned by Slack, and that's what Knock will use to send notifications when the project is listed as a recipient on a workflow trigger API call.

```javascript
await knockClient.objects.setChannelData(
  "projects",
  `${project.id}`,
  process.env.KNOCK_SLACK_CHANNEL_ID!,
  {
    connections: [
      {
        incoming_webhook: { url },
      },
    ],
  }
)
```

The last bit of this implementation is to add the project as a recipient whenever a workflow trigger call happens. In the case of objects, you need to specifiy their collection and id. You can see how the example applications does it [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/comments/mutations/createComment.ts#L80).

#### Managing user notification preferences

Notification preferences are an important part of giving users control over where and when they want to be notified.

In our example application, users are notified when a new comment or a new asset gets added to a project they are a member of. We
want users to be able to choose which channels they want to get notified on (email, in-app feed, or both) for those types of notifications.

One way of implementing UI to support this functionality is to build a grid component where each row represents a workflow and each column
represents a channel type. On each cell of the grid, we could display a checkbox that would indicate if the user wants to receive notification
for a particular workflow on a particular channel.

A great advantage of this UI pattern, is that it aligns very well on how preferences for workflows can be stored in Knock, you can read more about this on the
preferences [docs](/send-and-manage-data/preferences#workflow-preferences). Workflows preferences support the following structure:

```json
{
  "new-comment": {
    "channel_types": {
      "in_app_feed": true,
      "email": true
    }
  },

  "new-asset": {
    "channel_types": {
      "in_app_feed": true,
      "email": true
    }
  },

  ...
}
```

The [user notification preference modal](https://github.com/knocklabs/knock-node-example-app/blob/main/app/users/components/NotificationPreferencesModal.tsx) is built following
the pattern described above.

Using [Knock's JS client SDK](https://github.com/knocklabs/knock-client-js), the modal [fetches the preferences](https://github.com/knocklabs/knock-node-example-app/blob/main/app/users/components/NotificationPreferencesModal.tsx#L42) for the current user which then later are used to populate the grid on the modal, as you can see [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/users/components/NotificationPreferencesModal.tsx#L120). For each key found on the preferences, the modal renders a new row with two checkboxes (one per type of of channel).

When the user updates their preference, the modal uses the client SDK to set the workflow preferences. You can read more on this [here](/send-notifications/setting-preferences).
