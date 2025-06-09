import { SidebarSection } from "../types";

export const CLI_SIDEBAR: SidebarSection[] = [
  {
    title: "Getting started",
    slug: "/cli/overview",
    pages: [
      { slug: "", title: "Introduction" },
      { slug: "/installation", title: "Install the Knock CLI" },
      { slug: "/authentication", title: "Authentication" },
      { slug: "/global-flags", title: "Global flags" },
    ],
    sidebarMenuDefaultOpen: true,
  },
  {
    title: "Workflows",
    slug: "/cli/workflow",
    pages: [
      { slug: "/list", title: "List workflows" },
      { slug: "/get", title: "Get workflows" },
      { slug: "/pull", title: "Pull workflows" },
      { slug: "/push", title: "Push workflows" },
      { slug: "/run", title: "Run workflow" },
      { slug: "/validate", title: "Validate workflow" },
      { slug: "/activate", title: "Activate workflow" },
      { slug: "/generate-types", title: "Generate types" },
    ],
  },

  {
    title: "Email layouts",
    slug: "/cli/email-layout",
    pages: [
      { slug: "/list", title: "List email layouts" },
      { slug: "/get", title: "Get email layouts" },
      { slug: "/pull", title: "Pull email layouts" },
      { slug: "/push", title: "Push email layouts" },
      { slug: "/validate", title: "Validate email layouts" },
    ],
  },

  {
    title: "Translations",
    slug: "/cli/translation",
    pages: [
      { slug: "/list", title: "List translations" },
      { slug: "/get", title: "Get translations" },
      { slug: "/pull", title: "Pull translations" },
      { slug: "/push", title: "Push translations" },
      { slug: "/validate", title: "Validate translations" },
    ],
  },

  {
    title: "Partials",
    slug: "/cli/partial",
    pages: [
      { slug: "/list", title: "List partials" },
      { slug: "/get", title: "Get partials" },
      { slug: "/pull", title: "Pull partials" },
      { slug: "/push", title: "Push partials" },
      { slug: "/validate", title: "Validate partials" },
    ],
  },

  {
    title: "Commits",
    slug: "/cli/commit",
    pages: [
      { slug: "/list", title: "List commits" },
      { slug: "/get", title: "Get commits" },
      { slug: "/all", title: "Commit changes" },
      { slug: "/promote", title: "Promote changes" },
    ],
  },
];
