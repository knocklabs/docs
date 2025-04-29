const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/users/1/preferences/default \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

// Get the user's default preferences
const preferences = await knock.users.getPreferences(user.id, "default");
`,
  elixir: `
knock_client = MyApp.Knock.client()

# If no preference set id is provided, the SDK will return the user's "default" preferences
Knock.Users.get_preferences(knock_client, user.id, preference_set: "tenant-1")
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

# The preference set ID is required. Use "default" for the default preference set
client.users.get_preferences(
  user_id=user.id,
  id="default"
)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

# The preference set ID is required. Use "default" for the default preference set
client.users.get_preferences(user.id, "default")
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

// If no preference set id is provided, the SDK will return the user's "default" preferences
await knockClient.Users.GetPreferences(user.Id, preferenceSetId: "tenant-1");
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

// The preference set id must be "default" or the id of a tenant you have created
$client->users()->getPreference($user->id(), 'default');
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

// The preference set ID is required. Use "default" for the default preference set
preferences, _ := knockClient.Users.GetPreferences(ctx, &knock.GetUserPreferencesRequest{
  UserID: user.ID,
  PreferenceID: "default",
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

// The preference set ID is required. Use "default" for the default preference set
PreferenceSet preferences = client.users().getPreferencesById(user.getId(), "default");
`,
};

export default languages;
