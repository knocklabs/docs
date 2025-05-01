import { Box, Stack } from "@telegraph/layout";
import { Text, Heading } from "@telegraph/typography";

import { PageHeader } from "./PageHeader";

import { OnThisPage } from "./Page/OnThisPage";
import { Sidebar, SidebarContext } from "./Page/Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";

import "../../styles/global.css";
import "../../styles/responsive.css";
import { createContext, useContext, useState } from "react";
export const MAX_WIDTH = "1400px";

const PageContext = createContext({
  isSearchOpen: false,
  setIsSearchOpen: (isSearchOpen: boolean) => {},
});

export const usePageContext = () => useContext(PageContext);

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

const Masthead = ({ title }) => <PageHeader title={title} />;

const Content = ({ children, fullWidth = false }) => (
  <Box
    py="8"
    width="full"
    pl="24"
    pr="12"
    minWidth="0"
    style={{ maxWidth: fullWidth ? "initial" : "920px" }}
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

const ContentHeader = ({ title, description, children }) => (
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
  </Box>
);

const DefaultSidebar = ({ content, samePageRouting = false }) => (
  <SidebarContext.Provider value={{ samePageRouting }}>
    <Sidebar.Wrapper>
      {content.map((section) => (
        <Sidebar.Section
          key={section.slug}
          section={section}
          samePageRouting={samePageRouting}
        />
      ))}
    </Sidebar.Wrapper>
  </SidebarContext.Provider>
);

const Page = Object.assign({
  Breadcrumbs,
  Container,
  Masthead,
  Sidebar: DefaultSidebar,
  Content,
  ContentBody,
  ContentHeader,
  OnThisPage,
  Wrapper,
});

export { Page };
