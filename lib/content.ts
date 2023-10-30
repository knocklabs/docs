import { SidebarPage, SidebarSection } from "../data/types";

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
  let sidebarContent: any[] = fullSidebarContent;
  let path = "";

  // Some pages URL doesn't match their position in the sidebar,
  // so we have to massage the data a bit to produce the correct sidebar info
  if (paths[0] === "security") {
    paths.unshift("getting-started");
  }

  // Iterate over each segment of the path and traverse the sidebar
  for (let i = 0; i < paths.length; i++) {
    const slug = paths[i];

    // Continue traversing sidebar to find page
    const index = sidebarContent.findIndex((s) => s.slug === `/${slug}`);
    const section = sidebarContent[index];
    breadcrumbs.push({
      slug,
      title: section?.title ?? "",
      // If the current breadcrumb is a section (e.g. 'Getting Started'), add the first page to the path
      path: path + `/${slug}` + (section?.pages ? section.pages[0].slug : ""),
    });

    // Update temporary variables for the next segment search
    sidebarContent = section?.pages ?? [];
    path += `/${slug}`;
  }

  // Undo any data massaging we did before building the breadcrumbs
  if (paths[0] === "security") {
    paths.shift();
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

const flattenPages = (pages: any[], path: string): SidebarPage[] => {
  let flatPages: SidebarPage[] = [];

  for (const page of pages) {
    if (page.pages) {
      flatPages = flatPages.concat(flattenPages(page.pages, path + page.slug));
    } else {
      flatPages.push({
        title: page.title,
        slug: page.slug,
        path: page.slug === "/security" ? page.slug : path + page.slug,
      });
    }
  }

  return flatPages;
};
