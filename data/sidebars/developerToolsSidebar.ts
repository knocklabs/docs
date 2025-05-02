import { SidebarSection } from "../types";

export const DEVELOPER_TOOLS_SIDEBAR: SidebarSection[] = [
  {
    title: "Developer tools",
    slug: "/developer-tools",
    desc: "Use our powerful developer tools in order to integrate Knock seamlessly into your development workflow.",
    sidebarMenuDefaultOpen: true,
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/api-keys", title: "API keys" },
      { slug: "/service-tokens", title: "Service tokens" },
      { slug: "/knock-cli", title: "Knock CLI" },
      { slug: "/sdks", title: "SDKs" },
      { slug: "/management-api", title: "Management API" },
      { slug: "/api-logs", title: "API logs" },
      { slug: "/knock-and-postman", title: "Knock and Postman" },
      { slug: "/security", title: "Security" },
      { slug: "/integrating-into-cicd", title: "Integrating into CI/CD" },
      {
        slug: "/outbound-webhooks",
        title: "Outbound webhooks",
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/event-types", title: "Event types" },
        ],
      },
      { slug: "/validating-trigger-data", title: "Validating trigger data" },
      {
        slug: "/migration-guides",
        title: "Migration guides",
        pages: [
          { slug: "/node", title: "Node.js 1.0" },
          { slug: "/python", title: "Python 1.0" },
          { slug: "/java", title: "Java 1.0" },
          { slug: "/ruby", title: "Ruby 1.0" },
          { slug: "/go", title: "Go 1.0" },
        ],
      },
      {
        slug: "/agent-toolkit",
        title: "Agent Toolkit",
        isBeta: true,
        pages: [
          { slug: "/overview", title: "Overview" },
          { slug: "/getting-started", title: "Getting started" },
          {
            slug: "/workflows-as-tools",
            title: "Workflows-as-tools",
          },
          {
            slug: "/human-in-the-loop-flows",
            title: "Human-in-the-loop flows",
          },
          {
            slug: "/providing-context",
            title: "Providing context",
          },
          {
            slug: "/working-with-environments",
            title: "Working with environments",
          },
          {
            slug: "/tools-reference",
            title: "Tools reference",
          },
        ],
      },
      {
        slug: "/mcp-server",
        title: "MCP server",
        isBeta: true,
      },
      {
        slug: "/building-with-llms",
        title: "Building with LLMs",
      },
    ],
  },
];
