const languages = {
  node: `
import Knock from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

await knockClient.users.setPreferences("jhammond", "default", {
  workflows: {
    "dinosaurs-loose": {
      conditions: [
        // Only send if the alert id is not in the list of muted alert ids for the user
        {
          variable: "recipient.muted_alert_ids",
          operator: "not_contains",
          argument: "data.alert_id"
        }
      ]
    },
  },
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.set_preferences(
  user_id=user.id,
  id="default",
  workflows={
    "dinosaurs-loose": {
      "conditions": [{
        # Only send if the alert id is not in the list of muted alert ids for the user
        "variable": "recipient.muted_alert_ids",
        "operator": "not_contains",
        "argument": "data.alert_id"
      }]
    }
  }
)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

client.users.set_preferences(user.id, "default", {
  workflows: {
    "dinosaurs-loose": {
      conditions: [{
        # Only send if the alert id is not in the list of muted alert ids for the user
        variable: "recipient.muted_alert_ids",
        operator: "not_contains",
        argument: "data.alert_id"
      }]
    }
  }
})
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

// Set preference set for user
var preferenceSetUpdate = new SetPreferencesOptions {
  Workflows = new Dictionary<string, object> {
    {"dinosaurs-loose", new Dictionary<string, object> {
      {"conditions", new List<Dictionary<string, object>> {
        new Dictionary<string, string>{
          {"variable", "recipient.muted_alert_ids"},
          {"operator", "not_contains"},
          {"argument", "data.alert_id"}
        }
      }}
    }}
  }
};

await knockClient.Users.SetPreferences("jhammond", preferenceSetUpdate);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.set_preferences(knock_client, user.id, %{
  workflows: %{
    "dinosaurs-loose" => %{
      conditions: [
        %{
          variable: "recipient.muted_alert_ids",
          operator: "not_contains",
          argument: "data.alert_id"
        }
      ]
    }
  }
})
  `,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->setPreferences($user->id(), [
  'workflows' => [
    'dinosaurs-loose' => [
      'conditions' => [
        [
          'variable' => 'recipient.muted_alert_ids',
          'operator' => 'not_contains',
          'argument' => 'data.alert_id'
        ]
      ]
    ]
  ]
]);
  `,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

request := &knock.SetUserPreferencesRequest{UserID: user.ID}

request.AddWorkflowsPreference(map[string]interface{}{
  "dinosaurs-loose": map[string]interface{}{
    "conditions": []map[string]interface{}{
      map[string]interface{}{
        "variable": "recipient.muted_alert_ids",
        "operator": "not_contains",
        "argument": "data.alert_id"
      }
    },
  },
})

preferenceSet, _ := knockClient.Users.SetPreferences(ctx, request)
  `,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

PreferenceSetRequest request = PreferenceSetRequest.builder()
  .workflow("dinosaurs-loose",
    new PreferenceSetBuilder()
      .condition("recipient.muted_alert_ids", "not_contains", "data.alert_id")
      .build()
  )
  .build();

PreferenceSet preferences = client.users().setPreferences(user.getId(), request);
`,
};

export default languages;
