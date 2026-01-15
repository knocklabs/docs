#!/usr/bin/env tsx

import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import yaml from "yaml";
import { resolveEndpointFromMethod } from "../components/ui/ApiReference/helpers";
import JSONPointer from "jsonpointer";
import { readOpenApiSpec, readStainlessSpec } from "../lib/openApiSpec";
import {
  MAPI_REFERENCE_OVERVIEW_CONTENT,
  RESOURCE_ORDER as MAPI_RESOURCE_ORDER,
} from "../data/sidebars/mapiOverviewSidebar";
import {
  API_REFERENCE_OVERVIEW_CONTENT,
  RESOURCE_ORDER as API_RESOURCE_ORDER,
} from "../data/sidebars/apiOverviewSidebar";
import { CLI_SIDEBAR } from "../data/sidebars/cliSidebar";

// Utility functions
async function parseFrontmatter(markdownContent) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .parse(markdownContent);

  const yamlNode = file.children.find((node) => node.type === "yaml");
  if (!yamlNode) return null;
  return yaml.parse(yamlNode.value);
}

// Clean JSX content to plain markdown
function cleanJsxContent(content: string): string {
  return (
    content
      // Remove ContentColumn and ExampleColumn wrappers
      .replace(/<ContentColumn>/g, "")
      .replace(/<\/ContentColumn>/g, "")
      .replace(/<ExampleColumn>/g, "")
      .replace(/<\/ExampleColumn>/g, "")
      // Remove div wrappers with className
      .replace(/<div[^>]*className[^>]*>/g, "")
      .replace(/<\/div>/g, "")
      // Convert Callout components to blockquotes
      .replace(
        /<Callout[^>]*title="([^"]*)"[^>]*text=\{[^}]*<>[^<]*([\s\S]*?)<\/>[^}]*\}[^/]*\/>/g,
        (_, title, text) => {
          const cleanText = text
            .replace(/<[^>]+>/g, "")
            .replace(/\s+/g, " ")
            .trim();
          return `> **${title}** ${cleanText}\n\n`;
        },
      )
      // Simpler Callout format
      .replace(/<Callout[^>]*title="([^"]*)"[^>]*\/>/g, "> **$1**\n\n")
      // Remove Callout with just type and text
      .replace(
        /<Callout[^>]*text=\{[^}]*<>([\s\S]*?)<\/>[^}]*\}[^/]*\/>/g,
        (_, text) => {
          const cleanText = text
            .replace(/<[^>]+>/g, "")
            .replace(/\s+/g, " ")
            .trim();
          return `> ${cleanText}\n\n`;
        },
      )
      // Remove Table components (they use JSX)
      .replace(/<Table[\s\S]*?\/>/g, "")
      // Remove Attributes/Attribute components
      .replace(/<Attributes>[\s\S]*?<\/Attributes>/g, "")
      // Remove Endpoints/Endpoint components
      .replace(/<Endpoints[\s\S]*?<\/Endpoints>/g, "")
      // Remove MultiLangCodeBlock
      .replace(/<MultiLangCodeBlock[^>]*\/>/g, "")
      // Remove ErrorExample components
      .replace(/<ErrorExample[\s\S]*?\/>/g, "")
      // Remove RateLimit components
      .replace(/<RateLimit[^>]*\/>/g, "")
      // Remove PreTextDiagram wrapper but keep content
      .replace(/<PreTextDiagram[^>]*>/g, "")
      .replace(/<\/PreTextDiagram>/g, "")
      // Remove JSX comments
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
      // Remove span tags but keep content
      .replace(/<span[^>]*>([^<]*)<\/span>/g, "$1")
      // Remove anchor tags but keep text
      .replace(/<a[^>]*>([^<]*)<\/a>/g, "$1")
      // Remove standalone anchor elements
      .replace(/<a[^>]*\/>/g, "")
      // Remove empty lines at start/end and normalize whitespace
      .replace(/^\s+/, "")
      .replace(/\s+$/, "")
      // Normalize multiple newlines
      .replace(/\n{3,}/g, "\n\n")
  );
}

// Parse section-based MDX content and extract sections by slug or path
function parseSectionContent(
  mdxContent: string,
  keyAttribute: "slug" | "path" = "slug",
): Map<string, string> {
  const sections = new Map<string, string>();

  // Match Section components with their slug/path and content
  const sectionRegex = new RegExp(
    `<Section[^>]*${keyAttribute}="([^"]+)"[^>]*>([\\s\\S]*?)<\\/Section>`,
    "g",
  );

  let match;
  while ((match = sectionRegex.exec(mdxContent)) !== null) {
    const key = match[1];
    const content = cleanJsxContent(match[2]);
    sections.set(key, content);
  }

  return sections;
}

// Load and parse the overview content from the MDX file
function loadOverviewContent(apiType: "api" | "mapi"): Map<string, string> {
  const contentPath = path.join(
    process.cwd(),
    "content",
    apiType === "api" ? "__api-reference" : "__mapi-reference",
    "content.mdx",
  );

  if (!fs.existsSync(contentPath)) {
    return new Map();
  }

  const mdxContent = fs.readFileSync(contentPath, "utf-8");
  return parseSectionContent(mdxContent);
}

// Main function to generate a single API reference markdown file
async function generateApiReferenceMarkdownFiles(
  apiType: "api" | "mapi" = "api",
) {
  try {
    const fileName =
      apiType === "api" ? "api-reference.md" : "mapi-reference.md";
    const filePath = path.join(process.cwd(), "public", fileName);

    // Get API specs
    const openApiSpec = await readOpenApiSpec(apiType);
    const stainlessSpec = await readStainlessSpec(apiType);

    // Get the appropriate sidebar content and resource order
    const { overviewContent, resourceOrder } =
      apiType === "api"
        ? {
            overviewContent: API_REFERENCE_OVERVIEW_CONTENT,
            resourceOrder: API_RESOURCE_ORDER,
          }
        : {
            overviewContent: MAPI_REFERENCE_OVERVIEW_CONTENT,
            resourceOrder: MAPI_RESOURCE_ORDER,
          };

    let content = `# ${
      apiType === "api" ? "API" : "Management API"
    } Reference\n\n`;

    // Load overview content from section-based MDX file
    const sectionContent = loadOverviewContent(apiType);

    // Add overview content sections
    for (const section of overviewContent) {
      if (section.pages) {
        for (const page of section.pages) {
          // Extract the slug without the leading slash
          const slug = page.slug === "/" ? "overview" : page.slug.slice(1);
          const pageContent = sectionContent.get(slug) || "";

          content += `## ${page.title}\n\n`;
          if (pageContent) {
            content += pageContent + "\n\n";
          }
        }
      }
    }

    // Add resource content
    for (const resourceName of resourceOrder) {
      const resource = stainlessSpec.resources[resourceName];

      // Add resource overview
      content += getResourceOverviewContent(
        resource,
        resourceName,
        openApiSpec,
      );

      // Add method content
      if (resource.methods) {
        for (const [methodName, method] of Object.entries(resource.methods)) {
          content += getMethodMarkdownContent(methodName, method, openApiSpec);
        }
      }

      // Add subresource content
      if (resource.subresources) {
        for (const [subresourceName, subresource] of Object.entries(
          resource.subresources,
        )) {
          content += getSubresourceMarkdownContent(
            subresourceName,
            subresource,
            openApiSpec,
          );
        }
      }

      // Add schema content
      if (resource.models) {
        for (const [modelName, modelRef] of Object.entries(resource.models)) {
          content += getSchemaMarkdownContent(
            modelName,
            modelRef as string,
            openApiSpec,
          );
        }
      }
    }

    fs.writeFileSync(filePath, content, "utf-8");

    console.log(
      `✅ ${apiType.toUpperCase()} reference markdown file generated successfully`,
    );
  } catch (error) {
    console.error(
      `Error generating ${apiType.toUpperCase()} reference markdown file:`,
      error,
    );
    throw error;
  }
}

// Function to generate both API and MAPI reference files
async function generateAllApiReferenceMarkdownFiles() {
  await generateApiReferenceMarkdownFiles("api");
  await generateApiReferenceMarkdownFiles("mapi");
}

function getResourceOverviewContent(
  resource: any,
  resourceName: string,
  openApiSpec: any,
): string {
  let content = `## ${resource.name || resourceName}\n\n`;

  if (resource.description) {
    content += `${resource.description}\n\n`;
  }

  // Add available endpoints
  if (resource.methods) {
    content += `### Available endpoints\n\n`;
    for (const [methodName, method] of Object.entries(resource.methods)) {
      const [methodType, endpoint] = resolveEndpointFromMethod(
        method as string | { endpoint: string },
      );
      const openApiOperation = openApiSpec.paths?.[endpoint]?.[methodType];
      const summary = openApiOperation?.summary || methodName;

      content += `- **${methodType.toUpperCase()}** \`${endpoint}\` - ${summary}\n`;
    }
    content += "\n";
  }

  return content;
}

function getMethodMarkdownContent(
  methodName: string,
  method: any,
  openApiSpec: any,
): string {
  const [methodType, endpoint] = resolveEndpointFromMethod(
    method as string | { endpoint: string },
  );
  const openApiOperation = openApiSpec.paths?.[endpoint]?.[methodType];

  if (!openApiOperation) return "";

  let content = `### ${openApiOperation.summary || methodName}\n\n`;

  if (openApiOperation.description) {
    content += `${openApiOperation.description}\n\n`;
  }

  // Add endpoint information
  content += `#### Endpoint\n\n`;
  content += `\`${methodType.toUpperCase()} ${endpoint}\`\n\n`;

  // Add rate limit info if available
  if (openApiOperation["x-ratelimit-tier"]) {
    content += `**Rate limit tier:** ${openApiOperation["x-ratelimit-tier"]}\n\n`;
  }

  // Add parameters
  const parameters = openApiOperation.parameters || [];
  const pathParams = parameters.filter((p: any) => p.in === "path");
  const queryParams = parameters.filter((p: any) => p.in === "query");

  if (pathParams.length > 0) {
    content += `#### Path parameters\n\n`;
    for (const param of pathParams) {
      content += `- **${param.name}** (${param.schema?.type || "string"})`;
      if (param.required) content += ` *required*`;
      if (param.description) content += ` - ${param.description}`;
      content += "\n";
    }
    content += "\n";
  }

  if (queryParams.length > 0) {
    content += `#### Query parameters\n\n`;
    for (const param of queryParams) {
      content += `- **${param.name}** (${param.schema?.type || "string"})`;
      if (param.required) content += ` *required*`;
      if (param.description) content += ` - ${param.description}`;
      content += "\n";
    }
    content += "\n";
  }

  // Add request body if present
  const requestBody =
    openApiOperation.requestBody?.content?.["application/json"]?.schema;
  if (requestBody) {
    content += `#### Request body\n\n`;
    if (requestBody.description) {
      content += `${requestBody.description}\n\n`;
    }
    if (requestBody.example) {
      content += `##### Example\n\n`;
      content += `\`\`\`json\n${JSON.stringify(
        requestBody.example,
        null,
        2,
      )}\n\`\`\`\n\n`;
    }
  }

  // Add response information
  if (openApiOperation.responses) {
    content += `#### Responses\n\n`;
    for (const [status, response] of Object.entries(
      openApiOperation.responses,
    )) {
      content += `##### ${status}\n\n`;
      if ((response as any).description) {
        content += `${(response as any).description}\n\n`;
      }

      const responseSchema = (response as any).content?.["application/json"]
        ?.schema;
      if (responseSchema?.example) {
        content += `###### Example\n\n`;
        content += `\`\`\`json\n${JSON.stringify(
          responseSchema.example,
          null,
          2,
        )}\n\`\`\`\n\n`;
      }
    }
  }

  return content;
}

function getSubresourceMarkdownContent(
  subresourceName: string,
  subresource: any,
  openApiSpec: any,
): string {
  let content = "";

  // Add subresource overview
  content += `### ${subresource.name || subresourceName}\n\n`;

  if (subresource.description) {
    content += `${subresource.description}\n\n`;
  }

  // Add available endpoints
  if (subresource.methods) {
    content += `#### Available endpoints\n\n`;
    for (const [methodName, method] of Object.entries(subresource.methods)) {
      const [methodType, endpoint] = resolveEndpointFromMethod(
        method as string | { endpoint: string },
      );
      const openApiOperation = openApiSpec.paths?.[endpoint]?.[methodType];
      const summary = openApiOperation?.summary || methodName;

      content += `- **${methodType.toUpperCase()}** \`${endpoint}\` - ${summary}\n`;
    }
    content += "\n";
  }

  // Add method content for subresource
  if (subresource.methods) {
    for (const [methodName, method] of Object.entries(subresource.methods)) {
      const [methodType, endpoint] = resolveEndpointFromMethod(
        method as string | { endpoint: string },
      );
      const openApiOperation = openApiSpec.paths?.[endpoint]?.[methodType];

      if (openApiOperation) {
        content += `#### ${openApiOperation.summary || methodName}\n\n`;

        if (openApiOperation.description) {
          content += `${openApiOperation.description}\n\n`;
        }

        content += `**Endpoint:** \`${methodType.toUpperCase()} ${endpoint}\`\n\n`;

        if (openApiOperation["x-ratelimit-tier"]) {
          content += `**Rate limit tier:** ${openApiOperation["x-ratelimit-tier"]}\n\n`;
        }

        // Add parameters
        const parameters = openApiOperation.parameters || [];
        const pathParams = parameters.filter((p: any) => p.in === "path");
        const queryParams = parameters.filter((p: any) => p.in === "query");

        if (pathParams.length > 0) {
          content += `**Path parameters:**\n\n`;
          for (const param of pathParams) {
            content += `- **${param.name}** (${
              param.schema?.type || "string"
            })`;
            if (param.required) content += ` *required*`;
            if (param.description) content += ` - ${param.description}`;
            content += "\n";
          }
          content += "\n";
        }

        if (queryParams.length > 0) {
          content += `**Query parameters:**\n\n`;
          for (const param of queryParams) {
            content += `- **${param.name}** (${
              param.schema?.type || "string"
            })`;
            if (param.required) content += ` *required*`;
            if (param.description) content += ` - ${param.description}`;
            content += "\n";
          }
          content += "\n";
        }
      }
    }
  }

  // Add schema content for subresource
  if (subresource.models) {
    for (const [modelName, modelRef] of Object.entries(subresource.models)) {
      content += getSchemaMarkdownContent(
        modelName,
        modelRef as string,
        openApiSpec,
      );
    }
  }

  return content;
}

function getSchemaMarkdownContent(
  modelName: string,
  modelRef: string,
  openApiSpec: any,
): string {
  const schema = JSONPointer.get(
    openApiSpec,
    (modelRef as string).replace("#", ""),
  );

  if (!schema) return "";

  let content = `### ${schema.title || modelName}\n\n`;

  if (schema.description) {
    content += `${schema.description}\n\n`;
  }

  content += `#### Attributes\n\n`;

  if (schema.properties) {
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const prop = propSchema as any;
      content += `- **${propName}** (${prop.type || "unknown"})`;
      if (schema.required && schema.required.includes(propName)) {
        content += ` *required*`;
      }
      if (prop.description) {
        content += ` - ${prop.description}`;
      }
      content += "\n";
    }
    content += "\n";
  }

  if (schema.example) {
    content += `#### Example\n\n`;
    content += `\`\`\`json\n${JSON.stringify(
      schema.example,
      null,
      2,
    )}\n\`\`\`\n\n`;
  }

  return content;
}

// Generate CLI reference markdown file
async function generateCliReferenceMarkdownFile() {
  try {
    const fileName = "cli.md";
    const filePath = path.join(process.cwd(), "public", fileName);

    // Load CLI content from MDX file
    const contentPath = path.join(
      process.cwd(),
      "content",
      "__cli",
      "content.mdx",
    );

    if (!fs.existsSync(contentPath)) {
      console.warn("⚠️ CLI content file not found, skipping CLI reference");
      return;
    }

    const mdxContent = fs.readFileSync(contentPath, "utf-8");
    const sectionContent = parseSectionContent(mdxContent, "path");

    let content = `# CLI Reference\n\n`;

    // Iterate through CLI sidebar to maintain order
    for (const section of CLI_SIDEBAR) {
      if (section.title) {
        content += `## ${section.title}\n\n`;
      }

      if (section.pages) {
        for (const page of section.pages) {
          // Build the full path from section slug + page slug
          const fullPath = `${section.slug.replace("/cli", "")}${page.slug}`;
          const pageContent = sectionContent.get(fullPath) || "";

          if (page.title) {
            content += `### ${page.title}\n\n`;
          }

          if (pageContent) {
            content += pageContent + "\n\n";
          }
        }
      }
    }

    fs.writeFileSync(filePath, content, "utf-8");
    console.log("✅ CLI reference markdown file generated successfully");
  } catch (error) {
    console.error("Error generating CLI reference markdown file:", error);
    throw error;
  }
}

async function run() {
  try {
    console.log("🚀 Generating API, MAPI, and CLI reference markdown files...");
    await generateAllApiReferenceMarkdownFiles();
    await generateCliReferenceMarkdownFile();
    console.log("✅ All reference markdown files generated successfully!");
    console.log("  - public/api-reference.md");
    console.log("  - public/mapi-reference.md");
    console.log("  - public/cli.md");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error generating reference files:", error);
    process.exit(1);
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  run();
}

export {
  generateApiReferenceMarkdownFiles,
  generateAllApiReferenceMarkdownFiles,
  generateCliReferenceMarkdownFile,
};
