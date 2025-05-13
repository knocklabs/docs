import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Page } from "../components/ui/Page";
import { useSidebarContent } from "../hooks/useSidebarContent";

import Meta from "../components/Meta";
import { getSidebarInfo, slugToPaths } from "../lib/content";
import { Box } from "@telegraph/layout";

const DocsLayout = ({ frontMatter, sourcePath, children }) => {
  const router = useRouter();
  const paths = slugToPaths(router.query.slug);

  const sidebarContent = useSidebarContent();

  const { breadcrumbs, nextPage, prevPage } = useMemo(
    () => getSidebarInfo(paths, sidebarContent),
    [paths, sidebarContent],
  );

  return (
    <Page.Container>
      <Meta
        title={`${frontMatter.title} | Knock Docs`}
        description={frontMatter.description}
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
