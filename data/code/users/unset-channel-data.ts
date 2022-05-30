const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

const APNS_CHANNEL_ID = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.users.unsetChannelData(user.id, APNS_CHANNEL_ID);
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.unset_channel_data(
  id=user.id, 
  channel_id="8209f26c-62a5-461d-95e2-a5716a26e652"
)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Users.unset_channel_data(
  id: user.id,
  channel_id: "8209f26c-62a5-461d-95e2-a5716a26e652",
)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var apnsChannelId = "8209f26c-62a5-461d-95e2-a5716a26e652";

await knockClient.Users.UnsetChannelData(user.Id, apnsChannelId)  
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.unset_channel_data(knock_client, user.id, "8209f26c-62a5-461d-95e2-a5716a26e652")
  `,
  php: `
  use Knock\\KnockSdk\\Client;
    
  $client = new Client('sk_12345');

  $client->users()->unsetChannelData($user->id(), "8209f26c-62a5-461d-95e2-a5716a26e652");
`,
};

export default languages;
