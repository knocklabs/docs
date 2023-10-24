/* eslint-disable react/destructuring-assignment */
import React from "react";
import { FrontMatter } from "../../types";
import { CliReferenceLayout } from "../CliReferenceLayout";

const CliLayout: React.FC<{ frontMatter: FrontMatter }> = (props) => (
  <CliReferenceLayout {...props}>{props.children}</CliReferenceLayout>
);

export default CliLayout;
