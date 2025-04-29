const languages = {
  curl: `
curl -X PUT https://api.knock.app/v1/tenants/tenant-1 \\
  -H "Authorization: Bearer sk_12345" \\
  -H "Content-Type: application/json" \\
  -d '{
        "name": "Tenant 1",
        "settings": {
          "branding": {
            "primary_color": "#33FF5B",
            "primary_color_contrast": "#ffffff",
            "logo_url": "www.example.com/path-to-logo-asset-url",
            "icon_url": "www.example.com/path-to-icon-asset-url"
          }
        }
      }'
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

await knock.tenants.set("tenant-1", {
  name: "Tenant 1",
  settings: {
    branding: {
      primary_color: "#33FF5B",
      primary_color_contrast: "#ffffff",
      logo_url: "https:www.example.com/path-to-logo-asset-url",
      icon_url: "https:www.example.com/path-to-icon-asset-url"
    }
  }
});
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Tenants.set(knock_client, "tenant-1", %{
  name: "Tenant 1",
  settings: %{
    branding: %{
      primary_color: "#33FF5B",
      primary_color_contrast: "#ffffff",
      logo_url: "https:www.example.com/path-to-logo-asset-url",
      icon_url: "https:www.example.com/path-to-icon-asset-url"
    }
  }
})
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.tenants.set(
  id="tenant-1",
  settings={
    "branding": {
      "primary_color": "#33FF5B",
      "primary_color_contrast": "#ffffff",
      "logo_url": "https:www.example.com/path-to-logo-asset-url",
      "icon_url": "https:www.example.com/path-to-icon-asset-url"
    }
  }
)
`,
  ruby: `
require "knockapi"

knock = Knockapi::Client.new(bearer_token: "sk_12345")

knock.tenants.set("tenant-1",
  name: "Tenant 1",
  settings: {
    branding: {
      primary_color: "#33FF5B",
      primary_color_contrast: "#ffffff",
      logo_url: "https:www.example.com/path-to-logo-asset-url",
      icon_url: "https:www.example.com/path-to-icon-asset-url"
    }
  }
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var tenantParams = new Dictionary<string, object>{
  { "name", "Tenant 1" },
  { "settings", new Dictionary<string, object>{
      "branding", new Dictionary<string, string>{
        {"primary_color", "#33FF5B"},
        {"primary_color_contrast", "#ffffff"},
        {"logo_url", "https:www.example.com/path-to-logo-asset-url"},
        {"icon_url", "https:www.example.com/path-to-icon-asset-url"}
      }
    }
  }
};

await knockClient.Tenants.Set("tenant-1", tenantParams)
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->tenants()->set('tenant-1', [
  'name' => 'Tenant 1',
  'settings' => [
    'branding' => [
      'primary_color' => "#33FF5B",
      'primary_color_contrast' => "#ffffff",
      'logo_url' => "https:www.example.com/path-to-logo-asset-url",
      'icon_url' => "https:www.example.com/path-to-icon-asset-url"
    ]
  ]
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

tenant, _ := knockClient.Tenants.Set(ctx, &knock.SetTenantRequest{
  ID:         "tenant-1",
  Properties: map[string]interface{
    "name":       "Tenant 1"
  }
  Settings: map[string]interface{
    "branding":  map[string]interface{
      "primary_color":          "#33FF5B",
      "primary_color_contrast": "#ffffff",
      "logo_url":               "https:www.example.com/path-to-logo-asset-url",
      "icon_url":               "https:www.example.com/path-to-icon-asset-url"
    }
  }
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.tenants.Tenant;
import app.knock.api.models.tenants.TenantSetParams;
import java.util.Map;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

TenantSetParams params = TenantSetParams.builder()
    .id("tenant-1")
    .name("Tenant 1")
    .settings(Map.of(
        "branding", Map.of(
            "primary_color", "#33FF5B",
            "primary_color_contrast", "#ffffff",
            "logo_url", "https://www.example.com/path-to-logo-asset-url",
            "icon_url", "https://www.example.com/path-to-icon-asset-url"
        )
    ))
    .build();

Tenant tenant = client.tenants().set(params);
`,
};

export default languages;