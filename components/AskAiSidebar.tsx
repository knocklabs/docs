import { Box, Stack } from "@telegraph/layout";
import { Text, Code } from "@telegraph/typography";
import { Button } from "@telegraph/button";
import { Icon, LucideIcon } from "@telegraph/icon";
import { TextArea } from "@telegraph/textarea";
import {
  X,
  ArrowUp,
  Loader2,
  ChevronsUpDown,
  Check,
  Plus,
  Copy,
  Dot,
  ArrowUpRight,
} from "lucide-react";
import { Popover } from "@telegraph/popover";
import { Tooltip } from "@telegraph/tooltip";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { useAskAi } from "./AskAiContext";
import {
  useChatStream,
  type Message,
  type Source,
} from "../hooks/useChatStream";
import { Streamdown } from "streamdown";
import React from "react";
import { Icons } from "./ui/Icons";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { lightCodeTheme } from "../styles/codeThemes";
import { useClipboard } from "@/hooks/useClipboard";

// Extract text content from React children (handles strings, elements, and arrays)
function extractTextContent(children: React.ReactNode): string {
  if (typeof children === "string") {
    return children;
  }
  if (React.isValidElement(children)) {
    const innerChildren = (children.props as { children?: React.ReactNode })
      .children;
    if (typeof innerChildren === "string") {
      return innerChildren;
    }
    if (Array.isArray(innerChildren)) {
      return innerChildren
        .filter((c): c is string => typeof c === "string")
        .join("");
    }
  }
  return "";
}

// Simplified code block component optimized for streaming
// Unlike the main CodeBlock, this doesn't use useIsMounted to avoid flash during streaming
function StreamingCodeBlock({
  children,
  language,
}: {
  children?: React.ReactNode;
  language?: string;
}) {
  const normalizedContent = extractTextContent(children).replace(/\n+$/, "");

  const [isCopied, setCopied] = useClipboard(normalizedContent, {
    successDuration: 2000,
  });

  return (
    <Box
      border="px"
      borderColor="gray-4"
      borderRadius="4"
      style={{ overflow: "hidden", width: "100%", marginBottom: "16px" }}
      data-code-block
    >
      <Stack
        direction="row"
        bg="gray-2"
        borderBottomWidth="px"
        borderColor="gray-2"
        p="2"
        alignItems="center"
        justifyContent="flex-end"
      >
        <Button
          variant="ghost"
          size="0"
          onClick={setCopied}
          px="1"
          icon={{
            icon: isCopied ? Check : Copy,
            "aria-hidden": true,
          }}
        />
      </Stack>
      <SyntaxHighlighter
        showLineNumbers
        lineNumberStyle={{
          color: "var(--tgph-gray-8)",
          display: "inline-block",
          minWidth: "2.25em",
          paddingRight: "1em",
          textAlign: "right",
          userSelect: "none",
          paddingLeft: "0px",
        }}
        language={language || "shell"}
        style={lightCodeTheme}
      >
        {normalizedContent}
      </SyntaxHighlighter>
    </Box>
  );
}

// Helper function to process content and remove inline source references
// Sources are displayed in a separate section at the bottom of responses
function processSourceReferences(content: string): string {
  if (typeof content !== "string") return "";

  let processed = content;

  // Convert single newlines to double newlines for better paragraph spacing,
  // but preserve markdown list structures (lines starting with -, *, or digits followed by .)
  processed = processed.replace(/\n(?!\n)/g, (_match, offset) => {
    const beforeNewline = content.substring(0, offset);
    const afterNewline = content.substring(offset + 1);

    const currentLineMatch = beforeNewline.match(/[^\n]*$/);
    const currentLine = currentLineMatch ? currentLineMatch[0] : "";

    const nextLineMatch = afterNewline.match(/^[^\n]*/);
    const nextLine = nextLineMatch ? nextLineMatch[0] : "";

    const isListItem =
      /^\s*[-*]|\d+\./.test(currentLine.trim()) ||
      /^\s*[-*]|\d+\./.test(nextLine.trim());

    return isListItem ? "\n" : "\n\n";
  });

  // Remove reference links that immediately follow regular markdown links (they're redundant)
  processed = processed.replace(
    /(\[([^\]]+)\]\(([^)]+)\))(?:\s*)(?:\[?\(?\d+\)?\]?\([^)]+\)|\(\d+\))/g,
    "$1",
  );

  // Remove numeric references that follow code blocks (they're listed in Sources section)
  processed = processed.replace(
    /(```[a-z]*\s*)\[(\(?\d+\)?)\]\(([^)]+)\)/gi,
    "$1",
  );

  // Remove inline footnote references like [(1)](url) - sources shown in separate section
  processed = processed.replace(/\[(\(?\d+\)?)\]\([^)]+\)/g, "");

  // Remove incomplete markdown link syntax during streaming to prevent "[blocked]"
  // These handle progressively incomplete states: [(1)](url..., [(1)], [(1), [1), [1
  processed = processed
    .replace(/\[(\(?\d+\)?)\]\([^)]*$/g, "")
    .replace(/\[(\(?\d+\)?)\]$/g, "")
    .replace(/\[(\(?\d+\)?)$/g, "");

  // Remove any remaining standalone (1), (2), etc. that aren't part of links
  processed = processed.replace(/(?<!\[)\((\d+)\)(?!\])/g, "");

  return processed;
}

// Component that conditionally shows tooltip only when text is truncated
function TruncatedTextWithTooltip({
  text,
  children,
}: {
  text: string;
  children: React.ReactElement;
}): React.ReactElement {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const checkTruncation = useCallback(() => {
    const element = wrapperRef.current;
    if (element) {
      setIsTruncated(element.scrollWidth > element.clientWidth);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(checkTruncation, 0);
    window.addEventListener("resize", checkTruncation);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", checkTruncation);
    };
  }, [checkTruncation, text]);

  const content = (
    <div
      ref={wrapperRef}
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        flex: 1,
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );

  if (isTruncated) {
    return <Tooltip label={text}>{content}</Tooltip>;
  }

  return content;
}

// Shared styles for chat option buttons in the popover
const chatOptionButtonStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  width: "100%",
  padding: "6px 8px",
  borderRadius: "4px",
  border: "none",
  cursor: "pointer",
  textAlign: "left",
};

type ChatOptionButtonProps = {
  onClick: () => void;
  isSelected?: boolean;
  icon?: LucideIcon;
  title: string;
  showTruncatedTooltip?: boolean;
  style?: React.CSSProperties;
};

function ChatOptionButton({
  onClick,
  isSelected = false,
  icon: IconComponent,
  title,
  showTruncatedTooltip = false,
  style,
}: ChatOptionButtonProps): React.ReactElement {
  const titleContent = (
    <Text as="span" size="1" weight="medium">
      {title}
    </Text>
  );
  return (
    <Button
      variant="ghost"
      size="2"
      fontSize="13px"
      fontWeight="medium"
      w="full"
      justifyContent="flex-start"
      onClick={onClick}
      icon={
        IconComponent
          ? {
              icon: IconComponent,
              size: "1",
              "aria-hidden": true,
            }
          : undefined
      }
    >
      {showTruncatedTooltip ? (
        <TruncatedTextWithTooltip text={title}>
          {titleContent}
        </TruncatedTextWithTooltip>
      ) : (
        titleContent
      )}
    </Button>
  );
}

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
    chatSessions,
    currentChatId,
    createNewSession,
    selectSession,
  } = useAskAi();
  const [headerHeight, setHeaderHeight] = useState(100);
  const [inputValue, setInputValue] = useState("");
  const [isHoveringResizeHandle, setIsHoveringResizeHandle] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHoveringChatButton, setIsHoveringChatButton] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const processedInitialPromptRef = useRef<string | null>(null);
  const {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
    stopStream,
  } = useChatStream();

  const router = useRouter();

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

    // Also update header height after route changes complete
    // This fixes positioning issues when navigating between sections
    router.events.on("routeChangeComplete", updateHeaderHeight);

    return () => {
      window.removeEventListener("resize", updateHeaderHeight);
      router.events.off("routeChangeComplete", updateHeaderHeight);
    };
  }, [router.events]);

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

  // Get the title of the selected chat
  const getSelectedChatTitle = () => {
    if (!currentChatId) return "New chat";
    const chat = chatSessions.find((c) => c.id === currentChatId);
    return chat?.title || "New chat";
  };

  // Get other chat sessions (excluding current)
  const otherChatSessions = chatSessions.filter(
    (session) => session.id !== currentChatId,
  );

  // Handle starting a new chat
  const handleNewChat = () => {
    createNewSession();
    setIsDropdownOpen(false);
  };

  // Handle selecting a previous chat
  const handleSelectChat = (chatId: string) => {
    selectSession(chatId);
    setIsDropdownOpen(false);
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
    // Button is enabled when loading/streaming (to stop) or when there's input (to submit)
    const isActive = isLoading || isStreaming;
    const isButtonEnabled = isActive || hasInput;

    return (
      <Box w="full">
        <Box
          border="px"
          borderColor="gray-6"
          m="2"
          mt="2"
          rounded="5"
          boxShadow="1"
          bg="surface-1"
          position="relative"
          style={{
            overflow: "hidden",
            minWidth: `${sidebarWidth - 16}px`,
          }}
        >
          {/* Textarea */}
          <Box p="0">
            <TextArea
              as="textarea"
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask questions about the docs"
              rows={1}
              disabled={isActive}
              variant="ghost"
              w="full"
              size="2"
              p="3"
              pb="0"
              maxH="400px"
              bg="surface-1"
              style={{
                fontSize: "13px",
                minHeight: "120px",
                maxHeight: "400px",
                outline: "none",
                resize: "none",
                opacity: isActive ? 0.6 : 1,
                cursor: isActive ? "not-allowed" : "text",
              }}
            />
          </Box>

          {/* PromptInputActions bar */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            px="2"
            pt="0"
            pb="2"
            gap="2"
          >
            {/* Send button */}
            <Button
              onClick={isActive ? stopStream : handleSubmit}
              disabled={!isButtonEnabled}
              size="1"
              w="7"
              h="7"
              variant="solid"
              rounded="4"
              aria-label={isActive ? "Stop" : "Send"}
              style={{
                backgroundColor: isButtonEnabled
                  ? "var(--tgph-gray-12)"
                  : "var(--tgph-gray-4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor: isButtonEnabled ? "pointer" : "not-allowed",
                margin: "0",
                boxSizing: "border-box",
                transition: "background-color 0.2s",
              }}
            >
              {isActive ? (
                <div
                  aria-hidden
                  style={{
                    width: "12px",
                    height: "12px",
                    backgroundColor: "#fff",
                    borderRadius: "2px",
                  }}
                />
              ) : (
                <ArrowUp
                  size="14px"
                  strokeWidth={2}
                  color={isButtonEnabled ? "#fff" : "var(--tgph-gray-10)"}
                />
              )}
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  };

  return (
    <Box
      borderLeftWidth={isOpen ? "px" : "0"}
      borderColor={isHoveringResizeHandle ? "gray-7" : "gray-4"}
      style={{
        width: isOpen ? `${sidebarWidth}px` : "0",
        overflow: "visible",
        transition: isResizing
          ? "none"
          : "width 0.2s ease-in-out, border-color 0.2s ease-in-out",
        position: "fixed",
        top: `${headerHeight}px`,
        right: 0,
        zIndex: 50,
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
            left: "-8px",
            top: 0,
            width: "16px",
            height: "100%",
            cursor: "col-resize",
            backgroundColor: "transparent",
            zIndex: 100,
            pointerEvents: "auto",
          }}
        />
      )}
      <Box
        bg="surface-1"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* Header with close button */}
        <Box
          p="2"
          pr="4"
          borderBottom="px"
          borderColor="gray-4"
          bg="surface-1"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            minWidth: `${sidebarWidth}px`,
            position: "relative",
          }}
        >
          {chatSessions.length === 0 ? (
            <Text as="span" size="1" weight="medium" ml="2">
              New chat
            </Text>
          ) : (
            <Popover.Root
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <Popover.Trigger asChild>
                <Button
                  variant="ghost"
                  color="default"
                  size="1"
                  trailingIcon={{
                    icon: ChevronsUpDown,
                    "aria-hidden": true,
                  }}
                >
                  {getSelectedChatTitle()}
                </Button>
              </Popover.Trigger>
              <Popover.Content
                sideOffset={4}
                align="start"
                p="1"
                gap="0"
                style={{ zIndex: 100, minWidth: "176px", maxWidth: "320px" }}
              >
                {/* Currently selected chat at top */}
                {currentChatId && (
                  <ChatOptionButton
                    onClick={() => handleSelectChat(currentChatId)}
                    isSelected
                    icon={Check}
                    title={getSelectedChatTitle()}
                    showTruncatedTooltip
                  />
                )}

                {/* New chat button - shows below selected chat when a previous chat is selected */}
                {currentChatId && (
                  <ChatOptionButton
                    onClick={handleNewChat}
                    icon={Plus}
                    title="New chat"
                  />
                )}

                {/* New chat option - shows at top when no chat is selected */}
                {!currentChatId && (
                  <ChatOptionButton
                    onClick={handleNewChat}
                    isSelected
                    icon={Check}
                    title="New chat"
                  />
                )}

                {/* Previous chats section - only show if there are other sessions */}
                {otherChatSessions.length > 0 && (
                  <Box
                    style={{
                      marginTop: currentChatId ? "4px" : "0",
                    }}
                  >
                    <Text
                      as="span"
                      size="1"
                      weight="medium"
                      color="gray"
                      px="2"
                      py="2"
                      w="full"
                    >
                      Previous chats
                    </Text>
                    {otherChatSessions.map((chat) => (
                      <ChatOptionButton
                        key={chat.id}
                        onClick={() => handleSelectChat(chat.id)}
                        icon={Dot}
                        title={chat.title}
                        showTruncatedTooltip
                      />
                    ))}
                  </Box>
                )}
              </Popover.Content>
            </Popover.Root>
          )}
          <Button
            variant="ghost"
            size="1"
            iconOnly
            icon={{
              icon: X,
              "aria-hidden": true,
            }}
            onClick={closeSidebar}
          />
        </Box>

        {/* Input at top when no messages */}
        {messages.length === 0 && inputArea(true)}

        {/* Messages area */}
        <Box
          style={{
            flex: 1,
            overflowY: "auto",
            minWidth: `${sidebarWidth}px`,
            padding: "8px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {error && (
            <Box
              p="3"
              mb="3"
              bg="red-2"
              border="px"
              borderColor="red-4"
              rounded="3"
            >
              <Text as="p" size="1" color="red">
                {error}
              </Text>
            </Box>
          )}

          <Stack direction="column" gap="0">
            {messages.map((message, index) => {
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const isConsecutiveUserMessage =
                message.role === "user" && prevMessage?.role === "user";
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isLoading={
                    isLoading &&
                    message.role === "assistant" &&
                    index === messages.length - 1
                  }
                  isConsecutiveUserMessage={isConsecutiveUserMessage}
                />
              );
            })}
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
  isConsecutiveUserMessage,
}: {
  message: Message;
  isLoading?: boolean;
  isConsecutiveUserMessage?: boolean;
}) {
  const isUser = message.role === "user";

  if (isUser) {
    // User message - full-width container with border
    return (
      <Box
        w="full"
        px="3"
        py="2"
        rounded="4"
        bg="surface-1"
        border="px"
        position="relative"
        style={{
          marginTop: isConsecutiveUserMessage ? "8px" : undefined,
        }}
      >
        <Text
          as="span"
          size="2"
          weight="regular"
          style={{
            fontSize: "13px",
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
      <Box
        style={{
          padding: "6px 8px",
        }}
      >
        <Stack direction="row" gap="2" alignItems="center">
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
      </Box>
    );
  }

  // Guard against non-string content during SSR/hydration transition
  if (typeof message.content !== "string") {
    return null;
  }

  // Assistant response wrapped in AgentResponse container
  // Use tgraph-content class for consistent markdown styling with the rest of the docs
  // Streamdown is optimized for streaming LLM content and handles incomplete markdown gracefully
  return (
    <Stack
      bg="surface-1"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Response text section */}
      <Stack direction="column" gap="2" bg="surface-1" px="3">
        <div className="tgraph-content">
          <Streamdown
            parseIncompleteMarkdown={true}
            components={{
              // Only override what's necessary - CSS handles most styling via tgraph-content class
              code: (props: any) => (
                <Code
                  as="code"
                  color="blue"
                  border="px"
                  borderColor="blue-4"
                  rounded="2"
                  data-tgph-code
                  style={{
                    fontSize: "11px",
                    padding: "2px 3px",
                    margin: "0 2px",
                  }}
                >
                  {props.children}
                </Code>
              ),
              pre: ({ children }: { children?: React.ReactNode }) => {
                // Extract language from code element className (e.g., "language-javascript")
                const codeElement = React.Children.toArray(children).find(
                  (child) =>
                    React.isValidElement(child) && child.type === "code",
                );

                let language: string | undefined;
                if (React.isValidElement(codeElement)) {
                  const props = codeElement.props as { className?: string };
                  if (props.className) {
                    const match = /language-(\w+)/.exec(props.className);
                    language = match ? match[1] : undefined;
                  }
                }

                return (
                  <StreamingCodeBlock language={language}>
                    {children}
                  </StreamingCodeBlock>
                );
              },
              a: ({
                href,
                children,
              }: {
                href?: string;
                children?: React.ReactNode;
              }) => {
                // Check if children contain a sup element
                const hasSup = React.Children.toArray(children).some(
                  (child: any) =>
                    React.isValidElement(child) &&
                    (child.type === "sup" ||
                      (typeof child.type === "string" && child.type === "sup")),
                );

                return (
                  <a
                    href={href}
                    target={href?.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href?.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    style={hasSup ? { textDecoration: "none" } : undefined}
                  >
                    {children}
                  </a>
                );
              },
              sup: ({ children }: { children?: React.ReactNode }) => (
                <sup
                  style={{
                    fontSize: "0.6rem",
                    textDecoration: "none",
                    borderBottom: "none",
                  }}
                >
                  {children}
                </sup>
              ),
              p: ({ children }: { children?: React.ReactNode }) => (
                <p
                  style={{
                    margin: "12px 0",
                    fontSize: "13px",
                    lineHeight: "1.625",
                  }}
                >
                  {children}
                </p>
              ),
              ul: ({ children }: { children?: React.ReactNode }) => (
                <ul
                  style={{
                    paddingLeft: "24px",
                    fontSize: "13px",
                    lineHeight: "1.625",
                  }}
                >
                  {children}
                </ul>
              ),
              ol: ({ children }: { children?: React.ReactNode }) => (
                <ol
                  style={{
                    paddingLeft: "24px",
                    fontSize: "13px",
                    lineHeight: "1.625",
                  }}
                >
                  {children}
                </ol>
              ),
              li: ({ children }: { children?: React.ReactNode }) => (
                <li
                  data-tgph-list-item
                  style={{ fontSize: "13px", lineHeight: "1.625" }}
                >
                  {children}
                </li>
              ),
            }}
          >
            {processSourceReferences(String(message.content ?? ""))}
          </Streamdown>
        </div>
      </Stack>

      {/* Sources section - only show after streaming completes */}
      {!isLoading && <SourcesSection sources={message.sources} />}
    </Stack>
  );
}

// Microsoft Teams icon component
const TeamsIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: "100%", height: "100%" }}
  >
    <path
      d="M20.625 6.75h-3.375v-1.5c0-.828.672-1.5 1.5-1.5h.375c.828 0 1.5.672 1.5 1.5v1.5z"
      fill="#5059C9"
    />
    <path
      d="M17.25 7.5h4.125c.345 0 .625.28.625.625v5.25c0 1.726-1.399 3.125-3.125 3.125H17.25V7.5z"
      fill="#5059C9"
    />
    <path
      d="M14.625 5.25a2.625 2.625 0 100-5.25 2.625 2.625 0 000 5.25z"
      fill="#5059C9"
    />
    <path d="M10.5 6a3 3 0 100-6 3 3 0 000 6z" fill="#7B83EB" />
    <path
      d="M14.25 7.5H6.75c-.69 0-1.25.56-1.25 1.25v7.5c0 2.899 2.351 5.25 5.25 5.25h.5c2.899 0 5.25-2.351 5.25-5.25v-7.5c0-.69-.56-1.25-1.25-1.25z"
      fill="#7B83EB"
    />
    <path d="M10.875 10.5h-1.5v6h-1.5v-6h-1.5V9h4.5v1.5z" fill="white" />
  </svg>
);

// Get icon component based on URL domain
function getIconForUrl(url: string | undefined): React.ComponentType {
  if (!url) return Icons.logo;

  try {
    const hostname = new URL(url).hostname.toLowerCase();

    if (hostname.includes("slack.com") || hostname.includes("slack.dev")) {
      return Icons.slack;
    }
    if (
      hostname.includes("microsoft.com") ||
      hostname.includes("teams.microsoft.com")
    ) {
      return TeamsIcon;
    }
    // Default to Knock logo for docs.knock.app and others
    return Icons.logo;
  } catch {
    return Icons.logo;
  }
}

// Build breadcrumbs from a URL path
function buildBreadcrumbs(url: string | undefined): string[] {
  if (!url) return [];

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // Determine the root label based on domain
    let rootLabel = "Docs";
    if (hostname.includes("slack.com") || hostname.includes("slack.dev")) {
      rootLabel = "Slack";
    } else if (hostname.includes("microsoft.com")) {
      rootLabel = "Teams";
    }

    // Get path segments and convert to readable labels
    const pathParts = urlObj.pathname
      .split("/")
      .filter((p) => p.length > 0)
      .map((part) =>
        part.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      );

    return [rootLabel, ...pathParts];
  } catch {
    return [];
  }
}

function SourceCard({ source }: { source: Source }) {
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = getIconForUrl(source.url);
  const breadcrumbs = buildBreadcrumbs(source.url);

  const content = (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      bg={isHovered ? "blue-1" : "surface-1"}
      border="px"
      borderColor={isHovered ? "blue-7" : "gray-4"}
      rounded="3"
      py="3"
      px="4"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        cursor: source.url ? "pointer" : "default",
        width: "75%",
        position: "relative",
        transition: "background-color 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexWrap: "wrap",
          }}
        >
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              <Text
                as="span"
                size="0"
                color="gray"
                style={{ textWrap: "nowrap" }}
              >
                {crumb}
              </Text>
              {i < breadcrumbs.length - 1 && (
                <Text as="span" size="0" color="disabled">
                  ›
                </Text>
              )}
            </React.Fragment>
          ))}
        </Box>
      )}
      {/* Title with icon */}
      <Box
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <Box
          style={{
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <IconComponent />
        </Box>
        <Text
          as="span"
          size="2"
          color="default"
          weight="medium"
          style={{
            fontSize: "13px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
            minWidth: 0,
          }}
        >
          {source.title}
        </Text>
      </Box>
      {/* External link icon - vertically centered */}
      {isHovered && source.url && (
        <Box
          style={{
            position: "absolute",
            right: "8px",
            top: "6px",
          }}
        >
          <Icon icon={ArrowUpRight} size="1" color="blue" aria-hidden />
        </Box>
      )}
    </Box>
  );

  if (source.url) {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          textDecoration: "none",
          color: "inherit",
        }}
      >
        {content}
      </a>
    );
  }

  return content;
}

function SourcesSection({ sources }: { sources?: Source[] }) {
  if (!sources || sources.length === 0) {
    return null;
  }

  return (
    <Stack direction="column" gap="2" px="3" pt="0" pb="4">
      <Text as="span" size="1" weight="medium" color="default">
        Sources
      </Text>
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {sources.map((source, index) => (
          <SourceCard key={index} source={source} />
        ))}
      </Box>
    </Stack>
  );
}

export default AskAiSidebar;
