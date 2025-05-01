const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/messages/3mY9N4p7DcmL9j1K44qmrdO6t7W/activities \\
  -H "Authorization: Bearer sk_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  apiKey: process.env.KNOCK_API_KEY
});

await knock.messages.listActivities(message.id);

// supports pagination parameters

await knock.messages.listActivities(
  message.id,
  {
    page_size: 10
  }
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Messages.get_activities(knock_client, message.id)

# supports pagination parameters

Knock.Messages.get_activities(knock_client, message.id, page_size: 10)
  `,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

client.messages.list_activities(message_id)

# supports pagination parameters
client.messages.list_activities(message_id, page_size=10)
  `,
  ruby: `
require "knockapi"

client = Knockapi::Client.new(api_key: "sk_12345")

client.messages.list_activities(message.id)

# supports pagination parameters

client.messages.list_activities(message.id, page_size: 10)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Messages.GetActivities(message.id);

// supports pagination parameters and filters

var params = new Dictionary<string, string> {
                {"page_size", "10"}
             };

await knockClient.Messages.GetActivities(message.id, params);
`,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->messages()->getActivities($message->id(), [
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

// List activities with pagination
activities, _ := knockClient.Messages.ListActivities(ctx, message.ID, knock.MessageListActivitiesParams{
	PageSize: param.New(10),
})

// Auto-paging version
activitiesPager := knockClient.Messages.ListActivitiesAutoPaging(ctx, message.ID, knock.MessageListActivitiesParams{
	PageSize: param.New(10),
})

// Iterate through activities
for activitiesPager.Next() {
	activity := activitiesPager.Current()
	// Process activity...
}
`,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.messages.MessageListActivitiesParams;

KnockClient client = KnockOkHttpClient.builder()
    .apiKey("sk_12345")
    .build();

// Basic request
var activities = client.messages().listActivities(
    MessageListActivitiesParams.builder()
        .messageId(messageId)
        .build()
);

// With pagination
var activitiesWithPagination = client.messages().listActivities(
    MessageListActivitiesParams.builder()
        .messageId(messageId)
        .pageSize(10)
        .build()
);
  `,
};

export default languages;
