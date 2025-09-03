import { SidebarContent } from "../types";

export const parentSection = {
  slug: "/integrations",
  title: "Integrations",
};

export const INTEGRATIONS_SIDEBAR: SidebarContent[] = [
  {
    title: "Overview",
    slug: "/integrations/overview",
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
      { slug: "/settings", title: "Settings and overrides" },
      { slug: "/attachments", title: "Sending attachments" },
      { slug: "/client-previews", title: "Client previews" },
      { slug: "/aws-ses", title: "AWS SES" },
      { slug: "/knock-test", title: "Knock (test)" },
      { slug: "/mailersend", title: "MailerSend" },
      { slug: "/mailgun", title: "Mailgun" },
      { slug: "/mailjet", title: "Mailjet" },
      { slug: "/mailtrap", title: "Mailtrap" },
      { slug: "/mandrill", title: "Mandrill" },
      { slug: "/postmark", title: "Postmark" },
      { slug: "/resend", title: "Resend" },
      { slug: "/sendgrid", title: "SendGrid" },
      { slug: "/smtp", title: "SMTP" },
      { slug: "/sparkpost", title: "SparkPost" },
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
            slug: "/sending-an-internal-message",
            title: "Sending an internal message",
          },
          {
            slug: "/sending-a-direct-message",
            title: "Sending a direct message",
          },
          {
            slug: "/sending-a-message-to-channels",
            title: "Sending a message to channels",
          },
        ],
      },
      {
        title: "Microsoft Teams",
        slug: "/microsoft-teams",
        pages: [
          { slug: "/overview", title: "Overview" },
          {
            slug: "/sending-an-internal-message",
            title: "Sending an internal message",
          },
          {
            slug: "/sending-a-direct-message",
            title: "Sending a direct message",
          },
          {
            slug: "/sending-a-message-to-channels",
            title: "Sending a message to channels",
          },
        ],
      },
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
      { slug: "/token-deregistration", title: "Token deregistration" },
      { slug: "/apns", title: "Apple (APNS)" },
      { slug: "/firebase", title: "Firebase (FCM)" },
      { slug: "/expo", title: "Expo (React Native)" },
      { slug: "/one-signal", title: "OneSignal" },
    ],
  },
  {
    title: "SMS",
    slug: "/integrations/sms",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/settings-and-overrides", title: "Settings and overrides" },
      { slug: "/africas-talking", title: "Africa's Talking" },
      { slug: "/aws-sns", title: "AWS SNS" },
      { slug: "/mailersend", title: "MailerSend" },
      { slug: "/messagebird", title: "MessageBird" },
      { slug: "/plivo", title: "Plivo" },
      { slug: "/sinch", title: "Sinch" },
      { slug: "/sinch-message-media", title: "Sinch MessageMedia" },
      { slug: "/telnyx", title: "Telnyx" },
      { slug: "/twilio", title: "Twilio" },
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
      { slug: "/new-relic", title: "New Relic" },
      { slug: "/segment", title: "Segment" },
      { slug: "/heap", title: "Heap" },
      { slug: "/data-sync", title: "Data warehouse sync" },
    ],
  },
];
