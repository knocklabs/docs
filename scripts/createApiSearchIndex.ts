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

type DocsSaveEntry = {
  objectID: string;
  path: string;
  title: string;
  section: string;
  tags: string[];
};

type EndpointSaveEntry = DocsSaveEntry & {
  method: string;
  endpoint: string;
};

// Load Next.js environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const algoliaAppId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID ?? "";
const algoliaAdminApiKey = process.env.ALGOLIA_ADMIN_API_KEY ?? "";
const client = algoliasearch(algoliaAppId, algoliaAdminApiKey);

// Docs index
const algoliaIndexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME ?? "";
const index = client.initIndex(algoliaIndexName);

// Endpoints index
const ENDPOINT_INDEX_NAME =
  process.env.NEXT_PUBLIC_ALGOLIA_ENDPOINT_INDEX_NAME ?? "";
const endpointIndex = client.initIndex(ENDPOINT_INDEX_NAME);

let indexCount = 0;
let endpointCount = 0;

// Formats the name for URL paths
// Bulk operations -> bulk_operations
function resourceNameToPath(resourceName: string) {
  return resourceName.trim().toLowerCase().replace(/\s+/g, "_");
}

// Right now we sit around 227 resources
// 1000 is the maximum for a bulk operation
// So we're pretty good for now and can either expand that limit or
// save objects in chunks. This works for now!
let objectsToSave: DocsSaveEntry[] = [];

// Endpoints will be a separate index to show in search results
let endpointsToSave: EndpointSaveEntry[] = [];

// Saves an object to Algolia
async function queueObject(object: DocsSaveEntry) {
  indexCount++;
  objectsToSave.push(object);
  return;
}

async function queueEndpoint(object: EndpointSaveEntry) {
  endpointCount++;
  endpointsToSave.push(object);
  return;
}

async function indexResource({
  openApiSpec,
  resource,
  staticName,
  pathPrefix,
  section = "API Reference",
}: {
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

  const resourceObject: DocsSaveEntry = {
    // The path to the page will be the identifier in Algolia.
    objectID: `${slugifiedResourceName}-${basePath}`,
    path: basePath,
    title: resourceName,
    section,
    // Once we add tags are added to pages, Algolia records
    // will be updated with them, so we can enhance the search experience
    tags: [],
  };
  await queueObject(resourceObject);

  // Methods like get, post, put, delete
  Object.keys(methods).forEach(async (methodName) => {
    const method = methods[methodName];
    const [methodType, endpoint] = resolveEndpointFromMethod(method);
    const openApiOperation = openApiSpec.paths?.[endpoint]?.[methodType];
    const title = openApiOperation?.summary;
    const methodUrl = `${basePath}/${methodName}`;
    const methodObject: DocsSaveEntry = {
      objectID: `${slugifiedResourceName}-${methodUrl}`,
      title,
      path: methodUrl,
      section: sectionName,
      tags: [],
    };
    await queueObject(methodObject);
    await queueEndpoint({
      ...methodObject,
      objectID: `endpoint-${methodObject.objectID}`,
      method: methodType,
      endpoint,
    });
  });

  // Handle the schemas
  Object.keys(models).forEach(async (modelName) => {
    const modelRef = models[modelName];
    const modelUrl = `${basePath}/schemas/${modelName}`;
    const schema = JSONPointer.get(openApiSpec, modelRef.replace("#", ""));
    const title = schema?.title ?? modelName;
    const modelObject: DocsSaveEntry = {
      objectID: `${slugifiedResourceName}-${modelUrl}`,
      title,
      path: modelUrl,
      section: sectionName + " > " + "Object definitions",
      tags: [],
    };
    await queueObject(modelObject);
  });

  // Subresources like BulkOperations
  Object.keys(resource.subresources ?? {}).forEach(async (subresourceName) => {
    if (!resource.subresources) return;
    const subresource = resource.subresources[subresourceName];

    // Recursively index the subresource
    await indexResource({
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
        openApiSpec: apiSpec,
        resource,
        staticName: resourceName,
        pathPrefix: `${name}-reference`,
        section: name === "api" ? "API Reference" : "mAPI Reference",
      });
    }),
  );
}

// Main entry point
(async () => {
  try {
    if (
      !algoliaAppId ||
      !algoliaAdminApiKey ||
      !algoliaIndexName ||
      !ENDPOINT_INDEX_NAME
    ) {
      const missing: string[] = [];
      if (!algoliaAppId) missing.push("NEXT_PUBLIC_ALGOLIA_APP_ID");
      if (!algoliaAdminApiKey) missing.push("ALGOLIA_ADMIN_API_KEY");
      if (!algoliaIndexName) missing.push("NEXT_PUBLIC_ALGOLIA_INDEX_NAME");
      if (!ENDPOINT_INDEX_NAME) missing.push("ENDPOINT_INDEX_NAME");
      if (process.env.NODE_ENV != "production") {
        console.warn(
          "Missing Algolia environment variables in non-production environment. Skipping API indexing.\n\nMissing: " +
            missing.join(", "),
        );
        return;
      }
      throw new Error(
        `Algolia app ID, admin API key, index name, and endpoint index name must be set.\n\nMissing: ${missing.join(
          ", ",
        )}`,
      );
    }
    await indexApi("api");
    await indexApi("mapi");
    await index.saveObjects(objectsToSave);
    await endpointIndex.saveObjects(endpointsToSave);
    console.log("\n\nSuccess! ✅");
    console.log("\nIndexed", indexCount, "resources.");
    console.log("\nIndexed", endpointCount, "endpoints.\n\n");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
