const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.users.identify("1", {
  name: "John Hammond",
  email: "jhammond@ingen.net",
}, {
  idempotencyKey: "12345"
});
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.identify(knock_client, "1", %{
  name: "John Hammond",
  email: "jhammond@ingen.net"
}, idempotency_key: "12345")
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.identify(
  id="1",
  data={
    "name": "John Hammond",
    "email": "jhammond@ingen.net"
  },
  options={
    "idempotency_key": "12345"
  }
)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Users.identify(
  id: "1",
  data: {
    name: "John Hammond",
    email: "jhammond@ingen.net"
  },
  options: {
    idempotency_key: "12345"
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

var options = new Dictionary<string, string>{
  {"idempotency_key", "12345"}
};

var user = await knockClient.Users.Identify("1", params, options)
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->identify('1', [
  'name' => 'John Hammond',
  'email' => 'jhammond@ingen.net',
],
[
  'idempotency_key' => '12345'
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

user, _ := knockClient.Users.Identify(ctx, &knock.IdentifyUserRequest{
  ID: "1",
  Name: "John Hammond",
  Email: "jhammond@ingen.net"
}, &knock.IdentifyUserOptions{
  IdempotencyKey: "12345",
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
  .build(),
  UserIdentityOptions.builder()
    .idempotencyKey("12345")
    .build()
  );
`,
};

export default languages;
