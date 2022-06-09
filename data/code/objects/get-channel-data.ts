const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

// Get this value in your Knock dashboard
const APNS_CHANNEL_ID = "some-channel-id-from-knock";

const channelData = await knockClient.objects.getChannelData(
  "projects",
  project.id,
  APNS_CHANNEL_ID,
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.get_channel_data(knock_client, "projects", project.id, "some-channel-id-from-knock")
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.objects.get_channel_data(
  collection="projects",
  id=project.id, 
  channel_id="some-channel-id-from-knock"
)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Objects.get_channel_data(
  collection: "projects",
  id: user.id,
  channel_id="some-channel-id-from-knock"
)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Objects.GetChannelData("projects", project.Id, "some-channel-id-from-knock"); 
`,
  php: `
use Knock\\KnockSdk\\Client;
    
$client = new Client('sk_12345');

$client->objects()->getChannelData('projects', 'project-1', 'some-channel-id-from-knock');
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

channelData, _ := knockClient.Objects.GetChannelData(ctx, &knock.GetObjectChannelDataRequest{
  Collection: "projects",
  ObjectID:   "project-1",
  ChannelID:  "some-channel-id-from-knock"
})
`,
};

export default languages;
