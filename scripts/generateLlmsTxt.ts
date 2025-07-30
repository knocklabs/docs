import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import yaml from "yaml";
import { SidebarContent, type SidebarSection } from "../data/types";

import { TUTORIALS_SIDEBAR } from "../data/sidebars/tutorialsSidebar";
import { DEVELOPER_TOOLS_SIDEBAR_CONTENT } from "../data/sidebars/developerToolsSidebar";
import { CLI_SIDEBAR } from "../data/sidebars/cliSidebar";
import { PLATFORM_SIDEBAR } from "../data/sidebars/platformSidebar";
import { INTEGRATIONS_SIDEBAR } from "../data/sidebars/integrationsSidebar";
import {
  ANDROID_SIDEBAR,
  ANGULAR_SIDEBAR,
  EXPO_SIDEBAR,
  FLUTTER_SIDEBAR,
  IN_APP_UI_SIDEBAR,
  SWIFT_SIDEBAR,
  JAVASCRIPT_SIDEBAR,
  REACT_NATIVE_SIDEBAR,
  REACT_SIDEBAR,
} from "../data/sidebars/inAppSidebar";
import {
  getSidebarContent,
  resolveEndpointFromMethod,
} from "../components/ui/ApiReference/helpers";
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

async function getMapiSidebar() {
  const openApiSpec = await readOpenApiSpec("mapi");
  const stainlessSpec = await readStainlessSpec("mapi");
  const mapiSidebarContent = getSidebarContent(
    openApiSpec,
    stainlessSpec,
    MAPI_RESOURCE_ORDER,
    "/mapi-reference",
    MAPI_REFERENCE_OVERVIEW_CONTENT,
  );
  return mapiSidebarContent;
}

async function getApiSidebar() {
  const openApiSpec = await readOpenApiSpec("api");
  const stainlessSpec = await readStainlessSpec("api");
  const apiSidebarContent = getSidebarContent(
    openApiSpec,
    stainlessSpec,
    API_RESOURCE_ORDER,
    "/api-reference",
    API_REFERENCE_OVERVIEW_CONTENT,
  );
  return apiSidebarContent;
}

// This function will rename the Sidebar sections
function processSdkSidebar(sidebar: SidebarSection[], name: string) {
  return sidebar.map((section) => ({
    ...section,
    title: `${name} ${section.title}`,
  }));
}

// Before rework: 20 sections, 229 total pages
let totalPages = 0;
let totalSections = 0;

// Combine written pre-content with generated OpenAPI content
async function writeApiMarkdown(name: "api" | "mapi") {
  const slug = `/__${name}-reference/content`;
  const content = await getMarkdownContent(slug);
  const openApiContent = fs.readFileSync(
    path.join(process.cwd(), "public", `${name}-reference-openapi.md`),
    "utf-8",
  );
  const combinedContent = `${content.fullContent}\n\n${openApiContent}`;
  fs.writeFileSync(
    path.join(process.cwd(), "public", `${name}-reference.md`),
    combinedContent,
    "utf-8",
  );
  return combinedContent;
}

// Utility functions
async function parseFrontmatter(markdownContent) {
  const file = await unified()
    // @ts-expect-error idk
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .parse(markdownContent);

  // @ts-expect-error idk
  const yamlNode = file.children.find((node) => node.type === "yaml");
  if (!yamlNode) return null;
  return yaml.parse(yamlNode.value);
}

async function writePublicMarkdown(slug, content) {
  try {
    const publicPath = path.join(
      process.cwd(),
      "public",
      `${slug.slice(1)}.md`,
    );
    // Create directories if they don't exist
    fs.mkdirSync(path.dirname(publicPath), { recursive: true });
    fs.writeFileSync(publicPath, content, "utf-8");
  } catch (error) {
    console.warn(`Warning: Could not write public markdown for ${slug}`, error);
  }
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

// Process pages and generate both index and full content
async function processPages(
  pages,
  parentSlug,
  indexContent,
  fullContent,
  indentLevel = 0,
  hrefOverride: string | null = null,
) {
  if (!pages) {
    return;
  }

  for (const page of pages) {
    totalPages += 1;
    let fullHref = `${parentSlug}${page.slug}`;
    fullHref = fullHref.replace("//", "/");

    const { description, fullContent: pageContent } = page.pages
      ? { description: "", fullContent: "" }
      : await getMarkdownContent(fullHref);

    const indent = "  ".repeat(indentLevel);
    const betaTag = page.isBeta ? " (Beta)" : "";
    const descriptionText = description ? `: ${description}` : "";

    // Add to index content with .md extension

    const markdownLink = page.pages
      ? `**${page.title}${betaTag}${descriptionText}**`
      : `[${page.title}${betaTag}](${
          hrefOverride || fullHref
        }.md)${descriptionText}`;

    indexContent.push(`${indent}- ${markdownLink}`);

    // Add to full content
    fullContent.push(`## ${page.title}${betaTag}`);
    if (description) fullContent.push(description);
    if (pageContent) {
      fullContent.push(pageContent);
      // Write to public directory if we have content
      await writePublicMarkdown(fullHref, pageContent);
    }
    fullContent.push(""); // Empty line for spacing

    // Process nested pages
    if (page.pages) {
      await processPages(
        page.pages,
        fullHref,
        indexContent,
        fullContent,
        indentLevel + 1,
        hrefOverride,
      );
    }
  }
}

type SidebarSectionOrContent = SidebarSection | SidebarContent;

/**
 * Processes a flat content item (SidebarContent without nested pages).
 * These are individual pages that should be treated as standalone content.
 * Used for the new flat sidebar format introduced in developer tools.
 */
async function processFlatContentItem(
  section: SidebarContent,
  indexContent: string[],
  fullContent: string[],
  hrefOverride?: string | null,
) {
  totalPages += 1;
  const fullHref = section.slug;

  const { description, fullContent: pageContent } = await getMarkdownContent(
    fullHref,
  );

  const betaTag = section.isBeta ? " (Beta)" : "";
  const descriptionText = description ? `: ${description}` : "";

  // Add to index content with .md extension for "Copy as markdown" functionality
  const markdownLink = `[${section.title}${betaTag}](${
    hrefOverride || fullHref
  }.md)${descriptionText}`;
  indexContent.push(`- ${markdownLink}`);

  // Add to full content
  fullContent.push(`# ${section.title}${betaTag}`);
  if (description) fullContent.push(description);
  if (pageContent) {
    fullContent.push(pageContent);
    // Write to public directory so .md URLs work
    await writePublicMarkdown(fullHref, pageContent);
  }
  fullContent.push(""); // Empty line for spacing
}

/**
 * Processes a nested section (SidebarSection with pages property).
 * These are sections that contain multiple pages organized hierarchically.
 * Used for the traditional nested sidebar format.
 */
async function processNestedSection(
  section: SidebarSection,
  indexContent: string[],
  fullContent: string[],
  hrefOverride?: string | null,
) {
  // Add section header to index
  indexContent.push(`## ${section.title}`);
  if (section.desc) {
    indexContent.push(section.desc);
  }
  indexContent.push("");

  // Add section header to full content
  fullContent.push(`# ${section.title}`);
  if (section.desc) {
    fullContent.push(section.desc);
  }
  fullContent.push("");

  // Process all pages within this section
  await processPages(
    section.pages,
    section.slug,
    indexContent,
    fullContent,
    0,
    hrefOverride,
  );

  // Add spacing between sections
  indexContent.push("");
  fullContent.push("");
}

/**
 * Determines if a sidebar item is a flat content item or nested section,
 * then processes it accordingly. This handles both the old nested format
 * (SidebarSection[]) and the new flat format (SidebarContent[]).
 */
async function processSections(
  sections: SidebarSectionOrContent[],
  indexContent: string[],
  fullContent: string[],
  hrefOverride?: string | null,
) {
  for (const section of sections) {
    totalSections += 1;

    if (!section.pages) {
      await processFlatContentItem(
        section as SidebarContent,
        indexContent,
        fullContent,
        hrefOverride,
      );
    } else {
      await processNestedSection(
        section as SidebarSection,
        indexContent,
        fullContent,
        hrefOverride,
      );
    }
  }
}

async function generateAllLlmsFiles() {
  try {
    const publicDir = path.join(process.cwd(), "public");
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    // Initialize content arrays
    const indexContent = ["# Knock Documentation\n"];
    const fullContent = ["# Knock Documentation\n"];

    // HOMEPAGE
    await processSections(PLATFORM_SIDEBAR, indexContent, fullContent);

    // DIVIDER
    indexContent.push("---\n");
    fullContent.push("---\n");

    // INTEGRATIONS
    await processSections(INTEGRATIONS_SIDEBAR, indexContent, fullContent);

    // DIVIDER
    indexContent.push("---\n");
    fullContent.push("---\n");

    // IN-APP UI
    // We have to overwrite the titles so the markdown gets more than just "UI Components" and "SDK" for each section
    await processSections(IN_APP_UI_SIDEBAR, indexContent, fullContent);
    await processSections(
      processSdkSidebar(REACT_SIDEBAR, "React"),
      indexContent,
      fullContent,
    );
    await processSections(
      processSdkSidebar(JAVASCRIPT_SIDEBAR, "JavaScript"),
      indexContent,
      fullContent,
    );
    await processSections(
      processSdkSidebar(ANGULAR_SIDEBAR, "Angular"),
      indexContent,
      fullContent,
    );
    await processSections(
      processSdkSidebar(REACT_NATIVE_SIDEBAR, "React Native"),
      indexContent,
      fullContent,
    );
    await processSections(
      processSdkSidebar(SWIFT_SIDEBAR, "Swift"),
      indexContent,
      fullContent,
    );
    await processSections(
      processSdkSidebar(ANDROID_SIDEBAR, "Android"),
      indexContent,
      fullContent,
    );
    await processSections(
      processSdkSidebar(FLUTTER_SIDEBAR, "Flutter"),
      indexContent,
      fullContent,
    );
    await processSections(
      processSdkSidebar(EXPO_SIDEBAR, "Expo"),
      indexContent,
      fullContent,
    );

    // DIVIDER
    indexContent.push("---\n");
    fullContent.push("---\n");

    // API REFERENCE
    const apiSidebar = await getApiSidebar();
    await processSections(apiSidebar, indexContent, fullContent);

    // DIVIDER
    indexContent.push("---\n");
    fullContent.push("---\n");

    // CLI REFERENCE
    await processSections(CLI_SIDEBAR, indexContent, fullContent);

    // DIVIDER
    indexContent.push("---\n");
    fullContent.push("---\n");

    // MANAGEMENT API REFERENCE
    const mapiSidebar = await getMapiSidebar();
    await processSections(mapiSidebar, indexContent, fullContent);

    // DIVIDER
    indexContent.push("---\n");
    fullContent.push("---\n");

    // DEVELOPER TOOLS
    await processSections(
      DEVELOPER_TOOLS_SIDEBAR_CONTENT,
      indexContent,
      fullContent,
    );

    // DIVIDER
    indexContent.push("---\n");
    fullContent.push("---\n");

    // TUTORIALS
    await processSections(TUTORIALS_SIDEBAR, indexContent, fullContent);

    // WRITE FILES
    fs.writeFileSync(
      path.join(publicDir, "llms.txt"),
      indexContent.join("\n"),
      "utf-8",
    );
    fs.writeFileSync(
      path.join(publicDir, "llms-full.txt"),
      fullContent.join("\n"),
      "utf-8",
    );

    await writeApiMarkdown("api");
    await writeApiMarkdown("mapi");

    await writePublicMarkdown(
      "/cli",
      (
        await getMarkdownContent("/cli")
      ).fullContent,
    );

    console.log("✅ All LLMS files generated successfully");
    console.log(`Total pages processed: ${totalPages}`);
    console.log(`Total sections processed: ${totalSections}`);
  } catch (error) {
    console.error("Error generating LLMS files:", error);
    process.exit(1);
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllLlmsFiles().catch(console.error);
}

// New function to generate individual API reference markdown files
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

// New function to generate both API and MAPI reference files
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

// Export the new functions
export {
  generateAllLlmsFiles,
  generateApiReferenceMarkdownFiles,
  generateAllApiReferenceMarkdownFiles,
};
