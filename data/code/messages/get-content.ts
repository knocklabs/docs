const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/messages/3mY9N4p7DcmL9j1K44qmrdO6t7W/content \\
  -H "Authorization: Bearer sk_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

await knock.messages.getContent(message.id);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Messages.get_content(knock_client, message.id)
  `,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

client.messages.get_content(message.id)
`,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

client.messages.get_content(message.id)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Messages.GetContent(message.Id);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->messages()->getContent($message->id());
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
)

ctx := context.Background()
knockClient := knock.NewClient(option.WithBearerToken("sk_12345"))

content, _ := knockClient.Messages.GetContent(ctx, message.ID)
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.messages.MessageGetContentParams;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

var content = client.messages().getContent(
    MessageGetContentParams.builder()
        .messageId(messageId)
        .build()
);
  `,
};

export default languages;
