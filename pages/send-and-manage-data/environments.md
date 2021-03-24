---
title: Environments
---

Knock uses the concept of environments to ensure logical separation of your data between
local, staging, and production environments. This means that users, lists, and preferences created
in one environment are **never** accessible to another.

The API key you use determines the environment into which you'll be sending data. You can find your environment specific API keys under the "Developer" section of the Knock dashboard.

## Promotion and rollback

Knock is designed to allow large teams to create and manage notifications at scale. That means that
notifications changes must be versioned, tested, and rolled out with controls such that if there are
any issues in production they can be rolled back with ease.

Knock uses a model whereby all changes to the production environment must be **promoted** and cannot be made directly.
This means that changes have to be staged and tested before being rolled out (similar to a git based workflow).

A typical workflow in Knock looks like:

1. Introduce any backend changes to support a new Notification (users, lists, and preference properties)
2. Build the Notification workflow in a dev environment in Knock
3. Test the workflow
4. When you're ready to go live, promote the Notification to production

## Environment-based access controls

We recognize the importance of protecting your sensitive data, so we designed Knock from the ground-up to have privacy and security in-mind.

We have a role-based access control system that allows you to control who can access which environments, and the features available in those environments.

Additionally, each environment allows you to control:

1. Whether end user details should be available or obfuscated (defaults to obfuscated in production)
2. Whether the contents of a message should be displayed (default disabled in production)

These controls are useful as you'll typically want to see this data in your development/test environment for debugging purposes, while in your production you'll want to protect your real end user data from
most, if not all, employees.
