import { SidebarSection } from "../types";

export const RESOURCE_ORDER = [
  "environments",
  "channels",
  "broadcasts",
  "workflows",
  "email_layouts",
  "translations",
  "partials",
  "commits",
  "variables",
  "templates",
  "message_types",
  "guides",
  "api_keys",
  "branches",
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
