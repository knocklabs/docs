---
title: Supporting multi-tenancy
---

In this guide we'll look at how to support multi-tenancy within your Knock powered notifications.

## An overview of multi-tenancy

Multi-tenancy is the concept in which your users belong to one or more "tenants", which you may call
an "account", "organization", "workspace", or similar. This is a common pattern in a lot of SaaS applications
today, where a user will have a single profile joined to multiple tenants to represent their membership
within each.

## Multi-tenancy within notifications

Multi-tenancy is important in your notification system when handling in-app feeds. Lets look at an example.
Imagine that we have a SaaS application, Collaborato, where our users can belong to one or more different
workspaces. When one of our users in active in a current workspace, we want to make sure they only
see notifications that are relevant for that workspace. That is, a user in the "Acme Fish Co." workspace
should only see their notifications that are relevant to "Acme Fish Co.".

To support this use-case within Knock, we can pass a `tenant` identifier into our notify calls:

```javascript Notify call with tenant
import Knock from "@knocklabs/node";
const knock = new Knock("sk_example_123456789");

await knock.notify("new-comment", {
  actor: "user_12345",
  recipients: ["user_23456"],
  data: {},
  // Pass in an identifier for the tenant here
  tenant: workspace.id,
});
```

When retrieving our feed to be displayed, we can then scope the feed to only show items relevant
to the tenant:

```jsx Client-side feed scoping
// If you're using our `client-js` SDK:
import Knock from "@knocklabs/client";
const knockClient = new Knock(process.env.KNOCK_PUBLIC_API_KEY);

const feedClient = knockClient.feeds.initialize(process.env.KNOCK_FEED_ID, {
  // Scope all requests to the current workspace
  tenant: currentWorkspace.id,
});

// Or if you're using the React SDK:
<KnockFeedProvider
  apiKey={process.env.KNOCK_PUBLIC_API_KEY}
  feedId={process.env.KNOCK_FEED_ID}
  userId={currentUser.id}
  tenant={currentWorkspace.id}
>
  ...
</KnockFeedProvider>;
```

By providing the `tenant` property here, we're letting Knock know that the notifications produced
in the `notify` call belong to a particular tenant and that when we're showing the feed to our customers
that we **only** want to see the feed that's related to that tenant.

Under the hood Knock will ensure that the badge counts you receive for the feed will be relevant
only to the active workspace, and no real-time notifications will be received for any messages
that aren't relevant to the user.

## Different preferences per tenant

An advanced (and somewhat uncommon) use-case within Knock is also managing different sets of preferences
per user, tenant pair. That is that a user might have different preferences configured for "Acme Fish Co."
than they do for "Bell's Bagels", two hypothetical workspaces within our hypothetical document collaboration app,
Collaborato.

If this is a use-case that you're looking to support with Knock, please [get in touch with us](mailto:support@knock.app) and
we can enable this feature on your account.
