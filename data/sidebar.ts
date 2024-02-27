import { SidebarSection } from "./types";

const sidebarContent: SidebarSection[] = [
  {
    title: "Getting started",
    slug: "/getting-started",
    desc: "A technical and non-technical introduction to the basics of Knock, and a step-by-step guide to get you going in minutes.",
    pages: [
      { slug: "/what-is-knock", title: "What is Knock?" },
      { slug: "/how-knock-works", title: "How Knock works" },
      { slug: "/quick-start", title: "Quick start" },
      { slug: "/example-app", title: "Example apps" },
      { slug: "/knock-and-postman", title: "Knock and Postman" },
      { slug: "/security", title: "Security", path: "/security" },
      { slug: "/going-to-production", title: "Going to production" },
    ],
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
      { slug: "/step-conditions", title: "Step conditions" },
      { slug: "/channel-step", title: "Channel steps" },
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
            slug: "/reference-liquid-helpers",
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
      { slug: "/setting-preferences", title: "Setting preferences" },
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
      { slug: "/triggering-workflows", title: "Triggering workflows" },
      { slug: "/canceling-workflows", title: "Canceling workflows" },
      { slug: "/delivering-notifications", title: "Delivering notifications" },
      { slug: "/message-statuses", title: "Message statuses" },
      { slug: "/tracking", title: "Link & open tracking" },
      { slug: "/testing-workflows", title: "Testing workflows" },
      { slug: "/debugging-workflows", title: "Debugging workflows" },
    ],
  },
  {
    title: "Building in-app UI",
    slug: "/in-app-ui",
    desc: "Use the Knock in-app experiences APIs and components to build rich notifications experiences inside of your product.",
    pages: [
      { slug: "/overview", title: "Overview" },
      {
        slug: "/security-and-authentication",
        title: "Security & authentication",
      },
      {
        title: "React",
        slug: "/react",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/feed", title: "Feeds" },
          { slug: "/toasts", title: "Toasts" },
          { slug: "/inbox", title: "Inbox" },
          {
            slug: "/custom-notifications-ui",
            title: "Custom notifications UI",
          },
          { slug: "/preferences", title: "Preferences" },
          { slug: "/slack-kit", title: "SlackKit" },
          { slug: "/reference", title: "API reference" },
        ],
      },
      {
        title: "Javascript",
        slug: "/javascript",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/quick-start", title: "Quick start" },
          { slug: "/reference", title: "API reference" },
        ],
      },
      {
        title: "Angular",
        slug: "/angular",
        pages: [{ slug: "/overview", title: "Overview" }],
      },
      {
        title: "React Native",
        slug: "/react-native",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/notification-feeds", title: "Feeds" },
          { slug: "/reference", title: "API reference" },
        ],
      },
      {
        title: "iOS (Swift)",
        slug: "/ios",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/quick-start", title: "Quick start" },
          { slug: "/reference", title: "API reference" },
        ],
      },
      {
        title: "Android (Kotlin)",
        slug: "/android",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/quick-start", title: "Quick start" },
          { slug: "/reference", title: "API reference" },
        ],
      },
      {
        title: "Flutter",
        slug: "/flutter",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/quick-start", title: "Quick start" },
          { slug: "/reference", title: "API reference" },
        ],
      },
    ],
  },

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
      {
        slug: "/outbound-webhooks",
        title: "Outbound webhooks",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/event-types", title: "Event types" },
        ],
      },
      { slug: "/integrating-into-cicd", title: "Integrating into CI/CD" },
    ],
  },
  {
    title: "Manage your account",
    slug: "/manage-your-account",
    desc: "Learn more about the tools available in managing your Knock account.",
    pages: [
      { slug: "/authentication-methods", title: "Authentication methods" },
      { slug: "/saml-sso", title: "SAML SSO" },
      { slug: "/managing-members", title: "Managing members" },
      { slug: "/roles-and-permissions", title: "Roles and permissions" },
      { slug: "/audit-logs", title: "Audit logs" },
      { slug: "/data-obfuscation", title: "Data obfuscation" },
    ],
  },

  {
    title: "Guides",
    slug: "/guides",
    pages: [
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
      {
        slug: "/filtering-in-app-feeds",
        title: "Filtering in-app feeds",
      },
      {
        slug: "/customizing-react-in-app-feed-components",
        title: "Customizing the React in-app feed components",
      },
    ],
  },
];

export default sidebarContent;
