import React from "react";
import Link from "next/link";

import { Page } from "./Page";
import Sidebar from "../components/Sidebar";
import MinimalHeader from "../components/Header/MinimalHeader";

const sidebarData = [
  {
    title: "Getting started",
    slug: "/mapi",
    pages: [
      { slug: "#overview", title: "Introduction" },
      { slug: "#authentication", title: "Authentication" },
      { slug: "#errors", title: "Errors" },
      { slug: "#postman", title: "Postman" },
    ],
  },
  {
    title: "Workflows",
    slug: "/mapi",
    pages: [
      { slug: "#workflows-overview", title: "Introduction" },
      {
        slug: "/",
        title: "Workflow definitions",
        pages: [
          { slug: "#workflows-object", title: "Workflow" },
          {
            slug: "#workflowsettings-definition",
            title: "WorkflowSettings",
          },
          {
            slug: "#workflowstep-definition",
            title: "WorkflowStep",
          },
          { slug: "#channelstep-definition", title: "ChannelStep" },
          { slug: "#sendwindow-definition", title: "SendWindow" },
          { slug: "#delay-step-definition", title: "Delay step" },
          { slug: "#branch-step-definition", title: "Branch step" },
          { slug: "#fetch-step-definition", title: "Fetch step" },
        ],
      },

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
    title: "Partials",
    slug: "/mapi",
    pages: [
      { slug: "#partials-overview", title: "Introduction" },
      { slug: "#partials-object", title: "Partial definition" },
      { slug: "#partials-list", title: "List partials" },
      { slug: "#partials-get", title: "Get partial" },
      { slug: "#partials-upsert", title: "Upsert partial" },
      { slug: "#partials-validate", title: "Validate partial" },
    ],
  },
  {
    title: "Commits",
    slug: "/mapi",
    pages: [
      { slug: "#commits-overview", title: "Introduction" },
      { slug: "#commits-object", title: "Commit definition" },
      { slug: "#commits-list", title: "List Commits" },
      { slug: "#commits-get", title: "Get a commit" },
      { slug: "#commits-commit", title: "Commit all changes" },
      { slug: "#commits-promote-all", title: "Promote all changes" },
      { slug: "#commits-promote-one", title: "Promote one change" },
    ],
  },
];

export const MapiReferenceLayout = ({ frontMatter, children }) => (
  <Page
    header={<MinimalHeader pageType="mAPI" />}
    sidebar={
      <Sidebar content={sidebarData}>
        <Link
          href="/"
          passHref
          className="text-sm block font-medium text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
        >
          &#8592; Back to docs
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
