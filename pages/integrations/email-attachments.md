---
title: Email attachments
---

## How attachments work in Knock

1. Set the attachment key in your email template to tell Knock how to resolve your attachments from your data payload.
2. Include one or more attachment objects in the `data` payload for your notify call. Each attachment object should have the content of the file to be attached as a base64 encoded value.
3. Your attachment will be automatically added to your call to your email provider 🎉.

## The attachment object

Every attachment you send to Knock in your `data` payload should have the following properties:

| Property       | Description                                  |
| -------------- | -------------------------------------------- |
| name\*         | The name of the file                         |
| content_type\* | A mime type for the file                     |
| content\*      | The base64 encoded file content (up-to 10mb) |

```js An example attachment object
{
  name: "my-file.txt",
  content: myFileContent,
  content_type: "text/plain"
}
```

**Note**: each attachment object must be less than 10mb but there may be lower limits from your email provider.

## Sending attachments in your notify call

Once you've specified your attachment key in your eamil template, the last step is to send the data along to Knock. Remember that you need to base64 encode the contents of the file!

```js Sending attachment data
import { Knock } from "@knocklabs/node";
import fs from "fs";

const knock = new Knock(process.env.KNOCK_API_KEY);

const fileContent = fs
  .readFileSync(`${__dirname}/attachment.pdf`)
  .toString("base64");

knock.notify("a-workflow-with-an-email", {
  recipients: userIds,
  data: {
    attachments: [
      {
        name: "Invoice.pdf",
        content_type: "application/pdf",
        content: fileContent,
      },
    ],
  },
});
```

**Note**: you can send multiple attachments for an email by including an array of attachment objects under your attachment key in your data payload.

## Handling a different attachment per recipient

If you need to send a different attachment per recipient in a workflow then you'll need to make one notify call per recipient, such that the data payload is unique to that recipient.

```js Unique attachments per recipient
import { Knock } from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_API_KEY);

const filesAndRecipients = [
  { id: "user-1", file: user1FileContents },
  { id: "user-2", file: user2FileContents },
];

filesAndRecipients.forEach(({ id, file }) => {
  knock.notify("my-workflow", {
    recipients: [id],
    data: {
      attachment: {
        name: "Invoice.pdf",
        content_type: "application/pdf",
        content: file,
      },
    },
  });
});
```
