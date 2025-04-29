const languages = {
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.workflows.trigger(
    key="new-comment",
    recipients=["1", "2"]

    # optional
    data={ "project_name": "My Project" },
    actor="3",
    cancellation_key="cancel_123",
    tenant="jurassic_world_employees"
)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

client.workflows.trigger(
  key: "new-comment",
  recipients: ["1", "2"],

  # optional
  data: { project_name: "My Project" },
  actor: "3",
  cancellation_key: "cancel_123",
  tenant: "jurassic_world_employees"
)
`,
  csharp: `
var knockClient = new KnockClient(
    new KnockOptions { ApiKey = "sk_12345" }
);

var workflowTriggerOpts = new TriggerWorkflow {
  Recipients = new List<string>{"1", "2"}

  // optional
  Data = new Dictionary<string, string>{
    {"project_name", "My Project"}
  },
  Actor = "3",
  CancellationKey = "cancel_123",
  Tenant = "jurassic_world_employees"
};

var result = await knockClient.Workflows.Trigger("new-comment", workflowTriggerOpts)
`,
  curl: `
curl -X POST 'https://api.knock.app/v1/workflows/new-comment/trigger' \\
  -H 'Authorization: Bearer sk_test_12345' \\
  -H 'Content-Type: application/json' \\
  -H 'Idempotency-Key: 123' \\
  -d '{
        "recipients": ["1", "2"],
        "data": {
          "project_name": "My Project"
        },
        "actor": "3",
        "cancellation_key": "cancel_123",
        "tenant": "jurassic_world_employees"
      }'
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({ bearerToken: process.env.KNOCK_API_KEY });

await knock.workflows.trigger("new-comment", {
  recipients: ["1", "2"],

  // optional
  data: { "project_name": "My Project" },
  actor: "3",
  cancellation_key: "cancel_123",
  tenant: "jurassic_world_employees"
});
`,
  javascript: `
// You can use "javascript" when you don't want to make your JS example Node-specific

const knock = new Knock({ bearerToken: process.env.KNOCK_API_KEY });

await knock.workflows.trigger("new-comment", {
  recipients: ["1", "2"],

  // optional
  data: { "project_name": "My Project" },
  actor: "3",
  cancellation_key: "cancel_123",
  tenant: "jurassic_world_employees"
});
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.workflows.WorkflowTriggerParams;
import java.util.Map;
import java.util.Arrays;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

var result = client.workflows().trigger(
    WorkflowTriggerParams.builder()
        .key("new-comment")
        .addRecipient("1")
        .addRecipient("2")
        .data(data -> {
            data.put("project_name", "My Project");
            return data;
        })
        .actor("3")
        .cancellationKey("cancel_123")
        .tenant("jurassic_world_employees")
        .build()
);
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
  Recipients: []knock.RecipientRequestUnionParam{"1", "2"},
  Data: map[string]interface{}{"project_name": "My Project"},
  Actor: "3",
  CancellationKey: "cancel_123",
  Tenant: "jurassic_world_employees",
}

result, _ := knockClient.Workflows.Trigger(ctx, "new-comment", params)
`,
};

export default languages;
