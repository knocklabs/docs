import React from "react";
import { Page } from "@/components/ui/Page";
import { slugToPaths } from "../lib/content";
import Meta from "../components/Meta";
import { useRouter } from "next/router";
import { useInitialScrollState } from "../components/ui/Page/helpers";
import { CLI_SIDEBAR } from "../data/sidebars/cliSidebar";
import { ContentActions } from "../components/ui/ContentActions";
import { useScrollToTop } from "../hooks/useScrollToTop";

interface CliReferenceLayoutProps {
  frontMatter: {
    title?: string;
    metaTitle?: string;
    description?: string;
    metaDescription?: string;
  };
  sourcePath?: string;
  children: React.ReactNode;
}

export const CliReferenceLayout = ({
  frontMatter,
  children,
}: CliReferenceLayoutProps) => {
  const router = useRouter();
  useInitialScrollState();
  let paths = slugToPaths(router.query.slug);

  useScrollToTop(paths);

  // Build canonical path from the current route
  const canonicalPath = router.asPath.split("#")[0].split("?")[0];

  return (
    <Page.Container>
      <Meta
        title={`${frontMatter.metaTitle ?? frontMatter.title} | Knock Docs`}
        description={frontMatter.metaDescription ?? frontMatter.description}
        canonical={canonicalPath}
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
