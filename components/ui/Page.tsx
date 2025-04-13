import { Box, Stack } from "@telegraph/layout";
import { Text, Heading } from "@telegraph/typography";

import { PageHeader } from "./PageHeader";

import { OnThisPage } from "./Page/OnThisPage";
import { Sidebar } from "./Page/Sidebar";
import { Breadcrumbs } from "./Breadcrumbs";

import "../../styles/global.css";

export const MAX_WIDTH = "1400px";

const Container = ({ children }) => <Box>{children}</Box>;

const Wrapper = ({ children }) => (
  <Stack style={{ maxWidth: MAX_WIDTH, margin: "0 auto" }}>{children}</Stack>
);

const Masthead = ({ title }) => <PageHeader title={title} />;

const Content = ({ children }) => (
  <Stack direction="row" py="6" width="full" ml="60" position="relative">
    <Box style={{ maxWidth: "600px" }} ml="24">
      {children}
    </Box>
  </Stack>
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

const DefaultSidebar = ({ content }) => (
  <Sidebar.Wrapper>
    {content.map((section) => (
      <Sidebar.Section key={section.slug} section={section} />
    ))}
  </Sidebar.Wrapper>
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
