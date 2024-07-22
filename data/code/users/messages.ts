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
import { Knock } from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

await knockClient.users.getMessages(user.id);

// supports pagination parameters and filters
await knockClient.users.getMessages(
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

client.users.get_messages(
  id=user.id
)

# supports pagination parameters and filters
client.users.get_messages(
  id=user.id, 
  options={
    'page_size': 20, 
    'tenant': "my_tenant"
  }
)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Users.get_messages(
  id: user.id
)

# supports pagination parameters and filters
Knock::Users.get_messages(
  id: user.id,
  options={
    'page_size': 20,
    'tenant': 'my_tenant'
  }
)
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
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

messages, _ := knockClient.Users.GetMessages(ctx, &knock.GetUserMessagesRequest{
  ID:       user.ID,
  PageSize: 20,
  Tenant    "my_tenant"
})
  `,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

MessagesResource.QueryParams queryParams = new MessagesResource.QueryParams();

queryParams.pageSize(20);
queryParams.tenant("my_tenant");

CursorResult<KnockMessage> result = client.users().getMessages(user.getId(), queryParams);
  `,
};

export default languages;