const languages = {
  curl: `
curl -X POST https://api.knock.app/v1/objects/projects/bulk/delete \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "object_ids": ["project-1", "project-2"]
      }'
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

const objectIds = ["project-1", "project-2"];

await knock.objects.bulk.delete("projects", objectIds);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.bulk_delete(knock_client, "projects", object_ids)
  `,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

client.objects.bulk.delete(collection="projects", object_ids=["project-1", "project-2"])
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

Knock::Objects.bulk_delete(
  collection: "projects",
  object_ids: object_ids
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var objectIds = new List<string> {
  "project-1",
  "project-2"
}

var options = new BulkDeleteObjectsOptions {
  ObjectIds = objectIds
};

await knockClient.Objects.BulkDelete("projects", options);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->objects()->bulkDelete('projects', ['project-1', 'project-2']);
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

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

client.objects().bulkDeleteInCollection("projects", List.of("project-1", "project-2"));
`,
};

export default languages;
