import fs from "fs";
import path from "path";
import algoliasearch from "algoliasearch";
import { FrontMatter } from "../types";

export const CONTENT_DIR = "content/";
export const DOCS_FILE_EXTENSIONS = [".mdx", ".md"];

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

export async function generateAlgoliaIndex(
  source: string,
  frontmatter: FrontMatter,
) {
  const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "";
  const algoliaAdminApiKey = process.env.ALGOLIA_ADMIN_API_KEY ?? "";
  const algoliaIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? "";

  if (algoliaAppId && algoliaAdminApiKey && algoliaIndexName) {
    const client = algoliasearch(algoliaAppId, algoliaAdminApiKey);
    const index = client.initIndex(algoliaIndexName);
    if (frontmatter.id === "reference") {
      // Parse all sections from API Reference
      const sections = source.matchAll(
        /<Section title="([^"]+)" slug="([^"]+)"[^>]*>/g,
      );
      const referenceObjects = [...sections].map((match) => {
        const slug = match[2];
        return {
          objectID: `reference#${slug}`,
          path: `reference#${slug}`,
          title: match[1],
          section: "API reference",
          tags: [],
        };
      });
      try {
        // we send all API reference entries in bulk to reduce calls
        await index.saveObjects(referenceObjects);
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        // Notes:
        // Algolia recommends saving objects in batches because of efficiency.
        // Our markdown processor doesn't provide a callback to subscribe to that
        // gets called after finishing with all elements.
        //
        // Given we only have ~40 items to be indexed right now, we are just saving
        // entries one by one.
        await index.saveObject({
          // The path to the page will be the identifier in Algolia.
          objectID: frontmatter.id,
          path: frontmatter.id,
          title: frontmatter.title,
          section: frontmatter.section,
          // Once we add tags are added to pages, Algolia records
          // will be updated with them, so we can enhance the search experience
          tags: frontmatter.tags || [],
        });
      } catch (e) {
        console.error(e);
      }
    }
  } else {
    console.info(
      "Algolia configuration variables not present. Skipping indexing.",
    );
  }
}
