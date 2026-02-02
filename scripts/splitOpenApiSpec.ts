/**
 * Build-time script that splits the OpenAPI spec into per-resource JSON files.
 * This reduces the data sent to each resource page from ~19k lines to just what's needed.
 *
 * Run with: yarn split-specs
 */

import { dereference } from "@scalar/openapi-parser";
import { OpenAPIV3 } from "@scalar/openapi-types";
import deepmerge from "deepmerge";
import { readFile, writeFile, mkdir } from "fs/promises";
import JSONPointer from "jsonpointer";
import safeStringify from "safe-stringify";
import { parse } from "yaml";

// ============================================================================
// Types
// ============================================================================

type StainlessResourceMethod =
  | string
  | {
      type: "http";
      endpoint: string;
      positional_params?: string[];
    };

type StainlessResource = {
  name?: string;
  description?: string;
  models?: Record<string, string>;
  methods?: Record<string, StainlessResourceMethod>;
  subresources?: Record<string, StainlessResource>;
};

interface StainlessConfig {
  resources: {
    [key: string]: StainlessResource;
  };
  environments: Record<string, string>;
}

type SpecName = "api" | "mapi";

/**
 * Data structure for a split resource file.
 * Contains only the data needed to render a single resource page.
 */
export type SplitResourceData = {
  resourceName: string;
  resource: StainlessResource;
  paths: Record<string, OpenAPIV3.PathItemObject>;
  schemas: Record<string, OpenAPIV3.SchemaObject>;
  schemaReferences: Record<string, string>;
  baseUrl: string;
};

// ============================================================================
// Helpers
// ============================================================================

function yamlToJson(yaml: string) {
  return parse(yaml);
}

/**
 * Resolve endpoint configuration to [methodType, endpoint] tuple.
 */
function resolveEndpoint(
  methodConfig: StainlessResourceMethod,
): [string, string] {
  const endpointString =
    typeof methodConfig === "string" ? methodConfig : methodConfig.endpoint;
  const [methodType, endpoint] = endpointString.split(" ");
  return [methodType.toLowerCase(), endpoint];
}

// ============================================================================
// Spec Loading
// ============================================================================

async function readOpenApiSpec(specName: string): Promise<OpenAPIV3.Document> {
  const spec = await readFile(`./data/specs/${specName}/openapi.yml`, "utf8");
  const jsonSpec = yamlToJson(spec);
  const { schema } = await dereference(jsonSpec);
  return JSON.parse(safeStringify(schema)) as OpenAPIV3.Document;
}

async function readSpecCustomizations(specName: string) {
  const spec = await readFile(
    `./data/specs/${specName}/customizations.yml`,
    "utf8",
  );
  return parse(spec);
}

async function readStainlessSpec(specName: string): Promise<StainlessConfig> {
  const customizations = await readSpecCustomizations(specName);
  const spec = await readFile(
    `./data/specs/${specName}/stainless.yml`,
    "utf8",
  );
  const stainlessSpec = parse(spec);
  return deepmerge(stainlessSpec, customizations) as StainlessConfig;
}

// ============================================================================
// Path Extraction
// ============================================================================

/**
 * Extract all endpoints used by a resource and its subresources.
 */
function extractPathsForResource(
  resource: StainlessResource,
  openApiSpec: OpenAPIV3.Document,
): Record<string, OpenAPIV3.PathItemObject> {
  const paths: Record<string, OpenAPIV3.PathItemObject> = {};

  // Extract paths from methods
  if (resource.methods) {
    for (const methodConfig of Object.values(resource.methods)) {
      const [methodType, endpoint] = resolveEndpoint(methodConfig);
      const pathItem = openApiSpec.paths?.[endpoint];

      if (pathItem) {
        // Only include the specific method we need, not the entire path object
        if (!paths[endpoint]) {
          paths[endpoint] = {};
        }
        const method = methodType as keyof OpenAPIV3.PathItemObject;
        if (pathItem[method]) {
          (paths[endpoint] as Record<string, unknown>)[method] =
            pathItem[method];
        }
        // Also include path-level parameters if they exist
        if (pathItem.parameters) {
          paths[endpoint].parameters = pathItem.parameters;
        }
      }
    }
  }

  // Recursively extract paths from subresources
  if (resource.subresources) {
    for (const subresource of Object.values(resource.subresources)) {
      Object.assign(paths, extractPathsForResource(subresource, openApiSpec));
    }
  }

  return paths;
}

// ============================================================================
// Schema Extraction (with dependency resolution)
// ============================================================================

/**
 * Extract a schema name from a $ref string.
 * Example: "#/components/schemas/User" -> "User"
 */
function getSchemaNameFromRef(ref: string): string | null {
  const match = ref.match(/^#\/components\/schemas\/(.+)$/);
  return match ? match[1] : null;
}

/**
 * Recursively find all schema references within a schema object.
 * This handles nested objects, arrays, allOf, oneOf, anyOf, etc.
 */
function findSchemaReferences(obj: unknown, refs: Set<string>): void {
  if (!obj || typeof obj !== "object") {
    return;
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      findSchemaReferences(item, refs);
    }
    return;
  }

  const record = obj as Record<string, unknown>;

  // Check for $ref
  if (typeof record.$ref === "string") {
    refs.add(record.$ref);
  }

  // Recurse into all properties
  for (const value of Object.values(record)) {
    findSchemaReferences(value, refs);
  }
}

/**
 * Extract schemas referenced by a resource and all their dependencies.
 * Uses recursive resolution to include nested schema references.
 */
function extractSchemasForResource(
  resource: StainlessResource,
  openApiSpec: OpenAPIV3.Document,
  collectedSchemas: Map<string, OpenAPIV3.SchemaObject> = new Map(),
  visited: Set<string> = new Set(),
): Map<string, OpenAPIV3.SchemaObject> {
  // First, collect schemas directly referenced in models
  if (resource.models) {
    for (const modelRef of Object.values(resource.models)) {
      extractSchemaWithDependencies(
        modelRef,
        openApiSpec,
        collectedSchemas,
        visited,
      );
    }
  }

  // Also extract schemas referenced in operation bodies and responses
  if (resource.methods) {
    for (const methodConfig of Object.values(resource.methods)) {
      const [methodType, endpoint] = resolveEndpoint(methodConfig);
      const operation = openApiSpec.paths?.[endpoint]?.[
        methodType as keyof OpenAPIV3.PathItemObject
      ] as OpenAPIV3.OperationObject | undefined;

      if (operation) {
        // Find all refs in the operation
        const refs = new Set<string>();
        findSchemaReferences(operation, refs);

        for (const ref of refs) {
          extractSchemaWithDependencies(
            ref,
            openApiSpec,
            collectedSchemas,
            visited,
          );
        }
      }
    }
  }

  // Recursively process subresources
  if (resource.subresources) {
    for (const subresource of Object.values(resource.subresources)) {
      extractSchemasForResource(
        subresource,
        openApiSpec,
        collectedSchemas,
        visited,
      );
    }
  }

  return collectedSchemas;
}

/**
 * Extract a single schema and all its dependencies recursively.
 */
function extractSchemaWithDependencies(
  schemaRef: string,
  openApiSpec: OpenAPIV3.Document,
  collectedSchemas: Map<string, OpenAPIV3.SchemaObject>,
  visited: Set<string>,
): void {
  if (visited.has(schemaRef)) {
    return;
  }
  visited.add(schemaRef);

  // Get the schema
  const schema = JSONPointer.get(openApiSpec, schemaRef.replace("#", "")) as
    | OpenAPIV3.SchemaObject
    | undefined;

  if (!schema) {
    return;
  }

  // Extract schema name from ref
  const schemaName = getSchemaNameFromRef(schemaRef);
  if (schemaName) {
    collectedSchemas.set(schemaName, schema);
  }

  // Find all nested references in this schema
  const nestedRefs = new Set<string>();
  findSchemaReferences(schema, nestedRefs);

  // Recursively extract each referenced schema
  for (const ref of nestedRefs) {
    extractSchemaWithDependencies(ref, openApiSpec, collectedSchemas, visited);
  }
}

// ============================================================================
// Schema References Builder
// ============================================================================

/**
 * Build schema references map for a resource (used for cross-linking).
 */
function buildSchemaReferencesForResource(
  resource: StainlessResource,
  openApiSpec: OpenAPIV3.Document,
  basePath: string,
): Record<string, string> {
  const schemaReferences: Record<string, string> = {};

  if (resource.models) {
    for (const [modelName, modelRef] of Object.entries(resource.models)) {
      const schema = JSONPointer.get(openApiSpec, modelRef.replace("#", "")) as
        | OpenAPIV3.SchemaObject
        | undefined;

      const title = schema?.title ?? modelName;

      if (schema) {
        schemaReferences[title] = `${basePath}/schemas/${modelName}`;
        schemaReferences[`${title}[]`] = `${basePath}/schemas/${modelName}`;
      }
    }
  }

  if (resource.subresources) {
    for (const [subresourceName, subresource] of Object.entries(
      resource.subresources,
    )) {
      Object.assign(
        schemaReferences,
        buildSchemaReferencesForResource(
          subresource,
          openApiSpec,
          `${basePath}/${subresourceName}`,
        ),
      );
    }
  }

  return schemaReferences;
}

/**
 * Build complete schema references for all resources (for cross-resource linking).
 */
function buildAllSchemaReferences(
  stainlessSpec: StainlessConfig,
  openApiSpec: OpenAPIV3.Document,
  basePath: string,
): Record<string, string> {
  const schemaReferences: Record<string, string> = {};

  for (const [resourceName, resource] of Object.entries(
    stainlessSpec.resources,
  )) {
    Object.assign(
      schemaReferences,
      buildSchemaReferencesForResource(
        resource,
        openApiSpec,
        `${basePath}/${resourceName}`,
      ),
    );
  }

  return schemaReferences;
}

// ============================================================================
// Main Split Function
// ============================================================================

async function splitSpec(specName: SpecName): Promise<void> {
  console.log(`Splitting ${specName} spec...`);

  const [openApiSpec, stainlessSpec] = await Promise.all([
    readOpenApiSpec(specName),
    readStainlessSpec(specName),
  ]);

  const basePath =
    specName === "api" ? "/api-reference" : "/mapi-reference";
  const baseUrl = stainlessSpec.environments.production;

  // Build complete schema references for cross-resource linking
  const allSchemaReferences = buildAllSchemaReferences(
    stainlessSpec,
    openApiSpec,
    basePath,
  );

  // Create output directory
  const outputDir = `./data/specs/${specName}/resources`;
  await mkdir(outputDir, { recursive: true });

  // Process each resource
  for (const [resourceName, resource] of Object.entries(
    stainlessSpec.resources,
  )) {
    console.log(`  Processing ${resourceName}...`);

    // Extract paths for this resource
    const paths = extractPathsForResource(resource, openApiSpec);

    // Extract schemas with dependencies
    const schemasMap = extractSchemasForResource(resource, openApiSpec);
    const schemas: Record<string, OpenAPIV3.SchemaObject> = {};
    for (const [name, schema] of schemasMap) {
      schemas[name] = schema;
    }

    // Build the split resource data
    const splitData: SplitResourceData = {
      resourceName,
      resource,
      paths,
      schemas,
      schemaReferences: allSchemaReferences,
      baseUrl,
    };

    // Write to file
    const outputPath = `${outputDir}/${resourceName}.json`;
    await writeFile(outputPath, JSON.stringify(splitData, null, 2));
    console.log(`    -> ${outputPath}`);
  }

  console.log(`Done splitting ${specName} spec.`);
}

// ============================================================================
// Entry Point
// ============================================================================

async function main() {
  console.log("Splitting OpenAPI specs by resource...\n");

  await Promise.all([splitSpec("api"), splitSpec("mapi")]);

  console.log("\nAll specs split successfully.");
}

main().catch((error) => {
  console.error("Error splitting specs:", error);
  process.exit(1);
});
