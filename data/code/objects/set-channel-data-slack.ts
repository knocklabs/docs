const languages = {
  curl: `
# Find the channel_id in your Knock dashboard under Integrations > Channels
curl -X PUT https://api.knock.app/v1/objects/projects/project-1/channel_data/8209f26c-62a5-461d-95e2-a5716a26e652 \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "data": {
          "connections": [
            {
              "incoming_webhook": {
                "url": "url-from-slack"
              }
            }
          ]
        }
      }'
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

// Find this value in your Knock dashboard under Integrations > Channels
const KNOCK_SLACK_CHANNEL_ID = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knock.objects.setChannelData(
  "projects",
  project.id,
  KNOCK_SLACK_CHANNEL_ID,
  {
    connections: [
      {
        incoming_webhook: { url: "url-from-slack" }
      },
    ],
  },
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

# Find this value in your Knock dashboard under Integrations > Channels
knock_slack_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

Knock.Objects.set_channel_data(knock_client, "projects", project.id, knock_slack_channel_id, %{
  connections: [
    %{
      incoming_webhook: %{ url: "url-from-slack" }
    },
  ]
})
  `,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
knock_slack_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

client.objects.set_channel_data(
  collection="projects",
  object_id=project.id,
  channel_id=knock_slack_channel_id,
  data={
    "connections": [
      {
        "incoming_webhook": { "url": "url-from-slack" }
      }
    ]
  }
)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
knock_slack_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

client.objects.set_channel_data("projects", project.id, knock_slack_channel_id, {
  connections: [
    {
      incoming_webhook: { url: "url-from-slack" }
    }
  ]
})
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var channelData = new Dictionary<string, object>{
  { "connections", new List<Dictionary<string, object>> {
    new Dictionary<string, object>{
      {"incoming_webhook", new Dictionary<string, string>{
        {"url", "url-from-slack"}
      }}
    }
  } }
};

// Find this value in your Knock dashboard under Integrations > Channels
var knockSlackChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.Objects.SetChannelData(
  "projects",
  project.Id,
  knockSlackChannelId,
  channelData
);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

// Find this value in your Knock dashboard under Integrations > Channels
$knockSlackChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

$client->objects()->setChannelData('projects', 'project-1', $knockSlackChannelId, [
  'connections' => [
    [
      'incoming_webhook' => [
        'url' => 'url-from-slack'
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
client := knock.NewClient(option.WithBearerToken("sk_12345"))

// Find this value in your Knock dashboard under Integrations > Channels
knockSlackChannelID := "8209f26c-62a5-461d-95e2-a5716a26e652"

channelData, _ := client.Objects.SetChannelData(ctx, &knock.SetObjectChannelDataRequest{
	Collection: "projects",
	ObjectID:   "project-1",
	ChannelID:  knockSlackChannelID,
	Data: knock.SlackChannelDataParam{
		Connections: param.New([]knock.SlackChannelDataConnectionsUnionParam{
			knock.SlackChannelDataConnectionsSlackIncomingWebhookConnectionParam{
				URL: param.New("url-from-slack"),
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
    .bearerToken("sk_12345")
    .build();

// Find this value in your Knock dashboard under Integrations > Channels
String knockSlackChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

ObjectSetChannelDataParams params = ObjectSetChannelDataParams.builder()
    .collection("projects")
    .objectId("project-1")
    .channelId(knockSlackChannelId)
    .data(ObjectSetChannelDataParams.Data.builder()
        .putAdditionalProperty("connections", JsonValue.from(Arrays.asList(
            ObjectSetChannelDataParams.Data.Connection.builder()
                .incomingWebhook(ObjectSetChannelDataParams.Data.Connection.IncomingWebhook.builder()
                    .url("url-from-slack")
                    .build())
                .build()
        )))
        .build())
    .build();
ChannelData channelData = client.objects().setChannelData(params);
`,
};

export default languages;
