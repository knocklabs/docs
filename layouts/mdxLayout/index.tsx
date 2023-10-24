import React from "react";
import { DocsLayout } from "../DocsLayout";
import { FrontMatter } from "../../types";
import { useRouter } from "next/router";
import { IntegrationsLayout } from "../IntegrationsLayout";
import { CliReferenceLayout } from "../CliReferenceLayout";
import { MapiReferenceLayout } from "../MapiReferenceLayout";
import { ApiReferenceLayout } from "../ApiReferenceLayout";

const Layout: React.FC<{ frontMatter: FrontMatter }> = (props) => {
  const router = useRouter();

  if (router.asPath.startsWith("/integrations")) {
    return <IntegrationsLayout {...props}>{props.children}</IntegrationsLayout>;
  } else if (router.asPath.startsWith("/cli")) {
    return <CliReferenceLayout {...props}>{props.children}</CliReferenceLayout>;
  } else if (router.asPath.startsWith("/mapi")) {
    return (
      <MapiReferenceLayout {...props}>{props.children}</MapiReferenceLayout>
    );
  } else if (router.asPath.startsWith("/reference")) {
    return <ApiReferenceLayout {...props}>{props.children}</ApiReferenceLayout>;
  }

  return <DocsLayout {...props}>{props.children}</DocsLayout>;
};
export default Layout;
