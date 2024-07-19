const languages = {
  node: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.KNOCK_API_KEY);

knockClient.objects.set("projects", "project-1", {
  name: "My project",
  total_assets: 10,
  tags: ["cool", "fun", "project"],
});
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.set(knock_client, "projects", "project-1", %{
  name: "My project",
  total_assets: 10,
  tags: ["cool", "fun", "project"],
})
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.objects.set_object(
  collection="projects",
  id="project-1",
  data={
    "name": "My project",
    "total_assets": 10,
    "tags": ["cool", "fun", "project"]
  }
)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Objects.set(
  collection: "projects",
  id: "project-1",
  data: {
    name: "My project",
    total_assets: 10,
    tags: ["cool", "fun", "project"],
  }
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var objectParams = new Dictionary<string, object>{
  { "name", "My project" },
  { "total_assets", 10 },
  { "tags", new List {
    "cool", "fun", "project"
  }}
};

await knockClient.Objects.Set("projects", "project-1", objectParams)
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->objects()->set('projects', 'project-1', [
  'name' => 'My project',
  'total_assets' => 10,
  'tags' => ['cool', 'fun', 'project']
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

object, _ := knockClient.Objects.Set(ctx, &knock.SetObjectRequest{
  Collection: "projects",
  ID:         "project-1",
  Properties: map[string]interface{
    "name":         "My project",
    "total_assets": 10,
    "tags":         string[]{ "cool", "fun", "project" }
  }
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

KnockObject object = client.objects().set("projects", "project-1", Map.of(
  "name", "Project one",
  "total_assets", 10,
  "tags", List.of("cool", "fun", "project")
));
`,
};

export default languages;
