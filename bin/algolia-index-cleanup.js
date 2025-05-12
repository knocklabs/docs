#!/usr/bin/env node

const { loadEnvConfig } = require("@next/env");
const algoliasearch = require("algoliasearch");

(async () => {
  try {
    const projectDir = process.cwd();
    loadEnvConfig(projectDir);
    const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
    const algoliaAdminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;
    const algoliaIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

    if (!algoliaAppId || !algoliaAdminApiKey || !algoliaIndexName) {
      console.error("Algolia index not found");
      console.error("ALGOLIA_APP_ID:", algoliaAppId);
      console.error("ALGOLIA_ADMIN_API_KEY:", algoliaAdminApiKey);
      console.error("ALGOLIA_INDEX_NAME:", algoliaIndexName);
      process.exit(1);
    }

    const client = algoliasearch(algoliaAppId, algoliaAdminApiKey);
    const index = client.initIndex(algoliaIndexName);

    await index.clearObjects();
    console.log("✅ Algolia index cleared!");
    console.log("Restart the server to rebuild the index.");
    process.exit(0);
  } catch (error) {
    console.error("Error clearing Algolia index.");
    console.error(error);
    process.exit(1);
  }
})();
