import { useRouter } from "next/router";
import { useEffect } from "react";
import { debounce } from "@/lib/debounce";

export const stripPrefix = (path: string) => {
  return path.replace(/^\/[^/]+/, "");
};

export const stripTrailingSlash = (path: string) => {
  return path.replace(/\/$/, "");
};

export const isPathTheSame = (path1: string, path2: string) => {
  return (
    path1 === path2 || path1.replace(/\/$/, "") === path2.replace(/\/$/, "")
  );
};

// This is the main function that coordinates the synchronization between the sidebar and the content
export const highlightResource = (
  resourceUrl: string,
  {
    moveToItem = false,
    replaceUrl,
  }: {
    moveToItem?: boolean;
    replaceUrl?: string;
  } = {},
) => {
  const resourceUrlNoTrailingSlash = stripTrailingSlash(resourceUrl);

  // Update the nav styles
  updateNavStyles(resourceUrlNoTrailingSlash);

  if (moveToItem) {
    const pathNoPrefix = stripPrefix(resourceUrl);
    const pathNoTrailingSlash = stripTrailingSlash(pathNoPrefix);
    const newActiveItem: HTMLAnchorElement | null = document.querySelector(
      `[data-content-body] [data-resource-path='${pathNoTrailingSlash}']`,
    );

    // Scroll to the content on the page
    if (newActiveItem) {
      // Get the desired padding from the CSS variable
      const topPadding = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-padding'), 10) || 0;
      const elementRect = newActiveItem.getBoundingClientRect();
      const targetScrollY = window.scrollY + elementRect.top - topPadding;

      window.scrollTo({
        top: targetScrollY,
        behavior: "instant", 
      });

      newActiveItem.focus();
    }
  }

  // Update URL state
  if (resourceUrl) {
    window.history.replaceState(null, "", replaceUrl || resourceUrl);
  }
};

// Create a debounced scroll function
const debouncedScrollIntoView = debounce((element: HTMLElement) => {
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}, 250);

export const updateNavStyles = (resourceUrl: string) => {
  // Scroll the nav item into view
  const newActiveNavElement: HTMLAnchorElement | null = document.querySelector(
    `[data-sidebar-wrapper] [data-resource-path='${resourceUrl}']`,
  );

  if (newActiveNavElement) {
    newActiveNavElement.dataset.active = "true";

    // Use the debounced function
    debouncedScrollIntoView(newActiveNavElement);

    if (document.activeElement != newActiveNavElement) {
      (document.activeElement as HTMLElement)?.blur();
    }

    // Annoying we have to do this by hand, but have to do it
    if (newActiveNavElement.firstChild) {
      (newActiveNavElement.firstChild as HTMLElement).style.color =
        "var(--tgph-gray-12)";
    }
  }

  // Remove the styling from any previous active nav items
  const activeElements: HTMLAnchorElement[] = Array.from(
    document.querySelectorAll(`[data-sidebar-wrapper] [data-active='true']`),
  );

  // Remove the styling from any previous active nav items
  activeElements.forEach((element) => {
    if (element.dataset.resourcePath !== resourceUrl) {
      element.setAttribute("data-active", "false");
      // For some reason, the color persists and we have to set it back to default by hand
      if (element.firstChild) {
        (element.firstChild as HTMLElement).style.color = "var(--tgph-gray-11)";
      }
    }
  });
};

export const useInitialScrollState = () => {
  const router = useRouter();
  const basePath = router.pathname.split("/")[1];

  useEffect(() => {
    // This setTimeout is a trick to make sure the scroll position is accurate
    const timeout = setTimeout(() => {
      const path = router.asPath;

      const resourcePath = path.replace(`/${basePath}`, "");
      const element = document.querySelector(
        `[data-resource-path="${resourcePath}"]`,
      );

      if (element) {
        // Get the desired padding from the CSS variable
        const topPadding = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--top-padding'), 10) || 0;
        const elementRect = element.getBoundingClientRect();
        // Calculate scroll position relative to the current scroll, adjusted for padding.
        // No need for window.scrollY here as we are setting the absolute scroll position on load (within timeout).
        const targetScrollY = window.pageYOffset + elementRect.top - topPadding;
        
        // Use 'auto' for immediate jump on load, respecting user agent settings for motion if any.
        window.scrollTo({ top: targetScrollY, behavior: 'auto' }); 
      } else {
        // Fallback or default scroll behavior if element not found initially
        window.scrollTo(0, 0);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [router.asPath, basePath]);
};
