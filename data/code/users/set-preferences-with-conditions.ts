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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
	"github.com/knocklabs/knock-go/param"
)
ctx := context.Background()
knockClient := knock.NewClient(option.WithBearerToken("sk_12345"))

preferenceSetRequest := &knock.PreferenceSetRequestParam{
  Workflows: map[string]interface{}{
    "dinosaurs-loose": map[string]interface{}{
      "conditions": []map[string]interface{}{
        {
          "variable":  "recipient.muted_alert_ids",
          "operator":  "not_contains",
          "argument":  "data.alert_id",
        },
      },
    },
  },
}

preferenceSet, _ := knockClient.Users.SetPreferences(ctx, user.ID, "default", &knock.UserSetPreferencesParams{
  PreferenceSetRequest: *preferenceSetRequest,
})
  `,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.users.PreferenceSet;
import app.knock.api.models.users.UserSetPreferencesParams;
import app.knock.api.core.JsonValue;
import java.util.List;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

UserSetPreferencesParams params = UserSetPreferencesParams.builder()
    .userId(user.getId())
    .preferenceSetId("default")
    .workflows(UserSetPreferencesParams.Workflows.builder()
        .putAdditionalProperty("dinosaurs-loose", JsonValue.from(UserSetPreferencesParams.WorkflowPreference.builder()
            .conditions(List.of(UserSetPreferencesParams.Condition.builder()
                .variable("recipient.muted_alert_ids")
                .operator("not_contains")
                .argument("data.alert_id")
                .build()))
            .build()))
        .build())
    .build();

PreferenceSet preferences = client.users().setPreferences(params);
`,
};

export default languages;
