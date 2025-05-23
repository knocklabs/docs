import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { INTEGRATIONS_SIDEBAR } from "../data/sidebars/integrationsSidebar";
import Meta from "../components/Meta";
import { getSidebarInfo, slugToPaths } from "../lib/content";
import { Page } from "@/components/ui/Page";

const IntegrationsLayout = ({ frontMatter, sourcePath, children }) => {
  const router = useRouter();
  let paths = slugToPaths(router.query.slug);

  useEffect(() => {
    const content = document.querySelector(".main-content");

    // Right now we need this hack to ensure that we scroll the main content to
    // the top of the view when navigating.
    if (content) {
      content.scrollTop = 0;
    }
  }, [paths]);

  const { breadcrumbs, nextPage, prevPage } = useMemo(() => {
    // Merge the first two path segments for all pages but the integrations overview
    // so that the paths match the slugs in the integrations sidebar content.
    //
    // For example, the Sources > Segment page has the following router slug:
    // ['integrations', 'sources', 'segment'] which needs to become
    // ['integrations/sources', 'segment'] so that it matches the sidebar content
    let sidebarPaths = paths;
    if (paths.length > 2) {
      sidebarPaths = [`${paths[0]}/${paths[1]}`, ...paths.slice(2)];
    }

    return getSidebarInfo(sidebarPaths, INTEGRATIONS_SIDEBAR);
  }, [paths]);

  return (
    <Page.Container>
      <Meta
        title={`${frontMatter.title} | Knock Docs`}
        description={frontMatter.description}
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
