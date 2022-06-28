const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.users.bulkIdentify([
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

client.users.bulk_identify([
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
Knock.key = "sk_12345"

Knock::Users.bulk_identify([
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

result, _ := knockClient.Users.BulkIdentify(ctx, &knock.&BulkIdentifyUserRequest{
  Users: []*User{
    {
      ID:     "1",
      Email:  "John Hammond",
      Name:   "jhammond@ingen.net"
    },
    {
      ID:     "2",
      Email:  "Ellie Sattler",
      Name:   "esattler@ingen.net"
    }
  }
})
`,
};

export default languages;
