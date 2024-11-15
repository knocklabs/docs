const languages = {
  curl: `
# Find the channel_id in your Knock dashboard under Integrations > Channels
curl -X GET https://api.knock.app/v1/users/1/channel_data/8209f26c-62a5-461d-95e2-a5716a26e652 \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: ` 
import { Knock } from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

// Find this value in your Knock dashboard under Integrations > Channels
const APNS_CHANNEL_ID = "8209f26c-62a5-461d-95e2-a5716a26e652";

const channelData = await knockClient.users.getChannelData(
  user.id,
  APNS_CHANNEL_ID,
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

# Find this value in your Knock dashboard under Integrations > Channels
apns_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

Knock.Users.get_channel_data(knock_client, user.id, apns_channel_id)
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
apns_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

client.users.get_channel_data(
  id=user.id,
  channel_id=apns_channel_id
)
`,
  ruby: `
require "knock"
Knock.key = "sk_12345"

# Find this value in your Knock dashboard under Integrations > Channels
apns_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

Knock::Users.get_channel_data(
  id: user.id,
  channel_id: apns_channel_id
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

// Find this value in your Knock dashboard under Integrations > Channels
var apnsChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.Users.GetChannelData(user.Id, apnsChannelId);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

// Find this value in your Knock dashboard under Integrations > Channels
$apns_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652";

$client->users()->getChannelData($user->id(), [
  'channel_id' => $apns_channel_id
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

// Find this value in your Knock dashboard under Integrations > Channels
apnsChannelId := "8209f26c-62a5-461d-95e2-a5716a26e652"

channel_data, _ := knockClient.Users.GetChannelData(ctx, &knock.GetUserChannelDataRequest{
  UserID:    user.ID,
  ChannelID: apnsChannelId
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

// Find this value in your Knock dashboard under Integrations > Channels
String apnsChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

ChannelData channelData = client.users().getUserChannelData(user.getId(), apnsChannelId);
`,
};

export default languages;
