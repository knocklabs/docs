import {
  StainlessResource,
  readOpenApiSpec,
  readStainlessSpec,
} from "@/lib/openApiSpec";
import { RESOURCE_ORDER as API_RESOURCE_ORDER } from "@/data/sidebars/apiOverviewSidebar";
import { RESOURCE_ORDER as MAPI_RESOURCE_ORDER } from "@/data/sidebars/mapiOverviewSidebar";
import algoliasearch from "algoliasearch";
import { resolveEndpointFromMethod } from "@/components/ui/ApiReference/helpers";
import JSONPointer from "jsonpointer";
import { loadEnvConfig } from "@next/env";
import type { DocsSearchItem, EndpointSearchItem } from "@/types";

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

// Formats the name for URL paths
// Bulk operations -> bulk_operations
function resourceNameToPath(resourceName: string) {
  return resourceName.trim().toLowerCase().replace(/\s+/g, "_");
}

/**
 * Right now we sit around 227 resources
 * 1000 is the maximum for a bulk operation
 * So we're pretty good for now and can either expand that limit or
 * save objects in chunks. These batches work for now!
 */
let pagesToSave: DocsSearchItem[] = [];
async function queuePage(object: DocsSearchItem) {
  indexCount++;
  pagesToSave.push(object);
  return;
}
let endpointsToSave: EndpointSearchItem[] = [];
async function queueEndpoint(object: EndpointSearchItem) {
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

  // Keep this in for logging purposes
  console.log("Indexing resource:", resourceName);

  const slugifiedResourceName = resourceNameToPath(resourceName);
  const basePath = `${pathPrefix}/${slugifiedResourceName}`;

  const methods = resource.methods || {};
  const models = resource.models || {};

  const sectionName = section + " > " + resourceName;

  const resourceObject: DocsSearchItem = {
    // The path to the page will be the identifier in Algolia.
    objectID: `${slugifiedResourceName}-${basePath}`,
    path: basePath,
    title: resourceName,
    section,
    tags: [],
    contentType: "api-reference",
    index: "pages",
  };
  await queuePage(resourceObject);

  // Methods like get, post, put, delete
  Object.keys(methods).forEach(async (methodName) => {
    const method = methods[methodName];
    const [methodType, endpoint] = resolveEndpointFromMethod(method);
    const openApiOperation = openApiSpec.paths?.[endpoint]?.[methodType];
    const title = openApiOperation?.summary;
    const methodUrl = `${basePath}/${methodName}`;
    const docsSearchItem: DocsSearchItem = {
      objectID: `page-${slugifiedResourceName}-${methodUrl}`,
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
      objectID: `endpoint-${slugifiedResourceName}-${methodUrl}`,
      title: `${formattedApiName} - ${title}`,
      method: methodType,
      endpoint,
      contentType: "api-reference",
      index: "endpoints",
    };
    await queueEndpoint(endpointSearchItem);
  });

  // Handle the schemas
  Object.keys(models).forEach(async (modelName) => {
    const modelRef = models[modelName];
    const modelUrl = `${basePath}/schemas/${modelName}`;
    const schema = JSONPointer.get(openApiSpec, modelRef.replace("#", ""));
    const title = schema?.title ?? modelName;
    const modelObject: DocsSearchItem = {
      objectID: `${slugifiedResourceName}-${modelUrl}`,
      title,
      path: modelUrl,
      section: sectionName + " > " + "Object definitions",
      tags: [],
      contentType: "api-reference",
      index: "pages",
    };
    await queuePage(modelObject);
  });

  // Subresources like BulkOperations
  Object.keys(resource.subresources ?? {}).forEach(async (subresourceName) => {
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
  });
}

async function indexApi(name: "api" | "mapi") {
  const apiSpec = await readOpenApiSpec(name);
  const stainlessSpec = await readStainlessSpec(name);

  const ORDER = name === "api" ? API_RESOURCE_ORDER : MAPI_RESOURCE_ORDER;

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
