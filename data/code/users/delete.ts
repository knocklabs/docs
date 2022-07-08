const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

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

Knock.key = "sk_12345"

Knock::Users.delete(id: user.id)  
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
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

client.users().delete(user.getId());
`,
};

export default languages;
