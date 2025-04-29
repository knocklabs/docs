const languages = {
  node: `
import Knock from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

await knockClient.users.setPreferences("jhammond", tenant.id, {
  channel_types: { email: true, sms: false },
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
  id=tenant.id,
  channel_types={ "email": True, "sms": False },
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

client = Knockapi::Client.new(bearer_token: "sk_12345")

client.users.set_preferences(user.id, tenant.id, {
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

await knockClient.Users.SetPreferences("jhammond", preferenceSetUpdate, tenant.id);
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
}, preference_set: tenant.id)
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
], tenant.id);
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
  ChannelTypes: map[string]interface{}{
    "email": true,
    "sms":   false,
  },
  Workflows: map[string]interface{}{
    "dinosaurs-loose": map[string]interface{}{
      "channel_types": map[string]interface{}{
        "email":       false,
        "in_app_feed": true,
        "sms":         true,
      },
    },
  },
}

preferenceSet, _ := knockClient.Users.SetPreferences(ctx, user.ID, tenant.ID, &knock.UserSetPreferencesParams{
  PreferenceSetRequest: *preferenceSetRequest,
})
  `,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.users.PreferenceSet;
import app.knock.api.models.users.UserSetPreferencesParams;
import app.knock.api.core.JsonValue;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

UserSetPreferencesParams params = UserSetPreferencesParams.builder()
    .userId(user.getId())
    .preferenceSetId(tenant.getId())
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
