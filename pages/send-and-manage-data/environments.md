---
title: Environments
description: Learn about how Knock's isolated environment model works and how it fits into your system development lifecycle
tags: ["how knock works"]
section: Send & manage data
---

Knock uses the concept of environments to ensure logical separation of your data between
local, staging, and production environments. This means that users, and preferences created
in one environment are **never** accessible to another.

The API key you use determines the environment into which you'll be sending data. You can find your environment specific API keys under the "Developer" section of the Knock dashboard.

Note: By default, your Knock account comes with two environments: Development and Production. If you need an additional environment in Knock to mirror your own development lifecycle (for example, a Staging environment) you can add it on the settings page of the Knock dashboard.

## Promotion and rollback

Knock is designed to allow large teams to create and manage notifications at scale. That means that
notifications changes must be versioned, tested, and promoted to production environments, so that if there are
any issues they can be rolled back with ease.

Knock uses a model where all changes to the production environment must be **promoted** and cannot be made directly.
This means that changes must be made in the development environment, then staged and tested before being rolled out (similar to a git-based workflow).

A typical deployment lifecycle in Knock looks like:

1. Introduce any backend changes to support a new workflow (users and preference properties)
2. Build the workflow in a dev environment in Knock and commit it to that environment
3. Test the workflow
4. When you're ready to go live, promote the workflow to production

## Commits

To version the changes you make in your environments, Knock uses a commit model. When you make a change to a workflow or a layout in the Knock dashboard, you'll need to commit it to your development environment before those changes will appear in workflows triggered via the API.

There is one exception to this rule: the active/inactive status on a given workflow. This status lives independently from the commit model so that you can immediately enable or disable a workflow in any environment without needing to go through environment promotion. This is your kill switch for a given workflow should you need it.

A couple other things to note:

- Channel configurations, branding, and variables do not need to be committed, as they live at the account-level. This means that if you make a change to a channel configuration, it will update immediately on notifications sent in that environment.
- Any changes you have not yet committed to your current environment **will** apply when you're using the test runner. This way you can test your latest changes before you commit them to your environment.

## Environment-based access controls

We recognize the importance of protecting your sensitive data, so we designed Knock from the ground-up to have privacy and security in-mind.

We have a role-based access control system that allows you to control who can access which environments, and the features available in those environments.

Additionally, each environment allows you to control:

1. Whether end user details should be available or obfuscated (defaults to obfuscated in production)
2. Whether the contents of a message should be displayed (default disabled in production)

These controls are useful as you'll typically want to see this data in your development/test environment for debugging purposes, while in your production you'll want to protect your real end user data from
most, if not all, employees.

## Account and environment variables

You can use variables to set global values to use across your workflows and layouts. Variables can be defined at the account-level in Knock, meaning they apply across all workflows, or can be defined/overridden at the environment-level. When a variable is defined, it is available under the `vars` namespace in any notification templates where you want to use it.

You can set account-level variables in the settings page of the Knock dashboard. You can set environment-level variables under the developers page of a given environment within the Knock dashboard.
