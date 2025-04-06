import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Page } from "./Page";
import PageNav from "../components/PageNav";
import Breadcrumbs from "../components/Breadcrumbs";
import sidebarContent from "../data/sidebar";
import DocsSidebar from "../components/DocsSidebar";
import Meta from "../components/Meta";
import { getSidebarInfo, slugToPaths } from "../lib/content";
import MinimalHeader from "../components/Header/MinimalHeader";
import ContentActions from "../components/ContentActions";

const DocsLayout = ({ frontMatter, sourcePath, children }) => {
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

  const { breadcrumbs, nextPage, prevPage } = useMemo(
    () => getSidebarInfo(paths, sidebarContent),
    [paths],
  );

  return (
    <Page header={<MinimalHeader pageType="Docs" />} sidebar={<DocsSidebar />}>
      <Meta
        title={`${frontMatter.title} | Knock Docs`}
        description={frontMatter.description}
      />
      <div className="w-full max-w-5xl lg:flex mx-auto relative">
        <div className="max-w-prose flex-auto">
          {breadcrumbs && <Breadcrumbs pages={breadcrumbs} />}

          <header className="mb-6 pb-6 border-b dark:border-b-gray-800 relative">
            <div className="absolute right-0 top-0">
              <ContentActions sourcePath={sourcePath} />
            </div>
            <div className="pr-[120px] md:pr-0">
              <h1 className="font-semibold text-2xl lg:text-4xl mb-2">
                {frontMatter.title}
              </h1>
              <div className="text-[18px] text-gray-600 dark:text-gray-300 max-w-[640px]">
                {frontMatter.description}
              </div>
            </div>
          </header>

          <div className="docs-content prose-sm lg:prose dark:prose-invert">
            {children}
          </div>
          {(prevPage || nextPage) && (
            <div className="flex border-t dark:border-t-gray-700 mt-8 pt-8 text-sm">
              {prevPage?.path && !("pages" in prevPage) && (
                <div className="text-left">
                  <Link
                    href={prevPage.path}
                    className="text-gray-500 hover:text-gray-800"
                  >
                    ←{prevPage.title}
                  </Link>
                </div>
              )}

              {nextPage?.path && !("pages" in nextPage) && (
                <div className="ml-auto text-right">
                  <Link
                    href={nextPage.path}
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
            <PageNav title={frontMatter.title} sourcePath={sourcePath} />
          )}
        </div>
      </div>
    </Page>
  );
};

export { DocsLayout };
