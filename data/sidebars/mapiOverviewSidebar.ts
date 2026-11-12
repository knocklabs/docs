import { SidebarSection } from "../types";

// Sorted alphabetically by each resource's display name in
// `data/specs/mapi/customizations.yml` (e.g. `schemas` is "Item schemas"),
// with `$shared` kept last.
export const RESOURCE_ORDER = [
  "api_keys",
  "assets",
  "audiences",
  "audit_logs",
  "auth",
  "billing",
  "branches",
  "broadcasts",
  "channel_groups",
  "channels",
  "commits",
  "data_sources",
  "email_layouts",
  "environments",
  "goals",
  "guides",
  "schemas",
  "members",
  "message_types",
  "partials",
  "preference_categories",
  "preference_center",
  "tags",
  "templates",
  "translations",
  "variables",
  "webhooks",
  "workflows",
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
