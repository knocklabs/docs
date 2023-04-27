---
title: Environments
description: Learn about how Knock's isolated environment model works and how it fits into your system development lifecycle.
tags:
  [
    "how knock works",
    "branches",
    "env",
    "version control",
    "versions",
    "variables",
  ]
section: Send & manage data
---

Knock uses the concept of environments to ensure logical separation of your data between
local, staging, and production environments. This means that users, and preferences created
in one environment are **never** accessible to another.

The API key you use determines the environment into which you'll be sending data. You can find your environment specific API keys under the "Developer" section of the Knock dashboard.

## Create additional environments

By default your Knock account comes with two environments: Development and Production. If you need an additional environment in Knock to mirror your own development lifecycle (for example, a Staging environment) you can add it on the settings page of the Knock dashboard.

To create a new environment, go to "Settings" then "Environments". You'll see a button to "Create environment". 

When you create an additional environment, it will be inserted between Development and Production. This means all changes will be continue to be introduced in your Development environment and will be promoted through additional environments until they land in Production.

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

We recognize the importance of protecting your sensitive data, so we designed Knock from the ground-up with privacy and security in mind.

There are two tools you can use to control access to your data in the Knock dashboard:

- [Roles and permissions.](/manage-your-account/roles-and-permissions) Knock offers granular roles for the different functions your team members may want to carry out in Knock, such as support team members that need to debug issues for customers but shouldn't be making changes to notification logic.
- [Customer data obfuscation.](/manage-your-account/data-obfuscation) You can use our per-environment data obfuscation controls to configure whether you want your team members to be able to view customer data in the Knock dashboard.

## Account and environment variables

You can use variables to set global values to use across your workflows and layouts. Variables can be defined at the account-level in Knock, meaning they apply across all workflows, or can be defined/overridden at the environment-level. When a variable is defined, it is available under the `vars` namespace in any notification templates where you want to use it.

[Read more about variables](/send-and-manage-data/variables)
