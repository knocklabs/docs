---
title: Connecting Knock to your Vercel account
description: Learn more about how to connect Knock with your Vercel account.
layout: integrations
tags: ["vercel", "extensions"]
section: Integrations > Extensions
---

You can use the Knock + Vercel integration to easily synchronize your Knock API keys to one or more Vercel projects. You'll find the Knock Vercel integration in the [Vercel marketplace](https://vercel.com/integrations/knock) for you to install.

## What this integration does

The integration will set the following environment variables against your selected Vercel projects:

- `KNOCK_API_KEY`: Set to your Knock secret key (starts with `sk_`)
- `KNOCK_PUBLIC_API_KEY`: Set to your Knock public key (starts with `pk_`)

Your environment variables will be set with the following Vercel project target mappings. You can read more about environment variables within Vercel [in the documentation](https://vercel.com/docs/concepts/projects/environment-variables#environments).

| Knock environment | Vercel project target       |
| ----------------- | --------------------------- |
| Development       | `["development"]`           |
| Production        | `["preview", "production"]` |

### Framework-specific environment variables

For certain frameworks, we'll attempt to set the prefix of the `KNOCK_PUBLIC_API_KEY` on your behalf to ensure that the variable is then exposed in browser / client-side environments.

Currently we offer support for:

- `nextjs`
- `blitzjs`
- `create-react-app`
- `nuxtjs`
- `vue`
- `gatsby`
- `sveltekit`

## Installing the integration

1. Click "Add integration" on the [Vercel integrations page](https://vercel.com/integrations/knock)
2. Select the Vercel account you want to connect with
3. Sign into an existing Knock account, or create a new Knock account
4. Select the Vercel projects that you wish to connect to your Knock account
5. Click "Continue"
6. Back in your Vercel dashboard, confirm the environment variables were added by going to your **Vercel project** > **Settings** > **Environment variables**

## Uninstalling the integration

You can manage the Knock Vercel integration in your Vercel dashboard under the **Integrations** tab. From there you can remove the specific integration installation from your Vercel account.

**Please note**: removing an integration will delete the corresponding API keys set by Knock in your Vercel project(s).
