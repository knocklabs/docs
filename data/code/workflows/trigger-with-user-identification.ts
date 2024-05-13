const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_API_KEY);

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
    data={ "project_name": "My Project" },
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
require "knock"
Knock.key = "sk_12345"

Knock::Workflows.trigger(
  key: "new-comment",
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

result, _ := knockClient.Workflows.Trigger(ctx, &knock.TriggerWorkflowRequest{
  Workflow:   "new-comment",
  Data: map[string]string{"project_name": "My Project"},
  Recipients: []map[string]string{
    map[string]string{
      "id": "1",
      "name": "John Hammond",
      "email": "jhammond@ingen.net"
    },
    map[string]string{
      "id": "2",
      "name": "Ellie Sattler",
      "email": "esattler@ingen.net"
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
        "name", "John Hammond",
        "email", "jhammond@ingen.net"
      )
    )
    .addRecipient(
      Map.of(
        "id", "2",
        "name", "Ellie Sattler",
        "email", "esattler@ingen.net"
      )
    )
    .build();

WorkflowTriggerResponse result = client.workflows().trigger(workflowTrigger);
`,
};

export default languages;
