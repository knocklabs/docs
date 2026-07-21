import React, { useMemo } from "react";
import { useRouter } from "next/router";
import {
  INTEGRATIONS_SIDEBAR,
  parentSection,
} from "../data/sidebars/integrationsSidebar";
import Meta from "../components/Meta";
import { getPathsFromRouter, getSidebarInfo } from "../lib/content";
import { Page } from "@/components/ui/Page";
import { useScrollToTop } from "../hooks/useScrollToTop";

const IntegrationsLayout = ({ frontMatter, sourcePath, children }) => {
  const router = useRouter();
  const pathKey = router.asPath.split("#")[0].split("?")[0];
  const paths = getPathsFromRouter({ asPath: pathKey });

  useScrollToTop(paths);

  const { breadcrumbs, nextPage, prevPage } = useMemo(() => {
    // Merge the first two path segments for all pages but the integrations overview
    // so that the paths match the slugs in the integrations sidebar content.
    //
    // For example, the Sources > Segment page has the following router slug:
    // ['integrations', 'sources', 'segment'] which needs to become
    // ['integrations/sources', 'segment'] so that it matches the sidebar content
    const pathSegments = getPathsFromRouter({ asPath: pathKey });
    let sidebarPaths = pathSegments;
    if (pathSegments.length > 2) {
      sidebarPaths = [
        `${pathSegments[0]}/${pathSegments[1]}`,
        ...pathSegments.slice(2),
      ];
    }

    return getSidebarInfo(sidebarPaths, INTEGRATIONS_SIDEBAR, parentSection);
  }, [pathKey]);

  return (
    <Page.Container>
      <Meta
        title={`${frontMatter.metaTitle ?? frontMatter.title} | Knock Docs`}
        description={frontMatter.metaDescription ?? frontMatter.description}
      />
      <Page.Masthead
        mobileSidebar={<Page.MobileSidebar content={INTEGRATIONS_SIDEBAR} />}
      />
      <Page.Wrapper>
        <Page.FullSidebar content={INTEGRATIONS_SIDEBAR}></Page.FullSidebar>
        <Page.Content>
          <Page.TopContainer>
            {breadcrumbs && <Page.Breadcrumbs pages={breadcrumbs} />}
            <Page.ContentActions />
          </Page.TopContainer>
          <Page.ContentHeader
            title={frontMatter.title}
            description={frontMatter.description}
          />
          <Page.ContentBody>{children}</Page.ContentBody>
          <Page.ContentFooter nextPage={nextPage} previousPage={prevPage} />
        </Page.Content>
        {frontMatter.showNav !== false && (
          <Page.OnThisPage title={frontMatter.title} sourcePath={sourcePath} />
        )}
      </Page.Wrapper>
    </Page.Container>
  );
};

export { IntegrationsLayout };
