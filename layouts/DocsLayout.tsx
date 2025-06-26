import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { Page } from "../components/ui/Page";
import { useSidebarContent } from "../hooks/useSidebarContent";
import {
  InkeepSidebarProvider,
  useInkeepSidebar,
} from "../contexts/InkeepSidebarContext";
import useInkeepSettings from "../hooks/useInKeepSettings";
import { type InkeepSidebarChat } from "@inkeep/cxkit-react";

import Meta from "../components/Meta";
import { getSidebarInfo, slugToPaths } from "../lib/content";
import { Box } from "@telegraph/layout";

const InkeepSidebarChatComponent = dynamic(
  () => import("@inkeep/cxkit-react").then((mod) => mod.InkeepSidebarChat),
  {
    ssr: false,
  },
) as typeof InkeepSidebarChat;

const InkeepSidebarChatWrapper = () => {
  const { isAiChatOpen, aiSearchTerm, chatFunctionsRef, handleCloseAiChat } =
    useInkeepSidebar();
  const { baseSettings, aiChatSettings } = useInkeepSettings();

  return (
    <InkeepSidebarChatComponent
      baseSettings={{
        ...baseSettings,
        theme: {
          styles: [
            {
              key: "knock-sidebar-style",
              type: "style",
              value: `
              .ikp-ai-chat-header {
                display: none;
              }
              `,
            },
          ],
        },
      }}
      aiChatSettings={{
        ...aiChatSettings,
        chatFunctionsRef,
        placeholder: "Ask a question...",
      }}
      isOpen={isAiChatOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleCloseAiChat();
        }
      }}
      position="right"
      defaultWidth={420}
      minWidth={250}
      maxWidth={600}
    />
  );
};

const DocsLayout = ({ frontMatter, sourcePath, children }) => {
  const router = useRouter();
  const paths = slugToPaths(router.query.slug);

  const { content: sidebarContent, parentSection } = useSidebarContent();

  const { breadcrumbs, nextPage, prevPage } = useMemo(
    () => getSidebarInfo(paths, sidebarContent, parentSection),
    [paths, sidebarContent],
  );

  return (
    <InkeepSidebarProvider>
      <Page.Container>
        <Meta
          title={`${frontMatter.title} | Knock Docs`}
          description={frontMatter.description}
        />
        <Page.Masthead
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
            <Page.ContentFooter nextPage={nextPage} previousPage={prevPage} />
          </Page.Content>
          {frontMatter.showNav !== false && (
            <Page.OnThisPage
              title={frontMatter.title}
              sourcePath={sourcePath}
            />
          )}
        </Page.Wrapper>
        <InkeepSidebarChatWrapper />
      </Page.Container>
    </InkeepSidebarProvider>
  );
};

export { DocsLayout };
