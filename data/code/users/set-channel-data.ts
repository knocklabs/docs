const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

// Get this value in your Knock dashboard
const APNS_CHANNEL_ID = "some-channel-id-from-knock";

await knockClient.users.setChannelData("jhammond", APNS_CHANNEL_ID, {
  // Tokens are always stored in a list, to represent a user having one or more devices
  tokens: [userDeviceToken],
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.set_channel_data(
  id=user.id, 
  channel_data={
    "tokens": [userDeviceToken]
  }
)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Users.set_channel_data(
  id: user.id,
  channel_data: {
    tokens: [userDeviceToken]
  }
)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var channelData = new Dictionary<string, object>{
  { "tokens", new List<Dictionary> { userDeviceToken } }
};

await knockClient.Users.SetChannelData(user.Id, channelData)  
`,
};

export default languages;
