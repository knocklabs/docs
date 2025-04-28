import Image from "next/image";
import { CodeBlock } from "../components/ui/CodeBlock";
import Callout from "../components/Callout";
import MultiLangCodeBlock from "../components/ui/MultiLangCodeBlock";
import LocaleTable from "../components/ui/LocaleTable";
import { Attributes, Attribute } from "../components/ui/Attributes";
import Table from "../components/ui/Table";
import CopyableText from "../components/CopyableText";
import { Card, CardGroup } from "../components/Card";
import { SdkCard, SdkCardGroup } from "../components/SdkCard";
import { Endpoints, Endpoint } from "../components/ui/Endpoints";
import { AccordionGroup, Accordion } from "../components/Accordion";
import { Steps, Step } from "../components/ui/Step";
import {
  Section,
  ContentColumn,
  ErrorExample,
  ExampleColumn,
} from "../components/ui/ApiSections";
import RateLimit from "../components/RateLimit";
import { Heading, Code, Text } from "@telegraph/typography";
import {
  TableElement,
  ThElement,
  TdElement,
  TheadElement,
} from "../components/ui/Table";

export const MDX_COMPONENTS = {
  pre: (props) => <CodeBlock mb="2" {...props} />,
  h2: (props) => <Heading as="h2" size="5" mb="3" mt="8" {...props} />,
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
};
