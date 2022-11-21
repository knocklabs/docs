const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.workflows.trigger("new-comment", {
  data: { project_name: "My Project" },
  recipients: [
    {
      id: "1",
      email: "jhammond@ingen.net",
      channel_data: {
        "{{ channelId }}": {
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

apns_push_token = "apns-push-token"

client.workflows.trigger(
    key="new-comment",
    data={ "project_name": "My Project" },
    recipients=[
        {
            "id": "1",
            "email": "jhammond@ingen.net",
            "channel_data": {
                "{{ channel_id }}": {
                    "tokens": [apns_push_token]
                }
            }
        }
    ]
)
`,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

apns_push_token = "apns-push-token"

Knock::Workflows.trigger(
  key: "new-comment",
  data: { project_name: "My Project" },
  recipients: [
    {
      id: "1",
      email: "jhammond@ingen.net",
      channel_data: {
        "{{ channel_id }}": {
          tokens: [apns_push_token]
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

var workflowTriggerOpts = new TriggerWorkflow {
  Data = new Dictionary<string, string>{
    {"project_name", "My Project"}
  },
  Recipients = new List<Dictionary<string, string>>{
    new Dictionary<string, object>{
      {"id", "1"},
      {"email", "jhammond@ingen.net"},
      {"channel_data", new Dictionary<string, object>{
        {"{{ channel_id }}", new Dictionary<string, object>{
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

Knock.Workflows.trigger("new-comment", %{
  data: %{project_name: "My Project"},
  recipients: [
    %{
      id: "1",
      email: "jhammond@ingen.net",
      channel_data: %{
        "{{ channel_id }}" => %{
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

$client->workflows()->trigger('new-comment', [
  'data' => ['project_name' => 'My Project'],
  'recipients' => [
    [
      'id' => '1',
      'email' => 'jhammond@ingen.net',
      'channel_data' => [
        '{{ channel_id }}' => [
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

result, _ := knockClient.Workflows.Trigger(ctx, &knock.TriggerWorkflowRequest{
  Workflow:   "new-comment",
  Data: map[string]string{"project_name": "My Project"},
  Recipients: []map[string]string{
    map[string]string{
      "id": "1",
      "email": "jhammond@ingen.net",
      "channel_data": map[string]map{
        "{{ channel_id }}": map[string]string {
          "tokens": ["apns-push-token"]
        }
      }
    },
  }
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

WorkflowTriggerRequest workflowTrigger = WorkflowTriggerRequest.builder()
    .key("new-comment")
    .data("project_name", "My project")
    .addRecipient(
      Map.of(
        "id", "1",
        "email", "jhammond@ingen.net",
        "channel_data", Map.of(
          "{{ channel_id }}", Map.of(
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
