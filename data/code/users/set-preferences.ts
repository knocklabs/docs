const languages = {
  curl: `
curl -X PUT https://api.knock.app/v1/users/1/preferences/default \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "channel_types": {
          "email": true,
          "sms": false
        },
        "workflows": {
          "dinosaurs-loose": {
            "channel_types": {
              "email": false,
              "in_app_feed": true,
              "sms": true
            }
          }
        }
      }'
`,
  node: `
import Knock from "@knocklabs/node";
const knockClient = new Knock({ apiKey: process.env.KNOCK_API_KEY });

await knockClient.users.setPreferences(user.id, "default", {
  channel_types: {
    email: true,
    sms: false
  },
  workflows: {
    "dinosaurs-loose": {
      channel_types: {
        email: false,
        in_app_feed: true,
        sms: true,
      },
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
  channel_types={
    "email": True,
    "sms": False
  },
  workflows={
    "dinosaurs-loose": {
      "channel_types": {
        "email": False,
        "in_app_feed": True,
        "sms": True,
      }
    }
  }
)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

client.users.set_preferences(user.id, "default", {
  channel_types: {
    email: true,
    sms: false
  },
  workflows: {
    "dinosaurs-loose": {
      channel_types: {
        email: false,
        in_app_feed: true,
        sms: true,
      }
    }
  }
})
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

// Set preference set for user
var preferenceSetUpdate = new SetPreferencesOptions {
  ChannelTypes = new Dictionary<string, boolean> {
    {"email", false}
  }
};

await knockClient.Users.SetPreferences(user.id, preferenceSetUpdate);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.set_preferences(knock_client, user.id, %{
  channel_types: %{
    email: true,
    sms: false
  },
  workflows: %{
    "dinosaurs-loose" => %{
      channel_types: {
        email: false,
        in_app_feed: true,
        sms: true,
      }
    }
  }
})
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->setPreferences($user->id(), [
  'channel_types' => [
    'email' => true,
    'sms' => false
  ],
  'workflows' => [
    'dinosaurs-loose' => [
      'channel_types' => [
        'email' => false,
        'in_app_feed' => true,
        'sms' => true
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
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

preferenceSet, _ := knockClient.Users.SetPreferences(ctx, user.ID, "default", knock.UserSetPreferencesParams{
  PreferenceSetRequest: knock.PreferenceSetRequestParam{
    ChannelTypes: param.Raw(map[string]interface{}{
      "email": true,
      "sms":   false,
    }),
    Workflows: param.Raw(map[string]interface{}{
      "dinosaurs-loose": map[string]interface{}{
        "channel_types": map[string]interface{}{
          "email":       false,
          "in_app_feed": true,
          "sms":         true,
        },
      },
    }),
  },
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.users.PreferenceSet;
import app.knock.api.models.users.UserSetPreferencesParams;
import app.knock.api.core.JsonValue;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

UserSetPreferencesParams params = UserSetPreferencesParams.builder()
    .userId(user.getId())
    .preferenceSetId("default")
    .channelTypes(UserSetPreferencesParams.ChannelTypes.builder()
        .putAdditionalProperty("email", JsonValue.from(true))
        .putAdditionalProperty("sms", JsonValue.from(false))
        .build())
    .workflows(UserSetPreferencesParams.Workflows.builder()
        .putAdditionalProperty("dinosaurs-loose", JsonValue.from(UserSetPreferencesParams.WorkflowPreference.builder()
            .channelTypes(UserSetPreferencesParams.ChannelTypes.builder()
                .putAdditionalProperty("email", JsonValue.from(false))
                .putAdditionalProperty("in_app_feed", JsonValue.from(true))
                .putAdditionalProperty("sms", JsonValue.from(true))
                .build())
            .build()))
        .build())
    .build();

PreferenceSet preferences = client.users().setPreferences(params);
`,
};

export default languages;
