const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/messages/3mY9N4p7DcmL9j1K44qmrdO6t7W/events \\
  -H "Authorization: Bearer sk_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  apiKey: process.env.KNOCK_API_KEY
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

client.messages.list_events(message.id)

# supports pagination parameters
client.messages.list_events(message.id, page_size=10)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

client.messages.list_events(message.id)

# supports pagination parameters

client.messages.list_events(message.id, page_size: 10)
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
	"github.com/knocklabs/knock-go/option"
	"github.com/knocklabs/knock-go/param"
)

ctx := context.Background()
knockClient := knock.NewClient(option.WithAPIKey("sk_12345"))

// List events with pagination
events, _ := knockClient.Messages.ListEvents(ctx, message.ID, knock.MessageListEventsParams{
	PageSize: param.New(10),
})

// Auto-paging version
eventsPager := knockClient.Messages.ListEventsAutoPaging(ctx, message.ID, knock.MessageListEventsParams{
	PageSize: param.New(10),
})

// Iterate through events
for eventsPager.Next() {
	event := eventsPager.Current()
	// Process event...
}
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.messages.MessageListEventsParams;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

// Basic request
var events = client.messages().listEvents(
    MessageListEventsParams.builder()
        .messageId(messageId)
        .build()
);

// With pagination
var eventsWithPagination = client.messages().listEvents(
    MessageListEventsParams.builder()
        .messageId(messageId)
        .pageSize(10)
        .build()
);
  `,
};

export default languages;
