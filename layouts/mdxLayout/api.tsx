import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { DocsLayout } from "../DocsLayout";
import { FrontMatter } from "../../types";
import { CodeBlock } from "../../components/CodeBlock";

const components = {
  pre: CodeBlock,
};

const ApiLayout: React.FC<{ frontMatter: FrontMatter }> = (props) => (
  <MDXProvider components={components}>
    <DocsLayout {...props}>{props.children}</DocsLayout>
  </MDXProvider>
);

export default ApiLayout;
