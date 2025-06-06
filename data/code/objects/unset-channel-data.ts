const languages = {
  curl: `
# Find the channel_id in your Knock dashboard under Integrations > Channels
curl -X DELETE https://api.knock.app/v1/objects/projects/project-1/channel_data/8209f26c-62a5-461d-95e2-a5716a26e652 \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  apiKey: process.env.KNOCK_API_KEY
});

// Find this value in your Knock dashboard under Integrations > Channels
const KNOCK_CHANNEL_ID = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knock.objects.unsetChannelData(
  "projects",
  project.id,
  KNOCK_CHANNEL_ID
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

# Find this value in your Knock dashboard under Integrations > Channels
knock_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

Knock.Objects.unset_channel_data(knock_client, "projects", project.id, knock_channel_id)
  `,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
knock_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

client.objects.unset_channel_data(
  collection="projects",
  object_id=project.id,
  channel_id=knock_channel_id
)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
knock_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

client.objects.unset_channel_data("projects", project.id, knock_channel_id)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

// Find this value in your Knock dashboard under Integrations > Channels
var knockChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.Objects.SetChannelData(
  "projects",
  project.Id,
  knockChannelId
);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

// Find this value in your Knock dashboard under Integrations > Channels
$knockChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

$client->objects()->unsetChannelData('projects', 'project-1', $knockChannelId);
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
)

ctx := context.Background()
client := knock.NewClient(option.WithAPIKey("sk_12345"))

// Find this value in your Knock dashboard under Integrations > Channels
knockChannelID := "8209f26c-62a5-461d-95e2-a5716a26e652"

response, _ := client.Objects.DeleteChannelData(ctx, &knock.DeleteObjectChannelDataRequest{
	Collection: "projects",
	ObjectID:   "project-1",
	ChannelID:  knockChannelID,
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.objects.ObjectUnsetChannelDataParams;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

// Find this value in your Knock dashboard under Integrations > Channels
String knockChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

ObjectUnsetChannelDataParams params = ObjectUnsetChannelDataParams.builder()
    .collection("projects")
    .objectId("project-1")
    .channelId(knockChannelId)
    .build();
client.objects().unsetChannelData(params);
`,
};

export default languages;
