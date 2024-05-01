const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.users.identify("1", {
  name: "John Hammond",
  email: "jhammond@ingen.net",
  channel_data: {
    "{{ channelId }}": {
      tokens: ["apns-push-token"]
    }
  }
});
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.identify(knock_client, "1", %{
  name: "John Hammond",
  email: "jhammond@ingen.net",
  channel_data: %{
    "{{ channel_id }}" => %{
      "tokens" => ["apns-push-token"],
    }
  }
})
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.identify(
  id="1",
  data={
    "name": "John Hammond",
    "email": "jhammond@ingen.net",
    "channel_data": {
      "{{ channel_id }}": {
          "tokens": [apns_push_token]
      }
    }
  }
)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Users.identify(
  id: "1",
  data: {
    name: "John Hammond",
    email: "jhammond@ingen.net",
    channel_data: {
      "{{ channel_id }}": {
        tokens: [apns_push_token]
      }
    }
  }
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" }
);

var params = new Dictionary<string, string>{
  {"name", "John Hammond"},
  {"email", "jhammond@ingen.net"},
  {"channel_data", new Dictionary<string, object>{
    {"{{ channel_id }}", new Dictionary<string, object>{
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

$client->users()->identify('1', [
  'name' => 'John Hammond',
  'email' => 'jhammond@ingen.net',
  'channel_data' => [
    '{{ channel_id }}' => [
      'tokens' => ['apns-push-token'],
    ]
  ]
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

user, _ := knockClient.Users.Identify(ctx, &knock.IdentifyUserRequest{
  ID: "1",
  Name: "John Hammond",
  Email: "jhammond@ingen.net",
  ChannelData: map[string]map{
    "{{ channel_id }}": map[string]string {
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

UserIdentity user = client.users().identify("1", UserIdentity.builder()
  .name("John Hammond")
  .email("jhammond@ingen.net")
  .property("channel_data",
    Map.of(
      "{{ channel_id }}", Map.of(
      "tokens", List.of("apns-push-token")
      )
    )
  )
  .build());
`,
};

export default languages;
