import React, { createContext, useContext, useState, useRef } from "react";
import { AIChatFunctions } from "@inkeep/cxkit-react";

interface InkeepSidebarContextType {
  isAiChatOpen: boolean;
  aiSearchTerm: string;
  chatFunctionsRef: React.MutableRefObject<AIChatFunctions | null>;
  handleOpenAiChat: (searchTerm?: string) => void;
  handleCloseAiChat: () => void;
}

const InkeepSidebarContext = createContext<
  InkeepSidebarContextType | undefined
>(undefined);

export const useInkeepSidebar = () => {
  const context = useContext(InkeepSidebarContext);
  if (!context) {
    throw new Error(
      "useInkeepSidebar must be used within InkeepSidebarProvider",
    );
  }
  return context;
};

export const InkeepSidebarProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [aiSearchTerm, setAiSearchTerm] = useState("");
  const chatFunctionsRef = useRef<AIChatFunctions | null>(null);

  const handleOpenAiChat = (searchTerm = "") => {
    setAiSearchTerm(searchTerm);
    setIsAiChatOpen(true);
    if (chatFunctionsRef.current && searchTerm) {
      chatFunctionsRef.current.updateInputMessage(searchTerm);
    }
  };

  const handleCloseAiChat = () => {
    setIsAiChatOpen(false);
    setAiSearchTerm("");
  };

  return (
    <InkeepSidebarContext.Provider
      value={{
        isAiChatOpen,
        aiSearchTerm,
        chatFunctionsRef,
        handleOpenAiChat,
        handleCloseAiChat,
      }}
    >
      {children}
    </InkeepSidebarContext.Provider>
  );
};
