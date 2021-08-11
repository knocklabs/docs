---
title: Setting preferences
---

You can read more about modeling preferences and preferences in general in the [Modeling Preferences](/send-and-manage-data/preferences) guide.

## Backend integration

In the following examples you'll see how to integrate preferences into your backend codebase:

### Getting the users preferences

You can retrieve the users preferences using the `preferences.get` method. Please note,
that even if the preferences are not set for the user you will receive a `PreferenceSet` back (which will be empty).

```javascript Get preferences
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

// Retrieves the `PreferenceSet` for the user given
const preferences = await knockClient.preferences.get("jhammond");
```

### Setting the users preferences

You can update a users entire preference set using the `preferences.set` method. This will
overwrite any existing preferences set for the user:

```javascript Set preferences
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

await knockClient.preferences.set("jhammond", {
  channel_types: { email: true, sms: false },
  workflows: {
    "dinosaurs-loose": {
      channel_types: {
        email: false,
        in_app_feed: true,
        sms: true,
      },
    },
  },
});
```

### Client integration

The preference API can also be invoked from the front-end, providing you have authenticated a user
first and have a valid API token. Please note: only the current users preferences can be set
from the client.

### Retrieving the preferences for the current user

```javascript Get preferences
import Knock from "@knocklabs/client";
const knockClient = new Knock("sk_12345");

knockClient.authenticate(currentUser.id, currentUser.knockToken);

// Retrieves the `PreferenceSet` for the user given
const preferences = await knockClient.preferences.get();
```

### Setting the preferences for the current user

Preferences can also be updated from the client:

```javascript Setting preferences
import Knock from "@knocklabs/client";
const knockClient = new Knock("sk_12345");

knockClient.authenticate(currentUser.id, currentUser.knockToken);

// Set the entire preference object
await knockClient.preferences.set({
  channel_types: {
    email: true,
  },
  workflows: {
    "dinosaurs-loose": {
      channel_types: {
        email: false,
        in_app_feed: true,
        sms: true,
      },
    },
  },
});

// Update an individual channel type
await knockClient.preferences.setChannelType("email", true);

// Update an individual workflow
await knockClient.preferences.setWorkflow("dinosaurs-loose", {
  channel_types: { email: true },
});
```
