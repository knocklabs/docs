import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Page } from "@/components/ui/Page";
import { Sidebar } from "@/components/ui/Page/Sidebar";
import { mainContent, sdkSpecificContent } from "../data/inAppSidebar";
import Meta from "../components/Meta";
import { getSidebarInfo, slugToPaths } from "../lib/content";
import { Box } from "@telegraph/layout";
import { Stack } from "@telegraph/layout";
import { MenuItem } from "@telegraph/menu";
import { Text } from "@telegraph/typography";

const InAppUILayout = ({ frontMatter, sourcePath, children }) => {
  const router = useRouter();
  const paths = slugToPaths(router.query.slug);
  const selectedSdk = "react";

  useEffect(() => {
    const content = document.querySelector(".main-content");

    // Right now we need this hack to ensure that we scroll the main content to
    // the top of the view when navigating.
    if (content) {
      content.scrollTop = 0;
    }
  }, [paths]);

  // const { breadcrumbs, nextPage, prevPage } = useMemo(
  //   () => getSidebarInfo(paths, inAppUiContent),
  //   [paths, inAppUiContent],
  // );

  return (
    <Page.Container>
      <Meta
        title={`${frontMatter.title} | Knock Docs`}
        description={frontMatter.description}
      />
      <Page.Masthead title={frontMatter.title} />
      <Page.Wrapper>
        <Sidebar.Wrapper>
          {mainContent.map((section) => (
            <Sidebar.Section key={section.slug} section={section} />
          ))}
          {sdkSpecificContent[selectedSdk].map((section) => (
            <Sidebar.Section key={section.slug} section={section} />
          ))}
        </Sidebar.Wrapper>
        <Page.Content>
          <Page.ContentHeader
            title={frontMatter.title}
            description={frontMatter.description}
          />
          <Page.ContentBody>{children}</Page.ContentBody>
        </Page.Content>
        {frontMatter.showNav !== false && (
          <Page.OnThisPage title={frontMatter.title} sourcePath={sourcePath} />
        )}
      </Page.Wrapper>
    </Page.Container>
  );
};

export default InAppUILayout;
