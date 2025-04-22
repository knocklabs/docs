import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Page } from "../components/ui/Page";
import sidebarContent from "../data/sidebar";
import {
  guidesContent,
  developerToolsContent,
  inAppUiContent,
} from "../data/sidebar";
import apiReferenceSidebar from "../data/apiReferenceSidebar";
import Meta from "../components/Meta";
import { getSidebarInfo, slugToPaths } from "../lib/content";

function useSidebarContent() {
  const { asPath } = useRouter();
  if (asPath.startsWith("/guides")) {
    return guidesContent;
  }
  if (asPath.startsWith("/developer-tools")) {
    return developerToolsContent;
  }
  if (asPath.startsWith("/in-app-ui")) {
    return inAppUiContent;
  }
  if (asPath.startsWith("/reference")) {
    return apiReferenceSidebar;
  }
  return sidebarContent;
}

export const ApiReferenceLayout = ({ frontMatter, sourcePath, children }) => {
  const router = useRouter();
  const paths = slugToPaths(router.query.slug);

  useEffect(() => {
    const content = document.querySelector(".main-content");

    // Right now we need this hack to ensure that we scroll the main content to
    // the top of the view when navigating.
    if (content) {
      content.scrollTop = 0;
    }
  }, [paths]);

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
      <Page.Masthead title={frontMatter.title} />
      <Page.Wrapper>
        <Page.Sidebar content={sidebarContent} />
        <Page.Content maxWidth="1400px">
          {breadcrumbs && <Page.Breadcrumbs pages={breadcrumbs} />}
          <Page.ContentHeader
            title={frontMatter.title}
            description={frontMatter.description}
          />
          <Page.ContentBody maxWidth="lg">{children}</Page.ContentBody>
        </Page.Content>
        {frontMatter.showNav !== false && (
          <Page.OnThisPage title={frontMatter.title} sourcePath={sourcePath} />
        )}
      </Page.Wrapper>
    </Page.Container>
  );
};
