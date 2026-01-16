import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

type AskAiContextType = {
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
};

export const AskAiContext = createContext<AskAiContextType | null>(null);

export function AskAiProvider({ children }: { children: ReactNode }) {
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

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);
  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);
  const openSidebarWithPrompt = useCallback((prompt: string) => {
    setInitialPrompt(prompt);
    setIsOpen(true);
  }, []);
  const clearInitialPrompt = useCallback(() => setInitialPrompt(null), []);

  return (
    <AskAiContext.Provider
      value={{
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
