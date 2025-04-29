const languages = {
  curl: `
# Find the channel_id in your Knock dashboard under Integrations > Channels
curl -X GET https://api.knock.app/v1/users/1/channel_data/8209f26c-62a5-461d-95e2-a5716a26e652 \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: ` 
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

// Find this value in your Knock dashboard under Integrations > Channels
const APNS_CHANNEL_ID = "8209f26c-62a5-461d-95e2-a5716a26e652";

const channelData = await knock.users.getChannelData(
  user.id,
  APNS_CHANNEL_ID
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
  user_id=user.id,
  channel_id=apns_channel_id
)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
apns_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

client.users.get_channel_data(user.id, apns_channel_id)
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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
)

ctx := context.Background()
knockClient := knock.NewClient(option.WithBearerToken("sk_12345"))

// Find this value in your Knock dashboard under Integrations > Channels
apnsChannelId := "8209f26c-62a5-461d-95e2-a5716a26e652"

channelData, _ := knockClient.Users.GetChannelData(ctx, user.ID, apnsChannelId)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.users.ChannelData;
import app.knock.api.models.users.UserGetChannelDataParams;

// Find this value in your Knock dashboard under Integrations > Channels
String apnsChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

ChannelData channelData = client.users().getChannelData(UserGetChannelDataParams.builder()
    .userId(user.getId())
    .channelId(apnsChannelId)
    .build());
`,
};

export default languages;
