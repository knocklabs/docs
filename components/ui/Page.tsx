import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { createContext, useContext, useRef, useState } from "react";

import { Button } from "@telegraph/button";
import { Icon } from "@telegraph/icon";
import { Box, Stack } from "@telegraph/layout";
import { Heading, Text } from "@telegraph/typography";

import { AskAiContext } from "../AskAiContext";
import { Breadcrumbs } from "./Breadcrumbs";
import { ContentActions } from "./ContentActions";
import { Feedback } from "./Feedback";
import { MobileSidebar } from "./Page/MobileSidebar";
import { OnThisPage } from "./Page/OnThisPage";
import { Sidebar, SidebarContext } from "./Page/Sidebar";
import { PageHeader } from "./PageHeader";

export const MAX_WIDTH = "1400px";

const PageContext = createContext({
  isSearchOpen: false,
  setIsSearchOpen: (isSearchOpen: boolean) => {},
});

export const usePageContext = () => useContext(PageContext);

export const TopContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      gap="1"
      mb="4"
    >
      {children}
    </Stack>
  );
};

function Container({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  return (
    <PageContext.Provider value={{ isSearchOpen, setIsSearchOpen }}>
      <Box position="relative">
        {children}
        <Box
          style={{
            pointerEvents: "none",
            zIndex: 49,
            opacity: isSearchOpen ? 0.65 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
          bg="surface-1"
          position="fixed"
          h="full"
          w="full"
          top="0"
          left="0"
          right="0"
          bottom="0"
        />
      </Box>
    </PageContext.Provider>
  );
}

function Wrapper({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const askAiContext = useContext(AskAiContext);
  const isOpen = askAiContext?.isOpen ?? false;
  const sidebarWidth = askAiContext?.sidebarWidth ?? 340;
  const isResizing = askAiContext?.isResizing ?? false;

  // Children expected: [Sidebar, Content] or [Sidebar, Content, OnThisPage]
  const childArray = Array.isArray(children) ? children : [children];
  const sidebar = childArray[0];
  const content = childArray[1];
  const onThisPage = childArray.length === 3 ? childArray[2] : null;
  const hasToc = onThisPage !== null;

  const pageWidth = "1024px";

  return (
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
      {sidebar}

      <div
        data-content-area
        className="flex w-full"
        style={{
          minWidth: 0,
          maxWidth: pageWidth,
          marginLeft: `clamp(16px, calc((100vw - var(--ask-ai-sidebar-width, 0px) - 256px - ${pageWidth}) * 0.25), 200px)`,
        }}
      >
        {content}
        {hasToc && onThisPage}
      </div>
    </div>
  );
}

const Masthead = ({
  skipHighlight,
  mobileSidebar,
}: {
  skipHighlight?: boolean;
  mobileSidebar?: React.ReactNode;
}) => {
  return (
    <PageHeader skipHighlight={skipHighlight} mobileSidebar={mobileSidebar} />
  );
};

function Content({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div
      className="flex-1 min-w-0 space-y-8 px-6 py-9"
      style={{ minWidth: "min(600px, 100%)" }}
      data-content
    >
      {children}
    </div>
  );
}

function ContentBody({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <Box mb="6" className="tgraph-content" data-content-body>
      {children}
    </Box>
  );
}

type PageNeighbor = {
  title: string;
  path: string;
  slug: string;
};

const ContentFooter = ({
  nextPage,
  previousPage,
}: {
  nextPage: PageNeighbor;
  previousPage: PageNeighbor;
}) => (
  <Box borderTop="px" borderColor="gray-4" py="4" data-content-footer w="full">
    <Stack justifyContent="center" py="1">
      <Feedback />
    </Stack>
    <Stack
      as="nav"
      direction="row"
      gap="2"
      justifyContent="space-between"
      w="full"
      style={{
        display: "grid",
        gridTemplateColumns: "49% 49%",
      }}
    >
      {previousPage ? (
        <Button.Root
          as={Link}
          href={previousPage.path}
          variant="ghost"
          leadingIcon={{
            icon: ChevronLeft,
            "aria-hidden": true,
            flexShrink: 0,
          }}
          pr="4"
          pl="0"
          py="8"
          w="full"
          justifyContent="flex-start"
          overflow="hidden"
          minWidth="0"
        >
          <Stack alignItems="center" gap="2" minW="0">
            <Icon
              icon={ChevronLeft}
              size="2"
              color="gray"
              aria-hidden
              style={{
                marginLeft: "-3px",
              }}
            />
            <Stack direction="column" w="full" style={{ minWidth: 0 }}>
              <Text as="span" size="1" weight="medium" color="gray" mb="1">
                Previous
              </Text>
              <Text
                as="span"
                size="3"
                weight="medium"
                textOverflow="ellipsis"
                w="full"
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {previousPage.title}
              </Text>
            </Stack>
          </Stack>
        </Button.Root>
      ) : (
        <Box w="full" />
      )}
      {nextPage ? (
        <Button.Root
          as={Link}
          href={nextPage.path}
          variant="ghost"
          px="4"
          pr="0"
          py="8"
          w="full"
          justifyContent="flex-end"
          trailingIcon={{
            icon: ChevronRight,
            "aria-hidden": true,
          }}
        >
          <Stack alignItems="center" gap="2" minW="0">
            <Stack direction="column" w="full" style={{ minWidth: 0 }}>
              <Text as="span" size="1" weight="medium" color="gray" mb="1">
                Next
              </Text>
              <Text
                as="span"
                size="3"
                weight="medium"
                textOverflow="ellipsis"
                w="full"
                style={{
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {nextPage.title}
              </Text>
            </Stack>
            <Icon
              icon={ChevronRight}
              size="2"
              color="gray"
              aria-hidden
              style={{
                marginRight: "-3px",
              }}
            />
          </Stack>
        </Button.Root>
      ) : (
        <Box w="full" />
      )}
    </Stack>
  </Box>
);

interface ContentHeaderProps {
  title: string;
  description: string;
  bottomContent?: React.ReactNode;
  children?: React.ReactNode;
}

const ContentHeader = ({
  title,
  description,
  bottomContent,
  children,
}: ContentHeaderProps) => (
  <Box mb="6">
    <Heading as="h1" size="6" mb="1">
      {title}
    </Heading>
    {description && (
      <Text as="p" size="2" color="gray" weight="medium">
        {description}
        {children}
      </Text>
    )}
    {bottomContent && <Box mt="4">{bottomContent}</Box>}
  </Box>
);

// Default sidebar wrapper that positions the sidebar fixed to the left of the page.
const DefaultFullSidebar = ({
  content,
  samePageRouting = false,
  contentProps = {},
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  return (
    <SidebarContext.Provider value={{ samePageRouting }}>
      <Sidebar.FullLayout scrollerRef={scrollerRef}>
        <Sidebar.ScrollContainer {...contentProps} scrollerRef={scrollerRef}>
          {content.map((section) => (
            <Sidebar.Section key={section.slug} section={section} />
          ))}
        </Sidebar.ScrollContainer>
      </Sidebar.FullLayout>
    </SidebarContext.Provider>
  );
};

const DefaultMobileSidebar = ({ content, samePageRouting = false }) => (
  <MobileSidebar>
    <SidebarContext.Provider value={{ samePageRouting }}>
      {content.map((section) => (
        <Sidebar.Section key={section.slug} section={section} />
      ))}
    </SidebarContext.Provider>
  </MobileSidebar>
);

const Page = Object.assign({
  Breadcrumbs,
  TopContainer,
  ContentActions,
  Container,
  Masthead,
  FullSidebar: DefaultFullSidebar,
  MobileSidebar: DefaultMobileSidebar,
  Content,
  ContentBody,
  ContentHeader,
  ContentFooter,
  OnThisPage,
  Wrapper,
});

export { Page };
