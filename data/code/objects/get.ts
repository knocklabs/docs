const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/objects/projects/project-1 \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

await knock.objects.get("projects", "project-1");
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.get(knock_client, "projects", "project-1")
  `,
  python: `
from knockapi import Knock
client = Knock(bearer_token="sk_12345")

client.objects.get(
  collection="projects",
  id="project-1"
)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

Knock::Objects.get(
  collection: "projects",
  id: "project-1"
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Objects.Get("projects", "project-1");
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->objects()->get('projects', 'project-1');
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
)

ctx := context.Background()
client := knock.NewClient("sk_12345")

object, _ := knockClient.Objects.Get(ctx, &knock.GetObjectRequest{
  Collection: "projects",
  ID:         "project-1"
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

KnockObject object = client.objects().get("projects", "project-1");
`,
};

export default languages;
