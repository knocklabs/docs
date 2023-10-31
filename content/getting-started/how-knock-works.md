---
title: How Knock works
description: Learn the basic concepts of Knock and how it's configured.
tags: ["getting started"]
section: Getting started
---

Knock is a managed notifications-as-a-service platform to power your product notifications.

Knock consists of two parts: an API you send and receive data from, and a dashboard that
you use to design your product notifications and the logical rules through which they'll flow.

In this section we'll provide a general overview of how Knock works and dive into the key concepts you'll
use as you get started with Knock.

If you'd rather just start building you can check out our [Quick Start guide](/getting-started/quick-start).

## Overview

Knock takes inputs from your product in the form of API calls: `trigger`, `identify`, `setPreferences`. Once in Knock, these inputs are run through `Workflows`, which orchestrate and manage the delivery of `Messages` across in-app and out-of-app `Channels`.

Here's a visual of how these concepts work together:

![How Knock works diagram](/images/how-knock-works.png)

And here's a brief description of how each concept functions within Knock.

- [Users.](/reference#users) A User represents an individual that will receive messages. You'll use the User object to store important attributes about your recipients (e.g. name, email) to be used in personalizing and delivering the messages you send with Knock.
- [Preferences.](/reference#preferences) A Preference indicates a user's willingness to receive a particular kind of notification. Preferences belong to a User in Knock.
- [Channels.](/send-notifications/delivering-notifications) A Channel is a destination for your messages. It can be an out-of-app channel such as a SendGrid email integration, or an in-app channel such as the [Knock notification feed](/notification-feeds/overview). Channels are configured in the Knock dashboard as part of the [setup process](/getting-started/quick-start).
- [Workflows.](/reference#workflows) A Workflow orchestrates the delivery of messages to your end users. When you configure a workflow you'll determine which channels its messages should route to, what those messages should look like on each channel, as well as any functions—batch, throttle, digest—you want applied to the messages prior to delivery. A workflow is triggered by a `trigger` call, usually when something occurs in your product that you want your users to know about (e.g. a new comment.)
- [Messages.](/reference#messages) A message is a per-user, per-channel message sent to your users. Messages are generated by Workflows. Examples of messages include emails, Slack messages, and messages within in-app feeds.
- [Objects.](/reference#objects) An Object represents a non-user resource in your system that you want to map into Knock, usually to store channel data. You can use objects to send in-app notifications to non-user resources in your product (the activity feed you see on a Notion page is a good example), to send out-of-app notifications to non-user recipients (such as a Slack channels), and to reference mutable data in your notification templates (such as when a user edits a comment before the notification is sent.)

We'll be going into each of these concepts in more detail throughout this guide. You can also learn more about each one in our [API reference](/reference).

## The Knock workflow engine

The Knock workflow engine is a [trigger-driven system](/send-notifications/triggering-workflows) that allows you to control precisely when a message should be sent and who it should be sent to. It handles:

- Complex message orchestration across channels
- Batch, aggregation, and digesting of messages to prevent spamming
- Synchronizing the read statuses of your messages across channels
- Applying user preferences to avoid sending messages to users who have opted out
- Reliable delivery of your messages to your delivery providers
- Recipient fan-out across large groups of users
- Capturing and storing data about engagement with the messages you send

You can learn more about the Knock workflow engine in [our guide on designing workflows](/send-notifications/designing-workflows).

## Configuring Knock

Knock is easy to set up. It shouldn't take you more than a few hours
to integrate Knock into your product, and we're happy to help with the integration however we can.

Here's how it works:

1. **Connect your channels.** Connect any channels (e.g. email) through which you plan to send messages and enter the config details of your existing delivery providers (e.g. SendGrid.)
2. **Tell Knock about your users.** You'll use identify calls to send user data into Knock. We use this data to know how to reach a user on a given channel, as well as to manage user preferences on your behalf.
3. **Build your first workflow in Knock.** You'll design the notification workflow as well as the per-channel notification designs themselves. When finished, we'll give you the payload format to send from your backend.
4. **Trigger your Knock workflow from your backend.** You'll call our the trigger endpoint with the payload provided in step 3.

On the next page, you'll walk through our quick start guide to send your first notification with Knock.

## A five minute demo

Here's a five minute demo of how to use Knock to add an in-app feed and a cross-channel notification to an example app.

<div className="relative h-0" style={{paddingBottom: "56.25%"}}><iframe src="https://www.loom.com/embed/2865bc7d3bd04fcea9a527030c0f72b1" frameBorder="0" allowFullScreen className="absolute top-0 left-0 w-full h-full"></iframe></div>