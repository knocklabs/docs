const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.KNOCK_API_KEY);

await knockClient.objects.delete("projects", "project-1");
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.delete(knock_client, "projects", "project-1")
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.objects.delete(
  collection="projects",
  id="project-1"
)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Objects.delete(
  collection: "projects",
  id: "project-1",
)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Objects.Delete("projects", "project-1");
`,
  php: `
use Knock\\KnockSdk\\Client;
    
$client = new Client('sk_12345');

$client->objects()->delete('projects', 'project-1');
`,
};

export default languages;
