import type {
  InkeepAIChatSettings,
  InkeepSearchSettings,
  InkeepWidgetBaseSettings,
  InkeepModalSettings,
} from "@inkeep/widgets";
import { useTheme } from "next-themes";

type InkeepSharedSettings = {
  baseSettings: InkeepWidgetBaseSettings;
  aiChatSettings: InkeepAIChatSettings;
  searchSettings: InkeepSearchSettings;
  modalSettings: InkeepModalSettings;
};

const useInkeepSettings = (): InkeepSharedSettings => {
  const { theme } = useTheme();

  const baseSettings: InkeepWidgetBaseSettings = {
    apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY || "",
    integrationId: process.env.NEXT_PUBLIC_INKEEP_INTEGRATION_ID || "",
    organizationId: process.env.NEXT_PUBLIC_INKEEP_ORGANIZATION_ID || "",
    primaryBrandColor: "#262626",
    organizationDisplayName: "Knock",
    colorMode: {
      forcedColorMode: theme === "light" ? "light" : "dark",
    },
  };

  const modalSettings: InkeepModalSettings = {
    isModeSwitchingEnabled: false,
    defaultView: "AI_CHAT",
  };

  const searchSettings: InkeepSearchSettings = {};

  const aiChatSettings: InkeepAIChatSettings = {
    botAvatarSrcUrl: "https://knock.app/favicon/favicon.svg",
    botAvatarDarkSrcUrl: "https://knock.app/favicon/favicon-dark.svg",
    getHelpCallToActions: [
      {
        name: "Contact Us",
        url: "mailto:hello@knock.app",
        icon: {
          builtIn: "IoChatbubblesOutline",
        },
      },
      {
        name: "Ask on Slack",
        url: "https://knock.app/join-slack",
        icon: {
          builtIn: "FaSlack",
        },
      },
    ],
    quickQuestions: [
      "How do I manage user notification preferences?",
      "How would I schedule two notifications to be 1 hour apart?",
      "How can I monitor the delivery of a notification?",
    ],
  };

  return { baseSettings, aiChatSettings, searchSettings, modalSettings };
};

export default useInkeepSettings;
