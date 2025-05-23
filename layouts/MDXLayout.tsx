import React from "react";
import { FrontMatter } from "../types";

import { DocsLayout } from "./DocsLayout";
import { IntegrationsLayout } from "./IntegrationsLayout";
import { CliReferenceLayout } from "./CliReferenceLayout";
import InAppUILayout from "./InAppUILayout";

import { useRouter } from "next/router";

const MDXLayout: React.FC<{ frontMatter: FrontMatter; sourcePath: string }> = (
  props,
) => {
  const { asPath } = useRouter();

  switch (props.frontMatter.layout) {
    case "integrations":
      return (
        <IntegrationsLayout {...props}>{props.children}</IntegrationsLayout>
      );
    case "cli":
      return (
        <CliReferenceLayout {...props}>{props.children}</CliReferenceLayout>
      );
    default:
      if (asPath.startsWith("/in-app-ui")) {
        return <InAppUILayout {...props}>{props.children}</InAppUILayout>;
      }
      return <DocsLayout {...props}>{props.children}</DocsLayout>;
  }
};

export default MDXLayout;
