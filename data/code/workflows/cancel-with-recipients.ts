const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
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
require "knock"
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
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

req := &knock.CancelWorkflowRequest{
  Workflow:        "new-user-invited",
  CancellationKey: userInvite.ID,
}

req.AddRecipientByID("user_1")

err := knockClient.Workflows.Cancel(ctx, req)
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
    .recipients(List.of("user-1"))
    .build();

client.workflows().cancel(WorkflowCancelRequest.from(workflowTrigger));
`,
};

export default languages;
