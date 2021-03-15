---
title: Integrating via Segment
---

One of the simplest ways to get notifications flowing into Knock is to setup Knock as a Segment
destination. What this means is that all events from Segment will be routed to Knock and you can
use those events and identify calls to start powering your notifications.

## Enabling the integration

Our Knock Segment destination is coming soon. In the meantime you can setup a Webhook from Segment
to start routing events into Knock.

[Please contact us if you'd like to get this setup](mailto:support@knock.app)

## Caveats

There are a few caveats when integrating via Segment that you should be aware of:

- We will sync all groups into Knock as lists, but removing users from lists will require a call
  via the Knock SDK or API.
- If you have properties used in your events that you don't wish to be received by your other Segment
  destinations you will need to manually set up exclusions on each destination.
