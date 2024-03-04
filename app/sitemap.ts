import { MetadataRoute } from "next";

import {
  getAllFilesInDir,
  CONTENT_DIR,
  DOCS_FILE_EXTENSIONS,
} from "../lib/content.server";
import { BASE_URL } from "../lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const filePaths = getAllFilesInDir(CONTENT_DIR, [], DOCS_FILE_EXTENSIONS);

  const pages = filePaths.map((path) => {
    const slug = path.replace(CONTENT_DIR, "").replace(/\.mdx?$/, "");

    return {
      url: `${BASE_URL}/${slug}`,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "daily",
    };
  });

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      priority: 1,
      changeFrequency: "daily",
    },
  ].concat(pages) as MetadataRoute.Sitemap;
}
