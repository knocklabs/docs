const languages = {
  node: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

const preferences = await knockClient.users.getPreferences(user.id);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.get_preferences(knock_client, user.id)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.get_preferences(user.id)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Users.get_preferences(id: user.id)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Users.GetPreferences(user.Id);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->users()->getPreferences($user->id());
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

preferences, _ := knockClient.Users.GetPreferences(ctx, &knock.GetUserPreferencesRequest{
  UserID: user.ID,
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

PreferenceSet preferences = client.users().getDefaultPreferences(user.getId());
`,
};

export default languages;
