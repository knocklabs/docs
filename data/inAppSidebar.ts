import { SidebarPage, SidebarSection } from "./types";

const mainContent: SidebarSection[] = [
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
        title: "Security & auth",
      },
      {
        slug: "/message-types",
        title: "Message types",
        isBeta: true,
      },
    ],
  },
];

const sdkSpecificContent: Record<string, SidebarSection[]> = {
  react: [
    {
      title: "UI Components",
      slug: "/in-app-ui/react",
      desc: "Use the Knock in-app experiences APIs and components to build rich notifications experiences inside of your product.",
      pages: [
        { slug: "/overview", title: "Overview" },
        { slug: "/feed", title: "Notification feed" },
        {
          slug: "/messaging-components",
          title: "Messaging components",
          isBeta: true,
        },
        { slug: "/toasts", title: "Toasts" },
        { slug: "/inbox", title: "Notification inbox" },
        {
          slug: "/custom-notifications-ui",
          title: "Custom feed UI (headless)",
        },
        { slug: "/preferences", title: "Preferences" },
        { slug: "/slack-kit", title: "SlackKit" },
        { slug: "/teams-kit", title: "TeamsKit" },
        {
          slug: "/filtering-in-app-feeds",
          title: "Filtering feeds",
        },
        {
          slug: "/customizing-feed-components",
          title: "Customizing feed components",
        },
      ],
    },
  ],
};

export { mainContent, sdkSpecificContent };
