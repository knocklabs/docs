const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.notify("new-comment", {
  recipients: [
    { id: project.id, collection: "projects" }
  ],
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.notify(
  key="new-comment",
  recipients=[
    { "id": project.id, "collection": "projects" },
  ]
)
`,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

Knock::Workflows.trigger(
  key: "new-comment",
  recipients: [
    { "id": project.id, "collection": "projects" }
  ]
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var workflowTriggerOpts = new TriggerWorkflow {
  Recipients = [
    new Dictionary<string, object>{
      {"id", project.Id},
      {"collection", "projects"}
    }
  ],
};

var result = await knockClient.Workflows.Trigger("new-comment", workflowTriggerOpts)
`,
  elixir: `
knock_client = MyApp.Knock.client()  

Knock.Workflows.trigger("new-comment", %{
  recipients: [
    %{ id: project.id, collection: "projects" }
  ],
})
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->workflows()->trigger('new-comment', [
  'recipients' => [
    ['id' => $project->id(), 'collection' => 'projects']
  ],
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

request := &knock.TriggerWorkflowRequest{
  Workflow: "new-comment",
}

request.AddRecipientByEntity(map[string]interface{}{
  "collection": "projects",
  "id":         project.ID 
})

result, _ := knockClient.Workflows.Trigger(ctx, request)
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

WorkflowTriggerRequest workflowTrigger = WorkflowTriggerRequest.builder()
    .key("new-comment")
    .addRecipient(WorkflowTriggerRequest.ObjectRecipientIdentifier.builder()
      .id(project.getId())
      .collection("projects")
      .build()
    )
    .build();

WorkflowTriggerResponse result = client.workflows().trigger(workflowTrigger);
`,
};

export default languages;
