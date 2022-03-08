const code = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.KNOCK_API_KEY);

await knockClient.objects.setChannelData(
  "projects",
  project.id,
  process.env.KNOCK_TEAMS_CHANNEL_ID,
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

teams_channel_id = "knock-teams-channel-id"

Knock.Objects.set_channel_data(knock_client, "projects", project.id, teams_channel_id, %{
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

client.objects.set_channel_data(
  collection="projects",
  id=project.id,
  channel_id="knock-teams-channel-id", 
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

Knock.key = "sk_12345"

Knock::Objects.set_channel_data(
  collection: "projects",
  id: project.id,
  channel_id: "knock-teams-channel-id",
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

var channelData = new Dictionary<string, object>{
  { "connections", new List<Dictionary> {
    new Dictionary<string, object>{
      {"incoming_webhook", new Dictionary<string, object>{
        {"url", "url-from-teams"}
      }}
    }
  } }
};

await knockClient.Objects.SetChannelData(
  "projects", 
  project.Id, 
  "knock-teams-channel-id", 
  channelData
);
`,
};

export default code;
