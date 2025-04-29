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
const knockClient = new Knock("sk_12345");

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
require "knock"
Knock.key = "sk_12345"

Knock::Users.set_preferences(
  user_id: user.id,
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
)
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
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

request := &knock.SetUserPreferencesRequest{UserID: user.ID}

request.AddChannelTypesPreference(map[string]interface{}{
  "email": true,
  "sms": false
})

request.AddWorkflowsPreference(map[string]interface{}{
  "dinosaurs-loose": map[string]interface{}{
    "channel_types": map[string]interface{}{
      "email":       false,
      "in_app_feed": true,
      "sms":         true,
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
  .email(true)
  .sms(false)
  .workflow("dinosaurs-loose",
    new PreferenceSetBuilder()
      .email(false)
      .inAppFeed(true)
      .sms(true)
      .build()
  )
  .build();

PreferenceSet preferences = client.users().setPreferences(user.getId(), request);
`,
};

export default languages;
