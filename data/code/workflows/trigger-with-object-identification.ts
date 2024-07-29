const languages = {
  node: `
import { Knock } from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.workflows.trigger("new-comment", {
  data: { project_name: "My Project" },
  recipients: [
    {
      id: "project-1",
      collection: "projects",
      name: "My project",
      total_assets: 10,
      tags: ["cool", "fun", "project"],
    },
    {
      id: "project-2",
      collection: "projects",
      name: "My second project",
      total_assets: 5,
      tags: ["very", "cool", "project"],
    }
  ],
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.workflows.trigger(
    key="new-comment",
    data={ "project_name": "My Project" },
    recipients=[
      {
          "id": "project-1",
          "collection": "projects",
          "name": "My project",
          "total_assets": 10,
          "tags": ["cool", "fun", "project"],
      },
      {
          "id": "project-2",
          "collection": "projects",
          "name": "My second project",
          "total_assets": 5,
          "tags": ["very", "cool", "project"],
      }
    ]
)
`,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Workflows.trigger(
  key: "new-comment",
  data: { project_name: "My Project" },
  recipients: [
    {
      id: "project-1",
      collection: "projects",
      name: "My project",
      total_assets: 10,
      tags: ["cool", "fun", "project"],
    },
    {
      id: "project-2",
      collection: "projects",
      name: "My second project",
      total_assets: 5,
      tags: ["very", "cool", "project"],
    }
  ]
)
`,
  csharp: `
var knockClient = new KnockClient(
    new KnockOptions { ApiKey = "sk_12345" }
);

var workflowTriggerOpts = new TriggerWorkflow {
  Data = new Dictionary<string, string>{
    {"project_name", "My Project"}
  },
  Recipients = new List<Dictionary<string, object>>{
    new Dictionary<string, object>{
      { "id", "project-1" },
      { "collection", "projects" },
      { "name", "My project" },
      { "total_assets", 10 },
      { "tags", new List { "cool", "fun", "project" }}
    },
    new Dictionary<string, object>{
      { "id", "project-2" },
      { "collection", "projects" },
      { "name", "My second project" },
      { "total_assets", 10 },
      { "tags", new List { "very", "cool", "project" }}
    }
  }
};

var result = await knockClient.Workflows.Trigger("new-comment", workflowTriggerOpts)
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Workflows.trigger("new-comment", %{
  data: %{project_name: "My Project"},
  recipients: [
    %{
      id: "project-1",
      collection: "projects",
      name: "My project",
      total_assets: 10,
      tags: ["cool", "fun", "project"],
    },
    %{
      id: "project-2",
      collection: "projects",
      name: "My second project",
      total_assets: 5,
      tags: ["very", "cool", "project"],
    }
  ]
})
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->workflows()->trigger('new-comment', [
  'data' => ['project_name' => 'My Project'],
  'recipients' => [
    [
      'id' => 'project-1',
      'collection' => 'projects',
      'name' => 'My project',
      'total_assets' => 10,
      'tags' => ['cool', 'fun', 'project'],
    ],
    [
      'id' => 'project-2',
      'collection' => 'projects',
      'name' => 'My second project',
      'total_assets' => 5,
      'tags' => ['very', 'cool', 'project'],
    ]
  ]
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

request := &knock.TriggerWorkflowRequest{
  Workflow:   "new-comment",
  Data: map[string]interface{}{"project_name": "My Project"},
}

request.AddRecipientByEntity(
  map[string]interface{}{
    "id": "project-1",
    "collection": "projects",
    "name": "My project",
    "total_assets": 10,
    "tags": []string{"cool", "fun", "project"},
  }
)

request.AddRecipientByEntity(
  map[string]interface{}{
    "id": "project-2",
    "collection": "projects",
    "name": "My second project",
    "total_assets": 5,
    "tags": []string{"very", "cool", "project"},
  }
)

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
    .data("project_name", "My project")
    .addRecipient(
      Map.of(
        "id", "project-1",
        "collection", "projects",
        "name", "My project",
        "total_assets", 10,
        "tags", List.of("cool", "fun", "project")
      )
    )
    .build();

WorkflowTriggerResponse result = client.workflows().trigger(workflowTrigger);
`,
};

export default languages;
