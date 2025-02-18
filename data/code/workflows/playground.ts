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
  javascript: `
// You can use "javascript" when you don't want to make your JS example Node-specific

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
};

export default languages;
