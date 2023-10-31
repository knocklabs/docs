import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Page } from "./Page";
import PageNav from "../components/PageNav";
import Breadcrumbs from "../components/Breadcrumbs";
import sidebarContent from "../data/integrationsSidebar";
import IntegrationsSidebar from "../components/IntegrationsSidebar";
import Meta from "../components/Meta";
import { SidebarPage, SidebarSection } from "../data/types";

const IntegrationsLayout = ({ frontMatter, children }) => {
  const { asPath } = useRouter();
  const paths = useMemo(() => asPath.substring(1).split("/"), [asPath]);

  useEffect(() => {
    const content = document.querySelector(".main-content");

    // Right now we need this hack to ensure that we scroll the main content to
    // the top of the view when navigating.
    if (content) {
      content.scrollTop = 0;
    }
  }, [asPath]);

  const pages = useMemo(() => {
    const [sectionPath] = paths;
    const sectionIndex = sidebarContent.findIndex(
      (s) => s.slug === `/${sectionPath}`,
    );

    const sidebarSection = sidebarContent[sectionIndex];
    const pages: (SidebarSection | SidebarPage)[] = [sidebarSection];
    const pageIndex = (sidebarContent[sectionIndex]?.pages || []).findIndex(
      (p) => sidebarSection.slug + p.slug === asPath,
    );

    const sidebarPage = sidebarSection?.pages[pageIndex];
    if (sidebarPage) {
      pages.push(sidebarPage);
    }

    return pages;
  }, [paths, asPath]);

  return (
    <>
      <Meta
        title={`${frontMatter.title} | Knock Docs`}
        description={frontMatter.description}
      />
      <div className="w-full max-w-5xl lg:flex mx-auto relative">
        <div className="max-w-prose flex-auto">
          {pages && <Breadcrumbs pages={pages} />}

          <h1 className="font-semibold text-2xl lg:text-4xl mb-4">
            {frontMatter.title}
          </h1>
          <div className="docs-content prose-sm lg:prose dark:prose-invert">
            {children}
          </div>
        </div>

        <div className="hidden xl:text-sm xl:block flex-none w-64 ml-auto relative">
          {frontMatter.showNav !== false && (
            <PageNav title={frontMatter.title} />
          )}
        </div>
      </div>
    </>
  );
};

IntegrationsLayout.getLayout = (page) => (
  <Page pageType="Docs" sidebar={<IntegrationsSidebar />}>
    {page}
  </Page>
);

export { IntegrationsLayout };
