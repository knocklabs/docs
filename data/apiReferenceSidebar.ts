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
      { slug: "#rate-limits", title: "Rate limits" },
      { slug: "#batch-rate-limits", title: "Batch rate limits" },
      { slug: "#idempotent-requests", title: "Idempotent requests" },
      { slug: "#data-retention", title: "Data retention" },
      { slug: "#bulk-endpoints", title: "Bulk endpoints" },
      { slug: "#trigger-data-filtering", title: "Trigger data filtering" },
      { slug: "#pagination", title: "Pagination" },
      { slug: "#errors", title: "Errors" },
      { slug: "#error-codes", title: "Common error codes" },
    ],
  },

  {
    title: "Workflows",
    slug: "/reference",
    pages: [
      { slug: "#workflows", title: "Overview" },
      { slug: "#trigger-workflow", title: "Trigger a workflow" },
      {
        slug: "#trigger-workflow-inline-identify",
        title: "Trigger a workflow with identifications",
      },
      { slug: "#cancel-workflow", title: "Cancel a workflow" },
    ],
  },

  {
    title: "Messages",
    slug: "/reference",
    pages: [
      { slug: "#messages", title: "Overview" },
      { slug: "#list-messages", title: "List messages" },
      { slug: "#get-a-message", title: "Get a message" },
      { slug: "#get-message-events", title: "Get events" },
      { slug: "#get-message-activities", title: "Get activities" },
      { slug: "#get-message-content", title: "Get content" },
      { slug: "#batch-get-message-content", title: "Batch get content" },
      { slug: "#get-message-delivery-logs", title: "Get delivery logs" },
      { slug: "#update-message-status", title: "Update status" },
      { slug: "#undo-message-status", title: "Remove status" },
      { slug: "#batch-update-message-status", title: "Batch change status" },
      {
        slug: "#bulk-update-channel-message-status",
        title: "Bulk change status under channel",
      },
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
    title: "Users",
    slug: "/reference",
    pages: [
      { slug: "#users", title: "Overview" },
      { slug: "#identify-user", title: "Identify a user" },
      { slug: "#list-users", title: "List users" },
      { slug: "#get-user", title: "Get a user" },
      { slug: "#get-user-messages", title: "Get user messages" },
      { slug: "#delete-user", title: "Delete a user" },
      { slug: "#merge-user", title: "Merge users" },
      { slug: "#bulk-identify-users", title: "Bulk identify users" },
      { slug: "#bulk-delete-users", title: "Bulk delete users" },
    ],
  },

  {
    title: "Objects",
    slug: "/reference",
    pages: [
      { slug: "#objects", title: "Overview" },
      { slug: "#list-objects", title: "List objects" },
      { slug: "#get-object", title: "Get an object" },
      { slug: "#get-object-messages", title: "Get object messages" },
      { slug: "#set-object", title: "Set an object" },
      { slug: "#delete-object", title: "Delete an object" },
      { slug: "#bulk-set-objects", title: "Bulk set objects" },
      { slug: "#bulk-delete-objects", title: "Bulk delete objects" },
    ],
  },

  {
    title: "Subscriptions",
    slug: "/reference",
    pages: [
      { slug: "#subscriptions", title: "Overview" },
      { slug: "#list-subscriptions", title: "List subscriptions" },
      { slug: "#get-user-subscriptions", title: "Get user subscriptions" },
      { slug: "#add-subscriptions", title: "Add subscriptions" },
      { slug: "#bulk-add-subscriptions", title: "Bulk add subscriptions" },
      { slug: "#delete-subscriptions", title: "Delete subscriptions" },
    ],
  },

  {
    title: "Preferences",
    slug: "/reference",
    pages: [
      { slug: "#preferences", title: "Overview" },
      { slug: "#get-all-preferences-user", title: "List user preferences" },
      { slug: "#get-preferences-user", title: "Get user preferences" },
      { slug: "#set-preferences-user", title: "Set user preferences" },
      { slug: "#get-all-preferences-object", title: "List object preferences" },
      { slug: "#get-preferences-object", title: "Get object preferences" },
      { slug: "#set-preferences-object", title: "Set object preferences" },
      { slug: "#bulk-set-preferences", title: "Bulk set user preferences" },
    ],
  },

  {
    title: "Tenants",
    slug: "/reference",
    pages: [
      { slug: "#tenants", title: "Overview" },
      { slug: "#list-tenants", title: "List tenants" },
      { slug: "#get-tenant", title: "Get a tenant" },
      { slug: "#set-tenant", title: "Set a tenant" },
      { slug: "#delete-tenant", title: "Delete a tenant" },
    ],
  },

  {
    title: "Schedules",
    slug: "/reference",
    pages: [
      { slug: "#schedules", title: "Overview" },
      { slug: "#list-schedules", title: "List schedules" },
      { slug: "#get-user-schedules", title: "Get user schedules" },
      { slug: "#get-object-schedules", title: "Get object schedules" },
      { slug: "#create-schedules", title: "Create schedules" },
      { slug: "#update-schedules", title: "Update schedules" },
      { slug: "#delete-schedules", title: "Delete schedules" },
      { slug: "#bulk-create-schedules", title: "Bulk create schedules" },
    ],
  },

  {
    title: "Channel Data",
    slug: "/reference",
    pages: [
      { slug: "#channel-data", title: "Overview" },
      { slug: "#get-user-channel-data", title: "Get user channel data" },
      { slug: "#set-user-channel-data", title: "Set user channel data" },
      { slug: "#unset-user-channel-data", title: "Remove user channel data" },
      { slug: "#get-object-channel-data", title: "Get object channel data" },
      { slug: "#set-object-channel-data", title: "Set object channel data" },
      {
        slug: "#unset-object-channel-data",
        title: "Remove object channel data",
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

  {
    title: "Slack",
    slug: "/reference",
    pages: [
      { slug: "#slack", title: "Overview" },
      { slug: "#slack-auth-check", title: "Auth check" },
      { slug: "#slack-channels", title: "Slack channels" },
      { slug: "#slack-revoke-access", title: "Revoke access" },
    ],
  },

  {
    title: "Microsoft Teams",
    slug: "/reference",
    pages: [
      { slug: "#ms-teams", title: "Overview" },
      { slug: "#ms-teams-auth-check", title: "Auth check" },
      { slug: "#ms-teams-teams", title: "Teams" },
      { slug: "#ms-teams-channels", title: "Channels" },
      { slug: "#ms-teams-revoke-access", title: "Revoke access" },
    ],
  },

  {
    title: "Audiences",
    slug: "/reference",
    isBeta: true,
    pages: [
      { slug: "#audiences", title: "Overview" },
      { slug: "#audiences-list-members", title: "List audience members" },
      { slug: "#audiences-add-members", title: "Add audience members" },
      { slug: "#audiences-remove-members", title: "Remove audience members" },
    ],
  },
];

export default sidebarContent;
