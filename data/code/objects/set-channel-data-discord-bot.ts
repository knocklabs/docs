const languages = {
  curl: `
# Find the ID for your Discord integration in your Knock dashboard under Integrations > Channels
curl -X PUT https://api.knock.app/v1/objects/projects/project-1/channel_data/7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "data": {
          "connections": [
            {
              "channel_id": "channel-id-from-discord"
            }
          ]
        }
      }'
`,
  node: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.KNOCK_API_KEY);

// Find this value in your Knock dashboard under Integrations > Channels
const KNOCK_DISCORD_CHANNEL_ID = "7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b";

await knockClient.objects.setChannelData(
  "projects",
  project.id,
  KNOCK_DISCORD_CHANNEL_ID,
  {
    connections: [
      {
        channel_id: "channel-id-from-discord"
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
      channel_id: "channel-id-from-discord"
    },
  ]
})
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
knock_discord_channel_id = "7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b"

client.objects.set_channel_data(
  collection="projects",
  id=project.id,
  channel_id=knock_discord_channel_id, 
  channel_data={
    "connections": [
      { 
        "channel_id": "channel-id-from-discord"
      }
    ]
  }
)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

# Find this value in your Knock dashboard under Integrations > Channels
knock_discord_channel_id = "7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b"

Knock::Objects.set_channel_data(
  collection: "projects",
  id: project.id,
  channel_id: knock_discord_channel_id,
  channel_data: {
    connections: [
      { 
        channel_id: "channel-id-from-discord"
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
    new Dictionary<string, string>{
      {"channel_id", "channel-id-from-discord"}
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
$knockDiscordChannelId = "7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b";

$client->objects()->setChannelData('projects', 'project-1', $knockDiscordChannelId, [
  'connections' => [
    ['channel_id' => 'channel-id-from-discord']
  ]
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

// Find this value in your Knock dashboard under Integrations > Channels
knockDiscordChannelId := "7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b"

channelData, _ := knockClient.Objects.SetChannelData(ctx, &knock.SetObjectChannelDataRequest{
  Collection: "projects",
  ObjectID:   "project-1",
  ChannelID:  knockDiscordChannelId,
  Data: map[string]interface{}{
    "connections": []interface{}{
      map[string]interface{}{
        "channel_id": "channel-id-from-discord"
      }
    },
  },
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

// Find this value in your Knock dashboard under Integrations > Channels
String knockDiscordChannelId = "7f1b3d5a-9c8e-4f2d-b6a7-3e2c8d9f0e1b";

Map<String, Object> data = Map.of(
  "connections", List.of(
    Map.of("channel_id", "channel-id-from-discord")
  )
)

ChannelData channelData = client.objects().setChannelData(
  "projects",
  "project-1",
  knockDiscordChannelId,
  data
);
`,
};

export default languages;
