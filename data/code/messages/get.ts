const languages = {
  node: `
import { Knock } from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.messages.get(message.id);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Messages.get(knock_client, message.id)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.messages.get(message.id)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Messages.get(id: message.id)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Messages.Get(message.Id);
`,
  php: `
use Knock\\KnockSdk\\Client;
    
$client = new Client('sk_12345');

$client->messages()->get($message->id());
`,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

result, _ := knockClient.Messages.Get(ctx, &knock.GetMessageRequest{
  Id: message.ID
})
`,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
    .apiKey("sk_12345")
    .build();

KnockMessage message = client.messages().get(messageId);
  `,
};

export default languages;
