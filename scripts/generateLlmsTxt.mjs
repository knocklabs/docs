import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import yaml from "yaml";
import sidebarContent from "../data/sidebar.json" assert { type: "json" };
import integrationSidebarContent from "../data/integrationsSidebar.json" assert { type: "json" };

const apiContent = [
  {
    title: "API Reference",
    slug: "",
    desc: "Complete reference documentation for the Knock API.",
    pages: [
      { slug: "/api-reference", title: "API Reference" },
      { slug: "/cli", title: "CLI Reference" },
      { slug: "/mapi-reference", title: "Management API Reference" },
    ],
  },
];
// Get current file's directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
) {
  for (const page of pages) {
    const fullHref = `${parentSlug}${page.slug}`;
    const { description, fullContent: pageContent } = await getMarkdownContent(
      fullHref,
    );
    const indent = "  ".repeat(indentLevel);
    const betaTag = page.isBeta ? " (Beta)" : "";
    const descriptionText = description ? `: ${description}` : "";

    // Add to index content with .md extension
    indexContent.push(
      `${indent}- [${page.title}${betaTag}](${fullHref}.md)${descriptionText}`,
    );

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
      );
    }
  }
}

async function processSections(sections, indexContent, fullContent) {
  for (const section of sections) {
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
    await processPages(section.pages, section.slug, indexContent, fullContent);
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

    // Process main sidebar content
    await processSections(sidebarContent, indexContent, fullContent);

    // Add divider before integrations
    indexContent.push("---\n");
    fullContent.push("---\n");

    // Process integration sidebar content
    await processSections(integrationSidebarContent, indexContent, fullContent);
    // Process API content
    await processSections(apiContent, indexContent, fullContent);
    // Write files
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

    console.log("✅ All LLMS files generated successfully");
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
