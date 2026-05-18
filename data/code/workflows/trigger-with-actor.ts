const languages = {
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({ apiKey: process.env.KNOCK_API_KEY });

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
require "knockapi"

knock = Knockapi::Client.new(api_key: "sk_12345")

knock.workflows.trigger("new-comment",
  actor: comment.author.id,
  recipients: follower_ids,
  data: {
    document_id: comment.document.id,
    document_name: comment.document.name,
    comment_id: comment.id,
    comment_text: comment.text
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

Knock.Workflows.trigger(knock_client, "new-comment", %{
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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
	"github.com/knocklabs/knock-go/shared"
)
ctx := context.Background()
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

recipients := make([]knock.RecipientRequestUnionParam, len(followerIds))
for i, id := range followerIds {
  recipients[i] = shared.UnionString(id)
}

result, _ := knockClient.Workflows.Trigger(ctx, "new-comment", knock.WorkflowTriggerParams{
  Actor: knock.F[knock.RecipientRequestUnionParam](shared.UnionString(comment.Author.ID)),
  Data: knock.F(map[string]interface{}{
    "document_id":   document.ID,
    "document_name": document.Name,
    "comment_id":    comment.ID,
    "comment_text":  comment.Text,
  }),
  Recipients: knock.F(recipients),
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.workflows.WorkflowTriggerParams;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

var result = client.workflows().trigger(
    WorkflowTriggerParams.builder()
        .key("new-comment")
        .actor(comment.author().getId())
        .recipients(followerIds)
        .data(data -> {
            data.put("document_id", document.getId());
            data.put("document_name", document.getName());
            data.put("comment_id", comment.getId());
            data.put("comment_text", comment.getText());
            return data;
        })
        .build()
);
`,
};

export default languages;
