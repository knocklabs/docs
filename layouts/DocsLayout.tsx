import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Page } from "./Page";
import PageNav from "../components/PageNav";
import Breadcrumbs from "../components/Breadcrumbs";
import sidebarContent from "../data/sidebar";
import DocsSidebar from "../components/DocsSidebar";
import Meta from "../components/Meta";

const DocsLayout = ({ frontMatter, children }) => {
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

  const { section, pages, nextPage, prevPage } = useMemo(() => {
    const [sectionPath] = paths;
    const sectionIndex = sidebarContent.findIndex(
      (s) => s.slug === `/${sectionPath}`,
    );

    const sidebarSection = sidebarContent[sectionIndex];
    const pageIndex = (sidebarContent[sectionIndex]?.pages || []).findIndex(
      (p) => sidebarSection.slug + p.slug === asPath,
    );

    const sidebarPage = sidebarSection?.pages[pageIndex];

    return {
      section: sidebarSection,
      pages: [sidebarPage],
      nextPage: sidebarSection?.pages[pageIndex + 1],
      prevPage: sidebarSection?.pages[pageIndex - 1],
    };
  }, [paths, asPath]);

  return (
    <>
      <Meta
        title={`${frontMatter.title} | Knock Docs`}
        description={frontMatter.description}
      />
      <div className="w-full max-w-5xl lg:flex mx-auto relative">
        <div className="max-w-prose flex-auto">
          {section && <Breadcrumbs section={section} pages={pages} />}

          <header className="mb-6 pb-6 border-b dark:border-b-gray-800">
            <h1 className="font-semibold text-2xl lg:text-4xl mb-2">
              {frontMatter.title}
            </h1>
            <div className="text-[18px] text-gray-600 dark:text-gray-300">
              {frontMatter.description}
            </div>
          </header>

          <div className="docs-content prose-sm lg:prose dark:prose-invert">
            {children}
          </div>
          {(prevPage || nextPage) && (
            <div className="flex border-t dark:border-t-gray-700 mt-8 pt-8 text-sm">
              {prevPage && !("pages" in prevPage) && (
                <div className="text-left">
                  <Link
                    href={section.slug + prevPage.slug}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    ←{prevPage.title}
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
                    className="text-gray-500 hover:text-gray-80"
                  >
                    {nextPage.title}→
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
    </>
  );
};

DocsLayout.getLayout = (page) => (
  <Page pageType="Docs" sidebar={<DocsSidebar />}>
    {page}
  </Page>
);

export { DocsLayout };
