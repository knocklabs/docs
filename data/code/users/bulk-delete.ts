const languages = {
  curl: `
curl -X POST https://api.knock.app/v1/users/bulk/delete \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "user_ids": ["user-1", "user-2"]
      }'
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

const bulkOperation = await knock.users.bulk.delete(userIds);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.bulk_delete(knock_client, user_ids)
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.bulk.delete(user_ids=user_ids)
`,
  ruby: `
require "knock"
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
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

BulkOperation result = client.users().bulkDelete(List.of("user-1", "user-2"));
`,
};

export default languages;
