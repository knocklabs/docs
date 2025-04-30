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
const knock = new Knock({ apiKey: process.env.KNOCK_API_KEY });

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

knock = Knockapi::Client.new(api_key: "sk_12345")

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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
)
ctx := context.Background()
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

params := knock.WorkflowCancelParams{
  CancellationKey: userInvite.ID,
}

result, _ := knockClient.Workflows.Cancel(ctx, "new-user-invited", params)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.workflows.WorkflowCancelParams;
import app.knock.api.models.workflows.WorkflowCancel;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

WorkflowCancelParams params = WorkflowCancelParams.builder()
    .key("new-user-invited")
    .cancellationKey(userInvite.getId())
    .build();

WorkflowCancel result = client.workflows().cancel(params);
`,
};

export default languages;
