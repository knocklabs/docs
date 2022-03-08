const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock(process.env.KNOCK_API_KEY);

knockClient.objects.set("projects", "project-1", {
  name: "My project",
  total_assets: 10,
  tags: ["cool", "fun", "project"],
});
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.set(knock_client, "projects", "project-1", %{
  name: "My project",
  total_assets: 10,
  tags: ["cool", "fun", "project"],
})
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.objects.set(
  collection="projects",
  id="project-1", 
  data={
    "name": "My project"
  }
)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Objects.set(
  collection: "projects",
  id: "project-1",
  data: {
    name: "My project"
  }
)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var objectParams = new Dictionary<string, object>{
  { "name", "Project one" }
};

await knockClient.Objects.Set("projects", "project-1", objectParams)  
`,
};

export default languages;
