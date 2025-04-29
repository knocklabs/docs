const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/users/1/preferences \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

const allPreferences = await knockClient.users.listPreferences(user.id);
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

all_preferences = client.users.list_preferences(user_id=user.id)
`,
  elixir: `
knock_client = MyApp.Knock.client()

all_preferences = Knock.Users.get_all_preferences(knock_client, user.id)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

all_preferences = client.users.list_preferences(user.id)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var allPreferences = await knockClient.Users.GetAllPreferences(user.Id);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$allPreferences = $client->users()->getPreferences($user->id());
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

allPreferences, _ := knockClient.Users.GetAllPreferences(ctx, &knock.GetAllPreferencesRequest{
    UserID: user.ID,
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

List<PreferenceSet> allPreferences = client.users().getPreferences(user.getId());
`,
};
export default languages;