const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/tenants \\
  -H "Authorization: Bearer sk_12345"

# supports pagination parameters and filters
curl -X GET https://api.knock.app/v1/tenants \\
  -H "Authorization: Bearer sk_12345" \\
  --url-query 'page_size=20' \\
  --url-query 'name=Tenant 1'
  `,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

const tenants = await knock.tenants.list();

// supports pagination parameters and filters
const tenants = await knock.tenants.list({
  page_size: 20,
  name: "Tenant 1"
});
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
client.tenants.list(page_size=20, name="Tenant 1")
  `,
  ruby: `
require "knock"
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

$client->tenants()->list();

// supports pagination parameters and filters
$client->tenants()->list([
  'page_size' => 20,
  'name' => 'Tenant 1'
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

result, _ := knockClient.Tenants.List(ctx, nil)

// Supports pagination parameters and filters
result, _ := knockClient.Tenants.List(ctx, &knock.ListTenantsRequest{
    PageSize: 20,
    Name: "Tenant 1",
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

CursorResult<Tenant> result = client.tenants().list();

// supports pagination parameters and filters
KnockClient.TenantsResource.QueryParams queryParams = new KnockClient.TenantsResource.QueryParams();
queryParams.pageSize(20);
queryParams.name("Tenant 1");

CursorResult<Tenant> result = client.tenants().list(queryParams);
`,
};

export default languages;
