import { Box, Stack } from "@telegraph/layout";
import { Text, Code } from "@telegraph/typography";
import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import { X, ArrowUp, Loader2, ChevronDown } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAskAi } from "./AskAiContext";
import { useChatStream, type Message } from "../hooks/useChatStream";
import { Streamdown } from "streamdown";

function AskAiSidebar() {
  const {
    isOpen,
    closeSidebar,
    sidebarWidth,
    setSidebarWidth,
    isResizing,
    setIsResizing,
    initialPrompt,
    clearInitialPrompt,
  } = useAskAi();
  const [headerHeight, setHeaderHeight] = useState(100);
  const [inputValue, setInputValue] = useState("");
  const [isHoveringResizeHandle, setIsHoveringResizeHandle] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const processedInitialPromptRef = useRef<string | null>(null);
  const { messages, isLoading, error, sendMessage, clearMessages } =
    useChatStream();

  useEffect(() => {
    const updateHeaderHeight = () => {
      const header = document.querySelector("[data-header]") as HTMLElement;
      if (header) {
        const rect = header.getBoundingClientRect();
        setHeaderHeight(rect.height);
      }
    };

    updateHeaderHeight();
    window.addEventListener("resize", updateHeaderHeight);
    return () => window.removeEventListener("resize", updateHeaderHeight);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-focus textarea when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Auto-submit initial prompt when sidebar opens with one
  useEffect(() => {
    if (
      isOpen &&
      initialPrompt &&
      !isLoading &&
      processedInitialPromptRef.current !== initialPrompt
    ) {
      // Mark this prompt as processed
      processedInitialPromptRef.current = initialPrompt;

      // Set the input value
      setInputValue(initialPrompt);
      if (textareaRef.current) {
        textareaRef.current.value = initialPrompt;
      }

      // Submit the message
      sendMessage(initialPrompt)
        .then(() => {
          // Clear the input and initial prompt after submission
          setInputValue("");
          if (textareaRef.current) {
            textareaRef.current.value = "";
          }
          clearInitialPrompt();
          processedInitialPromptRef.current = null;
        })
        .catch(() => {
          // Clear the prompt even on error to prevent retry loops
          clearInitialPrompt();
          processedInitialPromptRef.current = null;
        });
    }
  }, [isOpen, initialPrompt, isLoading, sendMessage, clearInitialPrompt]);

  const handleSubmit = async () => {
    // Get value directly from textarea ref as fallback for controlled input
    const textareaValue = textareaRef.current?.value || inputValue;

    if (!textareaValue.trim() || isLoading) {
      return;
    }

    const message = textareaValue.trim();
    setInputValue("");
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Handle resize drag
  useEffect(() => {
    if (!isResizing) return;

    let currentWidth = sidebarWidth;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      // Constrain width between 280px and 800px
      const constrainedWidth = Math.max(280, Math.min(800, newWidth));
      currentWidth = constrainedWidth;
      setSidebarWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Save width to localStorage and update context
      localStorage.setItem("askAiSidebarWidth", currentWidth.toString());
      setSidebarWidth(currentWidth);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, sidebarWidth]);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  // Input area component - conditionally rendered at top or bottom
  const inputArea = (isAtTop: boolean) => {
    const hasInput = inputValue.trim().length > 0;
    const isEmpty = !hasInput && !isLoading;

    return (
      <Box
        borderBottomWidth={isAtTop ? "px" : undefined}
        borderTopWidth={!isAtTop ? "px" : undefined}
        borderColor="gray-4"
        style={{
          minWidth: `${sidebarWidth}px`,
          position: "relative",
          boxShadow: isAtTop
            ? "inset 0px -1px 0px 0px var(--tgph-gray-5)"
            : "inset 0px 1px 0px 0px var(--tgph-gray-5)",
        }}
      >
        {/* Textarea */}
        <Box>
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask questions about the docs"
            rows={1}
            disabled={isLoading}
            style={{
              width: "100%",
              height: "104px",
              minHeight: "104px",
              maxHeight: "104px",
              padding: "8px 12px",
              border: "none",
              fontSize: "13px",
              outline: "none",
              resize: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
              verticalAlign: "top",
              textAlign: "left",
              lineHeight: "20px",
              display: "block",
              backgroundColor: "var(--tgph-surface-1)",
              color: isEmpty ? "var(--tgph-gray-10)" : "var(--tgph-gray-12)",
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? "not-allowed" : "text",
            }}
          />
        </Box>

        {/* PromptInputActions bar */}
        <Box
          style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "8px",
            backgroundColor: "var(--tgph-surface-1)",
          }}
        >
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || isEmpty}
            style={{
              width: "24px",
              height: "24px",
              minWidth: "24px",
              minHeight: "24px",
              padding: "5px",
              borderRadius: "4px",
              backgroundColor: isLoading
                ? "var(--tgph-gray-2)"
                : isEmpty
                ? "var(--tgph-gray-2)"
                : "#e4f7ec",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: isLoading || isEmpty ? "not-allowed" : "pointer",
              margin: "0",
              boxSizing: "border-box",
              transition: "background-color 0.2s",
            }}
          >
            {isLoading ? (
              <Icon
                icon={Loader2}
                size="1"
                aria-hidden
                style={{
                  color: "#cbcfd5",
                  animation: "spin 1s linear infinite",
                }}
              />
            ) : (
              <Icon
                icon={ArrowUp}
                size="1"
                aria-hidden
                style={{
                  color: isEmpty ? "#cbcfd5" : "#009c68",
                }}
              />
            )}
          </button>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      borderLeftWidth={isOpen ? "px" : "0"}
      borderColor={isHoveringResizeHandle ? "gray-6" : "gray-4"}
      style={{
        width: isOpen ? `${sidebarWidth}px` : "0",
        overflow: "hidden",
        transition: isResizing ? "none" : "width 0.2s ease-in-out, border-color 0.2s ease-in-out",
        position: "fixed",
        top: `${headerHeight}px`,
        right: 0,
        zIndex: 10,
        height: `calc(100vh - ${headerHeight}px)`,
      }}
    >
      {/* Resize handle */}
      {isOpen && (
        <Box
          ref={resizeHandleRef}
          onMouseDown={handleResizeStart}
          onMouseEnter={() => setIsHoveringResizeHandle(true)}
          onMouseLeave={() => setIsHoveringResizeHandle(false)}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "4px",
            height: "100%",
            cursor: "col-resize",
            backgroundColor: "transparent",
            zIndex: 11,
          }}
        />
      )}
      <Box
        bg="surface-1"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Header with close button */}
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "8px 12px",
            minWidth: `${sidebarWidth}px`,
            backgroundColor: "var(--tgph-surface-3)",
            position: "relative",
            boxShadow: "inset 0px -1px 0px 0px var(--tgph-gray-5)",
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Text as="span" size="1" weight="medium">
              New assistant
            </Text>
            <Icon
              icon={ChevronDown}
              size="1"
              aria-hidden
              style={{
                color: "var(--tgph-gray-10)",
              }}
            />
          </Box>
          <Box
            style={{
              display: "flex",
              gap: "4px",
              alignItems: "center",
            }}
          >
            <button
              type="button"
              onClick={closeSidebar}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "24px",
                height: "24px",
                padding: "5px",
                borderRadius: "4px",
                border: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
                minWidth: "24px",
              }}
            >
              <Icon
                icon={X}
                size="1"
                aria-hidden
                style={{
                  color: "var(--tgph-gray-10)",
                }}
              />
            </button>
          </Box>
        </Box>

        {/* Input at top when no messages */}
        {messages.length === 0 && inputArea(true)}

        {/* Messages area */}
        <Box
          style={{
            flex: 1,
            overflowY: "auto",
            minWidth: `${sidebarWidth}px`,
            padding: "16px",
          }}
        >
          {error && (
            <Box
              p="3"
              mb="3"
              style={{
                backgroundColor: "var(--tgph-red-2)",
                border: "1px solid",
                borderColor: "var(--tgph-red-4)",
                borderRadius: "6px",
              }}
            >
              <Text as="p" size="1" color="red">
                {error}
              </Text>
            </Box>
          )}

          <Stack direction="column" gap="0">
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLoading={
                  isLoading &&
                  message.role === "assistant" &&
                  index === messages.length - 1
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </Stack>
        </Box>

        {/* Input at bottom when has messages */}
        {messages.length > 0 && inputArea(false)}
      </Box>
    </Box>
  );
}

function MessageBubble({
  message,
  isLoading,
}: {
  message: Message;
  isLoading?: boolean;
}) {
  const isUser = message.role === "user";

  if (isUser) {
    // User message - rounded bubble style
    return (
      <Box
        style={{
          display: "inline-block",
          padding: "12px 16px",
          borderRadius: "8px",
          backgroundColor: "var(--tgph-gray-4)",
          marginBottom: "16px",
        }}
      >
        <Text
          as="span"
          size="2"
          weight="medium"
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {message.content}
        </Text>
      </Box>
    );
  }

  // Assistant message - plain text, no bubble
  // Show "Thinking..." when loading and no content yet
  if (isLoading && !message.content) {
    return (
      <Stack
        direction="row"
        gap="2"
        alignItems="center"
        style={{ marginBottom: "16px" }}
      >
        <Icon
          icon={Loader2}
          size="1"
          aria-hidden
          style={{ animation: "spin 1s linear infinite" }}
        />
        <Text as="span" size="2" color="gray">
          Thinking...
        </Text>
      </Stack>
    );
  }

  // Use tgraph-content class for consistent markdown styling with the rest of the docs
  // Streamdown is optimized for streaming LLM content and handles incomplete markdown gracefully
  return (
    <div className="tgraph-content" style={{ marginBottom: "16px" }}>
      <Streamdown
        components={{
          // Only override what's necessary - CSS handles most styling via tgraph-content class
          code: (props: any) => (
            <Code
              as="code"
              bg="gray-2"
              borderRadius="2"
              px="1"
              size="1"
              data-tgph-code
            >
              {props.children}
            </Code>
          ),
          pre: ({ children }: { children?: React.ReactNode }) => (
            <Box
              as="pre"
              bg="gray-2"
              borderRadius="3"
              p="3"
              mb="3"
              style={{ overflow: "auto", fontSize: "13px", lineHeight: "1.5" }}
            >
              {children}
            </Box>
          ),
          a: ({
            href,
            children,
          }: {
            href?: string;
            children?: React.ReactNode;
          }) => (
            <a
              href={href}
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
        }}
      >
        {message.content}
      </Streamdown>
    </div>
  );
}

export default AskAiSidebar;
