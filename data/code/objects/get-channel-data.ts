const languages = {
  curl: `
# Find the channel_id in your Knock dashboard under Integrations > Channels
curl -X GET https://api.knock.app/v1/objects/projects/project-1/channel_data/8209f26c-62a5-461d-95e2-a5716a26e652 \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

// Find this value in your Knock dashboard under Integrations > Channels
const APNS_CHANNEL_ID = "8209f26c-62a5-461d-95e2-a5716a26e652";

const channelData = await knockClient.objects.getChannelData(
  "projects",
  project.id,
  APNS_CHANNEL_ID,
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

# Find this value in your Knock dashboard under Integrations > Channels
apns_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

Knock.Objects.get_channel_data(knock_client, "projects", project.id, apns_channel_id)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
apns_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

client.objects.get_channel_data(
  collection="projects",
  id=project.id, 
  channel_id=apns_channel_id
)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

# Find this value in your Knock dashboard under Integrations > Channels
apns_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

Knock::Objects.get_channel_data(
  collection: "projects",
  id: project.id,
  channel_id: apns_channel_id
)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

// Find this value in your Knock dashboard under Integrations > Channels
var apnsChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.Objects.GetChannelData("projects", project.Id, apnsChannelId); 
`,
  php: `
use Knock\\KnockSdk\\Client;
    
$client = new Client('sk_12345');

// Find this value in your Knock dashboard under Integrations > Channels
$apnsChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

$client->objects()->getChannelData('projects', 'project-1', $apnsChannelId);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

// Find this value in your Knock dashboard under Integrations > Channels
apnsChannelId := "8209f26c-62a5-461d-95e2-a5716a26e652"

channelData, _ := knockClient.Objects.GetChannelData(ctx, &knock.GetObjectChannelDataRequest{
  Collection: "projects",
  ObjectID:   "project-1",
  ChannelID:  apnsChannelId
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

// Find this value in your Knock dashboard under Integrations > Channels
String apnsChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

ChannelData channelData = client.objects().getChannelData("projects", "project-1", apnsChannelId);
`,
};

export default languages;
