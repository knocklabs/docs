const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.KNOCK_API_KEY);

await knockClient.tenants.get("tenant-1");
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Tenants.get(knock_client, "tenant-1")
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.tenants.get(
  id="tenant-1"
)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Tenants.get(
  id: "tenant-1"
)  
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
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

tenant, _ := knockClient.Tenants.Get(ctx, &knock.GetTenantRequest{
  ID:         "tenant-1"
})
`,
};

export default languages;
