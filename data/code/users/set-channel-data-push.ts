const languages = {
  node: `
import Knock from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

const CHANNEL_ID = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.users.setChannelData(user.id, CHANNEL_ID, {
  tokens: [userDeviceToken],
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
require "knock"
Knock.key = "sk_12345"

Knock::Users.set_channel_data(
  id: user.id,
  channel_id: "8209f26c-62a5-461d-95e2-a5716a26e652",
  channel_data: {
    tokens: [user_device_token]
  }
)  
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
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

channelData, _ := knockClient.Users.SetChannelData(ctx, &knock.SetUserChannelDataRequest{
  UserID:    user.ID,
  ChannelID: "5a88728a-3ecb-400d-ba6f-9c0956ab252f",
  Data: map[string]interface{}{
    "tokens": []string{}{
      apnsToken
    },
  },
})
  `,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

ChannelData channelData = client.users().setChannelData(
  user.getId(), 
  "5a88728a-3ecb-400d-ba6f-9c0956ab252f", 
  Map.of("tokens", List.of(apnsToken))
);
`,
};

export default languages;
