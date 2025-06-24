const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/users/1/preferences \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knockClient = new Knock({ apiKey: process.env.KNOCK_API_KEY });

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

client = Knockapi::Client.new(api_key: "sk_12345")

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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
)

ctx := context.Background()
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

allPreferences, _ := knockClient.Users.ListPreferences(ctx, user.ID)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.users.PreferenceSet;
import app.knock.api.models.users.UserGetPreferencesParams;
import java.util.List;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

List<PreferenceSet> allPreferences = client.users().getPreferences(UserGetPreferencesParams.builder()
    .userId(user.getId())
    .build());
`,
};
export default languages;
