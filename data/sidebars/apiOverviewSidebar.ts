import { SidebarSection } from "../types";

export const RESOURCE_ORDER = [
  "workflows",
  "messages",
  "channels",
  "users",
  "objects",
  "tenants",
  "recipients",
  "schedules",
  "audiences",
  "bulk_operations",
  "providers",
  "$shared",
];

export const API_REFERENCE_OVERVIEW_CONTENT: SidebarSection[] = [
  {
    title: "API reference",
    slug: `/api-reference/overview`,
    pages: [
      { slug: "/", title: "Overview" },
      { slug: "/client-libraries", title: "Client libraries" },
      { slug: "/api-keys", title: "API keys" },
      { slug: "/authentication", title: "Authentication" },
      { slug: "/rate-limits", title: "Rate limits" },
      { slug: "/batch-rate-limits", title: "Batch rate limits" },
      { slug: "/idempotent-requests", title: "Idempotent requests" },
      { slug: "/data-retention", title: "Data retention" },
      { slug: "/bulk-endpoints", title: "Bulk endpoints" },
      { slug: "/trigger-data-filtering", title: "Trigger data filtering" },
      { slug: "/pagination", title: "Pagination" },
      { slug: "/errors", title: "Errors" },
      { slug: "/error-codes", title: "Common error codes" },
    ],
    sidebarMenuDefaultOpen: true,
  },
];
