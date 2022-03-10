const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.users.get(user.id);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.get(knock_client, user.id)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.get(user.id)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Users.get(id: user.id)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Users.Get(user.Id);
`,
};

export default languages;
