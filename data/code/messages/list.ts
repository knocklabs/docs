const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/messages \\
  -H "Authorization: Bearer sk_12345"

# supports pagination parameters and filters

curl -X GET https://api.knock.app/v1/messages \\
  -H "Authorization: Bearer sk_12345" \\
  --url-query page_size=20 \\
  --url-query tenant=my_tenant
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  apiKey: process.env.KNOCK_API_KEY
});

const messages = await knock.messages.list()

// supports pagination parameters and filters

const messages = await knock.messages.list(
  {
    page_size: 20,
    tenant: "my-tenant"
  }
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Messages.list(knock_client)

# supports pagination parameters and filters

Knock.Messages.list(
  knock_client,
  page_size: 20, tenant: "my_tenant"
)
  `,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

client.messages.list()

# supports pagination parameters and filters
client.messages.list(page_size=20, tenant="my_tenant")
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

client.messages.list()

# supports pagination parameters and filters

client.messages.list(page_size: 20, tenant: "my_tenant")
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Messages.List();

// supports pagination parameters and filters

var params = new Dictionary<string, string> {
                {"page_size", "20"},
                {"tenant", "my_tenant"}
             };

await knockClient.Messages.List(params);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->messages()->list([
  'page_size' => 20,
  'tenant' => 'my_tenant'
]);
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
	"github.com/knocklabs/knock-go/param"
)

ctx := context.Background()
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

// List messages with pagination
messages, _ := knockClient.Messages.List(ctx, knock.MessageListParams{
	PageSize: param.New(20),
	Tenant:   param.New("my-tenant"),
})

// Auto-paging version
messagesPager := knockClient.Messages.ListAutoPaging(ctx, knock.MessageListParams{
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
import app.knock.api.models.messages.MessageListParams;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

// Basic request
var messages = client.messages().list();

// With pagination and filters
var filteredMessages = client.messages().list(
    MessageListParams.builder()
        .pageSize(20)
        .tenant("my_tenant")
        .build()
);
  `,
};

export default languages;
