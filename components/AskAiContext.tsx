import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

// Define types here to avoid circular dependency with useChatStream
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

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
};

type AskAiContextType = {
  // UI state
  isOpen: boolean;
  sidebarWidth: number;
  isResizing: boolean;
  initialPrompt: string | null;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  openSidebarWithPrompt: (prompt: string) => void;
  clearInitialPrompt: () => void;
  setIsOpen: (open: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setIsResizing: (resizing: boolean) => void;
  // Chat state (persists across navigation)
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isStreaming: boolean;
  setIsStreaming: (streaming: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clearMessages: () => void;
  // Chat sessions
  chatSessions: ChatSession[];
  currentChatId: string | null;
  createNewSession: () => string;
  selectSession: (sessionId: string) => void;
  generateSessionTitle: (sessionId: string, messages: Message[]) => Promise<void>;
};

export const AskAiContext = createContext<AskAiContextType | null>(null);

export function AskAiProvider({ children }: { children: ReactNode }) {
  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    // Load saved width from localStorage, default to 340px
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("askAiSidebarWidth");
      return saved ? parseInt(saved, 10) : 340;
    }
    return 340;
  });

  // Chat sessions state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Chat state - starts empty, loaded from current session after mount
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load chat sessions and current chat from localStorage after mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedSessions = localStorage.getItem("askAiChatSessions");
      const savedCurrentChatId = localStorage.getItem("askAiCurrentChatId");

      if (savedSessions) {
        const sessions = JSON.parse(savedSessions) as ChatSession[];
        setChatSessions(sessions);

        if (savedCurrentChatId) {
          const session = sessions.find((s) => s.id === savedCurrentChatId);
          if (session) {
            setCurrentChatId(savedCurrentChatId);
            setMessages(session.messages);
          } else {
            // Session not found, clear the saved ID
            localStorage.removeItem("askAiCurrentChatId");
          }
        }
      }
    } catch {
      // Invalid JSON, ignore
    }

    setHasLoadedFromStorage(true);
  }, []);

  // Persist chat sessions to localStorage when they change
  useEffect(() => {
    if (!hasLoadedFromStorage || typeof window === "undefined") return;
    localStorage.setItem("askAiChatSessions", JSON.stringify(chatSessions));
  }, [chatSessions, hasLoadedFromStorage]);

  // Persist current chat ID to localStorage when it changes
  useEffect(() => {
    if (!hasLoadedFromStorage || typeof window === "undefined") return;
    if (currentChatId) {
      localStorage.setItem("askAiCurrentChatId", currentChatId);
    } else {
      localStorage.removeItem("askAiCurrentChatId");
    }
  }, [currentChatId, hasLoadedFromStorage]);

  // Save current messages to the current session whenever messages change
  useEffect(() => {
    if (!hasLoadedFromStorage || !currentChatId || typeof window === "undefined") return;

    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === currentChatId
          ? { ...session, messages, updatedAt: Date.now() }
          : session,
      ),
    );
  }, [messages, currentChatId, hasLoadedFromStorage]);

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);
  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);
  const openSidebarWithPrompt = useCallback((prompt: string) => {
    setInitialPrompt(prompt);
    setIsOpen(true);
  }, []);
  const clearInitialPrompt = useCallback(() => setInitialPrompt(null), []);

  // Create a new chat session
  const createNewSession = useCallback(() => {
    const sessionId = `chat-${Date.now()}`;
    const newSession: ChatSession = {
      id: sessionId,
      title: "New chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setChatSessions((prev) => [newSession, ...prev]);
    setCurrentChatId(sessionId);
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);

    return sessionId;
  }, []);

  // Select an existing chat session
  const selectSession = useCallback(
    (sessionId: string) => {
      const session = chatSessions.find((s) => s.id === sessionId);
      if (session) {
        setCurrentChatId(sessionId);
        setMessages(session.messages);
        setError(null);
        setIsLoading(false);
        setIsStreaming(false);
      }
    },
    [chatSessions],
  );

  // Generate AI title for a session
  const generateSessionTitle = useCallback(
    async (sessionId: string, messagesToUse: Message[]) => {
      console.log("[generateSessionTitle] Called", {
        sessionId,
        messagesCount: messagesToUse.length,
      });

      if (messagesToUse.length === 0) {
        console.log("[generateSessionTitle] Skipped - no messages");
        return;
      }

      try {
        // Convert messages to API format (without id and sources)
        const apiMessages = messagesToUse.map(({ role, content }) => ({
          role,
          content,
        }));

        console.log("[generateSessionTitle] Making API request to /api/chat-title", {
          messagesCount: apiMessages.length,
        });

        const response = await fetch("/api/chat-title", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: apiMessages }),
        });

        console.log("[generateSessionTitle] API response", {
          ok: response.ok,
          status: response.status,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("[generateSessionTitle] API error", {
            status: response.status,
            error: errorText,
          });
          throw new Error(`Failed to generate title: ${response.status}`);
        }

        const data = await response.json();
        const title = data.title || "New chat";

        console.log("[generateSessionTitle] Title generated", { title });

        setChatSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, title } : s)),
        );
      } catch (error) {
        console.error("[generateSessionTitle] Error", error);
        // If title generation fails, use first user message as fallback
        const firstUserMessage = messagesToUse.find((m) => m.role === "user");
        if (firstUserMessage) {
          const fallbackTitle =
            firstUserMessage.content.substring(0, 30).trim() + "...";
          console.log("[generateSessionTitle] Using fallback title", {
            fallbackTitle,
          });
          setChatSessions((prev) =>
            prev.map((s) =>
              s.id === sessionId ? { ...s, title: fallbackTitle } : s,
            ),
          );
        }
      }
    },
    [],
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
    setCurrentChatId(null);
  }, []);

  return (
    <AskAiContext.Provider
      value={{
        // UI state
        isOpen,
        sidebarWidth,
        isResizing,
        initialPrompt,
        openSidebar,
        closeSidebar,
        toggleSidebar,
        openSidebarWithPrompt,
        clearInitialPrompt,
        setIsOpen,
        setSidebarWidth,
        setIsResizing,
        // Chat state
        messages,
        setMessages,
        isLoading,
        setIsLoading,
        isStreaming,
        setIsStreaming,
        error,
        setError,
        clearMessages,
        // Chat sessions
        chatSessions,
        currentChatId,
        createNewSession,
        selectSession,
        generateSessionTitle,
      }}
    >
      {children}
    </AskAiContext.Provider>
  );
}

export function useAskAi() {
  const context = useContext(AskAiContext);
  if (!context) {
    throw new Error("useAskAi must be used within an AskAiProvider");
  }
  return context;
}
