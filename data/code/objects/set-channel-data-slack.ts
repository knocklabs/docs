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
client = Knock(bearer_token="sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
knock_slack_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

client.objects.set_channel_data(
  collection="projects",
  id=project.id,
  channel_id=knock_slack_channel_id,
  channel_data={
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

Knock::Objects.set_channel_data(
  collection: "projects",
  id: project.id,
  channel_id: knock_slack_channel_id,
  channel_data: {
    connections: [
      {
        incoming_webhook: { url: "url-from-slack" }
      }
    ]
  }
)
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
)

ctx := context.Background()
client := knock.NewClient("sk_12345")

// Find this value in your Knock dashboard under Integrations > Channels
knockSlackChannelID := "8209f26c-62a5-461d-95e2-a5716a26e652"

channelData, _ := knockClient.Objects.SetChannelData(ctx, &knock.SetObjectChannelDataRequest{
	Collection: "projects",
	ObjectID:   "project-1",
	ChannelID:  knockSlackChannelID,
	Data: map[string]interface{}{
		"connections": []interface{}{
			map[string]interface{}{
				"incoming_webhook": map[string]interface{}{
					"url": "url-from-slack",
				},
			},
		},
	},
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

Map<String, Object> data = Map.of(
  "connections", List.of(
    Map.of("incoming_webhook", Map.of("url", "url-from-slack"))
  )
);

// Find this value in your Knock dashboard under Integrations > Channels
String knockSlackChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

ChannelData channelData = client.objects().setChannelData(
  "projects",
  "project-1",
  knockSlackChannelId,
  data
);
`,
};

export default languages;
