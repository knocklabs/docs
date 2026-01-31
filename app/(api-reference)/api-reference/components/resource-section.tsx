import type { OpenAPIV3 } from "@scalar/openapi-types";
import {
  getOpenApiSpec,
  getStainlessSpec,
} from "../../../../lib/openapi/loader";
import {
  resolveEndpoint,
  getSchemaByRef,
  getOperation,
} from "../../../../lib/openapi/helpers";
import type {
  SpecName,
  StainlessResource,
} from "../../../../lib/openapi/types";
import { ResourceSectionClient } from "./resource-section-client";
import { MethodContentClient } from "./method-content-client";
import { SchemaSectionClient } from "./schema-section-client";

interface ResourceSectionProps {
  specName: SpecName;
  resourceName: string;
  basePath: string;
  baseUrl: string;
  schemaReferences: Record<string, string>;
  path?: string;
}

export async function ResourceSection({
  specName,
  resourceName,
  basePath,
  baseUrl,
  schemaReferences,
  path,
}: ResourceSectionProps) {
  const [openApiSpec, stainlessSpec] = await Promise.all([
    getOpenApiSpec(specName),
    getStainlessSpec(specName),
  ]);

  const resource = stainlessSpec.resources[resourceName];
  if (!resource) {
    return null;
  }

  const methods = resource.methods || {};
  const models = resource.models || {};
  const resourcePath = path ?? `/${resourceName}`;
  const apiSurface = basePath.replace("/", "");

  // Prepare endpoints data for client
  const endpoints = Object.entries(methods).map(
    ([methodName, endpointOrMethodConfig]) => {
      const [methodType, endpoint] = resolveEndpoint(endpointOrMethodConfig);
      return { methodName, methodType, endpoint };
    },
  );

  // Prepare method data for client
  const methodsData = Object.entries(methods)
    .map(([methodName, endpointOrMethodConfig]) => {
      const [methodType, endpoint] = resolveEndpoint(endpointOrMethodConfig);
      const operation = getOperation(openApiSpec, methodType, endpoint);
      if (!operation) return null;

      const methodPath = `${resourcePath}/${methodName}`;
      const methodMdPath = `/${apiSurface}${resourcePath}/${methodName}.md`;

      return {
        methodName,
        methodType,
        endpoint,
        path: methodPath,
        mdPath: methodMdPath,
        operation: JSON.parse(JSON.stringify(operation)), // Serialize for client
      };
    })
    .filter(Boolean);

  // Prepare schema data for client
  const schemasData = Object.entries(models)
    .map(([modelName, modelReference]) => {
      const schema = getSchemaByRef(openApiSpec, modelReference);
      if (!schema) return null;

      const schemaPath = `${resourcePath}/schemas/${modelName}`;
      const schemaMdPath = `/${apiSurface}${resourcePath}/schemas/${modelName}.md`;

      return {
        modelName,
        path: schemaPath,
        mdPath: schemaMdPath,
        schema: JSON.parse(JSON.stringify(schema)), // Serialize for client
      };
    })
    .filter(Boolean);

  // Prepare subresources data
  const subresourcesData = await Promise.all(
    Object.entries(resource.subresources ?? {}).map(
      async ([subresourceName, subresource]) => {
        const subPath = `${resourcePath}/${subresourceName}`;
        const subMethods = subresource.methods || {};
        const subModels = subresource.models || {};

        const subEndpoints = Object.entries(subMethods).map(
          ([methodName, endpointOrMethodConfig]) => {
            const [methodType, endpoint] = resolveEndpoint(
              endpointOrMethodConfig,
            );
            return { methodName, methodType, endpoint };
          },
        );

        const subMethodsData = Object.entries(subMethods)
          .map(([methodName, endpointOrMethodConfig]) => {
            const [methodType, endpoint] = resolveEndpoint(
              endpointOrMethodConfig,
            );
            const operation = getOperation(openApiSpec, methodType, endpoint);
            if (!operation) return null;

            return {
              methodName,
              methodType,
              endpoint,
              path: `${subPath}/${methodName}`,
              mdPath: `/${apiSurface}${subPath}/${methodName}.md`,
              operation: JSON.parse(JSON.stringify(operation)),
            };
          })
          .filter(Boolean);

        const subSchemasData = Object.entries(subModels)
          .map(([modelName, modelReference]) => {
            const schema = getSchemaByRef(openApiSpec, modelReference);
            if (!schema) return null;

            return {
              modelName,
              path: `${subPath}/schemas/${modelName}`,
              mdPath: `/${apiSurface}${subPath}/schemas/${modelName}.md`,
              schema: JSON.parse(JSON.stringify(schema)),
            };
          })
          .filter(Boolean);

        return {
          name: subresource.name || subresourceName,
          description: subresource.description,
          path: subPath,
          mdPath: `/${apiSurface}${subPath}/index.md`,
          endpoints: subEndpoints,
          methods: subMethodsData.filter(
            (m): m is NonNullable<typeof m> => m !== null,
          ),
          schemas: subSchemasData.filter(
            (s): s is NonNullable<typeof s> => s !== null,
          ),
        };
      },
    ),
  );

  return (
    <ResourceSectionClient
      name={resource.name || resourceName}
      description={resource.description}
      path={resourcePath}
      mdPath={`/${apiSurface}${resourcePath}/index.md`}
      endpoints={endpoints}
      methods={methodsData as any}
      schemas={schemasData as any}
      subresources={subresourcesData}
      baseUrl={baseUrl}
      schemaReferences={schemaReferences}
    />
  );
}
