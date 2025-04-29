const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/objects/projects/project-1/preferences/default \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

// If no preference set id is provided, the SDK will return the object's "default" preferences
await knock.objects.getPreferences("projects", "project-1", { preferenceSet: "tenant-1" });
`,
  elixir: `
knock_client = MyApp.Knock.client()

# If no preference set id is provided, the SDK will return the object's "default" preferences
Knock.Objects.get_preferences(knock_client, "projects", "project-1", preference_set: "tenant-1")
`,
  python: `
from knockapi import Knock
client = Knock(bearer_token="sk_12345")

# If no preference set id is provided, the SDK will return the object's "default" preferences
client.objects.get_preferences(collection="projects", id="project-1", options={"preference_set": "tenant-1"})
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

# If no preference set id is provided, the SDK will return the object's "default" preferences
Knock::Objects.get_preferences(collection: "projects", id: "project-1", preference_set: "tenant-1")
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

// If no preference set id is provided, the SDK will return the object's "default" preferences
await knockClient.Objects.GetPreferences("projects", "project-1", preferenceSetId: "tenant-1");
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

// The preference set id must be "default" or the id of a tenant you have created
$client->objects()->getPreference('projects', 'project-1', 'default');
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
)

ctx := context.Background()
client := knock.NewClient("sk_12345")

// If no preference set id is provided, the SDK will return the object's "default" preferences
preferenceSet, _ := knockClient.Objects.GetPreferences(ctx, &knock.GetObjectPreferencesRequest{
  Collection:   "projects",
  ID:           "project-1",
  PreferenceID: "tenant-1",
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

// The preference set id must be "default" or the id of a tenant you have created
PreferenceSet prefs = client.objects().getPreferencesById("projects", "project-1", "default");
`,
};

export default languages;
