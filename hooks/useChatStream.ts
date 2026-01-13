import { useState, useCallback, useRef, useEffect } from "react";

// Streaming configuration
const STREAM_INTERVAL_MS = 20; // Update UI every 20ms
const CHARS_PER_UPDATE = 3; // Characters to reveal per update

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type UseChatStreamReturn = {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
};

export function useChatStream(): UseChatStreamReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Streaming state refs (don't trigger re-renders)
  const contentBufferRef = useRef<string>(""); // Accumulated content from API
  const displayedLengthRef = useRef<number>(0); // How much we've shown to user
  const streamIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentMessageIdRef = useRef<string | null>(null);
  const streamCompleteRef = useRef<boolean>(false);

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
    streamCompleteRef.current = false;

    streamIntervalRef.current = setInterval(() => {
      const buffer = contentBufferRef.current;
      const currentLength = displayedLengthRef.current;
      
      // If we have more content to show
      if (currentLength < buffer.length) {
        const nextLength = Math.min(currentLength + CHARS_PER_UPDATE, buffer.length);
        const displayContent = buffer.substring(0, nextLength);
        displayedLengthRef.current = nextLength;

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, content: displayContent } : msg
          )
        );
      } else if (streamCompleteRef.current && currentLength >= buffer.length) {
        // Stream is done and we've displayed everything
        if (streamIntervalRef.current) {
          clearInterval(streamIntervalRef.current);
          streamIntervalRef.current = null;
        }
      }
    }, STREAM_INTERVAL_MS);
  }, []);

  // Stop the streaming interval and show remaining content
  const stopStreamingUI = useCallback(() => {
    streamCompleteRef.current = true;
    // Don't clear interval immediately - let it finish displaying remaining content
  }, []);

  const sendMessage = useCallback(async (content: string) => {
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
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Process any remaining buffer
          if (buffer.trim()) {
            processData(buffer.trim(), contentBufferRef);
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // SSE format: each message ends with \n\n
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || ""; // Keep incomplete message in buffer
        
        for (const part of parts) {
          if (part.trim()) {
            processData(part.trim(), contentBufferRef);
          }
        }
      }

      // Signal that streaming is complete
      stopStreamingUI();

    } catch (err) {
      // Stop the streaming interval
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }

      if (err instanceof Error && err.name === "AbortError") {
        // Request was aborted, remove the assistant message
        setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
        return;
      }

      const errorMessage = err instanceof Error ? err.message : "Failed to send message";
      setError(errorMessage);
      
      // Remove the empty assistant message on error
      setMessages((prev) => prev.filter((msg) => msg.id !== assistantMessageId));
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [messages, isLoading, startStreamingUI, stopStreamingUI]);

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
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}

// Helper function to process SSE/JSON data and accumulate in buffer
function processData(
  rawData: string,
  contentBufferRef: React.MutableRefObject<string>
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
      
      if (parsed.choices && parsed.choices[0]) {
        const choice = parsed.choices[0];
        const delta = choice.delta;
        const message = choice.message;
        
        if (delta?.content) {
          // Streaming format - append to buffer
          contentBufferRef.current += delta.content;
        } else if (message?.content) {
          // Complete response format - extract and set buffer
          const textContent = extractTextContent(message.content);
          if (textContent) {
            contentBufferRef.current = textContent;
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
