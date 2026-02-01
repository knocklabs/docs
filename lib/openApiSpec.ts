import { dereference } from "@scalar/openapi-parser";
import { OpenAPIV3 } from "@scalar/openapi-types";
import deepmerge from "deepmerge";
import { readFile } from "fs/promises";
import JSONPointer from "jsonpointer";
import safeStringify from "safe-stringify";
import { parse } from "yaml";

// ============================================================================
// Stainless Spec Types
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

// ============================================================================
// Page Data Types (for multi-page API reference)
// ============================================================================

/**
 * Data for a single method page (e.g., /api-reference/users/get)
 */
type MethodPageData = {
  resourceName: string;
  resourceTitle: string;
  methodName: string;
  methodType: string;
  endpoint: string;
  operation: OpenAPIV3.OperationObject;
  baseUrl: string;
  // Subresource path if this method is in a subresource (e.g., ["feeds"])
  // Use null instead of undefined for JSON serialization compatibility
  subresourcePath: string[] | null;
};

/**
 * Data for a single schema page (e.g., /api-reference/users/schemas/user)
 */
type SchemaPageData = {
  resourceName: string;
  resourceTitle: string;
  schemaName: string;
  schemaRef: string;
  schema: OpenAPIV3.SchemaObject;
  // Subresource path if this schema is in a subresource
  // Use null instead of undefined for JSON serialization compatibility
  subresourcePath: string[] | null;
};

/**
 * Summary info for a method in resource overview
 */
type MethodSummary = {
  methodName: string;
  methodType: string;
  endpoint: string;
  summary: string;
};

/**
 * Summary info for a schema in resource overview
 */
type SchemaSummary = {
  schemaName: string;
  title: string;
};

/**
 * Summary info for a subresource in resource overview
 */
type SubresourceSummary = {
  name: string;
  title: string;
  methodCount: number;
};

/**
 * Data for a resource overview page (e.g., /api-reference/users)
 */
type ResourceOverviewData = {
  resourceName: string;
  resource: {
    name: string | null;
    description: string | null;
  };
  methods: MethodSummary[];
  schemas: SchemaSummary[];
  subresources: SubresourceSummary[];
};

/**
 * Sidebar page entry
 */
type SidebarPage = {
  slug: string;
  title: string;
  pages?: SidebarPage[];
};

/**
 * Sidebar section for a resource
 */
type SidebarSection = {
  title: string;
  slug: string;
  pages: SidebarPage[];
};

/**
 * Complete sidebar data for API reference navigation
 */
type SidebarData = {
  resources: SidebarSection[];
};

// ============================================================================
// Spec Name Type
// ============================================================================

type SpecName = "api" | "mapi";

// ============================================================================
// Helper Functions
// ============================================================================

function yamlToJson(yaml: string) {
  const json = parse(yaml);
  return json;
}

/**
 * Resolve endpoint configuration to [methodType, endpoint] tuple.
 * Handles both string format ("get /v1/users") and object format ({ endpoint: "get /v1/users" })
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
// Spec Loading Functions
// ============================================================================

async function readOpenApiSpec(specName: string) {
  const spec = await readFile(`./data/specs/${specName}/openapi.yml`, "utf8");
  const jsonSpec = yamlToJson(spec);
  const { schema } = await dereference(jsonSpec);

  return JSON.parse(safeStringify(schema)) as OpenAPIV3.Document;
}

async function readStainlessSpec(specName: string): Promise<StainlessConfig> {
  const customizations = await readSpecCustomizations(specName);
  const spec = await readFile(`./data/specs/${specName}/stainless.yml`, "utf8");
  const stainlessSpec = parse(spec);
  return deepmerge(stainlessSpec, customizations);
}

async function readSpecCustomizations(specName: string) {
  const spec = await readFile(
    `./data/specs/${specName}/customizations.yml`,
    "utf8",
  );
  const customizations = parse(spec);

  return customizations;
}

// ============================================================================
// Resource Order
// ============================================================================

/**
 * Get the ordered list of resource names for a spec.
 * This determines the order resources appear in the sidebar.
 */
async function getResourceOrder(specName: SpecName): Promise<string[]> {
  const stainlessSpec = await readStainlessSpec(specName);
  // Return all resource keys from the spec
  // For consistent ordering, we can sort alphabetically or maintain spec order
  return Object.keys(stainlessSpec.resources);
}

// ============================================================================
// Method Page Data Loader
// ============================================================================

/**
 * Navigate to a subresource using a path array.
 * Returns the subresource at the given path, or undefined if not found.
 */
function getSubresource(
  resource: StainlessResource,
  subresourcePath: string[],
): StainlessResource | undefined {
  let current: StainlessResource | undefined = resource;

  for (const pathSegment of subresourcePath) {
    if (!current?.subresources?.[pathSegment]) {
      return undefined;
    }
    current = current.subresources[pathSegment];
  }

  return current;
}

/**
 * Load data for a single method page.
 * Supports methods in both top-level resources and subresources.
 */
async function getMethodPageData(
  specName: SpecName,
  resourceName: string,
  methodName: string,
  subresourcePath: string[] = [],
): Promise<MethodPageData | null> {
  const [openApiSpec, stainlessSpec] = await Promise.all([
    readOpenApiSpec(specName),
    readStainlessSpec(specName),
  ]);

  const resource = stainlessSpec.resources[resourceName];
  if (!resource) {
    return null;
  }

  // Navigate to the target resource (may be a subresource)
  const targetResource =
    subresourcePath.length > 0
      ? getSubresource(resource, subresourcePath)
      : resource;

  if (!targetResource?.methods?.[methodName]) {
    return null;
  }

  const methodConfig = targetResource.methods[methodName];
  const [methodType, endpoint] = resolveEndpoint(methodConfig);
  const operation = openApiSpec.paths?.[endpoint]?.[
    methodType as keyof OpenAPIV3.PathItemObject
  ] as OpenAPIV3.OperationObject | undefined;

  if (!operation) {
    return null;
  }

  // Determine the resource title (use parent resource name for subresources)
  const resourceTitle = resource.name || resourceName;

  return {
    resourceName,
    resourceTitle,
    methodName,
    methodType,
    endpoint,
    operation,
    baseUrl: stainlessSpec.environments.production,
    subresourcePath: subresourcePath.length > 0 ? subresourcePath : null,
  };
}

// ============================================================================
// Schema Page Data Loader
// ============================================================================

/**
 * Load data for a single schema page.
 * Supports schemas in both top-level resources and subresources.
 */
async function getSchemaPageData(
  specName: SpecName,
  resourceName: string,
  schemaName: string,
  subresourcePath: string[] = [],
): Promise<SchemaPageData | null> {
  const [openApiSpec, stainlessSpec] = await Promise.all([
    readOpenApiSpec(specName),
    readStainlessSpec(specName),
  ]);

  const resource = stainlessSpec.resources[resourceName];
  if (!resource) {
    return null;
  }

  // Navigate to the target resource (may be a subresource)
  const targetResource =
    subresourcePath.length > 0
      ? getSubresource(resource, subresourcePath)
      : resource;

  if (!targetResource?.models?.[schemaName]) {
    return null;
  }

  const schemaRef = targetResource.models[schemaName];
  const schema = JSONPointer.get(openApiSpec, schemaRef.replace("#", "")) as
    | OpenAPIV3.SchemaObject
    | undefined;

  if (!schema) {
    return null;
  }

  const resourceTitle = resource.name || resourceName;

  return {
    resourceName,
    resourceTitle,
    schemaName,
    schemaRef,
    schema,
    subresourcePath: subresourcePath.length > 0 ? subresourcePath : null,
  };
}

// ============================================================================
// Resource Overview Data Loader
// ============================================================================

/**
 * Load data for a resource overview page.
 * Includes list of methods, schemas, and subresources with summary info.
 */
async function getResourceOverviewData(
  specName: SpecName,
  resourceName: string,
  subresourcePath: string[] = [],
): Promise<ResourceOverviewData | null> {
  const [openApiSpec, stainlessSpec] = await Promise.all([
    readOpenApiSpec(specName),
    readStainlessSpec(specName),
  ]);

  const resource = stainlessSpec.resources[resourceName];
  if (!resource) {
    return null;
  }

  // Navigate to the target resource (may be a subresource)
  const targetResource =
    subresourcePath.length > 0
      ? getSubresource(resource, subresourcePath)
      : resource;

  if (!targetResource) {
    return null;
  }

  // Build list of methods with summary info
  const methods: MethodSummary[] = Object.entries(
    targetResource.methods || {},
  ).map(([methodName, config]) => {
    const [methodType, endpoint] = resolveEndpoint(config);
    const operation = openApiSpec.paths?.[endpoint]?.[
      methodType as keyof OpenAPIV3.PathItemObject
    ] as OpenAPIV3.OperationObject | undefined;
    return {
      methodName,
      methodType,
      endpoint,
      summary: operation?.summary || methodName,
    };
  });

  // Build list of schemas with name/title
  const schemas: SchemaSummary[] = Object.entries(
    targetResource.models || {},
  ).map(([schemaName, ref]) => {
    const schema = JSONPointer.get(openApiSpec, ref.replace("#", "")) as
      | OpenAPIV3.SchemaObject
      | undefined;
    return {
      schemaName,
      title: schema?.title || schemaName,
    };
  });

  // Build subresource info
  const subresources: SubresourceSummary[] = Object.entries(
    targetResource.subresources || {},
  ).map(([subName, subResource]) => ({
    name: subName,
    title: subResource.name || subName,
    methodCount: Object.keys(subResource.methods || {}).length,
  }));

  return {
    resourceName,
    resource: {
      name: targetResource.name || null,
      description: targetResource.description || null,
    },
    methods,
    schemas,
    subresources,
  };
}

// ============================================================================
// Path Generation for Static Paths
// ============================================================================

type ApiReferencePath = {
  params: {
    resource: string;
    slug?: string[];
  };
};

/**
 * Generate all static paths for API reference pages.
 * Used by getStaticPaths to generate all method, schema, and subresource pages.
 */
async function getAllApiReferencePaths(
  specName: SpecName,
): Promise<ApiReferencePath[]> {
  const stainlessSpec = await readStainlessSpec(specName);
  const paths: ApiReferencePath[] = [];

  function processResource(
    resource: StainlessResource,
    resourceName: string,
    parentSlug: string[] = [],
  ) {
    // Resource overview (no slug for top-level, has slug for subresources)
    if (parentSlug.length === 0) {
      paths.push({ params: { resource: resourceName } });
    } else {
      // Subresource overview
      paths.push({
        params: {
          resource: resourceName,
          slug: parentSlug,
        },
      });
    }

    // Method pages
    if (resource.methods) {
      Object.keys(resource.methods).forEach((methodName) => {
        paths.push({
          params: {
            resource: resourceName,
            slug: [...parentSlug, methodName],
          },
        });
      });
    }

    // Schema pages
    if (resource.models) {
      Object.keys(resource.models).forEach((schemaName) => {
        paths.push({
          params: {
            resource: resourceName,
            slug: [...parentSlug, "schemas", schemaName],
          },
        });
      });
    }

    // Subresources (recursive)
    if (resource.subresources) {
      Object.entries(resource.subresources).forEach(
        ([subName, subResource]) => {
          // Process subresource methods, schemas, and nested subresources
          processResource(subResource, resourceName, [...parentSlug, subName]);
        },
      );
    }
  }

  Object.entries(stainlessSpec.resources).forEach(
    ([resourceName, resource]) => {
      processResource(resource, resourceName);
    },
  );

  return paths;
}

// ============================================================================
// Sidebar Data Loader
// ============================================================================

/**
 * Build sidebar pages for a resource (recursively handles subresources)
 */
function buildResourceSidebarPages(
  resource: StainlessResource,
  openApiSpec: OpenAPIV3.Document,
  pathPrefix: string,
): SidebarPage[] {
  const pages: SidebarPage[] = [];

  // Methods
  if (resource.methods) {
    Object.entries(resource.methods).forEach(([methodName, methodConfig]) => {
      const [methodType, endpoint] = resolveEndpoint(methodConfig);
      const operation = openApiSpec.paths?.[endpoint]?.[
        methodType as keyof OpenAPIV3.PathItemObject
      ] as OpenAPIV3.OperationObject | undefined;

      pages.push({
        slug: `${pathPrefix}/${methodName}`,
        title: operation?.summary || methodName,
      });
    });
  }

  // Subresources
  if (resource.subresources) {
    Object.entries(resource.subresources).forEach(([subName, subResource]) => {
      const subPages = buildResourceSidebarPages(
        subResource,
        openApiSpec,
        `${pathPrefix}/${subName}`,
      );

      pages.push({
        slug: `${pathPrefix}/${subName}`,
        title: subResource.name || subName,
        pages: subPages,
      });
    });
  }

  // Schemas
  if (resource.models && Object.keys(resource.models).length > 0) {
    const schemaPages: SidebarPage[] = Object.entries(resource.models).map(
      ([schemaName, schemaRef]) => {
        const schema = JSONPointer.get(
          openApiSpec,
          schemaRef.replace("#", ""),
        ) as OpenAPIV3.SchemaObject | undefined;

        return {
          slug: `${pathPrefix}/schemas/${schemaName}`,
          title: schema?.title || schemaName,
        };
      },
    );

    pages.push({
      slug: `${pathPrefix}/schemas`,
      title: "Object definitions",
      pages: schemaPages,
    });
  }

  return pages;
}

/**
 * Load sidebar structure for navigation.
 * Includes links to all resources, methods, and schemas.
 */
async function getSidebarData(specName: SpecName): Promise<SidebarData> {
  const [openApiSpec, stainlessSpec] = await Promise.all([
    readOpenApiSpec(specName),
    readStainlessSpec(specName),
  ]);

  const basePath = specName === "api" ? "/api-reference" : "/mapi-reference";

  const resources: SidebarSection[] = Object.entries(
    stainlessSpec.resources,
  ).map(([resourceName, resource]) => {
    const pathPrefix = `${basePath}/${resourceName}`;

    return {
      title: resource.name || resourceName,
      slug: pathPrefix,
      pages: buildResourceSidebarPages(resource, openApiSpec, pathPrefix),
    };
  });

  return { resources };
}

// ============================================================================
// Schema References Builder
// ============================================================================

/**
 * Build a map of schema names to their URL paths.
 * Used for cross-linking schemas in method documentation.
 */
function buildSchemaReferencesForResource(
  resource: StainlessResource,
  openApiSpec: OpenAPIV3.Document,
  basePath: string,
): Record<string, string> {
  const schemaReferences: Record<string, string> = {};

  if (resource.models) {
    Object.entries(resource.models).forEach(([modelName, modelRef]) => {
      const schema = JSONPointer.get(openApiSpec, modelRef.replace("#", "")) as
        | OpenAPIV3.SchemaObject
        | undefined;

      const title = schema?.title ?? modelName;

      if (schema) {
        schemaReferences[title] = `${basePath}/schemas/${modelName}`;
        // Also map array types
        schemaReferences[`${title}[]`] = `${basePath}/schemas/${modelName}`;
      }
    });
  }

  if (resource.subresources) {
    Object.entries(resource.subresources).forEach(
      ([subresourceName, subresource]) => {
        Object.assign(
          schemaReferences,
          buildSchemaReferencesForResource(
            subresource,
            openApiSpec,
            `${basePath}/${subresourceName}`,
          ),
        );
      },
    );
  }

  return schemaReferences;
}

/**
 * Build complete schema references map for all resources.
 */
async function buildSchemaReferences(
  specName: SpecName,
): Promise<Record<string, string>> {
  const [openApiSpec, stainlessSpec] = await Promise.all([
    readOpenApiSpec(specName),
    readStainlessSpec(specName),
  ]);

  const basePath = specName === "api" ? "/api-reference" : "/mapi-reference";
  const schemaReferences: Record<string, string> = {};

  Object.entries(stainlessSpec.resources).forEach(
    ([resourceName, resource]) => {
      Object.assign(
        schemaReferences,
        buildSchemaReferencesForResource(
          resource,
          openApiSpec,
          `${basePath}/${resourceName}`,
        ),
      );
    },
  );

  return schemaReferences;
}

// ============================================================================
// Exports
// ============================================================================

export type {
  StainlessResource,
  StainlessResourceMethod,
  StainlessConfig,
  MethodPageData,
  SchemaPageData,
  ResourceOverviewData,
  MethodSummary,
  SchemaSummary,
  SubresourceSummary,
  SidebarPage,
  SidebarSection,
  SidebarData,
  ApiReferencePath,
  SpecName,
};

export {
  // Existing exports
  readOpenApiSpec,
  readStainlessSpec,
  // New helper
  resolveEndpoint,
  // New page data loaders
  getMethodPageData,
  getSchemaPageData,
  getResourceOverviewData,
  // Path generation
  getAllApiReferencePaths,
  getResourceOrder,
  // Sidebar data
  getSidebarData,
  // Schema references
  buildSchemaReferences,
};
