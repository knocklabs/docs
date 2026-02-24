import { useEffect } from "react";

/**
 * Hook that scrolls the main content area to the top when the dependency changes.
 * Used in layouts to ensure content starts at the top when navigating between pages.
 */
export function useScrollToTop(dependency: unknown) {
  useEffect(() => {
    const content = document.querySelector(".main-content");
    if (content) {
      content.scrollTop = 0;
    }
  }, [dependency]);
}
