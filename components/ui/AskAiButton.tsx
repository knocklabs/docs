import {
  AIChatFunctions,
  type InkeepModalSearchAndChat,
} from "@inkeep/cxkit-react";
import dynamic from "next/dynamic";
import { useCallback, useRef, useState } from "react";
import { Button } from "@telegraph/button";
import { Stack } from "@telegraph/layout";
import { Icon } from "@telegraph/icon";
import { Sparkles } from "lucide-react";
import useInkeepSettings from "../../hooks/useInKeepSettings";

const InKeepTrigger = dynamic(
  () =>
    import("@inkeep/cxkit-react").then((mod) => mod.InkeepModalSearchAndChat),
  {
    ssr: false,
  },
) as typeof InkeepModalSearchAndChat;

function AskAiButton() {
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const chatFunctionsRef = useRef<AIChatFunctions | null>(null);

  const { baseSettings, aiChatSettings, searchSettings, modalSettings } =
    useInkeepSettings();

  const handleOpenAiChat = useCallback(() => {
    setIsAiChatOpen(true);
  }, []);

  const handleCloseAiChat = useCallback(() => {
    setIsAiChatOpen(false);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="2"
        borderRadius="2"
        onClick={handleOpenAiChat}
      >
        <Stack direction="row" alignItems="center" gap="2">
          <Icon icon={Sparkles} alt="Sparkles" size="1" />
          <span>Ask AI</span>
        </Stack>
      </Button>
      <InKeepTrigger
        defaultView="chat"
        baseSettings={{
          ...baseSettings,
          theme: {
            styles: [
              {
                key: "knock-ask-ai-button-style",
                type: "style",
                value: `
                  .ikp-ai-chat-header {
                    display: none;
                  }
                `,
              },
            ],
          },
        }}
        aiChatSettings={{
          ...aiChatSettings,
          chatFunctionsRef,
          placeholder: "Ask a question...",
        }}
        modalSettings={{
          ...modalSettings,
          isOpen: isAiChatOpen,
          onOpenChange: (open) => {
            if (!open) {
              handleCloseAiChat();
            }
          },
        }}
        searchSettings={searchSettings}
      />
    </>
  );
}

export default AskAiButton;
