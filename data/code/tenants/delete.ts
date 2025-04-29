const languages = {
  curl: `
curl -X DELETE https://api.knock.app/v1/tenants/tenant-1 \\
  -H "Authorization: Bearer sk_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

await knock.tenants.delete("tenant-1");
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Tenants.delete(knock_client, "tenant-1")
`,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

client.tenants.delete(id="tenant-1")
`,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Tenants.delete(
  id: "tenant-1",
)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Tenants.Delete("tenant-1");
`,
  php: `
use Knock\\KnockSdk\\Client;
    
$client = new Client('sk_12345');

$client->tenants()->delete('tenant-1');
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

response, _ := knockClient.Tenants.Delete(ctx, &knock.DeleteTenantRequest{
  ID:         "tenant-1"
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

client.tenants().delete("tenant-1");
`,
};

export default languages;
