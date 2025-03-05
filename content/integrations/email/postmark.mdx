---
title: How to send email with Postmark
description: How to send transactional email notifications to Postmark with Knock.
section: Integrations > Email
layout: integrations
---

Knock integrates with <a href="https://postmarkapp.com/" target="_blank">Postmark</a> to send email notifications to your users.

In this guide you'll learn how to get started sending transactional email notifications with Postmark through Knock. We also cover provider configuration and additional data you can pass through to Postmark.

## Features

- Attachments support
- Delivery tracking
- Bounce Support
- Knock link and open tracking
- Postmark link and open tracking
- Per environment configuration
- Sandbox mode

## Getting started

You can create a new Postmark channel in the dashboard under the **Integrations** {">"} **Channels** section. From there, you'll need to configure the channel for each environment you have.

## Channel configuration

The following channel settings should be configured per [environment](/concepts/environments). Navigate to **Integrations** > **Channels** in your dashboard, select your Postmark [channel](/concepts/channels), then click "Manage configuration" under the environment that you'd like to configure.

<AccordionGroup>
  <Accordion title="Settings">
    Fields marked with an `*` are required.
    
    **Knock settings**
    <Attributes>
      <Attribute
        name="Sandbox mode"
        type="boolean"
        nameSlug="/integrations/overview#sandbox-mode"
        description="Whether to enable sandbox mode for your Postmark channel."
      />
      <Attribute
        name="Knock open tracking"
        nameSlug="/send-notifications/tracking#email-open-tracking"
        type="boolean"
        description="Whether to enable Knock email-open tracking."
      />
      <Attribute
        name="Knock link tracking"
        nameSlug="/send-notifications/tracking#link-click-tracking"
        type="boolean"
        description="Whether to enable Knock link-click tracking."
      />
    </Attributes>

    **Provider settings for Postmark**
    <Attributes>
      <Attribute
        name="API key"
        type="string*"
        description="The API key for your Postmark server."
      />
      <Attribute
        name="Open tracking"
        type="boolean"
        description="Whether to enable Postmark email-open tracking."
      />
      <Attribute
        name="Link tracking"
        type="boolean"
        description="Whether to enable Postmark link-click tracking."
      />
      <Attribute
        name="From email address"
        type="string | liquid*"
        description="The default sender email address (can use Liquid tags)."
      />
      <Attribute
        name="From name"
        type="string | liquid"
        description="The default sender name (can use Liquid tags)."
      />
    </Attributes>

  </Accordion>
  <Accordion title="Overrides">
    When configured, these optional overrides will apply to all emails sent from this channel in the configured environment. Learn more about email channel overrides [here](/integrations/email/settings).
    
    <Attributes>
      <Attribute
        name="To"
        type="string | liquid"
        description="The To email address that email notifications will be sent to (can use Liquid tags). This value will override the designated recipient's email address."
      />
      <Attribute
        name="Cc"
        type="string | liquid"
        description="The CC email address that email notifications will be sent to (can use Liquid tags)."
      />
      <Attribute
        name="Bcc"
        type="string | liquid"
        description="The BCC email address that email notifications will be sent to (can use Liquid tags)."
      />
      <Attribute
        name="Reply-to"
        type="string | liquid"
        description="The reply-to email address that will be included on email notifications (can use Liquid tags)."
      />
      <Attribute
        name="Payload overrides"
        nameSlug="/integrations/email/settings#provider-json-overrides"
        type="JSON (string) | liquid"
        description="Provide a JSON object to merge into the API payload that is sent to the downstream provider."
      />
    </Attributes>
  </Accordion>
  <Accordion title="Conditions">
    Set optional per-environment [conditions](/integrations/overview#channel-conditions) for this channel. These conditions are evaluated each time a workflow run encounters a step that uses this channel in the configured environment. If the conditions are not met, the step will be skipped.
  </Accordion>
</AccordionGroup>

## Additional data sent

Knock sends the following attributes along with your emails:

- `Metadata.sender`: always set to `knock.app`
- `Metadata.knock_message_id`: the ID of the message this email is associated with
- `Metadata.knock_recipient_id`: the Knock ID of the recipient this email is being sent to
- `Tag`: the key of the workflow this message was generated from

You can learn about the role of these Postmark attributes in the <a href="https://postmarkapp.com/developer" target="_blank">Postmark API documentation</a>.

## Recipient data requirements

In order to send an email notification you'll need a valid `email` property set on your recipient.

## Delivery tracking

Delivery tracking for Postmark can result in the following status updates to your message:

- The message delivery is confirmed and Knock updates the message to `delivered`
- The message was not delivered due to bad recipient(s) and Knock updates the message to `bounced`
