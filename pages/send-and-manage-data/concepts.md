---
title: Core data concepts
description: Learn about the the main data concepts in Knock.
tags: ["how knock works"]
section: Send & manage data
---

In order for Knock to generate messages for your end users we need to have knowledge about a few key pieces of data from your system. This guide will give you an overview to the different types of data we need in order to power Knock.

## Users

A user in Knock represents someone who should receive a message. A user's profile information contains important attributes about the user that will be used in messages (name, email). The user object can contain other key-value pairs that can be used to further personalize your messages.

[Learn more →](/send-and-manage-data/users)

[API reference →](/reference#users)

## Preferences

A preference indicates a user's willingness to receive a particular type of notification. Preferences always belong to a user and can be paired with an identifier that represents the account or tenant that the user belongs to (for multi-tenant applications).

[Learn more →](/send-and-manage-data/preferences)

[API reference →](/reference#preferences)

## Environments

Knock uses a set of logically separated environments that map to your environments. This ensures that you can protect sensitive production data and easily build and test workflows before enabling them for your end users.

[Read more →](/send-and-manage-data/environments)

## Schedules

A schedule allows you to automatically trigger a workflow at a given time for one or more recipients. You can think of a schedule as a managed, recipient-timezone-aware cron job that Knock will run on your behalf.

[Read more →](/send-and-manage-data/schedules)

## Objects

An object represents a resource in your system that you want to map into Knock. Objects are a powerful and flexible way to ensure Knock always has the most up-to-date information required to send your notifications. They also enable you to send notifications to non-user recipients.

You can use objects to:

- send in-app notifications to non-user resources in your product (the activity feed you see on a Notion page is a good example)
- send out-of-app notifications to non-user recipients (such as a Slack channels)
- reference mutable data in your notification templates (such as when a user edits a comment before a notification is sent)

[Learn more →](/send-and-manage-data/objects)

[API reference →](/reference#objects)

## Tenants

Tenants represent segments your users belong to. You might call these "accounts," "organizations," "workspaces," or similar. This is a common pattern in many SaaS applications: users have a single login joined to multiple tenants to represent their membership within each. Within Knock you can model your tenant objects as first-class entities and use them to scope features.

[Learn more →](/send-and-manage-data/tenants)

[API reference →](/reference#tenants)

## Subscriptions

A subscription represents a relationship between a non-user entity (an Object) and a Recipient (the subscriber). Subscriptions are used to model pub/sub behavior and lists of recipients that Knock will automatically fan out a workflow trigger to on your behalf.

[Learn more →](/send-and-manage-data/subscriptions)

[API reference →](/reference#subscriptions)

## Messages

A message in Knock represents a notification delivered to a recipient on a particular channel. Messages contain information about the request that triggered its delivery, a view of the data sent to the recipient, and a timeline of its lifecycle events.

[Learn more →](/send-and-manage-data/messages)

[API reference →](/reference#messages)

## Translations

Translations support localization in Knock. They hold the translated content for a given locale, which you can reference in your message templates with the `t` Liquid function filter.

[Learn more →](/send-and-manage-data/localization)

## Outbound webhooks

You can configure Knock to make requests to your own backend with data about events happening in your Knock account. Knock scopes webhooks to a single environment and they notify on message lifecycle event changes.

[Learn more →](/send-and-manage-data/outbound-webhooks)

## Conditions

Knock uses conditions to model checks that determine variations in your workflow runs. They provide a powerful way to create more advanced notification logic flows.

[Learn more →](/send-and-manage-data/conditions)

## Variables

Variables within Knock let you set shared constants or secrets that you can use in all of the workflows and templates under your account. Variables can be overridden at the environment level to set per environment constants.

[Learn more →](/send-and-manage-data/variables)
