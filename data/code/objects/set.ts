const languages = {
  curl: `
curl -X PUT https://api.knock.app/v1/objects/projects/project-1 \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "name": "My project",
        "total_assets": 10,
        "tags": ["cool", "fun", "project"],
        "locale": "en-US",
        "timezone": "America/New_York"
      }'
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

await knock.objects.set("projects", "project-1", {
  name: "My project",
  total_assets: 10,
  tags: ["cool", "fun", "project"],
  locale: "en-US",
  timezone: "America/New_York"
});
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.set(knock_client, "projects", "project-1", %{
  name: "My project",
  total_assets: 10,
  tags: ["cool", "fun", "project"],
  locale: "en-US",
  timezone: "America/New_York"
})
  `,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

client.objects.set(
    collection="projects",
    id="project-1",
    channel_data={
        "name": "My project",
        "total_assets": 10,
        "tags": ["cool", "fun", "project"],
        "locale": "en-US",
        "timezone": "America/New_York"
    }
)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

Knock::Objects.set(
  collection: "projects",
  id: "project-1",
  properties: {
    name: "My project",
    total_assets: 10,
    tags: ["cool", "fun", "project"],
    locale: "en-US",
    timezone: "America/New_York"
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
  }},
  { "locale", "en-US" },
  { "timezone", "America/New_York" }
};

await knockClient.Objects.Set("projects", "project-1", objectParams)
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->objects()->set('projects', 'project-1', [
  'name' => 'My project',
  'total_assets' => 10,
  'tags' => ['cool', 'fun', 'project'],
  'locale' => 'en-US',
  'timezone' => 'America/New_York'
]);
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
)

ctx := context.Background()
client := knock.NewClient("sk_12345")

object, _ := knockClient.Objects.Set(ctx, &knock.SetObjectRequest{
  Collection: "projects",
  ID:         "project-1",
  Properties: map[string]interface{}{
    "name":         "My project",
    "total_assets": 10,
    "tags":         []string{"cool", "fun", "project"},
    "locale":       "en-US",
    "timezone":     "America/New_York"
  }
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

KnockObject object = client.objects().set("projects", "project-1", Map.of(
  "name", "Project one",
  "total_assets", 10,
  "tags", List.of("cool", "fun", "project"),
  "locale", "en-US",
  "timezone", "America/New_York"
));
`,
};

export default languages;
