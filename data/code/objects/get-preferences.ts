const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

await knockClient.objects.getPreferences("projects", "project-1");
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.get_preferences(knock_client, "projects", "project-1")
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.objects.get_preferences(collection="projects", id="project-1")
  `,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

Knock::Objects.get_preferences(collection: "projects", id: "project-1")  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Objects.GetPreferences("projects", "project-1");
`,
  php: `
use Knock\\KnockSdk\\Client;
    
$client = new Client('sk_12345');

$client->objects()->getPreferences('projects', 'project-1');
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

preferenceSet, _ := knockClient.Objects.GetPreferences(ctx, &knock.GetObjectPreferencesRequest{
  Collection: "projects",
  ID:         "project-1"
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

PreferenceSet prefs = client.objects().getPreferencesById("projects", "project-1", "default");
`,
};

export default languages;
