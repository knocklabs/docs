import { Box, Stack } from "@telegraph/layout";
import { Text, Code } from "@telegraph/typography";
import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import {
  X,
  ArrowUp,
  Loader2,
  ChevronDown,
  Brain,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useAskAi } from "./AskAiContext";
import {
  useChatStream,
  type Message,
  type Source,
} from "../hooks/useChatStream";
import { Streamdown } from "streamdown";
import React from "react";
import { Icons } from "./ui/Icons";

// Helper function to convert source references like (1), (2) to superscript links
// Also handles incomplete markdown link syntax during streaming to prevent "[blocked]" from appearing
function processSourceReferences(content: string): string {
  if (typeof content !== "string") {
    return content;
  }

  let processed = content;

  // Convert single newlines to double newlines so markdown creates separate paragraphs
  // This ensures proper spacing between paragraphs in the response
  processed = processed.replace(/\n(?!\n)/g, "\n\n");

  // First, convert COMPLETE markdown links with numeric text like [(1)](url) to clickable superscript links
  processed = processed.replace(
    /\[(\(?\d+\)?)\]\(([^)]+)\)/g,
    (match, num, url) => {
      const justNumber = num.replace(/[()]/g, "");
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: var(--tgph-accent-9); text-decoration: none; cursor: pointer;"><sup style="font-size: 0.6rem;">${justNumber}</sup></a>`;
    },
  );

  // Handle incomplete markdown link syntax during streaming to prevent "[blocked]"
  // Match patterns like [(1)]( or [(1)](http... that don't have a closing )
  // These are incomplete links being streamed - show as plain superscript temporarily
  processed = processed.replace(/\[(\(?\d+\)?)\]\([^)]*$/g, (match, num) => {
    const justNumber = num.replace(/[()]/g, "");
    return `<sup style="color: var(--tgph-accent-9); font-size: 0.6rem;">${justNumber}</sup>`;
  });

  // Also handle even more incomplete patterns like [(1)] at end of string (no URL yet)
  processed = processed.replace(/\[(\(?\d+\)?)\]$/g, (match, num) => {
    const justNumber = num.replace(/[()]/g, "");
    return `<sup style="color: var(--tgph-accent-9); font-size: 0.6rem;">${justNumber}</sup>`;
  });

  // Handle [(1) at end of string (bracket not closed yet)
  processed = processed.replace(/\[(\(?\d+\)?)$/g, (match, num) => {
    const justNumber = num.replace(/[()]/g, "");
    return `<sup style="color: var(--tgph-accent-9); font-size: 0.6rem;">${justNumber}</sup>`;
  });

  // Handle any remaining standalone (1), (2), etc. that aren't part of links
  processed = processed.replace(
    /(?<!\[)\((\d+)\)(?!\])/g,
    '<sup style="color: var(--tgph-accent-9); font-size: 0.6rem;">$1</sup>',
  );

  return processed;
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
  } = useAskAi();
  const [headerHeight, setHeaderHeight] = useState(100);
  const [inputValue, setInputValue] = useState("");
  const [isHoveringResizeHandle, setIsHoveringResizeHandle] = useState(false);
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
    // Button is enabled when loading/streaming (to stop) or when there's input (to submit)
    const isActive = isLoading || isStreaming;
    const isButtonEnabled = isActive || hasInput;

    return (
      <Box
        borderBottomWidth={isAtTop ? "px" : undefined}
        borderTopWidth={!isAtTop ? "px" : undefined}
        borderColor="gray-4"
        style={{
          minWidth: `${sidebarWidth}px`,
          position: "relative",
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
            disabled={isActive}
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
              color:
                hasInput || isActive
                  ? "var(--tgph-gray-12)"
                  : "var(--tgph-gray-10)",
              opacity: isActive ? 0.6 : 1,
              cursor: isActive ? "not-allowed" : "text",
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
            onClick={isActive ? stopStream : handleSubmit}
            disabled={!isButtonEnabled}
            style={{
              width: "28px",
              height: "28px",
              minWidth: "28px",
              minHeight: "28px",
              padding: "0",
              borderRadius: "50%",
              backgroundColor: isButtonEnabled ? "#000" : "var(--tgph-gray-4)",
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
                size={14}
                strokeWidth={2}
                color={isButtonEnabled ? "#fff" : "var(--tgph-gray-10)"}
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
        transition: isResizing
          ? "none"
          : "width 0.2s ease-in-out, border-color 0.2s ease-in-out",
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
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: "8px",
          backgroundColor: "var(--tgph-surface-1)",
          position: "relative",
          boxShadow: "inset 0px 0px 0px 1px var(--tgph-gray-5)",
          marginTop: isConsecutiveUserMessage ? "12px" : undefined,
        }}
      >
        <Text
          as="span"
          size="2"
          weight="regular"
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

  // Assistant response wrapped in AgentResponse container
  // Use tgraph-content class for consistent markdown styling with the rest of the docs
  // Streamdown is optimized for streaming LLM content and handles incomplete markdown gracefully
  return (
    <Box
      bg="surface-3"
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Response text section */}
      <Box
        bg="surface-1"
        style={{
          padding: "6px 8px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div className="tgraph-content">
          <Streamdown
            parseIncompleteMarkdown={false}
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
                  style={{
                    overflow: "auto",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
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
                <p style={{ marginBottom: "12px" }}>{children}</p>
              ),
            }}
          >
            {processSourceReferences(message.content)}
          </Streamdown>
        </div>
      </Box>

      {/* Sources section - only show after streaming completes */}
      {!isLoading && <SourcesSection sources={message.sources} />}
    </Box>
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

    if (hostname.includes("slack.com")) {
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
    if (hostname.includes("slack.com")) {
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
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: "10px 12px",
        borderRadius: "8px",
        border: `1px solid ${
          isHovered ? "var(--tgph-accent-9)" : "var(--tgph-gray-4)"
        }`,
        backgroundColor: "var(--tgph-surface-1)",
        cursor: source.url ? "pointer" : "default",
        width: "75%",
        position: "relative",
        transition: "border-color 0.2s ease",
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
                style={{
                  color: "var(--tgph-gray-9)",
                  whiteSpace: "nowrap",
                }}
              >
                {crumb}
              </Text>
              {i < breadcrumbs.length - 1 && (
                <Text
                  as="span"
                  size="0"
                  style={{
                    color: "var(--tgph-gray-7)",
                  }}
                >
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
          weight="medium"
          style={{
            color: "var(--tgph-gray-12)",
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
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon
            icon={ExternalLink}
            size="1"
            aria-hidden
            style={{
              color: "var(--tgph-accent-9)",
            }}
          />
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
    <Box
      style={{
        padding: "8px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <Text
        as="span"
        size="1"
        weight="semi-bold"
        style={{
          color: "var(--tgph-gray-11)",
        }}
      >
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
    </Box>
  );
}

export default AskAiSidebar;
