import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Page } from "./Page";
import PageNav from "../components/PageNav";
import Breadcrumbs from "../components/Breadcrumbs";
import sidebarContent from "../data/sidebar";
import IntegrationsSidebar from "../components/IntegrationsSidebar";

export const IntegrationsLayout = ({ frontMatter, children }) => {
  const { pathname } = useRouter();
  const paths = useMemo(() => pathname.substring(1).split("/"), [pathname]);

  const { section, pages, nextPage, prevPage } = useMemo(() => {
    const [sectionPath] = paths;
    const sectionIndex = sidebarContent.findIndex(
      (s) => s.slug === `/${sectionPath}`,
    );

    const sidebarSection = sidebarContent[sectionIndex];
    const pageIndex = (sidebarContent[sectionIndex]?.pages || []).findIndex(
      (p) => sidebarSection.slug + p.slug === pathname,
    );

    const sidebarPage = sidebarSection?.pages[pageIndex];

    return {
      section: sidebarSection,
      pages: [sidebarPage],
      nextPage: sidebarSection?.pages[pageIndex + 1],
      prevPage: sidebarSection?.pages[pageIndex - 1],
    };
  }, [paths, pathname]);

  return (
    <Page
      pageType="Docs"
      sidebar={<IntegrationsSidebar />}
      metaProps={{
        title: `${frontMatter.title} | Knock Docs`,
        description: frontMatter.description,
      }}
    >
      <div className="w-full max-w-5xl lg:flex mx-auto relative">
        <div className="max-w-prose flex-auto">
          {section && <Breadcrumbs section={section} pages={pages} />}

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
    </Page>
  );
};
