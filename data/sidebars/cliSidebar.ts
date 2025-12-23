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
      { slug: "/configuring-your-project", title: "Configuring your project" },
      { slug: "/directory-structure", title: "Directory structure" },
    ],
    sidebarMenuDefaultOpen: true,
  },

  {
    title: "Authentication",
    slug: "/cli",
    pages: [
      { slug: "/login", title: "Login" },
      { slug: "/logout", title: "Logout" },
    ],
  },

  {
    title: "Managing resources",
    slug: "/cli",
    pages: [
      { slug: "/init", title: "Initialize a new project" },
      { slug: "/pull", title: "Pull all resources" },
      { slug: "/push", title: "Push all resources" },
    ],
  },

  {
    title: "Environments",
    slug: "/cli/environment",
    pages: [{ slug: "/list", title: "List environments" }],
  },

  {
    title: "Channels",
    slug: "/cli/channel",
    pages: [{ slug: "/list", title: "List channels" }],
  },

  {
    title: "Branches",
    slug: "/cli/branch",
    isBeta: true,
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/list", title: "List branches" },
      { slug: "/create", title: "Create branches" },
      { slug: "/delete", title: "Delete branches" },
      { slug: "/switch", title: "Switch to a branch" },
      { slug: "/exit", title: "Exit a branch" },
      { slug: "/merge", title: "Merge branch" },
    ],
  },

  {
    title: "Workflows",
    slug: "/cli/workflow",
    pages: [
      { slug: "/file-structure", title: "File structure" },
      { slug: "/list", title: "List workflows" },
      { slug: "/get", title: "Get workflows" },
      { slug: "/new", title: "Create a new workflow" },
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
      { slug: "/new", title: "Create a new email layout" },
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
      { slug: "/new", title: "Create a new translation" },
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
      { slug: "/new", title: "Create a new partial" },
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
    slug: "/cli/guide",
    pages: [
      { slug: "/file-structure", title: "File structure" },
      { slug: "/list", title: "List guides" },
      { slug: "/new", title: "Create a new guide" },
      { slug: "/get", title: "Get guides" },
      { slug: "/pull", title: "Pull guides" },
      { slug: "/push", title: "Push guides" },
      { slug: "/validate", title: "Validate guide" },
      { slug: "/activate", title: "Activate guide" },
    ],
  },
  {
    title: "Message types",
    slug: "/cli/message-type",
    pages: [
      { slug: "/file-structure", title: "File structure" },
      { slug: "/list", title: "List message types" },
      { slug: "/new", title: "Create a new message type" },
      { slug: "/get", title: "Get message types" },
      { slug: "/pull", title: "Pull message types" },
      { slug: "/push", title: "Push message types" },
      { slug: "/validate", title: "Validate message types" },
    ],
  },
];
