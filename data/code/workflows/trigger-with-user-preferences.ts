const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.workflows.trigger("new-comment", {
  data: { project_name: "My Project" },
  recipients: [
    {
      id: "1",
      email: "jhammond@ingen.net",
      preferences: {
        "default": {
          channel_types: { email: true, sms: true }
        },
        [tenant.id]: {
          channel_types: { email: false, sms: false }
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
            "preferences": {
                "default": {
                    "channel_types": {
                        "email": true,
                        "sms": true
                    }
                },
                "{{ tenant.id }}": {
                    "channel_types": {
                        "email": true,
                        "sms": true
                    }
                }
              }
            }
        }
    ]
)
`,
  ruby: `
require "knock"
Knock.key = "sk_12345"

apns_push_token = "apns-push-token"

Knock::Workflows.trigger(
  key: "new-comment",
  data: { project_name: "My Project" },
  recipients: [
    {
      id: "1",
      email: "jhammond@ingen.net",
      preferences: {
        default: {
          channel_types: {
            email: true,
            sms: true,
          } 
        },
        "{{ tenant.id }}": {
          channel_types: {
            email: false,
            sms: false,
          } 
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
      {"preferences", new Dictionary<string, object>{
        {"default", new Dictionary<string, object>{
          {"channel_types", new Dictionary<string, boolean>{
            {"email", true},
            {"sms", true}
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
      preferences: %{
        default: %{
          channel_types: %{email: true, sms: true}
        },
        "{{ tenant.id }}" => %{
          channel_types: %{email: false, sms: false}
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
      'preferences' => [
        'default' => [
          'channel_types' => [
            'email' => true,
            'sms' => true
          ],
        ],
        '{{ tenant.id }}' => [
          'channel_types' => [
            'email' => false,
            'sms' => false
          ],
        ]
      ]
    ],
  ]
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

req := &knock.TriggerWorkflowRequest{
  Workflow:   "new-comment",
  Data: map[string]interface{"project_name": "My Project"},
}

req.AddRecipientByEntity(map[string]interface{}{
  "id": "1",
  "email": "jhammond@ingen.net",
  "preferences": map[string]map{
    "default": map[string]map {
      "channel_types": map[string]boolean {
        "email": true,
        "sms": true
      },
    },
    "{{ tenant.id }}": map[string]map {
      "channel_types": map[string]boolean {
        "email": false,
        "sms": false
      },
    }
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

WorkflowTriggerRequest workflowTrigger = WorkflowTriggerRequest.builder()
    .key("new-comment")
    .data("project_name", "My project")
    .addRecipient(
      Map.of(
        "id", "1",
        "email", "jhammond@ingen.net",
        "preferences", Map.of(
          "default", Map.of(
            "channel_types", Map.of(
              "email", true,
              "sms", true
            )
          )
        )
      )
    )
    .build();

WorkflowTriggerResponse result = client.workflows().trigger(workflowTrigger);
`,
};

export default languages;
