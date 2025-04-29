const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/objects/projects/project-1/messages \\
  -H "Authorization: Bearer sk_test_12345"

# supports pagination parameters and filters

curl -X GET "https://api.knock.app/v1/objects/projects/project-1/messages \\
  -H "Authorization: Bearer sk_test_12345"
  --url-query page_size=20 \\
  --url-query tenant=my-tenant
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

const messages = await knock.objects.listMessages(
  "projects",
  project.id
);

// supports pagination parameters and filters

const messages = await knock.objects.listMessages(
  "projects",
  project.id,
  {
    page_size: 20,
    tenant: "my-tenant"
  }
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.get_messages(knock_client, "projects", project.id)

# supports pagination parameters and filters

Knock.Objects.get_messages(
  knock_client,
  "projects",
  project.id,
  page_size: 20, tenant: "my_tenant"
)
  `,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

client.objects.list_messages(collection="projects", id=project.id)

# supports pagination parameters and filters
client.objects.list_messages(
  collection="projects",
  id=project.id,
  page_size=10,
  tenant="my_tenant"
)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

Knock::Objects.get_messages(
  collection: "projects",
  id: project.id
)

Knock::Objects.get_messages(
  collection: "projects",
  id: project.id,
  {page_size: 10, tenant: "my_tenant"}
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Objects.GetMessages("projects", project.id);

// supports pagination parameters and filters

var params = new Dictionary<string, string> {
                {"page_size", "10"},
                {"tenant", "my_tenant"}
             };

await knockClient.Objects.GetMessages("projects", project.id, params);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->objects()->getMessages('projects', 'project-1', [
  'page_size' => 10,
  'tenant' => 'my_tenant'
]);
`,
  go: `
import (
	"context"

	"github.com/stainless-sdks/knock-go"
	"github.com/stainless-sdks/knock-go/option"
)

ctx := context.Background()
client := knock.NewClient(option.WithBearerToken("sk_12345"))

// List messages with pagination
messages, _ := client.Messages.List(ctx, knock.MessageListParams{
	PageSize: param.New(20),
	Tenant:   param.New("my-tenant"),
})

// Auto-paging version
messagesPager := client.Messages.ListAutoPaging(ctx, knock.MessageListParams{
	PageSize: param.New(20),
	Tenant:   param.New("my-tenant"),
})

// Iterate through messages
for messagesPager.Next() {
	message := messagesPager.Current()
	// Process message...
}
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.objects.ObjectListMessagesParams;
import app.knock.api.models.objects.ObjectListMessagesPage;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

ObjectListMessagesParams params = ObjectListMessagesParams.builder()
    .collection("projects")
    .objectId("project-1")
    .pageSize(10)
    .tenant("my_tenant")
    .build();
ObjectListMessagesPage messages = client.objects().listMessages(params);
`,
};

export default languages;
