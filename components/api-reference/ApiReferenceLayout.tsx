import { useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import Meta from "@/components/Meta";
import { Page as TelegraphPage } from "@/components/ui/Page";
import { Sidebar, SidebarContext } from "@/components/ui/Page/Sidebar";
import { ContentActions } from "@/components/ui/ContentActions";
import { SidebarData, SidebarSection } from "@/lib/openApiSpec";
import { SidebarSection as LegacySidebarSection } from "@/data/types";

interface Breadcrumb {
  label: string;
  href: string;
}

type PageNeighbor = {
  title: string;
  path: string;
  slug: string;
};

interface ApiReferenceLayoutProps {
  children: React.ReactNode;
  sidebarData: SidebarData;
  preSidebarContent?: LegacySidebarSection[];
  title: string;
  description: string;
  breadcrumbs?: Breadcrumb[];
  currentPath?: string;
}

/**
 * Convert new SidebarData format to legacy SidebarSection format
 * used by the existing Page components.
 */
function convertToLegacySidebarFormat(
  sidebarData: SidebarData,
  preSidebarContent: LegacySidebarSection[] = [],
): LegacySidebarSection[] {
  const resourceSections: LegacySidebarSection[] = sidebarData.resources.map(
    (resource: SidebarSection) => ({
      title: resource.title,
      slug: resource.slug,
      pages: [
        { slug: "/", title: "Overview" },
        ...resource.pages.map((page) => ({
          slug: page.slug.replace(resource.slug, ""),
          title: page.title,
          // subPage slugs need to be relative to their parent page, not the resource
          pages: page.pages?.map((subPage) => ({
            slug: subPage.slug.replace(page.slug, ""),
            title: subPage.title,
          })),
        })),
      ],
    }),
  );

  return [...preSidebarContent, ...resourceSections];
}

/**
 * Get the previous and next sections based on the current path.
 * Sections are the top-level items in the sidebar (overview + resources).
 */
function getSectionNavigation(
  currentPath: string | undefined,
  sidebarContent: LegacySidebarSection[],
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
      title: prev.title || "",
      path: prev.slug,
      slug: prev.slug,
    };
  }

  // Get next section
  if (currentSectionIndex < sidebarContent.length - 1) {
    const next = sidebarContent[currentSectionIndex + 1];
    nextSection = {
      title: next.title || "",
      path: next.slug,
      slug: next.slug,
    };
  }

  return { prevSection, nextSection };
}

export function ApiReferenceLayout({
  children,
  sidebarData,
  preSidebarContent = [],
  title,
  description,
  breadcrumbs,
  currentPath,
}: ApiReferenceLayoutProps) {
  const router = useRouter();
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefetch = router.prefetch;
    router.prefetch = async () => {};

    return () => {
      router.prefetch = prefetch;
    };
  }, [router]);

  const basePath = router.pathname.split("/")[1];
  const canonicalPath = currentPath || `/${basePath}`;

  const sidebarContent = convertToLegacySidebarFormat(
    sidebarData,
    preSidebarContent,
  );

  // Get section navigation (prev/next sections)
  const { prevSection, nextSection } = useMemo(
    () => getSectionNavigation(currentPath, sidebarContent),
    [currentPath, sidebarContent],
  );

  // For per-resource pages, currentPath is the resource base path (e.g., /api-reference/users)
  // This enables same-page routing for links within the current resource
  const sidebarContextValue = {
    samePageRouting: true,
    currentResourcePath: currentPath,
  };

  return (
    <TelegraphPage.Container>
      <Meta
        title={`${title} | Knock Docs`}
        description={description}
        canonical={canonicalPath}
      />
      <TelegraphPage.Masthead
        mobileSidebar={
          <SidebarContext.Provider value={sidebarContextValue}>
            <TelegraphPage.MobileSidebar
              samePageRouting
              content={sidebarContent}
            />
          </SidebarContext.Provider>
        }
      />
      <TelegraphPage.Wrapper>
        <SidebarContext.Provider value={sidebarContextValue}>
          <Sidebar.FullLayout scrollerRef={scrollerRef}>
            <Sidebar.ScrollContainer scrollerRef={scrollerRef}>
              {sidebarContent.map((section) => (
                <Sidebar.Section key={section.slug} section={section} />
              ))}
            </Sidebar.ScrollContainer>
          </Sidebar.FullLayout>
        </SidebarContext.Provider>
        <TelegraphPage.Content>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <TelegraphPage.Breadcrumbs items={breadcrumbs} />
          )}
          <TelegraphPage.ContentHeader
            title={title}
            description={description}
            bottomContent={
              <ContentActions
                showOnMobile
                style={{ marginLeft: "-6px" }}
                mdPath={currentPath ? `${currentPath}.md` : undefined}
              />
            }
          />
          <TelegraphPage.ContentBody>{children}</TelegraphPage.ContentBody>
          <TelegraphPage.ContentFooter
            nextPage={nextSection}
            previousPage={prevSection}
          />
        </TelegraphPage.Content>
      </TelegraphPage.Wrapper>
    </TelegraphPage.Container>
  );
}

export default ApiReferenceLayout;
