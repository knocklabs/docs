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
      { slug: "#get-user-messages", title: "Get messages" },
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
    pages: [
      { slug: "#preferences", title: "Overview" },
      { slug: "#get-preferences", title: "Get preferences" },
      { slug: "#set-preferences", title: "Set preferences" },
      { slug: "#bulk-set-preferences", title: "Bulk set preferences" },
    ],
  },

  {
    title: "Channel data",
    slug: "/reference",
    pages: [
      { slug: "#channel-data", title: "Overview" },
      { slug: "#get-user-channel-data", title: "Get user channel data" },
      { slug: "#set-user-channel-data", title: "Set user channel data" },
      { slug: "#get-object-channel-data", title: "Get object channel data" },
      { slug: "#set-object-channel-data", title: "Set object channel data" },
    ],
  },

  {
    title: "Objects",
    slug: "/reference",
    pages: [
      { slug: "#objects", title: "Overview" },
      { slug: "#get-object", title: "Get an object" },
      { slug: "#get-object-messages", title: "Get messages" },
      { slug: "#set-object", title: "Set an object" },
      { slug: "#delete-object", title: "Delete an object" },
      { slug: "#bulk-set-objects", title: "Bulk set objects" },
      { slug: "#bulk-delete-objects", title: "Bulk delete objects" },
    ],
  },

  {
    title: "Messages",
    slug: "/reference",
    pages: [
      { slug: "#messages", title: "Overview" },
      { slug: "#get-a-message", title: "Get a message" },
      { slug: "#get-message-events", title: "Get events" },
      { slug: "#get-message-activities", title: "Get activities" },
      { slug: "#get-message-content", title: "Get content" },
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
