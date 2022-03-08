const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

const preferences = await knockClient.users.getPreferences("jhammond");
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.get_preferences(knock_client, user.id)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.get_preferences(user.id)
  `,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

Knock::Users.get_preferences(id: user.id)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Users.GetPreferences(user.Id);
`,
};

export default languages;
