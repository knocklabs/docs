import React from "react";
import Link from "next/link";

import { Page } from "./Page";
import Sidebar from "../components/Sidebar";

const sidebarData = [
  {
    title: "Getting started",
    slug: "/mapi",
    pages: [
      { slug: "#overview", title: "Introduction" },
      { slug: "#authentication", title: "Authentication" },
      { slug: "#errors", title: "Errors" },
    ],
  },
  {
    title: "Workflows",
    slug: "/mapi",
    pages: [
      { slug: "#workflows-overview", title: "Introduction" },
      { slug: "#workflows-object", title: "Workflow definition" },
      { slug: "#workflows-list", title: "List workflows" },
      { slug: "#workflows-get", title: "Get workflow" },
      { slug: "#workflows-update", title: "Upsert workflow" },
      { slug: "#workflows-run", title: "Run workflow" },
      { slug: "#workflows-validate", title: "Validate workflow" },
      { slug: "#workflows-activate", title: "Activate workflow" },
    ],
  },
  {
    title: "Email layouts",
    slug: "/mapi",
    pages: [
      { slug: "#email-layouts-overview", title: "Introduction" },
      { slug: "#email-layouts-object", title: "Email layout definition" },
      { slug: "#email-layouts-list", title: "List email layouts" },
      { slug: "#email-layouts-get", title: "Get email layout" },
      { slug: "#email-layouts-upsert", title: "Upsert email layout" },
      { slug: "#email-layouts-validate", title: "Validate email layout" },
    ],
  },
  {
    title: "Translations",
    slug: "/mapi",
    pages: [
      { slug: "#translations-overview", title: "Introduction" },
      { slug: "#translations-object", title: "Translation definition" },
      { slug: "#translations-list", title: "List translations" },
      { slug: "#translations-get", title: "Get translation" },
      { slug: "#translations-upsert", title: "Upsert translation" },
      { slug: "#translations-validate", title: "Validate translation" },
    ],
  },
  {
    title: "Commits",
    slug: "/mapi",
    pages: [
      { slug: "#commits-overview", title: "Introduction" },
      { slug: "#commits-commit", title: "Commit all changes" },
      { slug: "#commits-promote", title: "Promote all changes" },
    ],
  },
];

export const MapiReferenceLayout = ({ frontMatter, children }) => (
  <Page
    pageType="mAPI"
    sidebar={
      <Sidebar content={sidebarData}>
        <Link href="/" passHref>
          <a className="text-sm block font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
            &#8592; Back to docs
          </a>
        </Link>
      </Sidebar>
    }
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
