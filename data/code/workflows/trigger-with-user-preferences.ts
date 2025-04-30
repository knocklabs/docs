const languages = {
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({ apiKey: process.env.KNOCK_API_KEY });

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

client.workflows.trigger(
    key="new-comment",
    data={"project_name": "My Project"},
    recipients=[
        {
            "id": "1",
            "email": "jhammond@ingen.net",
            "preferences": {
                "default": {
                    "channel_types": {
                        "email": True,
                        "sms": True
                    }
                },
                "{{ tenant.id }}": {
                    "channel_types": {
                        "email": False,
                        "sms": False
                    }
                }
            }
        }
    ]
)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

client.workflows.trigger(
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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
)
ctx := context.Background()
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

params := knock.WorkflowTriggerParams{
  Data: map[string]interface{}{"project_name": "My Project"},
  Recipients: []knock.RecipientRequestUnionParam{
    map[string]interface{}{
      "id": "1",
      "email": "jhammond@ingen.net",
      "preferences": map[string]interface{}{
        "default": map[string]interface{}{
          "channel_types": map[string]bool{
            "email": true,
            "sms": true,
          },
        },
        "{{ tenant.id }}": map[string]interface{}{
          "channel_types": map[string]bool{
            "email": false,
            "sms": false,
          },
        },
      },
    },
  },
}

result, _ := knockClient.Workflows.Trigger(ctx, "new-comment", params)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.workflows.WorkflowTriggerParams;
import java.util.List;
import java.util.Map;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

var result = client.workflows().trigger(
    WorkflowTriggerParams.builder()
        .key("new-comment")
        .data(data -> {
            data.put("project_name", "My Project");
            return data;
        })
        .recipients(List.of(
            Map.of(
                "id", "1",
                "email", "jhammond@ingen.net",
                "preferences", Map.of(
                    "default", Map.of(
                        "channel_types", Map.of(
                            "email", true,
                            "sms", true
                        )
                    ),
                    "{{ tenant.id }}", Map.of(
                        "channel_types", Map.of(
                            "email", false,
                            "sms", false
                        )
                    )
                )
            )
        ))
        .build()
);
`,
};

export default languages;
