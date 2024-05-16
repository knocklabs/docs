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
});
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
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

req := &knock.TriggerWorkflowRequest{
  Workflow:   "new-comment",

  // optional
  Data:            map[string]interface{"project_name": "My Project"},
  Actor:           "3",
  CancellationKey: "cancel_123",
  Tenant:          "jurassic_world_employees",
}

for _, r := range []string{"1", "2"} {
  req.AddRecipientByID(r)
}

result, _ := knockClient.Workflows.Trigger(ctx, req, nil)
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

WorkflowTriggerResponse result = client.workflows().trigger(workflowTrigger);
`,
};

export default languages;
