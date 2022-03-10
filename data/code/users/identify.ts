const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.users.identify(user.id, {
  name: user.name,
  email: user.email,
  avatar: user.avatar_url,
});
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.identify(knock_client, user.id, %{
  name: user.name,
  email: user.email,
  avatar: user.avatar_url,
})
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.identify(
  id=user.id, 
  data={
    "name": user.name,
    "email": user.email
  }
)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Users.identify(
  id: user.id,
  data: {
    name: user.name,
    email: user.email,
  }
)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var params = new Dictionary<string, object>{
  { "name", user.Name },
  { "email", user.Email }
};

var user = await knockClient.Users.Identify(user.Id, params)  
`,
};

export default languages;
