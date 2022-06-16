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
        channel_id: "discord-channel-id"
      },
    ],
  },
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

knock_discord_channel_id = "knock-discord-channel-id"

Knock.Objects.set_channel_data(knock_client, "projects", project.id, knock_discord_channel_id, %{
  connections: [
    %{
      channel_id: "discord-channel-id"
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
        "channel_id": "discord-channel-id"
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
        channel_id: "discord-channel-id"
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
    new Dictionary<string, string>{
      {"channel_id", "discord-channel-id"}
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
    ['channel_id' => 'discord-channel-id']
  ]
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

channelData, _ := knockClient.Objects.SetChannelData(ctx, &knock.SetObjectChannelDataRequest{
  Collection: "projects",
  ObjectID:   "project-1",
  ChannelID:  "knock-discord-channel-id",
  Data: map[string]interface{}{
    "connections": []interface{}{
      map[string]interface{}{
        "channel_id": "discord-channel-id"
      }
    },
  },
})
`,
};

export default languages;
