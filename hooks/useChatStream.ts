import { useState, useCallback, useRef } from "react";

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
            processData(buffer.trim(), assistantMessageId, setMessages);
          }
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        
        // SSE format: each message ends with \n\n
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || ""; // Keep incomplete message in buffer
        
        for (const part of parts) {
          if (part.trim()) {
            processData(part.trim(), assistantMessageId, setMessages);
          }
        }
      }
    } catch (err) {
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
  }, [messages, isLoading]);

  const clearMessages = useCallback(() => {
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

// Helper function to process SSE/JSON data from the chat API
function processData(
  rawData: string,
  assistantMessageId: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
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
          // Streaming format
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + delta.content }
                : msg
            )
          );
        } else if (message?.content) {
          // Complete response format - content might be stringified JSON (Inkeep format)
          const textContent = extractTextContent(message.content);
          
          if (textContent) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessageId
                  ? { ...msg, content: textContent }
                  : msg
              )
            );
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
