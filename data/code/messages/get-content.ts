const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_API_KEY);

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
require "knock"
Knock.key = "sk_12345"

Knock::Messages.get_content(id: message.id)
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
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

result, _ := knockClient.Messages.GetContent(ctx, &knock.GetMessageContentRequest{
  ID: message.ID,
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

KnockMessageContent messageContent = client.messages().content(messageId);
  `,
};

export default languages;
