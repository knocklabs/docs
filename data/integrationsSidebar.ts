import { SidebarSection } from "./types";

const sidebarContent: SidebarSection[] = [
  {
    title: "Email",
    slug: "/integrations/email",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/layouts", title: "Layouts" },
      { slug: "/aws-ses", title: "AWS SES" },
      { slug: "/mailjet", title: "Mailjet" },
      { slug: "/mailgun", title: "Mailgun" },
      { slug: "/postmark", title: "Postmark" },
      { slug: "/sendgrid", title: "SendGrid" },
      { slug: "/attachments", title: "Sending attachments" },
    ],
  },

  {
    title: "Chat",
    slug: "/integrations/chat",
    pages: [
      { slug: "/overview", title: "Overview" },
      {
        title: "Slack",
        slug: "/slack",
        pages: [
          { slug: "/overview", title: "Overview" },
          {
            slug: "/how-knock-slacks",
            title: "The Knock-Slack model",
          },
          { slug: "/slack-apps-and-scopes", title: "Slack apps and scopes" },
          { slug: "/building-oauth-flow", title: "Build your OAuth flow" },
          {
            slug: "/designing-slack-templates",
            title: "Designing Slack templates",
          },
          {
            slug: "/slack-interactivity",
            title: "Slack interactivity",
          },
          {
            slug: "/slack-examples",
            title: "Example use cases",
          },
        ],
      },
      { slug: "/microsoft-teams", title: "Microsoft Teams" },
      { slug: "/discord", title: "Discord" },
    ],
  },

  {
    title: "In-app",
    slug: "/integrations/in-app",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/knock", title: "Knock" },
    ],
  },

  {
    title: "Push",
    slug: "/integrations/push",
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
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/twilio", title: "Twilio" },
      { slug: "/telnyx", title: "Telnyx" },
    ],
  },
];

export default sidebarContent;