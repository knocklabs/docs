const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

await knockClient.users.getMessages("jhammond");

// supports pagination parameters and filters
await knockClient.users.getMessages(
  "jhammond",
  {
    page_size: 20,
    tenant: "my-tenant"
  }
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.get_messages(knock_client, user.id)

# supports pagination parameters and filters

Knock.Users.get_messages(
  knock_client,
  user.id,
  page_size: 20, tenant: "my_tenant"
)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.get_messages(
  id=user.id
)

# supports pagination parameters and filters

client.users.get_messages(id="639a2d5f-d1b7-4cf3-b81b-7d9604665276", options={'page_size': 10, 'tenant': "my_tenant"})
  `,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

Knock::Users.get_messages(
  id: user.id
)

Knock::Users.get_messages(
  id: user.id,
  options={'page_size': 10, 'tenant': 10}
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Users.GetMessages(user.Id);

// supports pagination parameters and filters

var params = new Dictionary<string, string> {
                {"page_size", "10"},
                {"tenant", "my_tenant"}
             };

await knockClient.Users.GetMessages(user.Id, params);
`,
};

export default languages;
