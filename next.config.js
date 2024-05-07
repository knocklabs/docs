/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
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
        destination: "/send-notifications/designing-workflows/step-conditions",
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
      {
        source: "/designing-workflows/references",
        destination:
          "/designing-workflows/template-editor/reference-liquid-helpers",
        permanent: false,
      },
      {
        source: "/designing-workflows/references/reference-liquid-helpers",
        destination:
          "/designing-workflows/template-editor/reference-liquid-helpers",
        permanent: false,
      },
      {
        source: "/designing-workflows/template-editor",
        destination: "/designing-workflows/template-editor/overview",
        permanent: false,
      },
      {
        source: "/send-and-manage-data/outbound-webhooks",
        destination: "/developer-tools/outbound-webhooks",
        permanent: false,
      },
      {
        source: "/integrations/vercel",
        destination: "/integrations/extensions/vercel",
        permanent: false,
      },
      {
        source: "/in-app-ui/angular",
        destination: "/in-app-ui/angular/overview",
        permanent: false,
      },
      {
        source: "/send-and-manage-data/concepts",
        destination: "/concepts/overview",
        permanent: false,
      },
      {
        source: "/send-and-manage-data/:slug*",
        destination: "/concepts/:slug*",
        permanent: false,
      },
      {
        source: "/send-notifications/setting-preferences",
        destination: "/managing-recipients/setting-preferences",
        permanent: false,
      },
      {
        source: "/send-notifications/setting-channel-data",
        destination: "/managing-recipients/setting-channel-data",
        permanent: false,
      },
      {
        source: "/designing-workflows",
        destination: "/designing-workflows/overview",
        permanent: true,
      },
      {
        source: "/security",
        destination: "/getting-started/security",
        permanent: true,
      },
      {
        source: "/developer-tools/outbound-webhooks",
        destination: "/developer-tools/outbound-webhooks/overview",
        permanent: false,
      },
      {
        source: "/guides/customizing-react-in-app-feed-components",
        destination: "/in-app-ui/react/customizing-feed-components",
        permanent: false,
      },
      {
        source: "/guides/filtering-in-app-feeds",
        destination: "/in-app-ui/react/filtering-in-app-feeds",
        permanent: false,
      },
      // Reference redirects
      {
        source: "/in-app-ui/:sdk/reference",
        destination: "/sdks/:sdk/reference",
        permanent: false,
      },
      {
        source: "/getting-started/going-to-production",
        destination: "/guides/going-to-production",
        permanent: false,
      },
      {
        source: "/getting-started/knock-and-postman",
        destination: "/developer-tools/knock-and-postman",
        permanent: true,
      },
      {
        source: "/getting-started/security",
        destination: "/developer-tools/security",
        permanent: true,
      },
      {
        source: "/getting-started/how-knock-works",
        destination: "/getting-started/what-is-knock",
        permanent: true,
      },
      {
        source: "/getting-started/example-app",
        destination: "/getting-started/example-apps",
        permanent: true,
      },
      {
        source: "/concepts",
        destination: "/concepts/overview",
        permanent: false,
      },
      {
        source: "/in-app-ui/javascript/quick-start",
        destination: "/sdks/javascript/quick-start",
        permanent: false,
      },
      {
        source: "/SDKs/overview",
        destination: "/sdks/overview",
        permanent: false,
      },
      {
        source: "/in-app-ui/android/quick-start",
        destination: "/sdks/android/quick-start",
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
