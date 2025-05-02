import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import yaml from "yaml";
import { type SidebarSection } from "../data/types";

import { TUTORIALS_SIDEBAR } from "../data/sidebars/tutorialsSidebar";
import { DEVELOPER_TOOLS_SIDEBAR } from "../data/sidebars/developerToolsSidebar";
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
import { getSidebarContent } from "../components/ui/ApiReference/helpers";

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
    const markdownPath = path.join(
      process.cwd(),
      "content",
      `${slug.slice(1)}.mdx`,
    );

    if (fs.existsSync(markdownPath)) {
      const content = fs.readFileSync(markdownPath, "utf-8");
      const frontmatter = await parseFrontmatter(content);
      return {
        ...frontmatter,
        description: frontmatter?.description || "",
        fullContent: content,
      };
    }
  } catch (error) {
    console.warn(`Warning: Could not load content for ${slug}`);
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
  for (const page of pages) {
    totalPages += 1;
    const fullHref = `${parentSlug}${page.slug}`;
    const { description, fullContent: pageContent } = await getMarkdownContent(
      fullHref,
    );
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

async function processSections(
  sections: SidebarSection[],
  indexContent,
  fullContent,
  hrefOverride?: string | null,
) {
  for (const section of sections) {
    totalSections += 1;
    // Add section to index
    indexContent.push(`## ${section.title}`);
    if (section.desc) {
      indexContent.push(section.desc);
    }
    indexContent.push("");

    // Add section to full content
    fullContent.push(`# ${section.title}`);
    if (section.desc) {
      fullContent.push(section.desc);
    }
    fullContent.push("");

    // Process all pages in the section
    await processPages(
      section.pages,
      section.slug,
      indexContent,
      fullContent,
      0,
      hrefOverride,
    );
    indexContent.push(""); // Extra newline between sections
    fullContent.push(""); // Extra newline between sections
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
    await processSections(IN_APP_UI_SIDEBAR, indexContent, fullContent);
    await processSections(REACT_SIDEBAR, indexContent, fullContent);
    await processSections(JAVASCRIPT_SIDEBAR, indexContent, fullContent);
    await processSections(ANGULAR_SIDEBAR, indexContent, fullContent);
    await processSections(REACT_NATIVE_SIDEBAR, indexContent, fullContent);
    await processSections(SWIFT_SIDEBAR, indexContent, fullContent);
    await processSections(ANDROID_SIDEBAR, indexContent, fullContent);
    await processSections(FLUTTER_SIDEBAR, indexContent, fullContent);
    await processSections(EXPO_SIDEBAR, indexContent, fullContent);

    // DIVIDER
    indexContent.push("---\n");
    fullContent.push("---\n");

    // API REFERENCE
    // const apiSidebar = await getApiSidebar();
    // await processSections(apiSidebar, indexContent, fullContent);

    // DIVIDER
    indexContent.push("---\n");
    fullContent.push("---\n");

    // CLI REFERENCE
    await processSections(CLI_SIDEBAR, indexContent, fullContent);

    // DIVIDER
    indexContent.push("---\n");
    fullContent.push("---\n");

    // API REFERENCE
    const apiSidebar = await getApiSidebar();
    await processSections(
      apiSidebar,
      indexContent,
      fullContent,
      "/api-reference",
    );

    // DIVIDER
    indexContent.push("---\n");
    fullContent.push("---\n");

    // MANAGEMENT API REFERENCE
    const mapiSidebar = await getMapiSidebar();
    await processSections(
      mapiSidebar,
      indexContent,
      fullContent,
      "/mapi-reference",
    );

    // DIVIDER
    indexContent.push("---\n");
    fullContent.push("---\n");

    // DEVELOPER TOOLS
    await processSections(DEVELOPER_TOOLS_SIDEBAR, indexContent, fullContent);

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

export { generateAllLlmsFiles };
