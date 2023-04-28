import React from "react";
import { Page } from "./Page";
import ApiReferenceSidebar from "../components/ApiReferenceSidebar";

export const ApiReferenceLayout = ({ frontMatter, children }) => (
  <Page
    pageType="API"
    sidebar={<ApiReferenceSidebar />}
    metaProps={{
      title: `${frontMatter.title} | Knock`,
      description: frontMatter.description,
    }}
  >
    <div className="w-full max-w-5xl lg:flex mx-auto relative">
      <div className="w-full flex-auto">
        <div className="docs-content api-docs-content">{children}</div>
      </div>
    </div>
  </Page>
);
