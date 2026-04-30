import {
  StainlessResource,
  readOpenApiSpec,
  readStainlessSpec,
} from "@/lib/openApiSpec";
import {
  API_REFERENCE_OVERVIEW_CONTENT,
  RESOURCE_ORDER as API_RESOURCE_ORDER,
} from "@/data/sidebars/apiOverviewSidebar";
import {
  MAPI_REFERENCE_OVERVIEW_CONTENT,
  RESOURCE_ORDER as MAPI_RESOURCE_ORDER,
} from "@/data/sidebars/mapiOverviewSidebar";
import algoliasearch from "algoliasearch";
import { resolveEndpointFromMethod } from "@/components/ui/ApiReference/helpers";
import JSONPointer from "jsonpointer";
import { loadEnvConfig } from "@next/env";
import type { EndpointSearchItem, EnhancedDocsSearchItem } from "@/types";
import { readFile } from "fs/promises";
import path from "path";

// Load Next.js environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "";
const algoliaAdminApiKey = process.env.ALGOLIA_ADMIN_API_KEY ?? "";

// Names of the indices
const algoliaPagesIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? "";
const algoliaEndpointIndexName =
  process.env.NEXT_PUBLIC_ALGOLIA_ENDPOINT_INDEX_NAME ?? "";

// Keep count of the number of resources and endpoints we index
let indexCount = 0;
let endpointCount = 0;

const MAX_CONTENT_LENGTH = 2000;

interface StaticContentHeading {
  level: number;
  title: string;
  slug: string;
  content: string;
}

async function validateSearchObject(
  object: EnhancedDocsSearchItem | EndpointSearchItem,
) {
  if (object.path.startsWith("/")) {
    return Promise.reject(
      `\n\nEndpoint path may not start with "/". Violating path: ${object.path}\n\n`,
    );
  }
}

/**
 * Right now we sit around 227 resources
 * 1000 is the maximum for a bulk operation
 * So we're pretty good for now and can either expand that limit or
 * save objects in chunks. These batches work for now!
 */
let pagesToSave: EnhancedDocsSearchItem[] = [];
async function queuePage(object: EnhancedDocsSearchItem) {
  await validateSearchObject(object);
  // Keep this in for logging purposes
  console.log(
    "Indexing page:",
    object.title,
    object.path,
    `(${object.content.length} content chars)`,
  );
  indexCount++;
  pagesToSave.push(object);
  return;
}

let endpointsToSave: EndpointSearchItem[] = [];
async function queueEndpoint(object: EndpointSearchItem) {
  await validateSearchObject(object);
  // Keep this in for logging purposes
  console.log("Indexing endpoint:", object.title, object.path);
  endpointCount++;
  endpointsToSave.push(object);
  return;
}

function buildApiPageSearchItem({
  objectID,
  path,
  title,
  pageTitle = title,
  section,
  content = "",
  tags = [],
  headingLevel = 0,
  isPageLevel = true,
}: {
  objectID: string;
  path: string;
  title: string;
  pageTitle?: string;
  section: string;
  content?: string;
  tags?: string[];
  headingLevel?: number;
  isPageLevel?: boolean;
}): EnhancedDocsSearchItem {
  return {
    objectID,
    path,
    title,
    pageTitle,
    content: content.slice(0, MAX_CONTENT_LENGTH),
    section,
    tags,
    headingLevel,
    contentType: "api-reference",
    index: "pages",
    isPageLevel,
  };
}

function extractTextContent(mdxContent: string): string {
  let content = mdxContent;

  content = content.replace(/^---[\s\S]*?---\n*/g, "");
  content = content.replace(/```[^\n]*\n([\s\S]*?)```/g, "$1");
  content = content.replace(/`([^`]+)`/g, "$1");
  content = content.replace(/!\[([^\]]*)\]\([^)]+\)/g, "");
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");
  content = content.replace(/<\/?[A-Za-z][^>]*>/g, " ");
  content = content.replace(/[{}[\](),"]/g, " ");
  content = content.replace(/\s+/g, " ");

  return content.trim();
}

function getOverviewSectionTitle(name: "api" | "mapi", path: string): string {
  const overviewContent =
    name === "api"
      ? API_REFERENCE_OVERVIEW_CONTENT
      : MAPI_REFERENCE_OVERVIEW_CONTENT;
  const pathWithoutOverview = path.replace(/^\/overview/, "") || "/";
  const page = overviewContent[0]?.pages.find(
    ({ slug }) => slug === pathWithoutOverview,
  );

  return page?.title ?? "Overview";
}

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function extractHeadings(content: string): StaticContentHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const matches: Array<{ index: number; level: number; title: string }> = [];
  const headings: StaticContentHeading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    matches.push({
      index: match.index,
      level: match[1].length,
      title: match[2].trim(),
    });
  }

  for (let index = 0; index < matches.length; index++) {
    const current = matches[index];
    const next = matches[index + 1];
    const contentStart =
      current.index + `${"#".repeat(current.level)} ${current.title}`.length;
    const contentEnd = next ? next.index : content.length;
    const cleanContent = extractTextContent(
      content.slice(contentStart, contentEnd),
    );

    headings.push({
      level: current.level,
      title: current.title,
      slug: slugify(current.title),
      content: cleanContent,
    });
  }

  return headings;
}

async function indexResource({
  apiName,
  openApiSpec,
  resource,
  staticName,
  pathPrefix,
  section = "API Reference",
}: {
  apiName: "api" | "mapi";
  openApiSpec: any;
  resource: StainlessResource;
  // Pulls the static name from the order array as a fallback
  staticName?: string;
  // The prefix for the path to the resource, important for building URLs as we recurse
  pathPrefix: string;
  section?: string;
}) {
  const resourceName = resource?.name || staticName;
  if (!resourceName) {
    console.log(
      "No name for resource. Something is probably wrong with the configuration. Skipping resource:",
      resource,
      pathPrefix,
    );
    return;
  }

  const basePath = `${pathPrefix}/${staticName}`;

  const methods = resource.methods || {};
  const models = resource.models || {};

  const sectionName = section + " > " + resourceName;

  const resourceObject = buildApiPageSearchItem({
    objectID: `page-${staticName}-${basePath}`,
    path: basePath,
    title: resourceName,
    section,
    content: resourceName,
  });
  await queuePage(resourceObject);

  // Methods like get, post, put, delete
  for (const methodName of Object.keys(methods)) {
    const method = methods[methodName];
    const [methodType, endpoint] = resolveEndpointFromMethod(method);
    const openApiOperation = openApiSpec.paths?.[endpoint]?.[methodType];
    const title = openApiOperation?.summary;
    const methodUrl = `${basePath}/${methodName}`;
    const docsSearchItem = buildApiPageSearchItem({
      objectID: `page-${staticName}-${methodUrl}`,
      title,
      path: methodUrl,
      section: sectionName,
      tags: openApiOperation?.tags ?? [],
      content: [
        openApiOperation?.summary,
        openApiOperation?.description,
        methodType?.toUpperCase(),
        endpoint,
      ]
        .filter(Boolean)
        .join(" "),
    });
    await queuePage(docsSearchItem);

    const formattedApiName = apiName === "api" ? "API" : "mAPI";
    const endpointSearchItem: EndpointSearchItem = {
      ...docsSearchItem,
      objectID: `endpoint-${staticName}-${methodUrl}`,
      title: `${formattedApiName} - ${title}`,
      method: methodType,
      endpoint,
      contentType: "api-reference",
      index: "endpoints",
    };
    await queueEndpoint(endpointSearchItem);
  }

  // Handle the schemas
  for (const modelName of Object.keys(models)) {
    const modelRef = models[modelName];
    const modelUrl = `${basePath}/schemas/${modelName}`;
    const schema = JSONPointer.get(openApiSpec, modelRef.replace("#", ""));
    const title = schema?.title ?? modelName;
    const modelObject = buildApiPageSearchItem({
      objectID: `page-${staticName}-${modelUrl}`,
      title,
      path: modelUrl,
      section: sectionName + " > " + "Object definitions",
      content: [schema?.title, schema?.description, modelName]
        .filter(Boolean)
        .join(" "),
    });
    await queuePage(modelObject);
  }

  // Subresources like BulkOperations
  for (const subresourceName of Object.keys(resource.subresources ?? {})) {
    if (!resource.subresources) return;
    const subresource = resource.subresources[subresourceName];
    // Recursively index the subresource
    await indexResource({
      apiName,
      openApiSpec,
      resource: subresource,
      staticName: subresourceName,
      pathPrefix: basePath,
      section: sectionName,
    });
  }
}

async function indexApi(name: "api" | "mapi") {
  const apiSpec = await readOpenApiSpec(name);
  const stainlessSpec = await readStainlessSpec(name);

  const ORDER = name === "api" ? API_RESOURCE_ORDER : MAPI_RESOURCE_ORDER;

  await indexStaticContent(name);

  return Promise.all(
    ORDER.map((resourceName) => {
      const resource = stainlessSpec.resources[resourceName];
      return indexResource({
        apiName: name,
        openApiSpec: apiSpec,
        resource,
        staticName: resourceName,
        pathPrefix: `${name}-reference`,
        section: name === "api" ? "API Reference" : "mAPI Reference",
      });
    }),
  );
}

// This is additional content that we write ourselves in the content directory
// Pulls content from __mapi-reference and __api-reference
async function indexStaticContent(name: "api" | "mapi") {
  const staticContent = await readFile(
    path.join(projectDir, `content/__${name}-reference/content.mdx`),
    "utf8",
  );

  // Find all sections in the static content and index them
  function extractSectionInfo(content: string) {
    const sections: Array<{
      title: string;
      path: string;
      content: string;
      headings: StaticContentHeading[];
    }> = [];
    const parser = new RegExp(/<Section\b([^>]*)>([\s\S]*?)<\/Section>/g);
    const attributeParser = /(\w+)="([^"]*)"/g;

    let match;
    while ((match = parser.exec(content)) !== null) {
      const attributes = match[1];
      const body = match[2];
      const sectionInfo: { title?: string; path?: string } = {};

      let attrMatch;
      while ((attrMatch = attributeParser.exec(attributes)) !== null) {
        const [_, name, value] = attrMatch;
        if (name === "title") sectionInfo.title = value;
        if (name === "path") sectionInfo.path = value;
      }

      if (!sectionInfo.path) continue;

      sections.push({
        path: sectionInfo.path,
        title:
          sectionInfo.title ?? getOverviewSectionTitle(name, sectionInfo.path),
        content: extractTextContent(body),
        headings: extractHeadings(body),
      });
    }

    return sections;
  }
  const sections = extractSectionInfo(staticContent);
  for (const section of sections) {
    const { title, path, content, headings } = section;
    const sectionObject = buildApiPageSearchItem({
      objectID: `page-section-${name}-reference${path}`,
      path: `${name}-reference${path}`,
      title,
      section: name === "api" ? "API Reference" : "mAPI Reference",
      content,
    });
    await queuePage(sectionObject);

    for (const heading of headings) {
      const headingPath = `${name}-reference${path}#${heading.slug}`;
      const headingObject = buildApiPageSearchItem({
        objectID: `heading-section-${headingPath}`,
        path: headingPath,
        title: heading.title,
        pageTitle: title,
        section: name === "api" ? "API Reference" : "mAPI Reference",
        content: heading.content,
        headingLevel: heading.level,
        isPageLevel: false,
      });
      await queuePage(headingObject);
    }
  }
  return staticContent;
}

let skipIndexing = false;
// Main entry point
(async () => {
  try {
    if (
      !algoliaAppId ||
      !algoliaAdminApiKey ||
      !algoliaPagesIndexName ||
      !algoliaEndpointIndexName
    ) {
      const missing: string[] = [];
      if (!algoliaAppId) missing.push("NEXT_PUBLIC_ALGOLIA_APP_ID");
      if (!algoliaAdminApiKey) missing.push("ALGOLIA_ADMIN_API_KEY");
      if (!algoliaPagesIndexName)
        missing.push("NEXT_PUBLIC_ALGOLIA_INDEX_NAME");
      if (!algoliaEndpointIndexName)
        missing.push("NEXT_PUBLIC_ALGOLIA_ENDPOINT_INDEX_NAME");

      if (missing.length > 0) {
        console.warn(
          "Missing Algolia environment variables. Continuing with script but skipping API indexing.\n\nMissing: " +
            missing.join(", "),
        );
      }

      skipIndexing = true;
    }

    // Start assembling our batches
    await indexApi("api");
    await indexApi("mapi");

    // Only save objects if we have all the necessary environment variables
    if (!skipIndexing) {
      const client = algoliasearch(algoliaAppId, algoliaAdminApiKey);
      const pageIndex = client.initIndex(algoliaPagesIndexName);
      const endpointIndex = client.initIndex(algoliaEndpointIndexName);
      await pageIndex.saveObjects(pagesToSave);
      await endpointIndex.saveObjects(endpointsToSave);
      console.log("\n\n✅ Successfully indexed API and mAPI references!");
    } else {
      console.log(
        "\n\n⚠️  Success, but skipped index because of missing environment variables.",
      );
    }

    console.log("\nIndexed", indexCount, "resources.");
    console.log("\nIndexed", endpointCount, "endpoints.\n\n");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
