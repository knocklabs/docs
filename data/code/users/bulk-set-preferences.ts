const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

const userIds = ["jhammond", "dnedry", "imalcolm", "esattler"];

await knockClient.users.bulkSetPreferences(userIds, {
  channel_types: { email: true, sms: false }
});
`,
  elixir: `
knock_client = MyApp.Knock.client()

user_ids = ["jhammond", "dnedry", "imalcolm", "esattler"]

Knock.Users.bulk_set_preferences(knock_client, user_ids, %{
  channel_types: { email: true, sms: false }
})
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

user_ids = ["jhammond", "dnedry", "imalcolm", "esattler"]

client.users.bulk_set_preferences(
  user_ids=user_ids, 
  channel_types={ "email": True, "sms": False }
)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

user_ids = ["jhammond", "dnedry", "imalcolm", "esattler"]

Knock::Users.bulk_set_preferences(
  user_ids: user_ids,
  channel_types: { email: true, sms: false }
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var options = new BulkSetUserPreferencesOptions {
  Preferences = new SetPreferencesOptions {
    ChannelTypes = new Dictionary<string, boolean> {
      {"email", false}
    }
  }
  UserIds = new List<string> {
    "jhammond", 
    "dnedry", 
    "imalcolm", 
    "esattler"
  }
}

await knockClient.Users.BulkSetPreferences(options);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->bulkSetPreferences([
  'user_ids' => ['jhammond', 'dnedry'],
  'channel_types' => [
    'email' => true,
    'sms' => false
  ]
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

result, _ := knockClient.Users.BulkSetPreferences(ctx, &knock.&BulkSetUserPreferencesRequest{
  UserIDs:     []string{"jhammond", "dnedry"},
  Preferences: map[string]interface{}{
    "channel_types": map[string]interface{}{
      "email": true,
      "sms":   false,
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
  
// This example is currently not supported in the Java SDK
`,
};

export default languages;
