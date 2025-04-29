const languages = {
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({ bearerToken: process.env.KNOCK_API_KEY });

await knock.workflows.trigger("new-comment", {
  recipients: [
    { id: project.id, collection: "projects" }
  ],
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.workflows.trigger(
    key="new-comment",
    recipients=[
        {"id": project.id, "collection": "projects"}
    ]
)
`,
  ruby: `
require "knockapi"

knock = Knockapi::Client.new(bearer_token: "sk_12345")

knock.workflows.trigger("new-comment",
  recipients: [
    { id: project.id, collection: "projects" }
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

request := &knock.TriggerWorkflowRequest{
  Workflow: "new-comment",
}

request.AddRecipientByEntity(map[string]interface{}{
  "collection": "projects",
  "id":         project.ID,
})

result, _ := knockClient.Workflows.Trigger(ctx, request, nil)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.workflows.WorkflowTriggerParams;
import java.util.Map;
import java.util.List;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

var result = client.workflows().trigger(
    WorkflowTriggerParams.builder()
        .key("new-comment")
        .recipients(List.of(Map.of(
            "id", project.getId(),
            "collection", "projects"
        )))
        .build()
);
`,
};

export default languages;
