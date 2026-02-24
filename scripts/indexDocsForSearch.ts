import fs from "fs";
import path from "path";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import yaml from "yaml";
import algoliasearch from "algoliasearch";
import { loadEnvConfig } from "@next/env";
import type { EnhancedDocsSearchItem } from "@/types";

// Load Next.js environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "";
const algoliaAdminApiKey = process.env.ALGOLIA_ADMIN_API_KEY ?? "";
const algoliaPagesIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? "";

const CONTENT_DIR = path.join(projectDir, "content");
const DOCS_FILE_EXTENSIONS = [".mdx", ".md"];

// Maximum content length per record (in characters)
// Algolia recommends keeping records small for better performance
const MAX_CONTENT_LENGTH = 2000;

// Keep count of indexed items
let pageCount = 0;
let headingCount = 0;

interface Heading {
  level: number;
  title: string;
  slug: string;
  content: string;
}

interface Frontmatter {
  title: string;
  description?: string;
  tags?: string[];
  section: string;
}

/**
 * Recursively get all files in a directory with specific extensions
 */
function getAllFilesInDir(
  directory: string,
  files: string[] = [],
  extensions?: string[],
): string[] {
  fs.readdirSync(directory).forEach((file) => {
    const subpath = path.join(directory, file);
    if (fs.lstatSync(subpath).isDirectory()) {
      getAllFilesInDir(subpath, files, extensions);
    } else {
      if (!extensions || extensions.includes(path.extname(subpath))) {
        files.push(subpath);
      }
    }
  });

  return files;
}

/**
 * Parse frontmatter from markdown content using remark
 */
async function parseFrontmatter(
  markdownContent: string,
): Promise<Frontmatter | null> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["yaml"])
    .parse(markdownContent);

  const yamlNode = file.children.find(
    (node): node is { type: "yaml"; value: string } => node.type === "yaml",
  );
  if (!yamlNode) return null;
  return yaml.parse(yamlNode.value);
}

/**
 * Create a URL-friendly slug from a heading title
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
}

/**
 * Remove frontmatter from markdown content
 */
function removeFrontmatter(content: string): string {
  // Match YAML frontmatter at the start of the file
  const frontmatterRegex = /^---[\s\S]*?---\n*/;
  return content.replace(frontmatterRegex, "");
}

/**
 * Extract plain text from markdown content
 * Removes JSX components, imports, code blocks, and other non-text elements
 */
function extractTextContent(mdxContent: string): string {
  let content = mdxContent;

  // Remove import statements
  content = content.replace(/^import\s+.*$/gm, "");

  // Remove export statements
  content = content.replace(/^export\s+.*$/gm, "");

  // Remove code blocks (fenced)
  content = content.replace(/```[\s\S]*?```/g, "");

  // Remove inline code
  content = content.replace(/`[^`]+`/g, "");

  // Remove JSX components (self-closing and with children)
  content = content.replace(/<[A-Z][^>]*\/>/g, ""); // Self-closing like <Component />
  content = content.replace(/<[A-Z][^>]*>[\s\S]*?<\/[A-Z][^>]*>/g, ""); // With children

  // Remove HTML-style components
  content = content.replace(/<[a-z][^>]*>[\s\S]*?<\/[a-z][^>]*>/g, "");

  // Remove remaining HTML/JSX tags
  content = content.replace(/<[^>]+>/g, "");

  // Remove markdown images (must come before links since images contain link syntax)
  content = content.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");

  // Remove markdown links but keep the text
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // Remove markdown emphasis markers
  content = content.replace(/\*\*([^*]+)\*\*/g, "$1"); // Bold
  content = content.replace(/\*([^*]+)\*/g, "$1"); // Italic
  content = content.replace(/__([^_]+)__/g, "$1"); // Bold
  content = content.replace(/_([^_]+)_/g, "$1"); // Italic

  // Remove heading markers
  content = content.replace(/^#{1,6}\s+/gm, "");

  // Remove horizontal rules
  content = content.replace(/^[-*_]{3,}$/gm, "");

  // Remove list markers
  content = content.replace(/^\s*[-*+]\s+/gm, "");
  content = content.replace(/^\s*\d+\.\s+/gm, "");

  // Remove blockquote markers
  content = content.replace(/^\s*>\s*/gm, "");

  // Normalize whitespace
  content = content.replace(/\n{3,}/g, "\n\n"); // Multiple newlines to double
  content = content.replace(/[ \t]+/g, " "); // Multiple spaces to single

  return content.trim();
}

/**
 * Extract headings with their content from markdown
 */
function extractHeadings(mdxContent: string): Heading[] {
  // Remove frontmatter first
  const contentWithoutFrontmatter = removeFrontmatter(mdxContent);

  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  const matches: Array<{ index: number; level: number; title: string }> = [];

  while ((match = headingRegex.exec(contentWithoutFrontmatter)) !== null) {
    matches.push({
      index: match.index,
      level: match[1].length,
      title: match[2].trim(),
    });
  }

  // Extract content for each heading
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];

    const contentStart =
      current.index + `${"#".repeat(current.level)} ${current.title}`.length;
    const contentEnd = next ? next.index : contentWithoutFrontmatter.length;
    const rawContent = contentWithoutFrontmatter.slice(
      contentStart,
      contentEnd,
    );

    const cleanContent = extractTextContent(rawContent);

    // Only include headings with meaningful content
    if (cleanContent.length > 20) {
      headings.push({
        level: current.level,
        title: current.title,
        slug: slugify(current.title),
        content: cleanContent.slice(0, MAX_CONTENT_LENGTH),
      });
    }
  }

  return headings;
}

/**
 * Get the intro content (content before the first heading)
 */
function getIntroContent(mdxContent: string): string {
  const contentWithoutFrontmatter = removeFrontmatter(mdxContent);

  // Find the first H2 or H3 heading
  const firstHeadingMatch = contentWithoutFrontmatter.match(/^#{2,3}\s+/m);

  if (firstHeadingMatch && firstHeadingMatch.index !== undefined) {
    const introRaw = contentWithoutFrontmatter.slice(
      0,
      firstHeadingMatch.index,
    );
    return extractTextContent(introRaw).slice(0, MAX_CONTENT_LENGTH);
  }

  // No headings found, use all content
  return extractTextContent(contentWithoutFrontmatter).slice(
    0,
    MAX_CONTENT_LENGTH,
  );
}

/**
 * Convert file path to URL path
 */
function filePathToUrlPath(filePath: string): string {
  return filePath
    .replace(CONTENT_DIR, "")
    .replace(/\.mdx?$/, "")
    .replace("/index", "")
    .replace(/^\//, ""); // Remove leading slash for objectID
}

/**
 * Queue of items to save to Algolia
 */
const itemsToSave: EnhancedDocsSearchItem[] = [];

async function queueItem(item: EnhancedDocsSearchItem) {
  // Validate path doesn't start with /
  if (item.path.startsWith("/")) {
    console.error(`Path may not start with "/". Violating path: ${item.path}`);
    return;
  }

  console.log(
    `Indexing ${item.isPageLevel ? "page" : "heading"}: ${item.title} -> ${
      item.path
    }`,
  );
  itemsToSave.push(item);
}

/**
 * Process a single MDX file and create search records
 */
async function processFile(filePath: string): Promise<void> {
  // Skip special directories
  if (
    filePath.includes("/__mapi-reference/") ||
    filePath.includes("/__api-reference/") ||
    filePath.includes("/__cli/")
  ) {
    return;
  }

  const content = fs.readFileSync(filePath, "utf-8");
  const frontmatter = await parseFrontmatter(content);

  if (!frontmatter || !frontmatter.title || !frontmatter.section) {
    console.warn(`Skipping ${filePath}: missing required frontmatter`);
    return;
  }

  const urlPath = filePathToUrlPath(filePath);

  // Create page-level record
  const introContent = getIntroContent(content);
  const pageRecord: EnhancedDocsSearchItem = {
    objectID: `page-${urlPath}`,
    path: urlPath,
    title: frontmatter.title,
    pageTitle: frontmatter.title,
    description: frontmatter.description,
    content: introContent,
    section: frontmatter.section,
    tags: frontmatter.tags || [],
    headingLevel: 0,
    contentType: "document",
    index: "pages",
    isPageLevel: true,
  };
  await queueItem(pageRecord);
  pageCount++;

  // Extract and create heading-level records
  const headings = extractHeadings(content);
  for (const heading of headings) {
    const headingPath = `${urlPath}#${heading.slug}`;
    const headingRecord: EnhancedDocsSearchItem = {
      objectID: `heading-${headingPath}`,
      path: headingPath,
      title: heading.title,
      pageTitle: frontmatter.title,
      content: heading.content,
      section: frontmatter.section,
      tags: frontmatter.tags || [],
      headingLevel: heading.level,
      contentType: "document",
      index: "pages",
      isPageLevel: false,
    };
    await queueItem(headingRecord);
    headingCount++;
  }
}

/**
 * Main entry point
 */
async function main() {
  console.log("🔍 Starting docs search indexing...\n");

  let skipIndexing = false;

  // Check for required environment variables
  if (!algoliaAppId || !algoliaAdminApiKey || !algoliaPagesIndexName) {
    const missing: string[] = [];
    if (!algoliaAppId) missing.push("NEXT_PUBLIC_ALGOLIA_APP_ID");
    if (!algoliaAdminApiKey) missing.push("ALGOLIA_ADMIN_API_KEY");
    if (!algoliaPagesIndexName) missing.push("NEXT_PUBLIC_ALGOLIA_INDEX_NAME");

    console.warn(
      "Missing Algolia environment variables. Continuing with script but skipping actual indexing.\n\nMissing: " +
        missing.join(", "),
    );
    skipIndexing = true;
  }

  // Get all MDX/MD files
  const files = getAllFilesInDir(CONTENT_DIR, [], DOCS_FILE_EXTENSIONS);
  console.log(`Found ${files.length} content files to process\n`);

  // Process each file
  for (const file of files) {
    try {
      await processFile(file);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  console.log("\n📊 Indexing summary:");
  console.log(`   Pages indexed: ${pageCount}`);
  console.log(`   Headings indexed: ${headingCount}`);
  console.log(`   Total records: ${itemsToSave.length}`);

  // Save to Algolia
  if (!skipIndexing && itemsToSave.length > 0) {
    console.log("\n📤 Uploading to Algolia...");

    const client = algoliasearch(algoliaAppId, algoliaAdminApiKey);
    const index = client.initIndex(algoliaPagesIndexName);

    // Save objects in batches (Algolia recommends batches of 1000)
    const BATCH_SIZE = 1000;
    for (let i = 0; i < itemsToSave.length; i += BATCH_SIZE) {
      const batch = itemsToSave.slice(i, i + BATCH_SIZE);
      await index.saveObjects(batch);
      console.log(
        `   Saved batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
          itemsToSave.length / BATCH_SIZE,
        )}`,
      );
    }

    console.log("\n✅ Successfully indexed docs for search!");
  } else if (skipIndexing) {
    console.log(
      "\n⚠️  Completed processing, but skipped Algolia upload due to missing environment variables.",
    );
  }

  process.exit(0);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
