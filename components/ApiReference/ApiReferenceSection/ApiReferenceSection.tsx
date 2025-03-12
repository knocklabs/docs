import React from "react";
import type { OpenAPIV3 } from "@scalar/openapi-types";
import ApiReferenceMethod from "../ApiReferenceMethod";
import { ContentColumn, ExampleColumn, Section } from "../../ApiSections";
import Markdown from "react-markdown";
import { Endpoint, Endpoints } from "../../Endpoints";
import JSONPointer from "jsonpointer";
import { CodeBlock } from "../../CodeBlock";
import { Attribute, Attributes } from "../../Attributes";
import { StainlessResource } from "../../../lib/openApiSpec";
import { useApiReference } from "../ApiReferenceContext";
import { resolveEndpointFromMethod } from "../helpers";
import { SchemaProperties } from "../SchemaProperties";

type Props = {
  resourceName: string;
  resource: StainlessResource;
};

function ApiReferenceSection({ resourceName, resource }: Props) {
  const { openApiSpec } = useApiReference();
  const methods = resource.methods || {};
  const models = resource.models || {};

  return (
    <>
      <div data-resource-path={`/${resourceName}`}>
        <Section title={resource.name} slug={resourceName}>
          <ContentColumn>
            <Markdown>{resource.description}</Markdown>
          </ContentColumn>
          <ExampleColumn>
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
            data-resource-path={`/${resourceName}/${methodName}`}
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
            data-resource-path={`/${resourceName}/schemas/${modelName}`}
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
    </>
  );
}

export default ApiReferenceSection;
