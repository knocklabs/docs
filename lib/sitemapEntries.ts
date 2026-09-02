import { MetadataRoute } from "next";

import {
  API_REFERENCE_OVERVIEW_CONTENT,
} from "@/data/sidebars/apiOverviewSidebar";
import {
  MAPI_REFERENCE_OVERVIEW_CONTENT,
} from "@/data/sidebars/mapiOverviewSidebar";
import { BASE_URL } from "./constants";
import {
  ApiReferencePath,
  getAllApiReferencePaths,
  SpecName,
} from "./openApiSpec";

type SitemapEntry = MetadataRoute.Sitemap[number];

function createSitemapEntry(path: string): SitemapEntry {
  return {
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    priority: 1,
    changeFrequency: "daily",
  };
}

function apiReferencePathToUrl(
  basePath: string,
  apiPath: ApiReferencePath,
): string {
  const { resource, slug } = apiPath.params;

  if (!slug || slug.length === 0) {
    return `${basePath}/${resource}`;
  }

  return `${basePath}/${resource}/${slug.join("/")}`;
}

function getOverviewPaths(
  basePath: string,
  overviewPages: { slug: string }[],
): string[] {
  const paths = new Set<string>([basePath, `${basePath}/overview`]);

  for (const page of overviewPages) {
    if (page.slug === "/") {
      continue;
    }

    paths.add(`${basePath}/overview${page.slug}`);
  }

  return Array.from(paths);
}

async function getApiReferenceSitemapEntries(
  specName: SpecName,
): Promise<SitemapEntry[]> {
  const basePath = specName === "api" ? "/api-reference" : "/mapi-reference";
  const overviewContent =
    specName === "api"
      ? API_REFERENCE_OVERVIEW_CONTENT
      : MAPI_REFERENCE_OVERVIEW_CONTENT;
  const overviewPages = overviewContent[0]?.pages ?? [];
  const paths = new Set<string>(getOverviewPaths(basePath, overviewPages));
  const apiPaths = await getAllApiReferencePaths(specName);

  for (const apiPath of apiPaths) {
    paths.add(apiReferencePathToUrl(basePath, apiPath));
  }

  return Array.from(paths)
    .sort()
    .map(createSitemapEntry);
}

async function getAllApiReferenceSitemapEntries(): Promise<SitemapEntry[]> {
  const [apiEntries, mapiEntries] = await Promise.all([
    getApiReferenceSitemapEntries("api"),
    getApiReferenceSitemapEntries("mapi"),
  ]);

  return [...apiEntries, ...mapiEntries];
}

export {
  apiReferencePathToUrl,
  createSitemapEntry,
  getAllApiReferenceSitemapEntries,
  getApiReferenceSitemapEntries,
};
