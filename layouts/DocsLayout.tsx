import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { Page } from "../components/ui/Page";
import { useSidebarContent } from "../hooks/useSidebarContent";

import Meta from "../components/Meta";
import { getSidebarInfo, slugToPaths } from "../lib/content";
import { Box } from "@telegraph/layout";

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

  const sidebarContent = useSidebarContent();

  const { breadcrumbs, nextPage, prevPage } = useMemo(
    () => getSidebarInfo(paths, sidebarContent),
    [paths, sidebarContent],
  );

  return (
    <Page.Container>
      <Meta
        title={`${frontMatter.title} | Knock Docs`}
        description={frontMatter.description}
      />
      <Page.Masthead
        title={frontMatter.title}
        mobileSidebar={<Page.MobileSidebar content={sidebarContent} />}
      />
      <Page.Wrapper>
        <Box className="md-hidden" position="relative" h="full" w="full">
          <Page.FullSidebar content={sidebarContent} />
        </Box>
        <Page.Content>
          <Page.TopContainer>
            {breadcrumbs && <Page.Breadcrumbs pages={breadcrumbs} />}
            <Page.ContentActions />
          </Page.TopContainer>
          <Page.ContentHeader
            title={frontMatter.title}
            description={frontMatter.description}
          />
          <Page.ContentBody>{children}</Page.ContentBody>
        </Page.Content>
        {frontMatter.showNav !== false && (
          <Page.OnThisPage title={frontMatter.title} sourcePath={sourcePath} />
        )}
      </Page.Wrapper>
    </Page.Container>
  );

  // return (
  //   <Page header={<MinimalHeader pageType="Docs" />} sidebar={<DocsSidebar />}>
  //     <Meta
  //       title={`${frontMatter.title} | Knock Docs`}
  //       description={frontMatter.description}
  //     />
  //     <div className="w-full max-w-5xl lg:flex mx-auto relative">
  //       <div className="max-w-prose flex-auto">
  //         {breadcrumbs && <Breadcrumbs pages={breadcrumbs} />}

  //         <header className="mb-6 pb-6 border-b dark:border-b-gray-800">
  //           <h1 className="font-semibold text-2xl lg:text-4xl mb-2">
  //             {frontMatter.title}
  //           </h1>
  //           <div className="text-[18px] text-gray-600 dark:text-gray-300">
  //             {frontMatter.description}
  //           </div>
  //         </header>

  //         <div className="docs-content prose-sm lg:prose dark:prose-invert">
  //           {children}
  //         </div>
  //         {(prevPage || nextPage) && (
  //           <div className="flex border-t dark:border-t-gray-700 mt-8 pt-8 text-sm">
  //             {prevPage?.path && !("pages" in prevPage) && (
  //               <div className="text-left">
  //                 <Link
  //                   href={prevPage.path}
  //                   className="text-gray-500 hover:text-gray-800"
  //                 >
  //                   ←{prevPage.title}
  //                 </Link>
  //               </div>
  //             )}

  //             {nextPage?.path && !("pages" in nextPage) && (
  //               <div className="ml-auto text-right">
  //                 <Link
  //                   href={nextPage.path}
  //                   className="text-gray-500 hover:text-gray-80"
  //                 >
  //                   {nextPage.title}→
  //                 </Link>
  //               </div>
  //             )}
  //           </div>
  //         )}
  //       </div>

  //       <div className="hidden xl:text-sm xl:block flex-none w-64 ml-auto relative">
  //         {frontMatter.showNav !== false && (
  //           <PageNav title={frontMatter.title} sourcePath={sourcePath} />
  //         )}
  //       </div>
  //     </div>
  //   </Page>
  // );
};

export { DocsLayout };
