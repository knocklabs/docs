import { useRouter } from "next/router";
import { useLayoutEffect } from "react";
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
      const topPadding =
        parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--top-padding",
          ),
          10,
        ) || 0;
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

const scrollToElementWithPadding = (document: Document, element: Element) => {
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

  // Use 'auto' for immediate jump on load, respecting user agent settings for motion if any.
  window.scrollTo({ top: targetScrollY, behavior: "auto" });
};

export const useInitialScrollState = () => {
  const router = useRouter();
  const basePath = router.pathname.split("/")[1];

  useLayoutEffect(() => {
    // This setTimeout is a trick to make sure the scroll position is accurate
    const timeout = setTimeout(() => {
      const path = router.asPath;

      const resourcePath = path.replace(`/${basePath}`, "");
      const element = document.querySelector(
        `[data-resource-path="${resourcePath}"]`,
      );

      if (element) {
        scrollToElementWithPadding(document, element);
      } else {
        // Fallback or default scroll behavior if element not found initially
        window.scrollTo(0, 0);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [router.asPath, basePath]);
};
