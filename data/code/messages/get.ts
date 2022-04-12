const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
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
require "knockapi"
Knock.key = "sk_12345"

Knock::Messages.get(id: message.id)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Messages.Get(message.Id);
`,
};

export default languages;
