const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/users/1 \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import { Knock } from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.users.get(user.id);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.get(knock_client, user.id)
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.get(user.id)
`,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Users.get(id: user.id)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Users.Get(user.Id);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->get($user->id());
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

user, _ = knockClient.Users.Get(ctx, &knock.GetUserRequest{
  ID: user.ID,
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

UserIdentity user = client.users().get(user.getId());
`,
};

export default languages;
