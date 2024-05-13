const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knock = new Knock("sk_example_12345679");

await knock.objects.bulkSet("projects", [
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

client.objects.bulk_set(
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
require "knock"
Knock.key = "sk_12345"

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
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

// The Go SDK doesn't currently support this example
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

List<Map<String, Object>> objectsToSet = List.of(
  Map.of(
    "id", "project-1",
    "name", "My project",
    "total_assets", 10,
    "tags", List.of("cool", "fun", "project")
  ),
  Map.of(
    "id", "project-2",
    "name", "My second project",
    "total_assets", 5,
    "tags", List.of("very", "cool", "project")
  )
)

BulkOperation bulkOp = client.objects().bulkSetInCollection("projects", objectsToSet);
`,
};

export default languages;
