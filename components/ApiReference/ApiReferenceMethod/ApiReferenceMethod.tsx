import { Attribute, Attributes } from "../../Attributes";
import { Endpoint } from "../../Endpoints";
import { ContentColumn, ExampleColumn, Section } from "../../ApiSections";
import { CodeBlock } from "../../CodeBlock";
import { useApiReference } from "../ApiReferenceContext";
import type { OpenAPIV3 } from "@scalar/openapi-types";
type Props = {
  methodName: string;
  methodType: "get" | "post" | "put" | "delete";
  endpoint: string;
};

function ApiReferenceMethod({ methodName, methodType, endpoint }: Props) {
  const { openApiSpec } = useApiReference();
  const method = openApiSpec.paths?.[endpoint]?.[methodType];

  if (!method) {
    return null;
  }

  const parameters = method.parameters || [];
  const responses = method.responses || {};
  const response = responses[Object.keys(responses)[0]];

  const pathParameters = parameters.filter((p) => p.in === "path");
  const queryParameters = parameters.filter((p) => p.in === "query");
  const responseSchema: OpenAPIV3.SchemaObject | undefined =
    response?.content?.["application/json"]?.schema;
  const requestBody: OpenAPIV3.SchemaObject | undefined =
    method.requestBody?.content?.["application/json"]?.schema;

  return (
    <Section title={method.summary} slug={method.summary}>
      <ContentColumn>
        <p>{method.description}</p>

        <h3>Endpoint</h3>

        <Endpoint
          method={methodType.toUpperCase()}
          path={endpoint}
          name={methodName}
        />

        {pathParameters.length > 0 && (
          <>
            <h3>Path parameters</h3>

            <Attributes>
              {pathParameters.map((maybeParameter) => {
                const parameter = maybeParameter as OpenAPIV3.ParameterObject;

                return (
                  <Attribute
                    key={parameter.name!}
                    name={parameter.name!}
                    type={parameter.schema?.type}
                    description={parameter.description || ""}
                    isRequired={parameter.required}
                  />
                );
              })}
            </Attributes>
          </>
        )}

        {queryParameters.length > 0 && (
          <>
            <h3>Query parameters</h3>

            <Attributes>
              {queryParameters.map((maybeParameter) => {
                const parameter = maybeParameter as OpenAPIV3.ParameterObject;

                return (
                  <Attribute
                    key={parameter.name!}
                    name={parameter.name!}
                    type={parameter.schema?.type}
                    description={parameter.description || ""}
                    isRequired={parameter.required}
                  />
                );
              })}
            </Attributes>
          </>
        )}

        {requestBody && (
          <>
            <h3>Request body</h3>

            <Attributes>
              {Object.entries(requestBody.properties || {}).map(
                ([propertyName, property]) => (
                  <Attribute
                    key={propertyName}
                    name={propertyName}
                    type={property.type}
                    description={property.description}
                  />
                ),
              )}
            </Attributes>
          </>
        )}

        <h3>Returns</h3>
        <span>{responseSchema?.title}</span>
      </ContentColumn>
      <ExampleColumn>
        <CodeBlock
          title={`${method.summary} (example)`}
          language="node"
          languages={["node", "python", "go", "ruby", "php"]}
        >
          {method["x-stainless-snippets"].typescript}
        </CodeBlock>

        <CodeBlock title="Response" language="json" languages={["json"]}>
          {JSON.stringify(responseSchema?.example, null, 2)}
        </CodeBlock>
      </ExampleColumn>
    </Section>
  );
}

export default ApiReferenceMethod;
