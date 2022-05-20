/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
const withPlugins = require("next-compose-plugins");
const withMdxEnhanced = require("next-mdx-enhanced");
const algoliasearch = require("algoliasearch");

const autoLinkSettings = {
  behavior: "prepend",
  content: { type: "element", tagName: "span" },
};

function makeIdFromPath(resourcePath) {
  return resourcePath
    .replace(".mdx", "")
    .replace(".md", "")
    .replace("/index", "");
}

module.exports = withPlugins(
  [
    withMdxEnhanced({
      layoutPath: "layouts/mdxLayout",
      defaultLayout: true,
      fileExtensions: ["mdx", "md"],
      remarkPlugins: [
        require("remark-slug"),
        [require("remark-autolink-headings"), autoLinkSettings],
      ],
      rehypePlugins: [],
      onContent: async (c) => {
        const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
        const algoliaAdminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;
        const algoliaIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;

        if (algoliaAppId && algoliaAdminApiKey && algoliaIndexName) {
          const client = algoliasearch(algoliaAppId, algoliaAdminApiKey);
          const index = client.initIndex(algoliaIndexName);

          try {
            // Notes:
            // Algolia recommends saving objects in batches because of efficiency.
            // Our markdown processor doesn't provide a callback to subscribe to that
            // gets called after finishing with all elements.
            //
            // Given we only have ~40 items to be indexed right now, we are just saving
            // entries one by one.
            await index.saveObject({
              // The path to the page will be the identifier in Algolia. This means that if
              // a page changes its path, we will have an outdated entry in Algolia we need to
              // delete.
              objectID: c.id,
              path: c.id,
              title: c.title,

              // Once we add tags are added to pages, Algolia records
              // will be updated with them, so we can enhance the search experience
              tags: c.tags || [],
            });
          } catch (e) {
            console.error(e);
          }
        } else {
          console.info(
            "Algolia configuration variables not present. Skipping indexing.",
          );
        }

        return c;
      },
      extendFrontMatter: {
        process: (mdxContent, frontMatter) => {
          const id = makeIdFromPath(frontMatter.__resourcePath);

          return {
            id,
            wordCount: mdxContent.split(/\s+/g).length,
          };
        },
      },
    })(),
  ],
  {
    async redirects() {
      return [
        {
          source: "/integrations/email",
          destination: "/integrations/email/attachments",
          permanent: false,
        },
        {
          source: "/integrations/email-attachments",
          destination: "/integrations/email/attachments",
          permanent: true,
        },
        {
          source: "/integrations/aws-ses",
          destination: "/integrations/email/aws-ses",
          permanent: true,
        },
        {
          source: "/integrations/sendgrid",
          destination: "/integrations/email/sendgrid",
          permanent: true,
        },
        {
          source: "/integrations/chat",
          destination: "/integrations/chat/slack",
          permanent: false,
        },
        {
          source: "/integrations/push",
          destination: "/integrations/push/overview",
          permanent: false,
        },
        {
          source: "/integrations/slack",
          destination: "/integrations/chat/slack",
          permanent: true,
        },
        {
          source: "/integrations/microsoft-teams",
          destination: "/integrations/chat/microsoft-teams",
          permanent: true,
        },
        {
          source: "/integrations/sms",
          destination: "/integrations/sms/twilio-sms",
          permanent: false,
        },
        {
          source: "/integrations/twilio-sms",
          destination: "/integrations/sms/twilio-sms",
          permanent: true,
        },
      ];
    },
  },
);
