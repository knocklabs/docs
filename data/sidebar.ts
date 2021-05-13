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
    desc: "A technical and non-technical introduction to the features of Knock, and a step-by-step guide to get you going in minutes.",
    pages: [
      { slug: "/what-is-knock", title: "What is Knock?" },
      { slug: "/how-knock-works", title: "How Knock works" },
      { slug: "/quick-start", title: "Quick start" },
      //{ slug: "/knocks-features", title: "Knock's features" }, // Taking this out for now.
    ],
  },
  {
    title: "Send & manage data",
    slug: "/send-and-manage-data",
    desc: "Learn the ins-and-outs of how to get data flowing into Knock to power your notifications",
    pages: [
      { slug: "/concepts", title: "Concepts" },
      { slug: "/users", title: "Managing users" },
      { slug: "/lists", title: "Managing lists" },
      { slug: "/preferences", title: "Modeling preferences" },
      { slug: "/environments", title: "Environments" },
    ],
  },
  {
    title: "Send notifications",
    slug: "/send-notifications",
    desc: "See how to use Knock to start designing and sending out your notifications, including understanding more advanced workflows such as batching.",
    pages: [
      { slug: "/designing-notifications", title: "Designing flows" },
      { slug: "/triggering-flows", title: "Triggering flows" },
      { slug: "/applying-preferences", title: "Applying preferences" },
      { slug: "/batching-and-throttling", title: "Batching and throttling" },
      { slug: "/delivering-notifications", title: "Delivering notifications" },
    ],
  },
  {
    title: "Client integration",
    slug: "/client-integration",
    desc: "A guide for how to integrate Knock into your clientside applications",
    pages: [{ slug: "/authenticating-users", title: "Authentication" }],
  },
  {
    title: "Notification feeds",
    slug: "/notification-feeds",
    desc: "Everything you need to know about how to display notification feeds back to your users",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/getting-started", title: "Getting started" },
      { slug: "/customizing-ui", title: "Customizing the UI" },
      { slug: "/bring-your-own-ui", title: "Bring your own UI" },
    ],
  },
  {
    title: "Preferences",
    slug: "/preferences",
    desc: "An overview of integrating our preference components into your product",
    pages: [{ slug: "/overview", title: "Overview" }],
  },
  {
    title: "API reference",
    slug: "/reference",
    pages: [
      { slug: "#", title: "Overview" },
      { slug: "#api-keys", title: "API keys" },
      { slug: "#authentication", title: "Authentication" },
      { slug: "#errors", title: "Errors" },
      { slug: "#users", title: "Users" },
      { slug: "#notify", title: "Notify" },
      { slug: "#feeds", title: "Feeds" },
      { slug: "#messages", title: "Messages" },
    ],
  },
];

export default sidebarContent;
