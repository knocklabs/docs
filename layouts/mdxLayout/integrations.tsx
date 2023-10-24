/* eslint-disable react/destructuring-assignment */
import React from "react";
import { IntegrationsLayout } from "../IntegrationsLayout";
import { FrontMatter } from "../../types";

const Layout: React.FC<{ frontMatter: FrontMatter }> = (props) => (
  <IntegrationsLayout {...props}>{props.children}</IntegrationsLayout>
);

export default Layout;
