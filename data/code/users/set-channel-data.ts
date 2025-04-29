const languages = {
  curl: `
# Find the channel_id in your Knock dashboard under Integrations > Channels
curl -X PUT https://api.knock.app/v1/users/1/channel_data/8209f26c-62a5-461d-95e2-a5716a26e652 \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer sk_test_12345" \\
  -d '{
        "data": {
          "channel_data": {
            "tokens": ["user_device_token"]
          }
        }
      }'
`,
  node: `
import Knock from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

// Find this value in your Knock dashboard under Integrations > Channels
const APNS_CHANNEL_ID = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.users.setChannelData(user.id, APNS_CHANNEL_ID, {
  tokens: [userDeviceToken],
});
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
apns_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

client.users.set_channel_data(
  user_id=user.id, 
  channel_id=apns_channel_id,
  data={
    "tokens": [user_device_token]
  }
)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

# Find this value in your Knock dashboard under Integrations > Channels
apns_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

client.users.set_channel_data(user.id, apns_channel_id, {
  tokens: [user_device_token]
})
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var channelData = new Dictionary<string, object>{
  { "tokens", new List<string> { userDeviceToken } }
};

// Find this value in your Knock dashboard under Integrations > Channels
var apnsChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.Users.SetChannelData(user.Id, apnsChannelId, channelData)  
`,
  elixir: `
knock_client = MyApp.Knock.client()

# Find this value in your Knock dashboard under Integrations > Channels
apns_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652"

Knock.Users.set_channel_data(knock_client, user.id, apns_channel_id, %{
  tokens: [user_device_token],
})
`,
  php: `
use Knock\\KnockSdk\\Client;
  
$client = new Client('sk_12345');

// Find this value in your Knock dashboard under Integrations > Channels
$apns_channel_id = "8209f26c-62a5-461d-95e2-a5716a26e652";
  
$client->users()->setChannelData($user->id(), $apns_channel_id, [
  'tokens' => [$userDeviceToken]
]);
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
	"github.com/knocklabs/knock-go/param"
)
ctx := context.Background()
knockClient := knock.NewClient(option.WithBearerToken("sk_12345"))

// Find this value in your Knock dashboard under Integrations > Channels
apnsChannelId := "8209f26c-62a5-461d-95e2-a5716a26e652"

channelData, _ := knockClient.Users.SetChannelData(ctx, user.ID, apnsChannelId, knock.UserSetChannelDataParams{
  ChannelDataRequest: knock.ChannelDataRequestParam{
    Data: param.Raw(map[string]interface{}{
      "tokens": []string{userDeviceToken},
    }),
  },
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.users.ChannelData;
import app.knock.api.models.users.UserSetChannelDataParams;
import app.knock.api.core.JsonValue;
import java.util.List;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

// Find this value in your Knock dashboard under Integrations > Channels
String apnsChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

UserSetChannelDataParams params = UserSetChannelDataParams.builder()
    .userId(user.getId())
    .channelId(apnsChannelId)
    .data(UserSetChannelDataParams.Data.builder()
        .putAdditionalProperty("tokens", JsonValue.from(List.of(userDeviceToken)))
        .build())
    .build();

ChannelData channelData = client.users().setChannelData(params);
`,
};

export default languages;
