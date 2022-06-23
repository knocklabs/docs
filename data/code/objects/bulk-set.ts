const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
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
require "knockapi"

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
};

export default languages;
