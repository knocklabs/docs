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
  apiKey: process.env.KNOCK_API_KEY
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

client = Knockapi::Client.new(api_key: "sk_12345")

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
	"github.com/knocklabs/knock-go/option"
)

ctx := context.Background()
client := knock.NewClient(option.WithAPIKey("sk_12345"))

preferenceSet, _ := client.Objects.SetPreferences(ctx, &knock.SetObjectPreferencesRequest{
	Collection: "projects",
	ObjectID:   "project-1",
	ID:         "default",
	ChannelTypes: param.New(knock.PreferenceSetChannelTypesParam{
		Email: param.New(true),
		SMS:   param.New(false),
	}),
	Workflows: param.New(map[string]knock.PreferenceSetRequestWorkflowsUnionParam{
		"dinosaurs-loose": knock.PreferenceSetRequestWorkflowsPreferenceSetWorkflowCategorySettingObjectParam{
			ChannelTypes: param.New(knock.PreferenceSetChannelTypesParam{
				Email:     param.New(false),
				InAppFeed: param.New(true),
				SMS:       param.New(true),
			}),
		},
	}),
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.objects.ObjectSetPreferencesParams;
import app.knock.api.models.recipients.preferences.PreferenceSet;
import app.knock.api.core.JsonValue;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

ObjectSetPreferencesParams params = ObjectSetPreferencesParams.builder()
    .collection("projects")
    .objectId("project-1")
    .id("default")
    .channelTypes(ObjectSetPreferencesParams.ChannelTypes.builder()
        .putAdditionalProperty("email", JsonValue.from(true))
        .putAdditionalProperty("sms", JsonValue.from(false))
        .build())
    .workflows(ObjectSetPreferencesParams.Workflows.builder()
        .putAdditionalProperty("dinosaurs-loose", JsonValue.from(ObjectSetPreferencesParams.Workflow.builder()
            .channelTypes(ObjectSetPreferencesParams.ChannelTypes.builder()
                .putAdditionalProperty("email", JsonValue.from(false))
                .putAdditionalProperty("in_app_feed", JsonValue.from(true))
                .putAdditionalProperty("sms", JsonValue.from(true))
                .build())
            .build()))
        .build())
    .build();
PreferenceSet preferenceSet = client.objects().setPreferences(params);
`,
};

export default languages;
