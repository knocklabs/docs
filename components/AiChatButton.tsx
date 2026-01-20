import {
  InkeepModalChatProps,
  type InkeepModalChat,
} from "@inkeep/cxkit-react";
import dynamic from "next/dynamic";
import { useState, createContext, useContext, useCallback, ReactNode } from "react";
import { MessageSquare } from "lucide-react";

import useInkeepSettings from "../hooks/useInKeepSettings";

const ModalChat = dynamic(
  () => import("@inkeep/cxkit-react").then((mod) => mod.InkeepModalChat),
  {
    ssr: false,
  },
) as typeof InkeepModalChat;

type InkeepModalContextType = {
  openWithPrompt: (prompt: string) => void;
};

const InkeepModalContext = createContext<InkeepModalContextType | null>(null);

export function useInkeepModal() {
  const context = useContext(InkeepModalContext);
  if (!context) {
    throw new Error("useInkeepModal must be used within InkeepModalProvider");
  }
  return context;
}

export function InkeepModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialQuery, setInitialQuery] = useState<string | undefined>(undefined);
  const { baseSettings, aiChatSettings: baseAiChatSettings, modalSettings } = useInkeepSettings();

  const openWithPrompt = useCallback((prompt: string) => {
    setInitialQuery(prompt);
    setIsOpen(true);
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setIsOpen(open);
    // Clear initial query when modal closes
    if (!open) {
      setInitialQuery(undefined);
    }
  }, []);

  // Merge initialQuery into aiChatSettings if provided
  const aiChatSettings = {
    ...baseAiChatSettings,
    ...(initialQuery ? { initialQuery } : {}),
  };

  const modalChatProps: InkeepModalChatProps = {
    baseSettings,
    aiChatSettings,
    modalSettings: {
      ...modalSettings,
      isOpen,
      onOpenChange: handleOpenChange,
    },
  };

  return (
    <InkeepModalContext.Provider value={{ openWithPrompt }}>
      {children}
      <div className="md-visible">
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-4 bottom-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-lg"
          aria-label="Open chat"
        >
          <MessageSquare className="h-5 w-5 text-black" />
        </button>
      </div>
      <ModalChat {...modalChatProps} />
    </InkeepModalContext.Provider>
  );
}

function AiChatButton() {
  return null;
}

export default AiChatButton;
