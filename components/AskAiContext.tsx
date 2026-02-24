import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const STORAGE_KEYS = {
  sidebarWidth: "askAiSidebarWidth",
  chatSessions: "askAiChatSessions",
  currentChatId: "askAiCurrentChatId",
} as const;

const DEFAULT_SIDEBAR_WIDTH = 340;

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
  generateSessionTitle: (
    sessionId: string,
    messages: Message[],
  ) => Promise<void>;
  // Callback registration for stream cleanup before session changes
  registerBeforeSessionChange: (callback: (() => void) | null) => void;
};

export const AskAiContext = createContext<AskAiContextType | null>(null);

function truncateToTitle(text: string, maxLength = 30): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.substring(0, maxLength).trim() + "...";
}

// Validate and sanitize sessions/messages to handle malformed localStorage data
function sanitizeChatSessions(sessions: ChatSession[]): ChatSession[] {
  return sessions
    .filter((session) => session && Array.isArray(session.messages))
    .map((session) => ({
      ...session,
      messages: session.messages
        .filter((msg) => msg && typeof msg === "object")
        .map((msg) => ({
          ...msg,
          content: typeof msg.content === "string" ? msg.content : "",
        })),
    }));
}

export function AskAiProvider({ children }: { children: ReactNode }) {
  // UI state
  const [isOpen, setIsOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);

  // Chat sessions state
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Chat state - starts empty, loaded from current session after mount
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref to hold cleanup callback from useChatStream for aborting streams before session changes
  const beforeSessionChangeRef = useRef<(() => void) | null>(null);

  // Register a callback to be called before session changes (used by useChatStream)
  const registerBeforeSessionChange = useCallback(
    (callback: (() => void) | null) => {
      beforeSessionChangeRef.current = callback;
    },
    [],
  );

  // Load sidebar width from localStorage after mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEYS.sidebarWidth);
    if (saved) {
      setSidebarWidth(parseInt(saved, 10));
    }
  }, []);

  // Load chat sessions and current chat from localStorage after mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const savedSessions = localStorage.getItem(STORAGE_KEYS.chatSessions);
      const savedCurrentChatId = localStorage.getItem(
        STORAGE_KEYS.currentChatId,
      );

      if (savedSessions) {
        const sessions = JSON.parse(savedSessions) as ChatSession[];
        const sanitizedSessions = sanitizeChatSessions(sessions);
        setChatSessions(sanitizedSessions);

        if (savedCurrentChatId) {
          const session = sanitizedSessions.find(
            (s) => s.id === savedCurrentChatId,
          );
          if (session) {
            setCurrentChatId(savedCurrentChatId);
            setMessages(session.messages);
          } else {
            localStorage.removeItem(STORAGE_KEYS.currentChatId);
          }
        }
      }
    } catch {
      // Invalid JSON in localStorage, ignore
    }

    setHasLoadedFromStorage(true);
  }, []);

  // Persist chat sessions to localStorage when they change
  useEffect(() => {
    if (!hasLoadedFromStorage || typeof window === "undefined") return;
    localStorage.setItem(
      STORAGE_KEYS.chatSessions,
      JSON.stringify(chatSessions),
    );
  }, [chatSessions, hasLoadedFromStorage]);

  // Persist current chat ID to localStorage when it changes
  useEffect(() => {
    if (!hasLoadedFromStorage || typeof window === "undefined") return;
    if (currentChatId) {
      localStorage.setItem(STORAGE_KEYS.currentChatId, currentChatId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.currentChatId);
    }
  }, [currentChatId, hasLoadedFromStorage]);

  // Save current messages to the current session whenever messages change
  useEffect(() => {
    if (
      !hasLoadedFromStorage ||
      !currentChatId ||
      typeof window === "undefined"
    )
      return;

    setChatSessions((prev) =>
      prev.map((session) =>
        session.id === currentChatId
          ? { ...session, messages, updatedAt: Date.now() }
          : session,
      ),
    );
  }, [messages, currentChatId, hasLoadedFromStorage]);

  // Create a new chat session
  const createNewSession = useCallback(() => {
    // Abort any ongoing stream before switching sessions
    // This saves partial content to the current session
    beforeSessionChangeRef.current?.();

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

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);
  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);
  const openSidebarWithPrompt = useCallback(
    (prompt: string) => {
      // Create new session before setting prompt to ensure each query starts fresh
      createNewSession();
      setInitialPrompt(prompt);
      setIsOpen(true);
    },
    [createNewSession],
  );
  const clearInitialPrompt = useCallback(() => setInitialPrompt(null), []);

  // Select an existing chat session
  const selectSession = useCallback(
    (sessionId: string) => {
      const session = chatSessions.find((s) => s.id === sessionId);
      if (session) {
        // Abort any ongoing stream before switching sessions
        // This saves partial content to the current session
        beforeSessionChangeRef.current?.();

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
      if (messagesToUse.length === 0) return;

      const updateSessionTitle = (title: string) => {
        setChatSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, title } : s)),
        );
      };

      try {
        const apiMessages = messagesToUse.map(({ role, content }) => ({
          role,
          content,
        }));

        const response = await fetch("/api/chat-title", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate title: ${response.status}`);
        }

        const data = await response.json();
        updateSessionTitle(data.title || "New chat");
      } catch {
        const firstUserMessage = messagesToUse.find((m) => m.role === "user");
        if (firstUserMessage) {
          updateSessionTitle(truncateToTitle(firstUserMessage.content));
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
        // Stream cleanup registration
        registerBeforeSessionChange,
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
