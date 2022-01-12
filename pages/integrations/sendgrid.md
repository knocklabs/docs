---
title: How to send email with SendGrid
---

In this guide we’ll cover how to start sending emails through your SendGrid account using Knock. 

## Connect SendGrid to Knock

Head to the “Channels” page in the Knock dashboard and click “Create channel” to create a new SendGrid channel in your account. 

Once the channel is created, click into it to configure SendGrid for each of your Knock environments. 

Here are a few things to note as you configure your SendGrid provider:

- **API key.** At a minimum, Knock needs an API key with full access to the **Mail Send** permission. If you’re looking to support delivery tracking, you’ll need to provide Knock with a SendGrid API key that includes read access to the Email Activity permission. (Note: email activity requires [a SendGrid paid add-on](https://sendgrid.com/solutions/add-ons/30-days-additional-email-activity-history/).)
- **Check delivery status.**  If enabled, you can go to the email activity page in SendGrid to check the delivery status of a given email.
- **Enable email open tracking.** If enabled, you can go to the email activity page in SendGrid to check the open status of a given email.
- **Enable email link tracking.** If enabled, you can go to the email activity page in SendGrid to check the link open status of a given email.

If you choose to enable open and link tracking, please keep user privacy top of mind and follow the privacy guidelines outlined in [SendGrid’s documentation](https://docs.sendgrid.com/ui/account-and-settings/tracking). 

And that’s it. You’ll see the normal email provider configurations for "from email address" and "from name", as well as any environment defaults you want to send for email recipient fields.