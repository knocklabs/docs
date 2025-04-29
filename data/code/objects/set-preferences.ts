const languages = {
  curl: `
curl -X PUT https://api.knock.app/v1/objects/projects/project-1/preferences/default \\
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
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

await knock.objects.setPreferences("projects", "project-1", {
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

client.objects.set_preferences(
  collection="projects",
  object_id="project-1",
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
        "sms": True
      }
    }
  }
)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

client.objects.set_preferences("projects", "project-1", "default", {
  channel_types: {
    email: true,
    sms: false
  },
  workflows: {
    "dinosaurs-loose": {
      channel_types: {
        email: false,
        in_app_feed: true,
        sms: true
      }
    }
  }
})
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var preferenceSetUpdate = new SetPreferencesOptions {
  ChannelTypes = new Dictionary<string, boolean> {
    {"email", false},
    {"sms", false}
  },
  Workflows = new Dictionary<string, object> {
    {"dinosaurs-loose", new Dictionary<string, object> {
      {"channel_types", new Dictionary<string, boolean> {
        {"email", false},
        {"in_app_feed", true},
        {"sms", true}
      }}
    }}
  }
};

await knockClient.Objects.SetPreferences("projects", "project-1", preferenceSetUpdate);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.set_preferences(knock_client, "projects", "project-1", %{
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

$client->objects()->setPreferences('projects', 'project-1', [
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
)

ctx := context.Background()
client := knock.NewClient("sk_12345")

request := &knock.SetObjectPreferencesRequest{
  Collection: "projects",
  ObjectID:   "project-1",
}

request.AddChannelTypesPreference(map[string]interface{}{
  "email": true,
  "sms":   false,
})

request.AddWorkflowsPreference(map[string]interface{}{
  "dinosaurs-loose": map[string]interface{}{
    "channel_types": map[string]interface{}{
      "email":       false,
      "in_app_feed": true,
      "sms":         false
    },
  }
})

preferenceSet, _ := knockClient.Objects.SetPreferences(ctx, request)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

PreferenceSetRequest request = PreferenceSetRequest.builder()
  .email(true)
  .sms(false)
  .workflow("dinosaurs-loose",
    new PreferenceSetBuilder()
      .email(false)
      .inAppFeed(true)
      .sms(false)
      .build()
  )
  .build();

client.objects().setPreferences("projects", "project-1", request);
`,
};

export default languages;
