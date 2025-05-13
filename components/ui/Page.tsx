import { Box, Stack } from "@telegraph/layout";
import { Text, Heading } from "@telegraph/typography";

import { PageHeader } from "./PageHeader";

import { OnThisPage } from "./Page/OnThisPage";
import { Sidebar, SidebarContext } from "./Page/Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";
import { ContentActions } from "./ContentActions";

import "../../styles/global.css";
import "../../styles/responsive.css";
import { createContext, useContext, useRef, useState } from "react";
import { MobileSidebar } from "./Page/MobileSidebar";
import { Button } from "@telegraph/button";
import Link from "next/link";
import { Icon, Lucide } from "@telegraph/icon";

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

const Container = ({ children }) => {
  // Wider context for whether search input is open
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
};

const Wrapper = ({ children, maxWidth = MAX_WIDTH }) => (
  <Stack
    data-wrapper
    className={`layout-grid ${
      children.length === 3 ? "layout-grid--three-col" : ""
    }`}
    style={{
      display: "grid",
      maxWidth,
      margin: "0 auto",
    }}
  >
    {children}
  </Stack>
);

const Masthead = ({ mobileSidebar }: { mobileSidebar?: React.ReactNode }) => {
  return <PageHeader mobileSidebar={mobileSidebar} />;
};

const Content = ({ children, fullWidth = false }) => (
  <Box
    py="8"
    width="full"
    pl="20"
    pr="4"
    minWidth="0"
    style={{ maxWidth: fullWidth ? "initial" : "800px" }}
    className="lg-wrapper-padding"
  >
    <Box>{children}</Box>
  </Box>
);

const ContentBody = ({ children }) => (
  <Box mb="6" className="tgraph-content" data-content-body>
    {children}
  </Box>
);

type PageNeighbor = {
  title: string;
  path: string;
  slug: string;
};

const ContentFooter = ({
  children,
  nextPage,
  previousPage,
}: {
  children: React.ReactNode;
  nextPage: PageNeighbor;
  previousPage: PageNeighbor;
}) => (
  <Stack
    direction="row"
    borderTop="px"
    borderColor="gray-4"
    py="12"
    gap="2"
    data-content-footer
    w="full"
    justifyContent="space-between"
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
          icon: Lucide.ChevronLeft,
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
            icon={Lucide.ChevronLeft}
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
          icon: Lucide.ChevronRight,
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
            icon={Lucide.ChevronRight}
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
    <Heading as="h1" size="7" mb="2">
      {title}
    </Heading>
    {description && (
      <Text as="p" size="3" color="gray" weight="medium">
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
