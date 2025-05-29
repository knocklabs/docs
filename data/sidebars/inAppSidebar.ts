import { type ReactNode } from "react";
import type { SidebarSection } from "../types";

export const IN_APP_UI_SIDEBAR: SidebarSection[] = [
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
        title: "Security + authentication",
      },
      {
        slug: "/feeds-vs-guides",
        title: "Feeds v. guides",
      },
      {
        title: "Feeds",
        slug: "/feeds",
        pages: [
          { slug: "/overview", title: "Overview" },
          {
            slug: "/styling",
            title: "Styling",
          },
          {
            slug: "/custom-ui",
            title: "Custom UI (headless)",
          },
          {
            slug: "/handling-interactivity",
            title: "Handling interactivity",
          },
          {
            slug: "/filtering-in-app-feeds",
            title: "Filtering feeds",
          },
          {
            slug: "/socket-behavior",
            title: "Socket behavior overrides",
          },
        ],
      },
      {
        title: "Guides",
        slug: "/guides",
        isBeta: true,
        pages: [
          { slug: "/overview", title: "Overview" },
          {
            slug: "/create-guides",
            title: "Creating guides",
          },
          {
            slug: "/render-guides",
            title: "Rendering guides",
          },
        ],
      },
      {
        slug: "/message-types",
        title: "Message types",
        isBeta: true,
      },
    ],
    sidebarMenuDefaultOpen: true,
  },
  // {
  //   title: "Feeds",
  //   slug: "/in-app-ui/feeds",
  //   desc: "Power real-time feeds, inboxes, and notification centers in your product.",
  //   pages: [
  //     { slug: "/overview", title: "Overview" },
  //     {
  //       slug: "/filtering-in-app-feeds",
  //       title: "Filtering feeds",
  //     },
  //   ],
  // },
  // {
  //   title: "Guides",
  //   slug: "/in-app-ui/guides",
  //   desc: "Power announcements, onboarding, and evergreen in-app experiences in your product.",
  //   pages: [
  //     { slug: "/overview", title: "Overview" },
  //     {
  //       slug: "/create-guides",
  //       title: "Creating guides",
  //     },
  //     {
  //       slug: "/render-guides",
  //       title: "Rendering guides",
  //     },
  //   ],
  // },
];

const languages = {
  react: "react",
  javascript: "javascript",
  angular: "angular",
  "react-native": "react-native",
  ios: "ios",
  android: "android",
  flutter: "flutter",
  expo: "expo",
} as const;

export type Language = keyof typeof languages;

export type SdkSpecificContent = {
  items: SidebarSection[];
  title: string;
  value: string;
  icon: ReactNode;
};

export const REACT_SIDEBAR: SidebarSection[] = [
  {
    title: "UI components",
    slug: "/in-app-ui/react",
    desc: "Use the Knock in-app experiences APIs and components to build rich notifications experiences inside of your product.",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/feed", title: "Feed" },
      { slug: "/toasts", title: "Toast" },
      { slug: "/inbox", title: "Inbox" },
      { slug: "/preferences", title: "Preferences" },
      { slug: "/slack-kit", title: "SlackKit" },
      { slug: "/teams-kit", title: "TeamsKit" },
    ],
    sidebarMenuDefaultOpen: true,
  },
  {
    title: "Headless UI",
    slug: "/in-app-ui/react/headless",
    pages: [{ slug: "/feed", title: "Feed" }],
    sidebarMenuDefaultOpen: true,
  },
  {
    title: "SDK",
    slug: "/in-app-ui/react/sdk",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/reference", title: "Reference" },
      {
        slug: "/migrating-from-react-notification-feed",
        title: "Migrating from @knocklabs/react-notification-feed",
      },
    ],
    sidebarMenuDefaultOpen: true,
  },
];

export const JAVASCRIPT_SIDEBAR: SidebarSection[] = [
  {
    title: "UI components",
    slug: "/in-app-ui/javascript",
    pages: [{ slug: "/overview", title: "Overview" }],
    sidebarMenuDefaultOpen: true,
  },
  {
    title: "SDK",
    slug: "/in-app-ui/javascript/sdk",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/quick-start", title: "Quick start" },
      { slug: "/reference", title: "Reference" },
    ],
    sidebarMenuDefaultOpen: true,
  },
];

export const ANGULAR_SIDEBAR: SidebarSection[] = [
  {
    title: "UI components",
    slug: "/in-app-ui/angular",
    pages: [{ slug: "/overview", title: "Overview" }],
    sidebarMenuDefaultOpen: true,
  },
];

export const REACT_NATIVE_SIDEBAR: SidebarSection[] = [
  {
    title: "UI components",
    slug: "/in-app-ui/react-native",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/feed", title: "Feed" },
      { slug: "/components", title: "Components" },
      { slug: "/customization", title: "Customization" },
    ],
    sidebarMenuDefaultOpen: true,
  },
  {
    title: "Headless UI",
    slug: "/in-app-ui/react-native/headless",
    pages: [{ slug: "/feed", title: "Feed" }],
    sidebarMenuDefaultOpen: true,
  },
  {
    title: "SDK",
    slug: "/in-app-ui/react-native/sdk",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/quick-start", title: "Quick start" },
      { slug: "/push-notifications", title: "Push notifications" },
      { slug: "/notification-feeds", title: "Notification feeds" },
      { slug: "/reference", title: "Reference" },
    ],
    sidebarMenuDefaultOpen: true,
  },
];

export const SWIFT_SIDEBAR: SidebarSection[] = [
  {
    title: "UI components",
    slug: "/in-app-ui/ios",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/components", title: "Components" },
      { slug: "/customization", title: "Customization" },
    ],
    sidebarMenuDefaultOpen: true,
  },
  {
    title: "SDK",
    slug: "/in-app-ui/ios/sdk",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/quick-start", title: "Quick start" },
      { slug: "/push-notifications", title: "Push notifications" },
      { slug: "/deep-links", title: "Deep links" },
      { slug: "/reference", title: "Reference" },
    ],
    sidebarMenuDefaultOpen: true,
  },
];

export const ANDROID_SIDEBAR: SidebarSection[] = [
  {
    title: "UI components",
    slug: "/in-app-ui/android",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/components", title: "Components" },
      { slug: "/customization", title: "Customization" },
    ],
    sidebarMenuDefaultOpen: true,
  },
  {
    title: "SDK",
    slug: "/in-app-ui/android/sdk",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/quick-start", title: "Quick start" },
      { slug: "/push-notifications", title: "Push notifications" },
      { slug: "/deep-links", title: "Deep links" },
      { slug: "/reference", title: "Reference" },
    ],
    sidebarMenuDefaultOpen: true,
  },
];

export const FLUTTER_SIDEBAR: SidebarSection[] = [
  {
    title: "UI Components",
    slug: "/in-app-ui/flutter",
    pages: [{ slug: "/overview", title: "Overview" }],
    sidebarMenuDefaultOpen: true,
  },
  {
    title: "SDK",
    slug: "/in-app-ui/flutter/sdk",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/quick-start", title: "Quick start" },
      { slug: "/reference", title: "Reference" },
    ],
    sidebarMenuDefaultOpen: true,
  },
];

export const EXPO_SIDEBAR: SidebarSection[] = [
  {
    title: "SDK",
    slug: "/in-app-ui/expo/sdk",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/push-notifications", title: "Push notifications" },
      { slug: "/reference", title: "Reference" },
    ],
    sidebarMenuDefaultOpen: true,
  },
];
