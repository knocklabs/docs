const languages = {
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({ bearerToken: process.env.KNOCK_API_KEY });

// Get this value in your Knock dashboard
const APNS_CHANNEL_ID = "some-channel-id-from-knock";

await knock.users.identify("1", {
  name: "John Hammond",
  email: "jhammond@ingen.net",
  channel_data: {
    APNS_CHANNEL_ID: {
      tokens: ["apns-push-token"]
    }
  }
});
`,
  elixir: `
knock_client = MyApp.Knock.client()

# Get this value in your Knock dashboard
apns_channel_id = "some-channel-id-from-knock"

Knock.Users.identify(knock_client, "1", %{
  name: "John Hammond",
  email: "jhammond@ingen.net",
  channel_data: %{
    apns_channel_id => %{
      "tokens" => ["apns-push-token"],
    }
  }
})
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

# Get this value in your Knock dashboard
apns_channel_id = "some-channel-id-from-knock"

client.users.update(
  user_id="1",
  name="John Hammond",
  email="jhammond@ingen.net",
  channel_data={
    apns_channel_id: {
      "tokens": ["apns_push_token"]
    }
  }
)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

# Get this value in your Knock dashboard
apns_channel_id = "some-channel-id-from-knock"

client.users.update("1", {
  name: "John Hammond",
  email: "jhammond@ingen.net",
  channel_data: {
    apns_channel_id: {
      tokens: ["apns_push_token"]
    }
  }
})
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" }
);

// Get this value in your Knock dashboard
var apnsChannelId = "some-channel-id-from-knock";

var params = new Dictionary<string, string>{
  {"name", "John Hammond"},
  {"email", "jhammond@ingen.net"},
  {"channel_data", new Dictionary<string, object>{
    {apnsChannelId, new Dictionary<string, object>{
      {"tokens", new List<string>{
        {"apns_push_token"}
      }}
    }}
  }}
};

var user = await knockClient.Users.Identify("1", params)
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

// Get this value in your Knock dashboard
$apns_channel_id = "some-channel-id-from-knock";

$client->users()->identify('1', [
  'name' => 'John Hammond',
  'email' => 'jhammond@ingen.net',
  'channel_data' => [
    $apns_channel_id => [
      'tokens' => ['apns-push-token'],
    ]
  ]
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

// Get this value in your Knock dashboard
apnsChannelId := "some-channel-id-from-knock"

user, _ := knockClient.Users.Update(ctx, "1", knock.UserUpdateParams{
  IdentifyUserRequest: knock.IdentifyUserRequestParam{
    Name:  param.String("John Hammond"),
    Email: param.String("jhammond@ingen.net"),
    ChannelData: param.Raw(map[string]interface{}{
      apnsChannelId: map[string]interface{}{
        "tokens": []string{"apns-push-token"},
      },
    }),
  },
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.users.User;
import app.knock.api.models.users.UserIdentifyParams;
import app.knock.api.core.JsonValue;
import java.util.List;
import java.util.Map;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

// Get this value in your Knock dashboard
String apnsChannelId = "some-channel-id-from-knock";

UserIdentifyParams params = UserIdentifyParams.builder()
    .userId("1")
    .name("John Hammond")
    .email("jhammond@ingen.net")
    .channelData(UserIdentifyParams.ChannelData.builder()
        .putAdditionalProperty(apnsChannelId, JsonValue.from(Map.of(
            "tokens", List.of("apns-push-token")
        )))
        .build())
    .build();

User user = client.users().identify(params);
`,
};

export default languages;
