import { useAppearance } from "@telegraph/appearance";
import React, { createContext, useCallback, useContext, useMemo } from "react";

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
  const { appearance: telegraphAppearance, setAppearance: setTelegraphAppearance } =
    useAppearance();

  const documentAppearance =
    typeof document !== "undefined"
      ? document.documentElement.getAttribute(THEME_ATTRIBUTE)
      : null;

  const appearance = isThemeAppearance(documentAppearance)
    ? documentAppearance
    : isThemeAppearance(telegraphAppearance)
      ? telegraphAppearance
      : getInitialThemeAppearance();

  const setAppearance = useCallback(
    (newAppearance: ThemeAppearance) => {
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

  React.useEffect(() => {
    applyThemeAppearance(appearance);
  }, [appearance]);

  const value = useMemo(
    () => ({
      appearance,
      setAppearance,
      toggleAppearance,
    }),
    [appearance, setAppearance, toggleAppearance],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
