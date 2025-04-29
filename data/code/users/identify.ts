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
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

await knock.users.update("1", {
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

client.users.update(
  user_id="1",
  name="John Hammond",
  email="jhammond@ingen.net"
)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

client.users.update("1", {
  name: "John Hammond",
  email: "jhammond@ingen.net"
})
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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
	"github.com/knocklabs/knock-go/param"
)
ctx := context.Background()
knockClient := knock.NewClient(option.WithBearerToken("sk_12345"))

user, _ := knockClient.Users.Update(ctx, "1", knock.UserUpdateParams{
  IdentifyUserRequest: knock.IdentifyUserRequestParam{
    Name:  param.String("John Hammond"),
    Email: param.String("jhammond@ingen.net"),
  },
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.users.User;
import app.knock.api.models.users.UserIdentifyParams;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

User user = client.users().identify(UserIdentifyParams.builder()
    .userId("1")
    .name("John Hammond")
    .email("jhammond@ingen.net")
    .build());
`,
};

export default languages;
