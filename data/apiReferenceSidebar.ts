import { SidebarSection } from "./types";

const sidebarContent: SidebarSection[] = [
  {
    title: "API Reference",
    slug: "/reference",
    pages: [
      { slug: "#overview", title: "Overview" },
      { slug: "#client-libraries", title: "Client libraries" },
      { slug: "#api-keys", title: "API keys" },
      { slug: "#authentication", title: "Authentication" },
      { slug: "#errors", title: "Errors" },
    ],
  },
  {
    title: "Users",
    slug: "/reference",
    pages: [
      { slug: "#users", title: "Overview" },
      { slug: "#identify-user", title: "Identify a user" },
      { slug: "#get-user", title: "Get a user" },
      { slug: "#delete-user", title: "Delete a user" },
      { slug: "#merge-user", title: "Merge users" },
      { slug: "#bulk-identify-users", title: "Bulk identify users" },
      { slug: "#bulk-delete-users", title: "Bulk delete users" },
    ],
  },

  {
    title: "Workflows",
    slug: "/reference",
    pages: [
      { slug: "#workflows", title: "Overview" },
      { slug: "#trigger-workflow", title: "Trigger a workflow" },
      { slug: "#cancel-workflow", title: "Cancel a workflow" },
    ],
  },

  {
    title: "Feeds",
    slug: "/reference",
    pages: [
      { slug: "#feeds", title: "Overview" },
      { slug: "#get-feed", title: "Get a feed for a user" },
    ],
  },

  {
    title: "Preferences",
    slug: "/reference",
    pages: [{ slug: "#preferences", title: "Overview" }],
  },

  {
    title: "Channel data",
    slug: "/reference",
    pages: [{ slug: "#channel-data", title: "Overview" }],
  },

  {
    title: "Objects",
    slug: "/reference",
    pages: [
      { slug: "#objects", title: "Overview" },
      { slug: "#get-object", title: "Get object" },
      { slug: "#set-object", title: "Set object" },
      { slug: "#delete-object", title: "Delete object" },
      { slug: "#bulk-set-objects", title: "Bulk set objects" },
      { slug: "#bulk-delete-objects", title: "Bulk delete objects" },
    ],
  },

  {
    title: "Messages",
    slug: "/reference",
    pages: [
      { slug: "#messages", title: "Overview" },
      { slug: "#update-message-status", title: "Update status" },
      { slug: "#batch-update-message-status", title: "Batch change status" },
      {
        slug: "#bulk-update-channel-message-status",
        title: "Bulk change status under channel",
      },
    ],
  },

  {
    title: "Bulk Operations",
    slug: "/reference",
    pages: [
      { slug: "#bulk-operations", title: "Overview" },
      { slug: "#bulk-operation-status", title: "Get bulk operation" },
    ],
  },
];

export default sidebarContent;
