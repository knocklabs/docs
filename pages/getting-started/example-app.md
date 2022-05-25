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
