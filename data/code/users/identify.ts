const languages = {
  curl: `
curl -X PUT https://api.knock.app/v1/users/1 \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "name": "John Hammond",
        "email": "john@example.com"
      }'
`,
  node: `
import { Knock } from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.users.identify("1", {
  name: "John Hammond",
  email: "jhammond@ingen.net",
});
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.identify(knock_client, "1", %{
  name: "John Hammond",
  email: "jhammond@ingen.net"
})
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.identify(
  id="1",
  data={
    "name": "John Hammond",
    "email": "jhammond@ingen.net"
  }
)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Users.identify(
  id: "1",
  data: {
    name: "John Hammond",
    email: "jhammond@ingen.net"
  }
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" }
);

var params = new Dictionary<string, string>{
  {"name", "John Hammond"},
  {"email", "jhammond@ingen.net"}
};

var user = await knockClient.Users.Identify("1", params)
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->identify('1', [
  'name' => 'John Hammond',
  'email' => 'jhammond@ingen.net',
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

user, _ := knockClient.Users.Identify(ctx, &knock.IdentifyUserRequest{
  ID: "1",
  Name: "John Hammond",
  Email: "jhammond@ingen.net"
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

UserIdentity user = client.users().identify("1", UserIdentity.builder()
  .name("John Hammond")
  .email("jhammond@ingen.net")
  .build());
`,
};

export default languages;
