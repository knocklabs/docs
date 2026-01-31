"use client";

/**
 * Client component for rendering API reference sections.
 *
 * This is a client-side version of the ApiReferenceSection component
 * that works with the App Router context setup.
 */

import React from "react";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import Markdown from "react-markdown";
import JSONPointer from "jsonpointer";

import { Box } from "@telegraph/layout";
import { Heading } from "@telegraph/typography";

import { StainlessResource } from "../../../lib/openApiSpec";
import { ContentColumn, ExampleColumn, Section } from "../../../components/ui/ApiSections";
import { Endpoint, Endpoints } from "../../../components/ui/Endpoints";
import { CodeBlock } from "../../../components/ui/CodeBlock";
import { SchemaProperties } from "../../../components/ui/ApiReference/SchemaProperties";
import { resolveEndpointFromMethod } from "../../../components/ui/ApiReference/helpers";
import { useApiReference } from "./api-reference-context";
import { ApiReferenceMethodClient } from "./api-reference-method-client";

interface Props {
  resourceName: string;
  resource: StainlessResource;
  path?: string;
  basePath: string;
}

export function ApiReferenceSectionClient({
  resourceName,
  resource,
  path,
  basePath,
}: Props) {
  const { openApiSpec } = useApiReference();
  const methods = resource.methods || {};
  const models = resource.models || {};
  const currentPath = path ?? `/${resourceName}`;

  // Generate markdown path for the resource overview
  const resourceMdPath = `/${basePath}${currentPath}/index.md`;

  return (
    <>
      <Box data-resource-path={currentPath}>
        <Section
          title={resource.name}
          path={currentPath}
          mdPath={resourceMdPath}
        >
          <ContentColumn>
            {resource.description && (
              <Markdown>{resource.description}</Markdown>
            )}
          </ContentColumn>
          <ExampleColumn>
            {Object.entries(methods).length > 0 && (
              <Endpoints>
                {Object.entries(methods).map(
                  ([methodName, endpointOrMethodConfig]) => {
                    const [methodType, endpoint] = resolveEndpointFromMethod(
                      endpointOrMethodConfig
                    );

                    return (
                      <Endpoint
                        key={`${methodName}-${endpoint}`}
                        method={methodType.toUpperCase()}
                        path={endpoint}
                        name={methodName}
                        withLink
                      />
                    );
                  }
                )}
              </Endpoints>
            )}
          </ExampleColumn>
        </Section>
      </Box>

      {Object.entries(methods).map(([methodName, endpointOrMethodConfig]) => {
        const [methodType, endpoint] = resolveEndpointFromMethod(
          endpointOrMethodConfig
        );

        const methodPath = `${currentPath}/${methodName}`;
        const methodMdPath = `/${basePath}${currentPath}/${methodName}.md`;

        return (
          <Box key={`${methodName}-${endpoint}`} data-resource-path={methodPath}>
            <ApiReferenceMethodClient
              methodName={methodName}
              methodType={methodType as "get" | "post" | "put" | "delete"}
              endpoint={endpoint}
              path={methodPath}
              mdPath={methodMdPath}
            />
          </Box>
        );
      })}

      {Object.entries(resource.subresources ?? {}).map(
        ([subresourceName, subresource]) => {
          return (
            <ApiReferenceSectionClient
              key={subresourceName}
              resourceName={subresourceName}
              resource={subresource}
              path={`${currentPath}/${subresourceName}`}
              basePath={basePath}
            />
          );
        }
      )}

      {Object.entries(models).map(([modelName, modelReference]) => {
        const schema: OpenAPIV3.SchemaObject | undefined = JSONPointer.get(
          openApiSpec,
          modelReference.replace("#", "")
        );

        if (!schema) {
          return null;
        }

        const schemaPath = `${currentPath}/schemas/${modelName}`;
        const schemaMdPath = `/${basePath}${currentPath}/schemas/${modelName}.md`;

        return (
          <Box key={modelName} data-resource-path={schemaPath}>
            <Section title={schema.title} path={schemaPath} mdPath={schemaMdPath}>
              <ContentColumn>
                {schema.description && (
                  <Markdown>{schema.description}</Markdown>
                )}

                <Heading
                  as="h3"
                  size="3"
                  weight="medium"
                  borderBottom="px"
                  borderColor="gray-3"
                  pb="2"
                >
                  Attributes
                </Heading>
                <SchemaProperties schema={schema} hideRequired />
              </ContentColumn>
              <ExampleColumn>
                <CodeBlock
                  title={schema.title}
                  language="json"
                  languages={["json"]}
                >
                  {JSON.stringify(schema.example, null, 2)}
                </CodeBlock>
              </ExampleColumn>
            </Section>
          </Box>
        );
      })}
    </>
  );
}
