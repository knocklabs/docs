---
title: Knock's features
description: An overview of what you can build with Knock across transactional, lifecycle, and in-product messaging, and how engineering, product, and growth teams work together in it.
tags: ["getting started"]
section: Getting started
---

Knock is product and customer messaging infrastructure. Engineering, product, and growth teams use one platform to send transactional messages, run lifecycle and marketing campaigns, and deliver in-product messaging. Developers integrate Knock through the API, SDKs, and CLI. Non-technical teammates manage content, targeting, sends, and measurement in the Knock dashboard.

## Features at a glance

| What you need | Knock feature | Who typically manages it |
| --- | --- | --- |
| Event-driven transactional messages | [Workflows](/concepts/workflows) | Engineering, product |
| Onboarding, engagement, and retention sequences | [Workflows](/concepts/workflows) triggered by events or [audience](/concepts/audiences) entry | Product, growth |
| One-time announcements, campaigns, and newsletters | [Broadcasts](/concepts/broadcasts) | Marketing, growth |
| User segments | [Audiences](/concepts/audiences), static or dynamic | Growth, marketing, data |
| In-product banners, paywalls, tours, and announcements | [Guides](/concepts/guides) | Product, growth (UI by engineering) |
| In-app inbox and toasts | [In-app feeds](/integrations/in-app/overview) | Engineering |
| Outcome measurement | [Goals](/concepts/goals) with attribution | Growth, product |
| A/B tests | [Experiment function](/designing-workflows/experiment-function) | Growth, product |
| Engagement reporting | [Analytics](/send-notifications/analytics) and data warehouse sync | Everyone |

## Transactional messaging

At the heart of Knock is the workflow engine. Workflows model cross-channel messaging logic while respecting each user's preferences:

- **Cross-channel orchestration.** Send to email, SMS, push, chat (Slack, Microsoft Teams, Discord, WhatsApp), and in-app from one workflow. Use step conditions to sequence delivery, for example only sending an email if the in-app message has not been seen.
- **Function steps.** Batch activity into digests, delay, throttle, branch on data, wait for an event, fetch external data, or run an AI agent step.
- **Flexible triggers.** Trigger workflows from the API and SDKs, from a CDP source like Segment, on a schedule, or when a user joins an audience.
- **Bring your providers.** Send through the providers you already use, such as SendGrid, Postmark, Amazon SES, Twilio, APNs, and Firebase Cloud Messaging.
- **Preferences.** Use the hosted or a custom preference center. Knock enforces user preferences on every workflow run and broadcast.
- **Multi-tenancy.** Apply per-tenant branding, translations, and preferences for B2B products.

## Lifecycle and marketing messaging

Knock workflows and broadcasts cover lifecycle and marketing use cases alongside transactional ones, so you can manage them with the same templates, preferences, and data.

- **Lifecycle workflows.** Build onboarding sequences, engagement campaigns, and retention flows. Start them when a user enters an audience, and use wait-for-event and branch steps to react to what users do.
- **Broadcasts.** Send one-time messages, such as product announcements, marketing campaigns, and newsletters, from the dashboard to an audience, to all users, or to a CSV upload. Broadcasts can have several steps: send an in-app message, wait, then follow up by email depending on whether the user engaged. Schedule a send for later, personalize by tenant, and run experiments inside the broadcast.
- **Audiences.** Build static audiences from a reverse ETL tool (Hightouch, Census), CSV, the API, or the dashboard. Build dynamic audiences from query rules on user properties, and Knock updates their membership in real time. Workflows, broadcasts, and guides all use the same audiences.
- **Templates without a deploy.** Edit messages in a drag-and-drop editor with Liquid, partials, branding, and translations. Teams can change copy without a code change.
- **Compliance.** Commercial unsubscribe adds a one-click unsubscribe header and link to marketing email to support CAN-SPAM compliance.

## In-product messaging

- **Guides.** Power in-app banners, paywalls, announcements, onboarding flows, and feature tours with your own components and design system. Engineering builds the UI once. Content teams manage copy, targeting, and activation rules in the dashboard. Guides react to runtime data, so you can show a guide only when it is relevant to what the user is doing.
- **In-app feeds and toasts.** Drop in prebuilt feed components with real-time delivery, accurate badge counts, and mark-as-read, or build your own with the SDKs and API.

## Measurement and optimization

- **Analytics.** The analytics page shows message volume, delivery, and engagement across workflows, guides, and channels. Each workflow and broadcast has its own analytics tab with metrics per step. Guides report audience, seen, interacted, and archived counts.
- **Goals with attribution.** Define outcomes that matter to the business, such as "Customer activated", from integration source events (for example Segment, Stripe, or PostHog) or from users entering or leaving a dynamic audience. Attach a goal to a workflow, broadcast, or guide, and Knock credits each completion to the most recent message within an attribution window you set (1 to 30 days, 7 by default).
- **Experiments.** Add an experiment step to a workflow or broadcast to split recipients into percentage-based cohorts for A/B testing. A given cohort key always lands in the same cohort.
- **Your data, your stack.** Stream message and engagement data to your data warehouse, CDP and analytics tools (Segment, Heap), observability tools (Datadog, New Relic), and outbound webhooks.

## Team operations and governance

Knock is designed with the needs of teams of all sizes in mind. Logically separated environments, branches, version control, and a full audit log help you introduce new messaging and manage existing messaging safely. Roles and permissions, SAML SSO, and directory sync (SCIM) control who can edit and send. Every message is logged with who received it, why, and how they engaged (opens, clicks, reads), for your account's data retention period.

Knock also works with AI tooling. The Knock agent, MCP server, CLI, and plugins for Cursor and Claude let teams build and update messaging from the tools they already use.

## Current limits

We want this page to be accurate about what Knock does not do yet:

- **Broadcasts** are sent from the dashboard. They cannot be triggered through the API or managed with the CLI. They go to users only (not objects), recipients must be identified in Knock (a CSV upload identifies them automatically), and CSV uploads are capped at 10MB.
- **Dynamic audiences** are built from user properties only. Tenant and object data are not supported yet. You cannot change an audience's type after you create it.
- **Goals** allow one goal per messaging resource. Goal conditions support integration source events and dynamic audience entry or exit. Static audiences, changes to recipient properties, and tenant properties are not supported. A goal completion cannot cancel an in-flight workflow run, and goals cannot be promoted between environments.
- **Setup** needs a developer at the start: identifying users, connecting data sources, and rendering in-app components. After that, non-technical teams can run day-to-day messaging in the dashboard.

## Frequently asked questions

**Is Knock only for transactional notifications?**
No. Knock covers transactional messaging, lifecycle and marketing campaigns through workflows and broadcasts, and in-product messaging through guides, all on one platform.

**Can marketing and growth teams use Knock without engineering?**
Yes, once Knock is set up. Marketing and growth teams can build audiences, edit templates, send and schedule broadcasts, manage guide content and targeting, and track goals in the dashboard. The initial integration needs engineering.

**How do I measure whether a campaign worked?**
Use analytics for delivery and engagement, attach a goal to measure the business outcome the message drove, and add an experiment step to compare variants.

## Security and privacy

We understand the importance of keeping your user and notification data safe. That's why we built Knock with security in mind from day one. You can learn more about [our security practices here](/security).
