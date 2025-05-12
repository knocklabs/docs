import { SidebarSection } from "../types";

export const TUTORIALS_SIDEBAR: SidebarSection[] = [
  {
    title: "Tutorials",
    slug: "/tutorials",
    sidebarMenuDefaultOpen: true,
    pages: [
      {
        slug: "/overview",
        title: "Overview",
      },
      {
        slug: "/implementation-guide",
        title: "Knock implementation guide",
      },
      {
        slug: "/alerting",
        title: "Alerting",
      },
      {
        slug: "/customer-webhooks",
        title: "Customer-facing webhooks",
      },
      {
        slug: "/building-recurring-digests",
        title: "Recurring digests",
      },
      { slug: "/migrate-from-courier", title: "Migrate from Courier" },
      {
        slug: "/modeling-users-objects-and-tenants",
        title: "Modeling Users, Objects, and Tenants",
      },
    ],
  },
];
