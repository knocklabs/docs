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

// Ensure directory exists
function ensureDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Write markdown file with directory creation
function writeMarkdownFile(filePath: string, content: string) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content, "utf-8");
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
      // Convert Attributes/Attribute components to markdown list
      .replace(/<Attributes>([\s\S]*?)<\/Attributes>/g, (_, inner) => {
        // Extract individual Attribute components and convert to list items
        // Handles both single-line and multi-line formats
        const attrRegex =
          /<Attribute[\s\S]*?name="([^"]+)"[\s\S]*?type="([^"]+)"[\s\S]*?description="([^"]+)"[\s\S]*?\/>/g;
        let result = "";
        let match;
        while ((match = attrRegex.exec(inner)) !== null) {
          result += `- **${match[1]}** (${match[2]}): ${match[3]}\n`;
        }
        return result || "";
      })
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
  // Use a more permissive pattern for attributes since titles may contain < and > characters
  // We look for the keyAttribute value and then match until </Section>
  const sectionRegex = new RegExp(
    `<Section[^]*?${keyAttribute}="([^"]+)"[^]*?>([\\s\\S]*?)<\\/Section>`,
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

// Main function to generate API reference markdown files
// Generates: 1) combined file, 2) per-resource files, 3) per-method files
async function generateApiReferenceMarkdownFiles(
  apiType: "api" | "mapi" = "api",
) {
  try {
    const baseDir = apiType === "api" ? "api-reference" : "mapi-reference";
    const combinedFileName =
      apiType === "api" ? "api-reference.md" : "mapi-reference.md";
    const combinedFilePath = path.join(
      process.cwd(),
      "public",
      combinedFileName,
    );

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

    let combinedContent = `# ${
      apiType === "api" ? "API" : "Management API"
    } Reference\n\n`;

    // Load overview content from section-based MDX file
    const sectionContent = loadOverviewContent(apiType);

    // Generate overview section pages
    for (const section of overviewContent) {
      if (section.pages) {
        for (const page of section.pages) {
          // Extract the slug without the leading slash
          const slug = page.slug === "/" ? "overview" : page.slug.slice(1);
          const pageContent = sectionContent.get(slug) || "";

          // Add to combined file
          combinedContent += `## ${page.title}\n\n`;
          if (pageContent) {
            combinedContent += pageContent + "\n\n";
          }

          // Generate individual overview page file
          if (pageContent) {
            const overviewPagePath = path.join(
              process.cwd(),
              "public",
              baseDir,
              "overview",
              `${slug}.md`,
            );
            const overviewPageContent = `# ${page.title}\n\n${pageContent}\n`;
            writeMarkdownFile(overviewPagePath, overviewPageContent);
          }
        }
      }
    }

    // Add resource content
    for (const resourceName of resourceOrder) {
      const resource = stainlessSpec.resources[resourceName];
      if (!resource) continue;

      // Generate per-resource combined file
      let resourceContent = "";

      // Add resource overview
      const resourceOverview = getResourceOverviewContent(
        resource,
        resourceName,
        openApiSpec,
      );
      combinedContent += resourceOverview;
      resourceContent += resourceOverview;

      // Add method content
      if (resource.methods) {
        for (const [methodName, method] of Object.entries(resource.methods)) {
          const methodContent = getMethodMarkdownContent(
            methodName,
            method,
            openApiSpec,
          );
          combinedContent += methodContent;
          resourceContent += methodContent;

          // Generate individual method page
          if (methodContent.trim()) {
            const methodPagePath = path.join(
              process.cwd(),
              "public",
              baseDir,
              resourceName,
              `${methodName}.md`,
            );
            writeMarkdownFile(methodPagePath, methodContent);
          }
        }
      }

      // Add subresource content (with nested path support)
      if (resource.subresources) {
        for (const [subresourceName, subresource] of Object.entries(
          resource.subresources,
        )) {
          const subresourceContent = getSubresourceMarkdownContent(
            subresourceName,
            subresource,
            openApiSpec,
          );
          combinedContent += subresourceContent;
          resourceContent += subresourceContent;

          // Generate individual subresource and method pages
          generateSubresourcePages(
            baseDir,
            resourceName,
            [subresourceName],
            subresource,
            openApiSpec,
          );
        }
      }

      // Add schema content
      if (resource.models) {
        for (const [modelName, modelRef] of Object.entries(resource.models)) {
          const schemaContent = getSchemaMarkdownContent(
            modelName,
            modelRef as string,
            openApiSpec,
          );
          combinedContent += schemaContent;
          resourceContent += schemaContent;

          // Generate individual schema page
          if (schemaContent.trim()) {
            const schemaPagePath = path.join(
              process.cwd(),
              "public",
              baseDir,
              resourceName,
              "schemas",
              `${modelName}.md`,
            );
            writeMarkdownFile(schemaPagePath, schemaContent);
          }
        }
      }

      // Write the per-resource combined file
      const resourceFilePath = path.join(
        process.cwd(),
        "public",
        baseDir,
        `${resourceName}.md`,
      );
      writeMarkdownFile(resourceFilePath, resourceContent);
    }

    // Write the combined file
    fs.writeFileSync(combinedFilePath, combinedContent, "utf-8");

    console.log(
      `✅ ${apiType.toUpperCase()} reference markdown files generated successfully`,
    );
  } catch (error) {
    console.error(
      `Error generating ${apiType.toUpperCase()} reference markdown files:`,
      error,
    );
    throw error;
  }
}

// Generate pages for subresources recursively
function generateSubresourcePages(
  baseDir: string,
  resourceName: string,
  subresourcePath: string[],
  subresource: any,
  openApiSpec: any,
) {
  // Build the directory path for this subresource
  const subresourceDir = path.join(
    process.cwd(),
    "public",
    baseDir,
    resourceName,
    ...subresourcePath,
  );

  // Generate index.md for the subresource overview
  let indexContent = `# ${
    subresource.name || subresourcePath[subresourcePath.length - 1]
  }\n\n`;

  if (subresource.description) {
    indexContent += `${subresource.description}\n\n`;
  }

  // Add list of available methods
  if (subresource.methods && Object.keys(subresource.methods).length > 0) {
    indexContent += `## Available endpoints\n\n`;
    for (const [methodName, method] of Object.entries(subresource.methods)) {
      const [methodType, endpoint] = resolveEndpointFromMethod(
        method as string | { endpoint: string },
      );
      const openApiOperation = openApiSpec.paths?.[endpoint]?.[methodType];
      const summary = openApiOperation?.summary || methodName;
      indexContent += `- **${methodType.toUpperCase()}** \`${endpoint}\` - ${summary}\n`;
    }
    indexContent += "\n";
  }

  // Add list of schemas if any
  if (subresource.models && Object.keys(subresource.models).length > 0) {
    indexContent += `## Object definitions\n\n`;
    for (const [modelName, modelRef] of Object.entries(subresource.models)) {
      const schema = JSONPointer.get(
        openApiSpec,
        (modelRef as string).replace("#", ""),
      );
      const title = schema?.title || modelName;
      indexContent += `- [${title}](./schemas/${modelName}.md)\n`;
    }
    indexContent += "\n";
  }

  const indexPagePath = path.join(subresourceDir, "index.md");
  writeMarkdownFile(indexPagePath, indexContent);

  // Generate method pages for this subresource
  if (subresource.methods) {
    for (const [methodName, method] of Object.entries(subresource.methods)) {
      const [methodType, endpoint] = resolveEndpointFromMethod(
        method as string | { endpoint: string },
      );
      const openApiOperation = openApiSpec.paths?.[endpoint]?.[methodType];

      if (openApiOperation) {
        let methodContent = `### ${openApiOperation.summary || methodName}\n\n`;

        if (openApiOperation.description) {
          methodContent += `${openApiOperation.description}\n\n`;
        }

        methodContent += `**Endpoint:** \`${methodType.toUpperCase()} ${endpoint}\`\n\n`;

        if (openApiOperation["x-ratelimit-tier"]) {
          methodContent += `**Rate limit tier:** ${openApiOperation["x-ratelimit-tier"]}\n\n`;
        }

        const methodPagePath = path.join(subresourceDir, `${methodName}.md`);
        writeMarkdownFile(methodPagePath, methodContent);
      }
    }
  }

  // Generate schema pages for this subresource
  if (subresource.models) {
    for (const [modelName, modelRef] of Object.entries(subresource.models)) {
      const schemaContent = getSchemaMarkdownContent(
        modelName,
        modelRef as string,
        openApiSpec,
      );

      if (schemaContent.trim()) {
        const schemaPagePath = path.join(
          subresourceDir,
          "schemas",
          `${modelName}.md`,
        );
        writeMarkdownFile(schemaPagePath, schemaContent);
      }
    }
  }

  // Recursively process nested subresources
  if (subresource.subresources) {
    for (const [nestedName, nestedSubresource] of Object.entries(
      subresource.subresources,
    )) {
      generateSubresourcePages(
        baseDir,
        resourceName,
        [...subresourcePath, nestedName],
        nestedSubresource,
        openApiSpec,
      );
    }
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

// Load CLI content from individual MDX files in content/cli/
function loadCliSectionContent(resourceName: string): Map<string, string> {
  const contentPath = path.join(
    process.cwd(),
    "content",
    "cli",
    `${resourceName}.mdx`,
  );

  if (!fs.existsSync(contentPath)) {
    return new Map();
  }

  const mdxContent = fs.readFileSync(contentPath, "utf-8");
  return parseSectionContent(mdxContent, "path");
}

// Generate CLI reference markdown files
// Generates: 1) combined file, 2) per-resource files, 3) per-method files
async function generateCliReferenceMarkdownFile() {
  try {
    const combinedFilePath = path.join(process.cwd(), "public", "cli.md");
    const baseDir = "cli";

    let combinedContent = `# CLI Reference\n\n`;

    // Iterate through CLI sidebar to maintain order
    for (const section of CLI_SIDEBAR) {
      // Extract resource name from section slug (e.g., "/cli/overview" -> "overview")
      const resourceMatch = section.slug.match(/^\/cli\/(.+)$/);
      if (!resourceMatch) continue;

      const resourceName = resourceMatch[1];

      // Load content for this resource from its MDX file
      const sectionContent = loadCliSectionContent(resourceName);

      let resourceContent = "";

      if (section.title) {
        combinedContent += `## ${section.title}\n\n`;
        resourceContent += `# ${section.title}\n\n`;
      }

      if (section.pages) {
        for (const page of section.pages) {
          // Build the full path from section slug + page slug
          // e.g., "/overview" + "/installation" -> "/overview/installation"
          // For root pages (slug="/"), the path is just the resource path (e.g., "/overview")
          const basePath = section.slug.replace("/cli", "");
          const fullPath =
            page.slug === "/" ? basePath : `${basePath}${page.slug}`;
          const pageContent = sectionContent.get(fullPath) || "";

          if (page.title) {
            combinedContent += `### ${page.title}\n\n`;
            resourceContent += `## ${page.title}\n\n`;
          }

          if (pageContent) {
            combinedContent += pageContent + "\n\n";
            resourceContent += pageContent + "\n\n";

            // Generate individual method/page file
            // Handle root page (slug = "/") specially
            const pageSlug =
              page.slug === "/" ? "index" : page.slug.replace(/^\//, "");
            const pageFilePath = path.join(
              process.cwd(),
              "public",
              baseDir,
              resourceName,
              `${pageSlug}.md`,
            );

            let individualPageContent = "";
            if (page.title) {
              individualPageContent += `# ${page.title}\n\n`;
            }
            individualPageContent += pageContent + "\n";

            writeMarkdownFile(pageFilePath, individualPageContent);
          }
        }
      }

      // Write the per-resource combined file
      if (resourceContent.trim()) {
        const resourceFilePath = path.join(
          process.cwd(),
          "public",
          baseDir,
          `${resourceName}.md`,
        );
        writeMarkdownFile(resourceFilePath, resourceContent);
      }
    }

    // Write the combined file
    fs.writeFileSync(combinedFilePath, combinedContent, "utf-8");
    console.log("✅ CLI reference markdown files generated successfully");
  } catch (error) {
    console.error("Error generating CLI reference markdown files:", error);
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
