const languages = {
  curl: `
curl -X POST "https://api.knock.app/v1/objects/projects/bulk/set" \\
  -H "Authorization: Bearer sk_12345" \\
  -H "Content-Type: application/json" \\
  -d '{
        "objects": [
          {
            "id": "project-1",
            "name": "My project",
            "total_assets": 10,
            "tags": ["cool", "fun", "project"]
          },
          {
            "id": "project-2",
            "name": "My second project",
            "total_assets": 5,
            "tags": ["very", "cool", "project"]
          }
        ]
      }'
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

await knock.objects.bulk.set("projects", [
  {
    id: "project-1",
    name: "My project",
    total_assets: 10,
    tags: ["cool", "fun", "project"],
  },
  {
    id: "project-2",
    name: "My second project",
    total_assets: 5,
    tags: ["very", "cool", "project"],
  }
]);
`,
  elixir: `
MyApp.Knock.client()
|> Knock.Objects.bulk_set("projects", [
  %{
    id: "project-1",
    name: "My project",
    total_assets: 10,
    tags: ["cool", "fun", "project"],
  },
  %{
    id: "project-2",
    name: "My second project",
    total_assets: 5,
    tags: ["very", "cool", "project"],
  }
])
  `,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

client.objects.bulk.set(
  collection="projects",
  objects=[
    {
      "id": "project-1",
      "name": "My project",
      "total_assets": 10,
      "tags": ["cool", "fun", "project"],
    },
    {
      "id": "project-2",
      "name": "My second project",
      "total_assets": 5,
      "tags": ["very", "cool", "project"],
    }
  ]
)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

Knock::Objects.bulk_set(
  collection: "projects",
  objects: [
    {
      id: "project-1",
      name: "My project",
      total_assets: 10,
      tags: ["cool", "fun", "project"],
    },
    {
      id: "project-2",
      name: "My second project",
      total_assets: 5,
      tags: ["very", "cool", "project"],
    }
  ]
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var objects = new List<Dictionary<string, object>>{
  new Dictionary<string, object>{
    { "id", "project-1" },
    { "name", "My project" },
    { "total_assets", 10 },
    { "tags", new List { "cool", "fun", "project" }}
  },
  new Dictionary<string, object>{
    { "id", "project-2" },
    { "name", "My second project" },
    { "total_assets", 10 },
    { "tags", new List { "very", "cool", "project" }}
  }
};

var options = new BulkSetObjectsOptions {
  Objects = objects
};

await knockClient.Objects.BulkSet("projects", options);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->objects()->bulkSet('projects', [
  [
    'id' => 'project-1',
    'name' => 'My project',
    'total_assets' => 10,
    'tags' => ['cool', 'fun', 'project'],
  ],
  [
    'id' => 'project-2',
    'name' => 'My second project',
    'total_assets' => 5,
    'tags' => ['very', 'cool', 'project'],
  ]
])
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
)

ctx := context.Background()
client := knock.NewClient("sk_12345")

// The Go SDK doesn't currently support this example
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.objects.BulkOperation;
import app.knock.api.models.objects.ObjectBulkSetParams;
import app.knock.api.core.JsonValue;
import java.util.Arrays;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

ObjectBulkSetParams params = ObjectBulkSetParams.builder()
    .collection("projects")
    .objects(Arrays.asList(
        ObjectBulkSetParams.Object.builder()
            .id("project-1")
            .properties(ObjectBulkSetParams.Object.Properties.builder()
                .putAdditionalProperty("name", JsonValue.from("My project"))
                .putAdditionalProperty("total_assets", JsonValue.from(10))
                .putAdditionalProperty("tags", JsonValue.from(Arrays.asList("cool", "fun", "project")))
                .build())
            .build(),
        ObjectBulkSetParams.Object.builder()
            .id("project-2")
            .properties(ObjectBulkSetParams.Object.Properties.builder()
                .putAdditionalProperty("name", JsonValue.from("My second project"))
                .putAdditionalProperty("total_assets", JsonValue.from(5))
                .putAdditionalProperty("tags", JsonValue.from(Arrays.asList("very", "cool", "project")))
                .build())
            .build()
    ))
    .build();
BulkOperation bulkOp = client.objects().bulk().set(params);
`,
};

export default languages;
