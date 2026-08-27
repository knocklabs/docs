import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { Page } from "../components/ui/Page";
import { useSidebarContent } from "../hooks/useSidebarContent";

import Meta from "../components/Meta";
import { getPathsFromRouter, getSidebarInfo } from "../lib/content";
import { Box } from "@telegraph/layout";

const DocsLayout = ({ frontMatter, sourcePath, children }) => {
  const router = useRouter();
  // Key off asPath so client-side navigations recompute adjacent pages.
  // Do not use router.query.slug here (KNO-14307).
  const pathKey = router.asPath.split("#")[0].split("?")[0];

  const { content: sidebarContent, parentSection } = useSidebarContent();

  const { breadcrumbs, nextPage, prevPage } = useMemo(() => {
    const paths = getPathsFromRouter({ asPath: pathKey });
    return getSidebarInfo(paths, sidebarContent, parentSection);
  }, [pathKey, sidebarContent, parentSection]);

  return (
    <Page.Container>
      <Meta
        title={`${frontMatter.metaTitle ?? frontMatter.title} | Knock Docs`}
        description={frontMatter.metaDescription ?? frontMatter.description}
      />
      <Page.Masthead
        mobileSidebar={<Page.MobileSidebar content={sidebarContent} />}
      />
      <Page.Wrapper>
        <Box className="md-hidden" position="relative" h="full" w="full">
          <Page.FullSidebar content={sidebarContent} />
        </Box>
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

export { DocsLayout };
