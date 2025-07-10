import { SidebarContent } from "../types";

const baseSlug = "/tutorials";

export const parentSection = {
  slug: baseSlug,
  title: "Tutorials",
};

export const TUTORIALS_SIDEBAR: SidebarContent[] = [
  {
    slug: `${baseSlug}/overview`,
    title: "Overview",
  },
  {
    slug: `${baseSlug}/implementation-guide`,
    title: "Knock implementation guide",
  },
  {
    slug: `${baseSlug}/alerting`,
    title: "Alerting",
  },
  {
    slug: `${baseSlug}/customer-webhooks`,
    title: "Customer-facing webhooks",
  },
  {
    slug: `${baseSlug}/building-recurring-digests`,
    title: "Recurring digests",
  },
  { slug: `${baseSlug}/migrate-from-courier`, title: "Migrate from Courier" },
  {
    slug: `${baseSlug}/modeling-users-objects-and-tenants`,
    title: "Modeling Users, Objects, and Tenants",
  },
  {
    slug: `${baseSlug}/launchdarkly-experiments`,
    title: "LaunchDarkly experiments",
  },
];
