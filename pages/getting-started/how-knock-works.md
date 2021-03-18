---
title: How Knock works
---

Knock is a hosted notifications-as-a-service platform to power your user facing product notifications.
Knock is made up of two components; an API you send and can receive data from, and a dashboard that
you can use to design and create your product notifactions flows and content.

The first step is to populate Knock with data about your users, from there, you can start
creating your notification flows and the content inside the notification from the Knock dashboard,
and then finally integrate the triggers to call the notification flows you've built.

You can read more on getting up and running in our [Quick Start guide](/getting-started/quick-start).

## The Knock notifications engine

Knock provides a fully-featured notifications engine to replace or eliminate the need for you to build
an in-house solution. Knock is a [trigger driven system](/sending-notifications/triggering-flows) that allows you to control precisely when a flow should be started, as well as the recipients who should be notified from your backend codebase. It handles:

- Complex notification orchestration across channels
- Batch, aggregatation, and digesting of notifications to prevent spamming
- Syncronizing the read stauses of your notifications across channels
- Applying user preferences to avoid sending notifications to users who have opted out
- Reliable delivery of your notifications to your delivery providers
- Recipient fan-out across large groups of users
- Capturing and storing data about engagement with the notifications you send

## Configuring Knock

Setting up Knock is a simple task. It shouldn't take your engineering team more than a few hours
to integrate into your product and we're happy to help with the integration.

1. Configuring the channels you wish to send notifications on and configuring your delivery providers
2. Connecting your end user data into Knock so we know how to send users messages
3. Configuring notification flows and designing notifications using the Knock dashboard
4. Triggering your notification flows from within your backend
5. Building or integrating an in-app notification feed (optional)

## Cross-channel orchestration logic

At the heart of Knock is our orchestration engine. This allows you to perform complex orchestration
logic for your notifications such as:

- Falling back to different notification channels if the user has not yet seen the notification
- Time based delays (seconds, minutes, hours, days)
- Batching together notifications on the same content into single updates (coming soon)

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
preference experiences that put the end user in control.

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

## Managing the roll-out of notifications

Knock is designed with the needs of teams of all sizes in mind. We provide logically separated
environments, version control, and a full audit log to aid with the process of introducing new
notifications and making changes to existing notifications.

## Comprehensive logging

All of the notification actions are logged in Knock for 90 days, that includes data about who was
sent a notification, why they were sent it, and what actions they performed on the notification
(opens, clicks, reads etc).

We'd be happy to discuss longer data archiving with you, or integration into your own data warehouse.

## Security & privacy

We understand how sensitive user and notification data can be, which is why we built Knock from the
ground up with best-in-class practices in mind for securing your data. Our security practices include:

- Encrypting all of your data at rest, and with TLS while in transit
- Limiting our internal access to our production database
<!-- - An external bug-bounty program to find any issues and disclose them -->
- Regular penetration testing (we'd be happy to share the reports with you)

We also provide access controls to limit the display of user data to your staff, including obfuscating
user information and notification content sent. We have a full role-based access control mechanism
to ensure that you can grant the right people on your team access to data.
