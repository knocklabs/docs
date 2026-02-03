import { SidebarSection } from "../types";

export const RESOURCE_ORDER = [
  "environments",
  "channels",
  "channel_groups",
  "workflows",
  "templates",
  "broadcasts",
  "email_layouts",
  "partials",
  "guides",
  "message_types",
  "commits",
  "translations",
  "variables",
  "branches",
  "api_keys",
  "auth",
  "$shared",
];

export const MAPI_REFERENCE_OVERVIEW_CONTENT: SidebarSection[] = [
  {
    title: "API reference",
    slug: `/mapi-reference/overview`,
    pages: [
      {
        title: "Overview",
        slug: `/`,
      },
      {
        title: "Authentication",
        slug: `/authentication`,
      },
      {
        title: "Errors",
        slug: `/errors`,
      },
      {
        title: "Postman",
        slug: `/postman`,
      },
    ],
    sidebarMenuDefaultOpen: true,
  },
];
