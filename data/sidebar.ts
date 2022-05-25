import { SidebarSection } from "./types";

const sidebarContent: SidebarSection[] = [
  {
    title: "Getting started",
    slug: "/getting-started",
    desc: "A technical and non-technical introduction to the basics of Knock, and a step-by-step guide to get you going in minutes.",
    pages: [
      { slug: "/what-is-knock", title: "What is Knock?" },
      { slug: "/how-knock-works", title: "How Knock works" },
      { slug: "/quick-start", title: "Quick start" },
      { slug: "/example-app", title: "Example app" },
      { slug: "/knock-and-postman", title: "Knock and Postman" },
      { slug: "/security", title: "Security", path: "/security" },
    ],
  },
  {
    title: "Send & manage data",
    slug: "/send-and-manage-data",
    desc: "Learn how to get data flowing into Knock to power your notifications.",
    pages: [
      { slug: "/concepts", title: "Concepts" },
      { slug: "/users", title: "Users" },
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
      { slug: "/debugging-workflows", title: "Debugging workflows" },
      { slug: "/reference-liquid-helpers", title: "Reference: liquid helpers" },
      { slug: "/reference-email-layout", title: "Reference: email layout" },
    ],
  },
  {
    title: "Building in-app UI",
    slug: "/in-app-ui",
    desc: "Use the Knock in-app experiences APIs and components to build rich notifications experiences inside of your product.",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/use-cases", title: "Use cases" },
      {
        slug: "/security-and-authentication",
        title: "Security & authentication",
      },
      {
        title: "React",
        slug: "/react",
        pages: [
          {
            slug: "/overview",
            title: "Overview + quick start",
          },
          { slug: "/notification-feed", title: "Notification feed" },
          { slug: "/toasts", title: "Toasts" },
          { slug: "/inbox", title: "Inbox" },
          { slug: "/custom-ui", title: "Custom UI" },
          { slug: "/reference", title: "Reference" },
        ],
      },
      {
        title: "Javascript",
        slug: "/javascript",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/getting-started", title: "Getting started" },
          { slug: "/reference", title: "Reference" },
        ],
      },
      {
        title: "React Native",
        slug: "/ios",
        pages: [{ slug: "/overview", title: "Overview" }],
      },
      {
        title: "iOS (Swift)",
        slug: "/ios",
        pages: [{ slug: "/overview", title: "Overview" }],
      },
      {
        title: "Android (Kotlin)",
        slug: "/android",
        pages: [{ slug: "/overview", title: "Overview" }],
      },
    ],
  },
  // {
  //   title: "Client integration",
  //   slug: "/client-integration",
  //   desc: "A guide for how to integrate Knock into your client-side applications.",
  //   pages: [{ slug: "/authenticating-users", title: "Authentication" }],
  // },
  // {
  //   title: "Notification feeds",
  //   slug: "/notification-feeds",
  //   desc: "Power real-time, in-app notifications in minutes using Knock's Feed API and pre-built React components.",
  //   pages: [
  //     { slug: "/overview", title: "Overview" },
  //     { slug: "/getting-started", title: "Getting started" },
  //     { slug: "/customizing-ui", title: "Customizing the UI" },
  //     { slug: "/bring-your-own-ui", title: "Bring your own UI" },
  //     { slug: "/feed-features", title: "Feed feature guide" },
  //   ],
  // },
  {
    title: "Integration guides",
    slug: "/integrations",
    desc: "Learn how to connect your notification providers to Knock.",
    pages: [
      { slug: "/overview", title: "Overview" },
      {
        title: "Email",
        slug: "/email",
        pages: [
          { slug: "/attachments", title: "Attachments" },
          { slug: "/aws-ses", title: "AWS SES" },
          { slug: "/sendgrid", title: "SendGrid" },
        ],
      },
      {
        title: "Push",
        slug: "/push",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/apns", title: "Apple (APNS)" },
          { slug: "/firebase", title: "Firebase (FCM)" },
          { slug: "/expo", title: "Expo (React Native)" },
        ],
      },
      {
        title: "SMS",
        slug: "/sms",
        pages: [{ slug: "/twilio-sms", title: "Twilio SMS" }],
      },
      {
        title: "Chat",
        slug: "/chat",
        pages: [
          { slug: "/slack", title: "Slack" },
          { slug: "/microsoft-teams", title: "Microsoft Teams" },
          { slug: "/discord", title: "Discord" },
        ],
      },
    ],
  },
];

export default sidebarContent;
