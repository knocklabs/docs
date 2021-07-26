import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Page } from "./Page";
import Breadcrumbs from "../components/Breadcrumbs";
import sidebarContent from "../data/sidebar";

export const ApiReferenceLayout = ({ frontMatter, children }) => {
  const { asPath: pathname } = useRouter();
  const { section, page } = useMemo(() => {
    const sectionIndex = sidebarContent.findIndex((s) =>
      s.pages.find((p) => s.slug + p.slug === pathname),
    );
    const sidebarSection = sidebarContent[sectionIndex];
    const pageIndex = (sidebarContent[sectionIndex]?.pages || []).findIndex(
      (p) => sidebarSection.slug + p.slug === pathname,
    );

    const sidebarPage = sidebarSection?.pages[pageIndex];

    return {
      section: sidebarSection,
      page: sidebarPage,
      nextPage: sidebarSection?.pages[pageIndex + 1],
      prevPage: sidebarSection?.pages[pageIndex - 1],
    };
  }, [pathname]);

  return (
    <Page>
      <Head>
        <title>{frontMatter.title} | Knock Docs</title>
      </Head>
      <div className="w-full max-w-5xl lg:flex mx-auto relative">
        <div className="overflow-x-hidden flex-auto">
          {section && page && <Breadcrumbs section={section} page={page} />}
          <div className="docs-content api-docs-content">{children}</div>
        </div>
      </div>
    </Page>
  );
};
