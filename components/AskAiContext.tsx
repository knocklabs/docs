import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type AskAiContextType = {
  isOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
  setIsOpen: (open: boolean) => void;
};

export const AskAiContext = createContext<AskAiContextType | null>(null);

export function AskAiProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = useCallback(() => setIsOpen(true), []);
  const closeSidebar = useCallback(() => setIsOpen(false), []);
  const toggleSidebar = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <AskAiContext.Provider value={{ isOpen, openSidebar, closeSidebar, toggleSidebar, setIsOpen }}>
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
