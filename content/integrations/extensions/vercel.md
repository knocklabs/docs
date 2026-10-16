---
title: Connecting Knock to your Vercel account
description: Learn more about how to connect Knock with your Vercel account.
layout: integrations
tags: ["vercel", "extensions"]
section: Integrations > Extensions
---

You can use the Knock + Vercel integration to easily synchronize your Knock API keys to one or more Vercel projects. You'll find the Knock Vercel integration in the <a href="https://vercel.com/integrations/knock" target="_blank" rel="noopener">Vercel marketplace</a> for you to install.

<Callout type="warning" title="Enable environments before you install." text={<>We recommend <a href="/version-control/environments#enable-environments">enabling environments</a> before you install this integration, so that your Vercel development target maps to your Knock development environment.</>} />

## What this integration does

The integration will set the following environment variables against your selected Vercel projects:

- `KNOCK_API_KEY`: Set to your Knock secret key (starts with `sk_`)
- `KNOCK_PUBLIC_API_KEY`: Set to your Knock public key (starts with `pk_`)

Your Vercel environment variables will be set with the following project target mappings. You can read more about environment variables within Vercel <a href="https://vercel.com/docs/concepts/projects/environment-variables#environments" target="_blank" rel="noopener">in their documentation</a>.

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

1. Click "Add integration" on the <a href="https://vercel.com/integrations/knock" target="_blank" rel="noopener">Vercel integrations page</a>
2. Select the Vercel account you want to connect with
3. Sign into an existing Knock account, or create a new Knock account
4. Select the Vercel projects that you wish to connect to your Knock account
5. Click "Continue"
6. Back in your Vercel dashboard, confirm the environment variables were added by going to your **Vercel project** > **Settings** > **Environment variables**

## Uninstalling the integration

You can manage the Knock Vercel integration in your Vercel dashboard under the **Integrations** tab. From there you can remove the specific integration installation from your Vercel account.

**Please note**: removing an integration will delete the corresponding API keys set by Knock in your Vercel project(s).
