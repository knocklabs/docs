const path = require("path");

// Refresh the site when content changes
const withRemoteRefresh = require("next-remote-refresh")({
  paths: [path.resolve(__dirname, "content")],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  async redirects() {
    return [
      {
        source: "/integrations",
        destination: "/integrations/overview",
        permanent: true,
      },
      {
        source: "/integrations/email",
        destination: "/integrations/email/attachments",
        permanent: true,
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
        permanent: true,
      },
      {
        source: "/integrations/push",
        destination: "/integrations/push/overview",
        permanent: true,
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
        permanent: true,
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
      {
        source: "/integrations/chat/microsoft-teams",
        destination: "/integrations/chat/microsoft-teams/overview",
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
        destination: "/designing-workflows/overview",
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
          "/designing-workflows/template-editor/reference-liquid-helpers",
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
        permanent: true,
      },
      {
        source: "/in-app-ui/javascript",
        destination: "/in-app-ui/javascript/overview",
        permanent: true,
      },
      {
        source: "/in-app-ui/react-native",
        destination: "/in-app-ui/react-native/overview",
        permanent: true,
      },
      {
        source: "/in-app-ui/ios",
        destination: "/in-app-ui/ios/overview",
        permanent: true,
      },
      {
        source: "/in-app-ui/android",
        destination: "/in-app-ui/android/overview",
        permanent: true,
      },
      {
        source: "/send-notifications/designing-workflows",
        destination: "/designing-workflows",
        permanent: true,
      },
      {
        source: "/send-notifications/designing-workflows/reference-:match",
        destination: "/designing-workflows/references/reference-:match",
        permanent: true,
      },
      {
        source: "/send-notifications/designing-workflows/:any",
        destination: "/designing-workflows/:any",
        permanent: true,
      },
      {
        source: "/designing-workflows/references",
        destination:
          "/designing-workflows/template-editor/reference-liquid-helpers",
        permanent: true,
      },
      {
        source: "/designing-workflows/references/reference-liquid-helpers",
        destination:
          "/designing-workflows/template-editor/reference-liquid-helpers",
        permanent: true,
      },
      {
        source: "/designing-workflows/template-editor",
        destination: "/designing-workflows/template-editor/overview",
        permanent: true,
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
        permanent: true,
      },
      {
        source: "/send-and-manage-data/concepts",
        destination: "/concepts/overview",
        permanent: true,
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
        source: "/managing-recipients/setting-preferences",
        destination: "/preferences/overview#set-a-users-preferences",
        permanent: true,
      },
      {
        source: "/send-notifications/setting-channel-data",
        destination: "/managing-recipients/setting-channel-data",
        permanent: true,
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
        permanent: true,
      },
      {
        source: "/guides/customizing-react-in-app-feed-components",
        destination: "/in-app-ui/react/customizing-feed-components",
        permanent: true,
      },
      {
        source: "/guides/filtering-in-app-feeds",
        destination: "/in-app-ui/react/filtering-in-app-feeds",
        permanent: true,
      },
      // Reference redirects
      {
        source: "/sdks/:sdk",
        destination: "/in-app-ui/:sdk/sdk/overview",
        permanent: true,
      },
      {
        source: "/sdks/:sdk/reference",
        destination: "/in-app-ui/:sdk/sdk/reference",
        permanent: true,
      },
      {
        source: "/getting-started/going-to-production",
        destination: "/tutorials/implementation-guide#going-to-production",
        permanent: true,
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
        permanent: true,
      },
      {
        source: "/in-app-ui/javascript/quick-start",
        destination: "/in-app-ui/javascript/sdk/quick-start",
        permanent: true,
      },
      {
        source: "/in-app-ui/android/quick-start",
        destination: "/in-app-ui/android/sdk/quick-start",
        permanent: true,
      },
      {
        source: "/in-app-ui/flutter",
        destination: "/in-app-ui/flutter/sdk/overview",
        permanent: true,
      },
      {
        source: "/guides/going-to-production",
        destination: "/tutorials/implementation-guide#going-to-production",
        permanent: true,
      },
      //SlackKit redirects
      {
        source: "/integrations/chat/slack/how-knock-slacks",
        destination: "/integrations/chat/slack/overview",
        permanent: true,
      },
      {
        source: "/integrations/chat/slack/building-a-slack-app",
        destination:
          "/integrations/chat/slack/overview#how-to-connect-slack-to-knock",
        permanent: true,
      },
      {
        source: "/integrations/chat/slack/designing-slack-templates",
        destination:
          "/integrations/chat/slack/overview#designing-notification-templates-for-slack",
        permanent: true,
      },
      {
        source: "/integrations/chat/slack/slack-interactivity",
        destination:
          "/integrations/chat/slack/overview#designing-notification-templates-for-slack",
        permanent: true,
      },
      {
        source: "/integrations/chat/slack/slack-examples",
        destination: "/integrations/chat/slack/overview",
        permanent: true,
      },
      {
        source: "/integrations/chat/slack-kit/overview",
        destination: "/integrations/chat/slack/overview",
        permanent: true,
      },
      {
        source: "/integrations/chat/slack-kit/setup",
        destination: "/integrations/chat/slack/overview",
        permanent: true,
      },
      {
        source: "/integrations/chat/slack-kit/resource-access-grants",
        destination: "/in-app-ui/react/slack-kit#resources-access-grants",
        permanent: true,
      },
      {
        source: "/integrations/chat/slack-kit/ui",
        destination: "/in-app-ui/react/slack-kit#getting-started",
        permanent: true,
      },
      {
        source: "/integrations/chat/slack-kit/trigger-workflow",
        destination: "/integrations/chat/slack/overview",
        permanent: true,
      },
      {
        source: "/integrations/chat/slack-diy/slack-apps-and-scopes",
        destination: "/integrations/chat/slack/overview",
        permanent: true,
      },
      {
        source: "/integrations/chat/slack-diy/building-oauth-flow",
        destination: "/integrations/chat/slack/overview",
        permanent: true,
      },
      {
        source: "/send-notifications/triggering-workflows",
        destination: "/send-notifications/triggering-workflows/overview",
        permanent: true,
      },
      {
        source: "/mapi",
        destination: "/mapi-reference",
        permanent: true,
      },
      {
        source: "/developer-tools",
        destination: "/developer-tools/overview",
        permanent: true,
      },
      {
        source: "/tutorials",
        destination: "/tutorials/overview",
        permanent: true,
      },
      {
        source: "/in-app-ui",
        destination: "/in-app-ui/overview",
        permanent: true,
      },
      {
        source: "/guides",
        destination: "/tutorials/overview",
        permanent: true,
      },
      {
        source: "/guides/:guide",
        destination: "/tutorials/:guide",
        permanent: true,
      },
      {
        source: "/sdks",
        destination: "/developer-tools/sdks",
        permanent: true,
      },
      {
        source: "/sdks/overview",
        destination: "/developer-tools/sdks",
        permanent: true,
      },
      {
        source: "/sdks/:sdk/overview",
        destination: "/in-app-ui/:sdk/sdk/overview",
        permanent: true,
      },
      {
        source: "/in-app-ui/react/messaging-components",
        destination: "/in-app-ui/react/feed",
        permanent: true,
      },
      {
        source: "/agent-toolkit",
        destination: "/developer-tools/agent-toolkit/overview",
        permanent: false,
      },
      {
        source: "/in-app-ui/filtering-in-app-feeds",
        destination: "/in-app-ui/feeds/filtering-in-app-feeds",
        permanent: true,
      },
      {
        source: "/in-app-ui/react/filtering-in-app-feeds",
        destination: "/in-app-ui/feeds/filtering-in-app-feeds",
        permanent: true,
      },
    ];
  },
};

module.exports = withRemoteRefresh(nextConfig);
