const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.KNOCK_API_KEY);

await knockClient.objects.setChannelData(
  "projects",
  project.id,
  process.env.KNOCK_SLACK_CHANNEL_ID,
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

slack_channel_id = "knock-slack-channel-id"

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

client.objects.set_channel_data(
  collection="projects",
  id=project.id,
  channel_id="knock-slack-channel-id", 
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

Knock.key = "sk_12345"

Knock::Objects.set_channel_data(
  collection: "projects",
  id: project.id,
  channel_id: "knock-slack-channel-id",
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

await knockClient.Objects.SetChannelData(
  "projects", 
  project.Id, 
  "knock-slack-channel-id", 
  channelData
);
`,
  php: `
use Knock\\KnockSdk\\Client;
    
$client = new Client('sk_12345');

$client->objects()->setChannelData('projects', 'project-1', 'knock-slack-channel-id', [
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

channelData, _ := knockClient.Objects.SetChannelData(ctx, &knock.SetObjectSetChannelDataRequest{
  Collection: "projects",
  ObjectID:   "project-1",
  ChannelID:  "knock-slack-channel-id",
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
};

export default languages;
