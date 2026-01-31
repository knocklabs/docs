import type { OpenAPIV3 } from "@scalar/openapi-types";
import JSONPointer from "jsonpointer";
import type {
  StainlessMethodConfig,
  StainlessResource,
  StainlessConfig,
  MethodData,
  SchemaData,
  SpecName,
  SidebarItem,
} from "./types";
import { getOpenApiSpec, getStainlessSpec } from "./loader";

/**
 * Resolve endpoint from Stainless method config.
 */
export function resolveEndpoint(
  config: StainlessMethodConfig,
): [string, string] {
  const endpoint = typeof config === "string" ? config : config.endpoint;
  const [method, path] = endpoint.split(" ");
  return [method.toLowerCase(), path];
}

/**
 * Get operation from OpenAPI spec for a given endpoint.
 */
export function getOperation(
  spec: OpenAPIV3.Document,
  methodType: string,
  endpoint: string,
): OpenAPIV3.OperationObject | undefined {
  return spec.paths?.[endpoint]?.[
    methodType as keyof OpenAPIV3.PathItemObject
  ] as OpenAPIV3.OperationObject | undefined;
}

/**
 * Get schema by $ref from OpenAPI spec.
 */
export function getSchemaByRef(
  spec: OpenAPIV3.Document,
  ref: string,
): OpenAPIV3.SchemaObject | undefined {
  return JSONPointer.get(spec, ref.replace("#", ""));
}

/**
 * Build schema references map for cross-linking.
 */
export async function buildSchemaReferences(
  specName: SpecName,
  basePath: string,
): Promise<Record<string, string>> {
  const [spec, stainless] = await Promise.all([
    getOpenApiSpec(specName),
    getStainlessSpec(specName),
  ]);

  const references: Record<string, string> = {};

  function processResource(resource: StainlessResource, path: string) {
    if (resource.models) {
      Object.entries(resource.models).forEach(([modelName, ref]) => {
        const schema = getSchemaByRef(spec, ref);
        const title = schema?.title ?? modelName;
        references[title] = `${path}/schemas/${modelName}`;
        // This is a hack to make lists work without doing anything to the inner type behavior
        references[`${title}[]`] = `${path}/schemas/${modelName}`;
      });
    }
    if (resource.subresources) {
      Object.entries(resource.subresources).forEach(([name, sub]) => {
        processResource(sub, `${path}/${name}`);
      });
    }
  }

  Object.entries(stainless.resources).forEach(([name, resource]) => {
    processResource(resource, `${basePath}/${name}`);
  });

  return references;
}

/**
 * Get all methods for a resource.
 */
export function getResourceMethods(
  spec: OpenAPIV3.Document,
  resource: StainlessResource,
): MethodData[] {
  if (!resource.methods) return [];

  return Object.entries(resource.methods)
    .map(([methodName, config]) => {
      const [methodType, endpoint] = resolveEndpoint(config);
      const operation = getOperation(spec, methodType, endpoint);
      if (!operation) return null;
      return { methodName, methodType, endpoint, operation } as MethodData;
    })
    .filter((m): m is MethodData => m !== null);
}

/**
 * Get all schemas for a resource.
 */
export function getResourceSchemas(
  spec: OpenAPIV3.Document,
  resource: StainlessResource,
): SchemaData[] {
  if (!resource.models) return [];

  return Object.entries(resource.models)
    .map(([modelName, ref]) => {
      const schema = getSchemaByRef(spec, ref);
      if (!schema) return null;
      return { modelName, schema };
    })
    .filter((s): s is SchemaData => s !== null);
}

/**
 * Formats response status codes for the given OpenAPI operation.
 */
export function formatResponseStatusCodes(
  method: OpenAPIV3.OperationObject,
): string[] {
  return Object.entries(method.responses ?? {}).map(
    ([statusCode, respObject]) =>
      (respObject as OpenAPIV3.ResponseObject).description
        ? `${statusCode} ${
            (respObject as OpenAPIV3.ResponseObject).description
          }`
        : statusCode,
  );
}

/**
 * Resolve response schemas from an OpenAPI operation.
 */
export function resolveResponseSchemas(
  method: OpenAPIV3.OperationObject,
): OpenAPIV3.SchemaObject[] {
  const responseSchemas: OpenAPIV3.SchemaObject[] = Object.values(
    method.responses || {},
  )
    .map(
      (r) =>
        (r as OpenAPIV3.ResponseObject).content?.["application/json"]?.schema,
    )
    .filter((r) => !!r)
    .map((responseSchema) => {
      if ((responseSchema as OpenAPIV3.SchemaObject)?.allOf) {
        return (responseSchema as OpenAPIV3.SchemaObject).allOf?.[0];
      }
      return responseSchema;
    }) as OpenAPIV3.SchemaObject[];

  return responseSchemas;
}

/**
 * Augment snippets with a curl request.
 */
export function augmentSnippetsWithCurlRequest(
  snippets: Record<string, string> | undefined,
  {
    baseUrl,
    methodType,
    endpoint,
    body,
  }: {
    baseUrl: string;
    methodType: string;
    endpoint: string;
    body?: Record<string, unknown>;
  },
): Record<string, string> {
  const maybeBodyString = body ? `-d '${JSON.stringify(body)}'` : "";

  return {
    curl: `
    curl -X ${methodType.toUpperCase()} ${baseUrl}${endpoint} \\
    -H "Content-Type: application/json" \\
    -H "Authorization: Bearer sk_test_12345" \\
    ${maybeBodyString}
    `,
    ...(snippets || {}),
  };
}

/**
 * Build sidebar pages for a resource.
 */
function buildSidebarPages(
  resource: StainlessResource,
  openApiSpec: OpenAPIV3.Document,
): SidebarItem[] {
  const pages: SidebarItem[] = [
    {
      title: "Overview",
      slug: `/`,
    },
  ];

  if (resource.methods) {
    pages.push(
      ...Object.entries(resource.methods).map(([methodName, method]) => {
        const [methodType, endpoint] = resolveEndpoint(method);
        const openApiOperation = getOperation(
          openApiSpec,
          methodType,
          endpoint,
        );

        return {
          title: openApiOperation?.summary || methodName,
          slug: `/${methodName}`,
        };
      }),
    );
  }

  if (resource.subresources) {
    pages.push(
      ...Object.entries(resource.subresources).map(
        ([subresourceName, subresource]) => {
          return {
            title: subresource.name || subresourceName,
            slug: `/${subresourceName}`,
            pages: buildSidebarPages(subresource, openApiSpec),
          };
        },
      ),
    );
  }

  if (resource.models) {
    pages.push({
      title: "Object definitions",
      slug: `/schemas`,
      pages: Object.entries(resource.models).map(([modelName, modelRef]) => {
        const schema = getSchemaByRef(openApiSpec, modelRef);

        return {
          title: schema?.title ?? modelName,
          slug: `/${modelName}`,
        };
      }),
    });
  }

  return pages;
}

/**
 * Get sidebar content for API reference.
 */
export async function getSidebarContent(
  specName: SpecName,
  resourceOrder: string[],
  basePath: string,
  preSidebarContent?: SidebarItem[],
): Promise<SidebarItem[]> {
  const [openApiSpec, stainlessSpec] = await Promise.all([
    getOpenApiSpec(specName),
    getStainlessSpec(specName),
  ]);

  return (preSidebarContent || []).concat(
    resourceOrder.map((resourceName) => {
      const resource = stainlessSpec.resources[resourceName];

      return {
        title: resource.name || resourceName,
        slug: `${basePath}/${resourceName}`,
        pages: buildSidebarPages(resource, openApiSpec),
      };
    }),
  );
}
