const languages = {
  node: `
import Knock from "@knocklabs/node";
import fs from "fs";

const knock = new Knock({ bearerToken: process.env.KNOCK_API_KEY });

const fileContent = fs
  .readFileSync(\`${__dirname}/attachment.pdf\`)
  .toString("base64");

knock.workflows.trigger("invoice-paid", {
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

client.workflows.trigger(
    key="invoice-paid",
    recipients=recipient_ids,
    data={
        "attachments": [
            {
                "name": "Invoice.pdf",
                "content_type": "application/pdf",
                "content": file_contents
            }
        ]
    }
)
`,
  ruby: `
require "knockapi"

knock = Knockapi::Client.new(bearer_token: "sk_12345")

knock.workflows.trigger("invoice-paid",
  recipients: recipient_ids,
  data: {
    attachments: [
      {
        name: "Invoice.pdf",
        content_type: "application/pdf",
        content: file_contents
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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
	"github.com/knocklabs/knock-go/param"
)
ctx := context.Background()
knockClient := knock.NewClient(option.WithBearerToken("sk_12345"))

params := knock.WorkflowTriggerParams{
  Data: map[string]interface{}{
    "attachments": []map[string]interface{}{
      {
        "name": "Invoice.pdf",
        "content": fileContents,
        "content_type": "application/pdf"
      }
    },
  },
  Recipients: make([]knock.RecipientRequestUnionParam, len(recipientIds)),
}

for i, r := range recipientIds {
  params.Recipients[i] = r
}

result, _ := knockClient.Workflows.Trigger(ctx, "invoice-paid", params)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.workflows.WorkflowTriggerParams;
import java.util.List;
import java.util.Map;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

var result = client.workflows().trigger(
    WorkflowTriggerParams.builder()
        .key("invoice-paid")
        .recipients(recipientIds)
        .data(data -> {
            data.put("attachments", List.of(
                Map.of(
                    "name", "Invoice.pdf",
                    "content", fileContents,
                    "content_type", "application/pdf"
                )
            ));
            return data;
        })
        .build()
);
`,
};

export default languages;
