const languages = {
  curl: `
curl -X DELETE https://api.knock.app/v1/users/1 \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

await knock.users.delete(user.id);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.delete(knock_client, user.id)
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.delete(user.id)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

client.users.delete(user.id)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Users.Delete(user.Id);  
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->delete($user->id());
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

result, _ := knockClient.Users.Delete(ctx, &knock.DeleteUserRequest{
  ID: user.ID,
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.users.UserDeleteParams;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

client.users().delete(UserDeleteParams.builder()
    .userId(user.getId())
    .build());
`,
};

export default languages;
