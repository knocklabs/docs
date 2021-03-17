import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { Page } from "./Page";
import PageNav from "../components/PageNav";
import Breadcrumbs from "../components/Breadcrumbs";
import sidebarContent from "../data/sidebar";
import Link from "next/link";
import Head from "next/head";

export const DocsLayout = ({ frontMatter, children }) => {
  const { pathname } = useRouter();
  const { section, page, nextPage, prevPage } = useMemo(() => {
    const sectionIndex = sidebarContent.findIndex((s) =>
      s.pages.find((p) => s.slug + p.slug === pathname)
    )!;
    const section = sidebarContent[sectionIndex];
    const pageIndex = (sidebarContent[sectionIndex]?.pages || []).findIndex(
      (p) => section.slug + p.slug === pathname
    );

    const page = section?.pages[pageIndex];

    return {
      section,
      page,
      nextPage: section?.pages[pageIndex + 1],
      prevPage: section?.pages[pageIndex - 1],
    };
  }, [pathname]);

  return (
    <Page>
      <Head>
        <title>{frontMatter.title} | Knock Docs</title>
      </Head>
      <div className="w-full max-w-5xl lg:flex mx-auto relative">
        <div className="max-w-prose overflow-x-hidden flex-auto">
          {section && page && <Breadcrumbs section={section} page={page} />}

          <h1 className="font-bold text-2xl lg:text-4xl mb-4">
            {frontMatter.title}
          </h1>
          <div className="docs-content prose-sm lg:prose">{children}</div>
          {(prevPage || nextPage) && (
            <div className="flex border-t mt-8 pt-8 text-sm">
              {prevPage && (
                <div className="text-left">
                  <Link href={section.slug + prevPage.slug}>
                    <a className="text-gray-500 hover:text-gray-800">
                      ← {prevPage.title}
                    </a>
                  </Link>
                </div>
              )}

              {nextPage && (
                <div className="ml-auto text-right">
                  <Link href={section.slug + nextPage.slug}>
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
