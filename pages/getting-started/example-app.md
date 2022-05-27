---
title: Example app
tags: ["nodejs", "using knock", "getting started"]
---

Learn more about how Knock works and get up and running quickly using our [Node.js example app](https://github.com/knocklabs/knock-node-example-app/).

## Introduction

The Knock example app is a simple collaboration product where users can create assets and collaborate on them with comments. It includes a number of common notification use cases such as batching high-frequency notifications, managing notification preferences on behalf of users, and mapping a resource to a Slack channel.

Here's a brief overview of the model of the Knock example app. The app has Users which belong to Workspaces. Each workspace has a number of Projects, which contain Assets. Users upload assets to projects, and then leave Comments on those assets to collaborate with their workspace members.

The example app uses Knock to power its notifications 😁.
As you explore the app, you'll find it using Knock to support the following features:

1. Send a welcome email when a user signs up (includes how to identify users on Knock)
2. Display notifications to users in the app with Knock's real-time feed
3. Send email notifications when new comments and assets are added to projects
4. Connect a project to a Slack channel so that all project activity sends notifications to the connected channel
5. Enable a user to mute notifications for a specific project
6. Enable users to manage their notification preferences across all notification types for each channel (email, in-app feed, or both)

## Example app + resource muting

Introducing notifications to features in your app greatly enhances how your users experience your app. One way of taking it one step further is to give users more control on when they should be notified. In this guide we will go over muting resource, but first, what does muting mean in this context?

On our example application, users have access to projects, and they will be notified whenever a comment or an  asset are added to it. This is great! whenever an important event happens, they will get to know about it. On the downside, if a user belongs to a fair amount of projects and not all of them are equally important, they may receive too many notifications on which the important ones may go under the radar.

One solution to this problem is for users to be able to mute all notifications that come from a particular project, resulting in only the most important updates for them going through.

The example application solves this problem by mainly using two Knock features.

The first one is using [conditions](send-notifications/setting-preferences#setting-preferences-with-conditions) in user preferences. Knock allows you to set conditions on the preferences of a user on when they ought to be notified. When a user signs up on the example application, we use the preferences API to store conditions for the workflows that the app supports (`new-comment` and `new-asset`). You can see the API call following [this](https://github.com/knocklabs/knock-node-example-app/blob/main/app/auth/mutations/signup.ts#L46) link.

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
})
```

The conditions we are adding here state that the user will be notified only if the `muted_projects` list does not contain the `projectId` that will be received as part of the workflow trigger data.

The other half of this feature is making sure that the `muted_projects` list gets updated every timer a user mutes a project, which can be found [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/projects/mutations/toggleMuted.ts).

```javascript
// get all project memberships that are muted
const mutedProjectIds = user.projectMemberships
  .filter((pm) => pm.muted)
  .map((pm) => pm.projectId)

// store the muted projects as a variable within Knock's user
await knockClient.users.identify(`${userId}`, {
  muted_projects: mutedProjectIds,
})
```

Everytime the user mutes a project we sync that information to Knock using the `identify` API endpoint.

The last remaining piece of the puzzle to make all of this work together, is making sure we are sending `projectId` as part of the workflow trigger payload, which can be found [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/comments/mutations/createComment.ts#L92).

## Example app + Slack integration

A classic feature regarding notifications is to connect a particular resource from your domain to a Slack channel. This is great for keeping track of what's going on in a particular topic regarding your app.

In our example application, users have access to projects which allow an unbounded number of members. Given our users probably use Slack on their organization, the application provides a simple way to connect a particular project with a particular Slack channel so all members on the project are up to date with important news related it.

The example application's implementation of this feature relies mostly on the [Objects API](/send-and-manage-data/objects) and [setting channel data on them](/send-notifications/setting-channel-data).

First, we add a [connect to Slack button](https://api.slack.com/docs/slack-button), which will trigger the oAuth flow that will enable the user to select a channel on their organization. You can see how the example application implements the button on the project page [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/projects/components/AddSlackBtn.tsx#L4). After the user selects a channel, Slack will call the callback URI used on the button with the provided state. The state that is being sent is the project id that will be used in the callback to connect the selected channel with the proper project on the app.

The callback implementation in the example application can be found [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/api/slack-cb.ts#L1). The callback then does an authenticated call to Slack to fetch an incoming wehbook URL, which we will use on Knock's side to power our Slack integration.

First, we need to create a representation of the project on Knock, which can be found [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/api/slack-cb.ts#L50).

```javascript
await knockClient.objects.set("projects", `${project.id}`, {
  name: project.name,
})
```

This call will add the project to the `projects` collection with its name, so when the project is listed as a recipient, we can use its name on our notification templates.

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

## Example + Managing preferences

Building applications with extensive notification coverage eventually results in complexity for users on how to manage their preferences.
Users will be notified from different workflows and types of channels so providing a flexible yet simple method of setting preferences
becomes important for their experience to be pleasant.

In our example application, users are notified when a new comment or asset gets added to a project they are a member of.
Assuming the `new-comment` and `new-asset` workflows notify recipients both through email and in app feed notifications, we
want users to be able to select for each workflow, on which channel or channels they want to get notified (email, in app feed, or both).

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

Using [Knock's JS client SDK](https://github.com/knocklabs/knock-client-js), the modal [fetches the preferences](https://github.com/knocklabs/knock-node-example-app/blob/main/app/users/components/NotificationPreferencesModal.tsx#L42) for the current user which then later are used to populate the grid on the modal, as you can see [here](https://github.com/knocklabs/knock-node-example-app/blob/main/app/users/components/NotificationPreferencesModal.tsx#L120). For each key found on the preferences, the modal rendes a new row with two checkboxes (one per type of of channel).

When the user updates their preference, the modal uses the client SDK to set the workflow preferences. You can read more on this [here](/send-notifications/setting-preferences).

## How to run it locally

Follow the app's [README file](https://github.com/knocklabs/knock-node-example-app/blob/main/README.md) to configure and run the app locally.

To use the app with your Knock account, you'll need to configure channels and workflows for the app to work as expected. You will need to create:

1. Email and in-app feed channels
2. Create a workflow in Knock with the key `welcome`. It should include an email step for your welcome email template.
3. Create a workflow in Knock with the key `new-comment`. It should include: an in-app feed step and an email step. On these steps templates you can use the following variables which will sent as arguments on the trigger call:
   1. `comment_content`: The content of the created comment.
   2. `asset_name`: The name of the commented asset.
   3. `asset_url`: The url of the commented asset.
   4. `project_name`: The name of the project that the comment asset belongs to.
4. Create a workflow in Knock with the key `new-asset`. It should include: an in-app feed step and an email step. On these steps templates you can use the following variables which will sent as arguments on the trigger call:
   1. `asset_url`: The url of the commented asset.
   2. `project_name`: The name of the project that the comment asset belongs to.

The README also covers initial data setup, such as syncing your local users to your Knock account.
Once this seed data is present and the workflows are created on Knock, you can use the app locally and see
trigger Knock workflows to send notifications from the example app.
