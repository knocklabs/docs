const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/messages/3mY9N4p7DcmL9j1K44qmrdO6t7W/events \\
  -H "Authorization: Bearer sk_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

await knock.messages.listEvents(message.id);

// supports pagination parameters

await knock.messages.listEvents(
  message.id,
  {
    page_size: 10
  }
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Messages.get_events(knock_client, message.id)

# supports pagination parameters

Knock.Messages.get_events(knock_client, message.id, page_size: 10)
  `,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

client.messages.list_events(message_id)

# supports pagination parameters
client.messages.list_events(message_id, page_size=10)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(bearer_token: "sk_12345")

Knock::Messages.get_events(id: message.id)

# supports pagination parameters

Knock::Messages.get_events(id: message.id, options: {page_size: 10})
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Messages.GetEvents(message.id);

// supports pagination parameters and filters

var params = new Dictionary<string, string> {
                {"page_size", "10"}
             };

await knockClient.Messages.GetEvents(message.id, params);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->messages()->getEvents($message->id(), [
  'page_size' => 10
]);
`,
  go: `
import (
	"context"

	"github.com/knocklabs/knock-go"
)

ctx := context.Background()
client := knock.NewClient("sk_12345")

result, _ := knockClient.Messages.GetEvents(ctx, &knock.GetMessageEventsRequest{
  ID: message.ID,
  PageSize: 10,
})
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

MessagesResource.QueryParams queryParams = new MessagesResource.QueryParams();
queryParams.pageSize(10);

CursorResult<KnockMessageEvent> eventResult = client.messages().events(messageId, queryParams);
  `,
};

export default languages;
