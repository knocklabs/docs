---
title: Using Knock with Postman
---

Our Postman collection is a good way to get familiar with the Knock API. Here's how to get started. 

In this guide you'll fork the Knock collection into your Postman workspace and create Postman environments that map to your environments in Knock.

## For the Knock Postman collection
1. Install [Postman](https://www.postman.com/downloads/) if you don't have it already.
2. [Fork the Knock API Postman collection](https://god.gw.postman.com/run-collection/10721026-cd261902-9249-4714-b7d3-896c15987fa5?action=collection%2Ffork&collection-url=entityId%3D10721026-cd261902-9249-4714-b7d3-896c15987fa5%26entityType%3Dcollection%26workspaceId%3De0ad9a88-e3dd-462b-8c44-695c9c10b8e5#?env%5BKnock%20environment%20template%5D=W3sia2V5IjoiYmFzZV91cmwiLCJ2YWx1ZSI6Imh0dHBzOi8vYXBpLmtub2NrLmFwcCIsImVuYWJsZWQiOnRydWV9LHsia2V5Ijoic2VjcmV0X2tleSIsInZhbHVlIjoiIiwiZW5hYmxlZCI6dHJ1ZX1d). We recommend forking the collection (as opposed to creating a copy) so that you can pull changes we make to the source collection. 


## Configure your Knock environments in Postman
We recommend creating a Postman environment for each of the environments you're using in Knock. This way you can store environment-level variables (such as API keys) and easily switch between environments without having to update your endpoint parameters. 

1. Navigate to the "Environments" section in Postman. You should see an environment named "Knock environment template". 
2. Duplicate the template so you have one environment in Postman for every environment you use in Knock. 

Once your environments are in place in Postman, grab the secret key from their corresponding environment in Knock and add it to the environment's secret key variable in Postman. 

You're all set to send requests to the Knock API from your Postman workspace. 

