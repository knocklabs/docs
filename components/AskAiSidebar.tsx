import { Box, Stack } from "@telegraph/layout";
import { Text } from "@telegraph/typography";
import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAskAi } from "./AskAiContext";

function AskAiSidebar() {
  const { isOpen, closeSidebar } = useAskAi();
  const [headerHeight, setHeaderHeight] = useState(100);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector('[data-header]') as HTMLElement;
      if (header) {
        const rect = header.getBoundingClientRect();
        setHeaderHeight(rect.height);
      }
    };

    updateHeaderHeight();
    window.addEventListener('resize', updateHeaderHeight);
    return () => window.removeEventListener('resize', updateHeaderHeight);
  }, []);

  return (
    <Box
      borderLeftWidth={isOpen ? "px" : "0"}
      borderColor="gray-4"
      style={{
        width: isOpen ? "340px" : "0",
        overflow: "hidden",
        transition: "width 0.2s ease-in-out",
        position: "fixed",
        top: `${headerHeight}px`,
        right: 0,
        zIndex: 10,
        height: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      <Box
        bg="surface-1"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header with close button */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          p="4"
          borderBottomWidth="px"
          borderColor="gray-4"
          style={{
            minWidth: "340px",
          }}
        >
          <Text as="span" size="2" weight="medium">
            Assistant
          </Text>
          <Button
            variant="ghost"
            size="1"
            onClick={closeSidebar}
            style={{ padding: "4px" }}
          >
            <Icon icon={X} size="1" aria-hidden />
          </Button>
        </Stack>

        {/* Input area */}
        <Box
          p="4"
          borderBottomWidth="px"
          borderColor="gray-4"
          style={{
            minWidth: "340px",
          }}
        >
          <Box
            as="input"
            type="text"
            placeholder="Ask questions about the docs"
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid",
              borderColor: "var(--tgph-gray-4)",
              borderRadius: "6px",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </Box>

        {/* Content area - placeholder for future chat */}
        <Box
          style={{
            flex: 1,
            padding: "16px",
            overflowY: "auto",
            minWidth: "340px",
          }}
        >
          {/* Future: chat messages will go here */}
        </Box>
      </Box>
    </Box>
  );
}

export default AskAiSidebar;
