const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock("sk_example_123456789");

const bulkOperation = await knock.users.bulkDelete(userIds);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.bulk_delete(knock_client, user_ids)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.bulk_delete(user_ids=user_ids)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Users.bulk_delete(user_ids: user_ids)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var userIds = new List<string> {
  "user-1",
  "user-2"
};

await knockClient.Users.BulkDelete(userIds);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->bulkDelete(['user-1', 'user-2']);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

result, _ := knockClient.Users.BulkDelete(ctx, &knock.&BulkDeleteUserRequest{
  UserIDs: []string{"user-1", "user-2"}
})
`,
};

export default languages;
