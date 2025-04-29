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
  bearerToken: process.env.KNOCK_API_KEY
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

client = Knockapi::Client.new(bearer_token: "sk_12345")

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
)

ctx := context.Background()
client := knock.NewClient("sk_12345")

result, _ := knockClient.Messages.List(ctx, &knock.ListMessagesRequest{
  PageSize: 20,
  Tenant: "my_tenant",
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

MessagesResource.QueryParams queryParams = new MessagesResource.QueryParams();

queryParams.pageSize(10);
queryParams.tenant("my_tenant");

CursorResult<KnockMessage> result = client.messages().list(queryParams);
  `,
};

export default languages;
