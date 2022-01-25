export type SidebarPage = {
  slug: string;
  title: string;
};

export type SidebarSection = {
  title: string | null;
  slug: string;
  desc?: string;
  pages: SidebarPage[];
};

const sidebarContent: SidebarSection[] = [
  {
    title: "Getting started",
    slug: "/getting-started",
    desc: "A technical and non-technical introduction to the basics of Knock, and a step-by-step guide to get you going in minutes.",
    pages: [
      { slug: "/what-is-knock", title: "What is Knock?" },
      { slug: "/how-knock-works", title: "How Knock works" },
      { slug: "/quick-start", title: "Quick start" },
      { slug: "/knock-and-postman", title: "Knock and Postman" },
      { slug: "/security", title: "Security" },
      // { slug: "/knocks-features", title: "Knock's features" }, // Taking this out for now.
    ],
  },
  {
    title: "Send & manage data",
    slug: "/send-and-manage-data",
    desc: "Learn how to get data flowing into Knock to power your notifications.",
    pages: [
      { slug: "/concepts", title: "Concepts" },
      { slug: "/users", title: "Users" },
      // { slug: "/lists", title: "Lists" },
      { slug: "/preferences", title: "Preferences" },
      { slug: "/environments", title: "Environments" },
      { slug: "/objects", title: "Objects" },
      { slug: "/multi-tenancy", title: "Multi-tenancy support" },
    ],
  },
  {
    title: "Send notifications",
    slug: "/send-notifications",
    desc: "Learn how to design and send notifications using Knock, then explore advanced features such as batching, delays, and more.",
    pages: [
      { slug: "/designing-workflows", title: "Designing workflows" },
      { slug: "/triggering-workflows", title: "Triggering workflows" },
      { slug: "/workflow-functions", title: "Workflow functions" },
      { slug: "/canceling-workflows", title: "Canceling workflows" },
      { slug: "/setting-preferences", title: "Setting preferences" },
      { slug: "/setting-channel-data", title: "Setting channel data" },
      { slug: "/delivering-notifications", title: "Delivering notifications" },
      { slug: "/reference-liquid-helpers", title: "Reference: liquid helpers" },
    ],
  },
  {
    title: "Client integration",
    slug: "/client-integration",
    desc: "A guide for how to integrate Knock into your client-side applications.",
    pages: [{ slug: "/authenticating-users", title: "Authentication" }],
  },
  {
    title: "Notification feeds",
    slug: "/notification-feeds",
    desc: "Power real-time, in-app notifications in minutes using Knock's Feed API and pre-built React components.",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/getting-started", title: "Getting started" },
      { slug: "/customizing-ui", title: "Customizing the UI" },
      { slug: "/bring-your-own-ui", title: "Bring your own UI" },
      { slug: "/feed-features", title: "Feed feature guide" },
    ],
  },
  {
    title: "Integration guides",
    slug: "/integrations",
    desc: "Learn how to connect your notification providers to Knock.",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/slack", title: "Slack" },
      { slug: "/twilio-sms", title: "Twilio SMS" },
      { slug: "/sendgrid", title: "SendGrid" },
      { slug: "/aws-ses", title: "AWS SES" },
    ],
  },
  {
    title: "API reference",
    slug: "/reference",
    desc: "Reference documentation for the Knock API",
    pages: [
      { slug: "#overview", title: "Overview" },
      { slug: "#client-libraries", title: "Client libraries" },
      { slug: "#api-keys", title: "API keys" },
      { slug: "#authentication", title: "Authentication" },
      { slug: "#errors", title: "Errors" },
      { slug: "#users", title: "Users" },
      { slug: "#workflows", title: "Workflows" },
      { slug: "#preferences", title: "Preferences" },
      { slug: "#channel-data", title: "Channel data" },
      { slug: "#feeds", title: "Feeds" },
      { slug: "#messages", title: "Messages" },
      { slug: "#bulk-operations", title: "Bulk operations" },
      { slug: "#objects", title: "Objects" },
    ],
  },
];

export default sidebarContent;
