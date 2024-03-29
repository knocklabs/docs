import dynamic from "next/dynamic";
import { InkeepChatButtonProps } from "@inkeep/widgets";

import useInkeepSettings from "../hooks/useInKeepSettings";

const ChatButton = dynamic(
  () => import("@inkeep/widgets").then((mod) => mod.InkeepChatButton),
  {
    ssr: false,
  },
) as any;

function AiChatButton() {
  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();

  const chatButtonProps: InkeepChatButtonProps = {
    baseSettings,
    aiChatSettings,
    searchSettings,
    modalSettings,
  };

  return <ChatButton {...chatButtonProps} stylesheetUrls={["/inkeep.css"]} />;
}

export default AiChatButton;
