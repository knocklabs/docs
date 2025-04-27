import { SidebarSection } from "./types";
import { ReactIcon } from "@/components/ui/Icons/React";
import { JavascriptIcon } from "@/components/ui/Icons/Javascript";
import { AngularIcon } from "@/components/ui/Icons/Angular";
import { AppleIcon } from "@/components/ui/Icons/Apple";
import { AndroidIcon } from "@/components/ui/Icons/Android";
import { FlutterIcon } from "@/components/ui/Icons/Flutter";

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
  Icon: () => JSX.Element;
};

const sdkSpecificContent: Record<Language, SdkSpecificContent> = {
  react: {
    title: "React",
    value: "react",
    Icon: ReactIcon,
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
        ],
      },
    ],
  },
  javascript: {
    title: "JavaScript",
    value: "javascript",
    Icon: JavascriptIcon,
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
    Icon: AngularIcon,
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
    Icon: ReactIcon,
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
    Icon: AppleIcon,
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
    Icon: AndroidIcon,
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
    Icon: FlutterIcon,
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
