import React from "react";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import Markdown from "react-markdown";
import { Box } from "@telegraph/layout";
import { Heading } from "@telegraph/typography";
import { CodeBlock } from "../../../../components/ui/CodeBlock";
import { Endpoint, Endpoints } from "../../../../components/ui/Endpoints";
import { ContentColumn, ExampleColumn, Section } from "../../../../components/ui/ApiSections";
import { getOpenApiSpec, getStainlessSpec } from "../../../../lib/openapi/loader";
import {
  resolveEndpoint,
  getOperation,
  getSchemaByRef,
  getResourceMethods,
  getResourceSchemas,
  buildSchemaReferences,
} from "../../../../lib/openapi/helpers";
import type { SpecName, StainlessResource } from "../../../../lib/openapi/types";
import { MethodContent } from "./method-content";
import { SchemaPropertiesServer } from "./schema-properties-server";

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

  return (
    <>
      <Box data-resource-path={resourcePath}>
        <Section
          title={resource.name || resourceName}
          path={resourcePath}
          mdPath={`/${apiSurface}${resourcePath}/index.md`}
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
                    const [methodType, endpoint] = resolveEndpoint(
                      endpointOrMethodConfig,
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
                  },
                )}
              </Endpoints>
            )}
          </ExampleColumn>
        </Section>
      </Box>

      {Object.entries(methods).map(([methodName, endpointOrMethodConfig]) => {
        const [methodType, endpoint] = resolveEndpoint(endpointOrMethodConfig);
        const methodPath = `${resourcePath}/${methodName}`;
        const methodMdPath = `/${apiSurface}${resourcePath}/${methodName}.md`;

        return (
          <Box key={`${methodName}-${endpoint}`} data-resource-path={methodPath}>
            <MethodContent
              specName={specName}
              methodName={methodName}
              methodType={methodType as "get" | "post" | "put" | "delete"}
              endpoint={endpoint}
              path={methodPath}
              mdPath={methodMdPath}
              baseUrl={baseUrl}
              schemaReferences={schemaReferences}
            />
          </Box>
        );
      })}

      {Object.entries(resource.subresources ?? {}).map(
        ([subresourceName, subresource]) => {
          return (
            <SubResourceSection
              key={subresourceName}
              specName={specName}
              resource={subresource}
              resourceName={subresourceName}
              basePath={basePath}
              baseUrl={baseUrl}
              schemaReferences={schemaReferences}
              path={`${resourcePath}/${subresourceName}`}
            />
          );
        },
      )}

      {Object.entries(models).map(([modelName, modelReference]) => {
        const schema = getSchemaByRef(openApiSpec, modelReference);

        if (!schema) {
          return null;
        }

        const schemaPath = `${resourcePath}/schemas/${modelName}`;
        const schemaMdPath = `/${apiSurface}${resourcePath}/schemas/${modelName}.md`;

        return (
          <Box key={modelName} data-resource-path={schemaPath}>
            <Section
              title={schema.title}
              path={schemaPath}
              mdPath={schemaMdPath}
            >
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
                <SchemaPropertiesServer
                  schema={schema}
                  schemaReferences={schemaReferences}
                  hideRequired
                />
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

interface SubResourceSectionProps {
  specName: SpecName;
  resource: StainlessResource;
  resourceName: string;
  basePath: string;
  baseUrl: string;
  schemaReferences: Record<string, string>;
  path: string;
}

async function SubResourceSection({
  specName,
  resource,
  resourceName,
  basePath,
  baseUrl,
  schemaReferences,
  path,
}: SubResourceSectionProps) {
  const openApiSpec = await getOpenApiSpec(specName);

  const methods = resource.methods || {};
  const models = resource.models || {};
  const apiSurface = basePath.replace("/", "");

  return (
    <>
      <Box data-resource-path={path}>
        <Section
          title={resource.name || resourceName}
          path={path}
          mdPath={`/${apiSurface}${path}/index.md`}
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
                    const [methodType, endpoint] = resolveEndpoint(
                      endpointOrMethodConfig,
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
                  },
                )}
              </Endpoints>
            )}
          </ExampleColumn>
        </Section>
      </Box>

      {Object.entries(methods).map(([methodName, endpointOrMethodConfig]) => {
        const [methodType, endpoint] = resolveEndpoint(endpointOrMethodConfig);
        const methodPath = `${path}/${methodName}`;
        const methodMdPath = `/${apiSurface}${path}/${methodName}.md`;

        return (
          <Box key={`${methodName}-${endpoint}`} data-resource-path={methodPath}>
            <MethodContent
              specName={specName}
              methodName={methodName}
              methodType={methodType as "get" | "post" | "put" | "delete"}
              endpoint={endpoint}
              path={methodPath}
              mdPath={methodMdPath}
              baseUrl={baseUrl}
              schemaReferences={schemaReferences}
            />
          </Box>
        );
      })}

      {Object.entries(models).map(([modelName, modelReference]) => {
        const schema = getSchemaByRef(openApiSpec, modelReference);

        if (!schema) {
          return null;
        }

        const schemaPath = `${path}/schemas/${modelName}`;
        const schemaMdPath = `/${apiSurface}${path}/schemas/${modelName}.md`;

        return (
          <Box key={modelName} data-resource-path={schemaPath}>
            <Section
              title={schema.title}
              path={schemaPath}
              mdPath={schemaMdPath}
            >
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
                <SchemaPropertiesServer
                  schema={schema}
                  schemaReferences={schemaReferences}
                  hideRequired
                />
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
