const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

const channelData = await knockClient.messages.list()

// supports pagination parameters and filters

const channelData = await knockClient.messages.list(
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

client.messages.list({'page_size': 10, 'tenant': "my_tenant"})
  `,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

Knock::Messages.list()

# supports pagination parameters and filters

Knock::Messages.list(options: {'page_size': 10, 'tenant': 10})
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Messages.List();

// supports pagination parameters and filters

var params = new Dictionary<string, string> {
                {"page_size", "10"},
                {"tenant", "my_tenant"}
             };

await knockClient.Messages.List(params);
`,
  php: `
use Knock\\KnockSdk\\Client;
    
$client = new Client('sk_12345');

$client->messages()->list([
  'page_size' => 10,
  'tenant' => 'my_tenant'
]);
`,
};

export default languages;
