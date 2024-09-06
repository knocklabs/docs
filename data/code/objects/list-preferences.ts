const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/objects/projects/project-1/preferences \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

const allPreferences = await knockClient.objects.getAllPreferences("projects", "project-1");
`,
  elixir: `
knock_client = MyApp.Knock.client()

all_preferences = Knock.Objects.get_all_preferences(knock_client, "projects", "project-1")
`,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

all_preferences = client.objects.get_all_preferences(collection="projects", id="project-1")
`,
  ruby: `
require "knock"
Knock.key = "sk_12345"

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
// This endpoint is not yet supported in the Go SDK

`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

List<PreferenceSet> allPreferences = client.objects().getPreferences("projects", "project-1");
`,
};

export default languages;
