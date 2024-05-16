const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_API_KEY);

// Get this value in your Knock dashboard
const APNS_CHANNEL_ID = "some-channel-id-from-knock";

await knock.workflows.trigger("new-comment", {
  data: { project_name: "My Project" },
  recipients: [
    {
      id: "1",
      email: "jhammond@ingen.net",
      channel_data: {
        APNS_CHANNEL_ID: {
          tokens: ["apns-push-token"]
        }
      }
    },
  ],
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

# Get this value in your Knock dashboard
apns_channel_id = "some-channel-id-from-knock"

client.workflows.trigger(
    key="new-comment",
    data={ "project_name": "My Project" },
    recipients=[
        {
            "id": "1",
            "email": "jhammond@ingen.net",
            "channel_data": {
                apns_channel_id: {
                    "tokens": ["apns_push_token"]
                }
            }
        }
    ]
)
`,
  ruby: `
require "knock"
Knock.key = "sk_12345"

# Get this value in your Knock dashboard
apns_channel_id = "some-channel-id-from-knock"

Knock::Workflows.trigger(
  key: "new-comment",
  data: { project_name: "My Project" },
  recipients: [
    {
      id: "1",
      email: "jhammond@ingen.net",
      channel_data: {
        apns_channel_id: {
          tokens: ["apns_push_token"]
        }
      }
    }
  ]
)
`,
  csharp: `
var knockClient = new KnockClient(
    new KnockOptions { ApiKey = "sk_12345" }
);

// Get this value in your Knock dashboard
var apnsChannelId = "some-channel-id-from-knock";

var workflowTriggerOpts = new TriggerWorkflow {
  Data = new Dictionary<string, string>{
    {"project_name", "My Project"}
  },
  Recipients = new List<Dictionary<string, string>>{
    new Dictionary<string, object>{
      {"id", "1"},
      {"email", "jhammond@ingen.net"},
      {"channel_data", new Dictionary<string, object>{
        {apnsChannelId, new Dictionary<string, object>{
          {"tokens", new List<string>{
            {"apns_push_token"}
          }}
        }}
      }}
    },
  }
};

var result = await knockClient.Workflows.Trigger("new-comment", workflowTriggerOpts)
`,
  elixir: `
knock_client = MyApp.Knock.client()

# Get this value in your Knock dashboard
apns_channel_id = "some-channel-id-from-knock"

Knock.Workflows.trigger("new-comment", %{
  data: %{project_name: "My Project"},
  recipients: [
    %{
      id: "1",
      email: "jhammond@ingen.net",
      channel_data: %{
        apns_channel_id => %{
          "tokens" => ["apns-push-token"],
        }
      }
    },
  ]
})
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

// Get this value in your Knock dashboard
$apns_channel_id = "some-channel-id-from-knock";

$client->workflows()->trigger('new-comment', [
  'data' => ['project_name' => 'My Project'],
  'recipients' => [
    [
      'id' => '1',
      'email' => 'jhammond@ingen.net',
      'channel_data' => [
        $apns_channel_id => [
          'tokens' => ['apns-push-token'],
        ]
      ]
    ],
  ]
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

// Get this value in your Knock dashboard
apnsChannelId := "some-channel-id-from-knock"

req := &knock.TriggerWorkflowRequest{
  Workflow:   "new-comment",
  Data: map[string]interface{}{"project_name": "My Project"},
}

req.AddRecipientByEntity(map[string]interface{}{
  "id": "1",
  "email": "jhammond@ingen.net",
  "channel_data": map[string]map{
    apnsChannelId: map[string]interface {
      "tokens": ["apns-push-token"]
    },
  },
})

result, _ := knockClient.Workflows.Trigger(ctx, req, nil)
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

// Get this value in your Knock dashboard
String apnsChannelId = "some-channel-id-from-knock";

WorkflowTriggerRequest workflowTrigger = WorkflowTriggerRequest.builder()
    .key("new-comment")
    .data("project_name", "My project")
    .addRecipient(
      Map.of(
        "id", "1",
        "email", "jhammond@ingen.net",
        "channel_data", Map.of(
          apnsChannelId, Map.of(
            "tokens", List.of("apns-push-token")
          )
        )
      )
    )
    .build();

WorkflowTriggerResponse result = client.workflows().trigger(workflowTrigger);
`,
};

export default languages;
