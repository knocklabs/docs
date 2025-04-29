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
  bearerToken: process.env.KNOCK_API_KEY
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
client = Knock(bearer_token="sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
knock_teams_channel_id = "9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f"

client.objects.set_channel_data(
  collection="projects",
  id=project.id,
  channel_id=knock_teams_channel_id,
  channel_data={
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

client = Knockapi::Client.new(bearer_token: "sk_12345")

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
)

ctx := context.Background()
client := knock.NewClient("sk_12345")

// Find this value in your Knock dashboard under Integrations > Channels
knockTeamsChannelID := "9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f"

channelData, _ := knockClient.Objects.SetChannelData(ctx, &knock.SetObjectChannelDataRequest{
  Collection: "projects",
  ObjectID:   "project-1",
  ChannelID:  knockTeamsChannelID,
  Data: map[string]interface{}{
    "connections": []interface{}{
      map[string]interface{}{
        "incoming_webhook": map[string]interface{}{
          "url": "url-from-teams"
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
String knockTeamsChannelId = "9e8d7c6b-5a4f-3e2d-1c0b-9a8b7c6d5e4f";

Map<String, Object> data = Map.of(
  "connections", List.of(
    Map.of("incoming_webhook", Map.of("url", "url-from-teams"))
  )
);

ChannelData channelData = client.objects().setChannelData(
  "projects",
  "project-1",
  knockTeamsChannelId,
  data
);
`,
};

export default languages;
