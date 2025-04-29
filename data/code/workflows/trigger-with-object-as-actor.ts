const languages = {
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({ bearerToken: process.env.KNOCK_API_KEY });

await knock.workflows.trigger("new-comment", {
  actor: { id: project.id, collection: "projects" },
  recipients: followerIds,
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.workflows.trigger(
    key="new-comment",
    actor={"id": project.id, "collection": "projects"},
    recipients=follower_ids
)
`,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Workflows.trigger(
  key: "new-comment",
  actor: { "id": project.id, "collection": "projects" },
  recipients: follower_ids,
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var workflowTriggerOpts = new TriggerWorkflow {
  Actor = new Dictionary<string, object>{
    {"id", project.Id},
    {"collection", "projects"}
  }
  Recipients = followerIds,
};

var result = await knockClient.Workflows.Trigger("new-comment", workflowTriggerOpts)
`,
  elixir: `
knock_client = MyApp.Knock.client()  

Knock.Workflows.trigger("new-comment", %{
  actor: %{ id: project.id, collection: "projects" }
  recipients: follower_ids,
})
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->workflows()->trigger('new-comment', [
  'actor' => ['id' => $project->id(), 'collection' => 'projects'],
  'recipients' => $follower_ids,
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

request := &knock.TriggerWorkflowRequest{
  Workflow:   "new-comment",
  Recipients: followerIds,
}

for _, f := range followerIds {
  request.AddRecipientByID(f)
}

request.AddActorByEntity(map[string]interface{}{
  "collection": "projects",
  "id":         project.ID, 
})

result, _ := knockClient.Workflows.Trigger(ctx, request, nil)
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

WorkflowTriggerRequest workflowTrigger = WorkflowTriggerRequest.builder()
    .key("new-comment")
    .actor(WorkflowTriggerRequest.ObjectRecipientIdentifier.builder()
      .id(project.getId())
      .collection("projects")
      .build()
    )
    .recipients(followerIds)
    .build();

WorkflowTriggerResponse result = client.workflows().trigger(workflowTrigger);
`,
};

export default languages;