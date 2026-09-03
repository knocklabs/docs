import { SidebarSection } from "../types";

export const RESOURCE_ORDER = [
  "environments",
  "channels",
  "channel_groups",
  "workflows",
  "templates",
  "broadcasts",
  "email_layouts",
  "audiences",
  "goals",
  "partials",
  "assets",
  "guides",
  "message_types",
  "preference_center",
  "preference_categories",
  "schemas",
  "tags",
  "commits",
  "translations",
  "variables",
  "branches",
  "members",
  "data_sources",
  "api_keys",
  "billing",
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
        title: "Client libraries",
        slug: `/client-libraries`,
      },
      {
        title: "OpenAPI",
        slug: `/openapi`,
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
