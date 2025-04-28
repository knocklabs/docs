import { type ReactNode } from "react";
import type { SidebarSection } from "./types";
import { icons } from "@/components/SdkCard";

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
    sidebarMenuDefaultOpen: true,
  },
];

const languages = {
  react: "react",
  javascript: "javascript",
  angular: "angular",
  "react-native": "react-native",
  ios: "ios",
  android: "android",
  flutter: "flutter",
} as const;

export type Language = keyof typeof languages;

export type SdkSpecificContent = {
  items: SidebarSection[];
  title: string;
  value: string;
  icon: ReactNode;
};

const sdkSpecificContent: Record<Language, SdkSpecificContent> = {
  react: {
    title: "React",
    value: "react",
    icon: icons.react,
    items: [
      {
        title: "UI Components",
        slug: "/in-app-ui/react",
        desc: "Use the Knock in-app experiences APIs and components to build rich notifications experiences inside of your product.",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/feed", title: "Notification feed" },
          // {
          //   slug: "/messaging-components",
          //   title: "Messaging components",
          //   isBeta: true,
          // },
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
          {
            slug: "/migrating-from-react-notification-feed",
            title: "Migrating from @knocklabs/react-notification-feed",
          },
        ],
      },
    ],
  },
  javascript: {
    title: "JavaScript",
    value: "javascript",
    icon: icons.javascript,
    items: [
      {
        title: "UI Components",
        slug: "/in-app-ui/javascript",
        pages: [{ slug: "/overview", title: "Overview" }],
      },
    ],
  },
  angular: {
    title: "Angular",
    value: "angular",
    icon: icons.angular,
    items: [
      {
        title: "UI Components",
        slug: "/in-app-ui/angular",
        pages: [{ slug: "/overview", title: "Overview" }],
      },
    ],
  },
  "react-native": {
    title: "React Native",
    value: "react-native",
    icon: icons.reactnative,
    items: [
      {
        title: "UI Components",
        slug: "/in-app-ui/react-native",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/components", title: "Components" },
          { slug: "/customization", title: "Customization" },
          {
            slug: "/notification-feeds",
            title: "Custom notifications UI (headless)",
          },
        ],
      },
    ],
  },
  ios: {
    title: "iOS",
    value: "ios",
    icon: icons.expo,
    items: [
      {
        title: "UI Components",
        slug: "/in-app-ui/ios",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/components", title: "Components" },
          { slug: "/customization", title: "Customization" },
        ],
      },
    ],
  },
  android: {
    title: "Android (Kotlin)",
    value: "android",
    icon: icons.kotlin,
    items: [
      {
        title: "UI Components",
        slug: "/in-app-ui/android",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/components", title: "Components" },
          { slug: "/customization", title: "Customization" },
        ],
      },
    ],
  },
  flutter: {
    title: "Flutter",
    value: "flutter",
    icon: icons.flutter,
    items: [
      {
        title: "UI Components",
        slug: "/in-app-ui/flutter",
        pages: [{ slug: "/overview", title: "Overview" }],
      },
    ],
  },
};

export { mainContent, sdkSpecificContent };
