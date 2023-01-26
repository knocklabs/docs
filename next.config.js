/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
const withPlugins = require("next-compose-plugins");
const withMdxEnhanced = require("next-mdx-enhanced");
const algoliasearch = require("algoliasearch");
const mdx = require("@mdx-js/mdx");

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

          if (c.id === "reference") {
            const comp = mdx.createCompiler();
            const compiled = comp.parse(c.content);

            // Parse all sections from API Reference
            const sections = compiled.children.filter(
              (ch) =>
                ch.type === "jsx" &&
                ch.value.includes("Section") &&
                !ch.value.includes("/Section"),
            );

            const referenceObjects = sections.map((s) => {
              // The value of each parsed element here will look something like:
              // "<Section title=\"Bulk delete objects in a collection\" slug=\"bulk-delete-objects\">"
              // The following regexes parse the title and the slug from the section

              const { title } = s.value.match(
                /title=['"](?<title>.*?)['"]/,
              ).groups;
              const { slug } = s.value.match(
                /slug=['"](?<slug>.*?)['"]/,
              ).groups;

              return {
                objectID: `reference#${slug}`,
                path: `reference#${slug}`,
                title,
                section: "API reference",
                tags: [],
              };
            });

            try {
              // we send all API reference entries in bulk to reduce calls
              await index.saveObjects(referenceObjects);
            } catch (e) {
              /* eslint-disable no-console */
              console.error(e);
              /* eslint-enable no-console */
            }
          } else {
            try {
              // Notes:
              // Algolia recommends saving objects in batches because of efficiency.
              // Our markdown processor doesn't provide a callback to subscribe to that
              // gets called after finishing with all elements.
              //
              // Given we only have ~40 items to be indexed right now, we are just saving
              // entries one by one.
              await index.saveObject({
                // The path to the page will be the identifier in Algolia.
                objectID: c.id,
                path: c.id,
                title: c.title,
                section: c.section,
                // Once we add tags are added to pages, Algolia records
                // will be updated with them, so we can enhance the search experience
                tags: c.tags || [],
              });
            } catch (e) {
              /* eslint-disable no-console */
              console.error(e);
              /* eslint-enable no-console */
            }
          }
        } else {
          /* eslint-disable no-console */
          console.info(
            "Algolia configuration variables not present. Skipping indexing.",
          );
          /* eslint-enable no-console */
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
          source: "/integrations",
          destination: "/integrations/overview",
          permanent: false,
        },
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
          source: "/integrations/in-app-feed",
          destination: "/integrations/in-app/knock",
          permanent: true,
        },
        {
          source: "/integrations/in-app",
          destination: "/integrations/in-app/overview",
          permanent: true,
        },
        {
          source: "/integrations/in-app-feed/overview",
          destination: "/integrations/in-app/knock",
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
        {
          source: "/integrations/sms/twilio-sms",
          destination: "/integrations/sms/twilio",
          permanent: true,
        },
        // Old feed docs
        {
          source: "/client-integration/authenticating-users",
          destination: "/in-app-ui/security-and-authentication",
          permanent: true,
        },
        {
          source: "/notification-feeds/overview",
          destination: "/in-app-ui/react/overview",
          permanent: true,
        },
        {
          source: "/notification-feeds/getting-started",
          destination: "/in-app-ui/react/feed",
          permanent: true,
        },
        {
          source: "/notification-feeds/customizing-ui",
          destination: "/in-app-ui/react/feed",
          permanent: true,
        },
        {
          source: "/notification-feeds/bring-your-own-ui",
          destination: "/in-app-ui/react/custom-notifications-ui",
          permanent: true,
        },
        {
          source: "/notification-feeds/feed-features",
          destination: "/integrations/in-app-feed/overview",
          permanent: true,
        },
        {
          source: "/send-and-manage-data/multi-tenancy",
          destination: "/send-and-manage-data/tenants",
          permanent: true,
        },
        {
          source: "/send-notifications/workflow-functions",
          destination: "/send-notifications/designing-workflows#function-steps",
          permanent: true,
        },
        {
          source: "/send-notifications/reference-email-layout",
          destination: "/integrations/email/layouts",
          permanent: true,
        },
        {
          source:
            "/send-notifications/designing-workflows/reference-email-layout",
          destination: "/integrations/email/layouts",
          permanent: true,
        },
        {
          source: "/send-notifications/reference-liquid-helpers",
          destination:
            "/send-notifications/designing-workflows/reference-liquid-helpers",
          permanent: true,
        },
        {
          source: "/send-notifications/designing-workflows/trigger-conditions",
          destination:
            "/send-notifications/designing-workflows/step-conditions",
          permanent: true,
        },
        {
          source: "/integrations/chat/slack",
          destination: "/integrations/chat/slack/overview",
          permanent: true,
        },
        {
          source: "/in-app-ui/react",
          destination: "/in-app-ui/react/overview",
          permanent: false,
        },
        {
          source: "/in-app-ui/javascript",
          destination: "/in-app-ui/javascript/overview",
          permanent: false,
        },
        {
          source: "/in-app-ui/react-native",
          destination: "/in-app-ui/react-native/overview",
          permanent: false,
        },
        {
          source: "/in-app-ui/ios",
          destination: "/in-app-ui/ios/overview",
          permanent: false,
        },
        {
          source: "/in-app-ui/android",
          destination: "/in-app-ui/android/overview",
          permanent: false,
        },
        {
          source: "/send-notifications/designing-workflows",
          destination: "/designing-workflows",
          permanent: false,
        },
        {
          source: "/send-notifications/designing-workflows/reference-:match",
          destination: "/designing-workflows/references/reference-:match",
          permanent: false,
        },
        {
          source: "/send-notifications/designing-workflows/:any",
          destination: "/designing-workflows/:any",
          permanent: false,
        },
      ];
    },
  },
);
