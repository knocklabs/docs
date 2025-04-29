const languages = {
  curl: `
curl -X DELETE "https://api.knock.app/v1/objects/projects/project-1" \\
  -H "Authorization: Bearer sk_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

await knock.objects.delete("projects", "project-1");
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.delete(knock_client, "projects", "project-1")
  `,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

client.objects.delete(
    collection="projects",
    id="project-1"
)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

client.objects.delete("projects", "project-1")
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Objects.Delete("projects", "project-1");
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->objects()->delete('projects', 'project-1');
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
)

ctx := context.Background()
client := knock.NewClient("sk_12345")

response, _ := knockClient.Objects.Delete(ctx, &knock.DeleteObjectRequest{
  Collection: "projects",
  ID:         "project-1"
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.objects.ObjectDeleteParams;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

ObjectDeleteParams params = ObjectDeleteParams.builder()
    .collection("projects")
    .objectId("project-1")
    .build();
String response = client.objects().delete(params);
`,
};

export default languages;
