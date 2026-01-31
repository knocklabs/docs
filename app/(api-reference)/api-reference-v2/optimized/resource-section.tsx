/**
 * Server Component for rendering a resource section.
 *
 * This is a SERVER component - it runs only on the server.
 * The OpenAPI spec is processed here and converted to HTML.
 * Only the HTML is sent to the client.
 *
 * For interactive elements (like expandable properties), we use
 * client component islands within the server-rendered content.
 */

import type { OpenAPIV3 } from "@scalar/openapi-types";
import JSONPointer from "jsonpointer";

import { Box } from "@telegraph/layout";
import { Heading } from "@telegraph/typography";

import { StainlessResource } from "../../../../lib/openApiSpec";
import { resolveEndpointFromMethod } from "../../../../lib/openApiSpec.server";

// Static display components (server-safe)
import { StaticSection } from "./static-section";
import { StaticEndpointList } from "./static-endpoint-list";
import { StaticMethodContent } from "./static-method-content";
import { StaticSchemaContent } from "./static-schema-content";

interface Props {
  resourceName: string;
  resource: StainlessResource;
  openApiSpec: OpenAPIV3.Document;
  baseUrl: string;
  schemaReferences: Record<string, string>;
  basePath: string;
  parentPath?: string;
}

export function ResourceSection({
  resourceName,
  resource,
  openApiSpec,
  baseUrl,
  schemaReferences,
  basePath,
  parentPath = "",
}: Props) {
  const methods = resource.methods || {};
  const models = resource.models || {};
  const currentPath = parentPath ? `${parentPath}/${resourceName}` : `/${resourceName}`;

  // Build endpoint list for the overview
  const endpoints = Object.entries(methods).map(
    ([methodName, endpointOrMethodConfig]) => {
      const [methodType, endpoint] = resolveEndpointFromMethod(
        endpointOrMethodConfig
      );
      return { methodName, methodType, endpoint };
    }
  );

  return (
    <>
      {/* Resource Overview Section */}
      <StaticSection
        title={resource.name || resourceName}
        path={currentPath}
        description={resource.description}
      >
        {endpoints.length > 0 && <StaticEndpointList endpoints={endpoints} />}
      </StaticSection>

      {/* Method Sections */}
      {Object.entries(methods).map(([methodName, endpointOrMethodConfig]) => {
        const [methodType, endpoint] = resolveEndpointFromMethod(
          endpointOrMethodConfig
        );
        const operation = openApiSpec.paths?.[endpoint]?.[methodType];

        if (!operation) {
          return null;
        }

        const methodPath = `${currentPath}/${methodName}`;

        return (
          <StaticMethodContent
            key={methodName}
            methodName={methodName}
            methodType={methodType as "get" | "post" | "put" | "delete"}
            endpoint={endpoint}
            operation={operation}
            path={methodPath}
            baseUrl={baseUrl}
            schemaReferences={schemaReferences}
          />
        );
      })}

      {/* Subresources (recursive) */}
      {Object.entries(resource.subresources ?? {}).map(
        ([subresourceName, subresource]) => (
          <ResourceSection
            key={subresourceName}
            resourceName={subresourceName}
            resource={subresource}
            openApiSpec={openApiSpec}
            baseUrl={baseUrl}
            schemaReferences={schemaReferences}
            basePath={basePath}
            parentPath={currentPath}
          />
        )
      )}

      {/* Schema/Model Sections */}
      {Object.entries(models).map(([modelName, modelReference]) => {
        const schema: OpenAPIV3.SchemaObject | undefined = JSONPointer.get(
          openApiSpec,
          modelReference.replace("#", "")
        );

        if (!schema) {
          return null;
        }

        const schemaPath = `${currentPath}/schemas/${modelName}`;

        return (
          <StaticSchemaContent
            key={modelName}
            modelName={modelName}
            schema={schema}
            path={schemaPath}
            schemaReferences={schemaReferences}
          />
        );
      })}
    </>
  );
}
