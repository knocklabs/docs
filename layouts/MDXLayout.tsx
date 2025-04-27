import React from "react";
import { FrontMatter } from "../types";

import { DocsLayout } from "./DocsLayout";
import { IntegrationsLayout } from "./IntegrationsLayout";
import { CliReferenceLayout } from "./CliReferenceLayout";
import { ApiReferenceLayout } from "./ApiReferenceLayout";
import InAppUILayout from "./InAppUILayout";

import { useRouter } from "next/router";
import { SdksLayout } from "./SdksLayout";

const MDXLayout: React.FC<{ frontMatter: FrontMatter; sourcePath: string }> = (
  props,
) => {
  const { asPath } = useRouter();

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
    case "sdks":
      return <SdksLayout {...props}>{props.children}</SdksLayout>;
    default:
      if (asPath.startsWith("/in-app-ui")) {
        return <InAppUILayout {...props}>{props.children}</InAppUILayout>;
      }
      if (asPath.startsWith("/sdks")) {
        return <SdksLayout {...props}>{props.children}</SdksLayout>;
      }
      return <DocsLayout {...props}>{props.children}</DocsLayout>;
  }
};

export default MDXLayout;
