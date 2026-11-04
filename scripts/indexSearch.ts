import {
  StainlessResource,
  readOpenApiSpec,
  readStainlessSpec,
} from "@/lib/openApiSpec";
import { RESOURCE_ORDER as API_RESOURCE_ORDER } from "@/data/sidebars/apiOverviewSidebar";
import { RESOURCE_ORDER as MAPI_RESOURCE_ORDER } from "@/data/sidebars/mapiOverviewSidebar";
import algoliasearch from "algoliasearch";
import type { SearchIndex } from "algoliasearch";
import { resolveEndpointFromMethod } from "@/components/ui/ApiReference/helpers";
import { getDocsSearchItems } from "@/lib/content.server";
import { getAtPointer } from "@/lib/jsonPointer";
import { loadEnvConfig } from "@next/env";
import type { DocsSearchItem, EndpointSearchItem } from "@/types";
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

// Only production deploys write to the indices. A preview or local build would
// otherwise publish its branch's pages to production search, and pruning
// would delete the pages its branch doesn't have.
const isProductionDeploy = process.env.VERCEL_ENV === "production";

// Keep count of the number of pages and endpoints we index
let indexCount = 0;
let endpointCount = 0;

async function validateSearchObject(
  object: DocsSearchItem | EndpointSearchItem,
) {
  if (object.path.startsWith("/")) {
    return Promise.reject(
      `\n\nEndpoint path may not start with "/". Violating path: ${object.path}\n\n`,
    );
  }
}

/**
 * These hold every record for the indices, so syncIndex can prune whatever
 * isn't in them. saveObjects splits them into batches of 1000 for us.
 */
let pagesToSave: DocsSearchItem[] = [];
async function queuePage(object: DocsSearchItem) {
  await validateSearchObject(object);
  // Keep this in for logging purposes
  console.log("Indexing page:", object.title, object.path);
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

  const resourceObject: DocsSearchItem = {
    // The path to the page will be the identifier in Algolia.
    objectID: `page-${staticName}-${basePath}`,
    path: basePath,
    title: resourceName,
    section,
    tags: [],
    contentType: "api-reference",
    index: "pages",
  };
  await queuePage(resourceObject);

  // These loops await each record so every one is queued before syncIndex
  // runs. A record missing from the queue gets deleted from the index.

  // Methods like get, post, put, delete
  for (const methodName of Object.keys(methods)) {
    const method = methods[methodName];
    const [methodType, endpoint] = resolveEndpointFromMethod(method);
    const openApiOperation = openApiSpec.paths?.[endpoint]?.[methodType];
    const title = openApiOperation?.summary;
    const methodUrl = `${basePath}/${methodName}`;
    const docsSearchItem: DocsSearchItem = {
      objectID: `page-${staticName}-${methodUrl}`,
      title,
      path: methodUrl,
      section: sectionName,
      tags: [],
      contentType: "api-reference",
      index: "pages",
    };
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
    const schema = getAtPointer(openApiSpec, modelRef.replace("#", ""));
    const title = schema?.title ?? modelName;
    const modelObject: DocsSearchItem = {
      objectID: `page-${staticName}-${modelUrl}`,
      title,
      path: modelUrl,
      section: sectionName + " > " + "Object definitions",
      tags: [],
      contentType: "api-reference",
      index: "pages",
    };
    await queuePage(modelObject);
  }

  // Subresources like BulkOperations
  for (const [subresourceName, subresource] of Object.entries(
    resource.subresources ?? {},
  )) {
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
    const sections: Array<{ title?: string; path?: string }> = [];
    const parser = new RegExp(/<Section\s+(.*?)\s*>/g);
    const attributeParser = /(\w+)="([^"]*)"/g;

    let match;
    while ((match = parser.exec(content)) !== null) {
      const attributes = match[1];
      const sectionInfo: { title?: string; path?: string } = {};

      let attrMatch;
      while ((attrMatch = attributeParser.exec(attributes)) !== null) {
        const [_, name, value] = attrMatch;
        if (name === "title") sectionInfo.title = value;
        if (name === "path") sectionInfo.path = value;
      }

      sections.push(sectionInfo);
    }

    return sections;
  }
  const sections = extractSectionInfo(staticContent);
  for (const section of sections) {
    const { title, path } = section;
    if (!title || !path) continue;
    const sectionObject: DocsSearchItem = {
      objectID: `page-section-${name}-reference${path}`,
      path: `${name}-reference${path}`,
      title,
      section: name === "api" ? "API Reference" : "mAPI Reference",
      tags: [],
      contentType: "api-reference",
      index: "pages",
    };
    await queuePage(sectionObject);
  }
  return staticContent;
}

/**
 * Saves the records, then deletes every record in the index that this build
 * didn't produce, such as pages that were moved or removed. Saving alone
 * leaves those behind, and search keeps linking to pages that don't exist.
 */
async function syncIndex(
  index: SearchIndex,
  objects: Array<DocsSearchItem | EndpointSearchItem>,
) {
  // An empty list would prune every record in the index
  if (objects.length === 0) {
    throw new Error(`No records to save to ${index.indexName}.`);
  }

  await index.saveObjects(objects);

  const currentIds = new Set(objects.map((object) => object.objectID));
  const staleIds: string[] = [];
  await index.browseObjects({
    attributesToRetrieve: ["objectID"],
    batch: (hits) => {
      for (const hit of hits) {
        if (!currentIds.has(hit.objectID)) staleIds.push(hit.objectID);
      }
    },
  });

  if (staleIds.length > 0) {
    console.log(
      `\nRemoving ${staleIds.length} stale records from ${index.indexName}:`,
      staleIds,
    );
    await index.deleteObjects(staleIds);
  }
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
          "Missing Algolia environment variables. Continuing with script but skipping indexing.\n\nMissing: " +
            missing.join(", "),
        );
      }

      skipIndexing = true;
    } else if (!isProductionDeploy) {
      console.warn(
        `Not a production deploy (VERCEL_ENV=${process.env.VERCEL_ENV}). Continuing with script but skipping indexing.\n\n` +
          "To index from your machine, run: VERCEL_ENV=production yarn index-search",
      );

      skipIndexing = true;
    }

    // Start assembling our batches
    for (const page of getDocsSearchItems()) {
      await queuePage(page);
    }
    await indexApi("api");
    await indexApi("mapi");

    // Only save objects from production deploys with all the necessary environment variables
    if (!skipIndexing) {
      const client = algoliasearch(algoliaAppId, algoliaAdminApiKey);
      await syncIndex(client.initIndex(algoliaPagesIndexName), pagesToSave);
      await syncIndex(
        client.initIndex(algoliaEndpointIndexName),
        endpointsToSave,
      );
      console.log(
        "\n\n✅ Successfully indexed docs, API, and mAPI references!",
      );
    } else {
      console.log("\n\n⚠️  Success, but skipped index. See the warning above.");
    }

    console.log("\nIndexed", indexCount, "pages.");
    console.log("\nIndexed", endpointCount, "endpoints.\n\n");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
