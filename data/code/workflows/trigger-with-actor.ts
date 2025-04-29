const languages = {
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({ bearerToken: process.env.KNOCK_API_KEY });

await knock.workflows.trigger("new-comment", {
  actor: comment.author.id,
  data: {
    documentId: comment.document.id,
    documentName: comment.document.name,
    commentId: comment.id,
    commentText: comment.text,
  },
  recipients: document.followers.map((f) => f.user_id),
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.workflows.trigger(
    key="new-comment",
    actor=comment.author.id,
    recipients=follower_ids,
    data={
        "document_id": comment.document.id,
        "document_name": comment.document.name,
        "comment_id": comment.id,
        "comment_text": comment.text
    }
)
`,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Workflows.trigger(
  key: "new-comment",
  actor: comment.author.id,
  recipients: follower_ids,
  data: {
    "document_id": comment.document.id,
    "document_name": comment.document.name,
    "comment_id": comment.id,
    "comment_text": comment.text,
  }
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
  Actor = comment.Author.Id,
  Recipients = followerIds,
};

var result = await knockClient.Workflows.Trigger("new-comment", workflowTriggerOpts)
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Workflows.trigger("new-comment", %{
  actor: comment.author.id,
  data: %{
    document_id: comment.document.id,
    document_name: comment.document.name,
    comment_id: comment.id,
    comment_text: comment.text
  },
  recipients: follower_ids,
})
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->workflows()->trigger('new-comment', [
  'actor' => $comment->author()->id(),
  'data' => [
    'document_id' => $comment->document()->id(),
    'document_name' => $comment->document()->name(),
    'comment_id' => $comment->id(),
    'comment_text' => $comment->text()
  ],
  'recipients' => $followerIds,
]);
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

request := &knock.TriggerWorkflowRequest{
  Workflow:   "new-comment",
  Actor:      comment.Author.ID,
  Data: map[string]interface{}{
    "document_id":   document.ID,
    "document_name": document.Name,
    "comment_id":    comment.ID,
    "comment_text":  comment.Text,
  },
}

for _, f := range followerIds {
  request.AddRecipientByID(f)
}

result, _ := knockClient.Workflows.Trigger(ctx, request, nil)
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

WorkflowTriggerRequest workflowTrigger = WorkflowTriggerRequest.builder()
    .key("new-comment")
    .actor(comment.author().getId())
    .recipients(followerIds)
    .data("document_id", document.getId())
    .data("document_name", document.getName())
    .data("comment_id", comment.getId())
    .data("comment_text", comment.getText())
    .build();

WorkflowTriggerResponse result = client.workflows().trigger(workflowTrigger);
`,
};

export default languages;
