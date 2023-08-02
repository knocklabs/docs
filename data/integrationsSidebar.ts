import { SidebarSection } from "./types";

const sidebarContent: SidebarSection[] = [
  {
    title: "Integrations",
    slug: "/integrations",
    pages: [{ slug: "/overview", title: "Overview" }],
  },
  {
    title: "Sources",
    slug: "/integrations/sources",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/segment", title: "Segment" },
      { slug: "/rudderstack", title: "RudderStack" },
      { slug: "/hightouch", title: "Hightouch" },
      { slug: "/census", title: "Census" },
      { slug: "/polytomic", title: "Polytomic" },
      { slug: "/jitsu", title: "Jitsu" },
      { slug: "/freshpaint", title: "Freshpaint" },
      { slug: "/http", title: "HTTP" },
    ],
  },
  {
    title: "Email",
    slug: "/integrations/email",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/layouts", title: "Layouts" },
      { slug: "/settings", title: "Settings" },
      { slug: "/aws-ses", title: "AWS SES" },
      { slug: "/mailersend", title: "Mailersend" },
      { slug: "/mailjet", title: "Mailjet" },
      { slug: "/mailgun", title: "Mailgun" },
      { slug: "/mailtrap", title: "Mailtrap" },
      { slug: "/mandrill", title: "Mandrill" },
      { slug: "/postmark", title: "Postmark" },
      { slug: "/resend", title: "Resend" },
      { slug: "/sendgrid", title: "SendGrid" },
      { slug: "/sparkpost", title: "Sparkpost" },
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
      { slug: "/whatsapp", title: "WhatsApp" },
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
    slug: "/integrations/sms",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/africas-talking", title: "Africa's Talking" },
      { slug: "/aws-sns", title: "AWS SNS" },
      { slug: "/mailersend", title: "Mailersend" },
      { slug: "/messagebird", title: "MessageBird" },
      { slug: "/plivo", title: "Plivo" },
      { slug: "/sinch", title: "Sinch" },
      { slug: "/twilio", title: "Twilio" },
      { slug: "/telnyx", title: "Telnyx" },
      { slug: "/vonage", title: "Vonage" },
    ],
  },
  {
    title: "Webhook",
    slug: "/integrations/webhook",
    pages: [{ slug: "/overview", title: "Overview" }],
  },

  {
    title: "Extensions",
    slug: "/integrations/extensions",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/vercel", title: "Vercel" },
      { slug: "/datadog", title: "Datadog" },
      { slug: "/segment", title: "Segment" },
      { slug: "/data-sync", title: "Data warehouse sync" },
    ],
  },
];

export default sidebarContent;
