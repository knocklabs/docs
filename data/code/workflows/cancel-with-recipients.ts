const languages = {
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({ bearerToken: process.env.KNOCK_API_KEY });

const userInvite = await invites.approve(inviteToken);

await knock.workflows.cancel("new-user-invited", {
  cancellation_key: userInvite.id,
  recipients: ["user_1", "user_2"]
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

knock = Knockapi::Client.new(bearer_token: "sk_12345")

knock.workflows.cancel("new-user-invited",
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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
	"github.com/knocklabs/knock-go/param"
)
ctx := context.Background()
knockClient := knock.NewClient(option.WithBearerToken("sk_12345"))

params := knock.WorkflowCancelParams{
  CancellationKey: userInvite.ID,
  Recipients: []knock.RecipientReferenceUnionParam{"user_1", "user_2"},
}

result, _ := knockClient.Workflows.Cancel(ctx, "new-user-invited", params)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.workflows.WorkflowCancelParams;
import app.knock.api.models.workflows.WorkflowCancel;
import java.util.Arrays;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

WorkflowCancelParams params = WorkflowCancelParams.builder()
    .key("new-user-invited")
    .cancellationKey(userInvite.getId())
    .recipients(Arrays.asList("user_1", "user_2"))
    .build();

WorkflowCancel result = client.workflows().cancel(params);
`,
};

export default languages;
