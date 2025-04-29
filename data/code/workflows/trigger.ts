const languages = {
  curl: `
curl -X POST https://api.knock.app/v1/workflows/new-comment/trigger \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "recipients": ["1", "2"],
        "data": { "project_name": "My Project" },
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
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.workflows.trigger(
    key="new-comment",
    recipients=["1", "2"],
    data={"project_name": "My Project"},
    actor="3",
    cancellation_key="cancel_123",
    tenant="jurassic_world_employees"
)
`,
  ruby: `
require "knockapi"

knock = Knockapi::Client.new(bearer_token: "sk_12345")

knock.workflows.trigger("new-comment",
  recipients: ["1", "2"],
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
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Workflows.trigger("new-comment", %{
  recipients: ["1", "2"]

  # optional
  data: %{project_name: "My Project"},
  actor: "3",
  cancellation_key: "cancel_123",
  tenant: "jurassic_world_employees"
})
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->workflows()->trigger('new-comment', [
  'recipients' => ['1', '2']

  // optional
  'data' => ['project_name' => My Project],
  'actor' => 3,
  'cancellation_key' => 'cancel_123',
  'tenant' => 'jurassic_world_employees'
]);
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
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
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.workflows.WorkflowTriggerParams;
import app.knock.api.models.workflows.WorkflowTrigger;
import java.util.Arrays;
import java.util.Map;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

WorkflowTriggerParams params = WorkflowTriggerParams.builder()
    .key("new-comment")
    .recipients(Arrays.asList("1", "2"))
    .data(Map.of("project_name", "My Project"))
    .actor("3")
    .cancellationKey("cancel_123")
    .tenant("jurassic_world_employees")
    .build();

WorkflowTrigger result = client.workflows().trigger(params);
`,
};

export default languages;
