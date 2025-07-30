import React from "react";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import ApiReferenceMethod from "../ApiReferenceMethod";
import { ContentColumn, ExampleColumn, Section } from "../../ApiSections";
import Markdown from "react-markdown";
import { Endpoint, Endpoints } from "../../Endpoints";
import JSONPointer from "jsonpointer";
import { CodeBlock } from "../../CodeBlock";
import { StainlessResource } from "../../../../lib/openApiSpec";
import { useApiReference } from "../ApiReferenceContext";
import { resolveEndpointFromMethod } from "../helpers";
import { SchemaProperties } from "../SchemaProperties";
import { Box } from "@telegraph/layout";
import { Heading } from "@telegraph/typography";
import { useRouter } from "next/router";

type Props = {
  resourceName: string;
  resource: StainlessResource;
  path?: string;
};

function ApiReferenceSection({ resourceName, resource, path }: Props) {
  const { openApiSpec } = useApiReference();
  const router = useRouter();
  const methods = resource.methods || {};
  const models = resource.models || {};
  const basePath = path ?? `/${resourceName}`;

  // Detect which API surface we're on based on the current route
  const apiSurface = router.pathname.startsWith('/mapi-reference') ? 'mapi-reference' : 'api-reference';

  // Generate markdown path for the resource overview
  const resourceMdPath = `/${apiSurface}${basePath}/index.md`;

  return (
    <>
      <Box data-resource-path={basePath}>
        <Section
          title={resource.name}
          path={basePath}
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
        const [methodType, endpoint] = resolveEndpointFromMethod(
          endpointOrMethodConfig,
        );

        const methodPath = `${basePath}/${methodName}`;
        const methodMdPath = `/${apiSurface}${basePath}/${methodName}.md`;

        return (
          <Box key={`${methodName}-${endpoint}`} data-resource-path={methodPath}>
            <ApiReferenceMethod
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
            <ApiReferenceSection
              key={subresourceName}
              resourceName={subresourceName}
              resource={subresource}
              path={`${basePath}/${subresourceName}`}
            />
          );
        },
      )}

      {Object.entries(models).map(([modelName, modelReference]) => {
        const schema: OpenAPIV3.SchemaObject | undefined = JSONPointer.get(
          openApiSpec,
          modelReference.replace("#", ""),
        );

        if (!schema) {
          return null;
        }

        const schemaPath = `${basePath}/schemas/${modelName}`;
        const schemaMdPath = `/${apiSurface}${basePath}/schemas/${modelName}.md`;

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

export default ApiReferenceSection;
