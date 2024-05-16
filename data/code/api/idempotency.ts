const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.workflows.trigger("new-comment", {
  recipients: ["1", "2"],

  // optional
  data: { "project_name": "My Project" },
  actor: "3",
  cancellationKey: "cancel_123",
  tenant: "jurassic_world_employees"
},
{
  idempotencyKey: "123"
}
);
  `,
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

    idempotency_key="123"
)
`,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Workflows.trigger(
  key: "new-comment",
  recipients: ["1", "2"]

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

Knock.Workflows.trigger("new-comment", %{
  recipients: ["1", "2"]

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
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

result, _ := knockClient.Workflows.Trigger(ctx, &knock.TriggerWorkflowRequest{
  Workflow:   "new-comment",
  Recipients: []interface{"1", "2"}

  // optional
  Data:            map[string]interface{}{"project_name": "My Project"},
  Actor:           "3",
  CancellationKey: "cancel_123"
  Tenant:          "jurassic_world_employees"
},
&knock.MethodOptions{
  IdempotencyKey: "123"
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

WorkflowTriggerRequest workflowTrigger = WorkflowTriggerRequest.builder()
    .key("new-comment")
    .recipients(List.of("1", "2"))

    // optional
    .data("project_name", "My project")
    .actor("3")
    .cancellationKey("cancel_123")
    .tenant("jurassic_world_employees")
    .build();

MethodOptions methodOptions = MethodOptions.builder()
    .idempotencyKey("123")
    .build();

WorkflowTriggerResponse result = client.workflows().trigger(workflowTrigger, methodOptions);
`,
};

export default languages;
