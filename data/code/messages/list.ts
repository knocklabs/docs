const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

const messages = await knockClient.messages.list()

// supports pagination parameters and filters

const messages = await knockClient.messages.list(
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

client.messages.list({'page_size': 20, 'tenant': "my_tenant"})
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Messages.list()

# supports pagination parameters and filters

Knock::Messages.list(options: {'page_size': 20, 'tenant': "my_tenant"})
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
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

result, _ := knockClient.Messages.List(ctx, &knock.ListMessagesRequest{
  PageSize: 20,
  Tenant: "my_tenant",
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

MessagesResource.QueryParams queryParams = new MessagesResource.QueryParams();

queryParams.pageSize(10);
queryParams.tenant("my_tenant");

CursorResult<KnockMessage> result = client.messages().list(queryParams);
  `,
};

export default languages;
