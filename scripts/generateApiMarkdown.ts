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

async function getMarkdownContent(slug) {
  try {
    let markdownPath = path.join(
      process.cwd(),
      "content",
      `${slug.slice(1)}.mdx`,
    );

    // Try accessing a regular .md file if the .mdx file doesn't exist
    if (!fs.existsSync(markdownPath)) {
      markdownPath = path.join(process.cwd(), "content", `${slug.slice(1)}.md`);
    }

    if (fs.existsSync(markdownPath)) {
      const content = fs.readFileSync(markdownPath, "utf-8");
      const frontmatter = await parseFrontmatter(content);
      return {
        ...frontmatter,
        description: frontmatter?.description || "",
        fullContent: content,
      };
    } else {
      const noErrorPaths = ["/api-reference", "/mapi-reference", "/cli"];
      const noError = noErrorPaths.some((path) => slug.startsWith(path));

      if (noError) {
        return { description: "", fullContent: "" };
      }

      throw new Error(
        `Error: Could not load content for ${slug}. This page is likely a 404 on the site - please double check that the path exists and is accessible.`,
      );
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
  return { description: "", fullContent: "" };
}

// Main function to generate individual API reference markdown files
async function generateApiReferenceMarkdownFiles(
  apiType: "api" | "mapi" = "api",
) {
  try {
    const referenceDir = apiType === "api" ? "api-reference" : "mapi-reference";
    const apiReferenceDir = path.join(process.cwd(), "public", referenceDir);

    // Ensure the reference directory exists
    if (!fs.existsSync(apiReferenceDir)) {
      fs.mkdirSync(apiReferenceDir, { recursive: true });
    }

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

    // Generate pre-sidebar content files (like overview pages)
    for (const section of overviewContent) {
      if (section.pages) {
        const sectionDir = path.join(
          apiReferenceDir,
          section.slug.replace(`/${referenceDir}/`, ""),
        );
        fs.mkdirSync(sectionDir, { recursive: true });

        for (const page of section.pages) {
          const pageSlug = `${section.slug}${page.slug}`;
          const { description, fullContent: pageContent } =
            await getMarkdownContent(pageSlug);

          let markdownContent = `# ${page.title}\n\n`;
          if (description) {
            markdownContent += `${description}\n\n`;
          }
          if (pageContent) {
            markdownContent += pageContent;
          }

          const fileName =
            page.slug === "/" ? "index.md" : `${page.slug.slice(1)}.md`;
          const filePath = path.join(sectionDir, fileName);
          fs.writeFileSync(filePath, markdownContent, "utf-8");
        }
      }
    }

    // Generate resource-specific files
    for (const resourceName of resourceOrder) {
      const resource = stainlessSpec.resources[resourceName];
      const resourceDir = path.join(apiReferenceDir, resourceName);
      fs.mkdirSync(resourceDir, { recursive: true });

      // Generate resource overview file
      await generateResourceOverview(
        resource,
        resourceName,
        resourceDir,
        openApiSpec,
      );

      // Generate method files
      if (resource.methods) {
        for (const [methodName, method] of Object.entries(resource.methods)) {
          await generateMethodMarkdown(
            methodName,
            method,
            resource,
            resourceName,
            resourceDir,
            openApiSpec,
          );
        }
      }

      // Generate subresource files
      if (resource.subresources) {
        for (const [subresourceName, subresource] of Object.entries(
          resource.subresources,
        )) {
          await generateSubresourceMarkdown(
            subresourceName,
            subresource,
            resourceName,
            resourceDir,
            openApiSpec,
          );
        }
      }

      // Generate schema files
      if (resource.models) {
        const schemasDir = path.join(resourceDir, "schemas");
        fs.mkdirSync(schemasDir, { recursive: true });

        for (const [modelName, modelRef] of Object.entries(resource.models)) {
          await generateSchemaMarkdown(
            modelName,
            modelRef as string,
            schemasDir,
            openApiSpec,
          );
        }
      }
    }

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

// Function to generate both API and MAPI reference files
async function generateAllApiReferenceMarkdownFiles() {
  await generateApiReferenceMarkdownFiles("api");
  await generateApiReferenceMarkdownFiles("mapi");
}

async function generateResourceOverview(
  resource: any,
  resourceName: string,
  resourceDir: string,
  openApiSpec: any,
) {
  let content = `# ${resource.name || resourceName}\n\n`;

  if (resource.description) {
    content += `${resource.description}\n\n`;
  }

  // Add available endpoints
  if (resource.methods) {
    content += `## Available endpoints\n\n`;
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

  const filePath = path.join(resourceDir, "index.md");
  fs.writeFileSync(filePath, content, "utf-8");
}

async function generateMethodMarkdown(
  methodName: string,
  method: any,
  resource: any,
  resourceName: string,
  resourceDir: string,
  openApiSpec: any,
) {
  const [methodType, endpoint] = resolveEndpointFromMethod(
    method as string | { endpoint: string },
  );
  const openApiOperation = openApiSpec.paths?.[endpoint]?.[methodType];

  if (!openApiOperation) return;

  let content = `# ${openApiOperation.summary || methodName}\n\n`;

  if (openApiOperation.description) {
    content += `${openApiOperation.description}\n\n`;
  }

  // Add endpoint information
  content += `## Endpoint\n\n`;
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
    content += `## Path parameters\n\n`;
    for (const param of pathParams) {
      content += `- **${param.name}** (${param.schema?.type || "string"})`;
      if (param.required) content += ` *required*`;
      if (param.description) content += ` - ${param.description}`;
      content += "\n";
    }
    content += "\n";
  }

  if (queryParams.length > 0) {
    content += `## Query parameters\n\n`;
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
    content += `## Request body\n\n`;
    if (requestBody.description) {
      content += `${requestBody.description}\n\n`;
    }
    if (requestBody.example) {
      content += `### Example\n\n`;
      content += `\`\`\`json\n${JSON.stringify(
        requestBody.example,
        null,
        2,
      )}\n\`\`\`\n\n`;
    }
  }

  // Add response information
  if (openApiOperation.responses) {
    content += `## Responses\n\n`;
    for (const [status, response] of Object.entries(
      openApiOperation.responses,
    )) {
      content += `### ${status}\n\n`;
      if ((response as any).description) {
        content += `${(response as any).description}\n\n`;
      }

      const responseSchema = (response as any).content?.["application/json"]
        ?.schema;
      if (responseSchema?.example) {
        content += `#### Example\n\n`;
        content += `\`\`\`json\n${JSON.stringify(
          responseSchema.example,
          null,
          2,
        )}\n\`\`\`\n\n`;
      }
    }
  }

  const filePath = path.join(resourceDir, `${methodName}.md`);
  fs.writeFileSync(filePath, content, "utf-8");
}

async function generateSubresourceMarkdown(
  subresourceName: string,
  subresource: any,
  parentResourceName: string,
  parentResourceDir: string,
  openApiSpec: any,
) {
  const subresourceDir = path.join(parentResourceDir, subresourceName);
  fs.mkdirSync(subresourceDir, { recursive: true });

  // Generate subresource overview
  await generateResourceOverview(
    subresource,
    subresourceName,
    subresourceDir,
    openApiSpec,
  );

  // Generate method files for subresource
  if (subresource.methods) {
    for (const [methodName, method] of Object.entries(subresource.methods)) {
      await generateMethodMarkdown(
        methodName,
        method,
        subresource,
        subresourceName,
        subresourceDir,
        openApiSpec,
      );
    }
  }

  // Generate schema files for subresource
  if (subresource.models) {
    const schemasDir = path.join(subresourceDir, "schemas");
    fs.mkdirSync(schemasDir, { recursive: true });

    for (const [modelName, modelRef] of Object.entries(subresource.models)) {
      await generateSchemaMarkdown(
        modelName,
        modelRef as string,
        schemasDir,
        openApiSpec,
      );
    }
  }
}

async function generateSchemaMarkdown(
  modelName: string,
  modelRef: string,
  schemasDir: string,
  openApiSpec: any,
) {
  const schema = JSONPointer.get(
    openApiSpec,
    (modelRef as string).replace("#", ""),
  );

  if (!schema) return;

  let content = `# ${schema.title || modelName}\n\n`;

  if (schema.description) {
    content += `${schema.description}\n\n`;
  }

  content += `## Attributes\n\n`;

  if (schema.properties) {
    for (const [propName, propSchema] of Object.entries(schema.properties)) {
      const prop = propSchema as any;
      content += `### ${propName}\n\n`;
      content += `**Type:** ${prop.type || "unknown"}\n\n`;
      if (prop.description) {
        content += `${prop.description}\n\n`;
      }
      if (schema.required && schema.required.includes(propName)) {
        content += `**Required:** Yes\n\n`;
      }
    }
  }

  if (schema.example) {
    content += `## Example\n\n`;
    content += `\`\`\`json\n${JSON.stringify(
      schema.example,
      null,
      2,
    )}\n\`\`\`\n\n`;
  }

  const filePath = path.join(schemasDir, `${modelName}.md`);
  fs.writeFileSync(filePath, content, "utf-8");
}

async function run() {
  try {
    console.log("🚀 Generating API and MAPI reference markdown files...");
    await generateAllApiReferenceMarkdownFiles();
    console.log(
      "✅ API and MAPI reference markdown files generated successfully!",
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error generating API reference files:", error);
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
};
