const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
import fs from "fs";

const knock = new Knock(process.env.KNOCK_API_KEY);

const fileContent = fs
  .readFileSync(\`${__dirname}/attachment.pdf\`)
  .toString("base64");

knock.notify("invoice-paid", {
  recipients: recipientIds,
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
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.notify(
  key="invoice-paid",
  recipients=recipient_ids,
  data={
    "attachments": [
      {
        "name": "Invoice.pdf",
        "content_type": "application/pdf",
        "content": file_contents,
      }
    ]
  }
)
`,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

Knock::Workflows.trigger(
  key: "invoice-paid",
  recipients: recipient_ids,
  data: {
    attachments: [
      {
        name: "Invoice.pdf",
        content_type: "application/pdf",
        content: file_contents,
      }
    ]
  }
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var attachments = new List<Dictionary> {
  new Dictionary<string, object> {
    { "name", "Invoice.pdf" },
    { "content_type": "application/pdf" },
    { "content", fileContents }
  }
}

var workflowTriggerOpts = new TriggerWorkflow {
  Data = new Dictionary<string, object>{
    {"attachments", attachments}
  },
  Recipients = recipientIds,
};

var result = await knockClient.Workflows.Trigger("invoice-paid", workflowTriggerOpts)
`,
  elixir: `
knock_client = MyApp.Knock.client()  

Knock.Workflows.trigger("invoice-paid", %{
  data: %{
    attachments: [
      %{
        name: "Invoice.pdf",
        content_type: "application/pdf",
        content: file_contents,
      }
    ]
  },
  recipients: recipient_ids,
})
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->workflows()->trigger('invoice-paid', [
  'data' => [
    'attachments' => [
      'name' => 'Invoice.pdf',
      'content_type' => 'application/pdf',
      'content' => $fileContents
    ]
  ],
  'recipients' => $recipient_ids,
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

result, _ := knockClient.Workflows.Trigger(ctx, &knock.TriggerWorkflowRequest{
  Workflow:   "invoice-paid",
  Recipients: recipientIds,
  Data: map[string]interface{}{
    "attachments": []map[string]interface{
      {
        "name": "Invoice.pdf",
        "content": fileContents,
        "content_type": "application/pdf"
      }
    },
  },
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

WorkflowTriggerRequest workflowTrigger = WorkflowTriggerRequest.builder()
    .key("invoice-paid")
    .recipients(recipientIds)
    .data("attachments", List.of(
      Map.of(
        "name", "Invoice.pdf",
        "content", fileContents,
        "content_type", "application/pdf"
      )
    ))
    .build();

WorkflowTriggerResponse result = client.workflows().trigger(workflowTrigger);
`,
};

export default languages;
