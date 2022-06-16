const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock("sk_example_12345679");

const objects = [
  {
    id: "project-1",
    name: "Project one",
  },
];

await knock.objects.bulkSet("projects", objects);
`,
  elixir: `
knock_client = MyApp.Knock.client()

objects = [
  %{ id: "project-1", name: "Project one" }
]

Knock.Objects.bulk_set(knock_client, "projects", objects)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.objects.bulk_set(
  collection="projects",
  objects=[
    { "id": "project-1", "name": "Project one" }
  ]
)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Objects.bulk_set(
  collection: "projects",
  objects: [
    { id: "project-1", name: "Project one" }
  ]
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var objects = new List<Dictionary>
{
  new Dictionary<string, object>{
    {"id", "project-1"},
    {"name", "Project one"}
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
    'name' => 'Project one'
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
