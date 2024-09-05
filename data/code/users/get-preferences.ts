const languages = {
  node: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

// If no preference set id is provided, the SDK will return the user's "default" preferences
const preferences = await knockClient.users.getPreferences(user.id, {
  preferenceSet: "tenant-1"
});
`,
  elixir: `
knock_client = MyApp.Knock.client()

# If no preference set id is provided, the SDK will return the user's "default" preferences
Knock.Users.get_preferences(knock_client, user.id, preference_set: "tenant-1")
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

# If no preference set id is provided, the SDK will return the user's "default" preferences
client.users.get_preferences(user.id, options={"preference_set": "tenant-1"})
`,
  ruby: `
require "knock"
Knock.key = "sk_12345"

# If no preference set id is provided, the SDK will return the user's "default" preferences
Knock::Users.get_preferences(user.id, preference_set: "tenant-1")
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

// If no preference set id is provided, the SDK will return the user's "default" preferences
preferences, _ := knockClient.Users.GetPreferences(ctx, &knock.GetUserPreferencesRequest{
  UserID: user.ID,
  PreferenceID: "tenant-1",
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

// Request a user's "default" preferences
PreferenceSet preferences = client.users().getDefaultPreferences(user.getId());

// Request tenant-specific preferences for a user
PreferenceSet preferences = client.users().getPreferencesById(user.getId(), "tenant-1");
`,
};

export default languages;
