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
    title: "Implementing Knock",
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
  {
    slug: `${baseSlug}/migrate-from-courier`,
    title: "Migrate from Courier",
  },
  {
    slug: `${baseSlug}/migrate-from-braze`,
    title: "Migrate from Braze",
  },
  {
    slug: `${baseSlug}/modeling-users-objects-and-tenants`,
    title: "Modeling Users, Objects, and Tenants",
  },
  {
    slug: `${baseSlug}/launchdarkly-knock`,
    title: "Using LaunchDarkly with Knock to A/B test messaging",
  },
  {
    slug: `${baseSlug}/sending-web-push-notifications-with-fcm`,
    title: "Send web push with FCM",
  },
  {
    slug: `${baseSlug}/migrate-email-with-mcp-server`,
    title: "MCP for email template migration",
  },
];
