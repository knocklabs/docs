import Image from "next/image";
import { CodeBlock } from "../components/ui/CodeBlock";
import Callout from "../components/Callout";
import MultiLangCodeBlock from "../components/MultiLangCodeBlock";
import LocaleTable from "../components/LocaleTable";
import { Attributes, Attribute } from "../components/Attributes";
import Table from "../components/Table";
import CopyableText from "../components/CopyableText";
import { Card, CardGroup } from "../components/Card";
import { SdkCard, SdkCardGroup } from "../components/SdkCard";
import { Endpoints, Endpoint } from "../components/ui/Endpoints";
import { AccordionGroup, Accordion } from "../components/Accordion";
import { Steps, Step } from "../components/Step";
import {
  Section,
  ContentColumn,
  ErrorExample,
  ExampleColumn,
} from "../components/ui/ApiSections";
import RateLimit from "../components/RateLimit";
import { Heading } from "@telegraph/typography";

export const MDX_COMPONENTS = {
  pre: CodeBlock,
  h2: (props) => <Heading as="h2" size="5" mb="3" {...props} />,
  h3: (props) => <Heading as="h3" size="4" mb="2" {...props} />,
  h4: (props) => <Heading as="h4" size="3" mb="1" {...props} />,
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
