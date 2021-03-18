---
title: Core data concepts
---

In order for Knock to generate notifications for your end users we need to have knowledge about a
few key pieces of data from your system. This guide will give you an overview to the different types of data we need
in order to power Knock.

## Users

A user in Knock represents someone who should receive a notification. A users profile information
contains important attributes about the user that will be used in the notifications (name, email).
The user object can contain other key value pairs that can be used to perform additional personalization
of your notification messages as well.

[Read more →](/send-and-manage-data/users)

## Lists

A list groups users together to represent sets of individuals who may need to be notified as a group.
Lists typically map to your relationship hierarchies such as groups, teams, or project members. Lists
are an essential abstraction for when your system needs to notify many users at once as the result
of a notification, like a comment being left that needs to notify all members of the parent document.

[Read more →](/send-and-manage-data/lists)

## Preferences

A preference indicates a users willingness to receive a particular kind of notification. Preferences
always belong to a user and can optionally be paired with an identifier that represents the account
or tenant that the user belongs to as well (for multi-tenant applications).

[Read more →](/send-and-manage-data/preferences)

## Managing environments

Knock uses a set of logically separated environments that map to your environments. This ensures that
you can protect sensitive production data as well as being able to easily build and test new and existing
notification flows before enabling them for your end users.

[Read more →](/send-and-manage-data/environments)
