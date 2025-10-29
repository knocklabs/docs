import { SidebarContent } from "../types";

export const CLI_SIDEBAR: SidebarContent[] = [
  {
    title: "Getting started",
    slug: "/cli/overview",
    pages: [
      { slug: "", title: "Introduction" },
      { slug: "/installation", title: "Install the Knock CLI" },
      { slug: "/authentication", title: "Authentication" },
      { slug: "/global-flags", title: "Global flags" },
      { slug: "/directory-structure", title: "Directory structure" },
    ],
    sidebarMenuDefaultOpen: true,
  },

  {
    title: "Login",
    slug: "/cli/login",
  },

  {
    title: "Logout",
    slug: "/cli/logout",
  },

  {
    title: "Pull all resources",
    slug: "/cli/pull",
  },

  {
    title: "Push all resources",
    slug: "/cli/push",
  },

  {
    title: "Workflows",
    slug: "/cli/workflow",
    pages: [
      { slug: "/file-structure", title: "File structure" },
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
      { slug: "/file-structure", title: "File structure" },
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
      { slug: "/file-structure", title: "File structure" },
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
      { slug: "/file-structure", title: "File structure" },
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
  {
    title: "Guides",
    slug: "/cli/guides",
    pages: [
      { slug: "/file-structure", title: "File structure" },
      { slug: "/list", title: "List guides" },
      { slug: "/get", title: "Get guides" },
      { slug: "/pull", title: "Pull guides" },
      { slug: "/push", title: "Push guides" },
      { slug: "/validate", title: "Validate guide" },
      { slug: "/activate", title: "Activate guide" },
    ],
  },
];
