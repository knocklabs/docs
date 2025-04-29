const languages = {
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({ bearerToken: process.env.KNOCK_API_KEY });

await knock.workflows.trigger("new-comment", {
  data: { project_name: "My Project" },
  recipients: [
    {
      id: "1",
      name: "John Hammond",
      email: "jhammond@ingen.net",
    },
    {
      id: "2",
      name: "Ellie Sattler",
      email: "esattler@ingen.net",
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
            "name": "John Hammond",
            "email": "jhammond@ingen.net"
        },
        {
            "id": "2",
            "name": "Ellie Sattler",
            "email": "esattler@ingen.net"
        }
    ]
)
`,
  ruby: `
require "knockapi"

knock = Knockapi::Client.new(bearer_token: "sk_12345")

knock.workflows.trigger("new-comment",
  data: { project_name: "My Project" },
  recipients: [
    {
      id: "1",
      name: "John Hammond",
      email: "jhammond@ingen.net"
    },
    {
      id: "2",
      name: "Ellie Sattler",
      email: "esattler@ingen.net"
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
    new Dictionary<string, string>{
      {"id", "1"},
      {"name", "John Hammond"},
      {"email", "jhammond@ingen.net"}
    },
    new Dictionary<string, string>{
      {"id", "2"},
      {"name", "Ellie Sattler"},
      {"email", "esattler@ingen.net"}
    }
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
      name: "John Hammond",
      email: "jhammond@ingen.net"
    },
    %{
      id: "2",
      name: "Ellie Sattler",
      email: "esattler@ingen.net"
    }
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
      'name' => 'John Hammond',
      'email' => 'jhammond@ingen.net'
    ],
    [
      'id' => '2',
      'name' => 'Ellie Sattler',
      'email' => 'esattler@ingen.net'
    ]
  ]
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

request := &knock.TriggerWorkflowRequest{
  Workflow:   "new-comment",
  Data: map[string]interface{}{"project_name": "My Project"},
}

request.AddRecipientByEntity(map[string]interface{
  "id": "1",
  "name": "John Hammond",
  "email": "jhammond@ingen.net",
})

request.AddRecipientByEntity(map[string]interface{
  "id": "2",
  "name": "Ellie Sattler",
  "email": "esattler@ingen.net",
})

result, _ := knockClient.Workflows.Trigger(ctx, request, nil)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.workflows.WorkflowTriggerParams;
import java.util.List;
import java.util.Map;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
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
                "name", "John Hammond",
                "email", "jhammond@ingen.net"
            ),
            Map.of(
                "id", "2",
                "name", "Ellie Sattler",
                "email", "esattler@ingen.net"
            )
        ))
        .build()
);
`,
};

export default languages;
