const languages = {
  node: `
import Knock from "@knocklabs/node";
const knockClient = new Knock({ bearerToken: process.env.KNOCK_API_KEY });

const CHANNEL_ID = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.users.setChannelData(user.id, CHANNEL_ID, {
  player_ids: [oneSignalPlayerId]
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.set_channel_data(
  user_id=user.id,
  channel_id="8209f26c-62a5-461d-95e2-a5716a26e652",
  data={
    "player_ids": [oneSignalPlayerId]
  }
)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

client.users.set_channel_data(user.id, "8209f26c-62a5-461d-95e2-a5716a26e652", {
  player_ids: [oneSignalPlayerId]
})
  `,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var channelData = new Dictionary<string, object>{
  { "player_ids", new List<string> { oneSignalPlayerId } }
};

var channelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.Users.SetChannelData(user.Id, channelId, channelData);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.set_channel_data(knock_client, user.id, "8209f26c-62a5-461d-95e2-a5716a26e652", %{
  player_ids: [oneSignalPlayerId],
})
  `,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->setChannelData($user->id(), '5a88728a-3ecb-400d-ba6f-9c0956ab252f', [
  'player_ids' => [$oneSignalPlayerId]
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

channelData, _ := knockClient.Users.SetChannelData(ctx, user.ID, "5a88728a-3ecb-400d-ba6f-9c0956ab252f", knock.UserSetChannelDataParams{
  ChannelDataRequest: knock.ChannelDataRequestParam{
    Data: param.Raw(map[string]interface{}{
      "player_ids": []string{oneSignalPlayerId},
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

UserSetChannelDataParams params = UserSetChannelDataParams.builder()
    .userId(user.getId())
    .channelId("5a88728a-3ecb-400d-ba6f-9c0956ab252f")
    .data(UserSetChannelDataParams.Data.builder()
        .putAdditionalProperty("player_ids", JsonValue.from(List.of(oneSignalPlayerId)))
        .build())
    .build();

ChannelData channelData = client.users().setChannelData(params);
`,
};

export default languages;
