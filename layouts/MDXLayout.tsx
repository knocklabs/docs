import React from "react";
import { FrontMatter } from "../types";

import { DocsLayout } from "./DocsLayout";
import { IntegrationsLayout } from "./IntegrationsLayout";
import { CliReferenceLayout } from "./CliReferenceLayout";
import { MapiReferenceLayout } from "./MapiReferenceLayout";
import { ApiReferenceLayout } from "./ApiReferenceLayout";

const MDXLayout: React.FC<{ frontMatter: FrontMatter; sourcePath: string }> = (
  props,
) => {
  switch (props.frontMatter.layout) {
    case "api":
      return (
        <ApiReferenceLayout {...props}>{props.children}</ApiReferenceLayout>
      );
    case "integrations":
      return (
        <IntegrationsLayout {...props}>{props.children}</IntegrationsLayout>
      );
    case "cli":
      return (
        <CliReferenceLayout {...props}>{props.children}</CliReferenceLayout>
      );
    case "mapi":
      return (
        <MapiReferenceLayout {...props}>{props.children}</MapiReferenceLayout>
      );
    default:
      return <DocsLayout {...props}>{props.children}</DocsLayout>;
  }
};

export default MDXLayout;
