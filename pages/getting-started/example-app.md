---
title: Example app
---

Learn more about how Knock works and get up and running quickly using our [Nodejs example app](https://github.com/knocklabs/example-collaboration-app/) as reference.

## Introduction

The example application is a classic collaboration application that covers common notification features.
Users on the app belong to workspaces, and can be members of different projects within a workspace.
Within projects, assets can be created and commented.

## Features

1. Sign up with welcome email (includes how to identify users on Knock)
2. In-app feed to see notifications
3. Notifications via email when activities happen on projects (new comments and new assets)
4. Integrate Slack on projects so all activity regarding them is available on a Slack channel
5. Mute projects (allow the user to disabled all notifications for a particular project)
6. Support preferences: let the use select how do they want to get notified of each action (email, in-app feed, or both)

## How to run it locally

Follow the app's README file in order to configure it and run it.
You can setup workflows in your Knock account in order for the app to work as expected.

You will need to create:

1. Email and In-app feed channels
2. Worklow called "welcome" which must include an email step with a welcome email
3. Workflow called "new-comment" which includes an Email step and a In-app feed step
4. Workflow called "new-asset" which includes an Email step an a In-app feed step

The README also covers the creation of seed data, which also includes syncing your local users to your Knock account.
Once the seed data is present and the workflows are created on Knock, you will be able to use the app locally and see
triggered workflows messages.
