const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/users/1 \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

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
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

client.users.get(user.id)
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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
)

ctx := context.Background()
knockClient := knock.NewClient(option.WithBearerToken("sk_12345"))

user, _ := knockClient.Users.Get(ctx, user.ID)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.users.User;
import app.knock.api.models.users.UserGetParams;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

User user = client.users().get(UserGetParams.builder()
    .userId(user.getId())
    .build());
`,
};

export default languages;
