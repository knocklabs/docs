import { SidebarPage, SidebarSection } from "../data/types";

// Returns the breadcrumbs and adjacent pages in the sidebar given a path
export const getSidebarInfo = (
  paths: string[],
  sidebarContent: SidebarSection[],
) => {
  const pages: SidebarPage[] = [];
  let prevPage: SidebarPage | undefined = undefined;
  let nextPage: SidebarPage | undefined = undefined;

  let currSidebarContent: any = sidebarContent;
  let prevSidebarContent: any = sidebarContent;
  let currPath = "";
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];

    const sectionIndex = currSidebarContent.findIndex(
      (s) => s.slug === `/${path}`,
    );
    const section = currSidebarContent[sectionIndex];

    // On the last path, find the previous and next page
    // TODO: handle navigating across section boundaries
    if (i === paths.length - 1) {
      // Get previous page
      if (sectionIndex > 0) {
        // Handle simple case of getting the previous item in the same section
        prevPage = currSidebarContent[sectionIndex - 1];
        if (prevPage) {
          prevPage.path = currPath + prevPage?.slug;
        }
      } else {
        // If at the first item in a section, go up and to the previous section, then get the last item
        console.log({ prevSidebarContent, currSidebarContent });
      }

      if (sectionIndex < currSidebarContent.length - 1) {
        nextPage = currSidebarContent[sectionIndex + 1];
        if (nextPage) {
          nextPage.path = currPath + nextPage?.slug;
        }
      }
    }

    currPath += `/${path}`;
    prevSidebarContent = currSidebarContent;
    currSidebarContent = section.pages;

    pages.push({
      slug: path,
      title: section?.title,
      path: currPath,
    });
  }

  console.log({ pages, nextPage, prevPage });

  return {
    pages,
    prevPage,
    nextPage,
  };
};
