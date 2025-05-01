import { SdkSpecificContent } from "@/data/inAppSidebar";
import { SidebarPage, SidebarSection } from "../data/types";

// Converts a Next.js router slug to a paths array
export const slugToPaths = (slug: string | string[] | undefined): string[] => {
  if (!slug) {
    return [];
  } else if (typeof slug == "string") {
    return [slug];
  } else {
    return slug;
  }
};

// TODO: Make this generic. This is a hack right now and it won't work for arbitrary paths.
export function getInAppSidebar(
  paths: string[],
  allSidebarContent: SidebarSection[],
  selectedSdkContent: SdkSpecificContent,
) {
  if (!paths.includes(selectedSdkContent.value)) {
    return getSidebarInfo(paths, allSidebarContent);
  }

  // Get the deepest page that matches the paths
  const { section, page } = depthFirstSidebarInfo(paths, allSidebarContent);

  return {
    breadcrumbs: [
      {
        slug: "in-app-ui",
        title: "In-App UI",
        path: "/in-app-ui",
      },
      {
        slug: `/in-app-ui/${selectedSdkContent.value}`,
        title: selectedSdkContent.title,
        path: `/in-app-ui/${selectedSdkContent.value}`,
      },
      {
        slug: `${section?.slug}`,
        title: section?.title,
        path: `${section?.slug}`,
      },
      {
        slug: `${section?.slug}${page?.slug}`,
        title: page?.title,
        path: `${section?.slug}${page?.slug}`,
      },
    ],
  };
}

export function depthFirstSidebarInfo(
  paths: string[],
  sidebarContent: SidebarSection[],
) {
  const slug = `/${paths.join("/")}`;

  // Initialize result variables
  let matchingSection: SidebarSection | undefined;
  let matchingPage: SidebarPage | undefined;

  // Helper function to recursively search sections
  function searchSections(
    sections: SidebarSection[],
    currentPath: string = "",
  ) {
    for (const section of sections) {
      const sectionPath = `${currentPath}${section.slug}`;

      // Add this section's pages to flattened list
      if (section.pages) {
        for (const page of section.pages) {
          const pagePath = `${sectionPath}${page.slug}`;

          if (pagePath === slug) {
            matchingSection = section;
            matchingPage = page;
            return;
          }

          // Recurse into nested pages if they exist
          if ("pages" in page && page.pages) {
            searchSections([{ ...page, slug: pagePath } as SidebarSection], "");
          }
        }
      }

      // Check if this section matches the target slug
      if (sectionPath === slug) {
        matchingSection = section;
        return;
      }
    }
  }

  // Start the search
  searchSections(sidebarContent);

  return {
    section: matchingSection,
    page: matchingPage,
  };
}

// Returns the breadcrumbs and adjacent pages in the sidebar given a path
export const getSidebarInfo = (
  paths: string[],
  fullSidebarContent: SidebarSection[],
) => {
  // Set up return data
  let breadcrumbs: SidebarPage[] = [];
  let prevPage: SidebarPage | undefined = undefined;
  let nextPage: SidebarPage | undefined = undefined;

  // Set up temporary data for the search
  let sidebarContent: (SidebarSection | SidebarPage)[] = fullSidebarContent;
  let path = "";

  // Iterate over each path segment and traverse the sidebar
  // by finding the correct sections and pages
  for (let i = 0; i < paths.length; i++) {
    const slug = paths[i];

    // Traverse sidebar to find section or page
    const index = sidebarContent.findIndex((s) => s.slug === `/${slug}`);
    const section = sidebarContent[index];

    let breadcrumbPath = path + `/${slug}`;
    // If the current breadcrumb is a section (e.g. 'Getting Started'), add the first page to the path
    if (section && "pages" in section && section?.pages) {
      breadcrumbPath += section.pages[0].slug;
    }

    breadcrumbs.push({
      slug,
      title: section?.title ?? "",
      path: breadcrumbPath,
    });

    // Update temporary variables for the next segment search
    sidebarContent = section && "pages" in section ? section.pages || [] : [];
    path += `/${slug}`;
  }

  // Flatten the sidebar tree and get the previous and next pages
  const flatSidebar = flattenSidebar(fullSidebarContent);
  const flatIndex = flatSidebar.findIndex(
    (page) => page.path === `/${paths.join("/")}`,
  );

  if (flatIndex > 0) {
    prevPage = flatSidebar[flatIndex - 1];
  }

  if (flatIndex < flatSidebar.length - 1) {
    nextPage = flatSidebar[flatIndex + 1];
  }

  return {
    breadcrumbs,
    prevPage,
    nextPage,
  };
};

const flattenSidebar = (sidebarContent: SidebarSection[]): SidebarPage[] => {
  let flatSidebar: SidebarPage[] = [];

  for (const section of sidebarContent) {
    flatSidebar = flatSidebar.concat(flattenPages(section.pages, section.slug));
  }

  return flatSidebar;
};

const flattenPages = (
  pages: SidebarSection["pages"],
  path: string,
): SidebarPage[] => {
  let flatPages: SidebarPage[] = [];

  for (const page of pages) {
    if ("pages" in page && page.pages) {
      flatPages = flatPages.concat(flattenPages(page.pages, path + page.slug));
    } else {
      flatPages.push({
        title: page.title,
        slug: page.slug,
        path: path + page.slug,
      });
    }
  }

  return flatPages;
};
