import { OpenAPIV3 } from "@scalar/openapi-types";
import { StainlessConfig, StainlessResource } from "../../lib/openApiSpec";
import JSONPointer from "jsonpointer";
import { SidebarSection, SidebarSubsection } from "../../data/types";
import { startCase } from "lodash";

function resolveEndpointFromMethod(
  endpointOrMethodConfig: string | { endpoint: string },
) {
  const endpointReference =
    typeof endpointOrMethodConfig === "string"
      ? endpointOrMethodConfig
      : endpointOrMethodConfig.endpoint;

  const [methodType, endpoint] = endpointReference.split(" ");
  return [methodType, endpoint];
}

function buildSchemaReferencesForResource(
  resource: StainlessResource,
  openApiSpec: OpenAPIV3.Document,
  basePath: string,
) {
  const schemaReferences: Record<string, string> = {};

  if (resource.models) {
    Object.entries(resource.models).forEach(([modelName, modelRef]) => {
      const schema: OpenAPIV3.SchemaObject | undefined = JSONPointer.get(
        openApiSpec,
        modelRef.replace("#", ""),
      );

      const title = schema?.title ?? modelName;

      if (schema) {
        schemaReferences[title] = `${basePath}/schemas/${modelName}`;
        // This is a hack to make lists work without doing anything to the inner type behavior
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
 * Given a spec and config, builds a complete list of all of the schemas referenced
 * as a map for easy lookup from SchemaName -> path. We use this to then link to schemas
 */
function buildSchemaReferences(
  openApiSpec: OpenAPIV3.Document,
  stainlessSpec: StainlessConfig,
  resourceOrder: string[],
  basePath: string,
) {
  const schemaReferences: Record<string, string> = {};

  resourceOrder.forEach((resourceName) => {
    const resource = stainlessSpec.resources[resourceName];

    Object.assign(
      schemaReferences,
      buildSchemaReferencesForResource(
        resource,
        openApiSpec,
        `${basePath}/${resourceName}`,
      ),
    );
  });

  return schemaReferences;
}

function getSidebarContent(
  openApiSpec: OpenAPIV3.Document,
  stainlessSpec: StainlessConfig,
  resourceOrder: string[],
  basePath: string,
  preSidebarContent?: SidebarSection[],
): SidebarSection[] {
  return (preSidebarContent || []).concat(
    resourceOrder.map((resourceName) => {
      const resource = stainlessSpec.resources[resourceName];

      return {
        title: resource.name || resourceName,
        slug: `/${basePath}/${resourceName}`,
        pages: buildSidebarPages(resource, openApiSpec),
      };
    }),
  );
}

function buildSidebarPages(
  resource: StainlessResource,
  openApiSpec: OpenAPIV3.Document,
) {
  let pages: SidebarSubsection[] = [
    {
      title: "Overview",
      slug: `/`,
    },
  ];

  if (resource.methods) {
    pages.push(
      ...Object.entries(resource.methods).map(([methodName, method]) => {
        const [methodType, endpoint] = resolveEndpointFromMethod(method);
        const openApiOperation = openApiSpec.paths?.[endpoint]?.[methodType];

        return {
          title: openApiOperation?.summary,
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
            title: startCase(subresource.name || subresourceName),
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
        const schema: OpenAPIV3.SchemaObject | undefined = JSONPointer.get(
          openApiSpec,
          modelRef.replace("#", ""),
        );

        return {
          title: schema?.title ?? modelName,
          slug: `/${modelName}`,
        };
      }),
    });
  }

  return pages;
}

function augmentSnippetsWithCurlRequest(
  snippets: Record<string, string>,
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
) {
  const maybeBodyString = body ? `-d '${JSON.stringify(body)}'` : "";

  return {
    curl: `
    curl -X ${methodType.toUpperCase()} ${baseUrl}${endpoint} \\
    -H "Content-Type: application/json" \\
    -H "Authorization: Bearer sk_test_12345" \\
    ${maybeBodyString}
    `,
    ...snippets,
  };
}

export {
  getSidebarContent,
  resolveEndpointFromMethod,
  buildSidebarPages,
  augmentSnippetsWithCurlRequest,
  buildSchemaReferences,
};
