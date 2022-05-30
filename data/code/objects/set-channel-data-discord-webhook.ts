const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.KNOCK_API_KEY);

await knockClient.objects.setChannelData(
  "projects",
  project.id,
  process.env.KNOCK_DISCORD_CHANNEL_ID,
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

discord_channel_id = "knock-discord-channel-id"

Knock.Objects.set_channel_data(knock_client, "projects", project.id, discord_channel_id, %{
  connections: [
    %{
      incoming_webhook: %{ url: "url-from-discord" }
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
  channel_id="knock-discord-channel-id", 
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

Knock.key = "sk_12345"

Knock::Objects.set_channel_data(
  collection: "projects",
  id: project.id,
  channel_id: "knock-discord-channel-id",
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

var channelData = new Dictionary<string, object>{
  { "connections", new List<Dictionary> {
    new Dictionary<string, object>{
      {"incoming_webhook", new Dictionary<string, object>{
        {"url", "url-from-discord"}
      }}
    }
  } }
};

await knockClient.Objects.SetChannelData(
  "projects", 
  project.Id, 
  "knock-discord-channel-id", 
  channelData
);
`,
  php: `
use Knock\\KnockSdk\\Client;
    
$client = new Client('sk_12345');

$client->objects()->setChannelData('projects', 'project-1', 'knock-discord-channel-id', [
  'connections' => [
    [
      'incoming_webhook' => [
        'url' => 'url-from-discord'
      ]
    ]
  ]
]);
`,
};

export default languages;
