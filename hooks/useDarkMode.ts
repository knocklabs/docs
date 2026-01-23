import { useEffect, useState } from "react";

export const useDarkMode = (): boolean => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial state
    const checkDarkMode = () => {
      // Check for explicit dark class first, then fall back to system preference
      const hasDarkClass = document.documentElement.classList.contains("dark");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      setIsDark(hasDarkClass || prefersDark);
    };

    checkDarkMode();

    // Watch for class changes using MutationObserver
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Watch for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      // Re-check dark mode (will respect explicit class if present)
      checkDarkMode();
    };

    // Modern browsers support addEventListener on MediaQueryList
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleSystemChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      observer.disconnect();
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleSystemChange);
      } else {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, []);

  return isDark;
};
