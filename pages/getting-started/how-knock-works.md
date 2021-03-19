---
title: How Knock works
---

Knock is a hosted notifications-as-a-service platform to power your product notifications.
Knock is made up of two components; an API you send and receive data from, and a dashboard that
you use to design your product notifactions and the logical rules through which they'll flow.

The first step is to populate Knock with data about your users. From there, you can create your first notification
in the Knock dashboard, and then finally integrate the triggers to call the notification flows you've built in Knock.

You can read more on getting up and running in our [Quick Start guide](/getting-started/quick-start).

## The Knock notifications engine

The Knock notifications engine is a [trigger driven system](/sending-notifications/triggering-flows) that allows you to control precisely when a notification should be sent and who it should be sent to. It handles:

- Complex notification orchestration across channels
- Batch, aggregatation, and digesting of notifications to prevent spamming
- Syncronizing the read stauses of your notifications across channels
- Applying user preferences to avoid sending notifications to users who have opted out
- Reliable delivery of your notifications to your delivery providers
- Recipient fan-out across large groups of users
- Capturing and storing data about engagement with the notifications you send

## Configuring Knock

Knock is easy to set up. It shouldn't take your engineering team more than a few hours
to integrate into your product, and we're happy to help with the integration however we can. Here's how it works: 

1. Connect your channels. Connect any channels (e.g. email) through which you plan to send notifications and enter the config details of your existing delivery providers (e.g. Sendgrid.)
2. Start ending user data into Knock. You'll use identify calls to send user data into Knock. We use this data to know how to reach a user on a given channel.
3. Build your first notification in Knock. You'll design the orchestration flow as well as the per-channel notification designs themselves. When finished, we'll give you the payload format to send from your backend. 
4. Trigger your Knock notification from your backend. You'll call our Notify endpoint with the payload provided in step 3.

## Cross-channel orchestration logic

At the heart of Knock is our orchestration engine. This allows you to perform complex orchestration
logic for your notifications such as:

- Falling back to different notification channels if the user has not yet seen the notification
- Time based delays (seconds, minutes, hours, days)
- Batching together notifications on the same content into single updates

## In-app notification feeds

A great in-app notification feed helps your users find where their attention is needed in your product, in real-time.

Knock offers out-of-the-box support for in-app feed functionality. Our prebuilt components give you a fully featured in-app feed you can drop into your frontend in minutes, with support for real-time delivery, accurate badge counts, and mark as read functionality. If you need to customize your experience, you can use our SDKs and API to build your own feed component. 

You can add Knock's in-app feed channel to any notification you configure in the Knock dashboard to immediately start routing that notification to your users' in-app feed experience. 

## Notification preferences

Users expect a notification experience that they can tailor to their workflow. We provide an out-of-the-box component you can customize to give your users the notification preferences they want. 

If you'd prefer to own this experience, you can use our APIs in order to syncronize the user
preferences and trust Knock to apply the correct preference to notification mapping.

## Integration with delivery partners

Knock integrates with the email delivery platforms you already use today. We handle the
API call to these providers for you, and ensure that your notification reaches the provider
successfully.

## Notification rollout management

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
