import { useRef } from "react";
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

  const basePath = router.pathname.split("/")[1];
  const canonicalPath = currentPath || `/${basePath}`;

  const sidebarContent = convertToLegacySidebarFormat(
    sidebarData,
    preSidebarContent,
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
              <ContentActions showOnMobile style={{ marginLeft: "-6px" }} />
            }
          />
          <TelegraphPage.ContentBody>{children}</TelegraphPage.ContentBody>
        </TelegraphPage.Content>
      </TelegraphPage.Wrapper>
    </TelegraphPage.Container>
  );
}

export default ApiReferenceLayout;
