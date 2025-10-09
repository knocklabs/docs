const languages = {
  node: `
import Knock from "@knocklabs/node";
const knockClient = new Knock({ apiKey: process.env.KNOCK_API_KEY });

const CHANNEL_ID = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.users.setChannelData(user.id, CHANNEL_ID, {
  data: { tokens: [userDeviceToken] }
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.set_channel_data(
  user_id=user.id,
  channel_id="8209f26c-62a5-461d-95e2-a5716a26e652",
  data={
    "tokens": [user_device_token]
  }
)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

client.users.set_channel_data(user.id, "8209f26c-62a5-461d-95e2-a5716a26e652", {
  tokens: [user_device_token]
})
  `,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var channelData = new Dictionary<string, object>{
  { "tokens", new List<string> { userDeviceToken } }
};

var channelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.Users.SetChannelData(user.Id, channelId, channelData);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.set_channel_data(knock_client, user.id, "8209f26c-62a5-461d-95e2-a5716a26e652", %{
  tokens: [user_device_token],
})
  `,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->setChannelData($user->id(), '5a88728a-3ecb-400d-ba6f-9c0956ab252f', [
  'tokens' => [$apnsToken]
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
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

channelData, _ := knockClient.Users.SetChannelData(ctx, user.ID, "5a88728a-3ecb-400d-ba6f-9c0956ab252f", knock.UserSetChannelDataParams{
  ChannelDataRequest: knock.ChannelDataRequestParam{
    Data: param.Raw(map[string]interface{}{
      "tokens": []string{apnsToken},
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
    .apiKey("sk_12345")
    .build();

UserSetChannelDataParams params = UserSetChannelDataParams.builder()
    .userId(user.getId())
    .channelId("5a88728a-3ecb-400d-ba6f-9c0956ab252f")
    .data(UserSetChannelDataParams.Data.builder()
        .putAdditionalProperty("tokens", JsonValue.from(List.of(apnsToken)))
        .build())
    .build();

ChannelData channelData = client.users().setChannelData(params);
`,
};

export default languages;
