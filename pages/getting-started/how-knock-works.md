---
title: How Knock works
---

Knock is a hosted notifications-as-a-service platform to power your user facing product notifications.
Knock is made up of two components; an API you send and can receive data from, and a dashboard that
you can use to design and create your product notifactions flows and content.

The first step is to start sending user and event data into Knock, which forms the core requirement
of the data we need in order to start generating your notification flows. From there, you can start
creating your notification flows and the content inside the notification from the Knock dashboard.

You can read more on getting up and running in our [Quick Start guide](/getting-started/quick-start).

## The Knock engine

Knock is an event-driven notifications engine, meaning that we use event messages that represent actions occurring in
your product as trigger conditions for notifications to be generated. Broadly, you can think of Knock
as an event-driven data pipeline that uses configuration that you set visually in the dashboard in order
to execute complex notification workflows and deliver them to particular channels.

Knock is a full replacement for an in-house notification system. It handles:

- Complex notification orchestration across channels
- Batch, aggregatation, and digesting of notifications to prevent spamming
- Syncronizing the read stauses of your notifications across channels
- The application of user preferences to avoid sending notifications to users who have opted out
- Notification receipient selection and fan out
- Delivery of your notifications to your delivery providers

## Configuring Knock

Setting up Knock takes 3 simple steps:

1. Sending your user and event data into Knock
2. Configuring notification flows and designing notifications using the Knock dashboard
3. Building or integrating an in-app notification feed (optional)

## Cross-channel orchestration logic

At the heart of Knock is our orchestration engine. This allows you to perform complex orchestration
logic for your notifications such as:

- Falling back to different notification channels if the user has not yet seen the notification
- Time based delays (seconds, minutes, hours, days)
- Batching together notifications on the same content into single updates

## User notification feeds

In-app notification feeds form a vital part of a users notification access. They are integral for
a lot of workflow products as a way for users to quickly see what requires their attention,
and are a table-stakes feature today in collaboration products.

Knock provides prebuilt components in order to build an in-app user notification feed, including
the real-time delivery of the notifications to the feed, syncing up the badge count across devices
and providing scaleable storage of notifications to power millions of users on your product.

If you want a more customized experience, you can use our SDKs and API in order to build your own
notification feed experience with Knock providing just the data layer for you.

## Notification preferences

Configurable preferences allow users to customize their notifications experience exactly as they
want it. Knock provides out-of-the-box components and a builder for you to create delightful
preference experiences that put your customer in control.

If you'd prefer to own this experience, you can use our APIs in order to syncronize the user
preferences and trust Knock to apply the correct preference to notification mapping.

## Integration with delivery partners

Knock does not handle the delivery of your notifications directly, instead we integrate with the
providers you're already using in order to send your notifications. We'll handle the reliable
API call to these providers for you, and ensure that your notification reaches the provider
successfully.

## Analytics and engagement data

Notifications generate a lot of "exhaust data" about their usage; opens, link clicks, reads and more.
Knock captures all of this engagement data and can syncronize it to your analytics pipeline (via Segment).
