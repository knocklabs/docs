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

  // Chat state - starts empty, loaded from sessionStorage after mount to avoid hydration mismatch
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  // Load messages from sessionStorage after mount (client-side only)
  useEffect(() => {
    const saved = sessionStorage.getItem("askAiMessages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {
        // Invalid JSON, ignore
      }
    }
    setHasLoadedFromStorage(true);
  }, []);

  // Persist messages to sessionStorage when they change (only after initial load)
  useEffect(() => {
    if (hasLoadedFromStorage) {
      sessionStorage.setItem("askAiMessages", JSON.stringify(messages));
    }
  }, [messages, hasLoadedFromStorage]);

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);
  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);
  const openSidebarWithPrompt = useCallback((prompt: string) => {
    setInitialPrompt(prompt);
    setIsOpen(true);
  }, []);
  const clearInitialPrompt = useCallback(() => setInitialPrompt(null), []);
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("askAiMessages");
    }
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
