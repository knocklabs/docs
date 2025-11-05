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
          {
            slug: "/order-guides",
            title: "Ordering and throttling",
          },
          {
            slug: "/handling-engagement",
            title: "Engagement tracking",
          },
          {
            slug: "/debugging-guides",
            title: "Testing and debugging",
          },
          {
            slug: "/analytics-and-observability",
            title: "Analytics and observability",
          },
        ],
      },
      {
        slug: "/message-types",
        title: "Message types",
        pages: [
          { slug: "/overview", title: "Overview" },
          {
            slug: "/create-message-types",
            title: "Creating message types",
          },
          {
            slug: "/schema-reference",
            title: "Schema reference",
          },
        ],
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
  expo: "expo",
} as const;

export type Language = keyof typeof languages;

export type SdkSpecificContent = {
  items: SidebarSection[];
  title: string;
  value: string;
  icon: ReactNode;
};

const SHARED_REACT_COMPONENTS = [
  { slug: "/knock-provider", title: "KnockProvider" },
  { slug: "/knock-feed-provider", title: "KnockFeedProvider" },
  { slug: "/knock-guide-provider", title: "KnockGuideProvider" },
  { slug: "/knock-guide-location-sensor", title: "KnockGuideLocationSensor" },
  { slug: "/knock-slack-provider", title: "KnockSlackProvider" },
  { slug: "/knock-ms-teams-provider", title: "KnockMsTeamsProvider" },
  { slug: "/knock-i18n-provider", title: "KnockI18nProvider" },
];

const ADDITIONAL_REACT_COMPONENTS = [
  { slug: "/button", title: "Button" },
  { slug: "/button-group", title: "ButtonGroup" },
  { slug: "/notification-feed", title: "NotificationFeed" },
  { slug: "/notification-feed-popover", title: "NotificationFeedPopover" },
  { slug: "/notification-cell", title: "NotificationCell" },
  { slug: "/notification-icon-button", title: "NotificationIconButton" },
  { slug: "/slack-auth-button", title: "SlackAuthButton" },
  { slug: "/slack-auth-container", title: "SlackAuthContainer" },
  { slug: "/slack-channel-combobox", title: "SlackChannelCombobox" },
  { slug: "/ms-teams-auth-button", title: "MsTeamsAuthButton" },
  { slug: "/ms-teams-auth-container", title: "MsTeamsAuthContainer" },
  { slug: "/ms-teams-channel-combobox", title: "MsTeamsChannelCombobox" },
];

const ALL_REACT_COMPONENTS = [
  ...SHARED_REACT_COMPONENTS,
  ...ADDITIONAL_REACT_COMPONENTS,
];

const SHARED_REACT_HOOKS = [
  // Core hooks
  {
    slug: "/use-authenticated-knock-client",
    title: "useAuthenticatedKnockClient",
  },
  { slug: "/use-translations", title: "useTranslations" },
  // Feed hooks
  { slug: "/use-notifications", title: "useNotifications" },
  { slug: "/use-notification-store", title: "useNotificationStore" },
  // Guides hooks
  { slug: "/use-guide", title: "useGuide" },
  { slug: "/use-guides", title: "useGuides" },
  { slug: "/use-guide-context", title: "useGuideContext" },
  // Preferences hooks
  { slug: "/use-preferences", title: "usePreferences" },
  // Slack hooks
  { slug: "/use-slack-auth", title: "useSlackAuth" },
  { slug: "/use-slack-channels", title: "useSlackChannels" },
  {
    slug: "/use-connected-slack-channels",
    title: "useConnectedSlackChannels",
  },
  {
    slug: "/use-slack-connection-status",
    title: "useSlackConnectionStatus",
  },
  // Microsoft Teams hooks
  {
    slug: "/use-ms-teams-auth",
    title: "useMsTeamsAuth",
  },
  {
    slug: "/use-ms-teams-teams",
    title: "useMsTeamsTeams",
  },
  {
    slug: "/use-ms-teams-channels",
    title: "useMsTeamsChannels",
  },
  {
    slug: "/use-connected-ms-teams-channels",
    title: "useConnectedMsTeamsChannels",
  },
  {
    slug: "/use-ms-teams-connection-status",
    title: "useMsTeamsConnectionStatus",
  },
];

const SHARED_REACT_TYPES = [
  { slug: "/knock-options", title: "KnockOptions" },
  { slug: "/user-identification-options", title: "UserIdentificationOptions" },
  { slug: "/i18n-content", title: "I18nContent" },
  { slug: "/connection-status", title: "ConnectionStatus" },
  { slug: "/recipient-object", title: "RecipientObject" },
  { slug: "/slack-channel", title: "SlackChannel" },
  { slug: "/slack-channel-connection", title: "SlackChannelConnection" },
  { slug: "/slack-channel-query-options", title: "SlackChannelQueryOptions" },
  { slug: "/ms-teams-team", title: "MsTeamsTeam" },
  { slug: "/ms-teams-team-query-options", title: "MsTeamsTeamQueryOptions" },
  { slug: "/ms-teams-channel", title: "MsTeamsChannel" },
  { slug: "/ms-teams-channel-connection", title: "MsTeamsChannelConnection" },
  {
    slug: "/ms-teams-channel-query-options",
    title: "MsTeamsChannelQueryOptions",
  },
];

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
      { slug: "/card", title: "Card" },
      { slug: "/banner", title: "Banner" },
      { slug: "/modal", title: "Modal" },
      { slug: "/preferences", title: "Preferences" },
      { slug: "/slack-kit", title: "SlackKit" },
      { slug: "/teams-kit", title: "TeamsKit" },
    ],
    sidebarMenuDefaultOpen: true,
  },
  {
    title: "Headless UI",
    slug: "/in-app-ui/react/headless",
    pages: [
      { slug: "/feed", title: "Feed" },
      { slug: "/guide", title: "Guide" },
      { slug: "/preferences", title: "Preferences" },
    ],
    sidebarMenuDefaultOpen: true,
  },
  {
    title: "SDK",
    slug: "/in-app-ui/react/sdk",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/reference", title: "Reference" },
      // Built-in components
      {
        slug: "/components",
        title: "Components",
        pages: ALL_REACT_COMPONENTS,
      },
      // Hooks
      {
        title: "Hooks",
        slug: "/hooks",
        pages: SHARED_REACT_HOOKS,
      },
      // Types
      {
        title: "Types",
        slug: "/types",
        pages: SHARED_REACT_TYPES,
      },
      // Guides
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
      // SDK references
      { slug: "/knock", title: "Knock" },
      { slug: "/api-client", title: "ApiClient" },
      { slug: "/feed-client", title: "FeedClient" },
      { slug: "/guide-client", title: "GuideClient" },
      { slug: "/message-client", title: "MessageClient" },
      { slug: "/user-client", title: "UserClient" },
      { slug: "/object-client", title: "ObjectClient" },
      { slug: "/slack-client", title: "SlackClient" },
      { slug: "/ms-teams-client", title: "MsTeamsClient" },
      // Type definitions
      {
        slug: "/types",
        title: "Types",
        pages: [
          {
            slug: "/knock-options",
            title: "KnockOptions",
          },
          {
            slug: "/authenticate-options",
            title: "AuthenticateOptions",
          },
          {
            slug: "/feed-store-state",
            title: "FeedStoreState",
          },
        ],
      },
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
