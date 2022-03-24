/* eslint-disable no-underscore-dangle */
/* eslint-disable global-require */
const withPlugins = require("next-compose-plugins");
const withMdxEnhanced = require("next-mdx-enhanced");

const autoLinkSettings = {
  behavior: "prepend",
  content: { type: "element", tagName: "span" },
};

function makeIdFromPath(resourcePath) {
  return resourcePath.replace(".mdx", "").replace("/index", "");
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
      extendFrontMatter: {
        process: (mdxContent, frontMatter) => {
          return {
            id: makeIdFromPath(frontMatter.__resourcePath),
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
