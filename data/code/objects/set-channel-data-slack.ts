const languages = {
  curl: `
# Find the channel_id in your Knock dashboard under Integrations > Channels
curl -X PUT https://api.knock.app/v1/objects/projects/project-1/channel_data/8209f26c-62a5-461d-95e2-a5716a26e652 \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "data": {
          "channel_data": {
            "connections": [
              {
                "incoming_webhook": {
                  "url": "url-from-slack"
                }
              }
            ]
          }
        }
      }'
`,
  node: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.KNOCK_API_KEY);

// Find this value in your Knock dashboard under Integrations > Channels
const SLACK_CHANNEL_ID = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.objects.setChannelData(
  "projects",
  project.id,
  SLACK_CHANNEL_ID,
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
slack_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

Knock.Objects.set_channel_data(knock_client, "projects", project.id, slack_channel_id, %{
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
slack_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

client.objects.set_channel_data(
  collection="projects",
  id=project.id,
  channel_id=slack_channel_id, 
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
require "knock"
Knock.key = "sk_12345"

# Find this value in your Knock dashboard under Integrations > Channels
slack_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

Knock::Objects.set_channel_data(
  collection: "projects",
  id: project.id,
  channel_id: slack_channel_id,
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
  { "connections", new List<Dictionary> {
    new Dictionary<string, object>{
      {"incoming_webhook", new Dictionary<string, object>{
        {"url", "url-from-slack"}
      }}
    }
  } }
};

// Find this value in your Knock dashboard under Integrations > Channels
var slackChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.Objects.SetChannelData(
  "projects", 
  project.Id, 
  slackChannelId, 
  channelData
);
`,
  php: `
use Knock\\KnockSdk\\Client;
    
$client = new Client('sk_12345');

// Find this value in your Knock dashboard under Integrations > Channels
$slackChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

$client->objects()->setChannelData('projects', 'project-1', $slackChannelId, [
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
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

// Find this value in your Knock dashboard under Integrations > Channels
slackChannelID := "8209f26c-62a5-461d-95e2-a5716a26e652"

channelData, _ := knockClient.Objects.SetChannelData(ctx, &knock.SetObjectChannelDataRequest{
  Collection: "projects",
  ObjectID:   "project-1",
  ChannelID:  slackChannelID,
  Data: map[string]interface{}{
    "connections": []interface{}{
      map[string]interface{}{
        "incoming_webhook": map[string]interface{}{
          "url": "url-from-slack"
        }
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

Map<String, Object> data = Map.of(
  "connections", List.of(
    Map.of("incoming_webhook", Map.of("url", "url-from-slack"))
  )
);

// Find this value in your Knock dashboard under Integrations > Channels
String slackChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

ChannelData channelData = client.objects().setChannelData(
  "projects",
  "project-1",
  slackChannelId,
  data
);
`,
};

export default languages;
