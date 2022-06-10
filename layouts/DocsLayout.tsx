import React, { useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { Page } from "./Page";
import PageNav from "../components/PageNav";
import Breadcrumbs from "../components/Breadcrumbs";
import sidebarContent from "../data/sidebar";
import DocsSidebar from "../components/DocsSidebar";

export const DocsLayout = ({ frontMatter, children }) => {
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
      sidebar={<DocsSidebar />}
      metaProps={{
        title: `${frontMatter.title} | Knock Docs`,
        description: frontMatter.description,
      }}
    >
      <div className="w-full max-w-5xl lg:flex mx-auto relative">
        <div className="max-w-prose flex-auto">
          {section && <Breadcrumbs section={section} pages={pages} />}

          <h1 className="font-bold text-2xl lg:text-4xl mb-4">
            {frontMatter.title}
          </h1>
          <div className="docs-content prose-sm lg:prose">{children}</div>
          {(prevPage || nextPage) && (
            <div className="flex border-t mt-8 pt-8 text-sm">
              {prevPage && !("pages" in prevPage) && (
                <div className="text-left">
                  <Link href={section.slug + prevPage.slug}>
                    <a className="text-gray-500 hover:text-gray-800">
                      ← {prevPage.title}
                    </a>
                  </Link>
                </div>
              )}

              {nextPage && !("pages" in nextPage) && (
                <div className="ml-auto text-right">
                  <Link
                    href={
                      nextPage.slug === "/security"
                        ? nextPage.slug
                        : section.slug + nextPage.slug
                    }
                  >
                    <a className="text-gray-500 hover:text-gray-800">
                      {nextPage.title} →
                    </a>
                  </Link>
                </div>
              )}
            </div>
          )}
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
