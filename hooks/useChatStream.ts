import { useState, useCallback, useRef, useEffect } from "react";

// Streaming configuration
const STREAM_INTERVAL_MS = 20; // Update UI every 20ms
const CHARS_PER_UPDATE = 3; // Characters to reveal per update

export type Source = {
  title: string;
  url?: string;
};

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};

type UseChatStreamReturn = {
  messages: Message[];
  isLoading: boolean;
  isStreaming: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  stopStream: () => void;
};

export function useChatStream(): UseChatStreamReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Streaming state refs (don't trigger re-renders)
  const contentBufferRef = useRef<string>(""); // Accumulated content from API
  const sourcesBufferRef = useRef<Source[]>([]); // Accumulated sources from API
  const displayedLengthRef = useRef<number>(0); // How much we've shown to user
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentMessageIdRef = useRef<string | null>(null);
  const streamCompleteRef = useRef<boolean>(false);
  const userStoppedRef = useRef<boolean>(false);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
      }
    };
  }, []);

  // Start the UI streaming interval
  const startStreamingUI = useCallback((messageId: string) => {
    // Clear any existing interval
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
    }

    currentMessageIdRef.current = messageId;
    displayedLengthRef.current = 0;
    contentBufferRef.current = "";
    sourcesBufferRef.current = [];
    streamCompleteRef.current = false;
    userStoppedRef.current = false;
    setIsStreaming(true);

    streamIntervalRef.current = setInterval(() => {
      const buffer = contentBufferRef.current;
      const currentLength = displayedLengthRef.current;

      // If we have more content to show
      if (currentLength < buffer.length) {
        const nextLength = Math.min(
          currentLength + CHARS_PER_UPDATE,
          buffer.length,
        );
        const displayContent = buffer.substring(0, nextLength);
        displayedLengthRef.current = nextLength;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, content: displayContent } : msg,
          ),
        );
      } else if (streamCompleteRef.current && currentLength >= buffer.length) {
        // Stream is done and we've displayed everything
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
          streamIntervalRef.current = null;
          setIsStreaming(false);

          // Now that content is fully displayed, add sources to the message
          if (
            currentMessageIdRef.current &&
            sourcesBufferRef.current.length > 0
          ) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === currentMessageIdRef.current
                  ? { ...msg, sources: sourcesBufferRef.current }
                  : msg,
              ),
            );
          }
        }
      }
    }, STREAM_INTERVAL_MS);
  }, []);

  // Stop the streaming interval and show remaining content
  const stopStreamingUI = useCallback(() => {
    streamCompleteRef.current = true;
    // Don't clear interval immediately - let it finish displaying remaining content
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      // Add user message immediately
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      // Create assistant message placeholder
      const assistantMessageId = `assistant-${Date.now()}`;
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Start the UI streaming interval
      startStreamingUI(assistantMessageId);

      // Abort any existing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map(({ role, content }) => ({
              role,
              content,
            })),
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response
            .json()
            .catch(() => ({ error: "Unknown error" }));
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`,
          );
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        // eslint-disable-next-line no-constant-condition
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            // Process any remaining buffer
            if (buffer.trim()) {
              processData(buffer.trim(), contentBufferRef, sourcesBufferRef);
            }
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          // SSE format: each message ends with \n\n
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || ""; // Keep incomplete message in buffer

          for (const part of parts) {
            if (part.trim()) {
              processData(part.trim(), contentBufferRef, sourcesBufferRef);
            }
          }
        }

        // Signal that streaming is complete
        stopStreamingUI();

        // Extract sources from the final text content (footnote references)
        // Sources will be added to the message after the UI finishes revealing content
        const textSources = extractSourcesFromText(contentBufferRef.current);
        if (textSources.length > 0) {
          // Merge with any existing sources, avoiding duplicates
          const existingUrls = new Set(
            sourcesBufferRef.current.map((s) => s.url),
          );
          const newSources = textSources.filter(
            (s) => !existingUrls.has(s.url),
          );
          sourcesBufferRef.current = [
            ...sourcesBufferRef.current,
            ...newSources,
          ];
        }
      } catch (err) {
        // Stop the streaming interval
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
          streamIntervalRef.current = null;
        }

        if (err instanceof Error && err.name === "AbortError") {
          // Check if user manually stopped the stream
          if (userStoppedRef.current) {
            // User stopped - preserve the partially streamed content
            // Content and sources have already been updated by stopStream
            // Just reset the flag and return
            userStoppedRef.current = false;
            return;
          }

          // Request was aborted for other reasons, remove the assistant message
          setMessages((prev) =>
            prev.filter((msg) => msg.id !== assistantMessageId),
          );
          return;
        }

        const errorMessage =
          err instanceof Error ? err.message : "Failed to send message";
        setError(errorMessage);

        // Remove the empty assistant message on error
        setMessages((prev) =>
          prev.filter((msg) => msg.id !== assistantMessageId),
        );
      } finally {
        setIsLoading(false);
        abortControllerRef.current = null;
      }
    },
    [messages, isLoading, startStreamingUI, stopStreamingUI],
  );

  const stopStream = useCallback(() => {
    // Mark that user manually stopped the stream
    userStoppedRef.current = true;

    // Abort the current request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Stop the streaming interval
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }

    // Mark stream as complete so remaining buffered content gets displayed
    streamCompleteRef.current = true;

    // Display any remaining buffered content immediately
    if (currentMessageIdRef.current) {
      const buffer = contentBufferRef.current;
      const currentLength = displayedLengthRef.current;

      if (buffer.length === 0) {
        // No content was received - show a message indicating the user stopped the assistant
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === currentMessageIdRef.current
              ? { ...msg, content: "You stopped the assistant." }
              : msg,
          ),
        );
      } else {
        if (currentLength < buffer.length) {
          // Show all remaining content
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === currentMessageIdRef.current
                ? { ...msg, content: buffer }
                : msg,
            ),
          );
          displayedLengthRef.current = buffer.length;
        }

        // Add sources if any
        if (sourcesBufferRef.current.length > 0) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === currentMessageIdRef.current
                ? { ...msg, sources: sourcesBufferRef.current }
                : msg,
            ),
          );
        }
      }
    }

    // Set loading/streaming to false to re-enable input
    setIsLoading(false);
    setIsStreaming(false);
    abortControllerRef.current = null;
  }, []);

  const clearMessages = useCallback(() => {
    // Stop any streaming
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    // Abort any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
    userStoppedRef.current = false;
  }, []);

  return {
    messages,
    isLoading,
    isStreaming,
    error,
    sendMessage,
    clearMessages,
    stopStream,
  };
}

// Helper function to process SSE/JSON data and accumulate in buffer
function processData(
  rawData: string,
  contentBufferRef: React.MutableRefObject<string>,
  sourcesBufferRef: React.MutableRefObject<Source[]>,
) {
  const lines = rawData.split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === "" || trimmedLine.startsWith(":")) {
      continue;
    }

    // Handle both SSE format (data: {...}) and raw JSON format ({...})
    let data: string;
    if (trimmedLine.startsWith("data: ")) {
      data = trimmedLine.slice(6);
    } else if (trimmedLine.startsWith("{")) {
      data = trimmedLine;
    } else {
      continue;
    }

    if (data === "[DONE]") {
      continue;
    }

    try {
      const parsed = JSON.parse(data);

      // Uncomment for debugging:
      // console.log("Inkeep response chunk:", JSON.stringify(parsed, null, 2));

      // Helper to extract sources from a links/citations array
      const extractSourcesFromArray = (arr: any[]): Source[] => {
        return arr
          .map((item: any) => ({
            title: item.title || item.name || item.text || item.label || "",
            url: item.url || item.link || item.href || "",
          }))
          .filter((s: Source) => s.title);
      };

      // Check for links at top level
      if (parsed.links && Array.isArray(parsed.links)) {
        const linkSources = extractSourcesFromArray(parsed.links);
        if (linkSources.length > 0) {
          const existingTitles = new Set(
            sourcesBufferRef.current.map((s) => s.title),
          );
          const newSources = linkSources.filter(
            (s) => !existingTitles.has(s.title),
          );
          sourcesBufferRef.current = [
            ...sourcesBufferRef.current,
            ...newSources,
          ];
        }
      }

      if (parsed.choices && parsed.choices[0]) {
        const choice = parsed.choices[0];
        const delta = choice.delta;
        const message = choice.message;

        // Check for links in delta (streaming format)
        if (delta?.links && Array.isArray(delta.links)) {
          const linkSources = extractSourcesFromArray(delta.links);
          if (linkSources.length > 0) {
            const existingTitles = new Set(
              sourcesBufferRef.current.map((s) => s.title),
            );
            const newSources = linkSources.filter(
              (s) => !existingTitles.has(s.title),
            );
            sourcesBufferRef.current = [
              ...sourcesBufferRef.current,
              ...newSources,
            ];
          }
        }

        // Check for citations in delta (streaming format)
        if (delta?.citations && Array.isArray(delta.citations)) {
          const citationSources = extractSourcesFromArray(delta.citations);
          if (citationSources.length > 0) {
            const existingTitles = new Set(
              sourcesBufferRef.current.map((s) => s.title),
            );
            const newSources = citationSources.filter(
              (s) => !existingTitles.has(s.title),
            );
            sourcesBufferRef.current = [
              ...sourcesBufferRef.current,
              ...newSources,
            ];
          }
        }

        // Check for links in message (complete format)
        if (message?.links && Array.isArray(message.links)) {
          const linkSources = extractSourcesFromArray(message.links);
          if (linkSources.length > 0) {
            sourcesBufferRef.current = linkSources;
          }
        }

        // Check for citations in message (complete format)
        if (message?.citations && Array.isArray(message.citations)) {
          const citationSources = extractSourcesFromArray(message.citations);
          if (citationSources.length > 0) {
            sourcesBufferRef.current = citationSources;
          }
        }

        if (delta?.content) {
          // Streaming format - append to buffer
          // delta.content can be string or object
          if (typeof delta.content === "string") {
            contentBufferRef.current += delta.content;
          } else {
            // If content is an object, try to extract text and sources
            const { text, sources } = extractContentWithSources(delta.content);
            if (text) {
              contentBufferRef.current += text;
            }
            if (sources.length > 0) {
              const existingTitles = new Set(
                sourcesBufferRef.current.map((s) => s.title),
              );
              const newSources = sources.filter(
                (s) => !existingTitles.has(s.title),
              );
              sourcesBufferRef.current = [
                ...sourcesBufferRef.current,
                ...newSources,
              ];
            }
          }
        } else if (message?.content) {
          // Complete response format - extract and set buffer
          const { text, sources } = extractContentWithSources(message.content);
          if (text) {
            contentBufferRef.current = text;
          }
          if (sources.length > 0) {
            // Merge with existing sources, avoiding duplicates
            const existingTitles = new Set(
              sourcesBufferRef.current.map((s) => s.title),
            );
            const newSources = sources.filter(
              (s) => !existingTitles.has(s.title),
            );
            sourcesBufferRef.current = [
              ...sourcesBufferRef.current,
              ...newSources,
            ];
          }
        }
      }

      // Check for citations field at the top level
      if (parsed.citations && Array.isArray(parsed.citations)) {
        const citationSources = extractSourcesFromArray(parsed.citations);
        if (citationSources.length > 0) {
          const existingTitles = new Set(
            sourcesBufferRef.current.map((s) => s.title),
          );
          const newSources = citationSources.filter(
            (s) => !existingTitles.has(s.title),
          );
          sourcesBufferRef.current = [
            ...sourcesBufferRef.current,
            ...newSources,
          ];
        }
      }

      // Also check at choice level
      if (parsed.choices && parsed.choices[0]) {
        const choice = parsed.choices[0];
        if (choice.links && Array.isArray(choice.links)) {
          const linkSources = extractSourcesFromArray(choice.links);
          if (linkSources.length > 0) {
            const existingTitles = new Set(
              sourcesBufferRef.current.map((s) => s.title),
            );
            const newSources = linkSources.filter(
              (s) => !existingTitles.has(s.title),
            );
            sourcesBufferRef.current = [
              ...sourcesBufferRef.current,
              ...newSources,
            ];
          }
        }
      }
    } catch {
      // Skip invalid JSON
    }
  }
}

// Extract text from Inkeep's nested content format
function extractTextContent(content: string): string {
  try {
    const contentObj = JSON.parse(content);

    if (contentObj.content && Array.isArray(contentObj.content)) {
      let text = "";
      for (const item of contentObj.content) {
        if (item.type === "text" && item.text) {
          text += item.text;
        } else if (item.type === "document" && item.source?.content) {
          for (const sourceItem of item.source.content) {
            if (sourceItem.type === "text" && sourceItem.text) {
              text += sourceItem.text;
            }
          }
        } else if (item.text) {
          text += item.text;
        }
      }
      return text || content;
    }

    return typeof contentObj === "string" ? contentObj : content;
  } catch {
    // Content is plain text, not JSON
    return content;
  }
}

// Derive a human-readable title from a URL path
function titleFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Get the last meaningful path segment
    const pathParts = urlObj.pathname.split("/").filter((p) => p.length > 0);
    if (pathParts.length === 0) return url;

    const lastPart = pathParts[pathParts.length - 1];
    // Convert kebab-case or snake_case to Title Case
    return lastPart
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return url;
  }
}

// Extract sources from footnote references in markdown text
// Looks for markdown links like [(1)](url) which are footnote references
function extractSourcesFromText(text: string): Source[] {
  const sources: Source[] = [];
  const seenUrls = new Set<string>();

  // Match markdown links [title](url)
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = linkPattern.exec(text)) !== null) {
    const linkText = match[1].trim();
    const url = match[2].trim();

    // Skip if we've already seen this URL
    if (seenUrls.has(url)) continue;

    // Skip non-http links
    if (!url.startsWith("http")) continue;

    seenUrls.add(url);

    // If the link text is a footnote number like (1), (2), derive title from URL
    let title: string;
    if (/^\(\d+\)$/.test(linkText) || /^\d+$/.test(linkText)) {
      title = titleFromUrl(url);
    } else {
      title = linkText;
    }

    sources.push({ title, url });
  }

  return sources;
}

// Extract both text content and sources from Inkeep's nested content format
function extractContentWithSources(content: string | any): {
  text: string;
  sources: Source[];
} {
  const sources: Source[] = [];
  const seenSources = new Set<string>(); // For deduplication

  // Handle case where content is already an object
  let contentObj: any;
  if (typeof content === "string") {
    try {
      contentObj = JSON.parse(content);
    } catch {
      // Content is plain text, not JSON
      return { text: content, sources };
    }
  } else {
    contentObj = content;
  }

  // Handle array of content items
  if (Array.isArray(contentObj)) {
    let text = "";
    for (const item of contentObj) {
      if (item.type === "text" && item.text) {
        text += item.text;
      } else if (item.type === "document") {
        // Extract text from document if present
        if (item.text) {
          text += item.text;
        }
        if (item.source?.content) {
          for (const sourceItem of item.source.content) {
            if (sourceItem.type === "text" && sourceItem.text) {
              text += sourceItem.text;
            }
          }
        }

        // Extract source metadata
        const sourceTitle =
          item.source?.title ||
          item.source?.name ||
          item.title ||
          item.source?.metadata?.title ||
          item.source?.document_title ||
          "";
        const sourceUrl =
          item.source?.url ||
          item.source?.link ||
          item.url ||
          item.source?.metadata?.url ||
          item.source?.document_url ||
          undefined;

        if (sourceTitle) {
          if (!seenSources.has(sourceTitle)) {
            seenSources.add(sourceTitle);
            sources.push({
              title: sourceTitle,
              url: sourceUrl,
            });
          }
        }
      } else if (item.text) {
        text += item.text;
      }
    }
    return {
      text: text || (typeof content === "string" ? content : ""),
      sources,
    };
  }

  // Handle object with content array
  if (contentObj.content && Array.isArray(contentObj.content)) {
    let text = "";
    for (const item of contentObj.content) {
      if (item.type === "text" && item.text) {
        text += item.text;
      } else if (item.type === "document") {
        // Extract text from document if present
        if (item.text) {
          text += item.text;
        }
        if (item.source?.content) {
          for (const sourceItem of item.source.content) {
            if (sourceItem.type === "text" && sourceItem.text) {
              text += sourceItem.text;
            }
          }
        }

        // Extract source metadata - try multiple possible field names
        const sourceTitle =
          item.source?.title ||
          item.source?.name ||
          item.title ||
          item.source?.metadata?.title ||
          item.source?.document_title ||
          item.document_title ||
          "";
        const sourceUrl =
          item.source?.url ||
          item.source?.link ||
          item.url ||
          item.source?.metadata?.url ||
          item.source?.document_url ||
          item.document_url ||
          undefined;

        if (sourceTitle) {
          if (!seenSources.has(sourceTitle)) {
            seenSources.add(sourceTitle);
            sources.push({
              title: sourceTitle,
              url: sourceUrl,
            });
          }
        }
      } else if (item.text) {
        text += item.text;
      }
    }
    return {
      text: text || (typeof content === "string" ? content : ""),
      sources,
    };
  }

  // Handle plain string content
  if (typeof contentObj === "string") {
    return { text: contentObj, sources };
  }

  // Fallback: return content as-is
  return {
    text: typeof content === "string" ? content : JSON.stringify(contentObj),
    sources,
  };
}
