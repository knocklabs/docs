const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.KNOCK_API_KEY);

knockClient.tenants.set("tenant-1", {
  name: "Tenant 1",
  settings: {
    branding: {
      primary_color: "#33FF5B",
      primary_color_contrast: "#ffffff",
      logo_url: "www.example.com/path-to-logo-asset-url",
      icon_url: "www.example.com/path-to-icon-asset-url"
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
      logo_url: "www.example.com/path-to-logo-asset-url",
      icon_url: "www.example.com/path-to-icon-asset-url"
    }
  }
})
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.tenants.set_tenant(
  id="tenant-1",
  data={
    "name": "Tenant 1",
    "settings": {
      "branding": {
        "primary_color": "#33FF5B",
        "primary_color_contrast": "#ffffff",
        "logo_url": "www.example.com/path-to-logo-asset-url",
        "icon_url": "www.example.com/path-to-icon-asset-url"
      }
    }
  }
)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Tenants.set(
  id: "tenant-1",
  data: {
    name: "Tenant 1",
    settings: {
      branding: {
        primary_color: "#33FF5B",
        primary_color_contrast: "#ffffff",
        logo_url: "www.example.com/path-to-logo-asset-url",
        icon_url: "www.example.com/path-to-icon-asset-url"
      }
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
        {"logo_url", "www.example.com/path-to-logo-asset-url"},
        {"icon_url", "www.example.com/path-to-icon-asset-url"}
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
      'logo_url' => "www.example.com/path-to-logo-asset-url",
      'icon_url' => "www.example.com/path-to-icon-asset-url"
    ]
  ]
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

tenant, _ := knockClient.Tenants.Set(ctx, &knock.SetTenantRequest{
  ID:         "tenant-1",
  Name:       "Tenant 1"
  Settings: map[string]interface{
    "branding":  map[string]interface{
      "primary_color":          "#33FF5B",
      "primary_color_contrast": "#ffffff",
      "logo_url":               "www.example.com/path-to-logo-asset-url",
      "icon_url":               "www.example.com/path-to-icon-asset-url"
    }
  }
})
`,
};

export default languages;
