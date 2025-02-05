---
title: Knock's features
description: Explore Knock's key features for building notification systems, including multi-channel delivery, workflow orchestration, and preference management.
tags: ["getting started"]
section: Getting started
---

Here's an overview of the core features of Knock and how you can leverage them in the notification system you design with our product.

## Cross-channel orchestration logic

At the heart of Knock is our workflow engine. With it you can configure workflows that manage complex orchestration
logic for your notifications such as:

- Sequence cross-channel delivery based on the read status of sibling notifications (e.g. only send to the email channel if all other channels are still marked as unread)
- Time-based delays (seconds, minutes, hours)
- Batching together notifications of the same content type into a single update (e.g. "Chris left 5 comments on Star Trek Fan Fiction VIII")

## In-app notification feeds

A great in-app notification feed helps your users find where their attention is needed in your product, in real-time.

Knock offers out-of-the-box support for in-app feed functionality. Our pre-built components give you a fully featured in-app feed you can drop into your frontend in minutes, with support for real-time delivery, accurate badge counts, and mark-as-read functionality. If you need to customize your experience, you can use our SDKs and API to build your own feed component.

You can add Knock's in-app feed channel to any workflow to immediately start routing notifications to your users' in-app feed experience.

## Notification preferences

Users expect a notifications experience they can tailor to the way they want to work. We provide an out-of-the-box component you can customize to give your users the notification preferences they want.

If you'd prefer to own this experience, you can use our APIs to synchronize your user
preferences to the Knock model, in which case we'll still leverage those preferences to route notifications to users.

## Notification rollout management

Knock is designed with the needs of teams of all sizes in mind. We provide logically separated
environments, version control, and a full audit log to aid in the introduction of new
notifications and the management of existing ones.

## Comprehensive logging

All notifications sent with Knock are logged for 90 days. This includes data about who was
sent a notification, why they were sent it, and what actions they performed on the notification
(opens, clicks, reads, etc).

## Security & privacy

We understand the importance of keeping your user and notification data safe. That's why we built Knock with security in mind from day one. You can learn more about [our security practices here](/security).
