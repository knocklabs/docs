/**
 * Server-side OpenAPI spec loading with React cache() for App Router.
 *
 * This module provides cached access to the OpenAPI and Stainless specs.
 * The specs are loaded once per request/build and cached in memory.
 *
 * Key benefits over the Pages Router approach:
 * 1. Specs never leave the server - not serialized to page props
 * 2. React cache() dedupes requests within the same render
 * 3. Each page can extract only what it needs
 */

import { cache } from "react";
import { dereference } from "@scalar/openapi-parser";
import deepmerge from "deepmerge";
import { readFile } from "fs/promises";
import safeStringify from "safe-stringify";
import { parse } from "yaml";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import JSONPointer from "jsonpointer";

// Re-export types from the original module
export type {
  StainlessResource,
  StainlessConfig,
} from "./openApiSpec";

import type { StainlessConfig, StainlessResource } from "./openApiSpec";

type SpecName = "api" | "mapi";

/**
 * Cached loader for the full dereferenced OpenAPI spec.
 * Uses React's cache() to dedupe within a single render pass.
 */
export const getOpenApiSpec = cache(
  async (specName: SpecName): Promise<OpenAPIV3.Document> => {
    const spec = await readFile(
      `./data/specs/${specName}/openapi.yml`,
      "utf8"
    );
    const jsonSpec = parse(spec);
    const { schema } = await dereference(jsonSpec);

    // Use safe-stringify to handle circular references
    return JSON.parse(safeStringify(schema));
  }
);

/**
 * Cached loader for the Stainless config with customizations merged.
 */
export const getStainlessSpec = cache(
  async (specName: SpecName): Promise<StainlessConfig> => {
    const [specFile, customizationsFile] = await Promise.all([
      readFile(`./data/specs/${specName}/stainless.yml`, "utf8"),
      readFile(`./data/specs/${specName}/customizations.yml`, "utf8"),
    ]);

    const stainlessSpec = parse(specFile);
    const customizations = parse(customizationsFile);

    return deepmerge(stainlessSpec, customizations);
  }
);

/**
 * Get the base URL for API requests from the Stainless config.
 */
export async function getBaseUrl(specName: SpecName): Promise<string> {
  const stainlessSpec = await getStainlessSpec(specName);
  return stainlessSpec.environments.production;
}

/**
 * Get a specific resource from the Stainless config.
 */
export async function getResource(
  specName: SpecName,
  resourceName: string
): Promise<StainlessResource | undefined> {
  const stainlessSpec = await getStainlessSpec(specName);
  return stainlessSpec.resources[resourceName];
}

/**
 * Get all resource names in order for a spec.
 */
export async function getResourceOrder(specName: SpecName): Promise<string[]> {
  const stainlessSpec = await getStainlessSpec(specName);
  return Object.keys(stainlessSpec.resources);
}

/**
 * Resolve an endpoint reference from a Stainless method config.
 */
export function resolveEndpointFromMethod(
  endpointOrMethodConfig: string | { endpoint: string }
): [string, string] {
  const endpointReference =
    typeof endpointOrMethodConfig === "string"
      ? endpointOrMethodConfig
      : endpointOrMethodConfig.endpoint;

  const [methodType, endpoint] = endpointReference.split(" ");
  return [methodType, endpoint];
}

/**
 * Get the OpenAPI operation object for a specific method.
 */
export async function getMethodOperation(
  specName: SpecName,
  resourceName: string,
  methodName: string
): Promise<{
  operation: OpenAPIV3.OperationObject;
  methodType: string;
  endpoint: string;
} | null> {
  const [openApiSpec, stainlessSpec] = await Promise.all([
    getOpenApiSpec(specName),
    getStainlessSpec(specName),
  ]);

  const resource = stainlessSpec.resources[resourceName];
  if (!resource?.methods?.[methodName]) {
    return null;
  }

  const methodConfig = resource.methods[methodName];
  const [methodType, endpoint] = resolveEndpointFromMethod(methodConfig);
  const operation = openApiSpec.paths?.[endpoint]?.[methodType];

  if (!operation) {
    return null;
  }

  return { operation, methodType, endpoint };
}

/**
 * Get a schema by reference from the OpenAPI spec.
 */
export async function getSchemaByRef(
  specName: SpecName,
  schemaRef: string
): Promise<OpenAPIV3.SchemaObject | undefined> {
  const openApiSpec = await getOpenApiSpec(specName);
  return JSONPointer.get(openApiSpec, schemaRef.replace("#", ""));
}

/**
 * Build schema references for linking between schema types.
 * This maps schema titles to their URL paths.
 */
export async function buildSchemaReferences(
  specName: SpecName,
  basePath: string
): Promise<Record<string, string>> {
  const [openApiSpec, stainlessSpec] = await Promise.all([
    getOpenApiSpec(specName),
    getStainlessSpec(specName),
  ]);

  const schemaReferences: Record<string, string> = {};

  function processResource(
    resource: StainlessResource,
    resourcePath: string
  ) {
    if (resource.models) {
      Object.entries(resource.models).forEach(([modelName, modelRef]) => {
        const schema: OpenAPIV3.SchemaObject | undefined = JSONPointer.get(
          openApiSpec,
          modelRef.replace("#", "")
        );

        const title = schema?.title ?? modelName;

        if (schema) {
          schemaReferences[title] = `${resourcePath}/schemas/${modelName}`;
          schemaReferences[`${title}[]`] = `${resourcePath}/schemas/${modelName}`;
        }
      });
    }

    if (resource.subresources) {
      Object.entries(resource.subresources).forEach(
        ([subresourceName, subresource]) => {
          processResource(subresource, `${resourcePath}/${subresourceName}`);
        }
      );
    }
  }

  Object.entries(stainlessSpec.resources).forEach(([resourceName, resource]) => {
    processResource(resource, `${basePath}/${resourceName}`);
  });

  return schemaReferences;
}

/**
 * Generate all static params for API reference pages.
 * Used with generateStaticParams in App Router.
 */
export async function generateAllApiReferencePaths(
  specName: SpecName
): Promise<
  Array<{
    type: "resource" | "method" | "schema";
    resource: string;
    slug?: string[];
  }>
> {
  const stainlessSpec = await getStainlessSpec(specName);
  const paths: Array<{
    type: "resource" | "method" | "schema";
    resource: string;
    slug?: string[];
  }> = [];

  function processResource(
    resource: StainlessResource,
    resourceName: string,
    parentPath: string[] = []
  ) {
    const currentPath = [...parentPath, resourceName];

    // Resource overview page
    paths.push({
      type: "resource",
      resource: resourceName,
      slug: parentPath.length > 0 ? currentPath : undefined,
    });

    // Method pages
    if (resource.methods) {
      Object.keys(resource.methods).forEach((methodName) => {
        paths.push({
          type: "method",
          resource: resourceName,
          slug: [...currentPath, methodName],
        });
      });
    }

    // Schema pages
    if (resource.models) {
      Object.keys(resource.models).forEach((modelName) => {
        paths.push({
          type: "schema",
          resource: resourceName,
          slug: [...currentPath, "schemas", modelName],
        });
      });
    }

    // Subresources
    if (resource.subresources) {
      Object.entries(resource.subresources).forEach(
        ([subresourceName, subresource]) => {
          processResource(subresource, subresourceName, currentPath);
        }
      );
    }
  }

  Object.entries(stainlessSpec.resources).forEach(([resourceName, resource]) => {
    processResource(resource, resourceName);
  });

  return paths;
}
