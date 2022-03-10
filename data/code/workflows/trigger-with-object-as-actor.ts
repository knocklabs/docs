const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.notify("new-comment", {
  actor: { id: project.id, collection: "projects" }
  recipients: followerIds,
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.notify(
  key="new-comment",
  actor={ "id": project.id, "collection": "projects" },
  recipients=follower_ids
)
`,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

Knock::Workflows.trigger(
  key: "new-comment",
  actor: { "id": project.id, "collection": "projects" },
  recipients: follower_ids,
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var workflowTriggerOpts = new TriggerWorkflow {
  Actor = new Dictionary<string, object>{
    {"id", project.Id},
    {"collection", "projects"}
  }
  Recipients = followerIds,
};

var result = await knockClient.Workflows.Trigger("new-comment", workflowTriggerOpts)
`,
  elixir: `
knock_client = MyApp.Knock.client()  

Knock.Workflows.trigger("new-comment", %{
  actor: %{ id: project.id, collection: "projects" }
  recipients: follower_ids,
})
`,
};

export default languages;
