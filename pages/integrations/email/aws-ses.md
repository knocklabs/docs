---
title: How to send email with AWS SES
tags: ["simple email service"]
---

Here's how to configure AWS SES for use with Knock.

You'll need to take the following steps in AWS before you can configure your SES channel within Knock.

1. **Configure an AWS SES IAM user with send permissions.** You'll use the access keys of this user to integrate with SES from the Knock dashboard.
2. **Verify a "From" address within AWS.** You'll need to do this before sending emails via SES through Knock.

Once you've completed both of those steps, you'll be able to configure an AWS SES channel in the Knock dashboard under the "Channels" page.

## Configure an AWS SES API key

To send notifications via AWS SES, Knock requires the **access key ID** and a **secret access key** of an AWS user with SES send permissions. (Specifically, the `ses:SendEmail` and `ses:SendRawEmail` permissions.)

If you don't already have a user with send permissions, you can create an Identity Access and Management (IAM) user in AWS to use with the Knock API. You can learn more about creating IAM users in AWS [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_users_create.html).

Once you've created your new IAM user, you'll need to provision them with the policy below.

```json IAM user policy
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["ses:SendEmail", "ses:SendRawEmail"],
      "Resource": "*"
    }
  ]
}
```

Now that you have an AWS user created and provisioned with SES send access, grab the **access key ID** and a **secret access key** of the user—we'll use these later when configuring the SES channel within Knock.

## Verify a "From" address within AWS SES

Next, you'll need to verify the **"From" email address** you plan on using to send emails with AWS if you haven't already. To do so, follow the steps outlined in AWS's guide to [creating and verifying an email address identity](https://docs.aws.amazon.com/ses/latest/dg/creating-identities.html#verify-email-addresses-procedure).

## Configuring SES in Knock

Now that you have you SES access key ID, secret access key, and verified "From" address, you're ready to configure your SES channel within Knock.

Here are a few other things to keep in mind once you have your SES channel configured in Knock:

- **SES sandbox mode.** By default, AWS places all new accounts in the SES sandbox. While your account is in the sandbox, you can only send emails to verified email address—keep this in mind if you're testing in development before you've moved your account out of the SES sandbox. For more information on the SES sandbox and how to move your account out of it, see the [SES sandbox documentation](https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html).
- **Deliverability tracking.** We cannot currently track deliverability through SES channels. This means that all notifications sent through SES will show up as "Sent" in the Knock messages log, but not "Delivered".
