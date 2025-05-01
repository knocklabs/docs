const languages = {
  curl: `
# Find the channel_id in your Knock dashboard under Integrations > Channels
curl -X PUT https://api.knock.app/v1/objects/projects/project-1/channel_data/9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "data": {
          "connections": [
            {
              "incoming_webhook": { "url": "url-from-teams" }
            }
          ]
        }
      }'
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  apiKey: process.env.KNOCK_API_KEY
});

// Find this value in your Knock dashboard under Integrations > Channels
const KNOCK_TEAMS_CHANNEL_ID = "9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f";

await knock.objects.setChannelData(
  "projects",
  project.id,
  KNOCK_TEAMS_CHANNEL_ID,
  {
    connections: [
      {
        incoming_webhook: { url: "url-from-teams" }
      },
    ],
  },
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

# Find this value in your Knock dashboard under Integrations > Channels
knock_teams_channel_id = "9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f"

Knock.Objects.set_channel_data(knock_client, "projects", project.id, knock_teams_channel_id, %{
  connections: [
    %{
      incoming_webhook: %{ url: "url-from-teams" }
    },
  ]
})
  `,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
knock_teams_channel_id = "9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f"

client.objects.set_channel_data(
  collection="projects",
  object_id=project.id,
  channel_id=knock_teams_channel_id,
  data={
    "connections": [
      {
        "incoming_webhook": { "url": "url-from-teams" }
      }
    ]
  }
)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
knock_teams_channel_id = "9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f"

Knock::Objects.set_channel_data(
  collection: "projects",
  id: project.id,
  channel_id: knock_teams_channel_id,
  channel_data: {
    connections: [
      {
        incoming_webhook: { url: "url-from-teams" }
      }
    ]
  }
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

// Find this value in your Knock dashboard under Integrations > Channels
var knockTeamsChannelId = "9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f";

var channelData = new Dictionary<string, object>{
  { "connections", new List<Dictionary<string, object>> {
    new Dictionary<string, object>{
      {"incoming_webhook", new Dictionary<string, string>{
        {"url", "url-from-teams"}
      }}
    }
  }}
};

await knockClient.Objects.SetChannelData(
  "projects",
  project.Id,
  knockTeamsChannelId,
  channelData
);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

// Find this value in your Knock dashboard under Integrations > Channels
$knockTeamsChannelId = '9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f';

$client->objects()->setChannelData('projects', 'project-1', $knockTeamsChannelId, [
  'connections' => [
    [
      'incoming_webhook' => [
        'url' => 'url-from-teams'
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

// Find this value in your Knock dashboard under Integrations > Channels
knockTeamsChannelID := "9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f"

channelData, _ := client.Objects.SetChannelData(ctx, &knock.SetObjectChannelDataRequest{
	Collection: "projects",
	ObjectID:   "project-1",
	ChannelID:  knockTeamsChannelID,
	Data: knock.MsTeamsChannelDataParam{
		Connections: param.New([]knock.MsTeamsChannelDataConnectionsUnionParam{
			knock.MsTeamsChannelDataConnectionsMsTeamsIncomingWebhookConnectionParam{
				IncomingWebhook: param.New(knock.MsTeamsChannelDataConnectionsMsTeamsIncomingWebhookConnectionIncomingWebhookParam{
					URL: param.New("url-from-teams"),
				}),
			},
		}),
	},
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.objects.ObjectSetChannelDataParams;
import app.knock.api.models.recipients.channeldata.ChannelData;
import app.knock.api.core.JsonValue;
import java.util.Arrays;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

// Find this value in your Knock dashboard under Integrations > Channels
String knockTeamsChannelId = "9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f";

ObjectSetChannelDataParams params = ObjectSetChannelDataParams.builder()
    .collection("projects")
    .objectId("project-1")
    .channelId(knockTeamsChannelId)
    .data(ObjectSetChannelDataParams.Data.builder()
        .putAdditionalProperty("connections", JsonValue.from(Arrays.asList(
            ObjectSetChannelDataParams.Data.Connection.builder()
                .incomingWebhook(ObjectSetChannelDataParams.Data.Connection.IncomingWebhook.builder()
                    .url("url-from-teams")
                    .build())
                .build()
        )))
        .build())
    .build();
ChannelData channelData = client.objects().setChannelData(params);
`,
};

export default languages;
