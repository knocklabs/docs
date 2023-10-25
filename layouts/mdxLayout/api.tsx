import React from "react";
import { FrontMatter } from "../../types";
import { ApiReferenceLayout } from "../ApiReferenceLayout";

const ApiLayout: React.FC<{ frontMatter: FrontMatter }> = (props) => (
  <ApiReferenceLayout {...props}>{props.children}</ApiReferenceLayout>
);

export default ApiLayout;
