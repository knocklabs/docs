const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/objects/projects \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

const objects = await knock.objects.list("projects");
`,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

objects = client.objects.list(
    collection="projects"
)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

objects = client.objects.list("projects")
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.objects.ObjectListParams;
import app.knock.api.models.objects.ObjectListPage;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

ObjectListParams params = ObjectListParams.builder()
    .collection("projects")
    .build();
ObjectListPage objects = client.objects().list(params);
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
)

ctx := context.Background()
knockClient := knock.NewClient(option.WithBearerToken("sk_12345"))

objects, _ := knockClient.Objects.List(ctx, "projects", &knock.ObjectListParams{})
`,
  // TODO: Add additional SDK examples
};

export default languages;
