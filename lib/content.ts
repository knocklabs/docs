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
  let indexes: number[] = [];

  // Iterate over each segment of the path and traverse the sidebar
  for (let i = 0; i < paths.length; i++) {
    const slug = paths[i];

    // Continue traversing sidebar to find page
    const index = sidebarContent.findIndex((s) => s.slug === `/${slug}`);
    const section = sidebarContent[index];

    breadcrumbs.push({
      slug,
      title: section?.title ?? "",
      path: path + `/${slug}`,
    });

    if (i === paths.length - 1) {
      // TODO: Handle skipping across sections to get previous / next
      if (index > 0) {
        prevPage = sidebarContent[index - 1];
        if (prevPage) {
          prevPage.path = path + prevPage.slug;
        }
      }

      if (index < sidebarContent.length - 1) {
        nextPage = sidebarContent[index + 1];
        if (nextPage) {
          nextPage.path = path + nextPage.slug;
        }
      }
    }

    // Update temporary variables for the next segment search
    sidebarContent = section.pages ?? [];
    indexes.push(index);
    path += `/${slug}`;
  }

  return {
    breadcrumbs,
    prevPage,
    nextPage,
  };
};
