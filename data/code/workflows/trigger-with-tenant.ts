const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.notify("new-comment", {
  data: {
    documentId: comment.document.id,
    documentName: comment.document.name,
    commentId: comment.id,
    commentText: comment.text,
  },
  recipients: document.followers.map((f) => f.user_id),
  tenant: comment.workspace.id
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.notify(
  key="new-comment",
  recipients=follower_ids,
  data={
    "document_id": comment.document.id,
    "document_name": comment.document.name,
    "comment_id": comment.id,
    "comment_text": comment.text,
  },
  tenant=comment.workspace.id
)
`,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

Knock::Workflows.trigger(
  key: "new-comment",
  recipients: follower_ids,
  data: {
    "document_id": comment.document.id,
    "document_name": comment.document.name,
    "comment_id": comment.id,
    "comment_text": comment.text,
  },
  tenant: comment.workspace.id,
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var workflowTriggerOpts = new TriggerWorkflow {
  Data = new Dictionary<string, object>{
    {"document_id", comment.Document.Id},
    {"document_name", comment.Document.Name},
    {"comment_id", comment.Id},
    {"comment_text", comment.Text}
  },
  Recipients = followerIds,
  Tenant = comment.Workspace.Id,
};

var result = await knockClient.Workflows.Trigger("new-comment", workflowTriggerOpts)
`,
  elixir: `
knock_client = MyApp.Knock.client()  

Knock.Workflows.trigger("new-comment", %{
  data: %{
    document_id: comment.document.id,
    document_name: comment.document.name,
    comment_id: comment.id,
    comment_text: comment.text
  },
  recipients: follower_ids,
  tenant: comment.workspace.id,
})
`,
};

export default languages;
