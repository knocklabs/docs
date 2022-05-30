const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

const userInvite = await invites.approve(inviteToken);

await knock.workflows.cancel("new-user-invited", userInvite.id, {
  recipients: ["user_1", "user_2"],
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.workflows.cancel(
  key="new-user-invited",
  cancellation_key=user_invite.id,
  recipients=["user_1", "user_2"]
)
`,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

Knock::Workflows.cancel(
  key: "new-user-invited",
  cancellation_key: user_invite.id,
  recipients: ["user_1", "user_2"]
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var options = new CancelWorkflow {
  CancellationKey = userInvite.Id,
  Recipients = new List<string> {
    "user_1",
    "user_2"
  }
};

await knockClient.Workflows.Cancel("new-user-invited", options);
`,
  elixir: `
knock_client = MyApp.Knock.client()  

Knock.Workflows.cancel("new-user-invited", user-invite.id, %{
  recipients: ["user_1", "user_2"]
})
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->workflows()->cancel('new-user-invited', [
  'cancellation_key' => $userInvite->id(),
  'recipients' => ['user_1'],
]);
`,
};

export default languages;
