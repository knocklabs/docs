---
title: How to send events to an HTTP source to power Knock
description: Learn how to stream events to Knock to power your product notifications.
section: Integrations > Sources
layout: integrations
---

The HTTP source creates a generic event ingestion endpoint that you can use to stream events from your service, or a third-party platform into Knock. The events you stream into the HTTP source can then be used to trigger Knock notification workflows.

Knock can receive any structured event data via the HTTP source, as long as you can format JSON and make an HTTP request from the service that produces or consumes events.

## Getting started

To get started you can create a new HTTP source by going to **Integrations** > **Sources** and clicking "Create source." You'll have the opportunity to name the HTTP source and give it a description.

Once your source is created, you'll have a unique ingestion endpoint per environment to send events to. You can get each environment's endpoint by clicking the "Copy webhook destination URL" button.

## Sending event data

To start sending events to Knock, you'll need to structure a JSON payload that matches the event schema to the ingestion endpoint and submit the request via a `POST` action. A well-formed event payload will be accepted with a `204` response code.

You'll also need to send the following headers with your request:

```txt title="Request headers"
Content-Type: application/json
```

**Please note**: you'll need to send a single event at a time. There's currently no batch event ingestion endpoint.

## Event schema

Your events must be structured as JSON with the following schema:

| Name         | Type              | Description                                                                                                           |
| ------------ | ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| `type`       | string (required) | The type of event to send. Must be set to `track`.                                                                    |
| `event`      | string (required) | The name of the event you're sending to Knock.                                                                        |
| `properties` | map               | A set of properties associated with the event.                                                                        |
| `userId`     | string            | An optional userId to be used as the recipient or actor for the triggered workflow.                                   |
| `messageId`  | string            | An optional unique identifier for the event message, to be used as a deduplication key.                               |
| `timestamp`  | string            | An optional ISO-8601 timestamp indicating when the event occurred. If omitted, will default to the time of ingestion. |

```json title="An example event payload"
{
  "type": "track",
  "event": "My event",
  "properties": {
    "foo": "bar"
  }
}
```

## Triggering workflows from received events

Received events can be configured as workflow triggers directly in the workflow editor. Click on the workflow's trigger step and change the type from "API" to "Source Event." Then you'll be able to select the event and map its properties into the data the workflow needs.

[Read more on configuring workflow triggers](/integrations/sources/overview#workflow-triggers)

## Disabling a trigger

Triggers are automatically enabled when you create them. If you want to stop an event from triggering a workflow, you can go to the trigger page and toggle its status to "Inactive." Keep in mind that this will disable that trigger for the current environment only. When you're ready to trigger the workflow again, you can set it back to "Active."

### Mapping workflow trigger properties

When creating workflow triggers from your events, you can optionally configure the schema mapping Knock will use to map your event properties into the corresponding workflow trigger properties.

To target any items under the `properties` key, prefix the schema mapping with `data.propertyKey`. As an example, if you have a property `properties.recipientId` you would map this as `data.recipientId`.

## Debugging events

You can see a log of all of the events received per source under **Developers** > **Sources** in the Knock dashboard under the "Logs" page for your configured source. You can also see any workflow triggers that were configured as part of the event ingestion, and any workflow runs that were triggered.

## Frequently asked questions

<AccordionGroup>
  <Accordion title="Can I send identify events through to the HTTP source?">
    No, the HTTP source only accepts events and not user identifies. Please use
    the [user identify API](/concepts/users) instead.
  </Accordion>
  <Accordion title="Can I identify recipients inline via track events that I send to the HTTP source?">
    Yes. You can use inline identification with the source events that you send
    to Knock according to the instructions
    [here](/integrations/sources/overview#inline-identify-users-in-a-source-event).
    You'll need to ensure that the schema mapping for your event maps the
    **Recipients** of your workflow to the same field where you provide the
    recipient object.
  </Accordion>
  <Accordion title="What's the rate limit Knock supports on the events endpoint?">
    There's no rate limit for the event ingestion endpoint, but we ask that if
    you're going to be sending more than 1,000 events per second you reach out
    to us first so that we can provision additional capacity.
  </Accordion>
  <Accordion title="Do you support ingesting batches of events?">
    Currently, no; the HTTP endpoint only accepts single events at a time.
  </Accordion>
</AccordionGroup>
