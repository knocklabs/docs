import { MetadataRoute } from "next";

import {
  getAllFilesInDir,
  CONTENT_DIR,
  DOCS_FILE_EXTENSIONS,
} from "../lib/content.server";
import { BASE_URL } from "../lib/constants";
import { getAllApiReferenceSitemapEntries } from "../lib/sitemapEntries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const filePaths = getAllFilesInDir(CONTENT_DIR, [], DOCS_FILE_EXTENSIONS);

  const pages = filePaths
    .filter((path) => !path.includes("/__"))
    .map((path) => {
      const slug = path.replace(CONTENT_DIR, "").replace(/\.mdx?$/, "");

      return {
        url: `${BASE_URL}/${slug}`,
        lastModified: new Date(),
        priority: 1,
        changeFrequency: "daily" as const,
      };
    });

  const apiReferencePages = await getAllApiReferenceSitemapEntries();

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "daily",
    },
    ...pages,
    ...apiReferencePages,
  ];
}
