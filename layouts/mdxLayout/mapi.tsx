/* eslint-disable react/destructuring-assignment */
import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { FrontMatter } from "../../types";
import { CodeBlock } from "../../components/CodeBlock";
import { MapiReferenceLayout } from "../MapiReferenceLayout";

const components = {
  pre: CodeBlock,
};

const mApiLayout: React.FC<{ frontMatter: FrontMatter }> = (props) => (
  <MDXProvider components={components}>
    <MapiReferenceLayout {...props}>{props.children}</MapiReferenceLayout>
  </MDXProvider>
);

export default mApiLayout;
