const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/users/1/messages \\
  -H "Authorization: Bearer sk_test_12345"

# supports pagination parameters and filters
curl -X GET https://api.knock.app/v1/users/1/messages \\
  -H "Authorization: Bearer sk_test_12345" \\
  --url-query page_size=20 \\
  --url-query tenant=my_tenant
`,
  node: `
import Knock from "@knocklabs/node";
const knockClient = new Knock({ apiKey: process.env.KNOCK_API_KEY });

await knockClient.users.listMessages(user.id);

// supports pagination parameters and filters
await knockClient.users.listMessages(
  user.id,
  {
    page_size: 20,
    tenant: "my-tenant"
  }
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.get_messages(knock_client, user.id)

# supports pagination parameters and filters
Knock.Users.get_messages(
  knock_client,
  user.id,
  page_size: 20,
  tenant: "my_tenant"
)
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.list_messages(
  user_id=user.id
)

# supports pagination parameters and filters
client.users.list_messages(
  user_id=user.id,
  page_size=20,
  tenant="my_tenant"
)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

client.users.list_messages(user.id)

# supports pagination parameters and filters
client.users.list_messages(user.id, {
  page_size: 20,
  tenant: "my_tenant"
})
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Users.GetMessages(user.Id);

// supports pagination parameters and filters
var params = new Dictionary<string, string> {
                {"page_size", "20"},
                {"tenant", "my_tenant"}
             };

await knockClient.Users.GetMessages(user.Id, params);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->getMessages($user->id());

# supports pagination parameters and filters
$client->users()->getMessages($user->id(), [
  'page_size' => 20,
  'tenant' => 'my_tenant'
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

messages, _ := knockClient.Users.ListMessages(ctx, user.ID, knock.UserListMessagesParams{
  PageSize: param.Int64(20),
  Tenant:   param.String("my_tenant"),
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.messages.KnockMessage;
import app.knock.api.models.users.UserGetMessagesParams;
import app.knock.api.core.CursorResult;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

UserGetMessagesParams params = UserGetMessagesParams.builder()
    .userId(user.getId())
    .pageSize(20)
    .tenant("my_tenant")
    .build();

CursorResult<KnockMessage> result = client.users().getMessages(params);
`,
};

export default languages;
