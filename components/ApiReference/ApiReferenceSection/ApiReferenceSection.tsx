import React from "react";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import ApiReferenceMethod from "../ApiReferenceMethod";
import { ContentColumn, ExampleColumn, Section } from "../../ApiSections";
import Markdown from "react-markdown";
import { Endpoint, Endpoints } from "../../Endpoints";
import JSONPointer from "jsonpointer";
import { CodeBlock } from "../../CodeBlock";
import { StainlessResource } from "../../../lib/openApiSpec";
import { useApiReference } from "../ApiReferenceContext";
import { resolveEndpointFromMethod } from "../helpers";
import { SchemaProperties } from "../SchemaProperties";

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
      <div data-resource-path={basePath}>
        <Section title={resource.name} slug={resourceName}>
          <ContentColumn>
            <Markdown>{resource.description}</Markdown>
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
      </div>

      {Object.entries(methods).map(([methodName, endpointOrMethodConfig]) => {
        const [methodType, endpoint] = resolveEndpointFromMethod(
          endpointOrMethodConfig,
        );

        return (
          <div
            key={`${methodName}-${endpoint}`}
            data-resource-path={`${basePath}/${methodName}`}
          >
            <ApiReferenceMethod
              methodName={methodName}
              methodType={methodType as "get" | "post" | "put" | "delete"}
              endpoint={endpoint}
            />
          </div>
        );
      })}

      {Object.entries(models).map(([modelName, modelReference]) => {
        const schema: OpenAPIV3.SchemaObject | undefined = JSONPointer.get(
          openApiSpec,
          modelReference.replace("#", ""),
        );

        if (!schema) {
          return null;
        }

        return (
          <div
            key={modelName}
            data-resource-path={`${basePath}/schemas/${modelName}`}
          >
            <Section title={schema.title} slug={modelName}>
              <ContentColumn>
                <Markdown>{schema.description}</Markdown>

                {schema.properties && (
                  <>
                    <h3 className="!text-base font-medium">Attributes</h3>
                    <SchemaProperties schema={schema} />
                  </>
                )}
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
          </div>
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
    </>
  );
}

export default ApiReferenceSection;
