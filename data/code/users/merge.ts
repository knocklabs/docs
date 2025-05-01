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
import Knock from "@knocklabs/node";
const knock = new Knock({ apiKey: process.env.KNOCK_API_KEY });

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
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

client.users.merge(user.id, {
  from_user_id: "user-to-merge-from"
})
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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
	"github.com/knocklabs/knock-go/param"
)
ctx := context.Background()
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

result, _ := knockClient.Users.Merge(ctx, user.ID, knock.UserMergeParams{
  FromUserID: param.String("user-to-merge-from"),
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.users.User;
import app.knock.api.models.users.UserMergeParams;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

User user = client.users().merge(UserMergeParams.builder()
    .userId(user.getId())
    .fromUserId("user-to-merge-from")
    .build());
`,
};

export default languages;
