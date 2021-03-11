import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { DocsLayout } from "../DocsLayout";
import NextImage from "next/image";
import { FrontMatter } from "../../types";
import { CodeBlock } from "../../components/CodeBlock";

const components = {
  pre: CodeBlock,
  NextImage,
};

const ApiLayout: React.FC<{ frontMatter: FrontMatter }> = (props) => (
  <MDXProvider components={components}>
    <DocsLayout {...props}>{props.children}</DocsLayout>
  </MDXProvider>
);

export default ApiLayout;
