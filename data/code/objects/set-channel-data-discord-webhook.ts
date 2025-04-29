const languages = {
  curl: `
# Find the channel_id in your Knock dashboard under Integrations > Channels
curl -X PUT https://api.knock.app/v1/objects/projects/project-1/channel_data/7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "data": {
          "connections": [
            {
              "incoming_webhook": { "url": "url-from-discord" }
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
const KNOCK_DISCORD_CHANNEL_ID = "7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b";

await knock.objects.setChannelData(
  "projects",
  project.id,
  KNOCK_DISCORD_CHANNEL_ID,
  {
    connections: [
      {
        incoming_webhook: { url: "url-from-discord" }
      },
    ],
  },
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

# Find this value in your Knock dashboard under Integrations > Channels
knock_discord_channel_id = "7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b"

Knock.Objects.set_channel_data(knock_client, "projects", project.id, knock_discord_channel_id, %{
  connections: [
    %{
      incoming_webhook: %{ url: "url-from-discord" }
    },
  ]
})
  `,
  python: `
from knockapi import Knock
client = Knock(bearer_token="sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
knock_discord_channel_id = "7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b"

client.objects.set_channel_data(
  collection="projects",
  id=project.id,
  channel_id=knock_discord_channel_id,
  channel_data={
    "connections": [
      {
        "incoming_webhook": { "url": "url-from-discord" }
      }
    ]
  }
)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
knock_discord_channel_id = "7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b"

Knock::Objects.set_channel_data(
  collection: "projects",
  id: project.id,
  channel_id: knock_discord_channel_id,
  channel_data: {
    connections: [
      {
        incoming_webhook: { url: "url-from-discord" }
      }
    ]
  }
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

// Find this value in your Knock dashboard under Integrations > Channels
var knockDiscordChannelId = "7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b";

var channelData = new Dictionary<string, object>{
  { "connections", new List<Dictionary<string, object>> {
    new Dictionary<string, object>{
      {"incoming_webhook", new Dictionary<string, string>{
        {"url", "url-from-discord"}
      }}
    }
  }}
};

await knockClient.Objects.SetChannelData(
  "projects",
  project.Id,
  knockDiscordChannelId,
  channelData
);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

// Find this value in your Knock dashboard under Integrations > Channels
$knockDiscordChannelId = '7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b';

$client->objects()->setChannelData('projects', 'project-1', $knockDiscordChannelId, [
  'connections' => [
    [
      'incoming_webhook' => [
        'url' => 'url-from-discord'
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
knockDiscordChannelID := "7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b"

channelData, _ := knockClient.Objects.SetChannelData(ctx, &knock.SetObjectChannelDataRequest{
  Collection: "projects",
  ObjectID:   "project-1",
  ChannelID:  knockDiscordChannelID,
  Data: map[string]interface{}{
    "connections": []interface{}{
      map[string]interface{}{
        "incoming_webhook": map[string]interface{}{
          "url": "url-from-discord"
        }
      }
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

// Find this value in your Knock dashboard under Integrations > Channels
String knockDiscordChannelId = "7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b";

Map<String, Object> data = Map.of(
  "connections", List.of(
    Map.of("incoming_webhook", Map.of("url", "url-from-discord"))
  )
);

ChannelData channelData = client.objects().setChannelData(
  "projects",
  "project-1",
  knockDiscordChannelId,
  data
);
`,
};

export default languages;
