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
import { Knock } from "@knocklabs/node";
const knock = new Knock("sk_example_12345679");

const objectIds = ["project-1", "project-2"];

await knock.objects.bulkDelete("projects", objectIds);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.bulk_delete(knock_client, "projects", object_ids)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.objects.bulk_delete(
  collection="projects",
  object_ids=object_ids 
)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

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

client.objects().bulkDeleteInCollection("projects", List.of("project-1", "project-2"));
`,
};

export default languages;
