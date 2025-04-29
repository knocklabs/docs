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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
)
ctx := context.Background()
knockClient := knock.NewClient(option.WithBearerToken("sk_12345"))

params := knock.WorkflowTriggerParams{
  Data: map[string]interface{}{"project_name": "My Project"},
  Recipients: []knock.RecipientRequestUnionParam{
    map[string]interface{}{
      "id": "1",
      "name": "John Hammond",
      "email": "jhammond@ingen.net",
    },
    map[string]interface{}{
      "id": "2",
      "name": "Ellie Sattler",
      "email": "esattler@ingen.net",
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
