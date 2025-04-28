import { SidebarSection } from "./types";

const sidebarContent: SidebarSection[] = [
  {
    title: "Getting started",
    slug: "/getting-started",
    desc: "A technical and non-technical introduction to the basics of Knock, and a step-by-step guide to get you going in minutes.",
    pages: [
      { slug: "/what-is-knock", title: "What is Knock?" },
      { slug: "/quick-start", title: "Quick start" },
      { slug: "/example-apps", title: "Example apps" },
    ],
    sidebarMenuDefaultOpen: true,
  },
  {
    title: "Concepts",
    slug: "/concepts",
    desc: "Learn about the key concepts in Knock.",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/workflows", title: "Workflows" },
      { slug: "/channels", title: "Channels" },
      { slug: "/commits", title: "Commits" },
      { slug: "/environments", title: "Environments" },
      { slug: "/recipients", title: "Recipients" },
      { slug: "/users", title: "Users" },
      { slug: "/preferences", title: "Preferences" },
      { slug: "/objects", title: "Objects" },
      { slug: "/subscriptions", title: "Subscriptions" },
      { slug: "/schedules", title: "Schedules" },
      { slug: "/tenants", title: "Tenants" },
      { slug: "/messages", title: "Messages" },
      { slug: "/translations", title: "Translations" },
      { slug: "/conditions", title: "Conditions" },
      { slug: "/variables", title: "Variables" },
      { slug: "/audiences", title: "Audiences", isBeta: true },
      { slug: "/broadcasts", title: "Broadcasts", isBeta: true },
    ],
  },
  {
    title: "Designing workflows",
    slug: "/designing-workflows",
    desc: "Learn how to design notifications using Knock's workflow builder, then explore advanced features such as batching, delays, and more.",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/delay-function", title: "Delay function" },
      { slug: "/batch-function", title: "Batch function" },
      { slug: "/branch-function", title: "Branch function" },
      { slug: "/fetch-function", title: "Fetch function" },
      { slug: "/throttle-function", title: "Throttle function" },
      {
        slug: "/trigger-workflow-function",
        title: "Trigger workflow function",
        isBeta: true,
      },
      { slug: "/step-conditions", title: "Step conditions" },
      { slug: "/channel-step", title: "Channel steps" },
      { slug: "/send-windows", title: "Send windows" },
      { slug: "/partials", title: "Partials" },
      {
        title: "Template editor",
        slug: "/template-editor",
        pages: [
          {
            slug: "/overview",
            title: "Overview",
          },
          {
            slug: "/variables",
            title: "Variables",
          },
          {
            slug: "/referencing-data",
            title: "Referencing data",
          },
          {
            slug: "/api-reference-liquid-helpers",
            title: "Liquid helpers",
          },
        ],
      },
    ],
  },
  {
    title: "Managing recipients",
    slug: "/managing-recipients",
    desc: "Learn more about how to manage notification recipients with Knock.",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/identifying-recipients", title: "Identifying recipients" },
      { slug: "/setting-channel-data", title: "Setting channel data" },
      { slug: "/deleting-users", title: "Deleting users" },
      { slug: "/merging-users", title: "Merging users" },
    ],
  },
  {
    title: "Send notifications",
    slug: "/send-notifications",
    desc: "Learn how to send and debug notifications using Knock.",
    pages: [
      {
        slug: "/triggering-workflows",
        title: "Triggering workflows",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/api", title: "With the API" },
          { slug: "/schedules", title: "On a schedule" },
          { slug: "/events", title: "From an event" },
          { slug: "/audiences", title: "For an audience", isBeta: true },
        ],
      },
      { slug: "/canceling-workflows", title: "Canceling workflows" },
      { slug: "/delivering-notifications", title: "Delivering notifications" },
      { slug: "/message-statuses", title: "Message statuses" },
      { slug: "/tracking", title: "Link & open tracking" },
      { slug: "/testing-workflows", title: "Testing workflows" },
      { slug: "/debugging-workflows", title: "Debugging workflows" },
    ],
  },
  {
    title: "Preferences",
    slug: "/preferences",
    desc: "Learn how to power notification preferences with Knock.",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/tenant-preferences", title: "Tenant preferences" },
      { slug: "/object-preferences", title: "Object preferences" },
      { slug: "/preference-conditions", title: "Preferences conditions" },
    ],
  },

  // {
  //   title: "SDKs",
  //   slug: "/sdks",
  //   desc: "",
  //   pages: [
  //     {
  //       title: "Overview",
  //       slug: "/overview",
  //     },
  //     {
  //       title: "React (Web)",
  //       slug: "/react",
  //       pages: [
  //         { slug: "/overview", title: "Overview" },
  //         { slug: "/api-reference", title: "API reference" },
  //       ],
  //     },
  //     {
  //       title: "Javascript (Web)",
  //       slug: "/javascript",
  //       pages: [
  //         { slug: "/overview", title: "Overview" },
  //         { slug: "/quick-start", title: "Quick start" },
  //         { slug: "/api-reference", title: "API reference" },
  //       ],
  //     },
  //     {
  //       title: "iOS (Swift)",
  //       slug: "/ios",
  //       pages: [
  //         { slug: "/overview", title: "Overview" },
  //         { slug: "/quick-start", title: "Quick start" },
  //         { slug: "/push-notifications", title: "Push notifications" },
  //         { slug: "/deep-links", title: "Deep/universal links" },
  //         { slug: "/api-reference", title: "API reference" },
  //       ],
  //     },
  //     {
  //       title: "Android (Kotlin)",
  //       slug: "/android",
  //       pages: [
  //         { slug: "/overview", title: "Overview" },
  //         { slug: "/quick-start", title: "Quick start" },
  //         { slug: "/push-notifications", title: "Push notifications" },
  //         { slug: "/deep-links", title: "Deep links" },
  //         { slug: "/api-reference", title: "API reference" },
  //       ],
  //     },
  //     {
  //       title: "Flutter",
  //       slug: "/flutter",
  //       pages: [
  //         { slug: "/overview", title: "Overview" },
  //         { slug: "/quick-start", title: "Quick start" },
  //         { slug: "/api-reference", title: "API reference" },
  //       ],
  //     },
  //     {
  //       title: "React Native",
  //       slug: "/react-native",
  //       pages: [
  //         { slug: "/overview", title: "Overview" },
  //         { slug: "/quick-start", title: "Quick start" },
  //         { slug: "/push-notifications", title: "Push notifications" },
  //         { slug: "/api-reference", title: "API reference" },
  //       ],
  //     },
  //     {
  //       title: "Expo",
  //       slug: "/expo",
  //       pages: [
  //         { slug: "/overview", title: "Overview" },
  //         { slug: "/push-notifications", title: "Push notifications" },
  //         { slug: "/api-reference", title: "API reference" },
  //       ],
  //     },
  //   ],
  // },

  {
    title: "Manage your account",
    slug: "/manage-your-account",
    desc: "Learn more about the tools available in managing your Knock account.",
    pages: [
      { slug: "/authentication-methods", title: "Authentication methods" },
      { slug: "/saml-sso", title: "SAML SSO" },
      { slug: "/directory-sync", title: "Directory sync (SCIM)" },
      { slug: "/managing-members", title: "Managing members" },
      { slug: "/roles-and-permissions", title: "Roles and permissions" },
      { slug: "/audit-logs", title: "Audit logs" },
      { slug: "/data-obfuscation", title: "Data obfuscation" },
      { slug: "/account-timezone", title: "Account timezone" },
      { slug: "/data-retention", title: "Data retention" },
    ],
  },
];

const developerToolsContent: SidebarSection[] = [
  {
    title: "Developer tools",
    slug: "/developer-tools",
    desc: "Use our powerful developer tools in order to integrate Knock seamlessly into your development workflow.",
    pages: [
      { slug: "/api-keys", title: "API keys" },
      { slug: "/service-tokens", title: "Service tokens" },
      { slug: "/knock-cli", title: "Knock CLI" },
      { slug: "/management-api", title: "Management API" },
      { slug: "/api-logs", title: "API logs" },
      { slug: "/knock-and-postman", title: "Knock and Postman" },
      { slug: "/security", title: "Security" },
      { slug: "/integrating-into-cicd", title: "Integrating into CI/CD" },
      {
        slug: "/outbound-webhooks",
        title: "Outbound webhooks",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/event-types", title: "Event types" },
        ],
      },
      { slug: "/validating-trigger-data", title: "Validating trigger data" },
    ],
  },
];

const guidesContent: SidebarSection[] = [
  {
    title: "Guides",
    slug: "/guides",
    pages: [
      {
        slug: "/implementation-guide",
        title: "Knock implementation guide",
      },
      {
        slug: "/alerting",
        title: "Alerting",
      },
      {
        slug: "/customer-webhooks",
        title: "Customer-facing webhooks",
      },
      {
        slug: "/building-recurring-digests",
        title: "Recurring digests",
      },
      { slug: "/migrate-from-courier", title: "Migrate from Courier" },
      {
        slug: "/modeling-users-objects-and-tenants",
        title: "Modeling Users, Objects, and Tenants",
      },
    ],
  },
];

const inAppUiContent: SidebarSection[] = [
  {
    title: "In-app UI",
    slug: "/in-app-ui",
    desc: "Use the Knock in-app experiences APIs and components to build rich notifications experiences inside of your product.",
    pages: [
      { slug: "/overview", title: "Overview" },
      {
        slug: "/api-overview",
        title: "API endpoints",
      },
      {
        slug: "/security-and-authentication",
        title: "Security & authentication",
      },
      {
        slug: "/message-types",
        title: "Message types",
        isBeta: true,
      },
      // {
      //   title: "React",
      //   slug: "/react",
      //   pages: [
      //     { slug: "/overview", title: "Overview" },
      //     { slug: "/feed", title: "Notification feed" },
      //     {
      //       slug: "/messaging-components",
      //       title: "Messaging components",
      //       isBeta: true,
      //     },
      //     { slug: "/toasts", title: "Toasts" },
      //     { slug: "/inbox", title: "Notification inbox" },
      //     {
      //       slug: "/custom-notifications-ui",
      //       title: "Custom feed UI (headless)",
      //     },
      //     { slug: "/preferences", title: "Preferences" },
      //     { slug: "/slack-kit", title: "SlackKit" },
      //     { slug: "/teams-kit", title: "TeamsKit" },
      //     {
      //       slug: "/filtering-in-app-feeds",
      //       title: "Filtering feeds",
      //     },
      //     {
      //       slug: "/customizing-feed-components",
      //       title: "Customizing feed components",
      //     },
      //   ],
      // },
      // {
      //   title: "Javascript",
      //   slug: "/javascript",
      //   pages: [{ slug: "/overview", title: "Overview" }],
      // },
      // {
      //   title: "Angular",
      //   slug: "/angular",
      //   pages: [{ slug: "/overview", title: "Overview" }],
      // },
      // {
      //   title: "React Native",
      //   slug: "/react-native",
      //   pages: [
      //     { slug: "/overview", title: "Overview" },
      //     { slug: "/components", title: "Components" },
      //     {
      //       slug: "/customization",
      //       title: "Customization",
      //     },
      //     {
      //       slug: "/notification-feeds",
      //       title: "Custom notifications UI (headless)",
      //     },
      //   ],
      // },
      // {
      //   title: "iOS (Swift)",
      //   slug: "/ios",
      //   pages: [
      //     { slug: "/overview", title: "Overview" },
      //     { slug: "/components", title: "Components" },
      //     {
      //       slug: "/customization",
      //       title: "Customization",
      //     },
      //   ],
      // },
      // {
      //   title: "Android (Kotlin)",
      //   slug: "/android",
      //   pages: [
      //     { slug: "/overview", title: "Overview" },
      //     { slug: "/components", title: "Components" },
      //     {
      //       slug: "/customization",
      //       title: "Customization",
      //     },
      //   ],
      // },
      // {
      //   title: "Flutter",
      //   slug: "/flutter",
      //   pages: [{ slug: "/overview", title: "Overview" }],
      // },
    ],
  },
];

const cliContent: SidebarSection[] = [
  {
    title: "Getting started",
    slug: "/cli/overview",
    pages: [
      { slug: "", title: "Introduction" },
      { slug: "/installation", title: "Install the Knock CLI" },
      { slug: "/authentication", title: "Authentication" },
      { slug: "/global-flags", title: "Global flags" },
    ],
  },
  {
    title: "Workflows",
    slug: "/cli/workflow",
    pages: [
      { slug: "/list", title: "List workflows" },
      { slug: "/get", title: "Get workflows" },
      { slug: "/pull", title: "Pull workflows" },
      { slug: "/push", title: "Push workflows" },
      { slug: "/run", title: "Run workflow" },
      { slug: "/validate", title: "Validate workflow" },
      { slug: "/activate", title: "Activate workflow" },
    ],
  },

  {
    title: "Email layouts",
    slug: "/cli/email-layout",
    pages: [
      { slug: "/list", title: "List email layouts" },
      { slug: "/get", title: "Get email layouts" },
      { slug: "/pull", title: "Pull email layouts" },
      { slug: "/push", title: "Push email layouts" },
      { slug: "/validate", title: "Validate email layouts" },
    ],
  },

  {
    title: "Translations",
    slug: "/cli/translation",
    pages: [
      { slug: "/list", title: "List translations" },
      { slug: "/get", title: "Get translations" },
      { slug: "/pull", title: "Pull translations" },
      { slug: "/push", title: "Push translations" },
      { slug: "/validate", title: "Validate translations" },
    ],
  },

  {
    title: "Partials",
    slug: "/cli/partial",
    pages: [
      { slug: "/list", title: "List partials" },
      { slug: "/get", title: "Get partials" },
      { slug: "/pull", title: "Pull partials" },
      { slug: "/push", title: "Push partials" },
      { slug: "/validate", title: "Validate partials" },
    ],
  },

  {
    title: "Commits",
    slug: "/cli/commit",
    pages: [
      { slug: "/list", title: "List commits" },
      { slug: "/get", title: "Get commits" },
      { slug: "/all", title: "Commit changes" },
      { slug: "/promote", title: "Promote changes" },
    ],
  },
];

export { guidesContent, developerToolsContent, inAppUiContent, cliContent };

export default sidebarContent;
