import { useAppearance } from "@telegraph/appearance";
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  applyThemeAppearance,
  getInitialThemeAppearance,
  isThemeAppearance,
  persistThemeAppearance,
  THEME_ATTRIBUTE,
  ThemeAppearance,
} from "@/lib/theme";

type ThemeContextValue = {
  appearance: ThemeAppearance;
  setAppearance: (appearance: ThemeAppearance) => void;
  toggleAppearance: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { setAppearance: setTelegraphAppearance } = useAppearance();

  // Initialize with "light" to match the SSR-rendered HTML (which always starts
  // as "light"). The THEME_INITIALIZER_SCRIPT in _document.tsx updates the DOM
  // attribute before paint; we then sync React state after mount in useEffect.
  const [appearance, setAppearanceState] = useState<ThemeAppearance>("light");

  // After mount, read the appearance the inline script already applied to the DOM
  // and sync React state. This avoids reading the DOM during render (which causes
  // SSR/client hydration mismatches).
  React.useEffect(() => {
    const docAppearance =
      document.documentElement.getAttribute(THEME_ATTRIBUTE);
    const syncedAppearance = isThemeAppearance(docAppearance)
      ? docAppearance
      : getInitialThemeAppearance();
    setAppearanceState(syncedAppearance);
    setTelegraphAppearance(syncedAppearance);
  }, [setTelegraphAppearance]);

  const setAppearance = useCallback(
    (newAppearance: ThemeAppearance) => {
      setAppearanceState(newAppearance);
      setTelegraphAppearance(newAppearance);
      applyThemeAppearance(newAppearance);
      persistThemeAppearance(newAppearance);
    },
    [setTelegraphAppearance],
  );

  const toggleAppearance = useCallback(() => {
    const nextAppearance = appearance === "dark" ? "light" : "dark";
    setAppearance(nextAppearance);
  }, [appearance, setAppearance]);

  const value = useMemo(
    () => ({
      appearance,
      setAppearance,
      toggleAppearance,
    }),
    [appearance, setAppearance, toggleAppearance],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
