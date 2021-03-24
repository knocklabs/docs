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

[Read more →](/send-and-manage-data/users)

## Lists

A list groups users together to represent sets of individuals who may need to be notified as a group.
Lists typically map to your relationship hierarchies such as groups, teams, or project members. Lists
are an essential abstraction for when your system needs to notify many users at once as the result
of a Notification (such as a new comment Notification that sends messages to all members of the parent document.)

[Read more →](/send-and-manage-data/lists)

## Preferences

A preference indicates a user's willingness to receive a particular type of Notification. Preferences
always belong to a user and can be paired with an identifier that represents the account
or tenant that the user belongs to (for multi-tenant applications).

[Read more →](/send-and-manage-data/preferences)

## Managing environments

Knock uses a set of logically separated environments that map to your environments. This ensures that
you can protect sensitive production data and easily build and test new and existing
notification flows before enabling them for your end users.

[Read more →](/send-and-manage-data/environments)
