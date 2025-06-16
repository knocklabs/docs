import { InkeepChatButtonProps } from "@inkeep/uikit";
import dynamic from "next/dynamic";

import useInkeepSettings from "../hooks/useInKeepSettings";

const ChatButton = dynamic(
  () => import("@inkeep/uikit").then((mod) => mod.InkeepChatButton),
  {
    ssr: false,
  },
) as any;

function AiChatButton() {
  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();

  const chatButtonProps: InkeepChatButtonProps = {
    baseSettings: {
      ...baseSettings,
      theme: {
        stylesheetUrls: ["/inkeep.css"],
      },
    },
    aiChatSettings,
    searchSettings,
    modalSettings,
  };

  return <ChatButton {...chatButtonProps} />;
}

export default AiChatButton;
