const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

const users = [
  { id: "user-1", name: "Jane Doe", email: "jane@example.com" }
]

await knock.users.bulkIdentify(users);
`,
  elixir: `
knock_client = MyApp.Knock.client()

users = [
  %{id: "user-1", name: "Jane Doe", email: "jane@example.com"}
]

Knock.Users.bulk_identify(knock_client, users)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

users = [
  {"id": "user-1", "name": "Jane Doe", "email": "jane@example.com"}
]

client.users.bulk_identify(users)
  `,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

users = [
  {id: "user-1", name: "Jane Doe", email: "jane@example.com"}
]


Knock::Users.bulk_identify(users)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var users = new List<Dictionary>{
  new Dictionary<string, object> {
    { "id", "jane" },
    { "email", "jane@example.com" },
    { "name", "Jane Doe" }
  }
};

await knockClient.Users.BulkIdentify(users);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->bulkIdentify([
  [
    'id' => 'jane',
    'email' => 'jane@example.com',
    'name' => 'Jane Doe'
  ]
]);
`,
};

export default languages;
