import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Page } from "./Page";
import PageNav from "../components/PageNav";
import Breadcrumbs from "../components/Breadcrumbs";
import sidebarContent from "../data/integrationsSidebar";
import IntegrationsSidebar from "../components/IntegrationsSidebar";
import Meta from "../components/Meta";
import { getSidebarInfo, slugToPaths } from "../lib/content";
import Link from "next/link";

const IntegrationsLayout = ({ frontMatter, children }) => {
  const router = useRouter();
  let paths = slugToPaths(router.query.slug);

  useEffect(() => {
    const content = document.querySelector(".main-content");

    // Right now we need this hack to ensure that we scroll the main content to
    // the top of the view when navigating.
    if (content) {
      content.scrollTop = 0;
    }
  }, [paths]);

  const { breadcrumbs, nextPage, prevPage } = useMemo(() => {
    // Merge the first two path segments for all pages but the integrations overview
    // so that the paths match the slugs in the integrations sidebar content.
    //
    // For example, the Sources > Segment page has the following router slug:
    // ['integrations', 'sources', 'segment'] which needs to become
    // ['integrations/sources', 'segment'] so that it matches the sidebar content
    let sidebarPaths = paths;
    if (paths.length > 2) {
      sidebarPaths = [`${paths[0]}/${paths[1]}`, ...paths.slice(2)];
    }

    return getSidebarInfo(sidebarPaths, sidebarContent);
  }, [paths]);

  return (
    <>
      <Meta
        title={`${frontMatter.title} | Knock Docs`}
        description={frontMatter.description}
      />
      <div className="w-full max-w-5xl lg:flex mx-auto relative">
        <div className="max-w-prose flex-auto">
          {breadcrumbs && <Breadcrumbs pages={breadcrumbs} />}

          <h1 className="font-semibold text-2xl lg:text-4xl mb-4">
            {frontMatter.title}
          </h1>
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
