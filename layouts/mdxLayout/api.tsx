import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { FrontMatter } from "../../types";
import { CodeBlock } from "../../components/CodeBlock";
import { ApiReferenceLayout } from "../ApiReferenceLayout";

const components = {
  pre: CodeBlock,
};

const ApiLayout: React.FC<{ frontMatter: FrontMatter }> = (props) => (
  <MDXProvider components={components}>
    <ApiReferenceLayout {...props}>{props.children}</ApiReferenceLayout>
  </MDXProvider>
);

export default ApiLayout;
