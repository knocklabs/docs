const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.messages.getActivities(message.id);

// supports pagination parameters

await knock.messages.getActivities(
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

client.messages.get_activities(message.id)

# supports pagination parameters

Knock.Messages.get_activities(message.id, {'page_size': 10})
  `,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

Knock::Messages.get_activities(id: message.id)

# supports pagination parameters

Knock::Messages.get_activities(id: message.id, options: {page_size: 10})
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
};

export default languages;
