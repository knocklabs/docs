import type {
  InkeepAIChatSettings,
  InkeepBaseSettings,
  InkeepModalSettings,
  InkeepSearchSettings,
} from "@inkeep/cxkit-react";

type InkeepSharedSettings = {
  baseSettings: InkeepBaseSettings;
  aiChatSettings: InkeepAIChatSettings;
  searchSettings: InkeepSearchSettings;
  modalSettings: InkeepModalSettings;
};

const useInkeepSettings = (): InkeepSharedSettings => {
  const baseSettings: InkeepBaseSettings = {
    apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY || "",
    primaryBrandColor: "#262626",
    organizationDisplayName: "Knock",
    colorMode: {
      forcedColorMode: "light",
    },
  };

  const modalSettings: InkeepModalSettings = {};

  const searchSettings: InkeepSearchSettings = {};

  const aiChatSettings: InkeepAIChatSettings = {
    aiAssistantAvatar: {
      light: "https://knock.app/favicon/favicon.svg",
      dark: "https://knock.app/favicon/favicon-dark.svg",
    },
    getHelpOptions: [
      {
        name: "Contact Us",
        action: {
          type: "open_link",
          url: "mailto:hello@knock.app",
        },
        icon: {
          builtIn: "IoChatbubblesOutline",
        },
      },
      {
        name: "Ask on Slack",
        action: {
          type: "open_link",
          url: "https://knock.app/join-slack",
        },
        icon: {
          builtIn: "FaSlack",
        },
      },
    ],
    exampleQuestions: [
      "How do I manage user notification preferences?",
      "How would I schedule two notifications to be 1 hour apart?",
      "How can I monitor the delivery of a notification?",
    ],
  };

  return { baseSettings, aiChatSettings, searchSettings, modalSettings };
};

export default useInkeepSettings;
