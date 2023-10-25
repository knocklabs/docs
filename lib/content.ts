import fs from "fs";
import path from "path";
import algoliasearch from "algoliasearch";

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

export async function generateAlgoliaIndex(markdown: any) {
  // const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
  // const algoliaAdminApiKey = process.env.ALGOLIA_ADMIN_API_KEY;
  // const algoliaIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME;
  // if (algoliaAppId && algoliaAdminApiKey && algoliaIndexName) {
  //   const client = algoliasearch(algoliaAppId, algoliaAdminApiKey);
  //   const index = client.initIndex(algoliaIndexName);
  //   if (markdown.id === "reference") {
  //     const comp = mdx.createCompiler();
  //     const compiled = comp.parse(markdown.content);
  //     // Parse all sections from API Reference
  //     const sections = compiled.children.filter(
  //       (ch) =>
  //         ch.type === "jsx" &&
  //         ch.value.includes("Section") &&
  //         !ch.value.includes("/Section"),
  //     );
  //     const referenceObjects = sections.map((s) => {
  //       // The value of each parsed element here will look something like:
  //       // "<Section title=\"Bulk delete objects in a collection\" slug=\"bulk-delete-objects\">"
  //       // The following regexes parse the title and the slug from the section
  //       const { title } = s.value.match(/title=['"](?<title>.*?)['"]/).groups;
  //       const { slug } = s.value.match(/slug=['"](?<slug>.*?)['"]/).groups;
  //       return {
  //         objectID: `reference#${slug}`,
  //         path: `reference#${slug}`,
  //         title,
  //         section: "API reference",
  //         tags: [],
  //       };
  //     });
  //     try {
  //       // we send all API reference entries in bulk to reduce calls
  //       await index.saveObjects(referenceObjects);
  //     } catch (e) {
  //       /* eslint-disable no-console */
  //       console.error(e);
  //       /* eslint-enable no-console */
  //     }
  //   } else {
  //     try {
  //       // Notes:
  //       // Algolia recommends saving objects in batches because of efficiency.
  //       // Our markdown processor doesn't provide a callback to subscribe to that
  //       // gets called after finishing with all elements.
  //       //
  //       // Given we only have ~40 items to be indexed right now, we are just saving
  //       // entries one by one.
  //       await index.saveObject({
  //         // The path to the page will be the identifier in Algolia.
  //         objectID: c.id,
  //         path: c.id,
  //         title: c.title,
  //         section: c.section,
  //         // Once we add tags are added to pages, Algolia records
  //         // will be updated with them, so we can enhance the search experience
  //         tags: c.tags || [],
  //       });
  //     } catch (e) {
  //       /* eslint-disable no-console */
  //       console.error(e);
  //       /* eslint-enable no-console */
  //     }
  //   }
  // } else {
  //   /* eslint-disable no-console */
  //   console.info(
  //     "Algolia configuration variables not present. Skipping indexing.",
  //   );
  //   /* eslint-enable no-console */
  // }
}
