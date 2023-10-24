/* eslint-disable react/destructuring-assignment */
import React from "react";
import { FrontMatter } from "../../types";
import { MapiReferenceLayout } from "../MapiReferenceLayout";

const mApiLayout: React.FC<{ frontMatter: FrontMatter }> = (props) => (
  <MapiReferenceLayout {...props}>{props.children}</MapiReferenceLayout>
);

export default mApiLayout;
