const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/objects/projects/project-1/preferences \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  apiKey: process.env.KNOCK_API_KEY
});

const allPreferences = await knock.objects.listPreferences("projects", "project-1");
`,
  elixir: `
knock_client = MyApp.Knock.client()

all_preferences = Knock.Objects.get_all_preferences(knock_client, "projects", "project-1")
`,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

all_preferences = client.objects.list_preferences(collection="projects", object_id="project-1")
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

all_preferences = Knock::Objects.get_all_preferences(collection: "projects", id: "project-1")
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var allPreferences = await knockClient.Objects.GetAllPreferences("projects", "project-1");
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$allPreferences = $client->objects()->getPreferences('projects', 'project-1');
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
)

ctx := context.Background()
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

allPreferences, _ := knockClient.Objects.ListPreferences(ctx, "projects", "project-1")
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.objects.ObjectListPreferencesParams;
import app.knock.api.models.recipients.preferences.PreferenceSet;
import java.util.List;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

ObjectListPreferencesParams params = ObjectListPreferencesParams.builder()
    .collection("projects")
    .objectId("project-1")
    .build();
List<PreferenceSet> allPreferences = client.objects().listPreferences(params);
`,
};

export default languages;
