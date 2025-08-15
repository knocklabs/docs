---
title: Using Knock with Postman
description: A Postman collection for the Knock API.
tags: ["postman", "api", "getting started"]
section: Getting started
---

Our Postman collection is a good way to get familiar with the Knock API. Here's how to get started.

This page walks through forking the Knock collection into your Postman workspace and creating Postman environments that map to your environments in Knock.

## For the Knock Postman collection

1. Install [Postman](https://www.postman.com/downloads/) if you don't have it already.
2. [Fork the Knock API Postman collection](https://god.gw.postman.com/run-collection/10721026-cd261902-9249-4714-b7d3-896c15987fa5?action=collection%2Ffork&collection-url=entityId%3D10721026-cd261902-9249-4714-b7d3-896c15987fa5%26entityType%3Dcollection%26workspaceId%3De0ad9a88-e3dd-462b-8c44-695c9c10b8e5#?env%5BKnock%20environment%20template%5D=W3sia2V5IjoiYmFzZV91cmwiLCJ2YWx1ZSI6Imh0dHBzOi8vYXBpLmtub2NrLmFwcCIsImVuYWJsZWQiOnRydWV9LHsia2V5Ijoic2VjcmV0X2tleSIsInZhbHVlIjoic2tfdGVzdF94eHh4IiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJwdWJsaWNfa2V5IiwidmFsdWUiOiJwa190ZXN0X3h4eHgiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6IndvcmtmbG93X2tleSIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJyZWNpcGllbnRfdXNlcl9pZCIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJhY3Rvcl91c2VyX2lkIiwidmFsdWUiOiIiLCJlbmFibGVkIjp0cnVlfSx7ImtleSI6ImZlZWRfaWQiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoidXNlcl9pZCIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJ1c2VyX25hbWUiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoidXNlcl9lbWFpbCIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX0seyJrZXkiOiJ1c2VyX2F2YXRhcl91cmwiLCJ2YWx1ZSI6IiIsImVuYWJsZWQiOnRydWV9LHsia2V5IjoicHJlZmVyZW5jZV9zZXRfaWQiLCJ2YWx1ZSI6ImRlZmF1bHQiLCJlbmFibGVkIjp0cnVlfV0=). We recommend forking the collection (as opposed to creating a copy) so that you can pull changes we make to the source collection.
   - We provide a separate [Management API Postman collection](https://www.postman.com/knock-labs/workspace/knock-public-workspace/collection/15616728-9ed6000c-13bc-43f5-a2cf-db6daea256bd?action=share&creator=15616728&active-environment=15616728-6df39335-c6f9-4c9d-99d5-73e3c7ffe524). You can use use this to test our [Management API](https://docs.knock.app/mapi#overview).

## Configure your Knock environments in Postman

We recommend creating a Postman environment for each of the environments you're using in Knock. This way you can store environment-level variables (such as API keys) and easily switch between environments without having to update your endpoint parameters.

1. Navigate to the "Environments" section in Postman. You should see an environment named "Knock environment template."
2. Duplicate the template so you have one environment in Postman for every environment you use in Knock.

Once your environments are in place in Postman, grab the secret key from their corresponding environment in Knock and add it to the environment's secret key variable in Postman.

You're all set to send requests to the Knock API from your Postman workspace.
