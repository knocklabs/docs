import React from "react";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import ApiReferenceMethod from "../ApiReferenceMethod";
import { ContentColumn, ExampleColumn, Section } from "../../ui/ApiSections";
import Markdown from "react-markdown";
import { Endpoint, Endpoints } from "../../ui/Endpoints";
import JSONPointer from "jsonpointer";
import { CodeBlock } from "../../CodeBlock";
import { StainlessResource } from "../../../lib/openApiSpec";
import { useApiReference } from "../ApiReferenceContext";
import { resolveEndpointFromMethod } from "../helpers";
import { SchemaProperties } from "../SchemaProperties";
import { Box } from "@telegraph/layout";
import { Heading } from "@telegraph/typography";

type Props = {
  resourceName: string;
  resource: StainlessResource;
  path?: string;
};

function ApiReferenceSection({ resourceName, resource, path }: Props) {
  const { openApiSpec } = useApiReference();
  const methods = resource.methods || {};
  const models = resource.models || {};
  const basePath = path ?? `/${resourceName}`;

  return (
    <>
      <Box data-resource-path={basePath}>
        <Section title={resource.name} path={basePath}>
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

        const path = `${basePath}/${methodName}`;

        return (
          <Box
            key={`${methodName}-${endpoint}`}
            data-resource-path={path}
          >
            <ApiReferenceMethod
              methodName={methodName}
              methodType={methodType as "get" | "post" | "put" | "delete"}
              endpoint={endpoint}
              path={path}
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

        const path = `${basePath}/schemas/${modelName}`;

        return (
          <Box
            key={modelName}
            data-resource-path={path}
          >
            <Section title={schema.title} path={path}>
              <ContentColumn>
                {schema.description && (
                  <Markdown>{schema.description}</Markdown>
                )}

                <Heading as="h3" size="3" weight="medium" borderBottom="px" borderColor="gray-3" pb="2">
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
