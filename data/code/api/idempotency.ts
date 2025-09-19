const languages = {
  curl: `
curl -X POST https://api.knock.app/v1/workflows/new-comment/trigger \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -H "Idempotency-Key: 123" \\
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
const knock = new Knock({ apiKey: process.env.KNOCK_API_KEY });

await knock.workflows.trigger(
  "new-comment",
  {
    recipients: ["1", "2"],

    // optional
    data: { project_name: "My Project" },
    actor: "3",
    cancellationKey: "cancel_123",
    tenant: "jurassic_world_employees",
  },
  {
    headers: {
      "Idempotency-Key": "123",
    },
  },
);
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
    tenant="jurassic_world_employees",
    extra_headers={"Idempotency-Key": "123"}
)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

client.workflows.trigger(
  key: "new-comment",
  recipients: ["1", "2"],

  # optional
  data: { project_name: "My Project" },
  actor: "3",
  cancellation_key: "cancel_123",
  tenant: "jurassic_world_employees",
  idempotency_key: "123"
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

var methodOpts = new MethodOptions {
  IdempotencyKey = "123"
}

var result = await knockClient.Workflows.Trigger("new-comment", workflowTriggerOpts, methodOpts)
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Workflows.trigger(knock_client, "new-comment", %{
  recipients: ["1", "2"],

  # optional
  data: %{project_name: "My Project"},
  actor: "3",
  cancellation_key: "cancel_123",
  tenant: "jurassic_world_employees"
}, idempotency_key: "123")
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
],
[
  'Idempotency-Key' => '123'
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
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

result, _ := knockClient.Workflows.Trigger(ctx, "new-comment", knock.WorkflowTriggerParams{
	Recipients: param.New([]string{"1", "2"}),
	Data: param.New(map[string]interface{}{
		"project_name": "My Project",
	}),
	Actor:           param.New("3"),
	CancellationKey: param.New("cancel_123"),
	Tenant:          param.New("jurassic_world_employees"),
}, option.WithHeader("Idempotency-Key", "123"))
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.core.RequestOptions;
import app.knock.api.models.workflows.WorkflowTriggerParams;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

RequestOptions requestOptions = RequestOptions.builder()
    .putAdditionalHeader("Idempotency-Key", "123")
    .build();

var result = client.workflows().trigger(
    WorkflowTriggerParams.builder()
        .key("new-comment")
        .addRecipient("1")
        .addRecipient("2")
        .data(data -> data.put("project_name", "My Project"))
        .actor("3")
        .cancellationKey("cancel_123")
        .tenant("jurassic_world_employees")
        .build(),
    requestOptions
);
`,
};

export default languages;
