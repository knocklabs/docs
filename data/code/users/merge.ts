const languages = {
  curl: `
curl -X POST https://api.knock.app/v1/users/user_1/merge \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "from_user_id": "user-to-merge-from"
      }'
`,
  node: `
import { Knock } from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.users.merge(user.id, "user-to-merge-from");
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.merge(knock_client, user.id, "user-to-merge-from")
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.merge(
  user_id=user.id, 
  from_user_id="user-to-merge-from"
)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Users.merge(
  id: user.id,
  from_user_id: "user-to-merge-from"
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Users.Merge(user.Id, "user-to-merge-from")  
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->merge($user->id(), [
  'from_user_id' => 'user-to-merge-from'
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

result, _ := knockClient.Users.Merge(ctx, &knock.MergeUserRequest{
  ID:         user.ID,
  FromUserID: "user-to-merge-from",
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

UserIdentity user = client.users().merge(user.getId(), "user-to-merge-from");
`,
};

export default languages;
