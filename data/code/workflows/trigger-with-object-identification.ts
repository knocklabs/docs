const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.notify("new-comment", {
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

client.notify(
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
require "knockapi"
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

result, _ := knockClient.Workflows.Trigger(ctx, &knock.TriggerWorkflowRequest{
  Workflow:   "new-comment",
  Data: map[string]string{"project_name": "My Project"},
  Recipients: []map[string]interface{}{
    map[string]interface{}{
      "id": "project-1",
      "collection": "projects",
      "name": "My project",
      "total_assets": 10,
      "tags": []string{"cool", "fun", "project"},
    },
    map[string]interface{}{
      "id": "project-2",
      "collection": "projects",
      "name": "My second project",
      "total_assets": 5,
      "tags": []string{"very", "cool", "project"},
    },
  }
})
`,
};

export default languages;
