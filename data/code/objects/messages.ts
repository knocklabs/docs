const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

const channelData = await knockClient.objects.getMessages(
  "projects",
  project.id
);

// supports pagination parameters and filters

const channelData = await knockClient.objects.getMessages(
  "projects",
  project.id,
  {
    page_size: 20,
    tenant: "my-tenant"
  }
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Objects.get_messages(knock_client, "projects", project.id)

# supports pagination parameters and filters

Knock.Objects.get_messages(
  knock_client,
  "projects",
  project.id,
  page_size: 20, tenant: "my_tenant"
)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.objects.get_messages(
  collection="projects",
  id=project.id,
)

# supports pagination parameters and filters

client.objects.get_messages(
  collection="projects",
  id=project.id,
  options={'page_size': 10, 'tenant': "my_tenant"}
)
  `,
  ruby: `
require "knockapi"
Knock.key = "sk_12345"

Knock::Objects.get_messages(
  collection: "projects",
  id: project.id
)

Knock::Objects.get_messages(
  collection: "projects",
  id: project.id,
  {page_size: 10, tenant: "my_tenant"}
)
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Objects.GetMessages("projecs", project.id);

// supports pagination parameters and filters

var params = new Dictionary<string, string> {
                {"page_size", "10"},
                {"tenant", "my_tenant"}
             };

await knockClient.Objects.GetMessages("projecs", project.id, params);
`,
};

export default languages;
