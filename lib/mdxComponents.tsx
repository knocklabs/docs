import Image from "next/image";
import { CodeBlock } from "../components/ui/CodeBlock";
import { Callout } from "../components/ui/Callout";
import MultiLangCodeBlock from "../components/ui/MultiLangCodeBlock";
import LocaleTable from "../components/ui/LocaleTable";
import { Attributes, Attribute } from "../components/ui/Attributes";
import Table from "../components/ui/Table";
import CopyableText from "../components/CopyableText";
import { Card, CardGroup } from "../components/ui/Card";
import { SdkCard, SdkCardGroup } from "../components/ui/SdkCard";
import { Endpoints, Endpoint } from "../components/ui/Endpoints";
import { AccordionGroup, Accordion } from "../components/ui/Accordion";
import { Steps, Step } from "../components/ui/Step";
import {
  Section,
  ContentColumn,
  ErrorExample,
  ExampleColumn,
} from "../components/ui/ApiSections";
import RateLimit from "../components/ui/RateLimit";
import { Heading, Code, Text } from "@telegraph/typography";
import {
  TableElement,
  ThElement,
  TdElement,
  TheadElement,
} from "../components/ui/Table";
import { Section as OverviewSection } from "../components/ui/OverviewContent/Section";
import {
  ContentCard,
  ConceptCard,
  BuildingBlock,
  Tool,
  ResponsiveThreeColumn,
  ResponsiveTwoColumn,
} from "../components/ui/OverviewContent/Blocks";
import { Box, Stack } from "@telegraph/layout";
import { Tag } from "@telegraph/tag";
import { ContentActions } from "@/components/ui/ContentActions";

export const MDX_COMPONENTS = {
  pre: (props) => <CodeBlock mb="2" {...props} />,
  h2: (props) => <Heading as="h2" size="6" mb="3" mt="8" {...props} />,
  h3: (props) => <Heading as="h3" size="4" mb="2" mt="8" {...props} />,
  h4: (props) => <Heading as="h4" size="3" mb="1" mt="8" {...props} />,
  code: (props) => (
    <Code as="code" backgroundColor="gray-2" data-tgph-code {...props}>
      {props.children}
    </Code>
  ),
  li: (props) => (
    <Text
      as="li"
      size="2"
      {...props}
      ml="4"
      mb="2"
      style={{ listStyleType: "disc", ...props.style }}
    >
      {props.children}
    </Text>
  ),
  figcaption: (props) => (
    <Text as="figcaption" mt="2" mb="4" data-tgph-figcaption {...props} />
  ),
  table: (props) => <TableElement {...props} />,
  thead: (props) => <TheadElement {...props} />,
  th: (props) => <ThElement {...props} />,
  td: (props) => <TdElement {...props} />,
  Callout,
  Image,
  MultiLangCodeBlock,
  LocaleTable,
  Attributes,
  Attribute,
  Table,
  CopyableText,
  RateLimit,
  Section,
  ContentColumn,
  ErrorExample,
  ExampleColumn,
  Endpoints,
  Endpoint,
  Card,
  CardGroup,
  SdkCard,
  SdkCardGroup,
  AccordionGroup,
  Accordion,
  Steps,
  Step,
  OverviewSection,
  ContentCard,
  ConceptCard,
  BuildingBlock,
  Tool,
  ResponsiveThreeColumn,
  ResponsiveTwoColumn,
  OverviewSectionContainer: OverviewSection.Container,
  OverviewSectionHeader: OverviewSection.Header,
  OverviewSectionContent: OverviewSection.Content,
  Text,
  Box: Box,
  Stack: Stack,
  Tag,
  ContentActions,
};
