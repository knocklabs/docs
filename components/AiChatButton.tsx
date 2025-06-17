import {
  InkeepChatButtonProps,
  type InkeepChatButton,
} from "@inkeep/cxkit-react";
import dynamic from "next/dynamic";

import useInkeepSettings from "../hooks/useInKeepSettings";

const ChatButton = dynamic(
  () => import("@inkeep/cxkit-react").then((mod) => mod.InkeepChatButton),
  {
    ssr: false,
  },
) as typeof InkeepChatButton;

function AiChatButton() {
  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();

  const chatButtonProps: InkeepChatButtonProps = {
    baseSettings: {
      ...baseSettings,
      theme: {
        styles: [
          {
            key: "knock-ai-chat-style",
            type: "style",
            value: `
              .ikp-chat-button__button {
                background-color: #262626;
              }
          `,
          },
        ],
      },
    },
    aiChatSettings,
    searchSettings,
    modalSettings,
    canToggleView: false,
  };

  return <ChatButton {...chatButtonProps} />;
}

export default AiChatButton;
