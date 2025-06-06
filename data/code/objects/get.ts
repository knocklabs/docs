const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/objects/projects/project-1 \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  apiKey: process.env.KNOCK_API_KEY
});

await knock.objects.get("projects", "project-1");
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.get(knock_client, "projects", "project-1")
  `,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

client.objects.get(
    collection="projects",
    id="project-1"
)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

client.objects.get("projects", "project-1")
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
	"github.com/knocklabs/knock-go/option"
)

ctx := context.Background()
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

object, _ := knockClient.Objects.Get(ctx, "projects", "project-1")
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.objects.ObjectGetParams;
import app.knock.api.models.objects.Object;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

ObjectGetParams params = ObjectGetParams.builder()
    .collection("projects")
    .objectId("project-1")
    .build();
Object object = client.objects().get(params);
`,
};

export default languages;
