import React, { useEffect } from "react";
import { Page } from "@/components/ui/Page";
import { slugToPaths } from "../lib/content";
import Meta from "../components/Meta";
import { useRouter } from "next/router";
import { useInitialScrollState } from "../components/ui/Page/helpers";
import { CLI_SIDEBAR } from "../data/sidebars/cliSidebar";
import { ContentActions } from "../components/ui/ContentActions";

export const CliReferenceLayout = ({ frontMatter, children }) => {
  const router = useRouter();
  useInitialScrollState();
  let paths = slugToPaths(router.query.slug);

  useEffect(() => {
    const content = document.querySelector(".main-content");

    // Right now we need this hack to ensure that we scroll the main content to
    // the top of the view when navigating.
    if (content) {
      content.scrollTop = 0;
    }
  }, [paths]);

  return (
    <Page.Container>
      <Meta
        title={`${frontMatter.title} | Knock Docs`}
        description={frontMatter.description}
        canonical="/cli"
      />
      <Page.Masthead
        title={frontMatter.title}
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
              <ContentActions showOnMobile style={{ marginLeft: "-6px" }} />
            }
          />
          <Page.ContentBody>{children}</Page.ContentBody>
        </Page.Content>
      </Page.Wrapper>
    </Page.Container>
  );
};
