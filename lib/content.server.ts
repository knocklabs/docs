import fs from "fs";
import path from "path";
import yaml from "yaml";
import type { FrontMatter, DocsSearchItem } from "../types";

export const CONTENT_DIR = "content/";
export const DOCS_FILE_EXTENSIONS = [".mdx", ".md"];

/**
 * This builds the search records for our .md and .mdx file content.
 * scripts/indexSearch.ts adds the API/mAPI reference records and writes
 * both to Algolia.
 */

export const getAllFilesInDir = (
  directory: string,
  files: string[] = [],
  extensions?: string[],
): string[] => {
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
};

export function makeIdFromPath(resourcePath) {
  return resourcePath.replace(/\.mdx?$/, "").replace("/index", "");
}

const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---/;

function readFrontmatter(filePath: string): FrontMatter {
  const match = fs.readFileSync(filePath, "utf8").match(FRONTMATTER_REGEX);
  return match ? yaml.parse(match[1]) : ({} as FrontMatter);
}

function makeSearchItem(id: string, filePath: string): DocsSearchItem {
  const frontmatter = readFrontmatter(filePath);
  return {
    // The path to the page will be the identifier in Algolia.
    objectID: id,
    path: id,
    title: frontmatter.title,
    section: frontmatter.section,
    tags: frontmatter.tags || [],
    // Saving a content page, not an API endpoint
    contentType: "document",
    // Saving to the pages index
    index: "pages",
  };
}

// One record for every page pages/[...slug].tsx serves, plus the CLI
// overview, which pages/cli/index.tsx serves at /cli.
export function getDocsSearchItems(): DocsSearchItem[] {
  const items = getAllFilesInDir(CONTENT_DIR, [], DOCS_FILE_EXTENSIONS)
    .map((filePath) => path.relative(CONTENT_DIR, filePath))
    // __api-reference and __mapi-reference aren't content pages, and
    // pages/cli serves the cli directory
    .filter(
      (relativePath) =>
        !relativePath.startsWith("__") &&
        !relativePath.startsWith(`cli${path.sep}`),
    )
    .map((relativePath) =>
      makeSearchItem(
        makeIdFromPath(relativePath),
        path.join(CONTENT_DIR, relativePath),
      ),
    );

  items.push(makeSearchItem("cli", path.join(CONTENT_DIR, "cli/overview.mdx")));

  return items;
}
