const languages = {
  javascript: `
const { Knock } = require("@knocklabs/node");
const knockClient = new Knock("sk_12345");

await knockClient.users.setPreferences("jhammond", {
  channel_types: { email: true, sms: false },
  workflows: {
    "dinosaurs-loose": {
      channel_types: {
        email: false,
        in_app_feed: true,
        sms: true,
      },
    },
  },
});
  `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.users.set_preferences(
  user_id=user.id,
  channel_types={ "email": True, "sms": False },
  workflows={
    "dinosaurs-loose": {
      "channel_types": {
        "email": False,
        "in_app_feed": True,
        "sms": True,
      }
    }
  }
)
  `,
  ruby: `
require "knockapi"

Knock.key = "sk_12345"

Knock::Users.set_preferences(
  user_id: user.id,
  channel_types: {
    email: true,
    sms: false
  },
  workflows: {
    "dinosaurs-loose": {
      channel_types: {
        email: false,
        in_app_feed: true,
        sms: true,
      }
    }
  }
)  
`,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

// Set preference set for user
var preferenceSetUpdate = new SetPreferencesOptions {
  ChannelTypes = new Dictionary<string, boolean> {
    {"email", false}
  }
};
  
await knockClient.Users.SetPreferences("jhammond", preferenceSetUpdate);
`,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Users.set_preferences(knock_client, user.id, %{
  channel_types: %{
    email: true,
    sms: false
  },
  workflows: %{
    "diosaurs-loose" => %{
      channel_types: {
        email: false,
        in_app_feed: true,
        sms: true,
      }
    }
  }
})
  `,
};

export default languages;
