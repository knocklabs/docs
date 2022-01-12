---
title: Core data concepts
---

In order for Knock to generate messages for your end users we need to have knowledge about a
few key pieces of data from your system. This guide will give you an overview to the different types of data we need
in order to power Knock.

## Users

A user in Knock represents someone who should receive a message. A user's profile information
contains important attributes about the user that will be used in messages (name, email).
The user object can contain other key-value pairs that can be used to further personalize your messages.

[Learn more →](/send-and-manage-data/users)

[API reference →](/reference#users)

<!-- ## Lists

A list groups users together to represent sets of individuals who may need to be notified as a group.
Lists typically map to your relationship hierarchies such as groups, teams, or project members. Lists
are an essential abstraction for when your system needs to notify many users at once as the result
of a triggered workflow (such as a new comment workflow that sends messages to all members of the parent document.)

[Read more →](/send-and-manage-data/lists) -->

## Preferences

A preference indicates a user's willingness to receive a particular type of notification. Preferences
always belong to a user and can be paired with an identifier that represents the account
or tenant that the user belongs to (for multi-tenant applications).

[Learn more →](/send-and-manage-data/preferences)

[API reference →](/reference#preferences)

## Environments

Knock uses a set of logically separated environments that map to your environments. This ensures that
you can protect sensitive production data and easily build and test workflows before enabling them for your end users.

[Read more →](/send-and-manage-data/environments)

## Objects

An object represents a resource in your system that you want to map into Knock. Objects are a powerful and flexible way to ensure Knock always has the most up-to-date information required to send your notifications. They also enable you to send notifications to non-user recipients.

You can use objects to:
- send in-app notifications to non-user resources in your product (the activity feed you see on a Notion page is a good example)
- send out-of-app notifications to non-user recipients (such as a Slack channels)
- reference mutable data in your notification templates (such as when a user edits a comment before a notification is sent)

[Learn more →](/)

[API reference →](/reference#objects)