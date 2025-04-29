const languages = {
  curl: `
curl -X POST https://api.knock.app/v1/workflows/new-user-invited/cancel \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "cancellation_key": "user_invite_id"
      }'
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({ bearerToken: process.env.KNOCK_API_KEY });

const userInvite = await invites.approve(inviteToken);

await knock.workflows.cancel("new-user-invited", {
  cancellation_key: userInvite.id
});
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.workflows.cancel(
    key="new-user-invited",
    cancellation_key=user_invite.id
)
`,
  ruby: `
require "knockapi"

knock = Knockapi::Client.new(bearer_token: "sk_12345")

knock.workflows.cancel("new-user-invited",
  cancellation_key: user_invite.id
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var options = new CancelWorkflow {
  CancellationKey = userInvite.Id
};

await knockClient.Workflows.Cancel("new-user-invited", options);
`,
  elixir: `
knock_client = MyApp.Knock.client()  

Knock.Workflows.cancel("new-user-invited", user_invite.id)
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->workflows()->cancel('new-user-invited', [
  'cancellation_key' => $userInvite->id(),
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

result, _ := knockClient.Workflows.Cancel(ctx, &knock.CancelWorkflowRequest{
  Workflow:         "new-user-invited",
  CancellationKey:  userInvite.ID,
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

WorkflowTriggerRequest workflowTrigger = WorkflowTriggerRequest.builder()
    .key("new-user-invited")
    .cancellationKey(userInvite.getId())
    .build();

client.workflows().cancel(WorkflowCancelRequest.from(workflowTrigger));
`,
};

export default languages;
