"use client";

import { useRef, useContext } from "react";
import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";
import { PageHeader } from "../../../../components/ui/PageHeader";
import { MobileSidebar } from "../../../../components/ui/Page/MobileSidebar";
import { Sidebar, SidebarContext } from "../../../../components/ui/Page/Sidebar";
import { ContentActions } from "../../../../components/ui/ContentActions";
import { AskAiContext } from "../../../../components/AskAiContext";
import type { SidebarSection } from "../../../../data/types";

interface PageShellProps {
  children: React.ReactNode;
  sidebarContent: SidebarSection[];
  title: string;
  description: string;
}

export function PageShell({
  children,
  sidebarContent,
  title,
  description,
}: PageShellProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const askAiContext = useContext(AskAiContext);
  const isOpen = askAiContext?.isOpen ?? false;
  const sidebarWidth = askAiContext?.sidebarWidth ?? 340;
  const isResizing = askAiContext?.isResizing ?? false;

  return (
    <Box position="relative">
      <PageHeader
        mobileSidebar={
          <MobileSidebar>
            <SidebarContext.Provider value={{ samePageRouting: true }}>
              {sidebarContent.map((section) => (
                <Sidebar.Section key={section.slug} section={section} />
              ))}
            </SidebarContext.Provider>
          </MobileSidebar>
        }
      />
      <div
        data-wrapper
        className="layout-grid"
        style={
          {
            width: "100%",
            paddingRight: isOpen ? `${sidebarWidth}px` : "0",
            transition: isResizing ? "none" : "padding-right 0.2s ease-in-out",
            "--ask-ai-sidebar-width": isOpen ? `${sidebarWidth}px` : "0px",
          } as React.CSSProperties
        }
      >
        <SidebarContext.Provider value={{ samePageRouting: true }}>
          <Sidebar.FullLayout scrollerRef={scrollerRef}>
            <Sidebar.ScrollContainer scrollerRef={scrollerRef}>
              {sidebarContent.map((section) => (
                <Sidebar.Section key={section.slug} section={section} />
              ))}
            </Sidebar.ScrollContainer>
          </Sidebar.FullLayout>
        </SidebarContext.Provider>

        <div
          data-content-area
          className="flex w-full"
          style={{
            minWidth: 0,
            maxWidth: "800px",
            marginLeft: `clamp(16px, calc((100vw - var(--ask-ai-sidebar-width, 0px) - 256px - 800px) * 0.25), 200px)`,
          }}
        >
          <div
            className="flex-1 min-w-0 space-y-8 px-6 py-9"
            style={{ minWidth: "min(600px, 100%)" }}
            data-content
          >
            <Box mb="6">
              <Heading as="h1" size="7" mb="2">
                {title}
              </Heading>
              <Text as="p" size="3" color="gray" weight="medium">
                {description}
              </Text>
              <Box mt="4">
                <ContentActions showOnMobile style={{ marginLeft: "-6px" }} />
              </Box>
            </Box>
            <Box mb="6" className="tgraph-content" data-content-body>
              {children}
            </Box>
          </div>
        </div>
      </div>
    </Box>
  );
}
