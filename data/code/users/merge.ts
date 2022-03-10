const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.users.merge(user.id, "user-to-merge-from");
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.merge(knock_client, user.id, "user-to-merge-from")
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.merge(
  user_id=user.id, 
  from_user_id="user-to-merge-from"
)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Users.merge(
  id: user.id,
  from_user_id: "user-to-merge-from"
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Users.Merge(user.Id, "user-to-merge-from")  
`,
};

export default languages;
