import { SidebarContent } from "../types";

const baseSlug = "/developer-tools";

export const parentSection = {
  slug: baseSlug,
  title: "Developer tools",
};

export const DEVELOPER_TOOLS_SIDEBAR_CONTENT: SidebarContent[] = [
  { slug: `${baseSlug}/overview`, title: "Overview" },
  { slug: `${baseSlug}/api-keys`, title: "API keys" },
  { slug: `${baseSlug}/service-tokens`, title: "Service tokens" },
  { slug: `${baseSlug}/knock-cli`, title: "Knock CLI" },
  { slug: `${baseSlug}/sdks`, title: "SDKs" },
  { slug: `${baseSlug}/management-api`, title: "Management API" },
  { slug: `${baseSlug}/api-logs`, title: "API logs" },
  { slug: `${baseSlug}/knock-and-postman`, title: "Knock and Postman" },
  { slug: `${baseSlug}/security`, title: "Security" },
  { slug: `${baseSlug}/type-safety`, title: "Type safety" },
  {
    slug: `${baseSlug}/integrating-into-cicd`,
    title: "Integrating into CI/CD",
  },
  {
    slug: `${baseSlug}/outbound-webhooks`,
    title: "Outbound webhooks",
    pages: [
      { slug: "/overview", title: "Overview" },
      { slug: "/event-types", title: "Event types" },
    ],
  },
  {
    slug: `${baseSlug}/migration-guides`,
    title: "Migration manuals",
    pages: [
      { slug: "/node", title: "Node.js 1.0" },
      { slug: "/python", title: "Python 1.0" },
      { slug: "/java", title: "Java 1.0" },
      { slug: "/ruby", title: "Ruby 1.0" },
      { slug: "/go", title: "Go 1.0" },
    ],
  },
  {
    slug: `${baseSlug}/agent-toolkit`,
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
    slug: `${baseSlug}/mcp-server`,
    title: "MCP server",
    isBeta: true,
  },
  {
    slug: `${baseSlug}/building-with-llms`,
    title: "Building with LLMs",
  },
];
