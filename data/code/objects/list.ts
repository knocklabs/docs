const languages = {
  curl: `
curl -X GET https://api.knock.app/v1/objects/projects \\
  -H "Authorization: Bearer sk_test_12345"
`,
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({
  bearerToken: process.env.KNOCK_API_KEY
});

const objects = await knock.objects.list("projects");
`,
  python: `
from knockapi import Knock

client = Knock(api_key="sk_12345")

objects = client.objects.list(
    collection="projects"
)
`,
  // TODO: Add additional SDK examples
};

export default languages;
