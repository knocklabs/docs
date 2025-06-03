import { useRouter } from "next/router";
import { useLayoutEffect, useState } from "react";
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
  }: {
    moveToItem?: boolean;
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
      scrollToElementWithPadding(document, newActiveItem);

      newActiveItem.focus();
    }
  }

  // Update URL state
  if (resourceUrl) {
    window.history.replaceState(null, "", resourceUrl);
  }
};

// Create a debounced scroll function
const debouncedScrollIntoView = debounce((element: HTMLElement) => {
  element.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}, 250);

// Load the nav elements into memory so we don't have to query the DOM every time
let allNavElements: HTMLAnchorElement[];
let lastPage: string;
let screenSizeSavedOn: number;

export const updateNavStyles = (resourceUrl: string) => {
  const viewportWidth = window.innerWidth;
  const targetMobileNav = viewportWidth < 768;
  const targetNav = targetMobileNav
    ? "[data-mobile-sidebar]"
    : "[data-sidebar-wrapper]";

  // Loads the current page's nav elements into memory so we don't have to query the DOM every time
  const currentPage = window.location.pathname.split("/")[1];
  if (
    currentPage !== lastPage ||
    !allNavElements ||
    screenSizeSavedOn !== viewportWidth
  ) {
    screenSizeSavedOn = viewportWidth;
    lastPage = currentPage;
    allNavElements = Array.from(
      document.querySelectorAll(`${targetNav} a[data-resource-path]`),
    );
  }

  // Scroll the nav item into view
  const navElements: HTMLAnchorElement[] = allNavElements.filter(
    (element) => element.dataset.resourcePath === resourceUrl,
  );

  if (navElements.length > 0) {
    navElements.forEach((element) => {
      element.dataset.active = "true";

      // Use the debounced function
      debouncedScrollIntoView(element);
    });
  }

  // Remove the styling from any previous active nav items
  const activeElements: HTMLAnchorElement[] = Array.from(
    document.querySelectorAll(`${targetNav} [data-active='true']`),
  );

  // Remove the styling from any previous active nav items
  activeElements.forEach((element) => {
    if (element.dataset.resourcePath !== resourceUrl) {
      element.dataset.active = "false";
    }
  });
};

// Jiggle is an option that jiggles the scroll a little to trigger the sidebar to open
const scrollToElementWithPadding = (
  document: Document,
  element: Element,
  { jiggle = true }: { jiggle?: boolean } = {},
) => {
  const topPadding =
    parseInt(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--top-padding",
      ),
      10,
    ) || 0;
  const elementRect = element.getBoundingClientRect();
  // Calculate scroll position relative to the current scroll, adjusted for padding.
  const targetScrollY = window.pageYOffset + elementRect.top - topPadding;

  // Use 'instant' for immediate jump on load, respecting user agent settings for motion if any.
  // Prevents any interruption with the Sidebar scroll events
  window.scrollTo({ top: targetScrollY, behavior: "instant" });

  console.log("jiggle", jiggle);

  // Hack to jiggle the scroll a little with smooth scroll to trigger the sidebar to open
  if (jiggle) {
    setTimeout(() => {
      window.scrollTo({ top: targetScrollY + 1, behavior: "smooth" });
    }, 10);
  }
};

/**
 * Our API reference pages are HUGE, like 5mb of content
 * They take a significant amount of time to load
 * This hook waits until the page height is stable before returning true
 * This allows other functions to wait for the page to be ready before running
 */
export const useIsPageReady = () => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const basePath = router.pathname.split("/")[1];

  useLayoutEffect(() => {
    let prevHeight = document.body.scrollHeight;
    let stableCount = 0;
    const maxStableChecks = 3; // Require 3 consecutive stable measurements
    let interval: NodeJS.Timeout;
    interval = setInterval(() => {
      const currentHeight = document.body.scrollHeight;
      if (currentHeight === prevHeight) {
        stableCount += 1;
        if (stableCount >= maxStableChecks) {
          clearInterval(interval);
          setIsReady(true);
        }
      } else {
        stableCount = 0;
        prevHeight = currentHeight;
      }
    }, 50);

    // Cleanup on unmount or dependency change
    return () => clearInterval(interval);
  }, [router.asPath, basePath]);

  return isReady;
};

export const useInitialScrollState = () => {
  const router = useRouter();
  const isReady = useIsPageReady();
  const basePath = router.pathname.split("/")[1];

  useLayoutEffect(() => {
    if (!isReady) return;
    const path = router.asPath;
    const resourcePath = path.replace(`/${basePath}`, "");
    const element = document.querySelector(
      `[data-resource-path="${resourcePath}"]`,
    );
    if (element) {
      scrollToElementWithPadding(document, element, { jiggle: false });
    } else {
      window.scrollTo(0, 0);
    }
  }, [router.asPath, basePath, isReady]);
};
