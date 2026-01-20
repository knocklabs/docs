import {
  InkeepModalChatProps,
  type InkeepModalChat,
} from "@inkeep/cxkit-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { MessageSquare } from "lucide-react";

import useInkeepSettings from "../hooks/useInKeepSettings";

const ModalChat = dynamic(
  () => import("@inkeep/cxkit-react").then((mod) => mod.InkeepModalChat),
  {
    ssr: false,
  },
) as typeof InkeepModalChat;

function AiChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { baseSettings, aiChatSettings, modalSettings } = useInkeepSettings();

  const modalChatProps: InkeepModalChatProps = {
    baseSettings,
    aiChatSettings,
    modalSettings: {
      ...modalSettings,
      isOpen,
      onOpenChange: setIsOpen,
    },
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg"
        aria-label="Open chat"
      >
        <MessageSquare className="h-5 w-5 text-black" />
      </button>
      <ModalChat {...modalChatProps} />
    </>
  );
}

export default AiChatButton;
