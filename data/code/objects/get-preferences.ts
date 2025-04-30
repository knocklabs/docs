const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/objects/projects/project-1/preferences/default \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  apiKey: process.env.KNOCK_API_KEY
});

// If no preference set id is provided, the SDK will return the object's "default" preferences
await knock.objects.getPreferences("projects", "project-1", "tenant-1");
`,
  elixir: `
knock_client = MyApp.Knock.client()

# If no preference set id is provided, the SDK will return the object's "default" preferences
Knock.Objects.get_preferences(knock_client, "projects", "project-1", preference_set: "tenant-1")
`,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

# If no preference set id is provided, the SDK will return the object's "default" preferences
client.objects.get_preferences(collection="projects", object_id="project-1", id="tenant-1")
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

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
	"github.com/knocklabs/knock-go/option"
)

ctx := context.Background()
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

// If no preference set id is provided, the SDK will return the object's "default" preferences
preferenceSet, _ := knockClient.Objects.GetPreferences(ctx, "projects", "project-1", "tenant-1")
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.objects.ObjectGetPreferencesParams;
import app.knock.api.models.recipients.preferences.PreferenceSet;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

// The preference set id must be "default" or the id of a tenant you have created
ObjectGetPreferencesParams params = ObjectGetPreferencesParams.builder()
    .collection("projects")
    .objectId("project-1")
    .id("tenant-1")
    .build();
PreferenceSet prefs = client.objects().getPreferences(params);
`,
};

export default languages;
