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

client.users.identify(
  id="1",
  data={
    "name": "John Hammond",
    "email": "jhammond@ingen.net",
    "channel_data": {
      apns_channel_id: {
          "tokens": ["apns_push_token"]
      }
    }
  }
)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

# Get this value in your Knock dashboard
apns_channel_id = "some-channel-id-from-knock"

Knock::Users.identify(
  id: "1",
  data: {
    name: "John Hammond",
    email: "jhammond@ingen.net",
    channel_data: {
      apns_channel_id: {
        tokens: ["apns_push_token"]
      }
    }
  }
)
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
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

// Get this value in your Knock dashboard
apnsChannelId := "some-channel-id-from-knock"

user, _ := knockClient.Users.Identify(ctx, &knock.IdentifyUserRequest{
  ID: "1",
  Name: "John Hammond",
  Email: "jhammond@ingen.net",
  ChannelData: map[string]map{
    apnsChannelId: map[string]string {
      "tokens": ["apns-push-token"]
    }
  }
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

// Get this value in your Knock dashboard
String apnsChannelId = "some-channel-id-from-knock";

UserIdentity user = client.users().identify("1", UserIdentity.builder()
  .name("John Hammond")
  .email("jhammond@ingen.net")
  .property("channel_data",
    Map.of(
      apnsChannelId, Map.of(
      "tokens", List.of("apns-push-token")
      )
    )
  )
  .build());
`,
};

export default languages;
