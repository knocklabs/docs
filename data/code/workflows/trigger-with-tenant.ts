const languages = {
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({ bearerToken: process.env.KNOCK_API_KEY });

await knock.workflows.trigger("new-comment", {
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

client.workflows.trigger(
    key="new-comment",
    recipients=follower_ids,
    data={
        "document_id": comment.document.id,
        "document_name": comment.document.name,
        "comment_id": comment.id,
        "comment_text": comment.text
    },
    tenant=comment.workspace.id
)
`,
  ruby: `
require "knockapi"

knock = Knockapi::Client.new(bearer_token: "sk_12345")

knock.workflows.trigger("new-comment",
  recipients: follower_ids,
  data: {
    document_id: comment.document.id,
    document_name: comment.document.name,
    comment_id: comment.id,
    comment_text: comment.text
  },
  tenant: comment.workspace.id
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
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->workflows()->trigger('new-comment', [
  'data' => [
    'document_id' => $comment->document()->id(),
    'document_name' => $comment->document()->name(),
    'comment_id' => $comment->id(),
    'comment_text' => $comment->text()
  ],
  'recipients' => $followerIds,
  'tenant' => $comment->workspace->id(),
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

request := &knock.TriggerWorkflowRequest{
  Workflow:   "new-comment",
  Data: map[string]interface{}{
    "document_id":   document.ID,
    "document_name": document.Name,
    "comment_id":    comment.ID,
    "comment_text":  comment.Text,
  },
  Tenant: workspace.ID
}

for _, f := range followerIds {
  request.AddRecipientByID(f)
}

result, _ := knockClient.Workflows.Trigger(ctx, request, nil)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.workflows.WorkflowTriggerParams;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

var result = client.workflows().trigger(
    WorkflowTriggerParams.builder()
        .key("new-comment")
        .recipients(followerIds)
        .data(data -> {
            data.put("document_id", document.getId());
            data.put("document_name", document.getName());
            data.put("comment_id", comment.getId());
            data.put("comment_text", comment.getText());
            return data;
        })
        .tenant(workspace.getId())
        .build()
);
`,
};

export default languages;
