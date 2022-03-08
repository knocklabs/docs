const code = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.notify("new-comment", {
  recipients: [
    { id: project.id, collection: "projects" }
  ],
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.notify(
  key="new-comment",
  recipients=[
    { "id": project.id, "collection": "projects" },
  ]
)
`,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

Knock::Workflows.trigger(
  key: "new-comment",
  recipients: [
    { "id": project.id, "collection": "projects" }
  ]
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var workflowTriggerOpts = new TriggerWorkflow {
  Recipients = [
    new Dictionary<string, object>{
      {"id", project.Id},
      {"collection", "projects"}
    }
  ],
};

var result = await knockClient.Workflows.Trigger("new-comment", workflowTriggerOpts)
`,
  elixir: `
knock_client = MyApp.Knock.client()  

Knock.Workflows.trigger("new-comment", %{
  recipients: [
    %{ id: project.id, collection: "projects" }
  ],
})
`,
};

export default code;
