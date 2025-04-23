import { useRouter } from "next/router";
import { useEffect } from "react";

export const stripPrefix = (path: string) => {
  return path.replace(/^\/[^/]+/, '');
};

export const stripTrailingSlash = (path: string) => {
  return path.replace(/\/$/, '');
};

export const isPathTheSame = (path1: string, path2: string) => {
  return path1.replace(/\/$/, '') === path2.replace(/\/$/, '');
};

// This is the main function that coordinates the synchronization between the sidebar and the content
export const highlightResource = (resourceUrl: string, { moveToItem = false, replaceUrl }: { moveToItem?: boolean, replaceUrl?: string } = {}) => {

  const resourceUrlNoTrailingSlash = stripTrailingSlash(resourceUrl);

  // Scroll the nav item into view
  const newActiveNavElement: HTMLAnchorElement | null = document.querySelector(
    `[data-sidebar-wrapper] [data-resource-path='${resourceUrlNoTrailingSlash}']`,
  );

  if (newActiveNavElement) {
    newActiveNavElement.dataset.active = "true";
    newActiveNavElement.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    if (document.activeElement != newActiveNavElement) {
      (document.activeElement as HTMLElement)?.blur();
    }

    // Annoying we have to do this by hand, but have to do it
    if (newActiveNavElement.firstChild) {
      (newActiveNavElement.firstChild as HTMLElement).style.color = "var(--tgph-gray-12)";
    }
  }

  if (moveToItem) {
    const pathNoPrefix = stripPrefix(resourceUrl);
    const pathNoTrailingSlash = stripTrailingSlash(pathNoPrefix);
    const newActiveItem: HTMLAnchorElement | null = document.querySelector(
      `[data-resource-path='${pathNoTrailingSlash}']`,
    );

    // Scroll to the content on the page
    if (newActiveItem) {
      newActiveItem.scrollIntoView({
        behavior: "instant",
        block: "start",
      });

      newActiveItem.focus();
    }

    // For some reason, the color persists and we have to set it to active color by hand
    if (newActiveItem?.firstChild) {
      (newActiveItem.firstChild as HTMLElement).style.color = "var(--tgph-gray-12)";
    }
  }

  // Remove the styling from any previous active nav items
  const activeElements: HTMLAnchorElement[] = Array.from(
    document.querySelectorAll(
      `[data-sidebar-wrapper] [data-active='true']`,
    ),
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

  // Update URL state
  if (resourceUrl) {
    window.history.replaceState(
      null,
      "",
      replaceUrl || resourceUrl,
    );
  }
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

      element?.scrollIntoView();
    }, 250);

    return () => clearTimeout(timeout);
  }, [router.asPath, basePath]);
};
