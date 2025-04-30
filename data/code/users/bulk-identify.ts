const languages = {
  curl: `
curl -X POST https://api.knock.app/v1/users/bulk/identify \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '[
        {
          id: "1",
          name: "John Hammond",
          email: "jhammond@ingen.net",
        },
        {
          id: "2",
          name: "Ellie Sattler",
          email: "esattler@ingen.net",
        }
      ]'

`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  apiKey: process.env.KNOCK_API_KEY
});

await knock.users.bulk.identify([
  {
    id: "1",
    name: "John Hammond",
    email: "jhammond@ingen.net",
  },
  {
    id: "2",
    name: "Ellie Sattler",
    email: "esattler@ingen.net",
  },
]);
`,
  elixir: `
MyApp.Knock.client()
|> Knock.Users.bulk_identify([
  %{
    id: "1",
    name: "John Hammond",
    email: "jhammond@ingen.net"
  },
  %{
    id: "2",
    name: "Ellie Sattler",
    email: "esattler@ingen.net"
  }
])
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.bulk.update([
  {
    "id": "1",
    "name": "John Hammond",
    "email": "jhammond@ingen.net"
  },
  {
    "id": "2",
    "name": "Ellie Sattler",
    "email": "esattler@ingen.net"
  }
])
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

client.users.bulk.update([
  {
    id: "1",
    name: "John Hammond",
    email: "jhammond@ingen.net"
  },
  {
    id: "2",
    name: "Ellie Sattler",
    email: "esattler@ingen.net"
  }
])
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var users = new List<Dictionary<string, string>>{
  new Dictionary<string, string>{
    {"id", "1"},
    {"name", "John Hammond"},
    {"email", "jhammond@ingen.net"}
  },
  new Dictionary<string, string>{
    {"id", "2"},
    {"name", "Ellie Sattler"},
    {"email", "esattler@ingen.net"}
  }
};

await knockClient.Users.BulkIdentify(users);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->bulkIdentify([
  [
    'id' => '1',
    'name' => 'John Hammond',
    'email' => 'jhammond@ingen.net'
  ],
  [
    'id' => '2',
    'name' => 'Ellie Sattler',
    'email' => 'esattler@ingen.net'
  ]
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

result, _ := knockClient.Users.Bulk.Identify(ctx, knock.UserBulkIdentifyParams{
  Users: param.Raw([]map[string]interface{}{
    {
      "id":    "1",
      "name":  "John Hammond",
      "email": "jhammond@ingen.net",
    },
    {
      "id":    "2",
      "name":  "Ellie Sattler",
      "email": "esattler@ingen.net",
    },
  }),
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

List<UserIdentity> userIdentities = Arrays.asList(
  UserIdentity.builder()
    .id("1")
    .name("John Hammond")
    .email("jhammond@ingen.net")
    .build(),
  UserIdentity.builder()
    .id("2")
    .name("Ellie Sattler")
    .email("esattler@ingen.net")
    .build()
);

BulkOperation result = client.users().bulk().identify(BulkIdentifyParams.builder()
    .users(userIdentities)
    .build());
`,
};

export default languages;
