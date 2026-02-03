import React, { useMemo } from "react";
import { Page } from "@/components/ui/Page";
import { slugToPaths } from "../lib/content";
import Meta from "../components/Meta";
import { useRouter } from "next/router";
import { useInitialScrollState } from "../components/ui/Page/helpers";
import { CLI_SIDEBAR } from "../data/sidebars/cliSidebar";
import { ContentActions } from "../components/ui/ContentActions";
import { useScrollToTop } from "../hooks/useScrollToTop";
import { SidebarContent } from "../data/types";

type PageNeighbor = {
  title: string;
  path: string;
  slug: string;
};

/**
 * Get the previous and next sections based on the current path.
 * Sections are the top-level items in the CLI sidebar.
 */
function getSectionNavigation(
  currentPath: string | undefined,
  sidebarContent: SidebarContent[],
): { prevSection: PageNeighbor | undefined; nextSection: PageNeighbor | undefined } {
  if (!currentPath) {
    return { prevSection: undefined, nextSection: undefined };
  }

  // Find which section the current path belongs to
  const currentSectionIndex = sidebarContent.findIndex((section) => {
    return currentPath.startsWith(section.slug);
  });

  if (currentSectionIndex === -1) {
    return { prevSection: undefined, nextSection: undefined };
  }

  let prevSection: PageNeighbor | undefined = undefined;
  let nextSection: PageNeighbor | undefined = undefined;

  // Get previous section
  if (currentSectionIndex > 0) {
    const prev = sidebarContent[currentSectionIndex - 1];
    prevSection = {
      title: prev.title,
      path: prev.slug,
      slug: prev.slug,
    };
  }

  // Get next section
  if (currentSectionIndex < sidebarContent.length - 1) {
    const next = sidebarContent[currentSectionIndex + 1];
    nextSection = {
      title: next.title,
      path: next.slug,
      slug: next.slug,
    };
  }

  return { prevSection, nextSection };
}

interface CliReferenceLayoutProps {
  frontMatter: {
    title?: string;
    metaTitle?: string;
    description?: string;
    metaDescription?: string;
  };
  sourcePath?: string;
  children: React.ReactNode;
}

export const CliReferenceLayout = ({
  frontMatter,
  children,
}: CliReferenceLayoutProps) => {
  const router = useRouter();
  useInitialScrollState();
  let paths = slugToPaths(router.query.slug);

  useScrollToTop(paths);

  // Build canonical path from the current route
  const canonicalPath = router.asPath.split("#")[0].split("?")[0];

  // Get the resource name from the route (e.g., "overview", "resources", "workflow")
  // This is the first segment after /cli/ and stays constant regardless of scroll position
  const resource = router.query.resource as string;
  const mdPath = resource ? `/cli/${resource}.md` : undefined;

  // Build the current section path for navigation
  const currentSectionPath = resource ? `/cli/${resource}` : "/cli/overview";

  // Get section navigation (prev/next sections)
  const { prevSection, nextSection } = useMemo(
    () => getSectionNavigation(currentSectionPath, CLI_SIDEBAR),
    [currentSectionPath],
  );

  return (
    <Page.Container>
      <Meta
        title={`${frontMatter.metaTitle ?? frontMatter.title} | Knock Docs`}
        description={frontMatter.metaDescription ?? frontMatter.description}
        canonical={canonicalPath}
      />
      <Page.Masthead
        mobileSidebar={
          <Page.MobileSidebar content={CLI_SIDEBAR} samePageRouting />
        }
      />
      <Page.Wrapper>
        <Page.FullSidebar content={CLI_SIDEBAR} samePageRouting />
        <Page.Content fullWidth>
          <Page.ContentHeader
            title={frontMatter.title}
            description={frontMatter.description}
            bottomContent={
              <ContentActions
                showOnMobile
                style={{ marginLeft: "-6px" }}
                mdPath={mdPath}
              />
            }
          />
          <Page.ContentBody>{children}</Page.ContentBody>
          <Page.ContentFooter
            nextPage={nextSection}
            previousPage={prevSection}
          />
        </Page.Content>
      </Page.Wrapper>
    </Page.Container>
  );
};
