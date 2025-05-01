const languages = {
  curl: `
curl -X POST https://api.knock.app/v1/workflows/new-comment/trigger \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "data": {
          "project_name": "My Project"
        },
        "actor": {
          "id": "1",
          "name": "John Hammond",
          "email": "jhammond@ingen.net"
        },
        "recipients": [
          {
            "id": "project-1",
            "collection": "projects",
            "name": "My project",
            "total_assets": 10,
            "tags": ["cool", "fun", "project"]
          },
          {
            "id": "2",
            "name": "Ellie Sattler",
            "email": "esattler@ingen.net"
          }
        ]
      }'
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({ apiKey: process.env.KNOCK_API_KEY });

await knock.workflows.trigger("new-comment", {
  data: { project_name: "My Project" },
  actor: {
    id: "1",
    name: "John Hammond",
    email: "jhammond@ingen.net",
  },
  recipients: [
    {
      id: "project-1",
      collection: "projects",
      name: "My project",
      total_assets: 10,
      tags: ["cool", "fun", "project"],
    },
    {
      id: "2",
      name: "Ellie Sattler",
      email: "esattler@ingen.net",
    },
  ],
});
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.workflows.trigger(
    key="new-comment",
    data={"project_name": "My Project"},
    actor={
        "id": "1",
        "name": "John Hammond",
        "email": "jhammond@ingen.net"
    },
    recipients=[
        {
            "id": "project-1",
            "collection": "projects",
            "name": "My project",
            "total_assets": 10,
            "tags": ["cool", "fun", "project"]
        },
        {
            "id": "2",
            "name": "Ellie Sattler",
            "email": "esattler@ingen.net"
        }
    ]
)
`,
  ruby: `
require "knockapi"

knock = Knockapi::Client.new(api_key: "sk_12345")

knock.workflows.trigger("new-comment",
  data: { project_name: "My Project" },
  actor: {
    id: "1",
    name: "John Hammond",
    email: "jhammond@ingen.net"
  },
  recipients: [
    {
      id: "project-1",
      collection: "projects",
      name: "My project",
      total_assets: 10,
      tags: ["cool", "fun", "project"]
    },
    {
      id: "2",
      name: "Ellie Sattler",
      email: "esattler@ingen.net"
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
  Actor=new Dictionary<string, string>{
    {"id", "1"},
    {"name", "John Hammond"},
    {"email", "jhammond@ingen.net"}
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
      {"id", "2"},
      {"name", "Ellie Sattler"},
      {"email", "esattler@ingen.net"}
    }
  }
};

var result = await knockClient.Workflows.Trigger("new-comment", workflowTriggerOpts)
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Workflows.trigger("new-comment", %{
  data: %{project_name: "My Project"},
  actor: %{
    id: "1",
    name: "John Hammond",
    email: "jhammond@ingen.net"
  },
  recipients: [
    %{
      id: "project-1",
      collection: "projects",
      name: "My project",
      total_assets: 10,
      tags: ["cool", "fun", "project"],
    },
    %{
      id: "2",
      name: "Ellie Sattler",
      email: "esattler@ingen.net"
    }
  ]
})
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->workflows()->trigger('new-comment', [
  'data' => ['project_name' => 'My Project'],
  'actor' => [
    'id' => '1',
    'name' => 'John Hammond',
    'email' => 'jhammond@ingen.net'
  ],
  'recipients' => [
    [
      'id' => 'project-1',
      'collection' => 'projects',
      'name' => 'My project',
      'total_assets' => 10,
      'tags' => ['cool', 'fun', 'project'],
    ],
    [
      'id' => '2',
      'name' => 'Ellie Sattler',
      'email' => 'esattler@ingen.net'
    ]
  ]
]);
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
)
ctx := context.Background()
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

params := knock.WorkflowTriggerParams{
  Data: map[string]interface{}{"project_name": "My Project"},
  Actor: map[string]interface{}{
    "id": "1",
    "name": "John Hammond",
    "email": "jhammond@ingen.net"
  },
  Recipients: []knock.RecipientRequestUnionParam{
    map[string]interface{}{
      "id": "project-1",
      "collection": "projects",
      "name": "My project",
      "total_assets": 10,
      "tags": []string{"cool", "fun", "project"},
    },
    map[string]interface{}{
      "id": "2",
      "name": "Ellie Sattler",
      "email": "esattler@ingen.net",
    },
  },
}

result, _ := knockClient.Workflows.Trigger(ctx, "new-comment", params)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.workflows.WorkflowTriggerParams;
import java.util.List;
import java.util.Map;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

var result = client.workflows().trigger(
    WorkflowTriggerParams.builder()
        .key("new-comment")
        .data(data -> {
            data.put("project_name", "My Project");
            return data;
        })
        .actor(Map.of(
            "id", "1",
            "name", "John Hammond",
            "email", "jhammond@ingen.net"
        ))
        .recipients(List.of(
            Map.of(
                "id", "project-1",
                "collection", "projects",
                "name", "My project",
                "total_assets", 10,
                "tags", List.of("cool", "fun", "project")
            ),
            Map.of(
                "id", "2",
                "name", "Ellie Sattler",
                "email", "esattler@ingen.net"
            )
        ))
        .build()
);
`,
};

export default languages;
