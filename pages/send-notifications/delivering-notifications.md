---
title: Delivering notifications
description: Knock powers in-app and out-of-app notifications to email, SMS, push, and chat channels like Slack.
tags: ["delivery", "channels"]
section: Send notifications
---

You can use Knock to power both in-app and out-of-app notifications.

## In-app notification support

The Knock [Feed API](/reference#feeds) gives developers a way to deliver in-app notifications to feeds, inboxes, and other notification-based experiences.

There are a few ways to power in-app notifications in your product using Knock:

- **Use our [React notification feed component](https://github.com/knocklabs/react-notification-feed).** The Knock notification feed component provides real-time updates, pagination, badge behavior, filtering, and more. It's a great way to quickly add an in-app feed to your product if you use React.
- **Leverage our [client-side JS SDK](https://github.com/knocklabs/knock-client-js).** This is a good approach if you need to use a component library outside of React JS but are still in the JS ecosystem.
- **Integrate with our [API directly](/reference#feeds).** If you're not working within the JS ecosystem in your client, you can integrate directly with the Knock Feed API to power your in-app notifications.

## Out-of-app channel support

We support notification delivery to the following out-of-app channel types: email, push, SMS, and 3rd-party chat apps (such as Slack.) You can see a list of which providers we support within each channel type in the "Channels" page of the Knock dashboard.

With Knock, you can integrate a provider once, and then use it across all of your Knock workflows. If you ever need to switch providers on a given channel, it's as simple as configuring the new provider within the Knock dashboard and updating your workflows to use the new provider.

If you use a provider that we don't currently support, please [get in touch](mailto:support@knock.app).
