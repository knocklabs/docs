const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knockClient = new Knock("sk_12345");

await knockClient.objects.unsetChannelData(
  "projects",
  project.id,
  "knock-slack-channel-id"
);
`,
  elixir: `
knock_client = MyApp.Knock.client()

slack_channel_id = "knock-slack-channel-id"

Knock.Objects.unset_channel_data(knock_client, "projects", project.id, slack_channel_id)
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.objects.unset_channel_data(
  collection="projects",
  id=project.id,
  channel_id="knock-slack-channel-id", 
)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Objects.unset_channel_data(
  collection: "projects",
  id: project.id,
  channel_id: "knock-slack-channel-id"
)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

await knockClient.Objects.SetChannelData(
  "projects", 
  project.Id, 
  "knock-slack-channel-id"
);
`,
};

export default languages;
