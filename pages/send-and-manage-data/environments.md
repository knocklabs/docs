---
title: Environments
---

Knock uses the concept of environments to ensure logical separation between your data for your
local, staging, and production environments. This means that users, lists, and preferences created
in one environment are **never** accessible to another.

The API key you use determines the environment that you'll be sending data into, which you can
find in the Knock dashboard.

## Promotion and rollback

Knock is designed to allow large teams to create and manage notifications at scale. That means that
notifications changes must be versioned, tested, and rolled out with controls such that if there are
any issues in production that they can be rolled back with ease.

Knock uses a model whereby all changes to production must be **promoted** and cannot be made directly.
This means that changes have to be staged and tested before being rolled out (similar to a git based workflow).

A typical workflow in Knock looks like:

1. Introduce any backend changes to support the new notification (users, lists, and preference properties)
2. Build the notification flow in a dev environment in Knock
3. Test the flow
4. When you're ready to go live, promote the notification flow to production

## Environment based access controls

We recognize the importance of protecting your sensitive data, so we designed Knock from the ground-up to have privacy and security in-mind.

We have a role-based access control system that allows you to control who can access which environments, and the features available in those environments.

Additionally, each environment allows you to control:

1. Whether end user details should be available or obfuscated (defaults to obfuscated in production)
2. Whether the contents of a notification should be displayed (default disabled in production)

These controls are useful as typically in your development/test environment you'll want to see this
data in order to debug your system, where in production you want to protect your end user data from
most, if not all employees.
