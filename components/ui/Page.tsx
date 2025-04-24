import { createContext, useContext } from "react";
import { Box, Stack } from "@telegraph/layout";
import { Text, Heading } from "@telegraph/typography";

import { PageHeader } from "./PageHeader";

import { OnThisPage } from "./Page/OnThisPage";
import { Sidebar } from "./Page/Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";

import "../../styles/global.css";

export const MAX_WIDTH = "1400px";

const Container = ({ children }) => <Box>{children}</Box>;

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
    pr="4"
    minWidth="0"
    style={{ maxWidth: fullWidth ? "initial" : "740px" }}
  >
    <Box>{children}</Box>
  </Box>
);

const ContentBody = ({ children }) => (
  <Box mb="6" className="tgraph-content">
    {children}
  </Box>
);

const ContentHeader = ({ title, description }) => (
  <Box mb="6">
    <Heading as="h1" size="7" mb="2">
      {title}
    </Heading>
    {description && (
      <Text as="p" size="4" color="gray">
        {description}
      </Text>
    )}
  </Box>
);

interface SidebarContextType {
  samePageRouting: boolean;
}

const SidebarContext = createContext<SidebarContextType>({
  samePageRouting: false,
});

export const useSidebar = () => {
  return useContext(SidebarContext);
};

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
