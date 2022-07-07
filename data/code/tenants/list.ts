const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

const tenants = await knockClient.tenants.list()

// supports pagination parameters and filters

const tenants = await knockClient.tenants.list(
  {
    page_size: 20,
    name: "Tenant 1"
  }
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Tenants.list(knock_client)

# supports pagination parameters and filters

Knock.Tenants.list(
  knock_client,
  page_size: 20, name: "Tenant 1"
)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.tenants.list()

# supports pagination parameters and filters

client.tenants.list({'page_size': 20, 'name': "Tenant 1"})
  `,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

Knock::Tenants.list()

# supports pagination parameters and filters

Knock::Tenants.list(options: {'page_size': 20, 'name': "Tenant 1"})
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Tenants.List();

// supports pagination parameters and filters

var params = new Dictionary<string, string> {
                {"page_size", "20"},
                {"name", "Tenant 1"}
             };

await knockClient.Tenants.List(params);
`,
  php: `
use Knock\\KnockSdk\\Client;
    
$client = new Client('sk_12345');

$client->tenants()->list([
  'page_size' => 20,
  'name' => 'Tenant 1'
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

result, _ := knockClient.Tenants.List(ctx, &knock.ListTenantsRequest{
  PageSize: 20,
  Tenant: "Tenant 1",
})
`,
};

export default languages;
