const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

await knockClient.users.setPreferences("jhammond", {
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

Knock.key = "sk_12345"

Knock::Users.set_preferences(
  user_id: user.id,
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
)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

// Set preference set for user
var preferenceSetUpdate = new SetPreferencesOptions {
  Workflows = new Dictionary<string, object> {
    {"dinosaurs-loose", new Dicitonary<string, object> {
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
};

export default languages;
