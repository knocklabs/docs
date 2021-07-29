/* eslint-disable react/destructuring-assignment */
import React from "react";
import { MDXProvider } from "@mdx-js/react";
import { DocsLayout } from "../DocsLayout";
import { FrontMatter } from "../../types";
import { CodeBlock } from "../../components/CodeBlock";
import SectionHeading from "../../components/SectionHeading";

const components = {
  pre: CodeBlock,
  h2: (props) => <SectionHeading tag="h2" {...props} />,
  h3: (props) => <SectionHeading tag="h3" {...props} />,
  h4: (props) => <SectionHeading tag="h4" {...props} />,
};

const Layout: React.FC<{ frontMatter: FrontMatter }> = (props) => (
  <MDXProvider components={components}>
    <DocsLayout {...props}>{props.children}</DocsLayout>
  </MDXProvider>
);

export default Layout;
