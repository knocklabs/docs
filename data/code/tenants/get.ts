const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/tenants/tenant-1 \\
  -H "Authorization: Bearer sk_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  apiKey: process.env.KNOCK_API_KEY
});

await knock.tenants.get("tenant-1");
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Tenants.get(knock_client, "tenant-1")
`,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

client.tenants.get(id="tenant-1")
`,
  ruby: `
require "knockapi"

knock = Knockapi::Client.new(api_key: "sk_12345")

knock.tenants.get("tenant-1")
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Tenants.Get("tenant-1");
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->tenants()->get('tenant-1');
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
)

ctx := context.Background()
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

tenant, _ := knockClient.Tenants.Get(ctx, "tenant-1")
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.tenants.Tenant;
import app.knock.api.models.tenants.TenantGetParams;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

Tenant tenant = client.tenants().get(TenantGetParams.builder()
    .id("tenant-1")
    .build());
`,
};

export default languages;
