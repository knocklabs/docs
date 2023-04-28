/* eslint-disable react/destructuring-assignment */
import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { FrontMatter } from "../../types";
import { CodeBlock } from "../../components/CodeBlock";
import { CliReferenceLayout } from "../CliReferenceLayout";

const components = {
  pre: CodeBlock,
};

const CliLayout: React.FC<{ frontMatter: FrontMatter }> = (props) => (
  <MDXProvider components={components}>
    <CliReferenceLayout {...props}>{props.children}</CliReferenceLayout>
  </MDXProvider>
);

export default CliLayout;
