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
require "knockapi"

knock = Knockapi::Client.new(bearer_token: "sk_12345")

knock.workflows.trigger("new-comment",
  actor: { id: project.id, collection: "projects" },
  recipients: follower_ids
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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
)
ctx := context.Background()
knockClient := knock.NewClient(option.WithBearerToken("sk_12345"))

params := knock.WorkflowTriggerParams{
  Actor: map[string]interface{}{
    "collection": "projects",
    "id": project.ID,
  },
  Recipients: make([]knock.RecipientRequestUnionParam, len(followerIds)),
}

for i, f := range followerIds {
  params.Recipients[i] = f
}

result, _ := knockClient.Workflows.Trigger(ctx, "new-comment", params)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.workflows.WorkflowTriggerParams;
import java.util.Map;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

var result = client.workflows().trigger(
    WorkflowTriggerParams.builder()
        .key("new-comment")
        .actor(Map.of(
            "id", project.getId(),
            "collection", "projects"
        ))
        .recipients(followerIds)
        .build()
);
`,
};

export default languages;
