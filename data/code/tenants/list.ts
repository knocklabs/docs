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
  apiKey: process.env.KNOCK_API_KEY
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
require "knockapi"

knock = Knockapi::Client.new(api_key: "sk_12345")

knock.tenants.list()

# supports pagination parameters and filters
knock.tenants.list(
  page_size: 20,
  name: "Tenant 1"
)
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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
	"github.com/knocklabs/knock-go/param"
)

ctx := context.Background()
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

// List tenants with pagination
tenants, _ := knockClient.Tenants.List(ctx, knock.TenantListParams{
	PageSize: param.New(20),
	Name:     param.New("Tenant 1"),
})

// Auto-paging version
tenantsPager := knockClient.Tenants.ListAutoPaging(ctx, knock.TenantListParams{
	PageSize: param.New(20),
	Name:     param.New("Tenant 1"),
})

// Iterate through tenants
for tenantsPager.Next() {
	tenant := tenantsPager.Current()
	// Process tenant...
}
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.Page;
import app.knock.api.models.tenants.Tenant;
import app.knock.api.models.tenants.TenantListParams;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

Page<Tenant> result = client.tenants().list();

// supports pagination parameters and filters
TenantListParams params = TenantListParams.builder()
    .pageSize(20)
    .name("Tenant 1")
    .build();

Page<Tenant> result = client.tenants().list(params);
`,
};

export default languages;
