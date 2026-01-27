import React from "react";
import { Page } from "@/components/ui/Page";
import { slugToPaths } from "../lib/content";
import Meta from "../components/Meta";
import { useRouter } from "next/router";
import { useInitialScrollState } from "../components/ui/Page/helpers";
import { CLI_SIDEBAR } from "../data/sidebars/cliSidebar";
import { ContentActions } from "../components/ui/ContentActions";
import { useScrollToTop } from "../hooks/useScrollToTop";

export const CliReferenceLayout = ({ frontMatter, children }) => {
  const router = useRouter();
  useInitialScrollState();
  let paths = slugToPaths(router.query.slug);

  useScrollToTop(paths);

  return (
    <Page.Container>
      <Meta
        title={`${frontMatter.metaTitle ?? frontMatter.title} | Knock Docs`}
        description={frontMatter.metaDescription ?? frontMatter.description}
        canonical="/cli"
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
              <ContentActions showOnMobile style={{ marginLeft: "-6px" }} />
            }
          />
          <Page.ContentBody>{children}</Page.ContentBody>
        </Page.Content>
      </Page.Wrapper>
    </Page.Container>
  );
};
