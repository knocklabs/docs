const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

// Get this value in your Knock dashboard
const APNS_CHANNEL_ID = "some-channel-id-from-knock";

const channelData = await knockClient.users.getChannelData(
  "jhammond",
  APNS_CHANNEL_ID,
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

# Get this value in your Knock dashboard
apns_channel_id = "some-channel-id-from-knock"

Knock.Users.get_channel_data(knock_client, user.id, apns_channel_id)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

# Get this value in your Knock dashboard
apns_channel_id = "some-channel-id-from-knock"

client.users.get_channel_data(
  id=user.id,
  channel_id=apns_channel_id
)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

# Get this value in your Knock dashboard
apns_channel_id = "some-channel-id-from-knock"

Knock::Users.get_channel_data(
  id: user.id,
  channel_id: apns_channel_id
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

// Get this value in your Knock dashboard
var apnsChannelId = "some-channel-id-from-knock";

await knockClient.Users.GetChannelData(user.Id, apnsChannelId);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

// Get this value in your Knock dashboard
$apns_channel_id = "some-channel-id-from-knock";

$client->users()->getChannelData($user->id(), [
  'channel_id' => $apns_channel_id
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

// Get this value in your Knock dashboard
apnsChannelId := "some-channel-id-from-knock"

channel_data, _ := knockClient.Users.GetChannelData(ctx, &knock.GetUserChannelDataRequest{
  UserID:    user.ID,
  ChannelID: apnsChannelId
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

// Get this value in your Knock dashboard
String apnsChannelId = "some-channel-id-from-knock";

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

ChannelData channelData = client.users().getUserChannelData(user.getId(), apnsChannelId);
`,
};

export default languages;
