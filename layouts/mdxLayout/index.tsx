import React from "react";
import { DocsLayout } from "../DocsLayout";
import { FrontMatter } from "../../types";
import { useRouter } from "next/router";
import { IntegrationsLayout } from "../IntegrationsLayout";

const Layout: React.FC<{ frontMatter: FrontMatter }> = (props) => {
  const router = useRouter();

  // TODO: Clarify which layotus we're actually using and the difference between them
  if (router.asPath.startsWith("/integrations")) {
    return <IntegrationsLayout {...props}>{props.children}</IntegrationsLayout>;
  }

  return <DocsLayout {...props}>{props.children}</DocsLayout>;
};
export default Layout;
